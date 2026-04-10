export const BUDGET_EXCEEDED_ERROR_CODE = 'BUDGET_EXCEEDED'

export class BudgetExceededError extends Error {
  constructor(message) {
    super(message)
    this.name = 'BudgetExceededError'
    this.code = BUDGET_EXCEEDED_ERROR_CODE
  }
}

export function toFiniteNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function exceedsBudget(amount, budget) {
  const numericAmount = toFiniteNumber(amount)
  const numericBudget = toFiniteNumber(budget)

  if (numericAmount === null || numericBudget === null) return false

  return numericAmount > numericBudget
}

export function calculateStockTargetAmount({ stockPrice, targetQuantity }) {
  return (toFiniteNumber(stockPrice) ?? 0) * (toFiniteNumber(targetQuantity) ?? 0)
}

export function validateAmountWithinBudget({ amount, budget, message }) {
  if (exceedsBudget(amount, budget)) {
    throw new BudgetExceededError(message)
  }
}

export function isBudgetExceededError(error) {
  return error?.code === BUDGET_EXCEEDED_ERROR_CODE
}
