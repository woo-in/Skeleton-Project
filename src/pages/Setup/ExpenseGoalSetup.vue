<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  X,
  Wallet,
  Search,
  TrendingUp,
  Info,
  Sparkles,
  Lightbulb,
  ShieldCheck,
  ArrowRight,
  Coins,
} from 'lucide-vue-next'
import { Motion } from '@motionone/vue'
import { useRouter } from 'vue-router'

const lastMonthExpense = ref('')
const router = useRouter()
const onExpenseInput = (e) => {
  const value = e.target.value.replace(/[^0-9]/g, '')
  lastMonthExpense.value = value
}

const targetStock = ref('')
const selectedStock = ref(null)
const targetQuantity = ref('')

const isStockListOpen = ref(false)
const showErrors = ref(false)

const popularStocks = [
  { name: '케이뱅크', ticker: 'KBK', price: 6080 },
  { name: '카카오', ticker: 'KKO', price: 47500 },
  { name: '삼성전자', ticker: 'SMS', price: 204500 },
  { name: 'KB금융', ticker: 'KBF', price: 155900 },
  { name: '타이거200', ticker: 'TG2', price: 87700 },
  { name: '현대차', ticker: 'HDY', price: 501000 },
]

// Get User ID from session
const getUserId = () => {
  const sessionStr = localStorage.getItem('userSession')
  if (sessionStr) {
    try {
      const user = JSON.parse(sessionStr)
      return user.id
    } catch (e) {
      console.error('Failed to parse user session', e)
    }
  }
  return null
}

const userId = getUserId() || 'testUser' // Hardcoded for testing

