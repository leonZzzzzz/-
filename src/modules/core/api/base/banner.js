import fetch from '@/api/config'

export default {
  //添加图片
  addCarousel(params) {
    return fetch.post('api/admin/v1/carousel/insert', params)
  },
  //更新图片
  updateCarousel(params) {
    return fetch.post('api/admin/v1/carousel/update', params)
  },
  //查询图片
  getCarousel(params) {
    return fetch.get('api/admin/v1/carousel/get', params)
  },
  // 图片列表
  listCarousel(params) {
    return fetch.get('api/admin/v1/carousel/page', params)
  },
  //删除图片
  deleteCarousel(params) {
    return fetch.post('api/admin/v1/carousel/delete', params)
  },
  // 图片列表
  listAttachment(params) {
    return fetch.get('api/admin/v1/category/page', params)
  },
  //添加图片
  addAttachment(params) {
    return fetch.post('api/admin/v1/attachment/insert', params)
  },
  //更新图片
  updateAttachment(params) {
    return fetch.post('api/admin/v1/attachment/update', params)
  },

  //查询图片
  getAttachment(params) {
    return fetch.get('api/admin/v1/attachment/get', params)
  },

  //删除图片
  deleteAttachment(params) {
    return fetch.post('api/admin/v1/attachment/delete', params)
  },
  //图片链接分类
  pageAttachmentType() {
    return fetch.get('api/admin/v1/carousel/setting')
  }
}
