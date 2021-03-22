export default [
  //#region 店铺模块
  //店铺轮播图
  {
    path: 'store/carousel/list',
    component: () => import(/*webpackChunkName: "store"*/ '../views/carousel/List')
  },
]