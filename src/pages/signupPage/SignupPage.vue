<template>
  <div class="KB">
    <div class="background"><div class="gradient-blur"></div></div>
    <div class="container"><div class="div"></div></div>

    <div class="main">
      <div class="container-2">

        <div class="hero-branding">
          <div class="background-shadow">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4b4237" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="16" y1="11" x2="22" y2="11"></line>
            </svg>
          </div>
          <div class="text-wrapper"><div class="text">회원가입</div></div>
        </div>

        <div class="sign-up-form-card">
          <div class="form">

            <div class="form-group">
              <div class="label"><div class="label-text">이름</div></div>
              <div class="input">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input class="input-field" v-model="name" placeholder="홍길동" type="text" />
              </div>
            </div>

            <div class="form-group">
              <div class="label"><div class="label-text">생년월일</div></div>
              <div class="input">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <input class="input-field" v-model="birthdate" placeholder="YYYYMMDD (예: 19900101)" type="text" maxlength="8" />
              </div>
            </div>

              <div class="form-group">
              <div class="label"><div class="label-text">아이디</div></div>
              <div class="input">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                  <circle cx="8" cy="12" r="2"></circle>
                  <line x1="13" y1="11" x2="19" y2="11"></line>
                  <line x1="13" y1="14" x2="19" y2="14"></line>
                </svg>
                <input class="input-field" v-model="userId" placeholder="아이디를 입력해주세요" type="text" />
              </div>
            </div>


            <div class="password-inputs">
              <div class="form-group">
                <div class="label"><div class="label-text">비밀번호</div></div>
                <div class="input">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input class="input-field" v-model="password" placeholder="••••••••" type="password" />
                </div>
              </div>

              <div class="form-group">
                <div class="label"><div class="label-text">비밀번호 확인</div></div>
                <div class="input">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                    <path d="M12 17v-4a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v4h4z"/>
                    <path d="M9 13v-1a2 2 0 0 1 4 0v1"/>
                  </svg>
                  <input class="input-field" v-model="passwordConfirm" placeholder="••••••••" type="password" />
                </div>
              </div>
            </div>

            <div class="submit-button-button" @click="registerUser" style="cursor: pointer;">
              <div class="submit-text">회원가입 하기</div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b4237" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

          <div class="footer-links">
            <div class="text-wrapper-3"><div class="text-7">이미 계정이 있으신가요?</div></div>
            <div class="link" style="cursor: pointer;" @click="goToLogin"><div class="text-8">로그인으로 돌아가기</div></div>
          </div>
        </div>

        <div class="aesthetic-accent">
          <!-- <div class="container-7">
            <div class="background-2"></div>
            <div class="background-2"></div>
            <div class="background-2"></div>
          </div> -->
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="text-wrapper"><p class="p">© 2026 KB SKELETON PROJECT. ALL RIGHTS RESERVED.</p></div>
    </footer>
    
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 폼 입력 데이터 상태 관리
const userId = ref('');
const name = ref('');
const birthdate = ref('');
const password = ref('');
const passwordConfirm = ref('');

const router = useRouter();

// 유효성 검사 정규식
const idRegex = /^[a-zA-Z0-9]{4,15}$/;
const nameRegex = /^[가-힣]{2,10}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
const birthdateRegex = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;

// 생년월일 기반 연령대(ageBand) 계산 함수
const calculateAgeBand = (birthdateStr) => {
  const birthYear = parseInt(birthdateStr.substring(0, 4), 10);
  const currentYear = 2026;
  const age = currentYear - birthYear;

  if (age < 20) return 'TEENS';
  if (age < 30) return 'TWENTIES';
  if (age < 40) return 'THIRTIES';
  if (age < 50) return 'FORTIES';
  return 'FIFTIES_PLUS';
};

// 회원가입 전송 로직
const registerUser = async () => {
  // 1. 빈 값 검증
  if (!userId.value || !name.value || !birthdate.value || !password.value || !passwordConfirm.value) {
    alert('모든 항목을 입력해주세요.');
    return;
  }

  // 2. 정규식을 통한 형식 유효성 검사
  if (!idRegex.test(userId.value)) {
    alert('아이디는 4~15자의 영문 및 숫자로 입력해주세요.');
    return;
  }
  if (!nameRegex.test(name.value)) {
    alert('이름은 2~10자의 올바른 한글로 입력해주세요.');
    return;
  }
  if (!birthdateRegex.test(birthdate.value)) {
    alert('생년월일은 YYYYMMDD 형식의 8자리 숫자로 입력해주세요. (예: 19900101)');
    return;
  }
  if (!passwordRegex.test(password.value)) {
    alert('비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요.');
    return;
  }
  if (password.value !== passwordConfirm.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    // 3. 아이디 중복 검사 (id가 아닌 userId로 조회하도록 수정)
    const checkParams = new URLSearchParams({ userId: userId.value });
    checkParams.set('__resource', 'members');
    const checkResponse = await fetch(`/api/mock-data?${checkParams.toString()}`);
    const existingUsers = await checkResponse.json();

    if (existingUsers.length > 0) {
      alert('이미 사용 중인 아이디입니다.');
      return;
    }

    // 4. 나이대(AgeBand) 계산
    const ageBand = calculateAgeBand(birthdate.value);

    // 5. API로 보낼 페이로드 구성 ('id' 대신 'userId' 필드 사용)
    const userData = {
      userId: userId.value, // 수정된 부분!
      name: name.value,
      birthdate: birthdate.value, // (옵션) 생년월일도 DB에 남기고 싶다면 추가
      password: password.value,
      monthlyBudget: 0,
      targetStockId: null,
      targetQuantity: 0,
      ageBand: ageBand
    };

    // 6. DB에 POST 요청
    const response = await fetch('/api/mock-data?__resource=members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const createdUserData = await response.json();
      const sessionData = {
        userId: createdUserData.userId,
        name: createdUserData.name,
        monthlyBudget: createdUserData.monthlyBudget,
        targetStockId: createdUserData.targetStockId,
        targetQuantity: createdUserData.targetQuantity,
        ageBand: createdUserData.ageBand,
        id: createdUserData.id,
      };

      localStorage.setItem('userSession', JSON.stringify(sessionData));
      router.push('/setup');

      // 성공 시 폼 초기화
      userId.value = '';
      name.value = '';
      birthdate.value = '';
      password.value = '';
      passwordConfirm.value = '';
    } else {
      alert('회원가입 처리 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('회원가입 요청 에러:', error);
    alert('서버와 통신하는 중 문제가 발생했습니다. API 상태를 확인해주세요.');
  }
};

const goToLogin = () => {
  router.push('/login');
};

</script>

<style scoped>
.KB {
  background-color: #fdfcfb;
  width: 100%;
  min-width: 390px;
  min-height: 1206px;
  position: relative;
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
  top: 92px;
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

.KB .password-inputs {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
