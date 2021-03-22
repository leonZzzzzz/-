import fetch from '@/api/config'

export default {
  addAppCategory(params) {
    return fetch.json('api/admin/v1/appPricingCategory/add', params)
  },
  updateAppCategory(params) {
    return fetch.json('api/admin/v1/appPricingCategory/update', params)
  },
  updateAppCategoryStatus(params) {
    return fetch.post('api/admin/v1/appPricingCategory/updateStatus', params)
  },
  getAppCategory(params) {
    return fetch.get('api/admin/v1/appPricingCategory/get', params)
  },
  listAppCategory(params) {
    return fetch.get('api/admin/v1/appPricingCategory/list', params)
  },
  deleteAppCategory(params) {
    return fetch.post('api/admin/v1/appPricingCategory/delete', params)
  }
}
