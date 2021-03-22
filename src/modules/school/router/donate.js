export default [
  //列表
  {
    path: "donate/list",
    component: () =>
      import('../components/page/donate/list/list'),
  },
  //发布
  {
    path: "donate/list/release",
    component: () =>
      import('../components/page/donate/list/release'),
  },
  //详情
  {
    path: "donate/list/detail",
    component: () =>
      import('../components/page/donate/list/detail'),
  },
  //分类
  {
    path: "donate/category",
    component: () =>
      import('../components/page/donate/category/list'),
  },

]