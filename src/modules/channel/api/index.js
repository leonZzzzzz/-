import fetch from '@/api/config'
import sales from './sales'
import sharer from './sharer'

export default {
  addChannel(params) {
    return fetch.post('api/admin/v1/channel/insert', params)
  },
  updateChannel(params) {
    return fetch.post('api/admin/v1/channel/update', params)
  },
  deleteChannel(params) {
    return fetch.post('api/admin/v1/channel/delete', params)
  },
  downloadChannelActivityQrcode(params) {
    return fetch.post('api/admin/v1/activity-channel-qrcode/download-activity-mini-program', params)
  },
  addChannelCode(params) {
    return fetch.post('api/admin/v1/channel-qrcode/insert-batch', params)
  },
  bindChannelCode(params) {
    return fetch.post('api/admin/v1/channel-qrcode/bind', params)
  },
  ...sales,
  ...sharer
}
