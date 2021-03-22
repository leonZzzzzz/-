import fetch from '@/api/config'

export default {
  xiaoeTechGoodsGet(params) {
    return fetch.get('api/admin/v1/xiaoe-tech/goods/get', params)
  },
  courseVipList() {
    return fetch.get('api/admin/v1/xiaoe-tech/course-vip/list')
  },
  courseVipGet(params) {
    return fetch.get('api/admin/v1/xiaoe-tech/course-vip/get', params)
  },
  courseVipAdd(params) {
    return fetch.post('api/admin/v1/xiaoe-tech/course-vip/insert', params)
  },
  courseVipUpdate(params) {
    return fetch.post('api/admin/v1/xiaoe-tech/course-vip/update', params)
  },
  courseVipDelete(params) {
    return fetch.post('api/admin/v1/xiaoe-tech/course-vip/delete', params)
  }
}
