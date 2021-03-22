import fetch from '@/api/config'

export default {
  upadteAppPricingBag(params) {
    return fetch.json('api/admin/v1/appPricingBag/update', params)
  },
  addAppPricingBag(params) {
    return fetch.json('api/admin/v1/appPricingBag/add', params)
  },
  updateAppPricingBag(params) {
    return fetch.json('api/admin/v1/appPricingBag/update', params)
  },
  getAppPricingBag(params) {
    return fetch.get('api/admin/v1/appPricingBag/get', params)
  },
  pageAppPricingBag(params) {
    return fetch.get('api/admin/v1/appPricingBag/page', params)
  },
  deleteAppPricingBag(params) {
    return fetch.post('api/admin/v1/appPricingBag/delete', params)
  },
  updateStatusAppPricingBag(params) {
    return fetch.post('api/admin/v1/appPricingBag/updateStatus', params)
  },
}
