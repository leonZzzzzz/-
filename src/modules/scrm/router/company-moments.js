export default [
  // 企业动态-设置成员
  {
    path: 'scrm/moments/setting',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/company-moments/setting/Form')
  },
  // 企业动态-列表
  {
    path: 'scrm/moments/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/company-moments/moments/List')
  },
  // 企业动态-详情
  {
    path: 'scrm/moments/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/company-moments/moments/Detail')
  },
  // 企业动态-新增/编辑
  {
    path: 'scrm/moments/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/company-moments/moments/Form')
  },
  // 企业动态-配置指引
  {
    path: 'scrm/moments/guide',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/company-moments/setting/Guide')
  }
]
