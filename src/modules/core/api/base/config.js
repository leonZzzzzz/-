import fetch from '@/api/config'

export default {
  //#region 关于我们
  getAbout(params) {
    return fetch.get('api/admin/mall/v1/mallConfig/getAboutUs', params)
  },
  updateAbout(params) {
    return fetch.post('api/admin/mall/v1/mallConfig/updateAboutUs', params)
  }
  //#endregion
}
