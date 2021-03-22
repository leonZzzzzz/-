export default [
  {
    path: 'scrm/freeSea/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/freeSea/list')
  },
  {
    path: 'scrm/freeSea/custDetail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/freeSea/custDetail')
  },
  {
    path: 'scrm/freeSea/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/freeSea/Form')
  },
  {
    path: 'scrm/freeSea/enterClient',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/freeSea/enterClient')
  },
  {
    path: 'scrm/freeSea/recycle',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/freeSea/recycle')
  },
  {
    path: 'scrm/freeSea/recyclerule',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/freeSea/recycleRule')
  },
]
