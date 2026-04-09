<script setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { toast } from 'vue3-toastify'

const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const calendarAccentMap = {
  '2024-05-01': 'soft',
  '2024-05-02': 'warm',
  '2024-05-03': 'accent',
  '2024-05-04': 'dark',
  '2024-05-05': 'soft',
  '2024-05-06': 'dark',
  '2024-05-07': 'warm',
  '2024-05-08': 'soft',
  '2024-05-09': 'warm',
  '2024-05-10': 'dark',
  '2024-05-11': 'soft',
  '2024-05-13': 'soft',
  '2024-05-15': 'warm',
  '2024-05-18': 'dark',
  '2024-05-19': 'soft',
  '2024-05-21': 'warm',
  '2024-05-24': 'dark',
  '2024-05-28': 'soft',
  '2024-05-30': 'warm',
}

const currentMonth = ref(dayjs('2024-05-01'))
const selectedDate = ref(dayjs('2024-05-03'))

const historyItems = [
  {
    id: 1,
    name: '스타벅스 강남점',
    meta: '오늘 2:15 • 식비/카페',
    amount: '-₩5,400',
    type: 'expense',
    icon: 'meal',
  },
  {
    id: 2,
    name: '주식 자동 투자',
    meta: '오늘 9:00 • 투자',
    amount: '+₩10,000',
    type: 'income',
    icon: 'stock',
  },
  {
    id: 3,
    name: 'CU 편의점',
    meta: '어제 • 편의점',
    amount: '-₩2,100',
    type: 'expense',
    icon: 'bag',
  },
  {
    id: 4,
    name: '마켓컬리',
    meta: '어제 7:40 • 장보기',
    amount: '-₩34,800',
    type: 'expense',
    icon: 'bag',
  },
  {
    id: 5,
    name: '네이버페이 환급',
    meta: '5월 1일 • 적립/환급',
    amount: '+₩3,200',
    type: 'income',
    icon: 'stock',
  },
  {
    id: 6,
    name: '메가커피',
    meta: '4월 30일 • 식비/카페',
    amount: '-₩3,000',
    type: 'expense',
    icon: 'meal',
  },
  {
    id: 7,
    name: '올리브영',
    meta: '4월 30일 • 자기관리',
    amount: '-₩18,500',
    type: 'expense',
    icon: 'bag',
  },
  {
    id: 8,
    name: '자동 투자 리워드',
    meta: '4월 29일 • 투자',
    amount: '+₩8,000',
    type: 'income',
    icon: 'stock',
  },
  {
    id: 9,
    name: '배달의민족',
    meta: '4월 29일 • 배달/야식',
    amount: '-₩22,000',
    type: 'expense',
    icon: 'meal',
  },
  {
    id: 10,
    name: 'GS25',
    meta: '4월 28일 • 편의점',
    amount: '-₩4,700',
    type: 'expense',
    icon: 'bag',
  },
  {
    id: 11,
    name: '삼성증권 자동이체',
    meta: '4월 28일 • 투자',
    amount: '+₩50,000',
    type: 'income',
    icon: 'stock',
  },
  {
    id: 12,
    name: '지하철',
    meta: '4월 27일 • 교통',
    amount: '-₩1,400',
    type: 'expense',
    icon: 'bag',
  },
  {
    id: 13,
    name: '컴포즈커피',
    meta: '4월 27일 • 식비/카페',
    amount: '-₩2,800',
    type: 'expense',
    icon: 'meal',
  },
  {
    id: 14,
    name: '쿠팡',
    meta: '4월 26일 • 쇼핑',
    amount: '-₩17,900',
    type: 'expense',
    icon: 'bag',
  },
  {
    id: 15,
    name: '토스 환급',
    meta: '4월 26일 • 적립/환급',
    amount: '+₩1,500',
    type: 'income',
    icon: 'stock',
  },
  {
    id: 16,
    name: '파리바게뜨',
    meta: '4월 25일 • 식비/카페',
    amount: '-₩6,300',
    type: 'expense',
    icon: 'meal',
  },
  {
    id: 17,
    name: '이마트24',
    meta: '4월 25일 • 편의점',
    amount: '-₩3,900',
    type: 'expense',
    icon: 'bag',
  },
  {
    id: 18,
    name: '적금 만기 이자',
    meta: '4월 24일 • 금융',
    amount: '+₩12,400',
    type: 'income',
    icon: 'stock',
  },
  {
    id: 19,
    name: '올영세일',
    meta: '4월 24일 • 자기관리',
    amount: '-₩27,000',
    type: 'expense',
    icon: 'bag',
  },
  {
    id: 20,
    name: '버거킹',
    meta: '4월 23일 • 식비',
    amount: '-₩8,900',
    type: 'expense',
    icon: 'meal',
  },
]

