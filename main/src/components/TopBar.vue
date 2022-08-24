<template>
  <div class="topbar-wrapper">
      <div>这里是主应用区域</div>
  </div>
</template>

<style scoped>
.topbar-wrapper {
  height: 50px;
  background: skyblue;
}
.topbar-wrapper div {
  height: 100%;
  font-size: 2em;
  text-align: center;
  vertical-align: middle;
}
.topbar-wrapper div::before {
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
</style>