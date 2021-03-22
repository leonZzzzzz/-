export default [
  {
    path: 'app/category/list',
    component: () => import(/*webpackChunkName: "apps"*/ '../views/category/List')
  },
  //#region 套餐配置
  {
    path: 'app/pricing-bag/list',
    component: () => import(/*webpackChunkName: "apps"*/ '../views/pricing-bag/List')
  },
  {
    path: 'app/pricing-bag/form',
    component: () => import(/*webpackChunkName: "apps"*/ '../views/pricing-bag/Form')
  },
  //#endregion
  //#region 定价功能
  {
    path: 'app/pricing-element/list',
    component: () => import(/*webpackChunkName: "apps"*/ '../views/pricing-element/List')
  },
  {
    path: 'app/pricing-element/detail',
    component: () => import(/*webpackChunkName: "apps"*/ '../views/pricing-element/Detail')
  },
  //#endregion
  //#region 套餐购买
  {
    path: 'app/buy/select',
    component: () => import(/*webpackChunkName: "apps"*/ '../views/buy/select/Index.vue')
  },
  //#endregion
]
