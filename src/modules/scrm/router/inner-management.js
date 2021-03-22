export default [
  // 内部管理-部门-列表
  {
    path: 'scrm/inner-management/department/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/inner-management/department/List')
  },
  // 内部管理-部门-查看
  {
    path: 'scrm/inner-management/department/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/inner-management/department/Detail')
  },
  // 内部管理-成员
  {
    path: 'scrm/inner-management/member/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/inner-management/member/List')
  },
  // 内部管理-标签
  {
    path: 'scrm/inner-management/tag/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/inner-management/tag/List')
  },
  // 内部管理-标签-详情
  {
    path: 'scrm/inner-management/tag/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/inner-management/tag/Detail')
  },
  //对外信息--列表
  {
    path: 'scrm/inner-management/external/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/inner-management/external/List')
  }
]
