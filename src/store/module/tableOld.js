const state = {
  // 选中表格的数据
  tableList: {},
  //选中表格的id 做导出
  tableId: '',
  sourceId: ''
}

const getters = {
  tableList: state => state.tableList,
  tableId: state => state.tableId,
  checkList: state => state.checkList
}

const mutations = {
  // 选中表格数据
  TABLELIST(state, data) {
    state.tableList = data
  },
  //表格数据id做导出
  TABLEID(state, data) {
    state.tableId = data
  },
  // 清空表格数据数组
  CANCELLIST(state, data) {
    state.checkList.map((item, index) => {
      if (item.id === data.id) {
        state.checkList.splice(index, 1)
      }
      if ((item.sourceId = data.sourceId)) {
        state.checkList.splice(index, 1)
      }
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  getters
}
