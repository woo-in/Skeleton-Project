<template>
  <section class="op-cost" aria-labelledby="op-cost-title">
    <header class="op-cost__head">
      <h2 id="op-cost-title" class="op-cost__title">이번 달 더 아끼면 몇 주 살까?</h2>
      <span class="op-cost__help" aria-hidden="true">
        <svg
          class="op-cost__help-svg"
          viewBox="327 6 15 15.5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M334.463 18.5C334.725 18.5 334.947 18.4094 335.128 18.2281C335.309 18.0469 335.4 17.825 335.4 17.5625C335.4 17.3 335.309 17.0781 335.128 16.8969C334.947 16.7156 334.725 16.625 334.463 16.625C334.2 16.625 333.978 16.7156 333.797 16.8969C333.616 17.0781 333.525 17.3 333.525 17.5625C333.525 17.825 333.616 18.0469 333.797 18.2281C333.978 18.4094 334.2 18.5 334.463 18.5ZM333.787 15.6125H335.175C335.175 15.2 335.222 14.875 335.316 14.6375C335.409 14.4 335.675 14.075 336.113 13.6625C336.438 13.3375 336.694 13.0281 336.881 12.7344C337.069 12.4406 337.163 12.0875 337.163 11.675C337.163 10.975 336.906 10.4375 336.394 10.0625C335.881 9.6875 335.275 9.5 334.575 9.5C333.862 9.5 333.284 9.6875 332.841 10.0625C332.397 10.4375 332.088 10.8875 331.912 11.4125L333.15 11.9C333.213 11.675 333.353 11.4312 333.572 11.1687C333.791 10.9062 334.125 10.775 334.575 10.775C334.975 10.775 335.275 10.8844 335.475 11.1031C335.675 11.3219 335.775 11.5625 335.775 11.825C335.775 12.075 335.7 12.3094 335.55 12.5281C335.4 12.7469 335.213 12.95 334.988 13.1375C334.438 13.625 334.1 13.9938 333.975 14.2438C333.85 14.4938 333.787 14.95 333.787 15.6125ZM334.5 21.5C333.463 21.5 332.487 21.3031 331.575 20.9094C330.662 20.5156 329.869 19.9812 329.194 19.3062C328.519 18.6312 327.984 17.8375 327.591 16.925C327.197 16.0125 327 15.0375 327 14C327 12.9625 327.197 11.9875 327.591 11.075C327.984 10.1625 328.519 9.36875 329.194 8.69375C329.869 8.01875 330.662 7.48438 331.575 7.09062C332.487 6.69687 333.463 6.5 334.5 6.5C335.538 6.5 336.512 6.69687 337.425 7.09062C338.338 7.48438 339.131 8.01875 339.806 8.69375C340.481 9.36875 341.016 10.1625 341.409 11.075C341.803 11.9875 342 12.9625 342 14C342 15.0375 341.803 16.0125 341.409 16.925C341.016 17.8375 340.481 18.6312 339.806 19.3062C339.131 19.9812 338.338 20.5156 337.425 20.9094C336.512 21.3031 335.538 21.5 334.5 21.5ZM334.5 20C336.175 20 337.594 19.4188 338.756 18.2563C339.919 17.0938 340.5 15.675 340.5 14C340.5 12.325 339.919 10.9062 338.756 9.74375C337.594 8.58125 336.175 8 334.5 8C332.825 8 331.406 8.58125 330.244 9.74375C329.081 10.9062 328.5 12.325 328.5 14C328.5 15.675 329.081 17.0938 330.244 18.2563C331.406 19.4188 332.825 20 334.5 20Z"
            fill="#D1D1D1"
          />
        </svg>
      </span>
    </header>

    <p class="op-cost__desc">
      지난달 지출이 가장 높았던 항목들이에요.<br />
      지출했던 항목들을 주식으로 환산하면 이만큼입니다.
    </p>

    <template v-if="report">
      <ul class="op-cost__list">
        <li
          v-for="category in report.topCategories"
          :key="category.categoryId"
          class="op-cost__card"
          :class="category.rank === 1 ? 'op-cost__card--tall' : 'op-cost__card--short'"
        >
          <div class="op-cost__left">
            <div class="op-cost__icon-wrap">
              <img
                :src="category.categoryImageUrl"
                :alt="category.categoryName"
                class="op-cost__category-icon"
              />
            </div>

            <div class="op-cost__text">
              <span class="op-cost__name">{{ category.categoryName }}</span>
              <span class="op-cost__sub">지난달 {{ category.amount.toLocaleString() }}원 지출</span>
            </div>
          </div>

          <div class="op-cost__right" :class="{ 'op-cost__right--stack': category.rank === 1 }">
            <span class="op-cost__shares">+{{ category.additionalQuantity }}주</span>

            <span v-if="category.rank === 1" class="op-cost__badge">절약 집중 항목</span>
          </div>
        </li>
      </ul>
      <p v-if="report.summaryComment" class="op-cost__summary">
        {{ report.summaryComment }}
      </p>
    </template>
    <div v-else>데이터 로딩 중...</div>
  </section>
