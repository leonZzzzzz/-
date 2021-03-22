export default [
  {
    path: '/examples/hot',
    component: () => import(/* webpackChunkName: "main" */ './hot.vue')
  },
  {
    path: '/examples/props',
    component: () => import(/* webpackChunkName: "main" */ './propsb.vue')
  },
]
