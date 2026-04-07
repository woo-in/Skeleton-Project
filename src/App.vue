<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <p>© 2026 Your Team Name. All rights reserved.</p>
  </footer>
</template>

<script setup>
import { RouterView } from 'vue-router'
// 전역적으로 쓰일 컴포넌트(네비게이션 바 등)가 있다면 여기서 import 하세요.
</script>

<style scoped>
/* App.vue 전용 스타일 (필요시 작성) */
header {
  line-height: 1.5;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

nav {
  display: flex;
  gap: 1rem;
}

main {
  padding: 2rem;
  min-height: 80vh;
}
</style>
