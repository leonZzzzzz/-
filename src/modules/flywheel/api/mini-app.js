import fetch from '@/api/config'

export default {
  miniPageAdd(params) {
    return fetch.json('api/admin/v1/skipApp/saveOrUpdate', params)
  },
  miniAppPage(params) {
    return fetch.get('api/admin/v1/skipApp/page', params)
  },
  miniAppDelete(params) {
    return fetch.post(`api/admin/v1/skipApp/delete`, params)
  }
}
