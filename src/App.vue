<template>
  <div class="iphone-pro-max">
    <main class="app-content">
      <TopBar v-if="route.meta.showTopBar" />
      <RouterView />
      <BottomNav v-if="route.meta.showBottomNav" />
    </main>
  </div>
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'
import TopBar from '@/components/TopBar.vue'

const route = useRoute()
</script>

<style>
html,
body,
#app {
  min-height: 100%;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
}

#app {
  display: flex;
  align-items: center;
  justify-content: center;
}

.iphone-pro-max {
  --device-width: 430px;
  --device-height: 932px;
  width: min(100vw, var(--device-width));
  height: min(100vh, var(--device-height));
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
}

.app-content {
  height: 100%;
  overflow-y: auto;
}
</style>
