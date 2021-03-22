import fetch from '@/api/config'

export default {
  agreementInsert: params => fetch.post('api/admin/v1/agreement/insert', params),
  agreementUpdate: params => fetch.post('api/admin/v1/agreement/update', params),
  agreementGet: params => fetch.get('api/admin/v1/agreement/get', params),
  agreementDelete: params => fetch.post('api/admin/v1/agreement/delete', params),
}