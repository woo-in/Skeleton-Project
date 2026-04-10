<script setup lang="ts">
import { computed } from 'vue'
import { Plus } from 'lucide-vue-next'

interface Expense {
  id: number
  amount: number
  category: string
  categoryImageUrl?: string
  date: string
  time: string
  memo: string
}

interface Props {
  isOpen: boolean
  selectedDate: string
  dayExpenses: Expense[]
  dailyReport: {
    securedQuantity: number
    stockName: string
    stockTicker?: string
    savedAmount: number
    progressRate: number
    isSaved: boolean
  }
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'add-expense'])

// ==========================================
// 2. Computed & Methods
// ==========================================
const WEATHER_THRESHOLD = 5000
const totalAmount = computed(() => props.dayExpenses.reduce((sum, exp) => sum + exp.amount, 0))
const savingDelta = computed(() =>
  props.dailyReport.isSaved ? props.dailyReport.savedAmount : -props.dailyReport.savedAmount,
)
const weatherType = computed(() => {
  if (savingDelta.value > WEATHER_THRESHOLD) return 'sunny'
  if (savingDelta.value < -WEATHER_THRESHOLD) return 'rainy'
  return 'neutral'
})
const weatherClass = computed(() => `daily-weather--${weatherType.value}`)
const weatherLabel = computed(() => {
  if (weatherType.value === 'sunny') return '평균보다 많이 아껴 햇살이 뜬 상태'
  if (weatherType.value === 'rainy') return '평균보다 많이 써 비오는 구름 상태'
  return '평균과 비슷해 기본 구름 상태'
})
const stockDisplayName = computed(() => props.dailyReport.stockTicker || props.dailyReport.stockName)

const formattedDate = computed(() => {
  if (!props.selectedDate) return ''
  const [y, m, d] = props.selectedDate.split('-')
  return `${y}년 ${m}월 ${d}일`
})

const getCategoryIcon = (expense: Expense) => {
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
  return expense.categoryImageUrl || iconMap[expense.category] || '/images/categories/shopping.png'
}
</script>

