const info = [

  // 已审核的资讯
  {
    path: "info/auditNewsList",
    component: () => import("../components/page/info/list/auditNewslist")
  },
  // 未审核的资讯
  {
    path: "info/unAuditNewsList",
    component: () => import("../components/page/info/list/unAuditNewsList")
  },

  //商品管理
  {
    path: "info/list",
    component: () =>
      import ('../components/page/info/list/list'),
  },
  //商品详情
  {
    path: "info/list/detail",
    component: () =>
      import ('../components/page/info/list/detail'),
  },
  //商品详情
  {
    path: "info/detail",
    component: () =>
      import ('../components/page/report/detail'),
  },
  

  //留言列表
  {
    path: "info/leaveMsg",
    component: () =>
      import ('../components/page/info/leaveMsg/list'),
  },
  //举报列表
  {
    path: "info/report",
    component: () =>
      import ('../components/page/info/report/list'),
  },
]

export default info
