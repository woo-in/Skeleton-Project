<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import { ChevronDown, ChevronLeft, ChevronRight, Info, X } from 'lucide-vue-next'

// ==========================================
// 1. 타입 정의 (DB 카테고리와 완벽 일치)
// ==========================================
export type Category =
  | '일반식사'
  | '카페/음료'
  | '배달/야식'
  | '쇼핑'
  | '취미/여가'
  | '편의점/간식'
  | '교통'
  | '뷰티/자기관리'
  | '구독/디지털'

interface Props {
  isOpen: boolean
  selectedDate: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (
    e: 'save',
    payload: {
      amount: number
      category: Category
      date: string
      time: string
      memo: string
    },
  ): void
}>()

// ==========================================
// 2. 카테고리 & 아이콘 매핑 (public 경로 사용)
// ==========================================
const CATEGORIES: { name: Category; icon: string }[] = [
  { name: '일반식사', icon: '/images/categories/meal.png' },
  { name: '카페/음료', icon: '/images/categories/cafe.png' },
  { name: '배달/야식', icon: '/images/categories/delivery.png' },
  { name: '쇼핑', icon: '/images/categories/shopping.png' },
  { name: '취미/여가', icon: '/images/categories/hobby.png' },
  { name: '편의점/간식', icon: '/images/categories/convenience.png' },
  { name: '교통', icon: '/images/categories/transport.png' },
  { name: '뷰티/자기관리', icon: '/images/categories/beauty.png' },
  { name: '구독/디지털', icon: '/images/categories/digital.png' },
]

const getLocalTime = () => {
  const now = new Date()
  return now.toTimeString().slice(0, 5)
}

const CALENDAR_WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

// ==========================================
// 3. 상태 관리 (State)
// ==========================================
const amount = ref('0')
const category = ref<Category>('일반식사')
const memo = ref('')
const isCategoryOpen = ref(false)
const isDatePickerOpen = ref(false)
const isTimePickerOpen = ref(false)
const amountError = ref('')
const date = ref(props.selectedDate)
const time = ref(getLocalTime())
const currentCalendarMonth = ref(dayjs(props.selectedDate || dayjs().format('YYYY-MM-DD')).startOf('month'))

// ==========================================
// 4. Watchers
// ==========================================
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      date.value = props.selectedDate
      time.value = getLocalTime()
      amount.value = '0'
      category.value = '일반식사'
      memo.value = ''
      isCategoryOpen.value = false
      isDatePickerOpen.value = false
      isTimePickerOpen.value = false
      amountError.value = ''
      currentCalendarMonth.value = dayjs(props.selectedDate).startOf('month')
    }
  },
)

watch(
  () => props.selectedDate,
  (newDate) => {
    date.value = newDate
    currentCalendarMonth.value = dayjs(newDate).startOf('month')
  },
)

// ==========================================
// 5. Computed
// ==========================================
const currentCategoryIcon = computed(() => {
  return CATEGORIES.find((c) => c.name === category.value)?.icon || '/images/categories/meal.png'
})

const calendarMonthLabel = computed(() => currentCalendarMonth.value.format('YYYY. MM'))

const calendarDays = computed(() => {
  const monthStart = currentCalendarMonth.value.startOf('month')
  const monthEnd = currentCalendarMonth.value.endOf('month')
  const startOffset = monthStart.day()
  const endOffset = 6 - monthEnd.day()
  const calendarStart = monthStart.subtract(startOffset, 'day')
  const calendarEnd = monthEnd.add(endOffset, 'day')
  const totalDays = calendarEnd.diff(calendarStart, 'day') + 1
  const totalCells = totalDays <= 35 ? 35 : 42

  return Array.from({ length: totalCells }, (_, index) => {
    const nextDate = calendarStart.add(index, 'day')
    const isoDate = nextDate.format('YYYY-MM-DD')

    return {
      key: `${isoDate}-${index}`,
      isoDate,
      label: nextDate.date(),
      inCurrentMonth: nextDate.month() === currentCalendarMonth.value.month(),
      isSelected: isoDate === date.value,
      isToday: nextDate.isSame(dayjs(), 'day'),
    }
  })
})

