import fetch from '@/api/config'

export default {
  // 获取微信信息设置
  getAppWechatConfig(params) {
    return fetch.get('api/admin/v1/app_wechat_config/get', params)
  },
  // 更新微信信息设置
  updateAppWechatConfig(params) {
    return fetch.post('api/admin/v1/app_wechat_config/update', params)
  },

  pageWxApp() {
    return fetch.get('api/admin/v1/wxApp/page')
  },
  // 获取日程提醒设置
  getCalendarConfig() {
    return fetch.get('api/admin/v1/config/calendar_config')
  },
  // 更新日程提醒设置
  updateCalendarConfig(params) {
    return fetch.json('api/admin/v1/config/update', params)
  },
  // 获取转发列表
  pageShare() {
    return fetch.get('api/admin/v1/wechat_share_config/page')
  },
  // 转发配置详情
  getShare(params) {
    return fetch.get('api/admin/v1/wechat_share_config/get', params)
  },
  // 修改转发配置
  updateShare(params) {
    return fetch.post('api/admin/v1/wechat_share_config/update', params)
  },
  /**
   * 获取注册码扫描状态
   * 文档 http://xyj.wego168.com/xiaoyaoji/doc/2s5cqjz1Yk
   */
  getQrCodeStatus: (params) => {
    return fetch.get("api/admin/v1/app-manager-regist-qrcode/get", params)
  },
  /**
   * 成员列表
   * 文档 http://xyj.wego168.com/xiaoyaoji/doc/2s5XfbE5RE
   */
  getManagerList: (params) => {
    return fetch.get("api/admin/v1/app-manager/page", params)
  },
  /**
   * 获取最大数量
   * 文档 http://xyj.wego168.com/xiaoyaoji/doc/2s5Ynbwkwr
   */
  getMaxQuantity: (params) => {
    return fetch.get("api/admin/v1/app-manager/max-quantity", params)
  },
  /**
   * 删除成员
   * 文档 http://xyj.wego168.com/xiaoyaoji/doc/2s5YSSgMod
   */
  deleteManager: (params) => {
    return fetch.post("api/admin/v1/app-manager/delete", params)
  },
  /**
   * 生成注册码
   * 文档 http://xyj.wego168.com/xiaoyaoji/doc/2s5ZTdVqFn
   */
  createQrCode: (params) => {
    return fetch.post("api/admin/v1/app-manager-regist-qrcode/create", params)
  }
}
