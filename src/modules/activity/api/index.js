import fetch from '@/api/config'
import plugin from './plugin'
import survey from './survey'
import donate from './donate'
import activity_new from './activity_new'
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
  payList() {
    return fetch.get('api/admin/v1/activitySign/charge_channel/list')
  },
  payCharge(model) {
    return fetch.post('api/admin/v1/activitySign/charge', model)
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

  // 报名成功图get
  activitySignSuccessGet(params) {
    return fetch.get('/api/admin/v1/config/activity_sign_success', params)
  },
  // 报名成功图post
  activitySignSuccessPost(params) {
    return fetch.json('/api/admin/v1/config/update', params)
  },

  // 获取排序设置
  activityOrderTypeGet(params) {
    return fetch.get('/api/admin/v1/config/activity_order_type', params)
  },
  // 保存排序设置
  activityOrderTypePost(params) {
    return fetch.json('/api/admin/v1/config/update', params)
  },
  // 创建证书
  certificateInsert(model) {
    return fetch.post('/api/admin/v1/courseCertificate/insert', model)
  },
  // 更新证书
  certificateUpdate(model) {
    return fetch.post('/api/admin/v1/courseCertificate/update', model)
  },
  // 证书详情
  certificateGet(model) {
    return fetch.get('/api/admin/v1/courseCertificate/get', model)
  },
  // 获取证书
  certificatePage(params) {
    return fetch.get('/api/admin/v1/courseCertificate/page', params)
  },
  certificateStatusUpdate(model) {
    return fetch.post('/api/admin/v1/courseCertificate/modifiCheck', model)
  },
  // 删除证书
  certificateDelete(id) {
    return fetch.post('/api/admin/v1/courseCertificate/delete', { id })
  },
  // 创建学员
  certificateDataInsert(model) {
    return fetch.post('/api/admin/v1/courseCertificateData/insert', model)
  },
  // 更新学员
  certificateDataUpdate(model) {
    return fetch.post('/api/admin/v1/courseCertificateData/update', model)
  },
  // 学员详情
  certificateDataGet(model) {
    return fetch.get('/api/admin/v1/courseCertificateData/get', model)
  },
  // 学院列表
  certificateDataPage(params) {
    return fetch.get('/api/admin/v1/courseCertificateData/page', params)
  },
  // 删除学院
  certificateDataDelete(id) {
    return fetch.post('/api/admin/v1/courseCertificateData/delete', { id })
  },
  // 证书背景图
  certificateCofnigInsert(model) {
    return fetch.post('/api/admin/v1/courseCertificatePage/insert', model)
  },
  certificateCofnigGet() {
    return fetch.get('api/v1/courseCertificateData/getBgimg')
  },
  // 获取域名
  getMobileUrl(params) {
    return fetch.get('api/admin/v1/app/getMobileUrl.do', params)
  },

  //下载所有附件 (这个是下载接口直接用 项目url + api接口)jike1
  downloadAllActivitySignFile(params) {
    return fetch.get('api/admin/v1/activitySignFile/batchDownloadSignFile', params)
  },
  //判断活动是否有附件报名字段（下载指定附件）-- step 1
  getIsHasActivitySignFile(params) {
    return fetch.get('api/admin/v1/activity-sign/has-file', params)
  },
  //下载指定附件 --- step 2
  downloadActivitySignFile(params) {
    return fetch.post('api/admin/v1/activity-sign-file-download-task/insert', params)
  },
  //查看下载任务列表（下载指定附件）--- step 3
  getDownloadTaskActivitySignFilePage(params) {
    return fetch.get('api/admin/v1/activity-sign-file-download-task/page', params)
  },
  


  //  活动插件
  ...plugin,
  ...survey,
  ...donate,
  ...activity_new,
}
