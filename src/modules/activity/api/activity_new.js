import fetch from '@/api/config'

export default {
  // 活动列表
  pageActivity(params) {
    return fetch.get('api/admin/v1/activity/page', params)
  },
  // 获取活动数量
  getActivitySort(params) {
    return fetch.get('api/admin/v1/activity/getActivitySort', params)
  },
  // 添加活动
  addActivity(params) {
    return fetch.json('api/admin/v1/activity/insert', params)
  },
  // 更新活动
  updateActivity(params) {
    return fetch.json('api/admin/v1/activity/update', params)
  },
  // 查看活动
  getActivity(params) {
    return fetch.get('api/admin/v1/activity/get', params)
  },
  // 删除活动
  deleteActivity(params) {
    return fetch.post('api/admin/v1/activity/delete', params)
  }
}