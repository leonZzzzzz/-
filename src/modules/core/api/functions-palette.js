import fetch from '@/api/config'

export default {
  abilityTemplateAdd(params) {
    return fetch.post('api/admin/v1/ability-template/insert', params)
  },
  abilityTemplateUpdate(params) {
    return fetch.post('api/admin/v1/ability-template/update', params)
  },
  abilityTemplateDelete(params) {
    return fetch.post('api/admin/v1/ability-template/delete', params)
  },
  getAppPage(params) {
    return fetch.get('api/admin/v1/app/page', params)
  }
}
