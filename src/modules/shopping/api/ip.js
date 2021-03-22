import fetch from '@/api/config'

export default {
  addIp(params) {
    return fetch.post('api/admin/v1/person-ip/insert', params)
  },
  getIp(params) {
    return fetch.get('api/admin/v1/person-ip/get', params)
  },
  deleteIp(params) {
    return fetch.post('api/admin/v1/person-ip/delete', params)
  },
  updateIp(params) {
    return fetch.post('api/admin/v1/person-ip/update', params)
  },
  addPersonProduct(params) {
    return fetch.json('api/admin/v1/person-ip-object/insert', params)
  },
  deletePersonProduct(params) {
    return fetch.json('api/admin/v1/person-ip-object/delete', params)
  }
}
