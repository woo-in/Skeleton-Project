<script setup lang="ts"></script>

<template>
  <nav
    class="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md bg-white border-t border-gray-200 rounded-t-[28px] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe"
  >
    <div class="flex justify-around items-center h-24 px-4">
      <!-- 홈 -->
      <RouterLink to="/home" custom v-slot="{ isActive, navigate }">
        <button @click="navigate" class="flex flex-col items-center justify-center w-full">
          <div
            class="flex flex-col items-center justify-center transition-all duration-200"
            :class="
              isActive ? 'bg-[#FAD06A] rounded-[18px] w-[58px] h-[58px]' : 'w-[58px] h-[58px]'
            "
          >
            <img
              :src="isActive ? '/images/nav/home-brown.png' : '/images/nav/home-gray.png'"
              alt="홈"
              class="w-8 h-8 object-contain mb-1"
            />
            <span
              class="text-[11px] font-semibold"
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
              isActive ? 'bg-[#FAD06A] rounded-[18px] w-[58px] h-[58px]' : 'w-[58px] h-[58px]'
            "
          >
            <img
              :src="isActive ? '/images/nav/report-brown.png' : '/images/nav/report-gray.png'"
              alt="분석"
              class="w-8 h-8 object-contain mb-1"
            />
            <span
              class="text-[11px] font-semibold"
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
              isActive ? 'bg-[#FAD06A] rounded-[18px] w-[58px] h-[58px]' : 'w-[58px] h-[58px]'
            "
          >
            <img
              :src="isActive ? '/images/nav/settings-brown.png' : '/images/nav/settings-gray.png'"
              alt="설정"
              class="w-8 h-8 object-contain mb-1"
            />
            <span
              class="text-[11px] font-semibold"
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
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

button {
  -webkit-tap-highlight-color: transparent;
}
</style>
