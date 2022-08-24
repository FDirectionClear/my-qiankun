import { handleRouter } from "./handle-router.js"

let prevRoute = '' // 上一个路由
let nextRoute = window.location.pathname // 下一个路由

export const getPrevRoute = () => prevRoute
export const getNextRoute = () => nextRoute

/**
   * 2. 监视路由变化
   *  2.1 hashChange --> window.onHashChange
   *  2.2 popState --> windnow.onpopstate()
   *     PS：history.go()/back()/forword()、浏览器的前进后退键，不能监视pushState和replaceState造成的路由变换
   *  2.3 window.history.pushState/replaceState
   *    PS：不能监听 history.go()/back()/forword()、浏览器的前进后退键
*/

export function rewriteRouter() {
  window.addEventListener('popstate', () => {
    /**
     * popstate后的window.location.pathname只能拿到变化后的，所以这里要用还未改变的nextRoute座位prevRoute
     */
    prevRoute = nextRoute
    nextRoute = window.location.pathname
    handleRouter()
  })


  
  const rawPushState = window.history.pushState
  window.history.pushState = (...args) => {
    // 导航前，记录prevRoute
    prevRoute = window.location.pathname
    rawPushState.apply(window.history, args)
    // 导航后，记录nextRoute
    nextRoute = window.location.pathname
    handleRouter()
  } 
}
