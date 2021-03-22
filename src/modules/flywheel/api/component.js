import fetch from '@/api/config'

export default {
  pageFlyWheelComponent(params) {
    return fetch.get('api/v1.0/assemblyLibrary/page', params)
  },
  addFlyWheelComponent(params) {
    return fetch.post('api/v1.0/assemblyLibrary/insert', params)
  },
  updateFlyWheelComponent(params) {
    return fetch.post('api/v1.0/assemblyLibrary/update', params)
  },
  deleteFlyWheelComponent(params) {
    return fetch.post('api/v1.0/assemblyLibrary/delete', params)
  },
  uploadVideoSignature(params) {
    return fetch.get('api/v1/vod/upload/signature', params)
  }
}
