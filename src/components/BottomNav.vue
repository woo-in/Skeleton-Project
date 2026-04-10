<script setup lang="ts"></script>

<template>
  <nav
    class="bottom-nav fixed left-1/2 -translate-x-1/2 z-50 bg-white border-t border-gray-200 rounded-t-[24px] shadow-[0_-4px_18px_rgba(0,0,0,0.05)] pb-safe"
  >
    <div class="flex justify-around items-center h-20 px-3">
      <!-- 홈 -->
      <RouterLink to="/home" custom v-slot="{ isActive, navigate }">
        <button @click="navigate" class="flex flex-col items-center justify-center w-full">
          <div
            class="flex flex-col items-center justify-center transition-all duration-200"
            :class="
              isActive ? 'bg-[#FAD06A] rounded-[16px] w-[52px] h-[52px]' : 'w-[52px] h-[52px]'
            "
          >
            <img
              :src="isActive ? '/images/nav/home-brown.png' : '/images/nav/home-gray.png'"
              alt="홈"
              class="w-7 h-7 object-contain mb-0.5"
            />
            <span
              class="text-[10px] font-semibold"
              :class="isActive ? 'text-[#5b3b16]' : 'text-[#9CA3AF]'"
            >
              홈
            </span>
          </div>
        </button>
      </RouterLink>

      <!-- 분석 -->
      <RouterLink to="/report" custom v-slot="{ isActive, navigate }">
        <button @click="navigate" class="flex flex-col items-center justify-center w-full">
          <div
            class="flex flex-col items-center justify-center transition-all duration-200"
            :class="
              isActive ? 'bg-[#FAD06A] rounded-[16px] w-[52px] h-[52px]' : 'w-[52px] h-[52px]'
            "
          >
            <img
              :src="isActive ? '/images/nav/report-brown.png' : '/images/nav/report-gray.png'"
              alt="분석"
              class="w-7 h-7 object-contain mb-0.5"
            />
            <span
              class="text-[10px] font-semibold"
              :class="isActive ? 'text-[#5b3b16]' : 'text-[#9CA3AF]'"
            >
              분석
            </span>
          </div>
        </button>
      </RouterLink>

      <!-- 설정 -->
      <RouterLink to="/setting" custom v-slot="{ isActive, navigate }">
        <button @click="navigate" class="flex flex-col items-center justify-center w-full">
          <div
            class="flex flex-col items-center justify-center transition-all duration-200"
            :class="
              isActive ? 'bg-[#FAD06A] rounded-[16px] w-[52px] h-[52px]' : 'w-[52px] h-[52px]'
            "
          >
            <img
              :src="isActive ? '/images/nav/settings-brown.png' : '/images/nav/settings-gray.png'"
              alt="설정"
              class="w-7 h-7 object-contain mb-0.5"
            />
            <span
              class="text-[10px] font-semibold"
              :class="isActive ? 'text-[#5b3b16]' : 'text-[#9CA3AF]'"
            >
              설정
            </span>
          </div>
        </button>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  width: min(100vw, var(--device-width, 430px));
  bottom: calc((100vh - min(100vh, var(--device-height, 932px))) / 2);
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

button {
  -webkit-tap-highlight-color: transparent;
}
</style>
