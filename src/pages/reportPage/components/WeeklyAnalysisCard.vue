<template>
<div class="section-weekly">
      <div class="heading"><div class="text-wrapper">지난달 요일별 분석</div></div>
      <div class="container">
        <div class="horizontal-divider"></div>
        <div class="div"></div>
        <div class="horizontal-divider-2"></div>
        <div class="container-wrapper">
          <div class="container-2"><div class="text-wrapper-2">월</div></div>
        </div>
        <div class="container-wrapper">
          <div class="container-2"><div class="text-wrapper-2">화</div></div>
        </div>
        <div class="container-3">
          <div class="horizontal-divider-3"></div>
          <div class="container-2"><div class="text-wrapper-3">수</div></div>
        </div>
        <div class="container-wrapper">
          <div class="container-2"><div class="text-wrapper-2">목</div></div>
        </div>
        <div class="container-wrapper">
          <div class="container-2"><div class="text-wrapper-2">금</div></div>
        </div>
        <div class="container-wrapper">
          <div class="container-2"><div class="text-wrapper-2">토</div></div>
        </div>
        <div class="container-wrapper">
          <div class="container-2"><div class="text-wrapper-2">일</div></div>
        </div>
      </div>
      <div class="overlay">
        <div class="background-border">
          <span class="icon" aria-hidden="true">💡</span>
        </div>
        <div class="container-4">
          <div class="div-wrapper">
            <p class="p">
              <span class="span">지난달 </span> <span class="text-wrapper-4">수요일 지출이 가장 적었네요.</span>
            </p>
          </div>
          <div class="element-wrapper">
            <p class="element">
              <span class="span">평소보다 </span>
              <span class="text-wrapper-4">42% 더</span>
              <span class="span"> 아꼈습니다!<br />칭찬해요 👏</span>
            </p>
          </div>
        </div>
      </div>
    </div>
</template>


<style scoped>
.section-weekly {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  padding: 32px;
  position: relative;
  align-self: stretch;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 32px;
  border: 1px solid;
  border-color: #e6e8eb;
}

.section-weekly .heading {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  align-self: stretch;
  width: 100%;
  flex: 0 0 auto;
}

.section-weekly .text-wrapper {
  display: flex;
  align-items: center;
  align-self: stretch;
  color: #1a1a1a;
  font-size: 18px;
  letter-spacing: -0.45px;
  line-height: 28px;
  position: relative;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
}

.section-weekly .container {
  display: flex;
  height: 192px;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0px 8.02px 0px 8px;
  position: relative;
  align-self: stretch;
  width: 100%;
}

.section-weekly .horizontal-divider {
  position: absolute;
  width: 100%;
  height: calc(100% - 191px);
  top: 4px;
  left: 0;
  border-top-width: 1px;
  border-top-style: solid;
  border-color: #4b4433;
  opacity: 0.05;
}

.section-weekly .div {
  position: absolute;
  width: 100%;
  height: calc(100% - 191px);
  top: 96px;
  left: 0;
  border-top-width: 1px;
  border-top-style: solid;
  border-color: #4b4433;
  opacity: 0.05;
}

.section-weekly .horizontal-divider-2 {
  position: absolute;
  width: 100%;
  height: calc(100% - 191px);
  top: 187px;
  left: 0;
  border-top-width: 1px;
  border-top-style: solid;
  border-color: #4b4433;
  opacity: 0.05;
}

.section-weekly .container-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 11px 0px 0px;
  position: relative;
  flex: 1;
  flex-grow: 1;
  margin-left: 0;
}

.section-weekly .container-2 {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  flex: 0 0 auto;
}

.section-weekly .text-wrapper-2 {
  position: relative;
  display: flex;
  align-items: center;
  width: 9.52px;
  height: 17px;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #7d7569;
  font-size: 11px;
  letter-spacing: 0;
  line-height: 16.5px;
  white-space: nowrap;
}

.section-weekly .container-3 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 11px;
  position: relative;
  flex: 1;
  flex-grow: 1;
  margin-left: 0;
}

.section-weekly .horizontal-divider-3 {
  position: relative;
  max-width: 28px;
  width: 28px;
  height: 1px;
  background-color: #ffffff01;
  border-radius: 12px 12px 0px 0px;
  box-shadow: 0px 4px 12px #ffbc504c;
}

.section-weekly .text-wrapper-3 {
  display: flex;
  align-items: center;
  width: 9.52px;
  height: 17px;
  color: #4b4433;
  font-size: 11px;
  letter-spacing: 0;
  line-height: 16.5px;
  white-space: nowrap;
  position: relative;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
}

.section-weekly .overlay {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  position: relative;
  align-self: center;
  width: 100%;
  max-width: 100%;
  flex: 0 0 auto;
  background-color: #ffbc501a;
  border-radius: 16px;
  box-sizing: border-box;
}

.section-weekly .background-border {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #ffffff;
  border-radius: 9999px;
  border: 1px solid;
  border-color: #ffbc5033;
  box-shadow: 0px 1px 2px #0000000d;
}

.section-weekly .icon {
  position: relative;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
}

.section-weekly .container-4 {
  position: relative;
  width: 180px;
  height: 95px;
}

.section-weekly .div-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  position: absolute;
  top: -1px;
  left: 0;
}

.section-weekly .p {
  width: 170.42px;
  height: 46px;
  color: #4b4433;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 14px;
  position: relative;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
}

.section-weekly .span {
  line-height: 22.8px;
}

.section-weekly .text-wrapper-4 {
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
  color: #4b4433;
  font-size: 14px;
  letter-spacing: 0;
}

.section-weekly .element-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  position: absolute;
  top: 49px;
  left: 0;
}

.section-weekly .element {
  width: 166.11px;
  height: 46px;
  color: #4b4433;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 14px;
  position: relative;
  margin-top: -1.00px;
  font-family: "Pretendard Variable-Regular", Helvetica;
  font-weight: 400;
}

</style>