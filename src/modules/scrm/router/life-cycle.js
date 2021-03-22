export default [
  // 生命周期-列表
  {
    path: 'scrm/life-cycle/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/life-cycle/List')
  },
  // 生命周期-详情
  {
    path: 'scrm/life-cycle/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/life-cycle/Detail')
  },
  // 生命周期-客户设置
  {
    path: 'scrm/life-cycle/customerSetting',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/life-cycle/CustomerSetting')
  }
]