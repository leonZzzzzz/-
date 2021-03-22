import fetch from '@/api/config'

export default {
  pageFlyWheelNavigationBar(params) {
    return fetch.get('api/v1.0/NavigationBar/page', params)
  },
  addFlyWheelNavigationBar(params) {
    return fetch.post('api/v1.0/NavigationBar/insert', params)
  },
  updateFlyWheelNavigationBar(params) {
    return fetch.post('api/v1.0/NavigationBar/update', params)
  },
  deleteFlyWheelNavigationBar(params) {
    return fetch.post('api/v1.0/NavigationBar/delete', params)
  },
}