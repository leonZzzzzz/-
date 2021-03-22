import fetch from '@/api/config'

export default {
  pageFlywheelCategory(params) {
    return fetch.get('api/v1.0/layCategory/page', params)
  }
}
