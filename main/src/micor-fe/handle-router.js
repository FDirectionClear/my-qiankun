import { getApps } from "."
import { importHTML } from "./import-html"
import { getPrevRoute, getNextRoute } from "./rewrite-router"

export async function handleRouter() {
  console.log('handleRouter，乾坤扩展逻辑触发')
  const apps = getApps()
  /**
   * 
   */
  const prevApp = apps.find(item => getPrevRoute().startsWith(item.activeRule))
  /**
   * 1. 根据当前路由，找到匹配的子应用。
   *  规则：拿到当前页面路径，找哪一个子应用的activePath对应上了
   */
  const app = apps.find(item => getNextRoute().startsWith(item.activeRule))
  
  /**
   * 如果先前的路由存在对应的子应用，先卸载上一个已经挂载的子应用，然后再加载新的子应用。防止子应用堆叠。
   * PS：unmount具体解绑的逻辑要依赖于子应用的unmount钩子中的内容。
   */
  if (prevApp) {
    await unmount(prevApp)
  }

  
  /**
   * 2. fetch对应子应用的html首包资源
   */
  if (!app) {
    return 
  }
  const appUrl = app.entry
  
  const { execScripts, template }  = await importHTML(appUrl)
  const container = document.querySelector(app.container)
  container.appendChild(template)

  // 配置全局环境变量
  window.__POWERED_BY_QIANKUN__ = true
  /**
   * 子应用打包出的静态文件，比如一开始就存在的图片或者js资源，他们的publicPath都是静态的，参考vue.config.js中的publicPath。
   * 而__webpack_public_path__是运行时的，没法在webpack打包子应用的时候读取__webpack_public_path__。
   * 
   * 但是在运行时存在__webpack_public_path__，那么运行时添加静态资源时会无视vue.config.js中配置的publicPath。
   * 比如，() => import('./test.js)，或者子应用template中的静态资源，这些都是在运行时处理的，因而会使用__webpack_public_path__。
   * 
   * 这也是为什么，子应用可以使用__webpack_public_path__来解决在主应用环境下，静态资源无法正确加载的问题。
   * 
   */
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = app.entry + '/'

  const appExports = await execScripts()

  app.bootstrap = appExports.bootstrap
  app.mount = appExports.mount
  app.unmount = appExports.unmount

  await bootstrap(app)
  await mount(app)


  async function bootstrap(app) {
    app.bootstrap && await app.bootstrap()
  }

  async function mount(app) {
    app.mount && await app.mount({
      container: document.querySelector(app.container)
    })
  }

  async function unmount(app) {
    app.unmount && await app.unmount({
      container: document.querySelector(app.container)
    })
  }
} 
