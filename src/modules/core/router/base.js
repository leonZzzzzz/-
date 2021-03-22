export default [
  //#region 404页面
  {
    path: '404',
    component: () => import('../views/NotFound')
  },
  //#region 用户管理
  {
    path: 'base/member',
    component: () => import('../views/base/member/List')
  },
  //#endregion

  //#region 操作日志
  {
    path: 'base/logs/list',
    component: () => import('../views/base/logs/List')
  },
  //#endregion

  //#region 图文管理
  {
    path: 'base/news/list',
    component: () => import('../views/base/news/list/List')
  },
  {
    path: 'base/news/detail',
    component: () => import('../views/base/news/list/Detail')
  },
  {
    path: 'base/news/category/list',
    component: () => import('../views/base/news/category/List')
  },
  //#endregion

  //#region 消息模板
  {
    path: 'base/template',
    component: () => import('../views/base/template/List')
  },
  {
    path: 'base/template/form',
    component: () => import('../views/base/template/Form')
  },
  {
    path: 'base/template/detail',
    component: () => import('../views/base/template/Detail')
  },
  //#endregion

  //#region 广告图
  {
    path: 'base/config/banner/list',
    component: () => import('../views/base/banner/List')
  },
  //#endregion

  //#region 全局配置
  {
    path: 'myServices/myOrder',
    component: () => import('../views/order/Index')
  },
  {
    path: 'base/config/about',
    component: () => import('../views/base/config/About')
  },
  //#endregion

  //#region 系统个性标签
  {
    path: 'base/personalityLabel/list',
    component: () => import('../views/personalityLabel/List')
  },
  //#endregion

  //#region 数据统计
  // 概况
  {
    path: 'statistics/dataStats',
    component: () => import( /*webpackChunkName: "statistics"*/ '../views/statistics/DataStats')
  },
  // 分析-商城概况-商品分析
  {
    path: 'statistics/analyse/shopping/product',
    component: () => import( /*webpackChunkName: "statistics"*/ '../views/statistics/analyse/shopping/Product')
  }
  //#endregion
]