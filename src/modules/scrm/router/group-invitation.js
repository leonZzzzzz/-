export default [
  // 自动建群-活码建群-列表
  {
    path: 'scrm/group-invitation/code/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/group-invitation/code-invitate/List')
  },
  // 自动建群-活码建群-创建
  {
    path: 'scrm/group-invitation/code/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/group-invitation/code-invitate/Form')
  },
  // 自动建群-标签建群-列表
  {
    path: 'scrm/group-invitation/tag/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/group-invitation/tag-invitate/List')
  },
  // 自动建群-标签建群-创建
  {
    path: 'scrm/group-invitation/tag/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/group-invitation/tag-invitate/Form')
  },
  // 自动建群-标签建群-详情
  {
    path: 'scrm/group-invitation/tag/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/group-invitation/tag-invitate/Detail')
  }
]