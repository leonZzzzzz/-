const report = [
  // 举报功能管理
  {
    path: "report",
    component: () => import("../components/page/report/list")
  },
  // 查看详情
  {
    path: "report/detail",
    component: () => import("../components/page/report/detail")
  },
];

export default report;
