import fetch from '@/api/config'

export default {
  appList() {
    return fetch.get('api/admin/v1/xiaoe-tech/app/list')
  },
  appGet(params) {
    return fetch.get('api/admin/v1/xiaoe-tech/app/get', params)
  },
  appAdd(params) {
    return fetch.post('api/admin/v1/xiaoe-tech/app/insert', params)
  },
  appUpdate(params) {
    return fetch.post('api/admin/v1/xiaoe-tech/app/update', params)
  }
}
