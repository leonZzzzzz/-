import fetch from '@/api/config'
import { PROJECT_PATH } from './project-path'
export default {
  pageParams(params) {
    return fetch.get(`${PROJECT_PATH}productSpecParamCategory/page`, params)
  },
  addParams(params) {
    return fetch.json(`${PROJECT_PATH}productSpecParamCategory/add`, params)
  },
  deleteParams(params) {
    return fetch.post(`${PROJECT_PATH}productSpecParamCategory/delete`, params)
  },
  updateParams(params) {
    return fetch.json(`${PROJECT_PATH}productSpecParamCategory/update`, params)
  }
}
