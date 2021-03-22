import fetch from '@/api/config'

export default {
  // 客户统计-实时
  customerGrowthRealTime(params) {
    return fetch.get('api/admin/v1/customer-growth/real-time', params)
  },
  // 客户统计-列表
  customerGrowthList(params) {
    return fetch.get('api/admin/v1/customer-growth/list', params)
  },
  // 客户统计-导出
  customerGrowthExport(params) {
    return fetch.get('api/admin/v1/customer-growth/export', params)
  },
  // 客户群统计-实时
  groupGrowthRealTime(params) {
    return fetch.get('api/admin/v1/group-growth/real-time', params)
  },
  // 客户群统计-列表
  groupGrowthList(params) {
    return fetch.get('api/admin/v1/group-growth/list', params)
  },
  // 客户群统计-拉新
  addNewCustomerRankList(params) {
    return fetch.get('api/admin/v1/add-new-customer-rank/list', params)
  },
  // 客户群统计-导出
  groupGrowthExport(params) {
    return fetch.get('api/admin/v1/group-growth/export', params)
  },
  // 会话记录-列表
  conversationGrowthList(params) {
    return fetch.get('api/admin/v1/conversation-growth/list', params)
  },
  // 会话记录-昨日联系
  conversationGrowthYesterday(params) {
    return fetch.get('api/admin/v1/conversation-growth/yesterday', params)
  },

}