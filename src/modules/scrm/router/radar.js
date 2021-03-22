export default [
  // 雷达-列表
  {
    path: 'scrm/radar/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/radar/List')
  },
  // 雷达-编辑
  {
    path: 'scrm/radar/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/radar/Form')
  },
  // 雷达-详情
  {
    path: 'scrm/radar/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/radar/Detail')
  }
]