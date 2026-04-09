<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// ==========================================
// 1. 타입 정의
// ==========================================
export type Category =
  | '식비'
  | '배달'
  | '카페&디저트'
  | '쇼핑'
  | '편의점'
  | '택시'
  | '술/유흥'
  | '취미'
  | '여행'
  | '기타 소액 소비'

interface Props {
  isOpen: boolean // 바텀 시트 열림/닫힘 상태
  selectedDate: string // 달력 등에서 선택된 날짜 (YYYY-MM-DD)
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
// 2. 상수 및 초기화 로직 (구글 머티리얼 심볼 매핑)
// ==========================================
const CATEGORIES: { name: Category; icon: string }[] = [
  { name: '식비', icon: 'restaurant' },
  { name: '배달', icon: 'local_shipping' },
  { name: '카페&디저트', icon: 'local_cafe' },
  { name: '쇼핑', icon: 'shopping_bag' },
  { name: '편의점', icon: 'storefront' },
  { name: '택시', icon: 'local_taxi' },
  { name: '술/유흥', icon: 'wine_bar' },
  { name: '취미', icon: 'sports_esports' },
  { name: '여행', icon: 'flight' },
  { name: '기타 소액 소비', icon: 'toll' },
]

const getLocalTime = () => {
  const now = new Date()
  return now.toTimeString().slice(0, 5) // HH:MM 형식으로 반환
}

// ==========================================
// 3. 상태 관리 (State)
// ==========================================
const amount = ref('0')
const category = ref<Category>('식비')
const memo = ref('')
const isCategoryOpen = ref(false)
const amountError = ref('')
const date = ref(props.selectedDate)
const time = ref(getLocalTime())

// ==========================================
// 4. Watchers (상태 변화 감지)
// ==========================================
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      date.value = props.selectedDate
      time.value = getLocalTime()
      amount.value = '0'
      category.value = '식비'
      memo.value = ''
      isCategoryOpen.value = false
      amountError.value = ''
    }
  },
)

watch(
  () => props.selectedDate,
  (newDate) => {
    date.value = newDate
  },
)

// ==========================================
// 5. Computed (계산된 속성)
// ==========================================
const currentCategoryIcon = computed(() => {
  return CATEGORIES.find((c) => c.name === category.value)?.icon || 'restaurant'
})

// ==========================================
// 6. 이벤트 핸들러 (Methods)
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
              <span class="material-symbols-outlined" style="font-size: 20px">close</span>
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
              <button @click="isCategoryOpen = !isCategoryOpen" class="field-button" type="button">
                <div class="field-left">
                  <div class="field-icon">
                    <span class="material-symbols-outlined" style="font-size: 20px">{{
                      currentCategoryIcon
                    }}</span>
                  </div>
                  <span class="field-label">카테고리</span>
                </div>
                <div class="field-right">
                  <span class="field-value">{{ category }}</span>
                  <span
                    class="material-symbols-outlined chevron"
                    :class="{ 'rotate-180': isCategoryOpen }"
                    style="font-size: 20px"
                  >
                    expand_more
                  </span>
                </div>
              </button>

              <Transition name="fade-slide">
                <div v-if="isCategoryOpen" class="dropdown">
                  <div class="dropdown-content">
                    <button
                      v-for="cat in CATEGORIES"
                      :key="cat.name"
                      @click="
                        category = cat.name
                        isCategoryOpen = false
                      "
                      class="dropdown-item"
                      type="button"
                    >
                      <span class="dropdown-icon">
                        <span class="material-symbols-outlined" style="font-size: 18px">{{
                          cat.icon
                        }}</span>
                      </span>
                      {{ cat.name }}
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <div class="field-row">
              <div class="field-left">
                <div class="field-icon">
                  <span class="material-symbols-outlined" style="font-size: 20px"
                    >calendar_month</span
                  >
                </div>
                <span class="field-label">날짜</span>
              </div>
              <div class="field-input-wrapper">
                <input
                  type="date"
                  v-model="date"
                  class="hidden-input"
                  style="color-scheme: light"
                />
                <div class="display-box">
                  {{ formatDisplayDate(date) }}
                </div>
              </div>
            </div>

            <div class="field-row">
              <div class="field-left">
                <div class="field-icon">
                  <span class="material-symbols-outlined" style="font-size: 20px">schedule</span>
                </div>
                <span class="field-label">시간</span>
              </div>
              <div class="field-input-wrapper">
                <input
                  type="time"
                  v-model="time"
                  class="hidden-input"
                  style="color-scheme: light"
                />
                <div class="display-box">
                  {{ formatDisplayTime(time) }}
                </div>
              </div>
            </div>

            <div class="memo-section">
              <div class="memo-header">
                <div class="memo-icon">
                  <span class="material-symbols-outlined" style="font-size: 20px">article</span>
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
            <span class="material-symbols-outlined notice-icon" style="font-size: 20px">info</span>
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
   1. 레이아웃 & 배경 (Backdrop & Bottom Sheet)
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
   2. 컨텐츠 & 헤더 (Content & Header)
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
  color: var(--color-kb-brown);
}

.close-button {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0.25rem;
  color: var(--color-kb-brown-light);
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
  color: var(--color-kb-brown);
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 700;
}

/* ==========================================
   3. 폼 입력 영역 (Amount & Form Fields)
   ========================================== */
.amount-section {
  text-align: center;
  margin-bottom: 2rem;
}

.amount-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-kb-brown-light);
  margin-bottom: 0.5rem;
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.amount-input {
  font-family: var(--font-manrope);
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-kb-brown);
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
  color: var(--color-kb-brown-light);
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
  color: var(--color-kb-brown);
  transition: transform 0.2s;
}

.field-button:hover .field-icon,
.field-row:hover .field-icon {
  transform: scale(1.1);
}

.field-label {
  font-weight: 700;
  color: var(--color-kb-brown);
}

.field-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-kb-brown-light);
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
  color: var(--color-kb-brown);
  transition: background-color 0.2s;
  text-align: left;
}

.dropdown-item:hover {
  background-color: rgba(255, 188, 80, 0.1);
}

.dropdown-icon {
  color: var(--color-kb-brown-light);
  background-color: var(--color-surface-container-low);
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.field-input-wrapper {
  position: relative;
  color: var(--color-kb-brown-light);
}

.hidden-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.001;
  border: none;
  background: transparent;
  color: transparent;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  z-index: 20;
}

.display-box {
  background-color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  font-weight: 600;
  transition: transform 0.1s;
}

.display-box:active {
  transform: scale(0.95);
}

/* ==========================================
   4. 메모 및 안내 (Memo & Notice)
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
  color: var(--color-kb-brown);
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
  color: var(--color-kb-brown);
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
  color: var(--color-kb-brown);
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
}

.notice-text {
  font-size: 0.8125rem;
  color: var(--color-kb-brown-light);
  line-height: 1.6;
}

.notice-highlight {
  color: var(--color-kb-brown);
  font-weight: 700;
}

/* ==========================================
   5. 하단 액션 & 트랜지션 (Save Action & Animations)
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
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.75rem;
}

.save-button {
  width: 100%;
  height: 3.5rem;
  background-color: var(--color-kb-yellow);
  color: var(--color-kb-brown);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
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
  transform: translateX(-50%) translateY(100%);
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateX(-50%) translateY(0);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease-out;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
