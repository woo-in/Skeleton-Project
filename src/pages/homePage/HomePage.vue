<script setup>
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { toast } from 'vue3-toastify'
import HoneyPot from '@/components/HoneyPot.vue'
import CalendarDetail from '@/components/CalendarDetail.vue'
import ExpenseInput from '@/components/ExpenseInput.vue'

import { storeToRefs } from 'pinia'
import { useBudgetStore } from '@/stores/useBudgetStore'
const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const calendarDotTones = ['soft', 'warm', 'accent', 'dark']
const INITIAL_HISTORY_COUNT = 3
const HISTORY_INCREMENT = 10

const currentMonth = ref(dayjs().startOf('month'))
const selectedDate = ref(dayjs())
const expenseInputDate = ref(dayjs())
const isCalendarDetailOpen = ref(false)
const isExpenseInputOpen = ref(false)
const reopenCalendarDetail = ref(false)

const calendarTitle = computed(
  () => `${currentMonth.value.year()}년 ${currentMonth.value.month() + 1}월`,
)
const budgetStore = useBudgetStore()

// storeToRefs를 써야 반응형이 유지되어서 꿀단지가 부드럽게 움직입니다!
const {
  expenses,
  guidelinePercentage,
  targetStockName,
  targetStockTicker,
  targetStockPrice,
} = storeToRefs(budgetStore)

const getSessionMemberId = () => {
  try {
    return JSON.parse(localStorage.getItem('userSession') || 'null')?.id ?? null
  } catch {
    return null
  }
}

onMounted(async () => {
  try {
    await budgetStore.initializeBudgetState(getSessionMemberId())
  } catch (error) {
    console.error('Failed to initialize budget store:', error)
  }
})

const visibleHistoryCount = ref(INITIAL_HISTORY_COUNT)
const currentMonthKey = computed(() => currentMonth.value.format('YYYY-MM'))
const selectedDateKey = computed(() => selectedDate.value.format('YYYY-MM-DD'))
const expenseInputDateKey = computed(() => expenseInputDate.value.format('YYYY-MM-DD'))
const todayDateKey = computed(() => dayjs().format('YYYY-MM-DD'))
const expenseDateSet = computed(() => new Set(expenses.value.map((expense) => expense.date)))
const selectedDayExpenses = computed(() => budgetStore.getExpensesByDate(selectedDateKey.value))
const calendarDailyReport = computed(() => budgetStore.getDailyReport(selectedDateKey.value))
const monthlyRemainingBudget = computed(() =>
  budgetStore.getMonthlyRemainingBudget(currentMonthKey.value),
)
const monthlyFillPercentage = computed(() =>
  budgetStore.getMonthlyFillPercentage(currentMonthKey.value),
)
const todayExpenseTotal = computed(() =>
  budgetStore
    .getExpensesByDate(todayDateKey.value)
    .reduce((sum, expense) => sum + expense.amount, 0),
)
const todayExpenseStockQuantity = computed(() => {
  if (!targetStockPrice.value) return '0.00'
  return (todayExpenseTotal.value / targetStockPrice.value).toFixed(2)
})
const hasTodayExpense = computed(() => todayExpenseTotal.value > 0)
const recentItems = computed(() =>
  budgetStore.recentExpenses.slice(0, visibleHistoryCount.value).map((expense) => ({
    id: expense.id,
    name: expense.memo || expense.category,
    meta: formatHistoryMeta(expense),
    amount: `-${expense.amount.toLocaleString()}원`,
    type: 'expense',
    iconUrl: expense.categoryImageUrl || '/images/categories/shopping.png',
  })),
)
const canLoadMoreHistory = computed(
  () => visibleHistoryCount.value < budgetStore.recentExpenses.length,
)

function formatHistoryDate(date) {
  const historyDate = dayjs(date)
  if (!historyDate.isValid()) return ''

  const today = dayjs()
  if (historyDate.isSame(today, 'day')) return '오늘'
  if (historyDate.isSame(today.subtract(1, 'day'), 'day')) return '어제'
  if (historyDate.isSame(today, 'year')) return historyDate.format('M월 D일')
  return historyDate.format('YYYY. M. D')
}

function formatHistoryMeta(expense) {
  const dateTime = [formatHistoryDate(expense.date), expense.time].filter(Boolean).join(' ')
  return [dateTime, expense.category].filter(Boolean).join(' • ')
}

function getCalendarDotTone(date) {
  const [firstExpense] = budgetStore.getExpensesByDate(date)
  if (!firstExpense) return null

  const toneSource = Number(firstExpense.categoryId ?? firstExpense.id ?? 1)
  const toneIndex = Number.isFinite(toneSource)
    ? Math.abs(toneSource - 1) % calendarDotTones.length
    : 0
  return calendarDotTones[toneIndex]
}

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
      dotTone: expenseDateSet.value.has(isoDate) ? getCalendarDotTone(isoDate) : null,
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

function handleStockClick() {
  toast.info('주식 상세 화면은 다음 단계에서 연결할게요.', {
    autoClose: 1800,
  })
}

