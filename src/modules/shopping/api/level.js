import fetch from '@/api/config'
import { PROJECT_PATH } from './project-path'

export default {
  addProductLevel(params) {
    return fetch.json(`${PROJECT_PATH}/productLevel/add`, params)
  },
  deleteProductLevel(params) {
    return fetch.post(`${PROJECT_PATH}/productLevel/delete`, params)
  },
  getProductLevel(params) {
    return fetch.get(`${PROJECT_PATH}/productLevel/get`, params)
  },
  pageProductLevel(params) {
    return fetch.get(`${PROJECT_PATH}/productLevel/page`, params)
  },
  updateProductLevel(params) {
    return fetch.json(`${PROJECT_PATH}/productLevel/update`, params)
  }
}
