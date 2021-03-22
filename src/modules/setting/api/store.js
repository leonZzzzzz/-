import fetch from '@/api/config'

export default {
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