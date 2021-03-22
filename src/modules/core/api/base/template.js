import fetch from '@/api/config'

export default {
  wxTemplateCreate(params) {
    return fetch.get('api/admin/v1/wxMsgTemplate/get-by-type', params)
  },
  wxTemplateGet(params) {
    return fetch.get('api/admin/v1/wxMsgTemplate/get', params)
  },
  wxMessageSend(model) {
    return fetch.json('api/admin/v1/template-message-task/insert', model)
  },
  wxTemplatePage(params) {
    return fetch.get('api/admin/v1/wxMsgTemplate/page', params)
  },
  wxTemplateInsert(model) {
    return fetch.json('api/admin/v1/wxMsgTemplate/insert', model)
  },
  wxTemplateUpdate(model) {
    return fetch.json('api/admin/v1/wxMsgTemplate/update', model)
  },
  wxTemplateDelete(model) {
    return fetch.post('api/admin/v1/wxMsgTemplate/delete', model)
  },
  wxLogPage(params) {
    return fetch.get('api/admin/v1/wxMsgLog/page', params)
  },
  wxLogItemPage(params) {
    return fetch.get('api/admin/v1/wxMsgLogItem/page', params)
  },
  wxMessageDelete(model) {
    return fetch.post('api/admin/v1/wxMsgLog/delete', model)
  },
  wxJobPage(params) {
    return fetch.get('api/admin/v1/wxMsgJob/page', params)
  },
  wxMessageMember(params) {
    return fetch.get('api/admin/v1/shoppingMember/pageMember', params)
  }
}
