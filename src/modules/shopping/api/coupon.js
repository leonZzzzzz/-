import fetch from '@/api/config'
export default {
  // 修改优惠券 已发布（只可部分字段）
  updateCouponPublished: (params) => {
    return fetch.post("api/admin/v1.1/coupon-rule/store-update-for-published", params);
  },

  // 店铺优惠券
  addStoreCoupon: (params) => {
    return fetch.post("api/admin/v1.1/coupon-rule/store-add", params);
  },
  // 修改优惠券 待发布（无限制）
  updateStoreCoupon: (params) => {
    return fetch.post("api/admin/v1.1/coupon-rule/store-update", params);
  },

  receiveStoreCouponList: (params) => {
    return fetch.get("api/admin/v1.1/store-coupon-rule/receive-page", params);
  },
  couponStoreList: (params) => {
    return fetch.get("api/admin/v1.1/coupon-rule/store-page", params);
  },

  // 平台优惠券
  addCoupon: (params) => {
    // return fetch.post("api/admin/v1.1/coupon-rule/add", params);
    return fetch.post("api/admin/v1/coupon_rule/add", params);
  },
  updateCoupon: (params) => {
    return fetch.post("api/admin/v1/coupon_rule/update", params);
  },

  couponList: (params) => {
    return fetch.get("api/admin/v1/coupon_rule/list", params);
  },


  /**
   * 获取优惠券
   * 文档 http://xyj.wego168.com/xiaoyaoji/doc/5HRX1VWCz
   *  */
  getCoupon: (params) => {
    return fetch.get("api/admin/v1/coupon_rule/item", params);
  },
  // 优惠券领取列表
  receiveCouponList: (params) => {
    return fetch.get("api/admin/v1/coupon/page", params);
  },
  // 禁用优惠券
  abortCoupon: (params) => {
    return fetch.post("api/admin/v1/coupon_rule/abort", params);
  },
  // 发布
  publishCoupon: (params) => {
    return fetch.post("api/admin/v1/coupon_rule/publish", params);
  },
  // 删除 无接口
  // deleteCoupon: (id) => {
  //   return fetch.post("api/admin/v1/coupon_rule/delete", params);
  // },

  /**
   * 查看关联的商品-
   * 当couponScope=204时，才调用此接口
   * 文档 http://xyj.wego168.com/xiaoyaoji/doc/2oagvzYtou
   * */
  couponProductList: (params) => {
    return fetch.get("api/admin/v1/coupon-rule-reference/product-list", params);
  },


  /**
   * 按手机号发券-
   * 文档 http://xyj.wego168.com/xiaoyaoji/doc/3GftBd4X5G
   * */
  couponStoreSend: (params) => {
    return fetch.post("api/admin/v1/coupon-rule-send/insert", params);
  },
  /**
   * 发送记录
   * 文档 http://xyj.wego168.com/xiaoyaoji/doc/3Gfs4moXFb
   * */
  couponStoreSendPage: (params) => {
    return fetch.get("api/admin/v1/coupon-rule-send/page", params);
  },
}