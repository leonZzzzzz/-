export default [
  {
    path: 'scrm/dispose',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/dispose/Index')
  },
  {
    path: 'scrm/dispose/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/dispose/form')
  }
]
