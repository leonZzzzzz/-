import fetch from '@/api/config'

export default {
  pageKeFu: params => fetch.get('api/admin/v1.2/cs/staff/page', params),
  addKeFu: params => fetch.post('api/admin/v1.2/cs/staff/insert', params),
  updateKeFu: params => fetch.post('api/admin/v1.2/cs/staff/update', params),
  deleteKeFu: params => fetch.post('api/admin/v1.2/cs/staff/delete', params),

  // 企微客服
  getStoreCustomerServer: params => fetch.get('api/admin/v1/store-customer-server/get', params),
  updateStoreCustomerServer: params => fetch.post('api/admin/v1/store-customer-server/update', params),
  addStoreCustomerServer: params => fetch.post('api/admin/v1/store-customer-server/insert', params),
}