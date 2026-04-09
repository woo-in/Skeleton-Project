<script setup lang="ts">
import { computed } from 'vue'

interface Expense {
  id: number // DB에 맞춰 expenseId를 id로 변경
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
  isOpen: boolean
  selectedDate: string
  dayExpenses: Expense[]
  dailyReport: {
    securedQuantity: number
    stockName: string
    savedAmount: number
    progressRate: number
  }
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'add-expense'])

// ==========================================
// 2. Computed & Methods
// ==========================================
const totalAmount = computed(() => props.dayExpenses.reduce((sum, exp) => sum + exp.amount, 0))

const formattedDate = computed(() => {
  if (!props.selectedDate) return ''
  const [y, m, d] = props.selectedDate.split('-')
  return `${y}년 ${m}월 ${d}일`
})

// 🌟 categories 폴더 이미지 경로 매핑
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    일반식사: '/images/categories/meal.png',
    '카페/음료': '/images/categories/cafe.png',
    '배달/야식': '/images/categories/delivery.png',
    쇼핑: '/images/categories/shopping.png',
    '취미/여가': '/images/categories/hobby.png',
    '편의점/간식': '/images/categories/convenience.png',
    교통: '/images/categories/transport.png',
    '뷰티/자기관리': '/images/categories/beauty.png',
    '구독/디지털': '/images/categories/digital.png',
  }
  return iconMap[category] || '/images/categories/shopping.png'
}
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
                  :style="{ height: `${dailyReport.progressRate}%` }"
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
                  {{ dailyReport.stockName }} {{ dailyReport.securedQuantity }}주
                </p>
                <p class="text-lg font-bold text-secondary font-headline">확보했습니다</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-surface border border-outline-variant p-5 rounded-2xl mb-10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <img src="/images/action/money.png" alt="총 지출" class="w-6 h-6 object-contain" />
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
                    >{{ dailyReport.savedAmount.toLocaleString() }}원</span
                  >
                  더 아꼈어요!
                </p>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div class="flex items-center gap-2 mb-5">
            <img src="/images/action/list.png" alt="거래 내역" class="w-5 h-5 object-contain" />
            <h4 class="text-[16px] font-extrabold text-on-surface tracking-tight font-headline">
              거래 내역
            </h4>
          </div>
          <div class="space-y-3">
            <div
              v-for="exp in dayExpenses"
              :key="exp.id"
              class="flex items-center gap-4 p-4 bg-surface-container-low border border-transparent hover:border-outline-variant rounded-2xl transition-all cursor-pointer"
            >
              <div
                class="w-12 h-12 rounded-xl bg-surface-container-lowest border border-outline-variant flex items-center justify-center"
              >
                <img
                  :src="getCategoryIcon(exp.category)"
                  :alt="exp.category"
                  class="w-6 h-6 object-contain"
                />
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
.slide-up-enter-active {
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  /* opacity 0.55s ease-out; */
}

.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  /* opacity 0.3s ease-in; */
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateX(-50%) translateY(120%);
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateX(-50%) translateY(0);
  /* opacity: 1; */
}
.fade-enter-active {
  transition: opacity 0.15s ease-out;
}

.fade-leave-active {
  transition: opacity 0.12s ease-in;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.honey-pot-mask {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C8.69 2 6 4.69 6 8v2c-2.21 0-4 1.79-4 4s1.79 4 4 4h12c2.21 0 4-1.79 4-4s-1.79-4-4-4V8c0-3.31-2.69-6-6-6z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C8.69 2 6 4.69 6 8v2c-2.21 0-4 1.79-4 4s1.79 4 4 4h12c2.21 0 4-1.79 4-4s-1.79-4-4-4V8c0-3.31-2.69-6-6-6z'/%3E%3C/svg%3E");
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
}
</style>
