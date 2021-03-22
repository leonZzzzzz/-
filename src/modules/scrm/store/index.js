const state = {
  isNeedUseTalkingPage: false, // 是否使用缓存话术列表页的数据
  talkingPageData: {}, // 用来存放talking列表页data中的数据
  disposeNavFlag: 0, // 企微授权配置页面的tab激活项
}
const getters = {}
const mutations = {
  isNeedUseTalkingPage(state, data) {
    state.isNeedUseTalkingPage = data
  },
  updateTalkingPage(state, data) {
    state.talkingPageData = data
  },
  updateDisposeNavFlag(state, data) {
    state.disposeNavFlag = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}