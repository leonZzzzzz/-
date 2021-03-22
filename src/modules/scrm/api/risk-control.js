import fetch from '@/api/config'
export default {
  getPermitUserPage(params) {
    return fetch.get('api/admin/v1/conversation-persistence/permit-user-page', params)
  },
  getPageByUser(params) {
    return fetch.get('api/admin/v1/conversation-persistence/page-by-user', params)
  },
  getConverSationMessage(params) {
    return fetch.get('api/admin/v1/conversation-persistence/message-page', params)
  },
  //会话存档过期成员接口
  getLocalGetPageByUser(params) {
    return fetch.get('api/admin/v1/conversation-persistence/local-permit-user-page', params)
  }
}