// Load data on mount
onMounted(async () => {
  if (userId) {
    try {
      // Fetch user data from json-server
      const response = await fetch(`/members/${userId}`)
      if (response.ok) {
        const data = await response.json()
        lastMonthExpense.value = data.monthlyBudget ? data.monthlyBudget.toString() : ''
        targetQuantity.value = data.targetQuantity ? data.targetQuantity.toString() : ''
        if (data.targetStockId) {
          const stock = popularStocks.find((s) => s.ticker === data.targetStockId)
          if (stock) {
            selectedStock.value = stock
            targetStock.value = stock.name
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch user data from server', e)

      // Fallback to localStorage if server fails
      const savedData = localStorage.getItem(`user_setup_${userId}`)
      if (savedData) {
        try {
          const data = JSON.parse(savedData)
          lastMonthExpense.value = data.lastMonthExpense || ''
          targetQuantity.value = data.targetQuantity || ''
          if (data.selectedStockTicker) {
            const stock = popularStocks.find((s) => s.ticker === data.selectedStockTicker)
            if (stock) {
              selectedStock.value = stock
              targetStock.value = stock.name
            }
          }
        } catch (err) {
          console.error('Failed to parse saved data', err)
        }
      }
    }
  }
})

const totalTargetAmount = computed(() => {
  if (!selectedStock.value || !targetQuantity.value) return 0
  const quantityStr = targetQuantity.value.toString().replace(/[^0-9.]/g, '')
  const quantity = parseFloat(quantityStr) || 0
  const amount = selectedStock.value.price * quantity
  return Math.min(amount, 99999999)
})

// Input validation for targetQuantity
const onQuantityInput = (e) => {
  const inputVal = e.target.value
  const sanitized = inputVal.replace(/[^0-9.]/g, '')

  if (selectedStock.value) {
    const quantity = parseFloat(sanitized) || 0
    const amount = selectedStock.value.price * quantity
    if (amount > 99999999) {
      // If it exceeds, don't update and keep previous value in input
      e.target.value = targetQuantity.value
      return
    }
  }
  targetQuantity.value = sanitized
}

const setTargetStock = (stock) => {
  // Check if current quantity with new stock price exceeds limit
  const quantity = parseFloat(targetQuantity.value) || 0
  const amount = stock.price * quantity
  if (amount > 99999999) {
    // Cap quantity if it exceeds
    const maxQty = 99999999 / stock.price
    targetQuantity.value = maxQty.toFixed(2)
  }

  targetStock.value = stock.name
  selectedStock.value = stock
  isStockListOpen.value = false
}

const handleStartSaving = async () => {
  showErrors.value = true

  if (!lastMonthExpense.value || !selectedStock.value || !targetQuantity.value) {
    return
  }

  /*
  if (!userId) {
    alert('로그인이 필요합니다.')
    return
  }
  */

  try {
    // 1. Save to json-server
    const response = await fetch(`/members/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        monthlyBudget: parseInt(lastMonthExpense.value),
        targetStockId: selectedStock.value.ticker,
        targetQuantity: parseFloat(targetQuantity.value),
      }),
    })

    if (response.ok) {
      // 2. Also save to localStorage as backup
      const dataToSave = {
        lastMonthExpense: lastMonthExpense.value,
        targetQuantity: targetQuantity.value,
        selectedStockTicker: selectedStock.value?.ticker,
      }
      localStorage.setItem(`user_setup_${userId}`, JSON.stringify(dataToSave))

      alert('설정이 저장되었습니다!')
      router.push('/home')
    } else {
      alert('설정 저장 중 오류가 발생했습니다.')
    }
  } catch (error) {
    console.error('Failed to save settings to server:', error)
    alert('서버와 통신하는 중 문제가 발생했습니다. json-server가 켜져 있는지 확인해주세요.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#F9F9F8] text-[#2D2926] font-sans selection:bg-[#FFBC50]/30">
    <!-- Header -->
    <header
      class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md flex justify-between items-center px-6 h-16 border-b border-[#D6D2CE]/20"
    >
      <div class="text-xl font-bold tracking-tight text-[#2D2926]">내 주식 어디갔어?</div>
      <button class="text-[#6D6864] hover:text-[#2D2926] transition-colors p-1">
        <X :size="24" />
      </button>
    </header>

    <main class="w-full max-w-lg mx-auto px-6 pt-24 pb-32 flex flex-col gap-8">
      <!-- Hero Section -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" class="space-y-3">
        <h1 class="text-[2.25rem] font-extrabold leading-tight tracking-tight text-[#2D2926]">
          당신의 정보를 입력하세요
        </h1>
        <p class="text-[#6D6864] text-lg font-medium">
          아낀 돈이 어떤 주식으로 바뀌는지 확인해보세요
        </p>
      </Motion>

      <!-- Configuration Form -->
      <div class="space-y-5">
        <!-- Card 1: Last Month's Spending -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.1 }"
          class="bg-white p-6 rounded-2xl border border-[#D6D2CE]/30 shadow-sm flex flex-col gap-4"
        >
          <label class="flex items-center gap-2 text-[#2D2926] font-bold text-lg">
            <Wallet :size="20" class="text-[#FFBC50]" />
            생활비
          </label>
          <div class="relative">
            <input
              class="w-full bg-[#F2F2F0] border-2 border-transparent rounded-xl py-4 px-5 text-xl font-bold text-[#2D2926] focus:border-[#FFBC50] focus:bg-white transition-all outline-none"
              placeholder="생활비"
              type="text"
              :value="lastMonthExpense ? Number(lastMonthExpense).toLocaleString() : ''"
              @input="onExpenseInput"
            />
            <span class="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-[#2D2926]"
              >원</span
            >
          </div>
          <!-- Error Message -->
          <Motion
            v-if="showErrors && !lastMonthExpense"
            :initial="{ opacity: 0, y: -10 }"
            :animate="{ opacity: 1, y: 0 }"
            class="text-red-500 text-sm font-bold px-1"
          >
            생활비를 입력하세요.
          </Motion>
          <div class="flex items-start gap-2 px-1">
            <Info :size="16" class="text-[#FFBC50] mt-0.5 shrink-0" />
            <p class="text-sm text-[#6D6864] leading-relaxed">
              생활비를 아껴서 절약한 금액만큼 아래의 주식을 살 수 있어요.
            </p>
          </div>
        </Motion>

        <!-- Card 2: Target Stock -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.2 }"
          class="bg-white p-6 rounded-2xl border border-[#D6D2CE]/30 shadow-sm flex flex-col gap-4"
        >
          <label class="flex items-center gap-2 text-[#2D2926] font-bold text-lg">
            <Search :size="20" class="text-[#FFBC50]" />
            목표 주식
          </label>

          <div class="flex items-start gap-2 px-1">
            <Sparkles :size="16" class="text-[#FFBC50] mt-0.5 shrink-0" />
            <p class="text-sm text-[#6D6864] leading-relaxed">
              생활비를 아끼면 이 주식을 모아 수익을 만들 수 있습니다.
            </p>
          </div>

          <div class="relative">
            <Search :size="24" class="absolute left-5 top-1/2 -translate-y-1/2 text-[#6D6864]" />
            <button
              @click="isStockListOpen = !isStockListOpen"
              class="w-full bg-[#F2F2F0] rounded-2xl py-5 pl-14 pr-5 text-xl font-bold text-[#6D6864] hover:bg-[#E8E8E6] transition-all outline-none text-left"
            >
              {{ targetStock || '관심 주식 이름' }}
            </button>
          </div>

          <!-- Error Message -->
          <Motion
            v-if="showErrors && !selectedStock"
            :initial="{ opacity: 0, y: -10 }"
            :animate="{ opacity: 1, y: 0 }"
            class="text-red-500 text-sm font-bold px-1"
          >
            목표주식을 선택하세요.
          </Motion>

          <!-- Selected Stock Info Card -->
          <Motion
            v-if="selectedStock && !isStockListOpen"
            :initial="{ opacity: 0, scale: 0.95 }"
            :animate="{ opacity: 1, scale: 1 }"
            class="bg-[#FFFBF2] p-6 rounded-2xl border border-[#FFBC50]/30 flex items-center gap-4"
          >
            <div
              class="w-14 h-14 rounded-full bg-white border border-[#D6D2CE]/20 flex items-center justify-center overflow-hidden shrink-0"
            >
              <span class="text-[10px] font-bold text-[#6D6864] uppercase">{{
                selectedStock.ticker
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <div class="text-lg font-bold text-[#2D2926]">{{ selectedStock.name }}</div>
              <div class="text-[#6D6864] text-sm leading-snug">
                {{ selectedStock.name }}의 주가는
                <span class="font-bold text-[#2D2926]"
                  >{{ selectedStock.price.toLocaleString() }}원</span
                >입니다.
              </div>
            </div>
          </Motion>

          <!-- Popular Stocks List -->
          <Motion
            v-if="isStockListOpen"
            :initial="{ opacity: 0, height: 0 }"
            :animate="{ opacity: 1, height: 'auto' }"
            class="bg-[#F9F9F8] rounded-xl border border-[#D6D2CE]/30 overflow-hidden"
          >
            <div class="px-4 py-2 text-xs font-bold text-[#6D6864] border-b border-[#D6D2CE]/20">
              인기 종목
            </div>
            <div
              class="bg-white max-h-64 overflow-y-auto divide-y divide-[#D6D2CE]/10 custom-scrollbar"
            >
              <div
                v-for="stock in popularStocks"
                :key="stock.ticker"
                @click="setTargetStock(stock)"
                class="flex items-center justify-between p-4 hover:bg-[#F9F9F8] transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-[#F2F2F0] flex items-center justify-center text-[10px] font-bold text-[#6D6864]"
                  >
                    {{ stock.ticker }}
                  </div>
                  <div>
                    <div class="font-bold text-[#2D2926]">{{ stock.name }}</div>
                    <div class="text-xs text-[#6D6864]">{{ stock.ticker }}</div>
                  </div>
                </div>
                <TrendingUp :size="18" class="text-[#6D6864]" />
              </div>
            </div>
          </Motion>
        </Motion>

        <!-- Card 3: Quantity Target -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.3 }"
          class="bg-white p-6 rounded-2xl border border-[#D6D2CE]/30 shadow-sm flex flex-col gap-4"
        >
          <label class="flex items-center gap-2 text-[#2D2926] font-bold text-lg">
            <TrendingUp :size="20" class="text-[#FFBC50]" />
            목표 수량
          </label>
          <div class="relative">
            <input
              class="w-full bg-[#F2F2F0] border-2 border-transparent rounded-xl py-4 px-5 text-xl font-bold text-[#2D2926] focus:border-[#FFBC50] focus:bg-white transition-all outline-none"
              placeholder="0"
              type="text"
              :value="targetQuantity"
              @input="onQuantityInput"
            />
            <span class="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-[#2D2926]"
              >주</span
            >
          </div>
          <!-- Error Message -->
          <Motion
            v-if="showErrors && !targetQuantity"
            :initial="{ opacity: 0, y: -10 }"
            :animate="{ opacity: 1, y: 0 }"
            class="text-red-500 text-sm font-bold px-1"
          >
            목표 수량을 입력하세요.
          </Motion>
          <div class="flex items-start gap-2 px-1">
            <Lightbulb :size="16" class="text-[#FFBC50] mt-0.5 shrink-0" />
            <p class="text-sm text-[#6D6864] leading-relaxed">
              생활비 절약을 통해 이만큼의 주식을 모으는 것이 최종 목표입니다.
            </p>
          </div>
        </Motion>

        <!-- Card 4: Final Target Amount -->
        <Motion
          v-if="selectedStock"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.4 }"
          class="bg-[#FFFBF2] p-8 rounded-3xl border border-[#FFBC50]/30 shadow-sm flex flex-col gap-6"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#FFBC50] flex items-center justify-center">
              <Coins :size="24" class="text-white" />
            </div>
            <h3 class="text-xl font-bold text-[#2D2926]">최종 목표 금액</h3>
          </div>

          <div class="space-y-2">
            <p class="text-[#6D6864] font-medium">
              현재 선택한 <span class="text-[#2D2926] font-bold">{{ selectedStock.name }}</span>
            </p>
            <p class="text-[#6D6864] font-medium">
              목표 수량 <span class="text-[#2D2926] font-bold">{{ targetQuantity }}주</span>의
              금액은
            </p>
            <div class="mt-4 flex flex-wrap items-baseline gap-x-1">
              <span class="text-4xl font-black text-[#2D2926] tracking-tight">
                {{ totalTargetAmount.toLocaleString() }}
              </span>
              <span class="text-xl font-bold text-[#2D2926] whitespace-nowrap">원입니다.</span>
            </div>
          </div>

          <div class="pt-6 border-t border-[#FFBC50]/20">
            <p class="text-sm text-[#6D6864] font-medium">
              {{ selectedStock.name }} 1주({{ selectedStock.price.toLocaleString() }}원) ×
              {{ targetQuantity }}주 기준
            </p>
          </div>
        </Motion>
      </div>

      <!-- Security Banner -->
      <Motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ delay: 0.4 }"
        class="relative h-44 w-full rounded-2xl overflow-hidden bg-[#2D2926]"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-[#FFBC50]/30 to-transparent z-10"></div>
        <img
          alt="Financial stability"
          class="w-full h-full object-cover opacity-30"
          src="https://picsum.photos/seed/finance/800/400"
          referrerPolicy="no-referrer"
        />
        <div
          class="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-20"
        >
          <ShieldCheck :size="40" class="text-[#FFBC50] mb-2 fill-[#FFBC50]/20" />
          <p class="text-white font-bold text-lg">안전한 자산 관리를 위해</p>
          <p class="text-white/70 text-sm">모든 데이터는 기기에만 암호화되어 저장됩니다.</p>
        </div>
      </Motion>
    </main>

    <!-- Bottom Action Button -->
    <div
      class="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#F9F9F8] via-[#F9F9F8] to-transparent flex justify-center items-end z-50"
    >
      <Motion
        @click="handleStartSaving"
        :while-hover="{ scale: 1.02 }"
        :while-tap="{ scale: 0.98 }"
        class="w-full max-w-lg h-16 bg-[#FFBC50] text-[#2D2926] rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer"
      >
        절약 시작하기
        <ArrowRight :size="20" class="stroke-[3px]" />
      </Motion>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d6d2ce;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6d6864;
}
</style>