const calendarTitle = computed(
  () => `${currentMonth.value.year()}년 ${currentMonth.value.month() + 1}월`,
)
const visibleHistoryCount = ref(3)
const recentItems = computed(() => historyItems.slice(0, visibleHistoryCount.value))
const canLoadMoreHistory = computed(() => visibleHistoryCount.value < historyItems.length)

const calendarDays = computed(() => {
  const monthStart = currentMonth.value.startOf('month')
  const monthEnd = currentMonth.value.endOf('month')
  const startOffset = monthStart.day()
  const endOffset = 6 - monthEnd.day()
  const calendarStart = monthStart.subtract(startOffset, 'day')
  const calendarEnd = monthEnd.add(endOffset, 'day')
  const totalDays = calendarEnd.diff(calendarStart, 'day') + 1
  const totalCells = totalDays <= 35 ? 35 : 42

  return Array.from({ length: totalCells }, (_, index) => {
    const date = calendarStart.add(index, 'day')
    const isoDate = date.format('YYYY-MM-DD')
    const inCurrentMonth = date.month() === currentMonth.value.month()

    return {
      key: isoDate,
      label: date.date(),
      isoDate,
      dotTone: calendarAccentMap[isoDate] ?? null,
      inCurrentMonth,
      isSelected: date.isSame(selectedDate.value, 'day'),
      isToday: date.isSame(dayjs(), 'day'),
    }
  })
})

function moveMonth(step) {
  currentMonth.value = currentMonth.value.add(step, 'month').startOf('month')

  if (!selectedDate.value.isSame(currentMonth.value, 'month')) {
    selectedDate.value = currentMonth.value.date(
      Math.min(selectedDate.value.date(), currentMonth.value.daysInMonth()),
    )
  }
}

function selectDate(isoDate) {
  const nextDate = dayjs(isoDate)
  selectedDate.value = nextDate

  if (!nextDate.isSame(currentMonth.value, 'month')) {
    currentMonth.value = nextDate.startOf('month')
  }
}

function handleAddClick() {
  toast.info('추가 기능은 다음 단계에서 연결될 예정이에요.', {
    autoClose: 1800,
  })
}

function handleStockClick() {
  toast.info('주식 상세 화면은 다음 단계에서 연결할게요.', {
    autoClose: 1800,
  })
}

function loadMoreHistory() {
  visibleHistoryCount.value = Math.min(historyItems.length, visibleHistoryCount.value + 10)
}
</script>

