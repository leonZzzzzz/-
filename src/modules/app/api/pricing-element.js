import fetch from '@/api/config'

export default {
  updateStatusAppPricingElement(params) {
    return fetch.post('api/admin/v1/appPricingElement/updateStatus', params)
  },
  getAppPricingElement(params) {
    return fetch.get('api/admin/v1/appPricingElement/get', params)
  },
  upadteAppPricingElement(params) {
    return fetch.json('api/admin/v1/appPricingElement/update', params)
  },
  addAppPricingElement(params) {
    return fetch.json('api/admin/v1/appPricingElement/add', params)
  },
  deleteAppPricingElement(params) {
    return fetch.post('api/admin/v1/appPricingElement/delete', params)
  },
  appPricingElementTree(params) {
    return fetch.get('api/admin/v1/appPricingElement/tree', params)
  },
  bindPermissionPricingElement(params) {
    return fetch.json('api/admin/v1/appPricingElement/bindPermission', params)
  }
}
