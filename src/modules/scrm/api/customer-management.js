import fetch from '@/api/config'

export default {
  // 客户管理-列表
  getCustomerPage(params) {
    return fetch.get('api/admin/v1/customer/page', params)
  },
  // 客户管理-详情
  getCustomerDetail(params) {
    return fetch.get('api/admin/v1/customer/get', params)
  },
  // 客户管理-详情-所在群聊
  getCustomerDetailGroupPage(params) {
    return fetch.get('api/v1/customer/groupPage', params)
  },
  // 客户管理-详情-修改备注
  updateCustomerRemarks(params) {
    return fetch.post('api/admin/v1/customer/updateRemarks', params)
  },
  //客户管理-详情-企业标签分组
  getEnterTagList(params) {
    return fetch.get('api/admin/v1/wxCropCustomerTagGroup/listByGroup', params)
  },
  // 生命周期树
  customerLifeCycleTree(params) {
    return fetch.get('api/v1/customer-life-cycle/tree', params)
  },
  // 客户管理-条件查询-标签列表
  getCustomerTagList(params) {
    return fetch.get('api/admin/v1/wxCropCustomerTagGroup/list', params)
  },
  // 客户管理-条件查询-客户分组列表
  getCustomerGroupList(params) {
    return fetch.get('api/admin/v1/customerGroup/list', params)
  },
  //客户管理-查询客户有没有选择的列表
  getReCustomerTagList(params) {
    return fetch.get('/api/admin/v1/wxCropCustomerTagGroup/listByGroup', params)
  },
  // 客户管理-同步客户
  syncCustomerList(params) {
    return fetch.post('/api/admin/v1/customer/refresh', params)
  },
  //客户管理-详情-编辑信息
  updataCustomerMessage(params) {
    return fetch.json('api/admin/v1/customer/update', params)
  },
  //非企微客户管理-详情-编辑信息
  updatanotCustomerMessage(params) {
    return fetch.json('api/admin/v1/highSeasPool/update', params)
  },
  //客户管理-详情-企业标签保存
  enterpriseTagList(params) {
    return fetch.post('api/admin/v1/wxCropCustomerBelongTag/save', params)
  },
  //客户管理-详情-个人标签
  personalTagList(params) {
    return fetch.post('api/admin/v1/customerBelongPersonalTag/add', params)
  },
  //客户管理-详情-个人标签列表
  perosonalList(params) {
    return fetch.get('api/admin/v1/personalTag/list', params)
  },
  personalSave(params) {
    return fetch.post('/api/admin/v1/personalTag/saveBelongTag', params)
  },
  //客户管理-详情-个人标签内添加标签确认添加
  personalTagAdd(params) {
    return fetch.json('api/admin/v1/personalTag/add', params)
  },
  //客户管理-详情-企业以关联标签
  customerGuanTagList(params) {
    return fetch.get('api/admin/v1/customerBelongPersonalTag/listByCustomerId', params)
  },
  // 客户分组-列表
  getCustomerGroupPage(params) {
    return fetch.get('api/admin/v1/customerGroup/page', params)
  },
  // 客户分组-详情
  getCustomerGroupDetail(params) {
    return fetch.get('api/admin/v1/customerGroup/get', params)
  },
  // 客户分组-新增
  addCustomerGroup(params) {
    return fetch.json('api/admin/v1/customerGroup/add', params)
  },
  // 客户分组-更新
  updateCustomerGroup(params) {
    return fetch.json('api/admin/v1/customerGroup/update', params)
  },
  // 客户分组-删除
  deleteCustomerGroup(params) {
    return fetch.post('api/admin/v1/customerGroup/delete', params)
  },
  // 客户分组-详情-添加客户到分组
  pullCustomerToGroup(params) {
    return fetch.post('api/admin/v1/customerGroup/pullCustomer', params)
  },
  // 客户分组-详情-客户选择列表
  getCustomerSelectPage(params) {
    return fetch.get('api/admin/v1/customer/select', params)
  },
  // 客户分组-详情-该分组下的客户数据
  getGroupCustomerPage(params) {
    return fetch.get('api/admin/v1/customerBelongGroup/pageCustomer', params)
  },
  // 客户分组-详情-将客户从分组中移除
  removeCustomerToGroup(params) {
    return fetch.post('api/admin/v1/customerGroup/removeCustomer', params)
  },
  // 客户群-列表
  getCustomerColonyPage(params) {
    return fetch.get('api/admin/v1/wxCropCustomerGroupChat/page', params)
  },
  // 客户群-详情资料
  getCustomerColonyDetail(params) {
    return fetch.get('api/admin/v1/wxCropCustomerGroupChat/get', params)
  },
  // 客户群-成员列表
  getPageCustomerList(params) {
    return fetch.get('api/admin/v1/wxCropCustomerGroupChat/pageCustomer', params)
  },
  // 客户群-更新
  updateCustomerColony(params) {
    return fetch.json('api/admin/v1/wxCropCustomerGroupChat/update', params)
  },
  // 客户群-新增
  addCustomerColony(params) {
    return fetch.json('api/admin/v1/wxCropCustomerGroupChat/add', params)
  },
  //扩展新增字段-修改默认
  updateSaveDefault(params) {
    return fetch.post('api/admin/v1/customerExternalProfile/checkDefault', params)
  },
  //扩展新增字段-修改默认
  updateSaveOneDefault(params) {
    return fetch.json('api/admin/v1/customer/saveSingleProfile', params)
  },
  //扩展新增字段-基础字段
  getlistDefault(params) {
    return fetch.get('api/admin/v1/customerExternalProfile/listDefault', params)
  },
  //扩展新增字段-自定义字段
  getFieldList(params) {
    return fetch.get('api/admin/v1/customerExternalProfile/page', params)
  },
  //扩展新增字段-添加
  addField(params) {
    return fetch.json('api/admin/v1/customerExternalProfile/add', params)
  },
  updateField(params) {
    return fetch.json('api/admin/v1/customerExternalProfile/update', params)
  },
  deteleField(params) {
    return fetch.post('api/admin/v1/customerExternalProfile/delete', params)
  },
  openField(params) {
    return fetch.post('api/admin/v1/customerExternalProfile/enable', params)
  },
  updateNewField(params) {
    return fetch.json('api/admin/v1/customer/saveExternalProfile', params)
  },
  showNewField(params) {
    return fetch.get('api/admin/v1/customer/listExternalProfile', params)
  },
  getCustomerpRrofile(params) {
    return fetch.get('api/admin/v1/customerExternalProfile/get', params)
  },
  //客户管理--跟进记录--新增
  addCustomerRecord(params) {
    return fetch.json('api/admin/v1/customerFollowRecord/add', params)
  },
  //--详情
  getCustomerRecord(params) {
    return fetch.get('api/admin/v1/customerFollowRecord/get', params)
  },
  //--列表
  getCustomerRecordList(params) {
    return fetch.get('api/admin/v1/customerFollowRecord/page', params)
  },
  //--删除
  deteleCustomerRecord(params) {
    return fetch.post('api/admin/v1/customerFollowRecord/delete', params)
  },
  updateCustomerRecord(params) {
    return fetch.json('api/admin/v1/customerFollowRecord/update', params)
  },
  addLifeCycle(params) {
    return fetch.post('/api/admin/v1/customer/updateLifeCycle', params)
  },
  //客户管理--批量设置标签--保存
  addTagBatch(params) {
    return fetch.post('api/admin/v1/customer/addTagBatch', params)
  },
  //客户管理--客户分类--列表
  getCustomerCategoryPage(params) {
    return fetch.get('api/admin/v1/customer-categor/page', params)
  },
  //客户管理--客户分类--新增
  addCustomerCatrgory(params) {
    return fetch.post('api/admin/v1/customer-category/insert', params)
  },
  //客户管理--客户分类--删除
  deteleCustomerCatrory(params) {
    return fetch.post('api/admin/v1/customer-category/delete', params)
  },
  //客户管理--客户分类-获取
  getCustomerCatroryRow(params) {
    return fetch.get('api/admin/v1/customer-categor/get', params)
  },
  //客户管理--客户分类--修改
  updateCustomerCatrory(params) {
    return fetch.post('api/admin/v1/customer-category/update', params)
  },
  // 成员名称搜索
  wxCropUserSelectForNameSearch(params) {
    return fetch.get('api/admin/v1/wxCropUser/select-for-name-search', params)
  },
  // 一键拉群-列表
  getOpenEnterpriseChatRulePage(params) {
    return fetch.get('api/admin/v1/open-enterprise-chat-rule/page', params)
  },
  // 一键拉群-新建
  insertOpenEnterpriseChatRule(params) {
    return fetch.post('api/admin/v1/open-enterprise-chat-rule/insert', params)
  },
  // 一键拉群-修改
  updateOpenEnterpriseChatRule(params) {
    return fetch.post('api/admin/v1/open-enterprise-chat-rule/update', params)
  },
  // 一键拉群-删除
  deleteOpenEnterpriseChatRule(params) {
    return fetch.post('api/admin/v1/open-enterprise-chat-rule/delete', params)
  },
  // 一键拉群-详情
  getOpenEnterpriseChatRuleDetails(params) {
    return fetch.get('api/admin/v1/open-enterprise-chat-rule/get', params)
  },


}
