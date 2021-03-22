import fetch from '@/api/config'

export default {
  deleteSalesShopping(params) {
    return fetch.post('api/admin/v1/distribute-product/delete', params)
  },
  // 修改
  updateSalesShopping(params) {
    return fetch.json('api/admin/v1/distribute-product/update', params)
  },
  // 详情
  getSalesShopping(params) {
    return fetch.get('api/admin/v1/distribute-product/get', params)
  },
  // 创建
  addSalesShopping(params) {
    return fetch.json('api/admin/v1/distribute-product/insert', params)
  }
}