<template>
  <div class="home-screen">
    <div class="phone-shell">
      <div class="home-page">
        <section class="hero-section">
          <p class="page-title">내 주식 어디갔어?</p>

          <div class="bee-slot" aria-hidden="true"></div>

          <div class="balance-copy">
            <p class="balance-label">이번 달 생활비 남음</p>
            <p class="balance-amount">₩245,000</p>
            <p class="balance-hint">빨간 선은 목표 주식 가격</p>
            <p class="balance-hint">꿀단지는 현재 남은 생활비를 비율을 보여줘요</p>
          </div>
        </section>

        <section class="stock-card">
          <div class="stock-badge">QQQ</div>
          <div class="stock-copy">
            <p class="stock-label">오늘 아끼면 살 수 있는 주식</p>
            <p class="stock-value">QQQ 0.5주</p>
          </div>
          <button
            class="stock-arrow-button"
            type="button"
            aria-label="주식 카드 보기"
            @click="handleStockClick"
          >
            <svg class="stock-arrow" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M6 3.5L10.5 8L6 12.5" />
            </svg>
          </button>
        </section>

        <section class="calendar-card">
          <div class="calendar-header">
            <p class="calendar-title">{{ calendarTitle }}</p>
            <div class="calendar-controls">
              <button type="button" aria-label="이전 달" @click="moveMonth(-1)">‹</button>
              <button type="button" aria-label="다음 달" @click="moveMonth(1)">›</button>
            </div>
          </div>

          <div class="calendar-weekdays">
            <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
          </div>

          <div class="calendar-grid">
            <div
              v-for="day in calendarDays"
              :key="day.key"
              class="calendar-cell"
              :class="{
                'is-muted': !day.inCurrentMonth,
                'is-selected': day.isSelected,
              }"
            >
              <button
                type="button"
                class="calendar-day-button"
                :class="{
                  'is-selected': day.isSelected,
                  'is-muted': !day.inCurrentMonth,
                  'is-today': day.isToday,
                }"
                :aria-pressed="day.isSelected"
                @click="selectDate(day.isoDate)"
              >
                <span class="calendar-day">{{ day.label }}</span>
                <span v-if="day.dotTone" class="calendar-dot" :class="`tone-${day.dotTone}`"></span>
              </button>
            </div>
          </div>
        </section>

        <section class="history-section">
          <div class="section-heading">
            <p>최근 소비 내역</p>
          </div>

          <div class="history-list">
            <article v-for="item in recentItems" :key="item.id" class="history-card">
              <div class="history-icon">
                <svg v-if="item.icon === 'meal'" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 3v8M10 3v8M7 7h3M15 3v18M18 3c0 3-1 5-3 5" />
                </svg>
                <svg v-else-if="item.icon === 'stock'" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 16l5-5 4 3 7-7M16 7h4v4" />
                </svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 8h12l-1 11H7L6 8zm3 0V7a3 3 0 016 0v1" />
                </svg>
              </div>

              <div class="history-copy">
                <p class="history-name">{{ item.name }}</p>
                <p class="history-meta">{{ item.meta }}</p>
              </div>

              <p class="history-amount" :class="`is-${item.type}`">
                {{ item.amount }}
              </p>
            </article>
          </div>

          <button
            v-if="canLoadMoreHistory"
            class="history-more-button"
            type="button"
            @click="loadMoreHistory"
          >
            더보기
          </button>
        </section>

        <button class="floating-action" type="button" aria-label="추가" @click="handleAddClick">
          <span class="floating-action-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-screen {
  min-height: 100svh;
  padding-inline: 1rem;
  overflow-x: hidden;
  background: linear-gradient(180deg, rgba(255, 250, 241, 0.95) 0%, rgba(249, 244, 236, 0.96) 100%);
}

.phone-shell {
  width: min(100%, 26.875rem);
  margin: 0 auto;
  min-height: 100svh;
  background: #ffffff;
}

.home-page {
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 1.875rem 1.2rem 3.75rem;
  color: #1d1814;
}

.hero-section {
  text-align: center;
}

.page-title {
  margin: 0;
  text-align: left;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.05em;
}

.bee-slot {
  height: 18.75rem;
  margin-top: 1rem;
}

.balance-copy {
  margin-top: -0.25rem;
}

.balance-label {
  margin: 0;
  color: #7b736d;
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: -0.04em;
}

.balance-amount {
  margin: 0.45rem 0 1rem;
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 1;
}

.balance-hint {
  margin: 0.2rem 0;
  color: #9f9892;
  font-size: 1rem;
  line-height: 1.45;
  letter-spacing: -0.03em;
}

