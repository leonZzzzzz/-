import fetch from '@/api/config'

export default {
  // 标签建群-获取列表
  getGroupInvitationPage(params) {
    return fetch.get('api/admin/v1/groupInvitation/page', params)
  },
  // 标签建群-详情
  getGroupInvitationDetail(params) {
    return fetch.get('api/admin/v1/groupInvitation/get', params)
  },
  // 标签建群-新增
  addGroupInvitation(params) {
    return fetch.json('api/admin/v1/groupInvitation/add', params)
  },
  // 标签建群-修改
  updateGroupInvitation(params) {
    return fetch.json('api/admin/v1/groupInvitation/update', params)
  },
  // 标签建群-删除
  deleteGroupInvitation(params) {
    return fetch.post('api/admin/v1/groupInvitation/delete', params)
  },
  // 标签建群-客户列表
  getGroupInvitationCustomerPage(params) {
    return fetch.get('api/admin/v1/groupInvitationCustomer/page', params)
  },
  // 标签建群-成员列表
  getGroupInvitionUserPage(params) {
    return fetch.get('api/admin/v1/groupInvitationUser/page', params)
  },
  // 标签建群-删除
  deleteGroupInvitation(params) {
    return fetch.post('api/admin/v1/groupInvitation/delete', params)
  },
  // 标签建群-查找成员下的客户列表
  getInvitationCustByUser(params) {
    return fetch.get('api/admin/v1/groupInvitationCustomer/pageUserCutomer', params)
  },
  // 标签建群-提醒发送
  remindUserToSendTagInvit(params) {
    return fetch.post('api/admin/v1/groupInvitation/remindUserToSend', params)
  },
  // 自动拉群-分组-新增
  addGroupInvitCategory(params) {
    return fetch.json('api/admin/v1/groupInvitationCategory/add', params)
  },
  // 自动拉群-分组-列表
  getGroupInvitCategoryList(params) {
    return fetch.get('api/admin/v1/groupInvitationCategory/list', params)
  },
  // 自动拉群-分组-更新
  updateGroupInvitCategory(params) {
    return fetch.json('api/admin/v1/groupInvitationCategory/update', params)
  },
  // 自动拉群-分组-删除
  deleteGroupInvitCategory(params) {
    return fetch.post('api/admin/v1/groupInvitationCategory/delete', params)
  },
  // 自动拉群-新增
  addCodeGroupInvit(params) {
    return fetch.json('api/admin/v1/groupInvitationAuto/add', params)
  },
  // 自动拉群-获取列表
  getCodeGroupInvitPage(params) {
    return fetch.get('api/admin/v1/groupInvitationAuto/page', params)
  },
  // 自动拉群-详情
  getCodeGroupInvitDetail(params) {
    return fetch.get('api/admin/v1/groupInvitationAuto/get', params)
  },
  // 自动拉群-修改
  updateCodeGroupInvit(params) {
    return fetch.json('api/admin/v1/groupInvitationAuto/update', params)
  },
  // 自动拉群-删除
  deleteCodeGroupInvit(params) {
    return fetch.post('api/admin/v1/groupInvitationAuto/delete', params)
  }
}