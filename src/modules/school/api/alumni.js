import fetch from '@/api/config'

const alumni = {
  // 列表
  listAlumni(params) {
    return fetch.get('api/admin/v1/contacts/page', params)
  },
  //添加
  addAlumni(params) {
    return fetch.json('api/admin/v1/contacts/insert', params)
  },
  //更新
  updateAlumni(params) {
    return fetch.json('api/admin/v1/contacts/update', params)
  },
  //查询
  getAlumni(params) {
    return fetch.get('api/admin/v1/contacts/get', params)
  },
  //删除
  deleteAlumni(params) {
    return fetch.post('api/admin/v1/contacts/delete', params)
  },
  //删除
  openMembership(params) {
    return fetch.post('api/admin/v1/membership/open', params)
  },
  // 审核
  auditAlumni(params) {
    return fetch.post('api/admin/v1/contacts/audit', params)
  },
  // 是否冻结
  isFrozen(params) {
    return fetch.post('api/admin/v1/contacts/isFrozen', params)
  },
  // 人工认证实名
  checkRealName(params) {
    return fetch.get('api/admin/v1/contacts/checkRealName', params)
  }
}

export default alumni
