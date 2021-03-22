export default [
  {
    path: 'scrm/dimission/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/dimission/list')
  },
  {
    path: 'scrm/dimission/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/dimission/Form')
  },
  {
    path: 'scrm/dimission/leaveDetail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/dimission/leaveDetail')
  }
]
