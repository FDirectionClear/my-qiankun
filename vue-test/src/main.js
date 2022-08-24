import './public-path'
import { createApp } from 'vue'
import App from './App.vue'

let instance = null 

function render(props = {}) {
  console.log('vue3 render')
  const { container } = props
  instance = createApp(App)
  instance.mount(container ? container.querySelector('#app') : '#app')
}

if(!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  console.log('vue3 app bootstrap!')
}

export async function mount(props) {
  console.log('vue3 props from main', props)
  render(props)
}

export async function unmount() {
  console.log('vue3 app unmount', instance)
  instance.unmount('#app');
  instance._container.innerHTML = '';
  instance = null;
}
