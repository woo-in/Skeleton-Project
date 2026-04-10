import assert from 'node:assert/strict'
import test from 'node:test'

import {
  BudgetExceededError,
  calculateStockTargetAmount,
  exceedsBudget,
  validateAmountWithinBudget,
} from './budgetValidation.js'

test('exceedsBudget returns true only when amount is greater than budget', () => {
  assert.equal(exceedsBudget(1_000_001, 1_000_000), true)
  assert.equal(exceedsBudget(1_000_000, 1_000_000), false)
  assert.equal(exceedsBudget(999_999, 1_000_000), false)
})

test('validateAmountWithinBudget rejects values above budget', () => {
  assert.throws(
    () =>
      validateAmountWithinBudget({
        amount: 1_000_001,
        budget: 1_000_000,
        message: '생활비를 초과할 수 없습니다.',
      }),
    BudgetExceededError,
  )
})

test('validateAmountWithinBudget allows values equal to budget', () => {
  assert.doesNotThrow(() =>
    validateAmountWithinBudget({
      amount: 1_000_000,
      budget: 1_000_000,
      message: '생활비를 초과할 수 없습니다.',
    }),
  )
})

test('calculateStockTargetAmount multiplies stock price by target quantity', () => {
  assert.equal(calculateStockTargetAmount({ stockPrice: 210_500, targetQuantity: 2 }), 421_000)
})
