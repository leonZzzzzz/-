import fetch from '@/api/config'

const setting = {
  appCustomer() {
    return fetch.get('api/admin/v1/appCustomer/get')
  },
  updateCustomer(params) {
    return fetch.json('api/admin/v1/appCustomer/saveOrUpdate', params)
  },
  getResourceAudit() {
    return fetch.get('api/admin/v1/config/audit_switch')
  },
  updateResourceAudit(params) {
    return fetch.json('api/admin/v1/config/update', params)
  },
  releaseByCowebs(params) {
    return fetch.get('api/admin/v1/config/RELEASE_BY_COWEBS', params)
  },
  getProjectMiniProgramSearch() {
    return fetch.get('api/admin/v1/miniProgramSearchApp/get')
  },
  updateProjectMiniProgramSearch(params) {
    return fetch.json('api/admin/v1/miniProgramSearchApp/saveOrUpdateByApp', params)
  },
  getCowebsAbout() {
    return fetch.get('api/admin/v1/coweb/getAboutUs')
  },
  getRegisterAudit() {
    return fetch.get('api/admin/v1/config/REGISTER_AUDIT')
  },
  getTitle() {
    return fetch.get('api/admin/v1/config/INFORMATION_PAGE_TITLE')
  },
  updateCowebsAbout(params) {
    return fetch.post('api/admin/v1/coweb/updateAboutUs', params)
  },
  // 获取积分数据
  getPointSetting() {
    return fetch.get('api/admin/v1/bbs-point-setting/get')
  },
  // 是否开启积分活动
  isOffcheck(code) {
    return fetch.get('api/admin/v1/ability/get', { code })
  },
  // 关闭积分活动
  isUpdateValue(params) {
    return fetch.post('api/admin/v1/ability/update-value', params)
  },
  // 修改积分活动
  isUpdatepoint(params) {
    return fetch.post('api/admin/v1/bbs-point-setting/update', params)
  },
  // 获取常规积分
  getrulepoint() {
    return fetch.get('api/admin/v1/common-point-setting/get')
  },
  // 修改常规积分
  updaterulepoint(params) {
    return fetch.post('api/admin/v1/common-point-setting/update', params)
  },
  // 获取积分规则
  getPointRules() {
    return fetch.get('api/admin/v1/text-material/points-rule/get')
  },
  // 修改积分规则
  updatePointRules(params) {
    return fetch.post('api/admin/v1/text-material/points-rule/update', params)
  }

}

export default setting
