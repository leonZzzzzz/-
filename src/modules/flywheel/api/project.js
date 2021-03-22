import fetch from '@/api/config'

export default {
  pageProject(params) {
    return fetch.get('api/v1.0/layout-app/page', params)
  },
  getProject(params) {
    return fetch.get('api/v1.0/layout-app/get', params)
  },
  addProject(params) {
    return fetch.post('api/v1.1/layout-app/insert', params)
  },
  addProject1_2(params) {
    return fetch.post('api/v1.2/layout-app/insert', params)
  },
  // 更新项目状态
  updateProjectStatus(params) {
    return fetch.post('api/v1.2/layout-app/updateStatus', params)
  },
  updateProject(params) {
    return fetch.post('api/v1.1/layout-app/update', params)
  },
  deleteProject(params) {
    return fetch.post('api/v1.0/layout-app/delete', params)
  },
  getWxAppConfig(params) {
    return fetch.get('api/admin/v1/wxAppConfig/get', params)
  }
}
