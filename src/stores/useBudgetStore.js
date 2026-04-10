import { defineStore } from 'pinia'

export const useBudgetStore = defineStore('budget', {
  // 1. State: 전역으로 관리할 데이터 원본
  state: () => ({
    budget: 0, // 총 예산 (지난달 생활비)
    targetStockName: '', // 목표 주식명
    targetStockPrice: 0, // 목표 주식 1주 가격
    targetQuantity: 0, // 목표 수량
    expenses: [], // 지출 내역 배열
  }),

  // 2. Getters: State를 기반으로 자동 계산되는 값들 (반응형)
  getters: {
    // 총 지출액
    totalExpense: (state) => {
      return state.expenses.reduce((sum, exp) => sum + exp.amount, 0)
    },

    // 목표 주식 총액 (가이드라인 선의 기준이 될 금액)
    targetTotalAmount: (state) => {
      return state.targetStockPrice * state.targetQuantity
    },

    // 남은 예산
    remainingBudget(state) {
      return state.budget - this.totalExpense
    },

    // 꿀통 채워진 비율 (0 ~ 100%)
    fillPercentage(state) {
      if (state.budget <= 0) return 0
      const ratio = (this.remainingBudget / state.budget) * 100
      return Math.min(Math.max(ratio, 0), 100)
    },

    // 가이드라인 비율 (0 ~ 100%)
    guidelinePercentage(state) {
      if (state.budget <= 0) return 0
      return (this.targetTotalAmount / state.budget) * 100
    },

    // 전월 일일 평균 지출액 (한 달 30일 기준)
    dailyAverage: (state) => {
      if (state.budget <= 0) return 0
      return Math.floor(state.budget / 30)
    },
  },

  // 3. Actions: State를 변경하는 함수들
  actions: {
    // Setup 화면에서 호출하여 목표 설정
    setGoalSetup(budget, stockName, stockPrice, quantity) {
      this.budget = budget
      this.targetStockName = stockName
      this.targetStockPrice = stockPrice
      this.targetQuantity = quantity
    },

    // 캘린더나 Home 화면에서 지출 추가
    addExpense(expense) {
      // unshift를 쓰면 최신 지출 내역이 배열의 맨 앞(위쪽)에 추가됩니다.
      this.expenses.unshift(expense)
    },
  },
})
