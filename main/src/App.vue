<template>
  <div class="main-app">
    <TopBar></TopBar>
    <div class="main-app-body">
      <AsideBar></AsideBar>
      <div id="subitem-container" class="subitem-container"></div>
    </div>
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import AsideBar from './components/AsideBar.vue'

export default {
  name: 'App',
  components: {
    AsideBar,
    TopBar
  }
}
</script>

<style>
.main-app-body {
  border: 1px red solid;
  display: flex;
}
#subitem-container {
  border: 1px purple solid;
  flex: 1
}
</style>
