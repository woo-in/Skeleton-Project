<template>
  <div class="KB">
    <div class="background"><div class="gradient-blur"></div></div>
    <div class="container"><div class="div"></div></div>

    <div class="main">
      <div class="container-2">

        <div class="hero-branding">
          <div class="background-shadow">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4b4237" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </div>
          <div class="text-wrapper"><div class="text">로그인</div></div>
        </div>

        <div class="sign-up-form-card">
          <div class="form">

            <div class="form-group">
              <div class="label"><div class="label-text">아이디</div></div>
              <div class="input">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                  <circle cx="8" cy="12" r="2"></circle>
                  <line x1="13" y1="11" x2="19" y2="11"></line>
                  <line x1="13" y1="14" x2="19" y2="14"></line>
                </svg>
                <input class="input-field" v-model="userId" placeholder="아이디를 입력해주세요" type="text" @keyup.enter="loginUser" />
              </div>
            </div>

            <div class="form-group">
              <div class="label"><div class="label-text">비밀번호</div></div>
              <div class="input">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input class="input-field" v-model="password" placeholder="••••••••" type="password" @keyup.enter="loginUser" />
              </div>
            </div>

            <div class="submit-button-button" @click="loginUser" style="cursor: pointer;">
              <div class="submit-text">로그인 하기</div>
            </div>
          </div>

          <div class="footer-links">
            <div class="text-wrapper-3"><div class="text-7">아직 계정이 없으신가요?</div></div>
            <div class="link" style="cursor: pointer;" @click="goToSignUp"><div class="text-8">회원가입으로 이동하기</div></div>
          </div>
        </div>
<!--
        <div class="aesthetic-accent">
          <div class="container-7">
            <div class="background-2"></div>
            <div class="background-2"></div>
            <div class="background-2"></div>
          </div>
        </div> -->
      </div>
    </div>

    <footer class="footer">
      <div class="text-wrapper"><p class="p">© 2026 KB SKELETON PROJECT. ALL RIGHTS RESERVED.</p></div>
    </footer>
    
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 라우터 사용 시 주석 해제

const userId = ref('');
const password = ref('');
const router = useRouter(); // 라우터 사용 시 주석 해제

const loginUser = async () => {
  if (!userId.value || !password.value) {
    alert('아이디와 비밀번호를 모두 입력해주세요.');
    return;
  }

  try {
    // 1. json-server에 아이디와 비밀번호가 일치하는 데이터가 있는지 질의 (쿼리 스트링 사용)
    const response = await fetch(`http://localhost:3000/members?userId=${userId.value}&password=${password.value}`);
    const users = await response.json();

    // 2. 일치하는 데이터가 배열 형태로 반환됨. 길이가 1 이상이면 로그인 성공
    if (users.length > 0) {
      const loggedInUserData = users[0]; // 첫 번째 매칭된 유저 정보 추출

      // alert(`${loggedInUserData.name}님 환영합니다!`);

      // 3. 보안상 비밀번호는 제외하고 필요한 정보만 localStorage에 저장
      const sessionData = {
        userId: loggedInUserData.userId,
        name: loggedInUserData.name,
        monthlyBudget: loggedInUserData.monthlyBudget,
        targetStockId: loggedInUserData.targetStockId,
        targetQuantity: loggedInUserData.targetQuantity,
        ageBand: loggedInUserData.ageBand,
        id: loggedInUserData.id
      };

      localStorage.setItem('userSession', JSON.stringify(sessionData));
      router.push('/home');

    } else {
      // 일치하는 데이터가 없으면 로그인 실패
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  } catch (error) {
    console.error('로그인 에러:', error);
    alert('서버와 통신하는 중 문제가 발생했습니다.');
  }
};


const goToSignUp = () => {
  router.push('/signup');
};

</script>

<style scoped>
/* CSS는 SignupPage.vue와 완전히 동일하게 유지하여 통일성을 줍니다. */
.KB {
  background-color: #fdfcfb;
  width: 100%;
  min-width: 390px;
  min-height: 100vh; /* 화면 꽉 차게 변경 */
  position: relative;
  overflow: hidden;
}

.KB .background, .KB .container {
  display: flex;
  flex-direction: column;
  width: 156px;
  height: 482px;
  position: absolute;
  opacity: 0.3;
}
.KB .background { top: 0; right: 0; }
.KB .container { left: 0; bottom: 0; opacity: 0.2; }

.KB .gradient-blur {
  flex: 1;
  width: 100%;
  filter: blur(60px);
  background: linear-gradient(259deg, rgba(255, 188, 80, 0.4) 0%, rgba(255, 188, 80, 0) 100%);
}

.KB .div {
  flex: 1;
  width: 100%;
  filter: blur(60px);
  background: linear-gradient(79deg, rgba(75, 66, 55, 0.2) 0%, rgba(75, 66, 55, 0) 100%);
}

.KB .main {
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 48px 16px;
  position: absolute;
  top: 15vh; /* 로그인 창을 화면 중앙쯤으로 배치 */
  left: 0;
  box-sizing: border-box;
}

.KB .container-2 {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  gap: 40px;
  position: relative;
}

.KB .hero-branding {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.KB .background-shadow {
  display: flex;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  background-color: #fff0d6;
  border-radius: 16px;
  box-shadow: 0px 1px 2px #0000000d;
}

.KB .text {
  font-family: "WenQuanYi Zen Hei-Medium", sans-serif;
  font-weight: 700;
  color: #4b4237;
  font-size: 30px;
  letter-spacing: -0.75px;
}

.KB .sign-up-form-card {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #eae7e280;
  box-shadow: 0px 20px 50px #4b42370f;
}

.KB .form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.KB .form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.KB .label-text {
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  color: #4b4237;
  font-size: 13px;
  letter-spacing: 0.6px;
}

.KB .input {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 56px;
  background-color: #f6f6f6;
  border-radius: 16px;
  box-sizing: border-box;
}

.KB .input-field {
  flex: 1;
  border: none;
  background: none;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  color: #333;
  outline: none;
}
.KB .input-field::placeholder {
  color: #a8a29c;
}

.KB .submit-button-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 56px;
  background-color: #ffbc50;
  border-radius: 16px;
  box-shadow: 0px 8px 20px #ffbc504c;
  transition: opacity 0.2s;
}

.KB .submit-button-button:active {
  opacity: 0.8;
}

.KB .submit-text {
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  color: #4b4237;
  font-size: 16px;
}

.KB .footer-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 32px;
  border-top: 1px solid #f6f6f6;
}

.KB .text-7 {
  font-family: "Pretendard", sans-serif;
  color: #6b645d;
  font-size: 14px;
}

.KB .text-8 {
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  color: #4b4237;
  font-size: 14px;
}

.KB .aesthetic-accent {
  display: flex;
  justify-content: center;
  padding-top: 16px;
}

.KB .container-7 {
  display: flex;
  gap: 16px;
  opacity: 0.4;
}

.KB .background-2 {
  width: 6px;
  height: 6px;
  background-color: #ffbc50;
  border-radius: 50%;
}

.KB .header {
  position: absolute;
  top: 0;
  left: 0;
  padding: 32px 24px;
}

.KB .text-9 {
  font-family: "WenQuanYi Zen Hei-Medium", sans-serif;
  font-weight: 700;
  color: #4b4237;
  font-size: 20px;
}

.KB .footer {
  position: absolute;
  bottom: 32px;
  width: 100%;
  text-align: center;
}

.KB .p {
  font-family: "Manrope", sans-serif;
  font-weight: 700;
  color: #a8a29c;
  font-size: 10px;
  letter-spacing: 1px;
}
</style>
