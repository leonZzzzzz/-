const state = {
  selectPricing: []
}

const mutations = {
  addSelectPricing(state, data) {
    const id = state.selectPricing.find(item => item.id === data.id)
    if (!id) {
      if (data.type !== 1) {
        state.selectPricing.push(data)
      } else {
        let type = null
        state.selectPricing.map((item, index) => {
          if (item.type == 1) {
            type = index
          }
        })
        if (type == null) {
          state.selectPricing.push(data)
        } else {
          state.selectPricing.splice(type, 1, data)
        }
      }
    }
  },
  deleteSelectPricing(state, data) {
    state.selectPricing.splice(data, 1)
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
