<template>
  <div class="section-social-peer">
    <div class="container">
      <div class="div">
        <div class="div-wrapper"><div class="text-wrapper">20대 절약 수준</div></div>
        <div class="div-wrapper"><p class="p">지난달 지출 패턴 분석 결과</p></div>
      </div>
      <div class="background"><div class="text-wrapper-2">{{ savingRankLabel }}</div></div>
    </div>
    <div class="background-wrapper">
      <div class="background-2" :style="{ width: `${peerProgressWidth}%` }"></div>
    </div>
    <div class="container-2">
      <div class="container-3"><div class="text-wrapper-3">AVERAGE</div></div>
      <div class="container-4"><div class="text-wrapper-4">SAVING CHAMPION</div></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  report: {
    type: Object,
    default: null,
  },
})

const peerProgressWidth = computed(() => {
  const percentile = Number(props.report?.peerPercentile ?? 0)
  return Math.min(Math.max(percentile, 0), 100)
})

const savingRankLabel = computed(() => `TOP ${100 - peerProgressWidth.value}%`)
</script>

<style scoped>
.section-social-peer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 22px 20px;
  position: relative;
  background-color: #ffffff;
  border-radius: 22px;
  border: 1px solid #efe7dc;
  box-shadow: 0 10px 24px rgba(75, 68, 51, 0.05);
  box-sizing: border-box;
}

.section-social-peer .container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0px 0px 12px;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
}

.section-social-peer .div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
}

.section-social-peer .div-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
}

.section-social-peer .text-wrapper {
  width: auto;
  min-height: 24px;
  color: #1a1a1a;
  font-size: 16px;
  line-height: 24px;
  position: relative;
  display: flex;
  align-items: center;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  letter-spacing: 0;
  white-space: normal;
}

.section-social-peer .p {
  width: auto;
  min-height: 20px;
  color: #7d7569;
  font-size: 14px;
  line-height: 20px;
  position: relative;
  display: flex;
  align-items: center;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  letter-spacing: 0;
  white-space: normal;
}

.section-social-peer .background {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 6px 12px;
  position: relative;
  flex: 0 0 auto;
  background-color: #ffefd1;
  border-radius: 16px;
}

.section-social-peer .text-wrapper-2 {
  position: relative;
  display: flex;
  align-items: center;
  width: auto;
  height: auto;
  margin-top: -1.00px;
  font-family: "Manrope-ExtraBold", Helvetica;
  font-weight: 800;
  color: #4b4433;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 20px;
  white-space: nowrap;
}

.section-social-peer .background-wrapper {
  position: relative;
  align-self: stretch;
  width: 100%;
  height: 12px;
  background-color: #fff6e6;
  border-radius: 9999px;
  overflow: hidden;
}

.section-social-peer .background-2 {
  width: 82.00%;
  height: 100%;
  background-color: #ffbc50;
  border-radius: 9999px;
}

.section-social-peer .container-2 {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
}

.section-social-peer .container-3 {
  position: relative;
  align-self: stretch;
  width: auto;
}

.section-social-peer .text-wrapper-3 {
  position: relative;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #7d7569;
  font-size: 11px;
  letter-spacing: 0.55px;
  line-height: 16.5px;
  white-space: nowrap;
}

.section-social-peer .container-4 {
  position: relative;
  align-self: stretch;
  width: auto;
}

.section-social-peer .text-wrapper-4 {
  position: relative;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #e6a800;
  font-size: 11px;
  letter-spacing: 0.55px;
  line-height: 16.5px;
  white-space: nowrap;
}

</style>
