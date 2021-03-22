import fetch from '@/api/config'

export default {
  //企业信息--详情
  getCropCompant(params) {
    return fetch.get('api/admin/v1/crop-company/get', params)
  },
  //企业信息--修改
  updateCropCompant(params) {
    return fetch.json('api/admin/v1/crop-company/update', params)
  },
  //企业信息--新增
  addCropCompant(params) {
    return fetch.json('api/admin/v1/crop-company/insert', params)
  },
  //成员名片--列表
  getCropBusinessCard(params) {
    return fetch.get('api/admin/v1/crop-business-card/page', params)
  },
  //成员名片--详情
  getCropBussinessDetail(params) {
    return fetch.get('api/admin/v1/crop-business-card/get', params)
  },
  //成员名片--更新
  updateCropBussiness(params) {
    return fetch.post('api/admin/v1/crop-business-card/update', params)
  },
  //获取浏览人列表
  getViewPage(params) {
    return fetch.get('api/admin/v1/crop-business-card-customer/view-page', params)
  },
  //成员管理--列表
  getBussinessUser(params) {
    return fetch.get('api/admin/v1/business-card-user/list', params)
  },
  //成员管理--更新
  updateBussinessUser(params) {
    return fetch.post('api/admin/v1/business-card-user/update', params)
  },
  //成员管理
  initBussinessCard(params) {
    return fetch.get('api/admin/v1/crop-business-card/init-preview', params)
  },
  //成员名片--初始化
  newBussinessCard(params) {
    return fetch.json('api/admin/v1/crop-business-card/init', params)
  },
  //获取置顶名片的客户
  getTopPage(params) {
    return fetch.get('api/admin/v1/crop-business-card-customer/top-page', params)
  },
  //获取屏蔽名片的客户
  hidePage(params) {
    return fetch.get('api/admin/v1/crop-business-card-customer/hide-page', params)
  },
  //设置默认展示名片
  setBusinessCardDefault(params) {
    return fetch.post('api/admin/v1/crop-business-card/set-default', params)
  },
  //设置默认展示名片
  cancelBusinessCardDefault(params) {
    return fetch.post('api/admin/v1/crop-business-card/cancel-default', params)
  },
  //企业海报--列表
  getPostPage(params) {
    return fetch.get('api/admin/v1/crop-company-poster/page', params)
  },
  //企业海报--删除
  deletePoster(params) {
    return fetch.post('api/admin/v1/crop-company-poster/delete', params)
  },
  //企业海报--新增
  addPoster(params) {
    return fetch.post('api/admin/v1/crop-company-poster/insert', params)
  },
  //企业信息--ppt转图片
  pptRuselt(params) {
    return fetch.json('api/admin/v1/crop-company/upload-ppt', params)
  },
  //企业海报--获取
  getPoster(params) {
    return fetch.get('api/admin/v1/crop-company-poster/get', params)
  },
  updatePoster(params) {
    return fetch.post('api/admin/v1/crop-company-poster/update', params)
  },
  // 企业名片-获取开启状态
  getBusinessCardOpenStatus() {
    return fetch.get('api/admin/v1/crop-business-card-switch/get')
  },
  // 企业名片-开启/关闭名片功能
  updateBussinessCardOpenStatus(params) {
    return fetch.post('api/admin/v1/crop-business-card-switch/update', params)
  },
  // 获取名片对外属性设置
  businessCardExternalSetting() {
    return fetch.get('api/v1/admin/business-card-external-attr/get')
  },
  // 获取名片对外属性设置
  UpdatebusinessCardPropertySetting(params) {
    return fetch.post('api/v1/admin/business-card-external-attr/update', params)
  },

  // new获取名片对外属性设置
  getbusinessCardPropertySettingnew(params) {
    return fetch.get('api/v1/admin/moments-external-attr/get', params)
  },
  // new获取名片对外属性设置
  UpdatebusinessCardSettingnewinter(params) {
    return fetch.post('api/v1/admin/moments-external-attr/update', params)
  },
  // new已设置使用权限的列表
  theAdminListIsSet() {
    return fetch.get('api/admin/v1/moments-user/list')
  },
  // new设置可使用动态圈权限的成员
  setMemberDynamicCircle(params) {
    return fetch.post('api/admin/v1/moments-user/update', params)
  },
}
