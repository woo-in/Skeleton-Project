<template>
  <div v-if="report" class="hero-report">
    <div class="hero-goal-section">
      <div class="icon" aria-hidden="true">
        <span class="icon-emoji">✨</span>
      </div>
      <div class="container">
        <div class="div">
          <div class="container-2">
            <div class="div-wrapper"><div class="text-wrapper">지난달 투자 리포트</div></div>
            <div class="heading">
              <div class="text-wrapper-2">{{ goalTitleLine1 }} <br>{{ goalTitleLine2 }}</div>
            </div>
          </div>
          <div class="overlay-border">
            <div class="text-wrapper-3">{{ goalStatusLabel }}</div>
          </div>
        </div>
        <div class="container-3">
          <div class="container-4">
            <div class="text-wrapper-4">지난달</div>
            <div class="horizontal-border">
              <div class="text-wrapper-5">{{ report.savedAmount.toLocaleString() }}원</div>
            </div>
            <div class="text-wrapper-4">아껴서</div>
          </div>
          <div class="heading-2">
            <div class="text-wrapper-6">+{{ report.stockName }} {{ report.securedQuantity }}</div>
            <div class="text-wrapper-7">주 확보</div>
          </div>
        </div>
        <div class="goal-progress-card">
          <div class="container-5">
            <div class="container-6">
              <div class="container-7">
                <span class="img" aria-hidden="true">🎯</span>
              </div>
              <div class="container-8">
                <div class="text-wrapper-8">{{ report.stockName }} {{ report.targetQuantity }}주 채우기 목표</div>
              </div>
            </div>
            <div class="container-7"><div class="text-wrapper-9">{{ report.progressRate }}%</div></div>
          </div>
          <div class="overlay">
            <div class="background-shadow" :style="{ width: currentWidth + '%' }"></div>
          </div>
          <div class="container-9">
            <p class="p">{{ report.successCount }}명이 함께 이 목표를 향해 달리고 있어요</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  report: Object,
})

const currentWidth = ref(0)

const isGoalAchieved = computed(() => {
  if (!props.report) return false
  return props.report.securedQuantity >= props.report.targetQuantity || props.report.progressRate >= 100
})

const goalTitleLine1 = computed(() => (isGoalAchieved.value ? '절약 목표를' : '절약 목표에'))
const goalTitleLine2 = computed(() => (isGoalAchieved.value ? '달성했어요! 👏' : '다가가고 있어요'))
const goalStatusLabel = computed(() => (isGoalAchieved.value ? 'ACHIEVED' : 'IN PROGRESS'))

onMounted(() => {
  setTimeout(() => {
    currentWidth.value = Math.min(Math.max(props.report.progressRate, 0), 100)
  }, 100)
})

</script>

<style scoped>
.hero-report {
  width: 100%;
}

.hero-goal-section * {
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
  box-sizing: border-box;
}

.hero-goal-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 26px 22px;
  position: relative;
  background-color: #ffbc50;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 18px 34px rgba(178, 91, 24, 0.22);
}

.hero-goal-section .icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 135px;
  height: 135px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.25;
}

.hero-goal-section .icon-emoji {
  font-size: 56px;
  line-height: 1;
}

.hero-goal-section .container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  width: 100%;
  position: relative;
  flex: 0 0 auto;
}

.hero-goal-section .div {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  align-self: stretch;
  width: 100%;
  position: relative;
  flex: 0 0 auto;
}

.hero-goal-section .container-2 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
}

.hero-goal-section .div-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  width: 100%;
  opacity: 0.8;
  position: relative;
  flex: 0 0 auto;
}

.hero-goal-section .text-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: -1.00px;
  font-weight: 500; /* 약간 도톰하게 변경 */
  color: #4b4433;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 20px;
  white-space: nowrap;
  word-break: keep-all;
}

.hero-goal-section .heading {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 0 0 auto;
  position: relative;
  align-self: stretch;
  width: 100%;
}

.hero-goal-section .text-wrapper-2 {
  position: relative;
  width: 100%;
  height: auto;
  margin-top: -1.00px;
  font-weight: 800;
  color: #4b4433;
  font-size: clamp(24px, 7vw, 30px);
  letter-spacing: -0.60px;
  line-height: 1.18;
  word-break: keep-all;
}

.hero-goal-section .overlay-border {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 4px 12px;
  position: relative;
  flex: 0 0 auto;
  background-color: #4b44331a;
  border-radius: 9999px;
  border: 1px solid;
  border-color: #4b443333;
  backdrop-filter: blur(6px) brightness(100%);
  -webkit-backdrop-filter: blur(6px) brightness(100%);
}

