<template>
  <div class="section-weekly">
    <div class="heading">
      <h2 class="text-wrapper">지난달 요일별 분석</h2>
    </div>

    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div class="overlay">
      <div class="background-border">
        <span class="icon" aria-hidden="true">📈</span>
      </div>
      <div class="container-4">
        <p v-if="hasDailyExpenses" class="p">
          <span>지난달 </span>
          <strong>{{ lowestExpenseDay }}요일 지출이 가장 적었네요.</strong>
        </p>
        <p v-if="hasDailyExpenses" class="element">
          <span>평소보다 </span>
          <strong>{{ savingPercent }}% 더</strong>
          <span>아꼈습니다!<br />칭찬해요 👏</span>
        </p>
        <p v-else class="p">요일별 지출 데이터를 준비 중입니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  report: {
    type: Object,
    default: null,
  },
})

const chartCanvas = ref(null)
let chartInstance = null

const dailyExpenses = computed(() =>
  Array.isArray(props.report?.dailyExpenses) ? props.report.dailyExpenses : [],
)

const hasDailyExpenses = computed(() => dailyExpenses.value.length > 0)
const chartLabels = computed(() => dailyExpenses.value.map((expense) => expense.day))
const chartAmounts = computed(() => dailyExpenses.value.map((expense) => expense.amount))

const lowestExpense = computed(() =>
  dailyExpenses.value.reduce((lowest, expense) => {
    if (!lowest || expense.amount < lowest.amount) return expense
    return lowest
  }, null),
)

const lowestExpenseDay = computed(() => lowestExpense.value?.day ?? '')
const savingPercent = computed(() => {
  if (!hasDailyExpenses.value || !lowestExpense.value) return 0

  const total = chartAmounts.value.reduce((sum, amount) => sum + amount, 0)
  const average = total / chartAmounts.value.length

  if (average <= 0) return 0
  return Math.max(0, Math.round(((average - lowestExpense.value.amount) / average) * 100))
})

function renderChart() {
  if (!chartCanvas.value || !hasDailyExpenses.value) return

  chartInstance?.destroy()
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: chartLabels.value,
      datasets: [
        {
          label: '지출',
          data: chartAmounts.value,
          borderColor: '#7a1e1e',
          backgroundColor: '#7a1e1e',
          borderWidth: 2,
          pointBackgroundColor: '#7a1e1e',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(75, 68, 51, 0.9)',
          padding: 10,
          displayColors: false,
          titleFont: {
            size: 13,
            family:
              "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          },
          bodyFont: {
            size: 14,
            family:
              "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          },
          callbacks: {
            label(context) {
              return `${context.parsed.y.toLocaleString()}원`
            },
          },
        },
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: '#7d7569',
            font: { size: 12 },
          },
        },
        y: {
          display: false,
          min: 0,
          suggestedMax: Math.max(...chartAmounts.value) * 1.15,
        },
      },
      layout: {
        padding: { left: 10, right: 10, top: 10, bottom: 0 },
      },
    },
  })
}

onMounted(() => {
  renderChart()
})

watch(
  () => props.report?.dailyExpenses,
  () => nextTick(renderChart),
  { deep: true },
)

onBeforeUnmount(() => {
  chartInstance?.destroy()
})
</script>

<style scoped>
/* 전체 컨테이너 */
.section-weekly {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 22px 20px;
  background-color: #ffffff;
  border-radius: 22px;
  border: 1px solid #efe7dc;
  font-family: "Pretendard Variable", Pretendard, -apple-system, sans-serif;
  box-sizing: border-box;
  max-width: 100%;
  box-shadow: 0 10px 24px rgba(75, 68, 51, 0.05);
}

/* 제목 */
.heading .text-wrapper {
  margin: 0;
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.45px;
}

/* 차트 높이 고정 */
.chart-container {
  position: relative;
  height: 180px;
  width: 100%;
}

/* 하단 알림 박스 */
.overlay {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: #fff8f0;
  border-radius: 16px;
}

.background-border {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.icon {
  font-size: 18px;
}

.container-4 {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.container-4 p {
  margin: 0;
  color: #4b4433;
  font-size: 14px;
  line-height: 1.5;
  word-break: keep-all;
}

.container-4 strong {
  font-weight: 600;
}
</style>
