import fetch from '@/api/config'

export default {
  deleteGroupShopping(params) {
    return fetch.post('api/admin/mall/v1/groupShopping/delete', params)
  },
  updateGroupShopping(params) {
    return fetch.json('api/admin/mall/v1/groupShopping/update', params)
  },
  getGroupShopping(params) {
    return fetch.get('api/admin/mall/v1/groupShopping/get', params)
  },
  addGroupShopping(params) {
    return fetch.json('api/admin/mall/v1/groupShopping/add', params)
  }
}
