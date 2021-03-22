import fetch from '@/api/config'

export default {
  // 关于我们 和 客服
  getQcAbout(params) {
    return fetch.get('api/admin/v1/qchdAbout/get', params)
  },
  updateQcAbout(params) {
    return fetch.json('api/admin/v1/qchdAbout/saveOrUpdate', params)
  },
  getPlatformMiniProgramSearch(params) {
    return fetch.get('api/admin/v1/miniProgramSearch/get', params)
  },
  updatePlatformMiniProgramSearch(params) {
    return fetch.json('api/admin/v1/miniProgramSearch/saveOrUpdate', params)
  },
  deletePlatformMiniProgramSearch(params) {
    return fetch.post('api/admin/v1/miniProgramSearch/delete', params)
  },
  getAppMiniProgramSearch(params) {
    return fetch.get('api/admin/v1/miniProgramSearch/getByApp', params)
  },
  updateAppMiniProgramSearch(params) {
    return fetch.json('api/admin/v1/miniProgramSearchApp/saveOrUpdateByAdmin', params)
  },
  deleteAppMiniProgramSearch(params) {
    return fetch.post('api/admin/v1/miniProgramSearchApp/delete', params)
  },
}
