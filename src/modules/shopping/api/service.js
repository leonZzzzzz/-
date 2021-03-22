import fetch from '@/api/config'
import { PROJECT_PATH } from './project-path'
export default {
  // 售后订单详情
  getServiceOrder(params) {
    return fetch.get(`${PROJECT_PATH}orderAfterSales/get`, params)
  },
  //#region 换货
  // 同意换货
  orderAfterSaleseExhangeGoodsAgree(params) {
    return fetch.post(`${PROJECT_PATH}after-sale/exchange-goods/agree`, params)
  },
  // 拒绝换货
  orderAfterSalesExchangeGoodsRefuse(params) {
    return fetch.post(`${PROJECT_PATH}after-sale/exchange-goods/refuse`, params)
  },
  // 确认收货
  orderAfterSalesExchangeGoodsConfirmReceive(params) {
    return fetch.post(`${PROJECT_PATH}after-sale/exchange-goods/confirm-receive`, params)
  },
  // 取消换货
  orderAfterSalesExchangeGoodsConfirmCancel(params) {
    return fetch.post(`${PROJECT_PATH}after-sale/exchange-goods/cancel`, params)
  },
  // 重新发货
  orderAfterSalesExchangeGoodsDelivery(params) {
    return fetch.post(`${PROJECT_PATH}after-sale/exchange-goods/delivery`, params)
  },
  //#endregion
  //#region 退货
  // 拒绝退货
  orderAfterSalesReturnGoodsRefuse(params) {
    return fetch.post(`${PROJECT_PATH}after-sale/return-goods/refuse`, params)
  },
  // 同意退货
  orderAfterSalesReturnGoodsAgree(params) {
    return fetch.post(`${PROJECT_PATH}after-sale/return-goods/agree`, params)
  },
  // 确定收货
  orderAfterSalesReturnGoodsConfirmReceive(params) {
    return fetch.post(`${PROJECT_PATH}after-sale/return-goods/confirm-receive`, params)
  },
  // 取消退货
  orderAfterSalesReturnGoodsCancel(params) {
    return fetch.post(`${PROJECT_PATH}after-sale/return-goods/cancel`, params)
  },
  // 退货退款
  orderAfterSalesReturnGoodsRefund(params) {
    return fetch.post(`${PROJECT_PATH}after-sale/return-goods/refund`, params)
  },
  //#endregion

  //#region 仅退款
  // 同意退款
  orderAftersalesRefundAgree(params) {
    return fetch.post(`${PROJECT_PATH}after-sale/refund/agree`, params)
  },
  // 拒绝退款
  orderAftersalesRefundRefuse(params) {
    return fetch.post(`${PROJECT_PATH}after-sale/refund/refuse`, params)
  },
  // 重新退款
  orderAftersalesRefundRetry(params) {
    return fetch.post(`${PROJECT_PATH}after-sale/refund/retry`, params)
  }
  //#endregion
}
