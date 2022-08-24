import './public-path'
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

let instance = null

window.gname = "方向明"

function render(props = {}) {
  console.log('vue2 render')
  const { container } = props
  instance = new Vue({
    render: h => h(App),
  })
  instance.$mount(container ? container.querySelector('#app') : '#app')
}

if(!window.__POWERED_BY_QIANKUN__) {
  render()
}

/**
 * 子应用需要暴露的钩子，需要返回Prmise实例
 */
export async function bootstrap() {
  console.log('vue2 app bootstrap!')
}

export async function mount(props) {
  console.log('vue2 props from main', props)
  render(props)
}

export async function unmount(props) {
  console.log('vue2 app unmount')
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
}
