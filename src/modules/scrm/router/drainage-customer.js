export default [
  {
    path: 'scrm/drainage-customer/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/drainage-customer/rank/list')
  },

  {
    path: 'scrm/drainage-customer/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/drainage-customer/rank/detail')
  },
  {
    path: 'scrm/drainage-customer/among',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/drainage-customer/rank/among')
  },
  {
    path: 'scrm/drainage-customer/pullNewDetail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/drainage-customer/rank/pullNewDetail')
  },


]