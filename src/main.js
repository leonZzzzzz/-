import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import utils from './utils/utils'
import api from './api'
import '@/components'
import './plugins/element.js'
import * as filters from './filter' // 全局过滤器
import VueJsonp from 'vue-jsonp'
import clearForm from './mixins/clear-form'
import {
  BASEURL,
  IMGURL,
  projectUrl,
  DEFAULTHEADERIMAGE,
  GROUPAVAER
} from './utils/config'
import './utils/emotionmethod.js'
import VDragged from 'v-dragged'
import VueClipboards from 'vue-clipboard2'

import {
  functions,
  openNewPage,
  openNewPageBack
} from './functions/index'

Vue.config.productionTip = false

Vue.use(VueJsonp)
Vue.mixin(clearForm)
Vue.use(VDragged)
Vue.use(VueClipboards)

Vue.prototype.utils = utils
Vue.prototype.$http = api
Vue.prototype.imgHost = IMGURL
Vue.prototype.imgGroup = GROUPAVAER
Vue.prototype.baseUrl = BASEURL
Vue.prototype.$projectUrl = projectUrl
Vue.prototype.defaultHearderImage = DEFAULTHEADERIMAGE
Vue.prototype.functions = functions

/**
 * 打开新窗口
 * @param {Object} obj $router.resolve需要的参数
 */
Vue.prototype.$openNewPage = openNewPage
// 返回上一页（内部实现：如果go(-1)可用，否则 replace(路由)）
Vue.prototype.$openNewPageBack = openNewPageBack

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
