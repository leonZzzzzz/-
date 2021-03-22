import fetch from '@/api/config'

export default {
  // 把草稿添加到模板
  addToTemplate(params) {
    return fetch.post('api/admin/v1/WechatMiniProgramThirdParty/addToTemplate', params)
  },
  // 把草稿添加到模板
  deleteTemplate(params) {
    return fetch.post('api/admin/v1/WechatMiniProgramThirdParty/deleteTemplate', params)
  },
  // 模板库列表
  getTemplateList() {
    return fetch.get('api/admin/v1/WechatMiniProgramThirdParty/getTemplateList')
  },
  // 上传代码
  commitCode(params) {
    return fetch.post('api/admin/v1/WechatMiniProgramThirdParty/commitCode', params)
  },
  //#region
  // 更新上传第三方的数据
  updateThirdPartyCommitCode(params) {
    return fetch.json('api/admin/v1/layout-app-status/saveOrUpdate', params)
  },
  // 获取上传第三方的数据
  getThirdPartyCommitCode(params) {
    return fetch.get('api/admin/v1/layout-app-status/get', params)
  },
  //#endregion
  // 获取已经上传的代码页面列表
  getCodePage() {
    return fetch.get('api/admin/v1/WechatMiniProgramThirdParty/getPage')
  },
  // 查询当月平台分配的提审限额和剩余可提审次数
  getSubmitAuditQueryQuota(params) {
    return fetch.get('api/admin/v1/WechatMiniProgramThirdParty/queryQuota', params)
  },
  // 提交审核
  submitAudit(params) {
    return fetch.post('api/admin/v1/WechatMiniProgramThirdParty/submitAudit', params)
  },
  // 查询审核状态
  getAuditidStatus(params) {
    return fetch.get('api/admin/v1/WechatMiniProgramThirdParty/auditid', params)
  },
  // 查询最后一次提审的状态
  getLatestAuditstatus(params) {
    return fetch.get('api/admin/v1/WechatMiniProgramThirdParty/getLatestAuditstatus', params)
  },
  // 加急处理
  speedAudit(params) {
    return fetch.post('api/admin/v1/WechatMiniProgramThirdParty/speedAudit', params)
  },
  // 撤销当前审核
  undoCodeAudit(params) {
    return fetch.get('api/admin/v1/WechatMiniProgramThirdParty/undoCodeAudit', params)
  },
  // 发布通过的小程序
  releasePassCode(params) {
    return fetch.post('api/admin/v1/WechatMiniProgramThirdParty/release', params)
  },
  // 回退上一个小程序版本
  revertCode(params) {
    return fetch.get('api/admin/v1/WechatMiniProgramThirdParty/revertCodeRelease', params)
  }
}
