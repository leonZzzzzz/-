export default [
  // 企业信息-企业详情
  {
    path: 'scrm/bussiness-card/enterprise/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/business-card/enterprise/List')
  },
  //成员名片--列表
  {
    path: 'scrm/bussiness-card/card/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/business-card/card/List')
  },
  //成员名片--详情
  {
    path: 'scrm/bussiness-card/card/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/business-card/card/Detail')
  },
  //成员管理--列表
  {
    path: 'scrm/bussiness-card/member/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/business-card/member/List')
  },

  //企业海报--列表
  {
    path: 'scrm/bussiness-card/poster/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/business-card/poster/List')
  },
  //企业海报--新增
  {
    path: 'scrm/bussiness-card/poster/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/business-card/poster/Form')
  }
]
