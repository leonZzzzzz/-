export default [
  // 标签库-企业标签-列表
  {
    path: 'scrm/tag-library/enterprise/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/tag-library/enterprise/List')
  },
  // 标签库-个人标签-列表
  {
    path: 'scrm/tag-library/person/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/tag-library/person/List')
  },
  // 标签库-素材标签-列表
  {
    path: 'scrm/tag-library/material/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/tag-library/material/List')
  },
  // 标签库-行为标签-列表
  {
    path: 'scrm/tag-library/behavior/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/tag-library/behavior/List')
  },
  // 标签库-行为标签-详情
  {
    path: 'scrm/tag-library/behavior/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/tag-library/behavior/Detail')
  }
]
