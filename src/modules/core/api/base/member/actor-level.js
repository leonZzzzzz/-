import fetch from '@/api/config'

export default {
  // 会员头衔和等级的修改和添加
  memberLevelAndActorSaveAndUpdate(params) {
    return fetc.post('api/admin/v1/memberLevel/saveOrUpdate', params)
  },
  // 会员头衔和等级的删除
  memberLevelAndActorDelete(params) {
    return fetc.post('api/admin/v1/memberLevel/delete', params)
  },
  // 会员头衔和等级的查询
  memberLevelAndActorGet(params) {
    return fetc.get('api/admin/v1/memberLevel/get', params)
  }
}