function loadMoreHistory() {
  visibleHistoryCount.value = Math.min(
    budgetStore.recentExpenses.length,
    visibleHistoryCount.value + HISTORY_INCREMENT,
  )
}

function openCalendarDetail(isoDate) {
  selectDate(isoDate)
  isCalendarDetailOpen.value = true
}

function closeCalendarDetail() {
  isCalendarDetailOpen.value = false
}

function showExpenseInput() {
  reopenCalendarDetail.value = false
  expenseInputDate.value = dayjs()
  isExpenseInputOpen.value = true
}

function openExpenseInputFromCalendar() {
  reopenCalendarDetail.value = true
  expenseInputDate.value = selectedDate.value
  isCalendarDetailOpen.value = false
  isExpenseInputOpen.value = true
}

function closeExpenseInput() {
  isExpenseInputOpen.value = false

  if (reopenCalendarDetail.value) {
    isCalendarDetailOpen.value = true
    reopenCalendarDetail.value = false
  }
}

async function handleExpenseSave(payload) {
  try {
    await budgetStore.addExpense(payload)

    toast.success('지출이 추가됐어요.', {
      autoClose: 1600,
    })
  } catch (error) {
    console.error('Failed to save expense:', error)
    toast.error('지출 저장에 실패했어요. json-server 상태를 확인해주세요.', {
      autoClose: 2200,
    })
  }
}
</script>

<template>
  <div class="home-screen">
    <div class="phone-shell">
      <div class="home-page">
        <section class="hero-section">
          <div class="bee-slot" aria-hidden="true">
            <div class="honey-pot-stage">
              <HoneyPot
                :display-value="Math.floor(monthlyFillPercentage)"
                :fill-percentage="monthlyFillPercentage"
                :guideline-percentage="guidelinePercentage"
              />
            </div>
          </div>

          <div class="balance-copy">
            <p class="balance-label">이 달 생활비 남음</p>
            <p class="balance-amount">₩{{ monthlyRemainingBudget.toLocaleString() }}</p>
            <p class="balance-hint">빨간 선은 목표 주식 총 금액</p>
            <p class="balance-hint">꿀단지는 현재 남은 생활비를 비율을 보여줘요</p>
          </div>
        </section>

        <section class="stock-card">
          <div class="stock-badge">
            {{ targetStockTicker || '주식' }}
          </div>
          <div class="stock-copy">
            <p class="stock-label">오늘 지출 주식 환산</p>
            <p v-if="hasTodayExpense" class="stock-value">
              {{ targetStockName || '주식' }}
              {{ todayExpenseStockQuantity }}주
            </p>
            <p v-else class="stock-value stock-value--empty">오늘 지출이 아직 없습니다!</p>
          </div>
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
                @click="openCalendarDetail(day.isoDate)"
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

          <p v-if="recentItems.length === 0" class="history-empty">아직 소비 내역이 없어요</p>

          <div v-else class="history-list">
            <article v-for="item in recentItems" :key="item.id" class="history-card">
              <div class="history-icon">
                <img :src="item.iconUrl" :alt="item.name" class="history-icon-image" />
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

        <button class="floating-action" type="button" aria-label="추가" @click="showExpenseInput">
          <span class="floating-action-icon" aria-hidden="true"></span>
        </button>

        <CalendarDetail
          :is-open="isCalendarDetailOpen"
          :selected-date="selectedDateKey"
          :day-expenses="selectedDayExpenses"
          :daily-report="calendarDailyReport"
          @close="closeCalendarDetail"
          @add-expense="openExpenseInputFromCalendar"
        />

        <ExpenseInput
          :is-open="isExpenseInputOpen"
          :selected-date="expenseInputDateKey"
          @close="closeExpenseInput"
          @save="handleExpenseSave"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-screen {
  --radius-card: 1.1rem;
  --radius-control: 0.85rem;
  --radius-accent: 0.95rem;
  --shadow-card: 0 0.8rem 1.8rem rgba(72, 56, 38, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.7);
  --shadow-soft: 0 0.45rem 1rem rgba(72, 56, 38, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.62);
  min-height: 100%;
  overflow-x: hidden;
  background: linear-gradient(180deg, #fcf3df 0%, #f5e7cf 58%, #ebd8bf 100%);
}

.phone-shell {
  width: 100%;
  margin: 0 auto;
  min-height: 100%;
  background: #f9f8f6;
}

.home-page {
  position: relative;
  width: 100%;
  min-height: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  padding-top: calc(1.875rem + env(safe-area-inset-top, 0px));
  padding-right: calc(1.2rem + env(safe-area-inset-right, 0px));
  padding-bottom: calc(8rem + env(safe-area-inset-bottom, 0px));
  padding-left: calc(1.2rem + env(safe-area-inset-left, 0px));
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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16.75rem;
  margin-top: 0.5rem;
  overflow: visible;
}

.honey-pot-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transform: translateX(0.25rem) scale(0.88);
  transform-origin: center top;
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
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.calendar-card,
.history-card {
  background: #ffffff;
}

.stock-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  margin-top: 2.1rem;
  padding: 1.35rem 1.4rem;
  background: #fff4dd;
}

