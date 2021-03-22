import fetch from '@/api/config'

export default {
  // 新增账号
  addAccount(params) {
    return fetch.json('api/admin/v1/account/add', params)
  },
  addAppAccount(params) {
    return fetch.json('api/admin/v1/account/addAppAccount', params)
  },
  // 获取账号
  getAccount(params) {
    return fetch.get('api/admin/v1/account/get', params)
  },
  // 更新账号
  updateAccount(params) {
    return fetch.json('api/admin/v1/account/update', params)
  },
  // 删除账号
  deleteAccount(params) {
    return fetch.post('api/admin/v1/account/delete', params)
  },
  // 当前登录用户修改自己的账号密码
  updatePwd(params) {
    return fetch.json('api/admin/v1/account/updatePwd', params)
  },
  // 管理员修改其他账号的密码
  updatePlatformPwd(params) {
    return fetch.json('api/admin/v1/account/updatePlatformPwd', params)
  },

  // 新增角色
  addRole(params) {
    return fetch.json('api/admin/v1/role/add', params)
  },
  // 获取角色
  getRole(params) {
    return fetch.get('api/admin/v1/role/get', params)
  },
  // 更新角色
  updateRole(params) {
    return fetch.json('api/admin/v1/role/update', params)
  },
  // 删除角色
  deleteRole(params) {
    return fetch.post('api/admin/v1/role/delete', params)
  },
  // 设置角色的权限
  updatePermissionByRole(params) {
    return fetch.post('api/admin/v1/rolePermission/updatePermissionByRole', params)
  },
  // 权限列表扩容
  expansionPermission(params) {
    return fetch.post('api/admin/v1/sysUser/setVolume', params)
  },
  // 查看权限列表容器
  getexpansionTankPermission(params) {
    return fetch.get('api/admin/v1/sysUser/getVolume', params)
  },

  // 获取管理菜单树结构
  manageMenuTree() {
    return fetch.get('api/admin/v1/permission/manageMenuTree')
  },
  // 获取管理权限的树结构
  permissionTree(params) {
    return fetch.get('api/admin/v1/permission/tree', params)
  },
  // 根据菜单节点获取权限列表
  listByParentId(params) {
    return fetch.get('api/admin/v1/permission/listByParentId', params)
  },
  // 新增菜单（权限）
  addPermission(params) {
    return fetch.json('api/admin/v1/permission/add', params)
  },
  // 更新菜单（权限）
  updatePermission(params) {
    return fetch.json('api/admin/v1/permission/update', params)
  },
  // 获取菜单（权限）
  getPermission(params) {
    return fetch.get('api/admin/v1/permission/get', params)
  },
  // 删除菜单（权限）
  deletePermission(params) {
    return fetch.post('api/admin/v1/permission/delete', params)
  },

  // 系统菜单
  menuTree(params) {
    return fetch.get('api/admin/v1/permission/menuTree', params)
  },

  // 角色列表
  roleList(params) {
    return fetch.get('api/admin/v1/role/list', params)
  },
  // 设置账号的角色
  updateAccountRoles(params) {
    return fetch.post('api/admin/v1/accountRole/updateAccountRoles', params)
  },

  // 要关联的商户列表
  listStores() {
    return fetch.get('api/admin/v1/store/listStores')
  },
  // 关联商户
  associateStore(params) {
    return fetch.post('api/admin/v1/store/associateStore', params)
  },

  // 新增应用
  addApp(params) {
    return fetch.json('api/admin/v1/app/insert', params)
  },
  // 获取应用
  getApp(params) {
    return fetch.get('api/admin/v1/app/get', params)
  },
  // 更新应用
  updateApp(params) {
    return fetch.json('api/admin/v1/app/update', params)
  },
  // 删除应用
  deleteApp(params) {
    return fetch.post('api/admin/v1/app/delete', params)
  },

  // 查询应用功能权限树结构
  permissionTreeForApp(params) {
    return fetch.get('api/admin/v1/permission/treeForApp', params)
  },
  // 设置应用的权限
  appPermissionAssociate(params) {
    return fetch.post('api/admin/v1/appPermission/associate', params)
  },
  imitateLogin(params) {
    return fetch.post('api/admin/v1/appLogin', params)
  },
  abilityTree(params) {
    return fetch.get('api/admin/v1/ability/tree', params)
  },
  abilityTreeUpdate(params) {
    return fetch.post('api/admin/v1/ability/update-value', params)
  },

  // 基础字段-列表
  basicFieldListDefault(params) {
    return fetch.get('api/admin/v1/customerExternalProfile/listDefault', params)
  },
  // 基础字段-新增
  basicFieldAdd(params) {
    return fetch.json('api/admin/v1/customerExternalProfile/add', params)
  },
  // 基础字段-修改
  basicFieldUpdate(params) {
    return fetch.json('api/admin/v1/customerExternalProfile/update', params)
  },
  // 基础字段-删除
  basicFieldDelete(params) {
    return fetch.post('api/admin/v1/customerExternalProfile/delete', params)
  },
  // 基础字段-修改默认
  basicFieldSaveDefault(params) {
    return fetch.post('api/admin/v1/customerExternalProfile/checkDefault', params)
  },
}
