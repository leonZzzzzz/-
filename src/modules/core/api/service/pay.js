import fetch from '@/api/config'

export default {
  //#region 支付配置
  addPayment(params) {
    return fetch.post('api/admin/v1/wxpayConfig/insert', params)
  },
  deletePayment(params) {
    return fetch.post('api/admin/v1/wxpayConfig/delete', params)
  },
  updatePayment(params) {
    return fetch.post('api/admin/v1/wxpayConfig/update', params)
  },
  getPayment(params) {
    return fetch.get('api/admin/v1/wxpayConfig/get', params)
  },
  pagePayment() {
    return fetch.get('api/admin/v1/wxpayConfig/page')
  },
  //#endregion
  
  //#region 支付协议配置
  addAgreement(params) {
    return fetch.post('api/admin/v1/agreement/insert', params)
  },
  deleteAgreement(params) {
    return fetch.post('api/admin/v1/agreement/delete', params)
  },
  getAgreement(params) {
    return fetch.get('api/admin/v1/agreement/get', params)
  },
  getAgreementCodes(params) {
    return fetch.get('api/admin/v1/agreement_code/page', params)
  },
  updateAgreement(params) {
    return fetch.post('api/admin/v1/agreement/update', params)
  }
  //#endregion
}
