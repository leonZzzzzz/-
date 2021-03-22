export default [
  // 抽奖-列表
  {
    path: 'scrm/lottery/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/lottery/List')
  },
  // 抽奖-创建
  {
    path: 'scrm/lottery/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/lottery/Form')
  },
  // 抽奖-详情
  {
    path: 'scrm/lottery/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/lottery/Detail')
  },
  // 客户加群领券规则设置-列表
  {
    path: 'scrm/coupon-setting/grouprules',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/lottery/coupon-setting/GroupRules')
  }
]
