<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { animate } from 'motion'

const props = withDefaults(
  defineProps<{
    displayValue: number // 중앙에 표시될 숫자 (꿀 비율인 숫자)
    fillPercentage: number // 숫자 범위별로 계산된 실제 꿀통 채움 비율 (0~100)
    guidelinePercentage?: number // 가이드라인 비율 변수 (0~100)
    valueSuffix?: string // 숫자 뒤에 붙는 단위 (예: '%')
  }>(),
  {
    guidelinePercentage: 70,
    valueSuffix: '%',
  },
)

const animatedDisplayValue = ref(props.displayValue)
const animatedFillPercent = ref(props.fillPercentage)

// 중앙 숫자 애니메이션
watch(
  () => props.displayValue,
  (newVal) => {
    // 1. 초기값 설정
    const startValue = animatedDisplayValue.value

    // 2. animate(시작값, 끝값, 옵션)
    animate(startValue, newVal, {
      duration: 1,
      onUpdate: (latest) => {
        // latest가 숫자로 들어오므로 이를 ref에 할당
        animatedDisplayValue.value = Math.floor(latest)
      },
    })
  },
  { immediate: true },
)

// 꿀 채워지는 높이 애니메이션
watch(
  () => props.fillPercentage,
  (newVal) => {
    animate(animatedFillPercent.value, newVal, {
      duration: 1,
      onUpdate: (latest: number) => {
        animatedFillPercent.value = latest
      },
    })
  },
  { immediate: true },
)

// 꿀의 CSS height 값 (0~100% 사이로 제한)
const fillHeight = computed(() => `${Math.min(Math.max(animatedFillPercent.value, 0), 100)}%`)
</script>

