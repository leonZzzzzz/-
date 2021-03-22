import fetch from '@/api/config'

export default {
  // 标签列表
  pageTag(params) {
    return fetch.get('api/admin/v1/tag/page', params)
  },
  // 添加标签
  addTag(params) {
    return fetch.json('api/admin/v1/tag/insert', params)
  },
  // 更新标签
  updateTag(params) {
    return fetch.json('api/admin/v1/tag/update', params)
  },
  // 查看标签
  getTag(params) {
    return fetch.get('api/admin/v1/tag/get', params)
  },
  // 删除标签
  deleteTag(params) {
    return fetch.post('api/admin/v1/tag/delete', params)
  },

  //#region 系统个性标签
  // 列表
  pagePersonalityLabel(params) {
    return fetch.get('api/admin/v1/personality-label-template/page', params)
  },
  // 详情
  getPersonalityLabel(params) {
    return fetch.get('api/admin/v1/personality-label-template/get', params)
  },
  // 添加
  addPersonalityLabel(params) {
    return fetch.post('api/admin/v1/personality-label-template/insert', params)
  },
  // 修改
  updatePersonalityLabel(params) {
    return fetch.post('api/admin/v1/personality-label-template/update', params)
  },
  // 删除
  delPersonalityLabel(params) {
    return fetch.post('api/admin/v1/personality-label-template/delete', params)
  },
  // 转移标签会员
  transferPersonalityLabel(params) {
    return fetch.post('api/admin/v1/personality-label/transferNewLabel', params)
  },

  // 会员已有标签
  pageMemberPersonalityLabel(params) {
    return fetch.get('api/admin/v1/personality-label/page', params)
  },
  // 会员加标签
  addMemberPersonalityLabel(params) {
    return fetch.post('api/admin/v1/personality-label/insert-by-template', params)
  },
  // 此接口只能用于校友库接口数据，没有memberId情况下使用
  updateTagName(params) {
    return fetch.post('api/admin/v1/contacts/updateTagName', params)
  },
  // 此接口只能用于校友库接口数据，没有memberId情况下使用
  deleteTagName(params) {
    return fetch.post('api/admin/v1/contacts/deleteTagName', params)
  },
  // 会员删除标签
  delMemberPersonalityLabel(params) {
    return fetch.post('api/admin/v1/personality-label/delete', params)
  },
  //#endregion
}
