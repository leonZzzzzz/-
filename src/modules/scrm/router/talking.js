export default [
  {
    //话术配置
    path: 'scrm/talking/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/talking/talking/List')
  },
]
