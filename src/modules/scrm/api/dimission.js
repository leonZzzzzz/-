import fetch from '@/api/config'

export default {
  // 离职成员列表
  getLeaveOffice(params) {
    return fetch.get('api/admin/v1/wxCropUser/getResignUser', params)
  },
  // 待分配客户列表/群列表
  waitDistribution(params) {
    return fetch.get('api/admin/v1/wxCropCustomerTransfer/pages', params)
  },
  // 客户批量分配
  getGoalsMembers(params) {
    return fetch.json('api/admin/v1/wxCropCustomerTransfer/transferCustomer', params)
  },
  // 客户群批量分配
  getGoalsFlock(params) {
    return fetch.json('api/admin/v1/wxCropCustomerTransfer/groupChatTransfer', params)
  },
  // 目标成员列表
  volumeAllocation(params) {
    return fetch.json('api/admin/v1/wxCropUser/page', params)
  },
  disposeUpdate(params) {
    return fetch.json('api/admin/v1/cropApp/update', params)
  },
  disposeDelete(params) {
    return fetch.post('api/admin/v1/cropApp/delete', params)
  },
  disposePage(params) {
    return fetch.get('api/admin/v1/cropApp/page', params)
  }
}
