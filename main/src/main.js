import { createApp } from 'vue'
import App from './App.vue'
// import { registerMicroApps, start } from 'qiankun'
import { registerMicroApps, start } from './micor-fe'
import router from './router/index'

import './common/global.css'

registerMicroApps([
  {
    name: "vue2-app",
    entry: "//localhost:8081",
    container: "#subitem-container",
    activeRule: "/vue2"
  },
  {
    name: "vue3-app",
    entry: "//localhost:8082",
    container: "#subitem-container",
    activeRule: "/vue3"
  }
])

start({
  sandbox: {
    strictStyleIsolation: true,
    experimentalStyleIsolation: true
  }
})

createApp(App).use(router).mount('#app')

