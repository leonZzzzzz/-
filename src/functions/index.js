export function functions(functions, options, callback) {
    this.$http[functions](options).then((res) => {
        if (callback) {
            callback(res)
        }
    })
}

/**
 * 打开新窗口
 * @param {Object} obj $router.resolve需要的参数
 */
export function openNewPage(obj) {
  // obj = {
  //   path: path, 路由（必传）
  //   query: query, 参数（可选）
  //   name: name 目标组件的name（可选）
  // }
  // 缓存跳转前的路由，当目标页用go(-1)无法返回时，可使用$router.replace(fromPagePath)返回
  // 注意：这里需要用sessionStorage，因为sessionStorage多个窗口不会共享数据。不然同打开多个窗口的情况下之前的fromPagePath会被后面的覆盖
  sessionStorage.setItem('fromPagePath', this.$route.path)
  let newpage = this.$router.resolve(obj)
  window.open(newpage.href, '_blank')
}
/**
 * 返回上一页
 */
export function openNewPageBack() {
  // history.back(-1):直接返回当前页的上一页，数据全部消息，是个新页面
  // history.go(-1):也是返回当前页的上一页，不过表单里的数据全部还在
  if (window.history.length > 1) {
    this.$router.go(-1)
  } else if (sessionStorage.getItem('fromPagePath')) {
    // 通过自定义openNewPage方法打开的新窗口会缓存上级页面的路由fromPagePath
    this.$router.replace(sessionStorage.getItem('fromPagePath'))
    sessionStorage.removeItem('fromPagePath')
  }
}

