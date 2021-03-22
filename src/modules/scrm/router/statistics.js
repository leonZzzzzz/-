export default [
    // 统计
    {
      path: 'scrm/statistics/index/index',
      component: () => import(/* webpackChunkName: "scrm" */ '../views/statistics/index/Index')
    },
  ]