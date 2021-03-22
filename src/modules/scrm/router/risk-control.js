export default [
  // 企业风控-消息存档
  {
    path: 'scrm/control/message/index',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/risk-control/message/index')
  },
  // 企业风控-违规提醒
  {
    path: 'scrm/control/supervision/index',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/risk-control/supervision/index')
  },
  // 违规提醒-查看
  {
    path: 'scrm/control/supervision/dialogue',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/risk-control/supervision/dialogue')
  }
]