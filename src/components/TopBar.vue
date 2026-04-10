<template>
  <header class="global-header">
    <div class="logo-text">내 주식 어디갔어?</div>
  </header>
</template>

<style scoped>
.global-header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem; /* px-6 */
  height: 4rem; /* h-16 */
  border-bottom: 1px solid rgba(214, 210, 206, 0.2);
  box-sizing: border-box;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #2D2926;
  font-family: "WenQuanYi Zen Hei-Medium", sans-serif;
}

</style>
