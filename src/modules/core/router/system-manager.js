export default [
  // 用户角色
  {
    path: 'power/role',
    component: () =>
      import(/*webpackChunkName: "system"*/ '../views/system-manager/power/role/List')
  },
  // 用户角色权限
  {
    path: 'power/role/detail',
    component: () =>
      import(/*webpackChunkName: "system"*/ '../views/system-manager/power/role/Detail')
  },
  // 用户账号
  {
    path: 'power/account',
    component: () =>
      import(/*webpackChunkName: "system"*/ '../views/system-manager/power/account/List')
  },
  // 访问权限
  {
    path: 'power/permission',
    component: () =>
      import(/*webpackChunkName: "system"*/ '../views/system-manager/power/permission/List')
  },
  // 权限列表
  {
    path: 'power/permission/detail',
    component: () =>
      import(/*webpackChunkName: "system"*/ '../views/system-manager/power/permission/Detail')
  },
  // 应用管理
  {
    path: 'app',
    component: () => import(/*webpackChunkName: "system"*/ '../views/system-manager/app/List')
  },
  // 公众号数据
  {
    path: 'app/wechatDetail',
    component: () =>
      import(/*webpackChunkName: "system"*/ '../views/system-manager/app/WechatDetail')
  },
  // 应用权限
  {
    path: 'app/search',
    component: () => import(/*webpackChunkName: "system"*/ '../views/system-manager/app/SearchApp')
  },
  {
    path: 'app/detail',
    component: () => import(/*webpackChunkName: "system"*/ '../views/system-manager/app/Detail')
  },
  {
    path: 'app/ability-detail',
    component: () => import(/*webpackChunkName: "system"*/ '../views/system-manager/app/AbilityDetail')
  },
  {
    path: 'system/config',
    component: () => import(/*webpackChunkName: "system"*/ '../views/system-manager/config/Index')
  },
  {
    path: 'system/config/search',
    component: () => import(/*webpackChunkName: "system"*/ '../views/system-manager/config/Search')
  },
  // 基础字段
  {
    path: 'system/config/basic-field',
    component: () => import(/*webpackChunkName: "system"*/ '../views/system-manager/config/BasicField')
  },
  {
    path: 'system/config/functions-palette',
    component: () => import(/*webpackChunkName: "system"*/ '../views/system-manager/config/FunctionsPalette')
  },
]