.stock-badge {
  display: grid;
  place-items: center;
  width: 3.75rem;
  height: 3.75rem;
  border-radius: var(--radius-accent);
  background: #fff8e8;
  box-shadow: var(--shadow-soft);
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.stock-copy {
  text-align: left;
}

.stock-label {
  margin: 0 0 0.35rem;
  color: #8a8179;
  font-size: 0.95rem;
  letter-spacing: -0.03em;
}

.stock-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.stock-value--empty {
  color: #8a8179;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.35;
}

.stock-arrow-button {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border: 0;
  border-radius: var(--radius-control);
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
  border-radius: 0.7rem;
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
  border-radius: var(--radius-control);
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition:
    transform 140ms ease,
    background-color 140ms ease;
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
  border-radius: 0.8rem;
  font-size: 1.48rem;
  font-weight: 700;
  letter-spacing: -0.05em;
}

.calendar-day-button.is-selected .calendar-day {
  background: #ffbf38;
  box-shadow: 0 0.45rem 0.9rem rgba(255, 191, 56, 0.28);
}

.calendar-day-button.is-today:not(.is-selected) .calendar-day {
  background: rgba(255, 191, 56, 0.16);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55);
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

.history-section .section-heading {
  justify-content: flex-start;
  padding-left: 0.55rem;
}

.section-heading p,
.section-heading a {
  margin: 0;
  letter-spacing: -0.04em;
}

.history-section .section-heading p {
  font-size: 1.45rem;
  font-weight: 700;
}

.history-list {
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-empty {
  margin: 1.2rem 0 0;
  padding: 1.15rem;
  border-radius: var(--radius-card);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: var(--shadow-card);
  color: #8a8179;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-align: center;
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
  border-radius: 0.95rem;
  background: #f5ead8;
  box-shadow: var(--shadow-soft);
}

.history-icon-image {
  width: 2.35rem;
  height: 2.35rem;
  object-fit: cover;
  border-radius: 999px;
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
  position: fixed;
  display: grid;
  place-items: center;
  width: 3.75rem;
  height: 3.75rem;
  right: calc(
    (100vw - min(100vw, var(--device-width))) / 2 + 2.4rem + env(safe-area-inset-right, 0px)
  );
  bottom: calc(
    (100vh - min(100vh, var(--device-height))) / 2 + 6.5rem + env(safe-area-inset-bottom, 0px)
  );
  margin: 0;
  border: 0;
  border-radius: 1.35rem;
  background: #5b4939;
  box-shadow: 0 0.9rem 1.8rem rgba(45, 35, 24, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  color: #ffc341;
  font-size: 3rem;
  line-height: 1;
  cursor: pointer;
  z-index: 20;
  transition:
    transform 140ms ease,
    background-color 140ms ease;
}

.floating-action-icon {
  position: relative;
  display: block;
  width: 1.45rem;
  height: 1.45rem;
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
  width: 0.22rem;
  height: 1.45rem;
}

.floating-action-icon::after {
  width: 1.45rem;
  height: 0.22rem;
}

.floating-action:hover {
  transform: translateY(-2px);
  background: #524131;
}

.floating-action:focus-visible {
  outline: 3px solid rgba(255, 191, 56, 0.35);
  outline-offset: 4px;
}

@media (max-width: 480px) {
  .home-page {
    padding-top: calc(1.55rem + env(safe-area-inset-top, 0px));
    padding-right: calc(0.95rem + env(safe-area-inset-right, 0px));
    padding-bottom: calc(7rem + env(safe-area-inset-bottom, 0px));
    padding-left: calc(0.95rem + env(safe-area-inset-left, 0px));
  }

  .page-title {
    font-size: 1.85rem;
  }

  .bee-slot {
    height: 13.5rem;
    margin-top: 0.3rem;
  }

  .honey-pot-stage {
    transform: translateX(0.1rem) scale(0.74);
  }

  .balance-label {
    font-size: 1.18rem;
  }

  .balance-amount {
    font-size: 3rem;
  }

  .stock-value,
  .calendar-title {
    font-size: 1.55rem;
  }

  .history-section .section-heading {
    padding-left: 0.4rem;
  }

  .history-section .section-heading p {
    font-size: 1.22rem;
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
    width: 3.5rem;
    height: 3.5rem;
    right: calc(
      (100vw - min(100vw, var(--device-width))) / 2 + 1.3rem + env(safe-area-inset-right, 0px)
    );
    bottom: calc(
      (100vh - min(100vh, var(--device-height))) / 2 + 6.25rem + env(safe-area-inset-bottom, 0px)
    );
  }

  .floating-action-icon {
    width: 1.3rem;
    height: 1.3rem;
  }

  .floating-action-icon::before {
    width: 0.2rem;
    height: 1.3rem;
  }

  .floating-action-icon::after {
    width: 1.3rem;
    height: 0.2rem;
  }
}
</style>
