import fetch from '@/api/config'

// 店铺轮播图
export default {
  pageStoreCarousel(params) {
    return fetch.get('api/admin/v1/carousel/page', params)
  },
  getStoreCarousel(params) {
    return fetch.get('api/admin/v1/carousel/get', params)
  },
  addStoreCarousel(params) {
    return fetch.post('api/admin/v1/carousel/insert', params)
  },
  updateStoreCarousel(params) {
    return fetch.post('api/admin/v1/carousel/update', params)
  },
  delStoreCarousel(params) {
    return fetch.post('api/admin/v1/carousel/delete', params)
  },
}