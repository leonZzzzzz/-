import fetch from '@/api/config'

export default {
  // 规则列表
  recyclingRulesList(params) {
    return fetch.get('api/admin/v1/recoveryRule/page', params)
  },

  // 获取生命周期
  LiftcycleGet(params) {
    return fetch.get('api/admin/v1/customer_life_cycle/list', params)
  },
  // 新增回收规则
  recyclingRulesAdd(params) {
    return fetch.json('api/admin/v1/recoveryRule/add', params)
  },
  // 修改回收规则
  recyclingRulesUpdate(params) {
    return fetch.json('api/admin/v1/recoveryRule/update', params)
  },
  // 新增修改持有规则
  AddORuprecyclingRules(params) {
    return fetch.post('api/admin/v1/recoveryRule/addRule', params)
  },
  // 持有规则
  departmentrecoveryRule() {
    return fetch.get('api/admin/v1/recoveryRule/getRule')
  },
  // 规则详情
  recyclingRulesDetail(params) {
    return fetch.get('api/admin/v1/recoveryRule/getDetail', params)
  },
  // 删除规则
  recyclingdisposeDelete(params) {
    return fetch.post('api/admin/v1/recoveryRule/delete', params)
  },
  // 获取部门成员
  departmentPanyMember() {
    return fetch.get('api/admin/v1/wxCropDept/treeDept')
  },

  // 企微客户列表
  BusinessWechatClient(params) {
    return fetch.get('api/admin/v1/highSeasPool/page', params)
  },
  // 认领客户
  claimClient(params) {
    return fetch.post('api/admin/v1/highSeasPool/claim', params)
  },
  // 录入非企微客户
  // enterUnclient(params) {
  //   return fetch.post('api/admin/v1/highSeasPool/add', params)
  // },
  // 录入非企微客户-数据类型JSON
  enterUnclient(params) {
    return fetch.json('api/admin/v1/highSeasPool/add', params)
  },
  // 录入非企微客户
  exportUnclient(params) {
    return fetch.upload('api/admin/v1/highSeasPool/importCustomer', params)
  },
  // 执行回收规则
  enforceRecyclingRules(params) {
    return fetch.post('api/admin/v1/recoveryRule/enforceRecyclingRules', params)
  },
  // 提醒非企微客户
  admonishRecyclingRules(params) {
    return fetch.post('api/admin/v1/highSeasPool/remindAdd', params)
  },
  // 提醒认领中企微客户
  sendTransferRemindToHandoverUser(params) {
    return fetch.post('api/admin/v1/highSeasPool/send-transfer-remind-to-handover-user', params)
  },
  // 获取全部生命周期
  getAllLiftcycle() {
    return fetch.get('api/v1/customer-life-cycle/tree')
  },
  // 获取全部生命周期
  deleteUnHinghPool(params) {
    return fetch.post('api/admin/v1/highSeasPool/delete', params)
  },
  // 退回到未认领列表
  sendYetClaimed(params) {
    return fetch.post('api/admin/v1/highSeasPool/goBackHighSeas', params)
  },
  // 非企微客户详情
  EnterpriseMicoClient(params) {
    return fetch.get('api/admin/v1/highSeasPool/getDetail', params)
  },
  // 非企微客户详情页修改企业标签
  EnterpriseLabelClient(params) {
    return fetch.post('api/admin/v1/highSeasPool/updateTag', params)
  },
}
