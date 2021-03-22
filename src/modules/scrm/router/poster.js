export default [
  {
    path: 'scrm/poster',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/poster/poster')
  },
  {
    path: 'scrm/poster/livecode',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/poster/livecode')
  },
  {
    path: 'scrm/poster/livecode/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/poster/form')
  }
]