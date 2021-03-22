import fetch from '@/api/config'

export default {
  // 获取佣金配置
  getDistributerCommissionConfig() {
    return fetch.get('api/admin/v1/distributer-commission-config/get')
  },
  // 是否显示积分设置
  isShowintegral() {
    return fetch.get('api/v1/ability-is-open/score-activity')
  }
}
