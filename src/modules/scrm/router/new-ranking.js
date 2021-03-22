export default [
  //拉新排行--列表页
  {
    path: 'scrm/newRanking/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/new-ranking/List')
  }
]
