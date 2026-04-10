import { defineStore } from 'pinia'

const API_BASE = '/api'

async function requestJson(path, options) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  return response.json()
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toDateKey(spentAt) {
  return typeof spentAt === 'string' ? spentAt.slice(0, 10) : ''
}

function toTimeKey(spentAt) {
  return typeof spentAt === 'string' && spentAt.includes('T') ? spentAt.slice(11, 16) : ''
}

function toMonthKey(date = new Date()) {
  const nextDate = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(nextDate.getTime())) return ''

  const year = nextDate.getFullYear()
  const month = String(nextDate.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    memberId: null,
    budget: 0,
    targetStockId: null,
    targetQuantity: 0,
    stocks: [],
    prices: [],
    categories: [],
    expenses: [],
    isLoading: false,
    error: null,
    initialized: false,
  }),

  getters: {
    categoryById: (state) => new Map(state.categories.map((category) => [category.id, category])),

    latestPriceByStockId: (state) => {
      return state.prices.reduce((map, price) => {
        const previous = map.get(price.stockId)
        if (!previous || new Date(price.recordedAt) > new Date(previous.recordedAt)) {
          map.set(price.stockId, price)
        }
        return map
      }, new Map())
    },

    targetStock(state) {
      return state.stocks.find((stock) => stock.id === state.targetStockId) ?? null
    },

    targetStockName() {
      return this.targetStock?.name ?? ''
    },

    targetStockTicker() {
      return this.targetStock?.ticker ?? this.targetStock?.symbol ?? ''
    },

    targetStockRealTicker() {
      return this.targetStock?.realTicker ?? null
    },

    targetStockPrice() {
      return this.latestPriceByStockId.get(this.targetStockId)?.price ?? 0
    },

    stockOptions(state) {
      return state.stocks.map((stock) => ({
        ...stock,
        ticker: stock.ticker ?? stock.symbol ?? String(stock.id),
        realTicker: stock.realTicker ?? null,
        price: this.latestPriceByStockId.get(stock.id)?.price ?? 0,
      }))
    },

    currentMonthKey: () => toMonthKey(),

    totalExpense: (state) => state.expenses.reduce((sum, expense) => sum + expense.amount, 0),

    monthlyExpenseTotal() {
      return this.getMonthlyExpenseTotal(this.currentMonthKey)
    },

    expensesByDate(state) {
      return state.expenses.reduce((groups, expense) => {
        if (!groups[expense.date]) {
          groups[expense.date] = []
        }
        groups[expense.date].push(expense)
        return groups
      }, {})
    },

    getExpensesByDate() {
      return (date) => this.expensesByDate[date] ?? []
    },

    getExpensesByMonth() {
      return (monthKey) =>
        this.expenses.filter(
          (expense) => typeof expense.date === 'string' && expense.date.startsWith(monthKey),
        )
    },

    getMonthlyExpenseTotal() {
      return (monthKey) =>
        this.getExpensesByMonth(monthKey).reduce((sum, expense) => sum + expense.amount, 0)
    },

    getMonthlyRemainingBudget(state) {
      return (monthKey) => state.budget - this.getMonthlyExpenseTotal(monthKey)
    },

    getMonthlyFillPercentage(state) {
      return (monthKey) => {
        if (state.budget <= 0) return 0
        const ratio = (this.getMonthlyRemainingBudget(monthKey) / state.budget) * 100
        return Math.min(Math.max(ratio, 0), 100)
      }
    },

    remainingBudget(state) {
      return state.budget - this.monthlyExpenseTotal
    },

    fillPercentage(state) {
      if (state.budget <= 0) return 0
      const ratio = (this.remainingBudget / state.budget) * 100
      return Math.min(Math.max(ratio, 0), 100)
    },

    guidelinePercentage(state) {
      if (state.budget <= 0 || this.targetTotalAmount <= 0) return 0
      const ratio = (this.targetTotalAmount / state.budget) * 100
      return Math.min(Math.max(ratio, 0), 100)
    },

    dailyAverage: (state) => {
      if (state.budget <= 0) return 0
      return Math.floor(state.budget / 30)
    },

    targetTotalAmount(state) {
      return this.targetStockPrice * state.targetQuantity
    },

    securedQuantity() {
      if (this.targetStockPrice <= 0) return 0
      return Number((Math.max(this.remainingBudget, 0) / this.targetStockPrice).toFixed(2))
    },

    progressRate(state) {
      if (state.targetQuantity <= 0) return 0
      return Math.min(100, Math.round((this.securedQuantity / state.targetQuantity) * 100))
    },

    recentExpenses(state) {
      return [...state.expenses].sort((a, b) => new Date(b.spentAt) - new Date(a.spentAt))
    },

    getDailyReport() {
      return (date) => {
        const dayExpenses = this.getExpensesByDate(date)
        const totalSpent = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        const stockPrice = this.targetStockPrice
        const diffFromAverage = this.dailyAverage - totalSpent
        const stockQuantity =
          stockPrice > 0 ? Number((diffFromAverage / stockPrice).toFixed(2)) : 0
        const progressRate =
          stockPrice > 0
            ? Math.min(Math.max(Math.round((diffFromAverage / stockPrice) * 100), 0), 100)
            : 0

        return {
          securedQuantity: stockQuantity,
          stockName: this.targetStockName || '주식',
          savedAmount: Math.abs(diffFromAverage),
          isSaved: diffFromAverage >= 0,
          progressRate,
        }
      }
    },
  },

  actions: {
    normalizeExpense(expense) {
      const category = this.categoryById.get(expense.categoryId)

      return {
        ...expense,
        amount: toNumber(expense.amount),
        category: expense.category ?? category?.name ?? '기타',
        categoryImageUrl:
          expense.categoryImageUrl ?? category?.imageUrl ?? '/images/categories/shopping.png',
        date: expense.date ?? toDateKey(expense.spentAt),
        time: expense.time ?? toTimeKey(expense.spentAt),
        memo: expense.memo ?? '',
      }
    },

    applyMember(member) {
      this.memberId = member?.id ?? null
      this.budget = toNumber(member?.monthlyBudget)
      this.targetStockId = member?.targetStockId ?? null
      this.targetQuantity = toNumber(member?.targetQuantity)
    },

    resolveMember(members, requestedMemberId = this.memberId) {
      if (
        requestedMemberId !== null &&
        requestedMemberId !== undefined &&
        requestedMemberId !== ''
      ) {
        const matched = members.find((member) => String(member.id) === String(requestedMemberId))
        if (matched) return matched
      }

      return null
    },

    async loadReferenceData() {
      const [stocks, prices, categories] = await Promise.all([
        requestJson('/stocks'),
        requestJson('/prices'),
        requestJson('/categories'),
      ])

      this.stocks = stocks
      this.prices = prices
      this.categories = categories
    },

    async loadExpenses(memberId = this.memberId) {
      const expenses = await requestJson('/expenses')
      this.expenses = expenses
        .filter((expense) => String(expense.memberId) === String(memberId))
        .map((expense) => this.normalizeExpense(expense))
        .sort((a, b) => new Date(b.spentAt) - new Date(a.spentAt))
    },

    async initializeBudgetState(memberId = null) {
      if (this.isLoading) return

      this.isLoading = true
      this.error = null

      try {
        const members = await requestJson('/members')
        await this.loadReferenceData()

        const member = this.resolveMember(members, memberId ?? this.memberId)
        if (!member) {
          this.applyMember(null)
          this.expenses = []
          this.initialized = true
          return
        }

        this.applyMember(member)
        await this.loadExpenses(member.id)
        this.initialized = true
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateGoalSetup({ monthlyBudget, targetStockId, targetQuantity }) {
      if (!this.memberId) {
        await this.initializeBudgetState()
      }

      if (!this.memberId) {
        throw new Error('Cannot update goal setup without a selected member')
      }

      const payload = {
        monthlyBudget: toNumber(monthlyBudget),
        targetStockId,
        targetQuantity: toNumber(targetQuantity),
      }

      const member = await requestJson(`/members/${this.memberId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })

      this.applyMember(member)
      return member
    },

    async addExpense(payload) {
      if (!this.memberId) {
        await this.initializeBudgetState()
      }

      if (!this.memberId) {
        throw new Error('Cannot add expense without a selected member')
      }

      const category =
        this.categories.find((item) => item.id === payload.categoryId) ??
        this.categories.find((item) => item.name === payload.category)

      const spentAt =
        payload.spentAt ?? `${payload.date}T${payload.time || new Date().toTimeString().slice(0, 5)}:00`

      const expense = await requestJson('/expenses', {
        method: 'POST',
        body: JSON.stringify({
          memberId: this.memberId,
          categoryId: category?.id ?? payload.categoryId ?? null,
          amount: toNumber(payload.amount),
          memo: payload.memo || '직접 입력',
          spentAt,
        }),
      })

      const normalizedExpense = this.normalizeExpense(expense)
      this.expenses.unshift(normalizedExpense)
      return normalizedExpense
    },
  },
})
