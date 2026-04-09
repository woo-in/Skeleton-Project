<template>
  <div class="div-wrapper">
    <main class="main">
      <HeroReportCard :report="reportData" />
      <PeerComparisonCard :report="reportData"/>
      <OppurtunityCost :report="reportData" />
      <WeeklyAnalysisCard :report="reportData" />
    </main>
  </div>
</template>

<script setup>
import HeroReportCard from './components/HeroReportCard.vue';
import PeerComparisonCard from './components/PeerComparisonCard.vue';
import WeeklyAnalysisCard from './components/WeeklyAnalysisCard.vue';
import OppurtunityCost from './components/OppurtunityCost.vue';
import {ref, onMounted} from 'vue';
import axios from 'axios';


// Vite proxy는 '/api' 경로만 프록시하므로 반드시 leading slash가 필요합니다.
const BASEURI = '/api/reports';

const reportData = ref(null);

// const currentUser = {
//   id: "S0U5oduKb5A", // 테스트하고 싶은 memberId
//   name: "정우인"
// };



// onMounted(async () => {
//   // 1. 가장 먼저 로그인 세션 확인
//   const sessionStr = localStorage.getItem('userSession');

//   // 2. 비로그인 상태 방어 (Early Return)
//   if (!sessionStr) {
//     console.log("로그인 안된 상태! 리포트 데이터를 불러오지 않습니다.");
//     reportData.value = null;
//     return; // 더 이상 아래 코드를 실행하지 않고 여기서 종료
//   }

//   // 3. 로그인 상태라면 유저 정보 파싱
//   const currentUser = JSON.parse(sessionStr); 
//   console.log("현재 로그인한 유저: ", currentUser.name);

//   // 4. API 통신
//   try {
//     // 이제 currentUser가 확실히 존재하므로 안전하게 .id에 접근 가능
//     const response = await axios.get(`${BASEURI}?memberId=${currentUser.id}`);
    
//     // 필터링 결과 처리
//     if (response.data && response.data.length > 0) {
//       reportData.value = response.data[0];
//     } else {
//       console.log("해당 유저의 리포트가 없습니다.");
//       reportData.value = null;
//     }
//   } catch (error) {
//     console.error("API 통신 중 에러가 발생했습니다:", error);
//   }
// });
onMounted(async () => {
  try {
    // 무조건 id가 1인 유저의 리포트를 가져오도록 하드코딩
    const targetId = 1; 
    console.log(`테스트 모드: memberId=${targetId}의 리포트를 요청합니다.`);

    // API 통신 (currentUser.id 대신 targetId 사용)
    const response = await axios.get(`${BASEURI}?memberId=${targetId}`);
    
    // 필터링 결과 처리
    if (response.data && response.data.length > 0) {
      reportData.value = response.data[0];
      console.log("리포트 데이터 로드 성공:", reportData.value);
    } else {
      console.log("해당 유저의 리포트가 없습니다.");
      reportData.value = null;
    }
  } catch (error) {
    console.error("API 통신 중 에러가 발생했습니다:", error);
  }
});
</script>

<style scoped>
.div-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  width: 100%;
  padding: 0px 0px 128px;
  position: relative;
  background-color: #f9f9fb;
  box-sizing: border-box;
}

