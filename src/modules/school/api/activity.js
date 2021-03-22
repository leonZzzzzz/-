import fetch from '@/api/config'

export default {
  // 活动列表
  listActivity(params) {
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
  },
  // 发布
  releaseActivity(params) {
    return fetch.post('api/admin/v1/activity/updateRelease', params)
  },
  // 活动报名列表
  activitySign(params) {
    return fetch.get('api/admin/v1/activitySign/page', params)
  },
  // 获取活动报名的字段
  signDataSetting(params) {
    return fetch.get('api/admin/v1/signDataSetting/listBySourceId', params)
  },
  // 报名审核
  auditSign(params) {
    return fetch.json('api/admin/v1/activitySign/audit', params)
  },

  // 获取系统字段列表
  getSignDataSetting() {
    return fetch.get('api/admin/v1/signDataSetting/list')
  },
  // 保存字段
  saveSignDataSetting(params) {
    return fetch.json('api/admin/v1/signDataSetting/save', params)
  },

  // 签到列表
  listCheckin(params) {
    return fetch.get('api/admin/v1/checkin/page', params)
  },

  // 评论列表
  listComment(params) {
    return fetch.get('api/admin/v1/comment/page', params)
  },
  // 审核评论
  auditComment(params) {
    return fetch.post('api/admin/v1/comment/audit', params)
  },
  // 拒绝评论
  refuseComment(params) {
    return fetch.post('api/admin/v1/comment/refuse', params)
  },
  // 删除评论
  deleteComment(params) {
    return fetch.post('api/admin/v1/comment/delete', params)
  },

  // 取消报名
  activitySignCancel(params) {
    return fetch.post('api/admin/v1/activitySign/cancel', params)
  },
  // 退款
  activitySignRefund(params) {
    return fetch.post('api/admin/v1/activitySign/refund', params)
  },

  // 获取市场活动列表
  getCampaignList(params) {
    return fetch.get('api/admin/v1/activityTemp/getCampaignList', params)
  },

  // 获取系统字段列表
  getSignDataSetting() {
    return fetch.get('api/admin/v1/signDataSetting/list')
  },
  // 保存字段
  saveSignDataSetting(params) {
    return fetch.json('api/admin/v1/signDataSetting/save', params)
  },
  // 报名成功图get
  activitySignSuccessGet(params) {
    return fetch.get('/api/admin/v1/config/activity_sign_success', params)
  },
   // 报名成功图post
  activitySignSuccessPost(params) {
    return fetch.json('/api/admin/v1/config/update', params)
  },
  // 报名成功图post
  activitySignPostSaveOrUpdate(params) {
    return fetch.json('/api/admin/v1/poster/saveOrUpdate', params)
  },
  // 获取分享图
  activitySignPostGet(params) {
    return fetch.get('/api/admin/v1/poster/get', params)
  },

  // 获取排序设置
  activityOrderTypeGet(params) {
    return fetch.get('/api/admin/v1/config/activity_order_type', params)
  },
  // 保存排序设置
  activityOrderTypePost(params) {
    return fetch.json('/api/admin/v1/config/update', params)
  },
   //  活动插件
  // 新增
  addLottery(params) {
    return fetch.json('api/admin/v1/lottery/insert', params)
  },
  // 获取活动列表
  getLotteryList(params) {
    return fetch.get('api/admin/v1/lottery/page', params)
  },
  // 获取活动
  getLottery(params) {
    return fetch.get('api/admin/v1/lottery/get', params)
  },
  // 更新
  updateLottery(params) {
    return fetch.json('api/admin/v1/lottery/update', params)
  },
  // 删除
  deleteLottery(params) {
    return fetch.post('api/admin/v1/lottery/delete', params)
  },

   //   参与嘉宾
//   列表
  pageLotteryMember(params) {
    return fetch.get('api/admin/v1/lotteryMember/page', params)
  },
  // 修改
//   updateLotteryMember(params) {
//     return fetch.post('api/admin/v1/lotteryMember/update', params)
//   },
  // 删除
  deleteLotteryMember(params) {
    return fetch.post('api/admin/v1/lotteryMember/delete', params)
  },
  // 获取奖项等级
  getLotteryItemList(params) {
    return fetch.get('api/admin/v1/lotteryItem/list', params)
  },

}
