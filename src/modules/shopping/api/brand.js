import fetch from '@/api/config'
import {
  PROJECT_PATH
} from './project-path'

export default {
  addBrand(params) {
    return fetch.json(`${PROJECT_PATH}/brand/add`, params)
  },
  deleteBrand(params) {
    return fetch.post(`${PROJECT_PATH}/brand/delete`, params)
  },
  getBrand(params) {
    return fetch.get(`${PROJECT_PATH}/brand/get`, params)
  },
  pageBrand(params) {
    return fetch.get(`${PROJECT_PATH}/brand/page`, params)
  },
  updateBrand(params) {
    return fetch.json(`${PROJECT_PATH}/brand/update`, params)
  }
}