<template>
  <div class="relative w-64 h-64 flex items-center justify-center">
    <!-- Bees -->
    <div class="absolute top-0 left-0 z-30 pointer-events-none animate-fly-1">
      <svg
        width="36"
        height="36"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="animate-flap"
          d="M12 10 Q 8 2, 14 6 T 12 10"
          fill="#E1E3E4"
          fill-opacity="0.9"
          style="transform-origin: center"
        />
        <path
          class="animate-flap-delay"
          d="M20 10 Q 24 2, 18 6 T 20 10"
          fill="#E1E3E4"
          fill-opacity="0.9"
          style="transform-origin: center"
        />
        <ellipse cx="16" cy="18" rx="8" ry="6" fill="#FFBC50" />
        <path
          d="M11 14 Q 16 13, 21 14"
          stroke="#4a3e31"
          stroke-width="2.5"
          stroke-linecap="round"
        />
        <path d="M9 18 Q 16 17, 23 18" stroke="#4a3e31" stroke-width="2.5" stroke-linecap="round" />
        <path
          d="M11 22 Q 16 21, 21 22"
          stroke="#4a3e31"
          stroke-width="2.5"
          stroke-linecap="round"
        />
        <circle cx="20" cy="16" r="1.5" fill="#4a3e31" />
        <path d="M23 14 Q 26 10, 28 12" stroke="#4a3e31" stroke-width="1" fill="none" />
      </svg>
    </div>

    <div class="absolute top-16 right-0 z-30 scale-x-[-1] pointer-events-none animate-fly-2">
      <svg
        width="36"
        height="36"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="animate-flap"
          d="M12 10 Q 8 2, 14 6 T 12 10"
          fill="#E1E3E4"
          fill-opacity="0.9"
          style="transform-origin: center"
        />
        <path
          class="animate-flap-delay"
          d="M20 10 Q 24 2, 18 6 T 20 10"
          fill="#E1E3E4"
          fill-opacity="0.9"
          style="transform-origin: center"
        />
        <ellipse cx="16" cy="18" rx="8" ry="6" fill="#FFBC50" />
        <path
          d="M11 14 Q 16 13, 21 14"
          stroke="#4a3e31"
          stroke-width="2.5"
          stroke-linecap="round"
        />
        <path d="M9 18 Q 16 17, 23 18" stroke="#4a3e31" stroke-width="2.5" stroke-linecap="round" />
        <path
          d="M11 22 Q 16 21, 21 22"
          stroke="#4a3e31"
          stroke-width="2.5"
          stroke-linecap="round"
        />
        <circle cx="20" cy="16" r="1.5" fill="#4a3e31" />
        <path d="M23 14 Q 26 10, 28 12" stroke="#4a3e31" stroke-width="1" fill="none" />
      </svg>
    </div>

    <!-- The Pot Container -->
    <div class="relative w-56 h-56">
      <!-- Guideline Exclamation Icon (Outside overflow-hidden to overlap border) -->
      <div class="absolute top-2 left-0 w-full h-full pointer-events-none z-30">
        <div
          class="absolute left-[-32px] flex items-center justify-center w-7 h-7 bg-[#ff3b30] text-white font-black text-sm rounded-full border-[2.5px] border-white shadow-sm transition-all duration-500"
          :style="{ bottom: `calc(${guidelinePercentage}% - 14px)` }"
        >
          !
        </div>
      </div>

      <!-- Pot Rim (Top) -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#4a3e31] rounded-full z-20 shadow-md"
      ></div>

      <!-- Pot Body -->
      <div
        class="absolute top-2 left-0 w-full h-full bg-white/10 backdrop-blur-[2px] border-[6px] border-[#4a3e31] rounded-[50%_50%_45%_45%_/_40%_40%_60%_60%] overflow-hidden flex items-center justify-center shadow-inner"
      >
        <!-- Honey Fill Container (z-0) -->
        <div
          :style="{ height: fillHeight }"
          class="absolute bottom-0 left-[-20%] w-[140%] bg-[#FFBC50] transition-all duration-500 ease-out z-0"
        >
          <!-- Wave Overlay -->
          <div
            class="absolute top-[-15px] left-0 w-[200%] h-10 opacity-90 animate-wave"
            style="
              background-image: url('data:image/svg+xml;utf8,<svg viewBox=&quot;0 0 100 20&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><path d=&quot;M0 10 Q 25 0 50 10 T 100 10 V 20 H 0 Z&quot; fill=&quot;%23FFBC50&quot;/></svg>');
              background-size: 50% 100%;
              background-repeat: repeat-x;
            "
          ></div>

          <!-- Inner Honey Gradient -->
          <div class="w-full h-full bg-gradient-to-t from-[#eab308] to-[#FFBC50]"></div>
        </div>

        <!-- Guideline Dashed Line (z-5: Above honey, below text) -->
        <div
          class="absolute left-0 w-full border-t-[3px] border-dashed border-[#ff3b30] transition-all duration-500 z-[5]"
          :style="{ bottom: `${guidelinePercentage}%` }"
        ></div>

        <!-- Percentage Text (z-10) -->
        <div class="relative z-10 flex flex-col items-center">
          <span
            class="text-6xl font-black text-stone-900 font-headline tracking-tighter drop-shadow-md select-none"
          >
            {{ animatedDisplayValue }}{{ valueSuffix }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes wave {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0%);
  }
}
.animate-wave {
  animation: wave 2s linear infinite;
}

@keyframes fly-1 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(20deg);
  }
  66% {
    transform: translate(-15px, -15px) rotate(-15deg);
  }
}
.animate-fly-1 {
  animation: fly-1 8s ease-in-out infinite;
}

@keyframes fly-2 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(-35px, -20px) rotate(-15deg);
  }
  66% {
    transform: translate(20px, -35px) rotate(20deg);
  }
}
.animate-fly-2 {
  animation: fly-2 9s ease-in-out infinite;
}

@keyframes flap {
  from {
    transform: scaleY(0.5) rotate(-15deg);
  }
  to {
    transform: scaleY(1.2) rotate(15deg);
  }
}
.animate-flap {
  animation: flap 0.08s infinite alternate;
}
.animate-flap-delay {
  animation: flap 0.08s infinite alternate 0.04s;
}
</style>