.hero-goal-section .text-wrapper-3 {
  position: relative;
  display: flex;
  align-items: center;
  width: auto;
  height: auto;
  font-weight: 700;
  color: #4b4433;
  font-size: 10px;
  letter-spacing: 1.00px;
  line-height: 15px;
  white-space: nowrap;
}

.hero-goal-section .container-3 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  align-self: stretch;
  width: 100%;
  position: relative;
  flex: 0 0 auto;
}

.hero-goal-section .container-4 {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  align-self: stretch;
  width: 100%;
  opacity: 0.9;
  position: relative;
  flex: 0 0 auto;
}

.hero-goal-section .text-wrapper-4 {
  position: relative;
  display: flex;
  align-items: center;
  width: auto;
  height: auto;
  margin-top: -1.00px;
  font-weight: 500;
  color: #4b4433;
  font-size: 14px;
  letter-spacing: -0.3px;
  line-height: 20px;
  white-space: nowrap;
}

.hero-goal-section .horizontal-border {
  position: relative;
  width: auto;
  min-width: max-content;
  height: auto;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: #4b443366;
}

.hero-goal-section .text-wrapper-5 {
  position: static;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center; /* 가운데 정렬 추가 */
  font-weight: 700; /* 금액 강조 */
  color: #4b4433;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 20px;
  white-space: nowrap;
}

.hero-goal-section .heading-2 {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
}

.hero-goal-section .text-wrapper-6 {
  min-width: 0;
  font-weight: 900;
  font-size: clamp(30px, 9vw, 38px);
  letter-spacing: -0.90px;
  line-height: 1.12;
  display: flex;
  align-items: center;
  color: #4b4433;
  white-space: normal;
  overflow-wrap: anywhere;
}

.hero-goal-section .text-wrapper-7 {
  display: flex;
  align-items: center;
  opacity: 0.8;
  font-weight: 600; /* 기존 중국어 폰트 제거 및 굵기 조정 */
  color: #4b4433;
  font-size: 20px;
  letter-spacing: -0.50px;
  line-height: 28px;
  white-space: nowrap;
}

.hero-goal-section .goal-progress-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 11px;
  padding: 20px 18px;
  position: relative;
  align-self: center;
  width: 100%;
  max-width: 100%;
  flex: 0 0 auto;
  background-color: #ffffff4c;
  border-radius: 16px;
  border: 1px solid;
  border-color: #ffffff66;
  backdrop-filter: blur(12px) brightness(100%);
  -webkit-backdrop-filter: blur(12px) brightness(100%);
  box-sizing: border-box;
}

.hero-goal-section .container-5 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  align-self: stretch;
  width: 100%;
  position: relative;
  flex: 0 0 auto;
}

.hero-goal-section .container-6 {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
}

.hero-goal-section .container-7 {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  flex: 0 0 auto;
}

.hero-goal-section .img {
  position: relative;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
}

.hero-goal-section .container-8 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  opacity: 0.8;
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
}

.hero-goal-section .text-wrapper-8 {
  position: relative;
  width: 100%;
  height: auto;
  margin-top: -1.00px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: -0.40px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #4b4433;
  white-space: normal;
  word-break: keep-all;
}

.hero-goal-section .text-wrapper-9 {
  position: relative;
  display: flex;
  align-items: center;
  height: 28px;
  margin-top: -1.00px;
  font-weight: 700;
  color: #4b4433;
  font-size: 18px;
  letter-spacing: 0;
  line-height: 28px;
  white-space: nowrap;
}

.hero-goal-section .overlay {
  position: relative;
  align-self: stretch;
  width: 100%;
  height: 11px;
  background-color: #4b44331a;
  border-radius: 9999px;
  overflow: hidden;
}

.hero-goal-section .background-shadow {
  position: relative;
  height: calc(100% - 1px);
  top: 1px;
  background-color: #4b4433;
  border-radius: 9999px;
  box-shadow: 0px 0px 8px #4b443333;
  transition: width 1s cubic-bezier(0.25, 0.8, 0.25, 1); /* 애니메이션 부드럽게 추가 */
}

.hero-goal-section .container-9 {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  width: 100%;
  opacity: 0.8;
  position: relative;
  flex: 0 0 auto;
}

.hero-goal-section .p {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 17px;
  margin-top: -1.00px;
  font-weight: 500;
  color: #4b4433;
  font-size: 12px;
  text-align: center;
  letter-spacing: -0.3px;
  line-height: 16.5px;
  white-space: normal;
  word-break: keep-all;
}
</style>
