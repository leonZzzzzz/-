import fetch from '@/api/config'

export default {
  dynamicQrcodeGet(params) {
    return fetch.get('api/admin/v1/dynamicQrcode/get', params)
  },
  dynamicQrcodeAdd(params) {
    return fetch.json('api/admin/v1/dynamicQrcode/add', params)
  },
  dynamicQrcodeUpdate(params) {
    return fetch.json('api/admin/v1/dynamicQrcode/update', params)
  },
  dynamicQrcodePage(params) {
    return fetch.get('api/admin/v1/groupChatSendMessage/page', params)
  },
  tabList(params) {
    return fetch.get('api/admin/v1/wxCropCustomerTagGroup/page', params)
  }
}
