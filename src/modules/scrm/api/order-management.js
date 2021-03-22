import fetch from '@/api/config'

export default {
  // 店铺管理-分页列表
  getScrmStorePage(params) {
    return fetch.get('api/admin/v1/shop/page', params)
  },
  // 店铺管理-列表
  getScrmStoreList(params) {
    return fetch.get('api/admin/v1/shop/list', params)
  },
  // 店铺管理-新增
  addScrmStore(params) {
    return fetch.json('api/admin/v1/shop/add', params)
  },
  // 店铺管理-删除
  deleteScrmStore(params) {
    return fetch.post('api/admin/v1/shop/delete', params)
  },
  // 店铺管理-更新
  updateScrmStore(params) {
    return fetch.json('api/admin/v1/shop/update', params)
  },
  // 订单管理-分页列表
  getScrmOrderPage(params) {
    return fetch.get('api/admin/v1/scrm_order_record/page', params)
  },
  // 订单管理-删除订单
  deleteScrmOrder(params) {
    return fetch.post('api/admin/v1/scrm_order_record/delete', params)
  },
  // 订单管理-导入
  importScrmOrder(params) {
    return fetch.upload('api/admin/v1/scrm_order/import', params)
  },
  getConfigByKey(params) {
    return fetch.get('api/admin/v1/config/'+params)
  },
  updateConifgMessage(params) {
    return fetch.json('api/admin/v1/config/update', params)
  }
}