export default [
  {
    path: 'lesson/list',
    component: () => import(/*webpackChunkName: "less"*/ '../views/product/List')
  },
  {
    path: 'lesson/form',
    component: () => import(/*webpackChunkName: "less"*/ '../views/product/Form')
  },
  {
    path: 'lesson/detail',
    component: () => import(/*webpackChunkName: "less"*/ '../views/product/Detail')
  },
  {
    path: 'lesson/category',
    component: () => import(/*webpackChunkName: "less"*/ '../views/Category')
  },
  {
    path: 'lesson/tag',
    component: () => import(/*webpackChunkName: "less"*/ '../views/Tag')
  },
]
