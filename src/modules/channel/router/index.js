export default [
  {
    path: 'channel/code',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/CodeList')
  },
  {
    path: 'channel/list',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/List')
  },
  {
    path: 'channel/download',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/DownChannelActivityQrcode')
  },
  {
    path: 'sales/list',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sales/List')
  },
  {
    path: 'sales/config',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sales/Config')
  },
  {
    path: 'sales/other',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sales/Other')
  },
  {
    path: 'sales/poster',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sales/Poster')
  },

  // ---------------------推广者-----------------------
  // 平台推广者列表
  {
    path: 'sharer/list',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sharer/List')
  },
  // 平台待审核推广者列表
  {
    path: 'sharer/auditList',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sharer/AuditList')
  },
  // 商户推广者列表
  {
    path: 'sharer/store/list',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sharer/store/List')
  },
  // 商户待审核推广者列表
  {
    path: 'sharer/store/auditList',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sharer/store/AuditList')
  },
  {
    path: 'sharer/detail',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sharer/Detail')
  },
  // 推广者等级
  {
    path: 'sharer/level',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sharer/Level')
  },
  // 推广者提现
  {
    path: 'sharer/withdraw',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sharer/Withdraw')
  },
  // 平台推广者订单
  {
    path: 'sharer/order',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sharer/OrderList')
  },
  // 推广者系统设置
  {
    path: 'sharer/config',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sharer/Config')
  },
  // 推广商品
  {
    path: 'sharer/mall',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sharer/mall/List')
  },
  // 推广商品
  {
    path: 'sharer/mall/form',
    component: () => import(/*webpackChunkName: "channel"*/ '../views/sharer/mall/Form')
  },
]