<template>
  <Teleport to="body">
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
        class="calendar-detail-sheet fixed bottom-0 left-1/2 z-[60] flex h-[85vh] flex-col overflow-y-auto rounded-t-[2.1rem] border-t border-outline-variant shadow-[0_-12px_60px_rgba(45,41,38,0.15)]"
      >
        <!-- 핸들 -->
        <div class="calendar-detail-handle w-full flex justify-center py-4 sticky top-0 z-10">
          <div class="calendar-detail-handle-bar"></div>
        </div>

        <div class="calendar-detail-content px-5 pb-32">
          <!-- 헤더 -->
          <div class="flex justify-between items-start mb-6">
            <div>
              <p class="text-[12px] font-bold text-on-surface-variant mb-1 uppercase">일일 요약</p>
              <h3 class="text-2xl font-extrabold">
                {{ formattedDate }}
              </h3>
              <span class="text-[13px] font-bold text-primary mt-1 inline-block">
                오늘의 절약 리포트
              </span>
            </div>

            <button
              @click="emit('add-expense')"
              class="bg-primary text-on-primary w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Plus :size="24" />
            </button>
          </div>

          <!-- 주식 확보 카드 -->
          <div class="mb-6">
            <div
              class="daily-stock-card relative overflow-hidden"
              :class="{ 'daily-stock-card--loss': !dailyReport.isSaved }"
            >
              <div
                class="daily-weather absolute right-4 bottom-4 w-24 h-24 pointer-events-none"
                :class="weatherClass"
                role="img"
                :aria-label="weatherLabel"
              >
                <span class="daily-weather__sun" aria-hidden="true"></span>
                <div
                  class="honey-pot-mask daily-weather__cloud relative w-full h-full bg-outline-variant overflow-hidden"
                >
                  <div
                    class="daily-weather__fill absolute bottom-0 left-0 right-0 bg-primary animate-wave origin-bottom"
                    :style="{ height: `${dailyReport.progressRate}%` }"
                  >
                    <div
                      class="absolute -top-4 left-0 right-0 h-8 bg-primary rounded-[50%] scale-x-125"
                    ></div>
                  </div>
                </div>
                <span class="daily-weather__drop daily-weather__drop--1" aria-hidden="true"></span>
                <span class="daily-weather__drop daily-weather__drop--2" aria-hidden="true"></span>
                <span class="daily-weather__drop daily-weather__drop--3" aria-hidden="true"></span>
              </div>

              <div class="relative z-10">
                <div class="flex flex-col items-start">
                  <p class="text-on-surface-variant text-[13px] font-bold mb-2 font-label">
                    {{
                      dailyReport.isSaved
                        ? '일평균 생활비를 아껴서'
                        : '일평균 생활비보다 많이 써서'
                    }}
                  </p>
                  <p class="text-[32px] font-extrabold text-secondary font-headline leading-tight">
                    {{ stockDisplayName }} {{ dailyReport.securedQuantity }}주
                  </p>
                  <p class="text-lg font-bold text-secondary font-headline">
                    {{ dailyReport.isSaved ? '확보했습니다' : '잃었습니다' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 총 지출 -->
          <div class="daily-total-card">
            <div class="flex items-center gap-4">
              <div class="daily-total-icon">
                <img src="/images/action/money.png" alt="" class="daily-total-icon-image" />
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-on-surface-variant mb-0.5 font-label">
                  오늘의 총 지출
                </p>
                <p class="text-2xl font-extrabold text-on-surface font-headline leading-none">
                  {{ totalAmount.toLocaleString() }}원
                </p>

                <div class="mt-2.5 pt-2.5 border-t border-outline-variant/40">
                  <p v-if="dailyReport.isSaved" class="text-xs font-semibold text-on-surface-variant">
                    평균보다
                    <span class="font-bold text-secondary">
                      {{ dailyReport.savedAmount.toLocaleString() }}원
                    </span>
                    더 아꼈어요!
                  </p>

                  <p v-else class="text-xs font-semibold text-on-surface-variant">
                    평균보다
                    <span class="font-bold text-error">
                      {{ dailyReport.savedAmount.toLocaleString() }}원
                    </span>
                    더 썼어요 😢
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 거래 내역 -->
          <section class="daily-history-section">
            <div class="daily-history-heading">
              <h4>거래 내역</h4>
            </div>

            <p v-if="dayExpenses.length === 0" class="daily-history-empty">이 날의 소비 내역이 없어요</p>

            <div v-else class="daily-history-list">
              <article
                v-for="exp in dayExpenses"
                :key="exp.id"
                class="daily-history-card"
              >
                <div class="daily-history-icon">
                  <img :src="getCategoryIcon(exp)" :alt="exp.category" class="daily-history-icon-image" />
                </div>

                <div class="daily-history-copy">
                  <p class="daily-history-name">{{ exp.category }}</p>
                  <p class="daily-history-meta">
                    {{ [exp.memo, exp.time].filter(Boolean).join(' • ') }}
                  </p>
                </div>

                <p class="daily-history-amount">-₩{{ exp.amount.toLocaleString() }}</p>
              </article>
            </div>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.calendar-detail-sheet {
  width: min(100vw, 430px);
  max-width: min(100vw, 430px);
  box-sizing: border-box;
  background: #f9f8f6;
  transform: translateX(-50%);
}

.calendar-detail-handle {
  background: #f9f8f6;
}

.calendar-detail-handle-bar {
  width: 2.5rem;
  height: 0.375rem;
  border-radius: 9999px;
  background: #d8cec1;
}

.calendar-detail-content {
  box-sizing: border-box;
}

.daily-stock-card {
  padding: 1.5rem;
  border: 1px solid #efe7dc;
  border-radius: 1.6rem;
  background: #fff4dd;
  box-shadow: 0 0.8rem 1.8rem rgba(72, 56, 38, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.daily-stock-card--loss {
  border-color: #e7e3de;
  background: #f1f0ed;
  box-shadow: 0 0.75rem 1.6rem rgba(72, 56, 38, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.66);
}

.daily-total-card {
  margin-bottom: 2.5rem;
  padding: 1.25rem;
  border: 1px solid #efe7dc;
  border-radius: 1.1rem;
  background: #ffffff;
  box-shadow: 0 0.8rem 1.8rem rgba(72, 56, 38, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.daily-total-icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
}

.daily-total-icon-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.daily-history-section {
  width: 100%;
}

.daily-history-heading {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1.2rem;
  padding-left: 0.25rem;
}

.daily-history-heading h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #1d1814;
}

.daily-history-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.daily-history-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  border: 1px solid #efe7dc;
  border-radius: 1.1rem;
  background: #ffffff;
  box-shadow: 0 0.8rem 1.8rem rgba(72, 56, 38, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.daily-history-icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
}

.daily-history-icon-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.daily-history-copy {
  min-width: 0;
}

.daily-history-name,
.daily-history-meta,
.daily-history-amount {
  margin: 0;
}

.daily-history-name {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #1d1814;
}

.daily-history-meta {
  margin-top: 0.25rem;
  color: #aba29b;
  font-size: 0.86rem;
  line-height: 1.35;
  letter-spacing: -0.03em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.daily-history-amount {
  color: #191411;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  white-space: nowrap;
}

.daily-history-empty {
  margin: 0;
  padding: 1.15rem;
  border-radius: 1.1rem;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 0.8rem 1.8rem rgba(72, 56, 38, 0.07);
  color: #8a8179;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-align: center;
}

.slide-up-enter-active {
  transition:
    opacity 0.24s ease,
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

.slide-up-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(100%);
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
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
  mask-position: center;
  -webkit-mask-position: center;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
}

.daily-weather {
  opacity: 0.44;
  isolation: isolate;
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.daily-weather__sun {
  position: absolute;
  top: 0.25rem;
  right: 3.35rem;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 9999px;
  background: linear-gradient(145deg, #fff3a8 0%, #ffbc50 78%);
  box-shadow:
    0 0 0 0.36rem rgba(255, 188, 80, 0.16),
    0 0.65rem 1.4rem rgba(255, 174, 54, 0.34);
  opacity: 0;
  z-index: 1;
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.daily-weather__sun::before {
  content: '';
  position: absolute;
  inset: -0.48rem;
  border-radius: inherit;
  border: 0.2rem solid rgba(255, 188, 80, 0.24);
  box-shadow: 0 0 1rem rgba(255, 188, 80, 0.18);
  z-index: -1;
}

.daily-weather__cloud {
  position: absolute;
  inset: 0;
  z-index: 2;
  transition:
    background-color 180ms ease,
    transform 180ms ease;
}

.daily-weather__fill,
.daily-weather__fill > div {
  transition: background-color 180ms ease;
}

.daily-weather__drop {
  position: absolute;
  bottom: 0.55rem;
  width: 0.56rem;
  height: 0.88rem;
  border-radius: 9999px 9999px 9999px 0.18rem;
  background: linear-gradient(145deg, #a7cff6 0%, #5f91c9 78%);
  box-shadow:
    0 0 0 0.22rem rgba(95, 145, 201, 0.12),
    0 0.5rem 0.9rem rgba(95, 145, 201, 0.22);
  opacity: 0;
  transform: rotate(38deg) translateY(-0.2rem);
  z-index: 3;
  transition: opacity 180ms ease;
}

.daily-weather__drop--1 {
  right: 1.65rem;
}

.daily-weather__drop--2 {
  right: 2.8rem;
  bottom: 0.2rem;
  width: 0.62rem;
  height: 1rem;
}

.daily-weather__drop--3 {
  right: 4.05rem;
}

.daily-weather--sunny {
  opacity: 0.72;
}

.daily-weather--sunny .daily-weather__sun {
  opacity: 1;
  transform: scale(1);
}

.daily-weather--sunny .daily-weather__cloud {
  background-color: #ffe0a0;
  transform: translate(0.25rem, 0.1rem) scale(0.84);
}

.daily-weather--rainy {
  opacity: 0.68;
}

.daily-weather--rainy .daily-weather__cloud {
  background-color: #8794a1;
  transform: translate(0.1rem, -0.35rem) scale(0.92);
}

.daily-weather--rainy .daily-weather__fill,
.daily-weather--rainy .daily-weather__fill > div {
  background-color: #5f7286;
}

.daily-weather--rainy .daily-weather__drop {
  opacity: 1;
  animation: weather-rain-fall 1.15s ease-in-out infinite;
}

.daily-weather--rainy .daily-weather__drop--2 {
  animation-delay: 0.18s;
}

.daily-weather--rainy .daily-weather__drop--3 {
  animation-delay: 0.34s;
}

.daily-weather--neutral .daily-weather__cloud {
  transform: translateY(-0.6rem) scale(0.94);
}

@keyframes weather-rain-fall {
  0%,
  100% {
    transform: rotate(38deg) translateY(-0.2rem);
  }

  50% {
    transform: rotate(38deg) translateY(0.28rem);
  }
}

@media (max-width: 430px) {
  .daily-stock-card {
    border-radius: 1.35rem;
    padding: 1.25rem;
  }

  .daily-history-card {
    gap: 0.85rem;
  }
}
</style>
