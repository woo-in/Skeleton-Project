<script setup lang="ts">
import { computed } from 'vue'

interface Expense {
  expenseId: string
  amount: number
  category: string
  date: string
  time: string
  memo: string
}
// ==========================================
// 1. Props & Emits 정의
// ==========================================
interface Props {
  isOpen: boolean // 캘린더 상세 바텀 시트 열림/닫힘 상태
  selectedDate: string // 달력에서 선택된 날짜 (YYYY-MM-DD)
  dayExpenses: Expense[] // 해당 날짜의 지출 내역 리스트
  dailyReport: {
    // 일일 요약 리포트 데이터 (ERD의 report 테이블과 연관)
    secured_quantity: number // 확보수량 (ERD: report.secured_quantity)
    stock_name: string // 목표 종목명 (ERD: Stock.name)
    saved_amount: number // 절약금액 (ERD: report.saved_amount)
    progress_rate: number // 목표달성진행도 (ERD: report.progress_rate)
  }
}

const props = defineProps<Props>()

// 바텀 시트 닫기 이벤트와 새로운 지출 추가(ExpenseInput 열기) 이벤트
const emit = defineEmits(['close', 'add-expense'])

// ==========================================
// 2. Computed (계산된 속성)
// ==========================================
// 오늘 총 지출 합계: dayExpenses 배열을 순회하며 amount(지출액)를 모두 더함
const totalAmount = computed(() => props.dayExpenses.reduce((sum, exp) => sum + exp.amount, 0))

// 상단에 표시될 날짜 포맷팅 (YYYY-MM-DD -> YYYY년 MM월 DD일)
const formattedDate = computed(() => {
  if (!props.selectedDate) return ''
  const [y, m, d] = props.selectedDate.split('-')
  return `${y}년 ${m}월 ${d}일`
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-secondary/30 backdrop-blur-[2px] z-[55]"
      @click="emit('close')"
    ></div>
  </Transition>

  <Transition name="slide-up">
    <div
      v-if="isOpen"
      class="fixed inset-x-0 bottom-0 z-[60] bg-surface-container-lowest rounded-t-[2.5rem] shadow-[0_-12px_60px_rgba(45,41,38,0.15)] h-[85vh] overflow-y-auto flex flex-col border-t border-outline-variant max-w-md mx-auto"
    >
      <div
        class="w-full flex justify-center py-4 shrink-0 sticky top-0 bg-surface-container-lowest z-10"
      >
        <div class="w-10 h-1.5 bg-surface-container-highest rounded-full"></div>
      </div>

      <div class="px-6 pb-32">
        <div class="flex justify-between items-start mb-6">
          <div>
            <p
              class="text-on-surface-variant text-[12px] font-bold tracking-wider mb-1 uppercase font-label"
            >
              일일 요약
            </p>
            <h3 class="text-2xl font-extrabold font-headline text-on-surface tracking-tight">
              {{ formattedDate }}
            </h3>
            <div class="flex items-center gap-1.5 mt-1.5">
              <span class="text-[13px] font-extrabold text-primary tracking-tight font-label"
                >오늘의 절약 리포트</span
              >
            </div>
          </div>
          <button
            @click="emit('add-expense')"
            class="bg-primary text-on-primary w-12 h-12 rounded-2xl active:scale-95 transition-transform flex items-center justify-center shadow-lg shadow-primary/30"
          >
            <span class="material-symbols-outlined text-[26px] font-bold">add</span>
          </button>
        </div>

        <div class="mb-6">
          <div
            class="bg-surface-container-low border border-outline-variant p-6 rounded-[2.5rem] relative overflow-hidden"
          >
            <div class="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 pointer-events-none">
              <div class="honey-pot-mask relative w-full h-full bg-outline-variant overflow-hidden">
                <div
                  class="absolute bottom-0 left-0 right-0 bg-primary animate-wave origin-bottom"
                  :style="{ height: `${dailyReport.progress_rate}%` }"
                >
                  <div
                    class="absolute -top-4 left-0 right-0 h-8 bg-primary rounded-[50%] scale-x-125"
                  ></div>
                </div>
              </div>
            </div>

            <div class="relative z-10">
              <div class="flex flex-col items-start">
                <p class="text-on-surface-variant text-[13px] font-bold mb-2 font-label">
                  오늘 지출은 주식으로
                </p>
                <p class="text-[32px] font-extrabold text-secondary font-headline leading-tight">
                  {{ dailyReport.stock_name }}
                  {{ dailyReport.secured_quantity }}주
                </p>
                <p class="text-lg font-bold text-secondary font-headline">확보했습니다</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-surface border border-outline-variant p-5 rounded-2xl mb-10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span
                class="material-symbols-outlined text-primary text-[24px]"
                style="font-variation-settings: 'FILL' 1"
                >payments</span
              >
            </div>
            <div class="flex-1">
              <p class="text-xs font-bold text-on-surface-variant mb-0.5 font-label">
                오늘의 총 지출
              </p>
              <p class="text-2xl font-extrabold font-headline text-on-surface leading-none">
                {{ totalAmount.toLocaleString() }}원
              </p>
              <div class="mt-2.5 pt-2.5 border-t border-outline-variant/40">
                <p class="text-xs font-semibold text-on-surface-variant font-body">
                  평균보다
                  <span class="text-secondary font-bold"
                    >{{ dailyReport.saved_amount.toLocaleString() }}원</span
                  >
                  더 아꼈어요!
                </p>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div class="flex items-center gap-2 mb-5">
            <span class="material-symbols-outlined text-primary text-[20px]">list_alt</span>
            <h4 class="text-[16px] font-extrabold text-on-surface tracking-tight font-headline">
              거래 내역
            </h4>
          </div>
          <div class="space-y-3">
            <div
              v-for="exp in dayExpenses"
              :key="exp.expenseId"
              class="flex items-center gap-4 p-4 bg-surface-container-low border border-transparent hover:border-outline-variant rounded-2xl transition-all cursor-pointer"
            >
              <div
                class="w-12 h-12 rounded-xl bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-primary"
              >
                <span class="material-symbols-outlined">shopping_bag</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-0.5">
                  <span class="text-[15px] font-bold text-on-surface font-body">{{
                    exp.category
                  }}</span>
                  <span class="text-[15px] font-extrabold font-headline text-error"
                    >-₩{{ exp.amount.toLocaleString() }}</span
                  >
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-[13px] text-on-surface-variant font-medium font-body">{{
                    exp.memo
                  }}</span>
                  <span
                    class="text-[10px] text-on-surface-variant/60 font-bold font-headline uppercase tracking-wider"
                  >
                    {{ exp.time }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ==========================================
   1. Vue Transition 애니메이션
   ========================================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* ==========================================
   2. 커스텀 그래픽 (꿀단지 마스크)
   ========================================== */
/* Tailwind로 구현하기 힘든 복잡한 SVG 마스킹 처리만 분리 */
.honey-pot-mask {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C8.69 2 6 4.69 6 8v2c-2.21 0-4 1.79-4 4s1.79 4 4 4h12c2.21 0 4-1.79 4-4s-1.79-4-4-4V8c0-3.31-2.69-6-6-6z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C8.69 2 6 4.69 6 8v2c-2.21 0-4 1.79-4 4s1.79 4 4 4h12c2.21 0 4-1.79 4-4s-1.79-4-4-4V8c0-3.31-2.69-6-6-6z'/%3E%3C/svg%3E");
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
}
</style>
