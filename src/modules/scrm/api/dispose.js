import fetch from '@/api/config'

export default {
  disposeGet(params) {
    return fetch.get('api/admin/v1/cropApp/get', params)
  },
  disposeAdd(params) {
    return fetch.json('api/admin/v1/cropApp/add', params)
  },
  disposeUpdate(params) {
    return fetch.json('api/admin/v1/cropApp/update', params)
  },
  disposeDelete(params) {
    return fetch.post('api/admin/v1/cropApp/delete', params)
  },
  disposePage(params) {
    return fetch.get('api/admin/v1/cropApp/page', params)
  },
  /**
   * 公众号配置
   */
  // 获取授权的公众号
  getAuthorizeWxAppPage(params) {
    return fetch.get('api/admin/v1/wxApp/page', params)
  },
  // 检查授权的公众号是否都绑定了同一个开放平台
  checkAppOpenPlatform(params) {
    return fetch.get('api/admin/v1/wxApp/checkAppOpenPlatform', params)
  },
  /**
   * 企微名片小程序配置
   */
  // 获取
  getCropBusinessCardWeapp(params) {
    return fetch.get('api/admin/v1/crop-business-card-weapp/get', params)
  },
  // 创建
  insertCropBusinessCardWeapp(params) {
    return fetch.post('api/admin/v1/crop-business-card-weapp/insert', params)
  },
  // 修改
  updateCropBusinessCardWeapp(params) {
    return fetch.post('api/admin/v1/crop-business-card-weapp/update', params)
  },
  // 删除
  deleteCropBusinessCardWeapp(params) {
    return fetch.post('api/admin/v1/crop-business-card-weapp/delete', params)
  },
}
