import fetch from '@/api/config'

export default {

   // 获取支持的推广类型
  shareAbilityIsOpenTypes(params) {
    return fetch.get('api/v1/ability/share', params)
  },

  // 推广员详情
  sharerGet(params) {
    return fetch.get('api/admin/v1/sharer/get', params)
  },
  // 等级列表
  sharerLevelPage(params) {
    return fetch.get('api/admin/v1/sharer-level/page', params)
  },
  // 等级列表添加
  sharerLevelInsert(params) {
    return fetch.post('api/admin/v1/sharer-level/insert', params)
  },
  // 等级列表修改
  sharerLevelUpdate(params) {
    return fetch.post('api/admin/v1/sharer-level/update', params)
  },
  // 等级列表删除
  sharerLevelDelete(params) {
    return fetch.post('api/admin/v1/sharer-level/delete', params)
  },
  // 等级列表详情
  sharerLevelGet(params) {
    return fetch.get('api/admin/v1/sharer-level/get', params)
  },

  // 人工转账
  withdrawManualTransfer(params) {
    return fetch.post('api/admin/v1/withdraw/manual-transfer', params)
  },
  // 人工转账
  shareConfigUpdate(params) {
    return fetch.post('api/admin/v1/sharer-config/update', params)
  },

  // 分销商品开始，文档http://xyj.wego168.com/xiaoyaoji/doc/2hVWLXc6d0
  deleteSharerShopping(params) {
    return fetch.post('api/admin/v1/distribute-product/delete', params)
  },
  updateSharerShopping(params) {
    return fetch.json('api/admin/v1/distribute-product/update', params)
  },
  getSharerShopping(params) {
    return fetch.get('api/admin/v1/distribute-product/get', params)
  },
  addSharerShopping(params) {
    return fetch.json('api/admin/v1/distribute-product/insert', params)
  },
  // 商品详情
  getProductForDistribute(params) {
    return fetch.get('api/admin/mall/v1/product/get-for-distribute', params)
  },
  // 分销商品结束

  // 获取可选推广者注册规则，文档http://xyj.wego168.com/xiaoyaoji/doc/31YQIe6RWi
  sharerBecomeConditionList(params) {
    return fetch.get('api/admin/v1/sharer-become-condition/list', params)
  },
  // 设置推广者注册规则
  sharerBecomeConditionSet(params) {
    return fetch.post('api/admin/v1/sharer-become-condition-config/refresh', params)
  },
  // 获取当前注册规则
  sharerBecomeConditionGet(params) {
    return fetch.get('api/admin/v1/sharer-become-condition-config/get', params)
  },
  // 平台推广者列表
  sharerPage(params) {
    return fetch.get('api/admin/v1.1/sharer/page', params)
  },
  // 平台待审核推广者列表
  sharerAuditPage(params) {
    return fetch.get('api/admin/v1/sharer/platform-audit-page', params)
  },
  // 导出平台推广者列表
  sharerExport(params) {
    return fetch.get('api/admin/v1.1/sharer/export', params)
  },
  // 商户推广者列表
  storeSharerPage(params) {
    return fetch.get('api/admin/v1.1/sharer/store-page', params)
  },
  // 商户待审核推广者列表
  storeSharerAuditPage(params) {
    return fetch.get('api/admin/v1/sharer/store-audit-page', params)
  },
  // 导出商户推广者列表
  storeSharerExport(params) {
    return fetch.get('api/admin/v1.1/sharer/store-export', params)
  },
  // 平台推广者订单列表
  sharerOrderPage(params) {
    return fetch.get('api/admin/v1.1/distributer-commission/page', params)
  },
  // 审核通过
  sharerAudit(params) {
    return fetch.post('api/admin/v1/sharer/audit', params)
  },
  // 审核不通过
  sharerRefuse(params) {
    return fetch.post('api/admin/v1/sharer/refuse', params)
  },
}
