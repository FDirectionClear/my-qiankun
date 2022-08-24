import { handleRouter } from './handle-router'
import { rewriteRouter } from './rewrite-router'
/**
 * 乾坤核心原理：
 * 1. 注册微应用信息
 * 2. 监视路由变化
 * 3. 路由变换时匹配子应用
 * 4. 获取子应用资源，挂载dom，执行js
 */

let _apps = []

export const getApps = () => _apps

export function registerMicroApps(apps) {
  /**
   * 1. 注册微应用信息
   */
  _apps = apps
}

export function start() {
  console.log('qiankun start')
  rewriteRouter()
  // 路由监听事件在每次初始化页面时不会触发，但子应用仍需要在初始化时得到处理。所以需要再start中手动调用一次handleRouter。
  handleRouter()
}

