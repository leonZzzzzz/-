export default [
  {
    //话术配置
    path: 'scrm/knowledge',
    // redirect: 'mall/knowledge/index',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/knowledge/Index')
  },
  {
    path: 'scrm/knowledge/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/knowledge/Form')
  }
]