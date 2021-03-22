import fetch from '@/api/config'

const donate = {
  // 捐款项目列表
  pageDonate(params) {
    return fetch.get('api/admin/v1.1/donate-activity/page', params)
  },
  // 项目捐款名单
  pageDonateOrder(params) {
    return fetch.get('api/admin/v1.1/donate-order/item-page', params)
  },
  // 项目字段列表
  donateFieldList(params) {
    return fetch.get('api/admin/v1.1/donate-field/list', params)
  },
  // 捐款项目详情的 捐款类型
  donateItemList(params) {
    return fetch.get('api/admin/v1.1/donate-item/list', params)
  },
  // 退款
  donateOrderRefund(params) {
    return fetch.post('api/admin/v1.1/donate-order/refund', params)
  },
  // 支付记录-订单列表
  donateOrderPayPage(params) {
    return fetch.get('api/admin/v1.1/pay/page', params)
  },

  // #捐款协议
  // 协议列表
  donateAgreementPage(params) {
    return fetch.get('api/admin/v1/agreement/page', params)
  },
  // 协议详情
  donateAgreementGet(params) {
    return fetch.get('api/admin/v1/agreement/get', params)
  },
  // 协议删除
  donateAgreementDelete(params) {
    return fetch.post('api/admin/v1/agreement/delete', params)
  },
  // 协议修改
  donateAgreementUpdate(params) {
    return fetch.post('api/admin/v1/agreement/update', params)
  },
  // 协议添加
  // 文档地址: http://xyj.wego168.com/xiaoyaoji/doc/2o6drnvqrC
  donateAgreementAdd(params) {
    return fetch.post('api/admin/v1/agreement/insert', params)
  },
}

export default donate;
