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

/**
 * 1. 注册子应用
 * 2. 监听路由变化，请求子应用，渲染子应用
 *  1）实操点：
    *  2.1 子应用跨域问题
    *  2.2 子应用静态资源publicPath配置
    *  2.3 子应用的library -> umd打包
    *  2.4 子应用entry，配置qiankun生命周期钩子
 *  2）实现原理：
 *     2.5 
 *        2.5.1 浏览器的前进后退按钮、history.go()、forward()、backward()... -> window.onpopstate
 *        2.5.2 window.history.pushState()、window.history.replaceState()
 *          2.5.2.1 实践技巧：先缓存原生的pushState，然后再覆盖原生的pushState，覆盖后的逻辑，包含执行原生的pushState，注意this指向需要保留。
 *        2.5.3 handleRouter的操作应该在初始化时也执行一次。
 *          原因：切换路由后原地刷新，页面刷新后，各类路由监听方法不会得到触发，子应用就不会得到渲染。所以需要在初始化时（start时）手动执行一次handleRouter，
 *               就当路由已经发生了变化。
 * 
 *     2.6 fetchResource()方法去请求子应用的首包，res.text()转变成文本。
 * 
 *     2.7 首包是dom，可以挂载到主应用的container上。
 *       2.7.1 问题：dom可以挂载，但是限于浏览器安全政策，子应用的html中js资源不会得到执行。
 *       答案：转换思路，挂载子应用的html，但是把html中的js内容再提取出来，在主应用作用域内单独执行js。
 *      
 *     2.8 将html请求后，借助import-html第三方包，拆分js、dom、style。利用eval执行子应用的js，dom和style则直接挂载。
 *       2.8.1 问题：import-html的核心原理是什么？
 *             答案：
 *                 1）fetchResource请求下来html文本，然后创建一个div标签，将 div.innerHTML = html文本
 *                 2）div下找script标签。script标签分为两种情况：
 *                    1）内联式 -> 获取 script.innerHTML
 *                    2) 外联式 -> fetchResource请求script标签的src。
 *                        2.1）小细节：src可能有http开头，那么就直接用src，如不不是，就拼接子应用的app.entry。
 *                
 *       2.8.1 问题：样式没有得到隔离，子应用样式会污染全局。
 *             原因：很多style标签都是后插入body中的，像是vue组件中的样式，都是通过js动态插入style标签在body上，而body正是主应用的body，所以会污染主应用。
 *             答案：见 2.10
 *       2.8.2 问题：js执行后，子应用的vue挂载到了主应用的#app上，导致主应用被覆盖。
 *             原因：归根结底是主应用的dom和子应用的dom混咋，可能存在主应用和子应用具有相同的id节点，子应用的js执行后，直接将应用挂在了主应用的id节点上了。
 *             答案：在eval之前，设置全局变量__POWERED_BY_QIANKUN__。同时给子应用传递container。子应用中包装render()函数，在子应用vue挂载时，如果_POWERED_BY_QIANKUN__、
 *                  存在，就只在container的范围下选择需要挂在到的id节点。否则，就是子应用单独启动，此时就正常来就行，和主应用没关系了。
 *       2.8.3 问题：如何拿到子应用的生命周期钩子
 *             答案：方式一：由于是umd打包，直接从window[appname]中就能取到子应用入口文件中导出钩子函数。
 *                    缺陷：appname是全局变量，容易冲突。
 *                  方式二：通过构造commonJS环境，使得umd打包的结果为commonJS模块。
 *                    方法：在执行子应用js之前，构造 module 和 module.exports 变量
 * 
 *     2.9 样式隔离
 *      2.9.1 方式一：为子应用的所有节点增加qiankun专属属性。子应用所有选择器都夹杂qiankun的专属属性选择器。
 *      2.9.2 方式二：shallowDom。
 *            优点：简单、属于浏览器特性。
 *            缺陷：浏览器兼容性差、样式隔离的同时，主应用的js无法访问shallowDom内的节点？导致dom操作失灵等问题。
 * 
 *      2.10 切换路由时清空已经渲染了的子应用。
 *        2.10.1 方法：调取子应用的unmount钩子。unmount钩子中vue.unmount()、container.innerHTML = ""
 *    
 *    
 * 
 *  
 */

