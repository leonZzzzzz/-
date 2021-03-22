import fetch from '@/api/config'

export default {
  personalMallAdd(params) {
    return fetch.json('/api/admin/v1/config/insert', params)
  },
  personalMallUpdate(params) {
    return fetch.json('/api/admin/v1/config/update', params)
  },
  personalMallGet(key) {
    return fetch.get(`/api/admin/v1/config/${key}`)
  }
}
