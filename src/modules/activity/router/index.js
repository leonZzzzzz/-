export default [
  //#region  活动管理
  //活动管理
  {
    path: 'activity/product/list',
    // component: () => import(/*webpackChunkName: "activity"*/ '../views/product/List')
    component: () => import(/*webpackChunkName: "activity"*/ '../views/product/List')
  },
  //活动发布
  {
    path: 'activity/product/form',
    component: () => import(/*webpackChunkName: "activity"*/ '../views/product/Form')
  },
  //活动发布
  {
    path: 'activity/product/form-next',
    component: () => import(/*webpackChunkName: "activity"*/ '../views/product/FormNew')
  },
  // 活动详情
  {
    path: 'activity/product/detail',
    component: () => import(/*webpackChunkName: "activity"*/ '../views/product/Detail')
  },
  //活动分类
  {
    path: 'activity/category/list',
    component: () => import(/*webpackChunkName: "activity"*/ '../views/category/List')
  },
  //活动标签标签
  {
    path: 'activity/tag',
    component: () => import(/*webpackChunkName: "activity"*/ '../views/tag/list')
  },

  //#endregion

  //#region 活动设置
  //报名设置
  {
    path: 'activity/config/signIn-form',
    component: () => import(/*webpackChunkName: "activity"*/ '../views/config/Index')
  },
  //#endregion

  //#region 活动插件
  // 抽奖设置
  {
    path: 'activity/plugin/lottery/release',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/lottery/list/Release')
  },
  // 抽奖设置-群抽（按奖品抽嘉宾）
  {
    path: 'activity/plugin/lottery/releaseQun',
    component: () =>
      import(/*webpackChunkName: "plugin"*/ '../views/plugin/lottery/list/ReleaseQun')
  },
  // 滚动抽奖
  {
    path: 'activity/plugin/lottery-rolling',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/lottery/list/Rolling')
  },
  // 3D抽奖
  {
    path: 'activity/plugin/lottery-lottery-3d',
    component: () =>
      import(/*webpackChunkName: "plugin"*/ '../views/plugin/lottery/list/Lottery_3D')
  },
  // 砸金蛋
  {
    path: 'activity/plugin/egg',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/lottery/list/Egg')
  },
  // 砸金蛋设置
  {
    path: 'activity/plugin/egg/release',
    component: () =>
      import(/*webpackChunkName: "plugin"*/ '../views/plugin/lottery/list/EggRelease')
  },

  //   查看参与嘉宾
  {
    path: 'activity/plugin/lottery/member',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/lottery/member/List')
  },
  //  中奖列表
  {
    path: 'activity/plugin/lottery/winning',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/lottery/winning/List')
  },

  // 签到墙
  {
    path: 'activity/plugin/signIn',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/signIn/List')
  },
  {
    path: 'activity/plugin/signIn/release',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/signIn/Release')
  },

  // 弹幕墙
  {
    path: 'activity/plugin/barrage',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/barrage/List')
  },
  {
    path: 'activity/plugin/barrage/detail',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/barrage/Detail')
  },
  // 活动公告
  {
    path: 'activity/plugin/notice',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/notice/List')
  },
  {
    path: 'activity/plugin/notice/form',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/notice/Form')
  },
  // 问卷
  {
    path: 'activity/plugin/survey',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/survey/List')
  },
  {
    path: 'activity/plugin/survey/form',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/survey/Form')
  },
  {
    path: 'activity/plugin/survey/reslut',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/survey/Result')
  },
  //#endregion

  // //活动回顾
  // {
  //   path: 'activity/review',
  //   component: () => import(/*webpackChunkName: "activity"*/ '../views/review/list'),
  // },
  // //回顾编辑
  // {
  //   path: 'activity/review/form',
  //   component: () => import(/*webpackChunkName: "activity"*/ '../views/review/form'),
  // },
  // //活动回顾详情
  // {
  //   path: 'activity/review/detail',
  //   component: () => import(/*webpackChunkName: "activity"*/ '../views/review/detail'),
  // },
  // //活动日程
  // {
  //   path: 'activity/schedule',
  //   component: () => import(/*webpackChunkName: "activity"*/ '../views/schedule/list'),
  // },
  // 证书页面
  {
    path: 'activity/plugin/certificate/list',
    component: () => import(/*webpackChunkName: "activity"*/ '../views/plugin/certificate/List')
  },
  // 证书配置页面
  {
    path: 'activity/plugin/certificate/config',
    component: () => import(/*webpackChunkName: "activity"*/ '../views/plugin/certificate/Config')
  },
  // 证书详情
  {
    path: 'activity/plugin/certificate/detail',
    component: () => import(/*webpackChunkName: "activity"*/ '../views/plugin/certificate/Detail')
  },

  ////#region 
  // 随喜乐捐
  {
    path: 'activity/plugin/donate/list',
    component: () => import(/*webpackChunkName: "activity"*/ '../views/plugin/donate/List')
  },
  // 捐款详情的 捐款项目
  {
    path: 'activity/plugin/donate/ItemList',
    component: () => import(/*webpackChunkName: "activity"*/ '../views/plugin/donate/ItemList')
  },
  // 捐款订单记录
  {
    path: 'activity/plugin/donate/orderList',
    component: () => import(/*webpackChunkName: "activity"*/ '../views/plugin/donate/OrderList')
  },
  // //#endregion

  // 名片底图列表
  {
    path: 'activity/plugin/business-card/list',
    component: () => import(/*webpackChunkName: "plugin"*/ '../views/plugin/business-card/List')
  },
]
