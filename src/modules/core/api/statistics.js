import fetch from '@/api/config'

export default {
  // #概况
  // 修改需要显示的概述
  updateDataStatisticsConfig(params) {
    return fetch.post('api/admin/v1/DataStats/updateDataStatisticsConfig', params)
  },
  // 获取需要显示的概述
  getDataStatisticsConfig(params) {
    return fetch.get('api/admin/v1/DataStats/getDataStatisticsConfig', params)
  },
  // 支付订单数与支付金额统计
  countPayOrder(params) {
    return fetch.get('api/admin/mall/v1/order/countPayOrder', params)
  },
  // 支付订单数与支付金额统计表格
  countPayOrderChart(params) {
    return fetch.get('api/admin/mall/v1/order/countPayOrderChart', params)
  },

  // #分析
  // 每件商品的已支付金额和已支付订单数
  countPayAndProductOrder(params) {
    return fetch.get('api/admin/mall/v1/order/countPayAndProductOrder', params)
  },
  // 导出每件商品的已支付金额和已支付订单数
  countPayAndProductOrderExcel(params) {
    return fetch.get('api/admin/mall/v1/order/countPayAndProductOrderExcel', params)
  },

}
