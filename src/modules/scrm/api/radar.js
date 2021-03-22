import fetch from '@/api/config'

export default {
  // 互动雷达-列表
  getInteractRadarPage(params) {
    return fetch.get('api/admin/v1/interactRadar/page', params)
  },
  // 互动雷达-新增
  addInteractRadar(params) {
    return fetch.json('api/admin/v1/interactRadar/add', params)
  },
  // 互动雷达-获取详情、修改详情
  getInteractRadarDetail(params) {
    return fetch.get('api/admin/v1/interactRadar/get', params)
  },
  // 互动雷达-更新
  updateInteractRadar(params) {
    return fetch.json('api/admin/v1/interactRadar/update', params)
  },
  // 互动雷达-打开链接的客户列表
  getInteractRadarOpenList(params) {
    return fetch.get('api/admin/v1/interactRadar/pageItem', params)
  },
  // 互动雷达-客户访问数据
  getStatVisitByRadarId(params) {
    return fetch.get('api/admin/v1/interactRadar/statVisitByRadarId', params)
  },
  // 互动雷达-删除雷达
  deleteInteractRadar(params) {
    return fetch.post('api/admin/v1/interactRadar/delete', params)
  }
}