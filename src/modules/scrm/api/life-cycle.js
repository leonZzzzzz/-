import fetch from '@/api/config'

export default {
  // 生命周期-客户列表
  getCustomerLifeCycleUsers(params) {
    return fetch.get('api/admin/v1/customer_life_cycle/users', params)
  },
  // 生命周期-列表
  getCustomerLifeCycleList(params) {
    return fetch.get('api/admin/v1/customer_life_cycle/list', params)
  },
  // 移动客户
  moveUserToLifeCycle(params) {
    return fetch.json('api/admin/v1/customer_life_cycle/move_users', params)
  },
  // 未设置生命周期的用户列表
  getNoLifeCycleStatusUsers(params) {
    return fetch.get('api/admin/v1/customer_life_cycle/no_status_users', params)
  },
  // 导出Excel
  exportCustomerLifeCycle(params) {
    return fetch.get('api/admin/v1/customer_life_cycle/export', params)
  },
  // 新增生命周期阶段
  addCustomerLifeCycle(params) {
    return fetch.json('api/admin/v1/customer_life_cycle/add', params)
  },
  // 删除生命周期阶段
  deleteCustomerLifeCycle(params) {
    return fetch.post('api/admin/v1/customer_life_cycle/delete', params)
  },
  // 更新生命周期阶段
  updateCustomerLifeCycle(params) {
    return fetch.json('api/admin/v1/customer_life_cycle/update', params)
  },
  // 获取周期总客户数
  getLifeCycleCustomerCount(params) {
    return fetch.get('api/admin/v1/customer_life_cycle/users_count', params)
  },
  // 批量更新-上移、下移
  updateBatchLifeCycle(params) {
    return fetch.json('api/admin/v1/customer_life_cycle/update_batch', params)
  },
  // 设置客户生命周期
  setCustomerLifeCycle(params) {
    return fetch.json('api/admin/v1/customer_life_cycle/add_users', params)
  }
}