const timeSlots = computed(() =>
  Array.from({ length: 48 }, (_, index) => {
    const hour = String(Math.floor(index / 2)).padStart(2, '0')
    const minute = index % 2 === 0 ? '00' : '30'
    const value = `${hour}:${minute}`

    return {
      value,
      label: formatDisplayTime(value),
      isSelected: value === time.value,
    }
  }),
)

// ==========================================
// 6. Methods
// ==========================================
const handleAmountChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = target.value.replace(/[^0-9]/g, '')
  amountError.value = ''

  if (value === '') {
    amount.value = '0'
    return
  }
  amount.value = new Intl.NumberFormat().format(parseInt(value, 10))
}

const formatDisplayDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-')
  return `${y}. ${m}. ${d}`
}

const formatDisplayTime = (timeStr: string) => {
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const period = hour >= 12 ? '오후' : '오전'
  const displayHour = hour % 12 || 12
  return `${period} ${displayHour}:${m}`
}

const selectCategory = (value: Category) => {
  category.value = value
  isCategoryOpen.value = false
}

const toggleCategory = () => {
  isDatePickerOpen.value = false
  isTimePickerOpen.value = false
  isCategoryOpen.value = !isCategoryOpen.value
}

const toggleDatePicker = () => {
  isCategoryOpen.value = false
  isTimePickerOpen.value = false
  currentCalendarMonth.value = dayjs(date.value).startOf('month')
  isDatePickerOpen.value = !isDatePickerOpen.value
}

const toggleTimePicker = () => {
  isCategoryOpen.value = false
  isDatePickerOpen.value = false
  isTimePickerOpen.value = !isTimePickerOpen.value
}

const changeCalendarMonth = (step: number) => {
  currentCalendarMonth.value = currentCalendarMonth.value.add(step, 'month').startOf('month')
}

const selectDateFromCalendar = (isoDate: string) => {
  date.value = isoDate
  currentCalendarMonth.value = dayjs(isoDate).startOf('month')
  isDatePickerOpen.value = false
}

const selectTimeSlot = (value: string) => {
  time.value = value
  isTimePickerOpen.value = false
}

