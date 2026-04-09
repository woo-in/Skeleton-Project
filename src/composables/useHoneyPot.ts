import { ref, computed } from 'vue'

export function useHoneyPot(
  initialBudget = 100000, // ERD: members.budget (생활비 예산)
  initialTotalAmount = 0, // ERD: Expenses.amount 의 총합 (총 지출액)
  initialPrice = 40000, // ERD: Price.price (주식 현재 가격)
) {
  // 1. 상태 변수 (ERD 기반 명명)
  const budget = ref(initialBudget)
  const totalAmount = ref(initialTotalAmount)
  const price = ref(initialPrice)

  // 2. 남은 예산 (꿀의 진짜 양) = 예산(budget) - 총 지출(totalAmount)
  const remainingBudget = computed(() => budget.value - totalAmount.value)

  // 3. 꿀통 채움 비율 (남은 예산 / 예산 총액)
  const fillPercentage = computed(() => {
    if (budget.value <= 0) return 0

    // 남은 예산 비율 계산 (최대 100%, 최소 0%로 제한)
    const ratio = (remainingBudget.value / budget.value) * 100
    return Math.min(Math.max(ratio, 0), 100)
  })

  // 4. 가이드라인 비율 (주가 / 예산 총액)
  const guidelinePercentage = computed(() => {
    if (budget.value <= 0) return 0
    return (price.value / budget.value) * 100
  })

  // 5. 화면 중앙에 표시될 퍼센트 숫자 (소수점 버림)
  const displayPercentage = computed(() => Math.floor(fillPercentage.value))

  // 💡 편의성 함수: 새로운 지출(amount)이 발생했을 때 호출
  const addExpense = (amount: number) => {
    // ERD: Expenses.amount
    totalAmount.value += amount
  }

  // 외부에서 사용할 수 있도록 반환
  return {
    budget,
    totalAmount,
    price,
    remainingBudget,
    fillPercentage,
    guidelinePercentage,
    displayPercentage,
    addExpense,
  }
}
