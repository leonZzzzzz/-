import fetch from '@/api/config'

export default {
  /**
   * 接口重写
   */
  // 获取素材类型下的分组列表
  getMaterialGroups(params) {
    return fetch.get('api/admin/v1/materialGroup/page', params)
  },
  // 获取分组下的素材列表，type素材类型，groupId分组Id
  getMaterialPage(params) {
    return fetch.get('api/admin/v1/material/page', params)
  },
  // 更新分组信息
  updateMaterialGroup(params) {
    return fetch.json('api/admin/v1/materialGroup/update', params)
  },
  // 删除分组信息
  deleteMaterialGroup(params) {
    return fetch.post('api/admin/v1/materialGroup/delete', params)
  },
  // 新增分组信息
  addMaterialGroup(params) {
    return fetch.json('api/admin/v1/materialGroup/add', params)
  },
  // 获取分组结构树
  getMaterialGroupTree(params) {
    return fetch.get('api/admin/v1/materialGroup/tree', params)
  },
  // 新增素材
  addMaterialData(params) {
    return fetch.json('api/admin/v1/material/add', params)
  },
  // 删除素材
  deleteMaterialData(params) {
    return fetch.post('api/admin/v1/material/delete', params)
  },
  // 获取素材详情
  getMaterialDetail(params) {
    return fetch.get('api/admin/v1/material/get', params)
  },
  // 更新素材
  updateMaterialData(params) {
    return fetch.json('api/admin/v1/material/update', params)
  },
  // 关键词列表
  getMaterialSearchWordPage(params) {
    return fetch.get('api/admin/v1/materialSearchWord/page', params)
  },
  // 关键词-新增
  addMaterialSearchWord(params) {
    return fetch.json('api/admin/v1/materialSearchWord/add', params)
  },
  // 行为标签列表
  getBehaviorTagPage(params) {
    return fetch.get('api/admin/v1/behaviorTagGroup/page', params)
  }
}
