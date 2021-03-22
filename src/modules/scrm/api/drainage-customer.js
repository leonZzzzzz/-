import fetch from '@/api/config'

export default {
  // 拉新列表
  PullNewCouponList(params) {
    return fetch.get('api/admin/v1/newActivityController/page', params)
  },

  // 新增拉新活动
  PullAddNewCoupon(params) {
    return fetch.json('api/admin/v1/newActivityController/add', params)
  },
  // 修改拉新活动
  PullUpdateNewCoupon(params) {
    return fetch.json('api/admin/v1/newActivityController/update', params)
  },
  // 拉新详情
  getPullnewCouponDetail(params) {
    return fetch.get('api/admin/v1/newActivityController/getDetail', params)
  },
  // 删除活动
  pullDeleteCoupon(params) {
    return fetch.post('api/admin/v1/newActivityController/delete', params)
  },

  // 图片上传
  upLoadImg(params) {
    return fetch.postImg("api/v1/attachments/images/tencent_cloud", params);
  },
  // 客户拉新排行
  getPullnewRank(params) {
    return fetch.get("api/admin/v1/customerAddNewRank/getRank", params);
  },
  // 拉新详情
  getPullnewRankDetail(params) {
    return fetch.get("api/admin/v1/newActivityController/getActivityCustInfo", params);
  },



}
