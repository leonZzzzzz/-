import fetch from '@/api/config'

export default {
  //按周排行
  getNewRankWeek(params) {
    return fetch.get('api/admin/v1/add-new-customer-rank/week', params)
  },
  //按月排行
  getNewRankMonth(params) {
    return fetch.get('api/admin/v1/add-new-customer-rank/month', params)
  }
}
