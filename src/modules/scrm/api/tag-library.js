import fetch from '@/api/config'

export default {
  // 企业标签-列表
  getEnterpriseTagPage(params) {
    return fetch.get('api/admin/v1/wxCropCustomerTagGroup/page', params)
  },
  // 企业标签-详情
  getEnterpriseTagDetail(params) {
    return fetch.get('api/admin/v1/wxCorporateTag/get', params)
  },
  // 企业标签-新增
  addEnterpriseTag(params) {
    return fetch.json('api/admin/v1/wxCorporateTag/add', params)
  },
  // 企业标签-更新
  updateEnterpriseTag(params) {
    return fetch.json('api/admin/v1/wxCorporateTag/update', params)
  },
  // 企业标签-标签同步
  refreshEnterpriseTag(params) {
    return fetch.get('api/admin/v1/wxCropCustomerTagGroup/refresh', params)
  },
  //企业标签-标签组新增
  addEnterpriseGroup(params) {
    return fetch.json('api/admin/v1/wxCropCustomerTagGroup/add', params)
  },
  //企业标签-标签组更新
  updateEnterpriseGroup(params) {
    return fetch.json('api/admin/v1/wxCropCustomerTagGroup/update', params)
  },
  deteleEnterpriseGroup(params) {
    return fetch.json('api/admin/v1/wxCropCustomerTagGroup/delete', params)
  },
  // 个人标签-列表
  getPersonalTagPage(params) {
    return fetch.get('api/admin/v1/personalTag/page', params)
  },
  // 个人标签-详情
  getPersonalTagDetail(params) {
    return fetch.get('api/admin/v1/personalTag/get', params)
  },
  // 个人标签-新增
  addPersonalTag(params) {
    return fetch.json('api/admin/v1/personalTag/add', params)
  },
  // 个人标签-更新
  updatePersonalTag(params) {
    return fetch.json('api/admin/v1/personalTag/update', params)
  },
  // 个人标签-删除
  deletePersonalTag(params) {
    return fetch.post('api/admin/v1/personalTag/delete', params)
  },
  // 素材标签-列表
  getMaterialTagPage(params) {
    return fetch.get('api/admin/v1/materialTag/page', params)
  },
  // 素材标签-新增
  addMaterialTag(params) {
    return fetch.json('api/admin/v1/materialTag/add', params)
  },
  // 素材标签-更新
  updateMaterialTag(params) {
    return fetch.json('api/admin/v1/materialTag/update', params)
  },
  // 素材标签-删除
  deleteMaterialTag(params) {
    return fetch.post('api/admin/v1/materialTag/delete', params)
  },
  // 测试接口
  getCodeMessage(params) {
    return fetch.get('api/v1/ap1p/gafafetByCod', params)
  },
  //行为标签--列表
  getBehaviorPage(params) {
    return fetch.get('api/admin/v1/behaviorTagGroup/page', params)
  },
  //行为标签--详情
  getBehavior(params) {
    return fetch.get('api/admin/v1/behaviorTagGroup/get', params)
  },
  //行为标签--新增
  addBehavior(params) {
    return fetch.json('api/admin/v1/behaviorTagGroup/add', params)
  },
  //行为标签--更新
  updateBehavior(params) {
    return fetch.json('api/admin/v1/behaviorTagGroup/update', params)
  },
  //行为标签--删除
  deleteBehavior(params) {
    return fetch.post('api/admin/v1/behaviorTagGroup/delete', params)
  },
  //行为标签--客户标签权重列表
  getCustomerBelongBehaviorTag(params) {
    return fetch.get('api/admin/v1/customerBelongBehaviorTag/page', params)
  }
}
