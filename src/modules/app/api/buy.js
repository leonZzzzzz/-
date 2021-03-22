import fetch from '@/api/config'

export default {
  appPricingOrder(params) {
    return fetch.json('api/admin/v1/appPricingOrder/place', params)
  }
}
