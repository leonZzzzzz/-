import fetch from '@/api/config'

export default {
  appGet(params) {
    return fetch.get('api/admin/v1/knowledge/get', params)
  },
  appAdd(params) {
    return fetch.json('api/admin/v1/knowledge/add', params)
  },
  addUpdate(params) {
    return fetch.json('api/admin/v1/knowledge/update', params)
  },
  appDelete(params) {
    return fetch.post('api/admin/v1/knowledge/delete', params)
  },
  appPage(params) {
    return fetch.get('api/admin/v1/knowledge/page', params)
  }
}
