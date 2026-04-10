<template>
  <div class="settings-page">

    <main class="main-content">
      <section class="profile-section">
        <div class="text-avatar">
          {{ userName ? userName.charAt(0) : '' }}
        </div>

        <h2 class="greeting">{{ userName }}님, 오늘도 성투하세요!</h2>
      </section>

     <section class="menu-section">
        <div class="menu-card">
          <div class="menu-item" @click="goToSettings">
            <span class="menu-text">생활비 및 목표 주식 재설정</span>
            <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1cdc7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>

          <div class="menu-item" @click="logoutUser">
            <span class="menu-text">로그아웃</span>
            <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1cdc7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>내 주식 어디갔어? v2.4.0</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const userName = ref('투자자');
const router = useRouter();

onMounted(() => {
  const sessionStr = localStorage.getItem('userSession');
  if (sessionStr) {
    try {
      const user = JSON.parse(sessionStr);
      if (user.name) userName.value = user.name;
    } catch (e) {
      console.error('세션 정보를 불러오는 중 에러 발생:', e);
    }
  }
});

const goToSettings = () => {
  alert('생활비 및 목표 주식 설정 페이지로 이동합니다.');
};

const logoutUser = () => {
  // 로그아웃 시 확인창 추가 (UX 개선)
  if (confirm('로그아웃 하시겠습니까?')) {
    localStorage.removeItem('userSession');
    router.push('/login');
  }
};
</script>

<style scoped>
.settings-page {
  background-color: #fdfcfb;
  width: 100%;
  min-width: 390px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: "Pretendard", sans-serif;
  color: #4b4237;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eae7e280;
  background-color: #ffffff;
}

.header-title {
  font-family: "WenQuanYi Zen Hei-Medium", sans-serif;
  font-weight: 700;
  font-size: 20px;
  margin: 0;
}

.main-content {
  flex: 1;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* 새로 추가된 텍스트 아바타 스타일 */
.text-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #ffbc50; /* 테마 컬러에 맞춘 노란색 배경 */
  color: #ffffff; /* 흰색 글씨 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 24px;
  box-shadow: 0px 8px 20px rgba(255, 188, 80, 0.4); /* 은은한 그림자 */
}

.greeting {
  font-weight: 800;
  font-size: 24px;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.menu-section {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 12px;
  font-weight: 800;
  color: #a8a29c;
  letter-spacing: 1px;
  margin: 0 0 4px 8px;
}

.menu-card {
  background-color: #f9f8f7;
  border-radius: 20px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.menu-item:active {
  transform: scale(0.98);
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.05);
}

.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.yellow-box {
  background-color: #fff8eb;
}

.white-box {
  background-color: #ffffff;
  border: 1px solid #eae7e280;
}

.menu-text {
  flex: 1;
  font-weight: 700;
  font-size: 16px;
  color: #4b4237;
}

.chevron {
  margin-left: 8px;
}

.footer {
  padding: 24px;
  text-align: center;
}

.footer p {
  color: #a8a29c;
  font-size: 12px;
  font-weight: 500;
  margin: 0;
}
</style>
