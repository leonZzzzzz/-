import fetch from '@/api/config'

export default {
  groupChatSendGet(params) {
    return fetch.get('api/admin/v1/groupChatSendMessage/get', params)
  },
  groupChatAdd(params) {
    return fetch.json('api/admin/v1/groupChatSendMessage/add', params)
  },
  groupChatUpdate(params) {
    return fetch.json('api/admin/v1/groupChatSendMessage/update', params)
  },
  groupChatSendPage(params) {
    return fetch.get('api/admin/v1/groupChatSendMessage/page', params)
  },
  //查看消息
  groupChatSendCheck(params) {
    return fetch.get('api/admin/v1/groupChatSendMessage/listItem', params)
  },
  custerGet(params) {
    return fetch.get('api/admin/v1/customer/select', params)
  },
  groupChatSendDelete(params) {
    return fetch.post('api/admin/v1/groupChatSendMessage/delete', params)
  },
  //获取视频素材详情及签名
  getVideoSignatureDetail(params) {
    return fetch.get('api/v1/vod/file/get', params)
  },
  //客户群发列表
  groupList(params) {
    return fetch.get('api/admin/v1/wxCropCustomerGroupChat/page', params)
  },
  //查看明细
  chatListItem(params) {
    return fetch.get('api/admin/v1/groupChatSendMessageItem/list', params)
  },
  groupSend(params) {
    return fetch.post('api/admin/v1/groupChatSendMessage/send', params)
  },
  groupGet(params) {
    return fetch.get('api/admin/v1/groupChatSendMessage/get', params)
  },
  getCustomerSelectPage(params) {
    return fetch.get('api/admin/v1/customer/select', params)
  },
  getCustomerRowPage(params) {
    return fetch.get('api/admin/v1/customer/get', params)
  },
  //再次群发接口
  reCordGroup(params) {
    return fetch.get('/api/admin/v1/groupChatSendMessage/copy', params)
  },
  getCordGroup(params) {
    return fetch.get('/api/admin/v1/groupChatSendMessage/get', params)
  },
  reSaveSend(params) {
    return fetch.json('/api/admin/v1/groupChatSendMessage/saveAndPublish', params)
  },
  //客户管理-详情-企业标签分组
  getEnterTagList(params) {
    return fetch.get('api/admin/v1/wxCropCustomerTagGroup/listByGroup', params)
  },
  getCustomerLifeCyle(params) {
    return fetch.get('api/admin//v1/customer_life_cycle/list', params)
  },
  getProgarm(params) {
    return fetch.get('api/admin/v1/program/list', params)
  },
  addProgarm(params) {
    return fetch.json('api/admin/v1/program/add', params)
  },
  deleteProgarm(params) {
    return fetch.post('api/admin/v1/program/delete', params)
  },
  updateProgarm(params) {
    return fetch.json('api/admin/v1/program/update', params)
  },
  getProgarmPage(params) {
    return fetch.get('api/admin/v1/program/page', params)
  },
  selectForGroupSend(params) {
    return fetch.json('api/admin/v1/customer/select-for-group-send', params)
  },
  selectForGroupSendNew(params) {
    return fetch.get('api/admin/v1/wxCropCustomerGroupChat/listOwner', params)
  },
  
}
