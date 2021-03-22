import fetch from '@/api/config'

export default {
  // 部门-列表
  getDepartmentPage(params) {
    return fetch.get('api/admin/v1/wxCropDept/page', params)
  },
  // 部门-详情
  getDepartmentDetail(params) {
    return fetch.get('api/admin/v1/wxCropDept/get', params)
  },
  // 成员-列表
  getMemberPage(params) {
    return fetch.get('api/admin/v1/wxCropUser/page', params)
  },
  // 成员-详情
  getMemberDetail(params) {
    return fetch.get('api/admin/v1/wxCropUser/get', params)
  },
  // 标签-列表
  getInnerTagPage(params) {
    return fetch.get('api/admin/v1/wxCropTag/page', params)
  },
  // 标签-详情
  getInnerTagDetail(params) {
    return fetch.get('api/admin/v1/wxCropTag/get', params)
  },
  // 部门-树形结构（带成员信息）
  getDepartmentTree() {
    return fetch.get('api/admin//v1/wxCropDept/trees')
  },
  // -fo-
  // 部门树节点数据
  getDepartmentTreeData(params) {
    return fetch.get('api/admin/v1/wxCropDept/treeDept', params)
  },
  // 获取部门chengyuan
  getDepartmentTreeMember(params) {
    return fetch.get('api/admin/v1/wxCropUser/page', params)
  },
  //设置单个成员对外信息
  updateUserOnly(params) {
    return fetch.json('api/admin/v1/userExternalAttr/updateUser', params)
  },
  //批量设置成员对外展示信息
  updateUserExternalAttr(params) {
    return fetch.json('api/admin/v1/userExternalAttr/update', params)
  },
  //对外信息展示--列表
  getUserExternalPage(params) {
    return fetch.get('api/admin/v1/userExternalAttr/listJoinUser', params)
  },
  //对外信息展示--删除
  deteleExternal(params) {
    return fetch.json('api/admin/v1/userExternalAttr/delete', params)
  },
  //对外信息展示--获取
  getUserExternal(params) {
    return fetch.get('api/admin/v1/userExternalAttr/getByUser', params)
  },
  //获取用户角色列表
  getUseRoleSetting(params) {
    return fetch.get('api/admin/v1/sysUser/rolePage', params)
  },
  //角色关联成员
  setUpUserMember(params) {
    return fetch.json('api/admin/v1/sysUser/setUpUser', params)
  },
  //角色已关联的成员
  setReadyUserMember(params) {
    return fetch.get('api/admin/v1/sysUser/getConnectedUser', params)
  },
  //有使用权限的列表
  RoleAssociatedMember(params) {
    return fetch.get('api/admin/v1/sysUser/list', params)
  },
  //新增使用权限列表
  AddPermissionUser(params) {
    return fetch.post('api/admin/v1/sysUser/add', params)
  },
  // 查看权限列表容器
  getexpansionTankPermission(params) {
    return fetch.get('api/admin/v1/sysUser/getVolume', params)
  },
  // 获取设定使用系统成员
  getWxCropDeptAppUserTrees(params) {
    return fetch.get('api/admin/v1/wxCropDept/appUserTrees', params)
  },
}
