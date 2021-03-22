import fetch from '@/api/config';

export default {
  //#region 会员等级、头衔
  // 根据类型查找
  pageMemberLevel(params) {
    return fetch.get('api/admin/v1/memberLevel/page', params)
  },
  // 根据id查找
  getMemberLevel(params) {
    return fetch.get('api/admin/v1/memberLevel/get', params)
  },
  // 新增、修改
  addMemberLevel(params) {
    return fetch.json('api/admin/v1/memberLevel/saveOrUpdate', params)
  },
  delMemberLevel(params) {
    // return fetch.post('api/admin/v1/memberLevel/delete', params)
    return fetch.post('api/admin/v1/contacts/deleteMemberLevel', params)
  },
  //#endregion
  
  // 会费列表
  pageMemberFees(params) {
    return fetch.get('api/admin/v1/memberLevelFee/page', params)
  },
  getMemberFees(params) {
    return fetch.get('api/admin/v1/memberLevelFee/get', params)
  },
  // 新增、修改会费
  addMemberFees(params) {
    return fetch.json('api/admin/v1/memberLevelFee/saveOrUpdate', params)
  },
  // 删除会费
  delMemberFees(params) {
    return fetch.post('api/admin/v1/memberLevelFee/delete', params)
  },

  // 获取会费介绍
  memberFeesGetInfo(params) {
    return fetch.get('api/admin/v1/memberLevelFee/getInfo', params)
  },
  // 保存/更新会费介绍
  memberFeesSetInfo(params) {
    return fetch.post('api/admin/v1/memberLevelFee/setInfo', params)
  },
  // 获取微信支付
  memberFeesGetWechat(params) {
    return fetch.get('api/admin/v1/memberLevelFee/getOpenWeChatPay', params)
  },
  // 开启/关闭微信支付
  memberFeesWechat(params) {
    return fetch.json('api/admin/v1/memberLevelFee/saveOrUpdateWeChatPay', params)
  },

  // 获取是否开启对公收款
  memberFeesGetPublicState(params) {
    return fetch.get('api/admin/v1/memberLevelFee/getOpenPublicPay', params)
  },
  // 开启/关闭对公收款
  memberFeesPublic(params) {
    return fetch.json('api/admin/v1/memberLevelFee/saveOrUpdateOpenPublicPay', params)
  },
  // 设置对公收款介绍
  memberFeesSetPublic(params) {
    return fetch.post('api/admin/v1/memberLevelFee/setOfflineInfo', params)
  },
  // 获取对公收款介绍
  memberFeesGetPublic(params) {
    return fetch.get('api/admin/v1/memberLevelFee/getOfflineInfo', params)
  },

  // 开通会费提示语
  memberFeesSaveTips(params) {
    return fetch.post('api/admin/v1/memberLevelFee/saveOrUpdateTips', params)
  },

  // 开通会费提示语
  getMemberFeesSaveTips(params) {
    return fetch.get('api/admin/v1/memberLevelFee/getTips', params)
  },

  // 会费订单列表
  memberFeesOrderPage(params) {
    return fetch.get('api/admin/v1/memberLevelFeeOrder/page', params)
  },
  // 会费订单确认收款
  memberFeesOrderUpdate(params) {
    return fetch.post('api/admin/v1/memberLevelFeeOrder/update', params)
  },
  // 会费线下收款
  memberFeesOrderChargeOffline(params) {
    return fetch.post('api/admin/v1/memberLevelFeeOrder/chargeOffline', params)
  },


  // 设置会员类型和时长
  setMemberLevel(params) {
    return fetch.post('api/admin/v1/memberLevelJoin/set', params)
  },
  
}