const handleSave = () => {
  const numericAmount = parseInt(amount.value.replace(/,/g, ''), 10)

  if (!numericAmount || numericAmount <= 0) {
    amountError.value = '0원은 저장할 수 없습니다. 금액을 입력해주세요.'
    return
  }
  amountError.value = ''

  emit('save', {
    amount: numericAmount,
    category: category.value,
    date: date.value,
    time: time.value,
    memo: memo.value.trim(),
  })
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="backdrop" @click="emit('close')"></div>
    </Transition>

    <Transition name="slide-up">
      <div v-if="isOpen" class="bottom-sheet">
        <div class="handle-container">
          <div class="handle"></div>
        </div>

        <div class="sheet-content">
          <div class="sheet-header">
            <h2 class="sheet-title">지출 내역 입력</h2>
            <button @click="emit('close')" class="close-button">
              <X :size="20" aria-hidden="true" />
            </button>
          </div>

          <div class="selected-date-chip">{{ formatDisplayDate(date) }} 소비 추가</div>

          <div class="amount-section">
            <label class="amount-label">금액 입력</label>
            <div class="amount-input-wrapper">
              <input type="text" :value="amount" @input="handleAmountChange" class="amount-input" />
              <span class="amount-currency">원</span>
            </div>
            <div class="amount-underline"></div>
          </div>

          <div class="form-fields">
            <div class="field-container">
              <button @click="toggleCategory" class="field-button" type="button">
                <div class="field-left">
                  <div class="field-icon">
                    <img :src="currentCategoryIcon" alt="카테고리" class="w-6 h-6 object-contain" />
                  </div>
                  <span class="field-label">카테고리</span>
                </div>
                <div class="field-right">
                  <span class="field-value">{{ category }}</span>
                  <ChevronDown
                    aria-hidden="true"
                    :size="20"
                    class="chevron"
                    :class="{ 'rotate-180': isCategoryOpen }"
                  />
                </div>
              </button>

              <Transition name="fade-slide">
                <div v-if="isCategoryOpen" class="dropdown">
                  <div class="dropdown-content">
                    <button
                      v-for="cat in CATEGORIES"
                      :key="cat.name"
                      @click="selectCategory(cat.name)"
                      class="dropdown-item"
                      type="button"
                    >
                      <span class="dropdown-icon">
                        <img :src="cat.icon" :alt="cat.name" class="w-5 h-5 object-contain" />
                      </span>
                      {{ cat.name }}
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <div class="field-container field-container--stack">
              <div
                class="field-row field-row--picker"
                role="button"
                tabindex="0"
                @click="toggleDatePicker"
                @keydown.enter.prevent="toggleDatePicker"
                @keydown.space.prevent="toggleDatePicker"
              >
                <div class="field-left">
                  <div class="field-icon">
                    <img src="/images/action/date.png" alt="날짜" class="w-6 h-6 object-contain" />
                  </div>
                  <span class="field-label">날짜</span>
                </div>
                <div class="field-right">
                  <div class="display-box">
                    {{ formatDisplayDate(date) }}
                  </div>
                  <ChevronDown
                    aria-hidden="true"
                    :size="20"
                    class="chevron"
                    :class="{ 'rotate-180': isDatePickerOpen }"
                  />
                </div>
              </div>

              <Transition name="fade-slide">
                <div v-if="isDatePickerOpen" class="picker-panel">
                  <div class="picker-panel-header">
                    <button
                      type="button"
                      class="picker-nav-button"
                      aria-label="이전 달"
                      @click="changeCalendarMonth(-1)"
                    >
                      <ChevronLeft :size="18" aria-hidden="true" />
                    </button>
                    <p class="picker-panel-title">{{ calendarMonthLabel }}</p>
                    <button
                      type="button"
                      class="picker-nav-button"
                      aria-label="다음 달"
                      @click="changeCalendarMonth(1)"
                    >
                      <ChevronRight :size="18" aria-hidden="true" />
                    </button>
                  </div>

                  <div class="calendar-weekdays">
                    <span
                      v-for="weekday in CALENDAR_WEEKDAYS"
                      :key="weekday"
                      class="calendar-weekday"
                    >
                      {{ weekday }}
                    </span>
                  </div>

                  <div class="calendar-grid">
                    <button
                      v-for="day in calendarDays"
                      :key="day.key"
                      type="button"
                      class="calendar-day-button"
                      :class="{
                        'is-muted': !day.inCurrentMonth,
                        'is-selected': day.isSelected,
                        'is-today': day.isToday,
                      }"
                      @click="selectDateFromCalendar(day.isoDate)"
                    >
                      {{ day.label }}
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <div class="field-container field-container--stack">
              <div
                class="field-row field-row--picker"
                role="button"
                tabindex="0"
                @click="toggleTimePicker"
                @keydown.enter.prevent="toggleTimePicker"
                @keydown.space.prevent="toggleTimePicker"
              >
                <div class="field-left">
                  <div class="field-icon">
                    <img src="/images/action/time.png" alt="시간" class="w-6 h-6 object-contain" />
                  </div>
                  <span class="field-label">시간</span>
                </div>
                <div class="field-right">
                  <div class="display-box">
                    {{ formatDisplayTime(time) }}
                  </div>
                  <ChevronDown
                    aria-hidden="true"
                    :size="20"
                    class="chevron"
                    :class="{ 'rotate-180': isTimePickerOpen }"
                  />
                </div>
              </div>

              <Transition name="fade-slide">
                <div v-if="isTimePickerOpen" class="picker-panel">
                  <div class="time-slot-grid">
                    <button
                      v-for="slot in timeSlots"
                      :key="slot.value"
                      type="button"
                      class="time-slot-button"
                      :class="{ 'is-selected': slot.isSelected }"
                      @click="selectTimeSlot(slot.value)"
                    >
                      {{ slot.label }}
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <div class="memo-section">
              <div class="memo-header">
                <div class="memo-icon">
                  <img src="/images/action/memo.png" alt="메모" class="w-6 h-6 object-contain" />
                </div>
                <span class="field-label">메모</span>
              </div>
              <textarea
                v-model="memo"
                class="memo-input"
                placeholder="어디에 사용하셨나요?"
              ></textarea>
            </div>
          </div>

          <div class="notice-box">
            <Info :size="18" class="notice-icon" aria-hidden="true" />
            <p class="notice-text">
              지출 등록 시
              <span class="notice-highlight">투자 가능 금액</span>과
              <span class="notice-highlight">구매 가능 주식 수</span>가 감소합니다
            </p>
          </div>
        </div>

        <div class="save-area">
          <p v-if="amountError" class="amount-error">{{ amountError }}</p>
          <button @click="handleSave" class="save-button" type="button">저장하기</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ==========================================
   1. 레이아웃 & 배경
   ========================================== */
.backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 40;
  backdrop-filter: blur(4px);
  max-width: 450px;
  margin: 0 auto;
  left: 0;
  right: 0;
}

.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 450px;
  z-index: 50;
  background-color: #ffffff;
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
  box-shadow:
    0 -10px 25px -5px rgba(0, 0, 0, 0.1),
    0 -8px 10px -6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

.handle-container {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}

.handle {
  width: 3rem;
  height: 0.375rem;
  background-color: var(--color-surface-container-highest);
  border-radius: 9999px;
}

/* ==========================================
   2. 컨텐츠 & 헤더 
   ========================================== */
.sheet-content {
  padding: 0 1.5rem 7rem 1.5rem;
  overflow-y: auto;
}

.sheet-header {
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
}

.sheet-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-secondary); /* kb-brown 수정 */
}

.close-button {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0.25rem;
  color: var(--color-on-surface-variant); /* kb-brown-light 수정 */
  border-radius: 9999px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: var(--color-surface-container);
}

.selected-date-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  padding: 0.5rem 0.875rem;
  background-color: rgba(255, 188, 80, 0.16);
  color: var(--color-secondary); /* kb-brown 수정 */
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 700;
}

/* ==========================================
   3. 폼 입력 영역 
   ========================================== */
.amount-section {
  text-align: center;
  margin-bottom: 2rem;
}

.amount-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-on-surface-variant); /* kb-brown-light 수정 */
  margin-bottom: 0.5rem;
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.amount-input {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-secondary); /* kb-brown 수정 */
  background: transparent;
  border: none;
  text-align: center;
  width: 100%;
  max-width: 12.5rem;
  outline: none;
}

.amount-currency {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-on-surface-variant); /* kb-brown-light 수정 */
}

.amount-underline {
  margin-top: 1rem;
  width: 100%;
  height: 0.25rem;
  background-color: rgba(255, 188, 80, 0.2);
  border-radius: 9999px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-container {
  position: relative;
}

.field-container--stack {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-button,
.field-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--color-surface-container-low);
  border-radius: 1rem;
  transition: transform 0.1s;
}

.field-button:hover,
.field-row:hover {
  background-color: var(--color-surface-container-low);
}

.field-row--picker {
  cursor: pointer;
}

.field-row--picker:focus-visible {
  outline: 2px solid rgba(255, 188, 80, 0.5);
  outline-offset: 2px;
}

.field-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.field-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary); /* kb-brown 수정 */
  transition: transform 0.2s;
}

.field-button:hover .field-icon,
.field-row:hover .field-icon {
  transform: scale(1.1);
}

.field-label {
  font-weight: 700;
  color: var(--color-secondary); /* kb-brown 수정 */
}

.field-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-on-surface-variant); /* kb-brown-light 수정 */
}

.field-value {
  font-size: 0.875rem;
  font-weight: 600;
}

.chevron {
  transition: transform 0.2s;
}

.rotate-180 {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-surface-container-highest);
  z-index: 20;
  overflow: hidden;
}

.dropdown-content {
  max-height: 16rem;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-secondary); /* kb-brown 수정 */
  transition: background-color 0.2s;
  text-align: left;
}

.dropdown-item:hover {
  background-color: rgba(255, 188, 80, 0.1);
}