</template>


<script setup>
defineProps({
  report: Object,
})

</script>

<style scoped>


.op-cost {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 14px;
  position: relative;
  box-sizing: border-box;
  align-self: center;
}

.op-cost__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.op-cost__title {
  margin: 0;
  font-family: 'Pretendard Variable', Pretendard, Helvetica, system-ui, sans-serif;
  font-weight: 800;
  font-size: 19px;
  line-height: 1.35;
  letter-spacing: -0.5px;
  color: #1a1a1a;
}

.op-cost__help {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.op-cost__help-svg {
  width: 15px;
  height: 15px;
  display: block;
}

.op-cost__desc {
  margin: 0;
  font-family: 'Pretendard Variable', Pretendard, Helvetica, system-ui, sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22.8px;
  color: #7d7569;
  word-break: keep-all;
}

.op-cost__list {
  list-style: none;
  margin: 0;
  padding: 8.6px 0 0;
  display: flex;
  flex-direction: column;
  gap: 13px;
  width: 100%;
}

.op-cost__card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  padding: 16px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 20px;
  border: 1px solid #efe7dc;
  box-shadow: 0 10px 24px rgba(75, 68, 51, 0.05);
}

.op-cost__card--tall {
  min-height: 92px;
}

.op-cost__card--short {
  min-height: 89px;
}

.op-cost__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1 1 auto;
}

.op-cost__icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.op-cost__icon-wrap--delivery {
  background-color: #fff7ed;
}

.op-cost__icon-wrap--shopping {
  background-color: #faf5ff;
}

.op-cost__icon-wrap--cafe {
  background-color: #fffbeb;
}

.op-cost__category-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.op-cost__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
}

.op-cost__name {
  font-family: 'Pretendard Variable', Pretendard, Helvetica, system-ui, sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 22.5px;
  color: #1a1a1a;
  word-break: keep-all;
}

.op-cost__sub {
  font-family: 'Pretendard Variable', Pretendard, Helvetica, system-ui, sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #7d7569;
  word-break: keep-all;
}

.op-cost__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
  max-width: 40%;
}

.op-cost__right--stack {
  gap: 4px;
}

.op-cost__shares {
  font-family: Manrope, 'Manrope-ExtraBold', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(16px, 4.5vw, 18px);
  line-height: 1.35;
  color: #4b4433;
  text-align: right;
  white-space: nowrap;
}

.op-cost__badge {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  padding: 2px 6px;
  border-radius: 6px;
  background-color: #fff7ed;
  font-family: 'Pretendard Variable', Pretendard, Helvetica, system-ui, sans-serif;
  font-weight: 400;
  font-size: 10px;
  line-height: 15px;
  color: #ea580c;
  white-space: nowrap;
}

.op-cost__summary {
  margin: 0;
  padding: 15px 16px;
  border-radius: 18px;
  background-color: #fff7ed;
  border: 1px solid #ffbc5033;
  font-family: 'Pretendard Variable', Pretendard, Helvetica, system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.65;
  letter-spacing: -0.2px;
  color: #7a4f1b;
  word-break: keep-all;
}
</style>
