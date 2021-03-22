import Vue from 'vue'
import Vuex from 'vuex'
// import actions from './actions'

import tableOld from './module/tableOld' // 表格数据
import editor from '@/modules/flywheel/store' // 飞轮魔盒编辑器
import pricing from '@/modules/app/store' // 应用
import scrm from '@/modules/scrm/store' // 企业微信

import createPersistedState from 'vuex-persistedstate' // vuex持久化插件
import createLogger from 'vuex/dist/logger'
import dispose from './module/dispose'
Vue.use(Vuex)
const isDevelopment = process.env.NODE_ENV == 'development'

export default new Vuex.Store({
  strict: isDevelopment ? true : false,
  plugins: [createPersistedState({
    paths: ['isSession', 'tableOld']
  }), createLogger],
  state: {
    // 会话过期
    isSession: false,
    // 应用类型列表
    appTypeList: [],
    // 当前登录账号是否是店铺角色（根据登录时有没有返回storeId来判断）
    isStoreRole: null,
    // 小程序端是否显示多店铺信息
    mallType: null,
    // pc端是否显示授权店铺小程序按钮
    showAuthStore: null,
    // 判断响应拦截器返回接口类型是否为post，则不重载页面，否则重载页面
    isPostTypeApi: true,
    testcount: 'nihaoma?'
  },
  getters: {

  },
  // actions: {
  //   Testcountplus(data) {
  //     data.commit('updateTestcount', '我很好啊')
  //   },
  // },
  mutations: {
    updateTestcount(state, data) {
      state.testcount = data
    },
    updateSession(state, data) {
      state.isSession = data
    },
    updateAppTypeList(state, data) {
      state.appTypeList = data
    },
    setIsStorerole(state, data) {
      state.isStoreRole = data
    },
    setMallType(state, data) {
      state.mallType = data
    },
    showAuthStore(state, data) {
      state.showAuthStore = data
    },
    setIsPostTypeApi(state, boolean) {
      state.isPostTypeApi = boolean
    }
  },
  modules: {
    tableOld,
    editor,
    pricing,
    scrm,
    dispose
  },
})
