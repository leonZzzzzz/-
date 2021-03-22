import fetch from '@/api/config'
export default {
  // 物流
  getLogisticsCompanyList(params) {
    return fetch.get('api/admin/v1/config/listByParentId', params)
  },
  addLogisticsCompany(params) {
    return fetch.json('api/admin/v1/config/insert', params)
  },
  updateLogisticsCompany(params) {
    return fetch.json('api/admin/v1/config/update', params)
  },
  deleteLogisticsCompany(params) {
    return fetch.post('api/admin/v1/config/delete', params)
  },
  getConfigByKey(params){
    return fetch.get('api/admin/v1/config/'+params)
  },
  getAgreementByTpey(params) {
    return fetch.get('api/admin/v1/staticConfig/agreement/get', params)
  },
  updateAgreement(params) {
    return fetch.post('api/admin/v1/staticConfig/agreement/update', params)
  },
}
