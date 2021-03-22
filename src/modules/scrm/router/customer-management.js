export default [
  // 客户管理-列表
  {
    path: 'scrm/customer-management/customer/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/customer-management/customer/List')
  },
  // 客户管理-查看
  {
    path: 'scrm/customer-management/customer/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/customer-management/customer/Detail')
  },
  // 客户管理-查看-所在群列表
  {
    path: 'scrm/customer-management/customer/groupList',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/customer-management/customer/GroupList')
  },
  // 客户分组-列表
  {
    path: 'scrm/customer-management/grouping/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/customer-management/grouping/List')
  },
  // 客户分组-查看
  {
    path: 'scrm/customer-management/grouping/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/customer-management/grouping/Detail')
  },
  // 客户群-列表
  {
    path: 'scrm/customer-management/colony/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/customer-management/colony/List')
  },
  // 客户群-详情
  {
    path: 'scrm/customer-management/colony/details',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/customer-management/colony/Details')
  },
  //扩展客户信息-列表
  {
    path: 'scrm/customer-management/extend/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/customer-management/extend/List')
  },
  //批量打标签
  {
    path: 'scrm/customer-management/label/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/customer-management/label/Form')
  },
  //
  {
    path: 'scrm/customer-management/classification/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/customer-management/classification/List')
  },
  // 一键拉群-列表
  {
    path: 'scrm/customer-management/colonization/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/customer-management/colonization/List')
  },
  // 一键拉群-新增/修改
  {
    path: 'scrm/customer-management/colonization/details',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/customer-management/colonization/Details')
  },

]