.stock-card,
.calendar-card,
.history-card {
  border: 1px solid rgba(232, 221, 205, 0.72);
  border-radius: 1.85rem;
  background: rgba(255, 253, 248, 0.96);
  box-shadow:
    0 18px 36px rgba(102, 81, 56, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.stock-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  margin-top: 2.1rem;
  padding: 1.35rem 1.4rem;
  background: linear-gradient(180deg, rgba(255, 249, 234, 0.98) 0%, rgba(255, 246, 226, 0.98) 100%);
}

.stock-badge {
  display: grid;
  place-items: center;
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 50%;
  border: 1px solid rgba(240, 221, 180, 0.8);
  background: #fffdf7;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.stock-copy {
  text-align: left;
}

.stock-label {
  margin: 0 0 0.35rem;
  color: #8a8179;
  font-size: 1.05rem;
  letter-spacing: -0.03em;
}

.stock-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.stock-arrow-button {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border: 0;
  border-radius: 999px;
  background: rgba(120, 97, 66, 0.08);
  cursor: pointer;
  transition:
    transform 140ms ease,
    background-color 140ms ease;
}

.stock-arrow-button:hover {
  background: rgba(120, 97, 66, 0.14);
  transform: translateX(1px);
}

.stock-arrow-button:focus-visible {
  outline: 2px solid rgba(255, 191, 56, 0.5);
  outline-offset: 2px;
}

.stock-arrow {
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: #56473a;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.1;
}

.calendar-card {
  margin-top: 1.65rem;
  padding: 1.5rem 0.85rem 1.25rem;
  overflow: hidden;
}

.calendar-header,
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calendar-title {
  margin: 0;
  padding-left: 0.8rem;
  font-size: clamp(1.55rem, 4.5vw, 1.85rem);
  font-weight: 800;
  letter-spacing: -0.04em;
}

.calendar-controls {
  display: flex;
  gap: 0.35rem;
}

.calendar-controls button {
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #30241a;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  margin-top: 1.4rem;
  color: #b7b0aa;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-align: center;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.15rem;
  margin-top: 1rem;
}

.calendar-cell {
  min-width: 0;
  min-height: 4.1rem;
}

.calendar-cell.is-muted {
  color: #ded8d1;
}

.calendar-day-button {
  display: flex;
  width: 100%;
  min-height: 4.1rem;
  padding: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.35rem;
  border: 0;
  border-radius: 1.35rem;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition:
    transform 140ms ease,
    background-color 140ms ease,
    box-shadow 140ms ease;
}

.calendar-day-button:hover {
  background: rgba(255, 196, 72, 0.08);
}

.calendar-day-button:focus-visible {
  outline: 2px solid rgba(255, 191, 56, 0.5);
  outline-offset: 2px;
}

.calendar-day {
  display: grid;
  place-items: center;
  width: 2.55rem;
  height: 2.55rem;
  border-radius: 1.15rem;
  font-size: 1.48rem;
  font-weight: 700;
  letter-spacing: -0.05em;
}

.calendar-day-button.is-selected .calendar-day {
  background: linear-gradient(180deg, #ffc756 0%, #ffbf38 100%);
  box-shadow: 0 10px 20px rgba(255, 191, 56, 0.32);
}

.calendar-day-button.is-today:not(.is-selected) .calendar-day {
  box-shadow: inset 0 0 0 1.5px rgba(255, 191, 56, 0.38);
}

.calendar-dot {
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 999px;
}

.calendar-dot.tone-soft {
  background: #f6dba8;
}

.calendar-dot.tone-warm {
  background: #ffc548;
}

.calendar-dot.tone-accent {
  background: #ffd886;
}

.calendar-dot.tone-dark {
  background: #7c5f13;
}

.history-section {
  margin-top: 2.3rem;
}

.section-heading p,
.section-heading a {
  margin: 0;
  letter-spacing: -0.04em;
}

.section-heading p {
  font-size: 2rem;
  font-weight: 700;
}

.history-list {
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-more-button {
  display: block;
  width: fit-content;
  margin-inline: auto;
  margin-top: 1rem;
  padding: 0.2rem 0;
  border: 0;
  background: transparent;
  color: #a6946f;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  cursor: pointer;
  transition:
    color 140ms ease,
    opacity 140ms ease;
}

.history-more-button:hover {
  color: #8e7948;
  opacity: 0.95;
}

.history-more-button:focus-visible {
  outline: 2px solid rgba(166, 148, 111, 0.28);
  outline-offset: 2px;
}

.history-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.2rem;
}

.history-icon {
  display: grid;
  place-items: center;
  width: 4.1rem;
  height: 4.1rem;
  border-radius: 1.2rem;
  background: linear-gradient(180deg, #f3e7d2 0%, #f8eedf 100%);
}

.history-icon svg {
  width: 1.9rem;
  height: 1.9rem;
  fill: none;
  stroke: #6f6253;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.history-copy {
  min-width: 0;
}

.history-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.04em;
}

.history-meta {
  margin: 0.25rem 0 0;
  color: #aba29b;
  font-size: 0.95rem;
  letter-spacing: -0.03em;
}

.history-amount {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.history-amount.is-expense {
  color: #191411;
}

.history-amount.is-income {
  color: #bb8730;
}

.floating-action {
  position: relative;
  display: grid;
  place-items: center;
  width: 5rem;
  height: 5rem;
  margin: 1.9rem 0 0 auto;
  border: 0;
  border-radius: 50%;
  background: #5b4939;
  box-shadow: 0 18px 28px rgba(91, 73, 57, 0.24);
  color: #ffc341;
  font-size: 3rem;
  line-height: 1;
  cursor: pointer;
  transition:
    transform 140ms ease,
    box-shadow 140ms ease,
    background-color 140ms ease;
}

.floating-action-icon {
  position: relative;
  display: block;
  width: 2rem;
  height: 2rem;
}

.floating-action-icon::before,
.floating-action-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 999px;
  background: #ffc341;
  transform: translate(-50%, -50%);
}

.floating-action-icon::before {
  width: 0.25rem;
  height: 2rem;
}

.floating-action-icon::after {
  width: 2rem;
  height: 0.25rem;
}

.floating-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 34px rgba(91, 73, 57, 0.28);
}

.floating-action:focus-visible {
  outline: 3px solid rgba(255, 191, 56, 0.35);
  outline-offset: 4px;
}

@media (min-width: 431px) {
  .phone-shell {
    box-shadow:
      0 20px 48px rgba(90, 71, 48, 0.08),
      0 0 0 1px rgba(231, 220, 205, 0.46);
  }
}

@media (max-width: 480px) {
  .home-screen {
    padding-inline: 0;
  }

  .home-page {
    padding: 1.55rem 0.95rem 3rem;
  }

  .page-title {
    font-size: 1.85rem;
  }

  .bee-slot {
    height: 14rem;
  }

  .balance-label {
    font-size: 1.18rem;
  }

  .balance-amount {
    font-size: 3rem;
  }

  .stock-value,
  .section-heading p,
  .calendar-title {
    font-size: 1.55rem;
  }

  .calendar-card {
    padding-inline: 0.7rem;
  }

  .calendar-weekdays {
    font-size: 0.74rem;
  }

  .calendar-cell,
  .calendar-day-button {
    min-height: 3.8rem;
  }

  .calendar-day {
    width: 2.35rem;
    height: 2.35rem;
    font-size: 1.35rem;
  }

  .history-card {
    padding: 1rem;
  }

  .history-icon {
    width: 3.5rem;
    height: 3.5rem;
  }

  .floating-action {
    width: 4.4rem;
    height: 4.4rem;
  }

  .floating-action-icon {
    width: 1.75rem;
    height: 1.75rem;
  }

  .floating-action-icon::before {
    width: 0.22rem;
    height: 1.75rem;
  }

  .floating-action-icon::after {
    width: 1.75rem;
    height: 0.22rem;
  }
}
</style>
