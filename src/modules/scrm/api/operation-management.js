import fetch from '@/api/config'
export default {
  //欢迎语--列表
  getWelcomePage(params) {
    return fetch.get('api/admin/v1/welcome/page', params)
  },
  //欢迎语--新增
  addWelcome(params) {
    return fetch.json('api/admin/v1/welcome/add', params)
  },
  //欢迎语--树形结构列表
  getTree(params) {
    return fetch.get('api/admin//v1/wxCropDept/trees', params)
  },
  //欢迎语--获取小程序列表
  getProgarm(params) {
    return fetch.get('api/admin/v1/program/list', params)
  },
  // 欢迎语--获取详情
  getUserWelcome(params) {
    return fetch.get('api/admin/v1/welcome/get', params)
  },
  //欢迎语--更新详情
  updateUserWelcome(params) {
    return fetch.json('api/admin/v1/welcome/update', params)
  },
  //欢迎语--删除欢迎语
  deleteUserWelcome(params) {
    return fetch.post('api/admin/v1/welcome/delete', params)
  },
  //客户群发列表
  groupList(params) {
    return fetch.get('api/admin/v1/wxCropCustomerGroupChat/page', params)
  },
  //加好友--列表
  addFriendPage(params) {
    return fetch.get('api/admin/v1/friend/page', params)
  },
  //加好友--详情
  addFriendPageDetails(params) {
    return fetch.get('/api/admin/v1/friend/pageCustomer', params)
  },
  //加好友--导入
  addFriendImport(params) {
    return fetch.upload('api/admin/v1/friend/importExcel', params)
  },
  //加好友--发送提醒
  getFriendMessage(params) {
    return fetch.get('api/admin/v1/friend/get', params)
  },
  //加好友--删除
  deleteAddFriend(params) {
    return fetch.post('api/admin/v1/friend/delete', params)
  },
  //加好友--提醒
  remindFriend(params) {
    return fetch.post('api/admin/v1/friend/send', params)
  },
  //个人活码--列表
  liveCodePage(params) {
    return fetch.get('api/admin/v1/dynamicQrcode/page', params)
  },
  //个人活码--添加
  addLiveCode(params) {
    return fetch.json('api/admin/v1/dynamicQrcode/add', params)
  },
  //个人活码--更新
  updateLiveCode(params) {
    return fetch.json('api/admin/v1/dynamicQrcode/update', params)
  },
  //个人活码--详情
  getLiveCode(params) {
    return fetch.get('api/admin/v1/dynamicQrcode/get', params)
  },
  //个人活码--客户列表详情
  getCustomerList(params) {
    return fetch.get('api/admin/v1/dynamicQrcode/customerPage', params)
  },
  //个人活码--删除
  deleteLiveCode(params) {
    return fetch.post('api/admin/v1/dynamicQrcode/delete', params)
  },
  //个人活码--停用
  stopLiveCode(params) {
    return fetch.post('api/admin/v1/dynamicQrcode/enable', params)
  },
  //获取行为标签--页面
  getBehaviorPage(params) {
    return fetch.get('api/admin/v1/behaviorTagGroup/page', params)
  },
  //获取行为标签--分组页面
  getBehaviorPages(params) {
    return fetch.get('api/admin/v1/behaviorTagGroup/listByGroup', params)
  },
  //获取行为标签--详情
  getBehavior(params) {
    return fetch.get('api/admin/v1/dynamicQrcode/get', params)
  },
  //会话监控--敏感词库
  getSensitive(params) {
    return fetch.get('api/admin//v1/sensitive/words', params)
  },
  //会话监控--新增敏感词
  addSensitive(params) {
    return fetch.json('api/admin//v1/sensitive/words', params)
  },
  //会话监控--删除敏感词
  deleteSensitive(id) {
    return fetch.post(`api/admin//v1/sensitive/words/` + id)
  },
  //会话监控
  getSensitiveRecords(params) {
    return fetch.get('api/admin//v1/sensitive_word/records', params)
  },
  //会话监控--敏感词
  getRecords(params) {
    return fetch.get('api/admin//v1/conversation/msg', params)
  },
  //会话监控--有无购买接口
  isBuy(params) {
    return fetch.get('api/admin/v1/config/is_open_crop_wechat_session', params)
  },
  //聊天会话配置--列表
  getChatSessionPage(params) {
    return fetch.get('api/admin/v1/wxCropWechatConfig/page', params)
  },
  //聊天会话配置--新增
  addChatSession(params) {
    return fetch.json('api/admin/v1/wxCropWechatConfig/add', params)
  },
  //聊天会话配置--删除
  deleteChatSession(params) {
    return fetch.post('api/admin/v1/wxCropWechatConfig/delete', params)
  },
  //聊天会话配置--详情
  getChatSession(params) {
    return fetch.get('api/admin/v1/wxCropWechatConfig/get', params)
  },
  //聊天会话配置--更新
  updateChatSession(params) {
    return fetch.json('api/admin/v1/wxCropWechatConfig/update', params)
  },
  //聊天会话配置--下载
  downChatSession(params) {
    return fetch.get('api/admin/v1/wxCropWechatConfig/download', params)
  },
  //流失提醒--列表
  getLoseMindePage(params) {
    return fetch.get('api/admin/v1/friendCancel/page', params)
  },
  //敏感词库--页面
  getSensitiveWord(params) {
    return fetch.get('api/admin/v1/sensitive-word/page', params)
  },
  //敏感词库--修改
  updateSensitiveWord(params) {
    return fetch.post('api/admin/v1/sensitive-word/update', params)
  },
  //敏感词库--新增
  addSensitiveWord(params) {
    return fetch.post('api/admin/v1/sensitive-word/insert', params)
  },
  //敏感词库--删除
  deleteSensitiveWord(params) {
    return fetch.post('api/admin/v1/sensitive-word/delete', params)
  },
  //敏感词库--获取
  getSensitiveWordGet(params) {
    return fetch.get('api/admin/v1/sensitive-word/get', params)
  },
  //聊天会话配置--是否开通
  getOpenStatus(params) {
    return fetch.get('api/admin/v1/conversation-persistence/get-open-status', params)
  },
  //聊天会话配置--为true时调用
  openChatSession(parmas) {
    return fetch.post('api/admin/v1/conversation-persistence/close', parmas)
  },
  //聊天会话配置--为false时调用
  closeChatSession(params) {
    return fetch.post('api/admin/v1/conversation-persistence/open', params)
  },
  //聊天会话配置--获取ip及公钥
  getSessionConversation(params) {
    return fetch.get('api/admin/v1/conversation-persistence/get', params)
  },
  //违规信息--获取信息
  getSessionSensitive(params) {
    return fetch.get('api/admin/v1/conversation-persistence/sensitive-message-page', params)
  },
  //违规信息--详情
  getSequence(params) {
    return fetch.get('api/admin/v1/conversation-persistence/message-page-by-sequence', params)
  },
  //违规信息--获取提醒设置
  getMessageConfig(params) {
    return fetch.get('api/admin/v1/conversation-persistence/sensitive-message-config/get', params)
  },
  updateMessageConfig(params) {
    return fetch.post('api/admin/v1/conversation-persistence/sensitive-message-config/update', params)
  },
  // 流失提醒--获取
  getConfigNotice(params) {
    return fetch.get('/api/admin/v1/config/friend_cancel_notice', params)
  },
  // 传扫码获取的code给后台
  SendAutncode(params) {
    return fetch.post('scrm/sysUser/login/scanCodeLogin', params)
  },
  // 传重定向链接
  SendRedirectLink(params) {
    return fetch.get('scrm/sysUser/login/3rdQrAuth', params)
  },
  // 渠道活码-可选附加内容列表
  getLiveCodeAttachmentList(params) {
    return fetch.get('api/admin/v1/dynamicQrcode/getAttachmentList', params)
  },
  // 欢迎语-可选附件内容列表
  getWelcomeAttachmentList(params) {
    return fetch.get('api/admin/v1/welcome/getAttachmentList', params)
  },
}
