import fetch from '@/api/config'

export default {
  // 抽奖-列表
  getRollingLotteryPage(params) {
    return fetch.get('api/admin/v1/rolling-lottery/page', params)
  },
  // 抽奖-中止
  stopRollingLottery(params) {
    return fetch.post('api/admin/v1/rolling-lottery/stop', params)
  },
  // 抽奖-恢复
  recoveryRollingLottery(params) {
    return fetch.post('api/admin/v1/rolling-lottery/recovery', params)
  },
  // 抽奖-优惠券规则
  getCouponRulePage(params) {
    return fetch.get('api/admin/v1/rolling-lottery/select-coupon-rule', params)
  },
  // 抽奖-创建
  insertRollingLottery(params) {
    return fetch.json('api/admin/v1/rolling-lottery/insert', params)
  },
  // 抽奖-删除
  deleteRollingLottery(params) {
    return fetch.post('api/admin/v1/rolling-lottery/delete', params)
  },
  // 抽奖-详情
  getRollingLotteryDetail(params) {
    return fetch.get('api/admin/v1/rolling-lottery/get', params)
  },
  // 抽奖-修改
  updateRollingLottery(params) {
    return fetch.json('api/admin/v1/rolling-lottery/update', params)
  },
  // 抽奖-奖品列表
  getLotteryAward(params) {
    return fetch.get('api/admin/v1/rolling-lottery/get-award', params)
  },
  // 抽奖-中奖记录
  getLotteryResult(params) {
    return fetch.get('api/admin/v1/rolling-lottery-result/page', params)
  },
  // 抽奖-获取抽奖小程序码
  getLotteryQrcode(params) {
    return fetch.get('api/admin/v1/rolling-lottery-qrcode/get', params)
  },
  // 加群领券规则-列表
  getGroupCouponRule(params) {
    return fetch.get('api/admin/v1/customer-group-coupon-rule/page', params)
  },
  // 加群领券规则-创建
  addGroupCouponRule(params) {
    return fetch.post('api/admin/v1/customer-group-coupon-rule/insert', params)
  },
  // 加群领券规则-修改
  updateGroupCouponRule(params) {
    return fetch.post('api/admin/v1/customer-group-coupon-rule/update', params)
  },
  // 加群领券规则-删除
  deleteGroupCouponRule(params) {
    return fetch.post('api/admin/v1/customer-group-coupon-rule/delete', params)
  },
  // 加群领券规则-详情
  getGroupCouponRuleDetail(params) {
    return fetch.get('api/admin/v1/customer-group-coupon-rule/get', params)
  }
}