import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(scriptPath), '..');
const dbPath = path.join(rootDir, 'db.json');

const raw = fs.readFileSync(dbPath, 'utf8');
const db = JSON.parse(raw);

const issues = [];

const weekdayOrder = [
  { label: '\uC6D4', dayIndex: 1 },
  { label: '\uD654', dayIndex: 2 },
  { label: '\uC218', dayIndex: 3 },
  { label: '\uBAA9', dayIndex: 4 },
  { label: '\uAE08', dayIndex: 5 },
  { label: '\uD1A0', dayIndex: 6 },
  { label: '\uC77C', dayIndex: 0 },
];

function assert(condition, message) {
  if (!condition) {
    issues.push(message);
  }
}

function uniqueById(records, label) {
  const seen = new Set();
  for (const record of records) {
    assert(record && Object.hasOwn(record, 'id'), `${label} record is missing id`);
    if (seen.has(record.id)) {
      issues.push(`${label} has duplicate id: ${record.id}`);
    }
    seen.add(record.id);
  }
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function roundToTwo(value) {
  return Math.round(value * 100) / 100;
}

const members = db.members ?? [];
const categories = db.categories ?? [];
const stocks = db.stocks ?? [];
const prices = db.prices ?? [];
const expenses = db.expenses ?? [];
const reports = db.reports ?? [];

uniqueById(members, 'members');
uniqueById(categories, 'categories');
uniqueById(stocks, 'stocks');
uniqueById(prices, 'prices');
uniqueById(expenses, 'expenses');
uniqueById(reports, 'reports');

const memberIds = new Set(members.map((member) => member.id));
const categoryIds = new Set(categories.map((category) => category.id));
const stockIds = new Set(stocks.map((stock) => stock.id));
const stockTickers = new Set();
const realTickerPattern = /^\d{6}$/;

const memberIdTypes = [...new Set(members.map((member) => typeof member.id))];
assert(
  memberIdTypes.length === 1 && memberIdTypes[0] === 'number',
  `members.id must use one numeric type, got: ${memberIdTypes.join(', ') || 'none'}`,
);

for (const expense of expenses) {
  assert(memberIds.has(expense.memberId), `expense ${expense.id} points to missing member ${expense.memberId}`);
  assert(
    categoryIds.has(expense.categoryId),
    `expense ${expense.id} points to missing category ${expense.categoryId}`,
  );
  assert(typeof expense.amount === 'number', `expense ${expense.id} amount must be a number`);
  assert(typeof expense.spentAt === 'string', `expense ${expense.id} spentAt must be a string`);
}

for (const price of prices) {
  assert(stockIds.has(price.stockId), `price ${price.id} points to missing stock ${price.stockId}`);
  assert(typeof price.price === 'number', `price ${price.id} price must be a number`);
}

for (const stock of stocks) {
  assert(typeof stock.name === 'string' && stock.name.length > 0, `stock ${stock.id} name must be a non-empty string`);
  assert(
    typeof stock.ticker === 'string' && stock.ticker.length > 0,
    `stock ${stock.id} ticker must be a non-empty string`,
  );
  assert(!stockTickers.has(stock.ticker), `stocks has duplicate ticker: ${stock.ticker}`);
  stockTickers.add(stock.ticker);
  assert(
    stock.realTicker === null || (typeof stock.realTicker === 'string' && realTickerPattern.test(stock.realTicker)),
    `stock ${stock.id} realTicker must be null or a 6-digit string`,
  );
}

for (const report of reports) {
  const member = members.find((item) => item.id === report.memberId);
  assert(Boolean(member), `report ${report.id} points to missing member ${report.memberId}`);
  assert(stockIds.has(report.stockId), `report ${report.id} points to missing stock ${report.stockId}`);

  if (!member) {
    continue;
  }

  assert(report.memberName === member.name, `report ${report.id} memberName does not match member.name`);
  assert(report.ageBand === member.ageBand, `report ${report.id} ageBand does not match member.ageBand`);
  assert(
    report.monthlyBudget === member.monthlyBudget,
    `report ${report.id} monthlyBudget does not match member.monthlyBudget`,
  );
  assert(report.stockId === member.targetStockId, `report ${report.id} stockId does not match member.targetStockId`);
  assert(
    report.targetQuantity === member.targetQuantity,
    `report ${report.id} targetQuantity does not match member.targetQuantity`,
  );

  const monthlyExpenses = expenses.filter(
    (expense) => expense.memberId === report.memberId && expense.spentAt.startsWith(report.targetMonth),
  );
  const monthlyExpenseTotal = sum(monthlyExpenses.map((expense) => expense.amount));

  assert(
    report.monthlyExpenseTotal === monthlyExpenseTotal,
    `report ${report.id} monthlyExpenseTotal is ${report.monthlyExpenseTotal}, expected ${monthlyExpenseTotal}`,
  );

  assert(
    report.savedAmount === report.monthlyBudget - report.monthlyExpenseTotal,
    `report ${report.id} savedAmount does not match budget minus expense total`,
  );

  const expectedDailyExpenses = weekdayOrder.map(({ label, dayIndex }) => ({
    label,
    amount: sum(
      monthlyExpenses
        .filter((expense) => new Date(expense.spentAt).getDay() === dayIndex)
        .map((expense) => expense.amount),
    ),
  }));

  assert(
    Array.isArray(report.dailyExpenses) && report.dailyExpenses.length === weekdayOrder.length,
    `report ${report.id} dailyExpenses must have ${weekdayOrder.length} entries`,
  );

  for (const [index, expected] of expectedDailyExpenses.entries()) {
    const actual = report.dailyExpenses[index];
    assert(Boolean(actual), `report ${report.id} dailyExpenses[${index}] is missing`);
    if (!actual) {
      continue;
    }
    assert(
      actual.day === expected.label,
      `report ${report.id} dailyExpenses[${index}].day must be ${expected.label}, got ${actual.day}`,
    );
    assert(
      actual.amount === expected.amount,
      `report ${report.id} dailyExpenses[${index}].amount is ${actual.amount}, expected ${expected.amount}`,
    );
  }

  const expectedTopCategories = [...new Map(
    monthlyExpenses.map((expense) => [
      expense.categoryId,
      sum(monthlyExpenses.filter((item) => item.categoryId === expense.categoryId).map((item) => item.amount)),
    ]),
  ).entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  assert(
    Array.isArray(report.topCategories) && report.topCategories.length === expectedTopCategories.length,
    `report ${report.id} topCategories must have ${expectedTopCategories.length} entries`,
  );

  for (const [index, [categoryId, amount]] of expectedTopCategories.entries()) {
    const actual = report.topCategories[index];
    const category = categories.find((item) => item.id === categoryId);
    assert(Boolean(actual), `report ${report.id} topCategories[${index}] is missing`);
    if (!actual || !category) {
      continue;
    }
    assert(actual.rank === index + 1, `report ${report.id} topCategories[${index}] rank mismatch`);
    assert(actual.categoryId === categoryId, `report ${report.id} topCategories[${index}] categoryId mismatch`);
    assert(actual.categoryName === category.name, `report ${report.id} topCategories[${index}] categoryName mismatch`);
    assert(
      actual.categoryImageUrl === category.imageUrl,
      `report ${report.id} topCategories[${index}] categoryImageUrl mismatch`,
    );
    assert(actual.amount === amount, `report ${report.id} topCategories[${index}] amount mismatch`);
    assert(
      actual.additionalQuantity === roundToTwo(amount / report.stockPriceSnapshot),
      `report ${report.id} topCategories[${index}] additionalQuantity mismatch`,
    );
  }

  assert(
    report.securedQuantity === roundToTwo(report.savedAmount / report.stockPriceSnapshot),
    `report ${report.id} securedQuantity mismatch`,
  );
  assert(
    report.progressRate === Math.round((report.securedQuantity / report.targetQuantity) * 100),
    `report ${report.id} progressRate mismatch`,
  );
}

if (issues.length > 0) {
  console.error('DB validation failed.');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('DB validation passed.');
