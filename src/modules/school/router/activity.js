export default [
  //活动管理
  {
    path: 'activity/list',
    component: () => import(/*webpackChunkName: "activity"*/ '../components/page/activity/list/list'),
  },
  //活动发布
  {
    path: 'activity/list/release',
    component: () => import(/*webpackChunkName: "activity"*/ '../components/page/activity/list/release'),
  },
  // 活动详情
  {
    path: 'activity/list/detail',
    component: () => import(/*webpackChunkName: "activity"*/ '../components/page/activity/list/detail'),
  },
  //活动分类
  {
    path: 'activity/category',
    component: () => import(/*webpackChunkName: "activity"*/ '../components/page/activity/category/list'),
  },
  // //活动标签
  // {
  //   path: 'activity/tag',
  //   component: () => import(/*webpackChunkName: "activity"*/ '../components/page/activity/tag/list'),
  // },
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
  //报名设置
  {
    path: 'activity/config',
    component: () => import(/*webpackChunkName: "activity"*/ '../components/page/activity/config'),
  },
  // // {
  // //   path: 'activity/config',
  // //   component: () => import(/*webpackChunkName: "activity"*/ '../views/activityConfig/signSuccess'),
  // // },
  // // 墙发布
  // {
  //   path: 'lottery',
  //   component: () => import(/*webpackChunkName: "activity"*/ '../views/lottery/list'),
  // },
  // {
  //   path: 'lottery/egg',
  //   component: () => import(/*webpackChunkName: "activity"*/ '../views/lottery/list'),
  // },
  // // 墙发布
  // {
  //   path: 'lottery/release',
  //   component: () => import(/*webpackChunkName: "activity"*/ '../views/lottery/release'),
  // },
  // //   查看参与嘉宾
  // {
  //   path: 'lottery/member',
  //   component: () => import(/*webpackChunkName: "activity"*/ '../views/lottery/member/list'),
  // },
  // //  中奖列表
  // {
  //   path: 'lottery/winning',
  //   component: () => import(/*webpackChunkName: "activity"*/ '../views/lottery/winning/list'),
  // },
]