.div-wrapper .main {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  align-items: stretch;
  gap: 24px;
  padding: 96px 24px 0px;
  position: relative;
  width: 100%;
  flex: 0 0 auto;
  margin: 0 auto;
  box-sizing: border-box;
}
/* 
.div-wrapper .hero-goal-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 32px;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
  background-color: #ffbc50;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0px 24px 48px #ffbc5033;
}

.div-wrapper .icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 135px;
  height: 135px;
}

.div-wrapper .container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
}

.div-wrapper .div {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
}

.div-wrapper .container-2 {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  position: relative;
  flex: 0 0 auto;
}

.div-wrapper .container-3 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
  opacity: 0.8;
}

.div-wrapper .text-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 103.27px;
  height: 20px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #4b4433;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 20px;
  white-space: nowrap;
}

.div-wrapper .div-2 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
}

.div-wrapper .text-wrapper-2 {
  position: relative;
  width: 191.17px;
  height: 64px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #4b4433;
  font-size: 24px;
  letter-spacing: -0.60px;
  line-height: 32px;
}

.div-wrapper .overlay-border {
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

.div-wrapper .text-wrapper-3 {
  position: relative;
  display: flex;
  align-items: center;
  width: 57.91px;
  height: 15px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #4b4433;
  font-size: 10px;
  letter-spacing: 1.00px;
  line-height: 15px;
  white-space: nowrap;
}

.div-wrapper .container-4 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
}

.div-wrapper .container-5 {
  display: flex;
  align-items: center;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
  opacity: 0.9;
}

.div-wrapper .text-wrapper-4 {
  position: relative;
  display: flex;
  align-items: center;
  width: 39.81px;
  height: 20px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #4b4433;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 20px;
  white-space: nowrap;
}

.div-wrapper .horizontal-border {
  position: relative;
  width: 67.56px;
  height: 17px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: #4b443366;
}

.div-wrapper .text-wrapper-5 {
  position: absolute;
  top: -2px;
  left: 0;
  width: 68px;
  height: 20px;
  display: flex;
  align-items: center;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #4b4433;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 20px;
  white-space: nowrap;
}

.div-wrapper .heading {
  position: relative;
  align-self: stretch;
  width: 100%;
  height: 45px;
}

.div-wrapper .text-wrapper-6 {
  position: absolute;
  top: 0;
  left: 0;
  width: 159px;
  height: 45px;
  font-family: "Manrope-ExtraBold", Helvetica;
  font-weight: 800;
  font-size: 36px;
  letter-spacing: -0.90px;
  line-height: 45px;
  display: flex;
  align-items: center;
  color: #4b4433;
  white-space: nowrap;
}

.div-wrapper .text-wrapper-7 {
  position: absolute;
  top: 14px;
  left: 163px;
  width: 60px;
  height: 28px;
  display: flex;
  align-items: center;
  opacity: 0.8;
  font-family: "WenQuanYi Zen Hei-Medium", Helvetica;
  font-weight: 500;
  color: #4b4433;
  font-size: 20px;
  letter-spacing: -0.90px;
  line-height: 28px;
  white-space: nowrap;
}

.div-wrapper .goal-progress-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 11px;
  padding: 28px 20px 20px;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
  background-color: #ffffff4c;
  border-radius: 16px;
  border: 1px solid;
  border-color: #ffffff66;
  backdrop-filter: blur(12px) brightness(100%);
  -webkit-backdrop-filter: blur(12px) brightness(100%);
}

.div-wrapper .container-6 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
}

.div-wrapper .container-7 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
  flex: 0 0 auto;
}

.div-wrapper .div-3 {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  flex: 0 0 auto;
}

.div-wrapper .img {
  position: relative;
  width: 11.67px;
  height: 11.67px;
}

.div-wrapper .container-8 {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  flex: 0 0 auto;
  opacity: 0.8;
}

.div-wrapper .text-wrapper-8 {
  position: relative;
  width: 95.5px;
  height: 16px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: -0.60px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #4b4433;
  white-space: nowrap;
}

.div-wrapper .text-wrapper-9 {
  position: relative;
  display: flex;
  align-items: center;
  width: 38.3px;
  height: 28px;
  margin-top: -1.00px;
  font-family: "Manrope-ExtraBold", Helvetica;
  font-weight: 800;
  color: #4b4433;
  font-size: 18px;
  letter-spacing: 0;
  line-height: 28px;
  white-space: nowrap;
}

.div-wrapper .overlay {
  position: relative;
  align-self: stretch;
  width: 100%;
  height: 11px;
  background-color: #4b44331a;
  border-radius: 9999px;
  overflow: hidden;
}

.div-wrapper .background-shadow {
  position: relative;
  width: 82.00%;
  height: calc(100% - 1px);
  top: 1px;
  background-color: #4b4433;
  border-radius: 9999px;
  box-shadow: 0px 0px 8px #4b443333;
}

.div-wrapper .container-9 {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
  opacity: 0.8;
}

.div-wrapper .p {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 196.47px;
  height: 17px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #4b4433;
  font-size: 11px;
  text-align: center;
  letter-spacing: 0;
  line-height: 16.5px;
  white-space: nowrap;
}

.div-wrapper .section-social-peer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 24px;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
  background-color: #ffffff;
  border-radius: 24px;
  border: 1px solid;
  border-color: #e6e8eb;
  box-shadow: 0px 1px 2px #0000000d;
}

.div-wrapper .container-10 {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0px 0px 12px;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
}

.div-wrapper .text-wrapper-10 {
  position: relative;
  display: flex;
  align-items: center;
  width: 96.88px;
  height: 24px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #1a1a1a;
  font-size: 16px;
  letter-spacing: 0;
  line-height: 24px;
  white-space: nowrap;
}

.div-wrapper .text-wrapper-11 {
  position: relative;
  display: flex;
  align-items: center;
  width: 146.78px;
  height: 20px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #7d7569;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 20px;
  white-space: nowrap;
}

.div-wrapper .background {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 6px 12px;
  position: relative;
  flex: 0 0 auto;
  background-color: #ffefd1;
  border-radius: 16px;
}

.div-wrapper .text-wrapper-12 {
  position: relative;
  display: flex;
  align-items: center;
  width: 58.73px;
  height: 20px;
  margin-top: -1.00px;
  font-family: "Manrope-ExtraBold", Helvetica;
  font-weight: 800;
  color: #4b4433;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 20px;
  white-space: nowrap;
}

.div-wrapper .background-wrapper {
  position: relative;
  align-self: stretch;
  width: 100%;
  height: 16px;
  background-color: #fff6e6;
  border-radius: 9999px;
  overflow: hidden;
}

.div-wrapper .background-2 {
  width: 82.00%;
  height: 100%;
  background-color: #ffbc50;
  border-radius: 9999px;
}

.div-wrapper .container-11 {
  position: relative;
  align-self: stretch;
  width: 54.17px;
}

.div-wrapper .text-wrapper-13 {
  position: absolute;
  top: -1px;
  left: 0;
  width: 54px;
  height: 17px;
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

.div-wrapper .container-12 {
  position: relative;
  align-self: stretch;
  width: 111.84px;
}

.div-wrapper .text-wrapper-14 {
  position: absolute;
  top: -1px;
  left: 0;
  width: 112px;
  height: 17px;
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

.div-wrapper .section-opportunity {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15.4px;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
}

.div-wrapper .text-wrapper-15 {
  position: relative;
  display: flex;
  align-items: center;
  width: 219.63px;
  height: 28px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #1a1a1a;
  font-size: 20px;
  letter-spacing: -0.50px;
  line-height: 28px;
  white-space: nowrap;
}

.div-wrapper .icon-2 {
  position: relative;
  width: 15px;
  height: 15px;
}

.div-wrapper .text-wrapper-16 {
  position: relative;
  align-self: stretch;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #7d7569;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 22.8px;
}

.div-wrapper .container-13 {
  display: grid;
  grid-template-columns: 342px;
  grid-template-rows: 93px 90px 90px;
  height: fit-content;
  gap: 12px;
  padding: 8.6px 0px 0px;
}

.div-wrapper .delivery {
  position: relative;
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  width: 100%;
  height: 93px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 24px;
  border: 1px solid;
  border-color: #f2f4f7;
}

.div-wrapper .container-14 {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  position: relative;
  flex: 0 0 auto;
}

.div-wrapper .container-wrapper {
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #fff7ed;
  border-radius: 16px;
}

.div-wrapper .icon-3 {
  position: relative;
  width: 20px;
  height: 14px;
}

.div-wrapper .container-15 {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  position: relative;
  flex: 0 0 auto;
}

.div-wrapper .text-wrapper-17 {
  position: relative;
  display: flex;
  align-items: center;
  width: 55.33px;
  height: 23px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #1a1a1a;
  font-size: 15px;
  letter-spacing: 0;
  line-height: 22.5px;
  white-space: nowrap;
}

.div-wrapper .text-wrapper-18 {
  position: relative;
  display: flex;
  align-items: center;
  width: 90.94px;
  height: 16px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #7d7569;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 16px;
  white-space: nowrap;
}

.div-wrapper .container-16 {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
}

.div-wrapper .text-wrapper-19 {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 67.67px;
  height: 28px;
  margin-top: -1.00px;
  font-family: "Manrope-ExtraBold", Helvetica;
  font-weight: 800;
  color: #4b4433;
  font-size: 18px;
  text-align: right;
  letter-spacing: 0;
  line-height: 28px;
  white-space: nowrap;
}

.div-wrapper .background-3 {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 2px 6px;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
  background-color: #fff7ed;
  border-radius: 6px;
}

.div-wrapper .text-wrapper-20 {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 56.48px;
  height: 15px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #ea580c;
  font-size: 10px;
  text-align: right;
  letter-spacing: 0;
  line-height: 15px;
  white-space: nowrap;
}

.div-wrapper .shopping {
  position: relative;
  grid-row: 2 / 3;
  grid-column: 1 / 2;
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 24px;
  border: 1px solid;
  border-color: #f2f4f7;
}

.div-wrapper .background-4 {
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #faf5ff;
  border-radius: 16px;
}

.div-wrapper .icon-4 {
  position: relative;
  width: 16px;
  height: 20px;
}

.div-wrapper .text-wrapper-21 {
  position: relative;
  display: flex;
  align-items: center;
  width: 57.44px;
  height: 23px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #1a1a1a;
  font-size: 15px;
  letter-spacing: 0;
  line-height: 22.5px;
  white-space: nowrap;
}

.div-wrapper .text-wrapper-22 {
  position: relative;
  display: flex;
  align-items: center;
  width: 95.69px;
  height: 16px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #7d7569;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 16px;
  white-space: nowrap;
}

.div-wrapper .container-17 {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
  flex: 0 0 auto;
}

.div-wrapper .text-wrapper-23 {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 63.39px;
  height: 28px;
  margin-top: -1.00px;
  font-family: "Manrope-ExtraBold", Helvetica;
  font-weight: 800;
  color: #4b4433;
  font-size: 18px;
  text-align: right;
  letter-spacing: 0;
  line-height: 28px;
  white-space: nowrap;
}

.div-wrapper .coffee {
  position: relative;
  grid-row: 3 / 4;
  grid-column: 1 / 2;
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 24px;
  border: 1px solid;
  border-color: #f2f4f7;
}

.div-wrapper .background-5 {
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #fffbeb;
  border-radius: 16px;
}

.div-wrapper .icon-5 {
  position: relative;
  width: 18px;
  height: 18px;
}

.div-wrapper .text-wrapper-24 {
  position: relative;
  display: flex;
  align-items: center;
  width: 70.41px;
  height: 23px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #1a1a1a;
  font-size: 15px;
  letter-spacing: 0;
  line-height: 22.5px;
  white-space: nowrap;
}

.div-wrapper .text-wrapper-25 {
  position: relative;
  display: flex;
  align-items: center;
  width: 95.77px;
  height: 16px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #7d7569;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 16px;
  white-space: nowrap;
}

.div-wrapper .text-wrapper-26 {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 69.5px;
  height: 28px;
  margin-top: -1.00px;
  font-family: "Manrope-ExtraBold", Helvetica;
  font-weight: 800;
  color: #4b4433;
  font-size: 18px;
  text-align: right;
  letter-spacing: 0;
  line-height: 28px;
  white-space: nowrap;
}

.div-wrapper .section-weekly {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  padding: 32px;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
  background-color: #ffffff;
  border-radius: 32px;
  border: 1px solid;
  border-color: #e6e8eb;
}

.div-wrapper .text-wrapper-27 {
  position: relative;
  display: flex;
  align-items: center;
  align-self: stretch;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #1a1a1a;
  font-size: 18px;
  letter-spacing: -0.45px;
  line-height: 28px;
}

.div-wrapper .container-18 {
  display: flex;
  height: 192px;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0px 8.02px 0px 8px;
  position: relative;
  align-self: stretch;
  width: 100%;
}

.div-wrapper .horizontal-divider {
  position: absolute;
  width: 100%;
  height: calc(100% - 191px);
  top: 4px;
  left: 0;
  border-top-width: 1px;
  border-top-style: solid;
  border-color: #4b4433;
  opacity: 0.05;
}

.div-wrapper .horizontal-divider-2 {
  position: absolute;
  width: 100%;
  height: calc(100% - 191px);
  top: 96px;
  left: 0;
  border-top-width: 1px;
  border-top-style: solid;
  border-color: #4b4433;
  opacity: 0.05;
}

.div-wrapper .horizontal-divider-3 {
  position: absolute;
  width: 100%;
  height: calc(100% - 191px);
  top: 187px;
  left: 0;
  border-top-width: 1px;
  border-top-style: solid;
  border-color: #4b4433;
  opacity: 0.05;
}

.div-wrapper .container-wrapper-2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 11px 0px 0px;
  position: relative;
  flex: 1;
  flex-grow: 1;
  margin-left: -276px;
}

.div-wrapper .text-wrapper-28 {
  position: relative;
  display: flex;
  align-items: center;
  width: 9.52px;
  height: 17px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #7d7569;
  font-size: 11px;
  letter-spacing: 0;
  line-height: 16.5px;
  white-space: nowrap;
}

.div-wrapper .container-19 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 11px;
  position: relative;
  flex: 1;
  flex-grow: 1;
  margin-left: -276px;
}

.div-wrapper .horizontal-divider-4 {
  position: relative;
  max-width: 28px;
  width: 28px;
  height: 1px;
  background-color: #ffffff01;
  border-radius: 12px 12px 0px 0px;
  box-shadow: 0px 4px 12px #ffbc504c;
}

.div-wrapper .text-wrapper-29 {
  position: relative;
  display: flex;
  align-items: center;
  width: 9.52px;
  height: 17px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #4b4433;
  font-size: 11px;
  letter-spacing: 0;
  line-height: 16.5px;
  white-space: nowrap;
}

.div-wrapper .overlay-2 {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
  background-color: #ffbc501a;
  border-radius: 16px;
}

.div-wrapper .background-border {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #ffffff;
  border-radius: 9999px;
  border: 1px solid;
  border-color: #ffbc5033;
  box-shadow: 0px 1px 2px #0000000d;
}

.div-wrapper .icon-6 {
  position: relative;
  width: 18.33px;
  height: 14.17px;
}

.div-wrapper .container-20 {
  position: relative;
  width: 180px;
  height: 95px;
}

.div-wrapper .container-21 {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  position: absolute;
  top: -1px;
  left: 0;
}

.div-wrapper .div-4 {
  position: relative;
  width: 170.42px;
  height: 46px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #4b4433;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 14px;
}

.div-wrapper .span {
  line-height: 22.8px;
}

.div-wrapper .text-wrapper-30 {
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #4b4433;
  font-size: 14px;
  letter-spacing: 0;
}

.div-wrapper .element-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  position: absolute;
  top: 49px;
  left: 0;
}

.div-wrapper .element {
  position: relative;
  width: 166.11px;
  height: 46px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #4b4433;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 14px;
}

.div-wrapper .header-topappbar {
  display: flex;
  flex-direction: column;
  width: 390px;
  align-items: flex-start;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #ffffffcc;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: #e6e8eb;
  backdrop-filter: blur(12px) brightness(100%);
  -webkit-backdrop-filter: blur(12px) brightness(100%);
}

.div-wrapper .heading-wrapper {
  display: flex;
  max-width: 672px;
  height: 64px;
  align-items: center;
  padding: 0px 129.87px 0px 129.86px;
  position: relative;
  width: 100%;
}

.div-wrapper .text-wrapper-31 {
  position: relative;
  display: flex;
  align-items: center;
  width: 130.27px;
  height: 28px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #4b4433;
  font-size: 20px;
  letter-spacing: -1.00px;
  line-height: 28px;
  white-space: nowrap;
}

.div-wrapper .bottom-nav-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  bottom: 0;
  background-color: #fffffff2;
  border-radius: 32px 32px 0px 0px;
  border-top-width: 1px;
  border-top-style: solid;
  border-color: #e6e8eb;
  backdrop-filter: blur(20px) brightness(100%);
  -webkit-backdrop-filter: blur(20px) brightness(100%);
  width: 390px;
  position: absolute;
  left: 0;
}

.div-wrapper .bottomnavbar-shadow {
  height: 100%;
  top: 0;
  background-color: #ffffff01;
  box-shadow: 0px 4px 6px -4px #0000001a, 0px 10px 15px -3px #0000001a;
  width: 390px;
  position: absolute;
  left: 0;
}

.div-wrapper .container-22 {
  display: flex;
  max-width: 672px;
  align-items: center;
  gap: 76.6px;
  padding: 16px 62.35px 32px 62.31px;
  position: relative;
  width: 100%;
  flex: 0 0 auto;
}

.div-wrapper .link {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
  flex: 0 0 auto;
}

.div-wrapper .icon-7 {
  position: relative;
  width: 16px;
  height: 18px;
}

.div-wrapper .text-wrapper-32 {
  position: relative;
  display: flex;
  align-items: center;
  width: 8.66px;
  height: 15px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #7d7569;
  font-size: 10px;
  letter-spacing: 0;
  line-height: 15px;
  white-space: nowrap;
}

.div-wrapper .link-2 {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 0 0 auto;
}

.div-wrapper .background-6 {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 20px;
  position: relative;
  flex: 0 0 auto;
  background-color: #ffefd1;
  border-radius: 9999px;
}

.div-wrapper .text-wrapper-33 {
  position: relative;
  display: flex;
  align-items: center;
  width: 17.3px;
  height: 15px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #4b4433;
  font-size: 10px;
  letter-spacing: 0;
  line-height: 15px;
  white-space: nowrap;
}

.div-wrapper .icon-8 {
  position: relative;
  width: 20.1px;
  height: 20px;
}

.div-wrapper .text-wrapper-34 {
  position: relative;
  display: flex;
  align-items: center;
  width: 17.3px;
  height: 15px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #7d7569;
  font-size: 10px;
  letter-spacing: 0;
  line-height: 15px;
  white-space: nowrap;
} */

</style> 