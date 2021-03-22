import fetch from '@/api/config'

export default {
  // 根据类型和获取省市区
  areaListByType(params) {
    return fetch.get('api/admin/v1/area/listByType', params)
  },
  // 根据id查询子级区域列表
  areaListByParentId(params) {
    return fetch.get('api/admin/v1/area/listByParentId', params)
  }
}
