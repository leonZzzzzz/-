import fetch from '@/api/config'

export default {
  //  活动插件
  // 新增
  addLottery(params) {
    return fetch.json('api/admin/v1/lottery/insert', params)
  },
  // 获取列表
  getLotteryList(params) {
    return fetch.get('api/admin/v1/lottery/page', params)
  },
  // 获取
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

  // 指定中奖
  lotteryDesignate(params) {
    return fetch.json('api/admin/v1/lotteryDesignate/insert', params)
  },
  // 指定中奖人员列表
  designateList(params) {
    return fetch.get('api/admin/v1/lotteryDesignate/designateList', params)
  },
  // 兑奖
  lotteryExchangeAward(params) {
    return fetch.post('api/admin/v1/lotteryResult/exchangeAward', params)
  },

  // 对话墙
  signInInsert: params => fetch.json('api/admin/v1/signIn/insert', params),
  signInUpdate: params => fetch.json('api/admin/v1/signIn/update', params),
  signInDelete: params => fetch.post('api/admin/v1/signIn/delete', params),
  signInGet: params => fetch.get('api/admin/v1/signIn/get', params),

  // 对话墙
  dialogInsert: params => fetch.json('api/admin/v1/dialog/insert', params),
  dialogUpdate: params => fetch.json('api/admin/v1/dialog/update', params),
  dialogDelete: params => fetch.post('api/admin/v1/dialog/delete', params),
  dialogGet: params => fetch.get('api/admin/v1/dialog/get', params),
  dialogCheck: params => fetch.json('api/admin/v1/dialog/check', params),
  dialogCheckList: params => fetch.json('api/admin/v1/dialog/checkList', params),

  // 弹幕审核列表
  barragePage(params) {
    return fetch.get('api/admin/v1/dialog/checkLotteryList', params)
  },
  // 弹幕审核
  barrageCheck(params) {
    return fetch.json('api/admin/v1/dialog/checkLottery', params)
  },

  // 砸金蛋中奖列表（后台，基础版）
  abstractResult(params) {
    return fetch.get('api/admin/v1/lottery-abstract-result/page', params)
  },

  //#region 活动公告
  // 公告列表
  listNoticet(params) {
    return fetch.get('api/admin/v1/notice/page', params)
  },
  // 添加公告公告
  addNotice(params) {
    return fetch.json('api/admin/v1/notice/insert', params)
  },
  //更新公告
  updateNotice(params) {
    return fetch.json('api/admin/v1/notice/update', params)
  },
  //查询公告
  getNotice(params) {
    return fetch.get('api/admin/v1/notice/get', params)
  },
  //删除公告
  deleteNotice(params) {
    return fetch.post('api/admin/v1/notice/delete', params)
  },
  //#endregion

  //#region 证书
  // 创建证书
  certificateInsert(params) {
    return fetch.post('/api/admin/v1/courseCertificate/insert', params)
  },
  // 更新证书
  certificateUpdate(params) {
    return fetch.post('/api/admin/v1/courseCertificate/update', params)
  },
  // 证书详情
  certificateGet(params) {
    return fetch.get('/api/admin/v1/courseCertificate/get', params)
  },
  // 获取证书
  certificatePage(params) {
    return fetch.get('/api/admin/v1/courseCertificate/page', params)
  },
  certificateStatusUpdate(params) {
    return fetch.post('/api/admin/v1/courseCertificate/modifiCheck', params)
  },
  //#endregion

  // 名片
  // 获取模板列表
  getStyleTemplateList(params) {
    return fetch.get('/api/admin/v1/business-card-style-template/list', params)
  },
  // 获取底图列表
  getCardBackgroundList(params) {
    return fetch.get('/api/admin/v1/business-card-background/page', params)
  },
  // 新增底图
  insertCardBackground(params) {
    return fetch.post('/api/admin/v1/business-card-background/insert', params)
  },
  // 修改底图
  updateCardBackground(params) {
    return fetch.post('/api/admin/v1/business-card-background/update', params)
  },
  // 删除底图
  deleteCardBackground(params) {
    return fetch.post('/api/admin/v1/business-card-background/delete', params)
  }
}
