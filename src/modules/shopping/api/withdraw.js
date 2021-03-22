import fetch from '@/api/config'
export default {
  // 提现申请审核
  withdrawAudit(params) {
    return fetch.json('api/admin/v1/store/withdrawAudit', params)
  }
}
