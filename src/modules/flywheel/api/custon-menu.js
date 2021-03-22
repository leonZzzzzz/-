import fetch from '@/api/config'

export default {
  getMiniMenu() {
    return fetch.get('api/admin/v1/miniProgram/myMenu/getApp')
  },
  saveOrUpdateMinMenu(params) {
    return fetch.json('api/admin/v1/miniProgramApp/myMenu/saveOrUpdate', params)
  },
  saveOrUpdateCustomMenu(params) {
    return fetch.json('api/admin/v1/miniProgram/myMenu/saveOrUpdate', params)
  },
  deleteCustomMenu(params) {
    return fetch.post('api/admin/v1/miniProgram/myMenu/delete', params)
  }
}
