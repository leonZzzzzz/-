import fetch from '@/api/config'
import { PROJECT_PATH } from './project-path'
export default {
  // 各项订单总数
  countOrder() {
    return fetch.get(`${PROJECT_PATH}order/selectOrderCount`)
  },
  // 查看订单
  getOrder(params) {
    return fetch.get(`${PROJECT_PATH}order/detail`, params)
  },

  //#region 拼团参团订单
  getListJoinOrder(params) {
    return fetch.get(`api/admin/mall/v1/groupOrder/listJoinOrder`, params)
  },
  //#endregion
  //#region 订单发货
  addExpress(params) {
    return fetch.json(`${PROJECT_PATH}order-express-bill/insert`, params)
  },
  updateExpress(params) {
    return fetch.post(`${PROJECT_PATH}order-express-bill/update`, params)
  },
  // 获取包裹信息
  pageExpress(params) {
    return fetch.get(`${PROJECT_PATH}order-express-bill/get-by-order`, params)
  },
  // 修改收货信息
  updateOrderReceiver(params) {
    return fetch.post(`api/admin/mall/v1/order_logistics/updateReceiver`, params)
  },
  //#endregion

  //#region  订单退款
  addRrderRefund(params) {
    return fetch.json(`${PROJECT_PATH}after-sale/refund/insert`, params)
  },
  // 订单退款的选项
  orderRefundReasonType(params) {
    return fetch.get(`${PROJECT_PATH}after-sale/refund/reason-type`, params)
  },
  //#endregion

  //#region 订单赔付
  orderCompensationReasonType(params) {
    return fetch.get('api/mall/v1/order-compensation/reason-type', params)
  },
  addOrderCompensation(params) {
    return fetch.post(`${PROJECT_PATH}order-compensation/apply`, params)
  },
  statusOrderCompensation(params) {
    return fetch.get(`${PROJECT_PATH}order/get-compensation-status`, params)
  },
  countOrderCompensation() {
    return fetch.get(`${PROJECT_PATH}order-compensation/count-by-status`)
  },
  pageOrderCompensation(params) {
    return fetch.get(`${PROJECT_PATH}order-compensation/page`, params)
  },
  getOrderCompensation(params) {
    return fetch.get(`${PROJECT_PATH}order-compensation/get`, params)
  },
  cancelOrderCompensation(params) {
    return fetch.post(`${PROJECT_PATH}order-compensation/cancel`, params)
  },
  agreeOrderCompensation(params) {
    return fetch.post(`${PROJECT_PATH}order-compensation/agree`, params)
  },
  historyOrderCompensation(params) {
    return fetch.get(`${PROJECT_PATH}order-compensation/list-by-order`, params)
  }
  //#endregion
}
