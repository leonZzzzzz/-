import fetch from '@/api/config'

export default {
  deleteHelpShopping(params) {
    return fetch.post('api/admin/mall/v1/helpShopping/delete', params)
  },
  updateHelpShopping(params) {
    return fetch.json('api/admin/mall/v1/helpShopping/update', params)
  },
  getHelpShopping(params) {
    return fetch.get('api/admin/mall/v1/helpShopping/get', params)
  },
  addHelpShopping(params) {
    return fetch.json('api/admin/mall/v1/helpShopping/add', params)
  }
}
