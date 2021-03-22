import fetch from '@/api/config'
import { PROJECT_PATH } from './project-path'

export default {
  // 添加商品
  addProduct(params) {
    return fetch.json(`${PROJECT_PATH}/product/add`, params)
  },
  // 查看商品
  getProduct(params) {
    return fetch.get(`${PROJECT_PATH}/product/get`, params)
  },
  // 复制商品
  copyProduct(params) {
    return fetch.get(`${PROJECT_PATH}/product/copy`, params)
  },
  // 更新商品
  updateProduct(params) {
    return fetch.json(`${PROJECT_PATH}/product/update`, params)
  },
  // 删除商品
  deleteProduct(params) {
    return fetch.post(`${PROJECT_PATH}/product/delete`, params)
  },
  // 上下架
  productSell(params) {
    return fetch.post(`${PROJECT_PATH}/product/sell`, params)
  },
  productSeqNumUpdate(params) {
    return fetch.post(`${PROJECT_PATH}/product/updateSeqNum`, params);
  },
}
