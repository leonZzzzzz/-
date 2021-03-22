import fetch from '@/api/config'

// 活动列表
export const pageActivity = params => {
  return fetch.get('api/admin/v1/activity/page', params)
}
// 获取活动数量
export const getActivitySort = params => {
  return fetch.get('api/admin/v1/activity/getActivitySort', params)
}
// 添加活动
export const addActivity = params => {
  return fetch.json('api/admin/v1/activity/insert', params)
}
// 更新活动
export const updateActivity = params => {
  return fetch.json('api/admin/v1/activity/update', params)
}
// 查看活动
export const getActivity = params => {
  return fetch.get('api/admin/v1/activity/get', params)
}
// 删除活动
export const deleteActivity = params => {
  return fetch.post('api/admin/v1/activity/delete', params)
}