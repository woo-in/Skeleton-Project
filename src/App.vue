<template>
  <div class="iphone-pro-max">
    <header>
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/report">Report</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <p>© 2026 Your Team Name. All rights reserved.</p>
  </footer>

  </div>
  
</template>


<script setup>
import { RouterView, RouterLink } from 'vue-router'
// 전역적으로 쓰일 컴포넌트(네비게이션 바 등)가 있다면 여기서 import 하세요.
</script>



<style>
/* App.vue의 style에 넣거나, 
   전역 CSS 파일(main.css 등)에 정의하는 것이 좋습니다. 
*/
.iphone-pro-max {
  width: 430px;
  height: 932px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background-color: #ffffff; /* 배경색은 내용에 맞춰 조절 */
  
  /* [선택사항] 폰 느낌을 내기 위한 그림자나 테두리 */
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  border: 1px solid #ddd;
}

/* PC 배경색을 지정하고 싶을 때 */
body {
  background-color: #f5f5f5;
  margin: 0;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 원할 때 */
  justify-content: center;
  min-height: 100vh;
}
</style>
