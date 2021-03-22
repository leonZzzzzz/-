import fetch from '@/api/config'

export default {
  listSmsCategory() {
    return fetch.get('api/admin/v1/smsType/all')
  },
  addSmsCategory(params) {
    return fetch.post('api/admin/v1/smsType/add', params)
  },
  updateSmsCategory(params) {
    return fetch.json('api/admin/v1/smsType/update', params)
  },
  deleteSmsCategory(params) {
    return fetch.post('api/admin/v1/smsType/delete', params)
  },
  pageSms(params) {
    return fetch.get('api/admin/v1/smsQuota/all', params)
  },
  findByTypeSms(params) {
    return fetch.get('api/admin/v1/smsQuota/findByType', params)
  },
  addSms(params) {
    return fetch.post('api/admin/v1/smsQuota/add', params)
  },
  getSms(params) {
    return fetch.get('api/admin/v1/smsQuota/get', params)
  },
  updateSms(params) {
    return fetch.post('api/admin/v1/smsQuota/update', params)
  },
  deleteSms(params) {
    return fetch.post('api/admin/v1/smsQuota/delete', params)
  },
  
  createSmsOrder(params) {
    return fetch.post('api/admin/v1/smsRecharge/pay', params)
  },
  paySms(params) {
    return fetch.get('api/v1/sms/joinPay/getPayUrl',params)
  }

}
