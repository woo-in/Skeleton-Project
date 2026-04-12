import { readFile } from 'node:fs/promises'
import path from 'node:path'

const RESERVED_QUERY_KEYS = new Set(['__resource', '__id'])
let dbCache = null

async function readDb() {
  if (dbCache) return dbCache

  const raw = await readFile(path.join(process.cwd(), 'db.json'), 'utf8')
  dbCache = JSON.parse(raw)
  return dbCache
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  })
}

function getPathParts(url) {
  const parts = url.pathname.split('/').filter(Boolean)
  const apiIndex = parts.indexOf('api')
  return parts.slice(apiIndex >= 0 ? apiIndex + 1 : 0)
}

function getRoute(url) {
  const [pathResource, pathId] = getPathParts(url)
  return {
    resourceName: url.searchParams.get('__resource') ?? pathResource,
    id: url.searchParams.get('__id') ?? pathId ?? null,
  }
}

function getNextId(records) {
  const numericIds = records.map((record) => Number(record?.id)).filter(Number.isFinite)
  return numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1
}

async function getBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

async function getArrayResource(url) {
  const { resourceName, id } = getRoute(url)
  const db = await readDb()

  if (!resourceName || !Object.hasOwn(db, resourceName) || !Array.isArray(db[resourceName])) {
    return { error: json({ error: 'Resource not found' }, 404) }
  }

  return {
    resourceName,
    id,
    records: db[resourceName],
  }
}

function filterRecords(records, searchParams) {
  const filters = Array.from(searchParams.entries()).filter(
    ([key]) => !RESERVED_QUERY_KEYS.has(key),
  )

  if (filters.length === 0) return records

  return records.filter((record) =>
    filters.every(([key, value]) => String(record?.[key]) === String(value)),
  )
}

async function handleGet(request) {
  const url = new URL(request.url)
  const { resourceName, id } = getRoute(url)
  const db = await readDb()

  if (!resourceName || !Object.hasOwn(db, resourceName)) {
    return json({ error: 'Resource not found' }, 404)
  }

  const resource = db[resourceName]

  if (id !== null) {
    if (!Array.isArray(resource)) {
      return json({ error: 'Resource not found' }, 404)
    }

    const record = resource.find((item) => String(item?.id) === String(id))
    return record ? json(record) : json({ error: 'Record not found' }, 404)
  }

  const body = Array.isArray(resource) ? filterRecords(resource, url.searchParams) : resource
  return json(body)
}

async function handlePost(request) {
  const url = new URL(request.url)
  const { records, error } = await getArrayResource(url)
  if (error) return error

  const body = await getBody(request)
  const record = {
    ...body,
    id: body?.id ?? getNextId(records),
  }

  records.push(record)
  return json(record, 201)
}

async function handlePatch(request) {
  const url = new URL(request.url)
  const { id, records, error } = await getArrayResource(url)
  if (error) return error
  if (id === null) return json({ error: 'Record id is required' }, 400)

  const index = records.findIndex((item) => String(item?.id) === String(id))
  if (index === -1) return json({ error: 'Record not found' }, 404)

  const body = await getBody(request)
  records[index] = {
    ...records[index],
    ...body,
    id: records[index].id,
  }

  return json(records[index])
}

async function handlePut(request) {
  const url = new URL(request.url)
  const { id, records, error } = await getArrayResource(url)
  if (error) return error
  if (id === null) return json({ error: 'Record id is required' }, 400)

  const index = records.findIndex((item) => String(item?.id) === String(id))
  if (index === -1) return json({ error: 'Record not found' }, 404)

  const body = await getBody(request)
  records[index] = {
    ...body,
    id: records[index].id,
  }

  return json(records[index])
}

async function handleDelete(request) {
  const url = new URL(request.url)
  const { id, records, error } = await getArrayResource(url)
  if (error) return error
  if (id === null) return json({ error: 'Record id is required' }, 400)

  const index = records.findIndex((item) => String(item?.id) === String(id))
  if (index === -1) return json({ error: 'Record not found' }, 404)

  const [deletedRecord] = records.splice(index, 1)
  return json(deletedRecord)
}

export default {
  async fetch(request) {
    try {
      switch (request.method) {
        case 'GET':
          return await handleGet(request)
        case 'POST':
          return await handlePost(request)
        case 'PATCH':
          return await handlePatch(request)
        case 'PUT':
          return await handlePut(request)
        case 'DELETE':
          return await handleDelete(request)
        default:
          return json({ error: 'Method not allowed' }, 405, {
            Allow: 'GET, POST, PATCH, PUT, DELETE',
          })
      }
    } catch (error) {
      return json({ error: 'Failed to read mock database' }, 500)
    }
  },
}
