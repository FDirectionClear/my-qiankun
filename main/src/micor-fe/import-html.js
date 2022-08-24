import { fetchResource } from "./fetch-resource"

export const importHTML = async (url) => {
  const html = await fetchResource(url)
  const template = document.createElement('div')
  template.innerHTML = html

  const scripts = template.querySelectorAll('script')

  // 获取所有 script 标签的代码
  async function getExternalScripts() {
    return Promise.all(Array.from(scripts).map(script => {
      const src = script.getAttribute('src')
      if (!src) {
        // 如果是内联的script，直接返回js内容
        return Promise.resolve(script.innerHTML)
      } else {
        // 如果是外联的script，进行请求拉去js内容
        return fetchResource(
          src.startsWith('http') ? src : `${url}${src}`
        )
      }
    }))
  }

  // 获取并执行所有 script 脚本
  async function execScripts() {
    const scripts = await getExternalScripts()

    // 手动构造一个commonJS环境，实现通过module.exports拿到子应用入口暴露的钩子函数
    const module = { exports: {} }
    const exports = module.exports

    scripts.forEach(code => {
      eval(code)
    })

    return module.exports

    // 借助webpack的umd打包规范，使用全局变量名的方式拿到子应用入口暴露的钩子函数也是一种办法，但是有缺陷：
    // 1. 需要知道子应用的名字
    // 2. 会污染全局环境，如果有不同的子应用用了相同的名字，或者子应用名字与其他地方定义的全局变量名相同，就会造成覆盖，从而造成bug。因此必须解决子应用重名和
    // 全局变量冲突的问题。
    // return window['app-vue2-subitem']
  }

  return {
    template,
    getExternalScripts,
    execScripts
  }
}