.dropdown-icon {
  color: var(--color-on-surface-variant); /* kb-brown-light 수정 */
  background-color: var(--color-surface-container-low);
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker-panel {
  border: 1px solid rgba(209, 198, 184, 0.7);
  background: #fffdf8;
  border-radius: 1rem;
  box-shadow:
    0 14px 28px -18px rgba(42, 34, 24, 0.28),
    0 8px 12px -10px rgba(42, 34, 24, 0.16);
  padding: 0.9rem;
}

.picker-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.picker-panel-title {
  margin: 0;
  color: var(--color-secondary);
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.picker-nav-button {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary);
  background: rgba(255, 188, 80, 0.14);
  transition:
    transform 0.15s ease,
    background-color 0.15s ease;
}

.picker-nav-button:hover {
  background: rgba(255, 188, 80, 0.22);
}

.picker-nav-button:active {
  transform: scale(0.96);
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.calendar-weekday {
  text-align: center;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--color-on-surface-variant);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.25rem;
}

.calendar-day-button {
  aspect-ratio: 1;
  border-radius: 0.9rem;
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--color-secondary);
  background: transparent;
  transition:
    transform 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;
}

.calendar-day-button.is-muted {
  color: rgba(112, 99, 84, 0.42);
}

.calendar-day-button.is-today {
  box-shadow: inset 0 0 0 1px rgba(255, 188, 80, 0.5);
}

.calendar-day-button.is-selected {
  background: var(--color-primary);
  color: var(--color-secondary);
}

.calendar-day-button:active {
  transform: scale(0.95);
}

.display-box {
  background-color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  font-weight: 600;
  transition: transform 0.1s;
  user-select: none;
}

.time-slot-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.55rem;
  max-height: 15rem;
  overflow-y: auto;
}

.time-slot-button {
  min-height: 2.65rem;
  border-radius: 0.9rem;
  padding: 0.55rem 0.4rem;
  background: rgba(255, 188, 80, 0.08);
  color: var(--color-secondary);
  font-size: 0.83rem;
  font-weight: 700;
  transition:
    transform 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;
}

.time-slot-button.is-selected {
  background: var(--color-primary);
}

.time-slot-button:active {
  transform: scale(0.97);
}

.display-box:active {
  transform: scale(0.95);
}

/* ==========================================
   4. 메모 및 안내 
   ========================================== */
.memo-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.memo-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 0.25rem;
}

.memo-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background-color: var(--color-surface-container-low);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary); /* kb-brown 수정 */
}

.memo-input {
  width: 100%;
  background-color: var(--color-surface-container-low);
  border: none;
  border-radius: 1rem;
  padding: 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  min-height: 6.25rem;
  resize: none;
  color: var(--color-secondary); /* kb-brown 수정 */
  transition: all 0.2s;
  outline: none;
}

.memo-input:focus {
  box-shadow: 0 0 0 2px rgba(255, 188, 80, 0.3);
}

.memo-input::placeholder {
  color: rgba(74, 68, 63, 0.3);
}

.notice-box {
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(255, 188, 80, 0.1);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 188, 80, 0.2);
  display: flex;
  gap: 0.75rem;
}

.notice-icon {
  color: var(--color-secondary); /* kb-brown 수정 */
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
}

.notice-text {
  font-size: 0.8125rem;
  color: var(--color-on-surface-variant); /* kb-brown-light 수정 */
  line-height: 1.6;
}

.notice-highlight {
  color: var(--color-secondary); /* kb-brown 수정 */
  font-weight: 700;
}

/* ==========================================
   5. 하단 액션 & 트랜지션
   ========================================== */
.save-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
}

.amount-error {
  color: var(--color-error); /* error 색상으로 수정 */
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.75rem;
}

.save-button {
  width: 100%;
  height: 3.5rem;
  background-color: var(--color-primary); /* kb-yellow 수정 */
  color: var(--color-secondary); /* kb-brown 수정 */
  border-radius: 0.5rem;
  font-weight: 800;
  font-size: 1.125rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.1s;
}

.save-button:active {
  transform: scale(0.98);
}

/* Vue 트랜지션 클래스 */

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

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
