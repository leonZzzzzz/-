import fetch from '@/api/config'

export default {
  // 获取可选条件
  distributerBecomeConditionList(params) {
    return fetch.get('api/admin/v1/distributer-become-condition/list', params)
  },
  // 获取已选条件
  distributerBecomeConditionGet(params) {
    return fetch.get('api/admin/v1/distributer-become-condition-config/get', params)
  },
  // 设置条件
  distributerBecomeConditionRefresh(params) {
    return fetch.post('api/admin/v1/distributer-become-condition-config/refresh', params)
  },

  // 获取注册字段
  distributerRegistFieldList(params) {
    return fetch.get('api/admin/v1/distributer-regist-field/list', params)
  },
  // 添加注册字段
  distributerRegistFieldInsert(params) {
    return fetch.post('api/admin/v1/distributer-regist-field/insert', params)
  },
  // 修改注册字段
  distributerRegistFieldUpdate(params) {
    return fetch.post('api/admin/v1/distributer-regist-field/update', params)
  },
  // 删除注册字段
  distributerRegistFieldDelete(params) {
    return fetch.post('api/admin/v1/distributer-regist-field/delete', params)
  },

  // 销售员列表
  distributerPage(params) {
    return fetch.get('api/admin/v1/distributer/page', params)
  },
  // 销售员列表审核
  distributerAudit(params) {
    return fetch.post('api/admin/v1/distributer/audit', params)
  },
  

  // 佣金配置获取
  distributerCommissionConfigGet(params) {
    return fetch.get('api/admin/v1/distributer-commission-config/get', params)
  },
  // 打款方式
  transferWay(params) {
    return fetch.get('api/admin/v1/transfer-way/list', params)
  },
  // 佣金配置修改
  distributerCommissionConfigUpdate(params) {
    return fetch.post('api/admin/v1/distributer-commission-config/update', params)
  },

  // 设置QA图文
  distributerMaterialQaUpdate(params) {
    return fetch.post('api/admin/v1/distributer/material/qa/update', params)
  },
  // 获取QA图文
  distributerMaterialQaGet(params) {
    return fetch.get('api/admin/v1/distributer/material/qa/get', params)
  },
  // 设置销售推广计划图文
  distributerMaterialPlanUpdate(params) {
    return fetch.post('api/admin/v1/distributer/material/plan/update', params)
  },
  // 获取销售推广计划图文
  distributerMaterialPlanGet(params) {
    return fetch.get('api/admin/v1/distributer/material/plan/get', params)
  },
  // 设置销售推广规则图文
  distributerMaterialRuleUpdate(params) {
    return fetch.post('api/admin/v1/distributer/material/rule/update', params)
  },
  // 获取销售推广规则图文
  distributerMaterialRuleGet(params) {
    return fetch.get('api/admin/v1/distributer/material/rule/get', params)
  },

  // 获取销售员注册二维码
  distributerMaterialGetRegistQrcode(params) {
    return fetch.get('api/admin/v1/distributer/material/get-regist-qrcode', params)
  },

  

  // 上传销售首页底图
  distributerPopsterBackgroundIndexUpdate(params) {
    return fetch.post('api/admin/v1/distributer-popster-background/index/update', params)
  },
  // 获取销售首页底图
  distributerPopsterBackgroundIndexGet(params) {
    return fetch.get('api/admin/v1/distributer-popster-background/index/get', params)
  },

  // 上传推广底图
  distributerPopsterBackgroundInvitationUpdate(params) {
    return fetch.post('api/admin/v1/distributer-popster-background/invitation/update', params)
  },
  // 获取推广底图
  distributerPopsterBackgroundInvitationGet(params) {
    return fetch.get('api/admin/v1/distributer-popster-background/invitation/get', params)
  },


  // 上传推广活动底图
  distributerPopsterBackgroundPopularizationUpdate(params) {
    return fetch.post('api/admin/v1/distributer-popster-background/popularization/update', params)
  },
  // 获取推广活动底图
  distributerPopsterBackgroundPopularizationGet(params) {
    return fetch.get('api/admin/v1/distributer-popster-background/popularization/get', params)
  },
}