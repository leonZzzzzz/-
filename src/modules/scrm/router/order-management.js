export default [
  {
    //店铺管理
    path: 'scrm/order/index',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/order-management/index')
  }
]
