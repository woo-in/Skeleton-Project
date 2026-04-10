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
        <p class="p">
          <span>지난달 </span> 
          <strong>수요일 지출이 가장 적었네요.</strong>
        </p>
        <p class="element">
          <span>평소보다 </span> 
          <strong>42% 더</strong> 
          <span>아꼈습니다!<br />칭찬해요 👏</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

// canvas 엘리먼트를 참조하기 위한 ref
const chartCanvas = ref(null);

onMounted(() => {
  if (chartCanvas.value) {
    new Chart(chartCanvas.value, {
      type: 'line',
      data: {
        labels: ['월', '화', '수', '목', '금', '토', '일'],
        datasets: [{
          label: '지출',
          // 수요일(15)이 가장 낮도록 목업 데이터 구성
          data: [60, 45, 15, 35, 40, 75, 90], 
          borderColor: '#7a1e1e', // 짙은 붉은색 라인
          backgroundColor: '#7a1e1e',
          borderWidth: 2,
          pointBackgroundColor: '#7a1e1e',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0 // 0으로 설정하여 선을 직선으로 꺾이게 함
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, // 상단 범례 숨김
          tooltip: { 
            enabled: true, // 💡 툴팁 활성화
            backgroundColor: 'rgba(75, 68, 51, 0.9)', // 툴팁 배경색 설정
            padding: 10,
            displayColors: false, // 툴팁 내 컬러 박스 숨김
            titleFont: { size: 13, family: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" },
            bodyFont: { size: 14, family: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" },
            callbacks: {
              // 툴팁에 표시될 텍스트 커스텀 (예: 15 -> 15만 원)
              label: function(context) {
                return context.parsed.y + '만 원'; 
              }
            }
          }
        },
        // 점에 마우스를 올리기 쉽게 호버 영역을 넓혀줍니다
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          x: {
            grid: {
              display: false, // x축 배경 세로선 숨김
              drawBorder: false
            },
            ticks: {
              color: '#7d7569',
              font: { size: 12 }
            }
          },
          y: {
            display: false, // y축 숫자와 가로선 모두 숨김
            min: 0,
            max: 100 // 차트 상하 여백 확보
          }
        },
        layout: {
          padding: { left: 10, right: 10, top: 10, bottom: 0 }
        }
      }
    });
  }
});
</script>

<style scoped>
/* 전체 컨테이너 */
.section-weekly {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 20px;
  background-color: #ffffff;
  border-radius: 24px;
  border: 1px solid #e6e8eb;
  font-family: "Pretendard Variable", Pretendard, -apple-system, sans-serif;
  max-width: 360px; /* 화면 비율에 맞게 조절하세요 */
}

/* 제목 */
.heading .text-wrapper {
  margin: 0;
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 600;
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
  gap: 16px;
  padding: 20px;
  background-color: #fff8f0; /* 부드러운 살구색 배경 */
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
}

.container-4 p {
  margin: 0;
  color: #4b4433;
  font-size: 14px;
  line-height: 1.5;
}

.container-4 strong {
  font-weight: 600;
}
</style>