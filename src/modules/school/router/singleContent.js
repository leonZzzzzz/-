export default [
  //列表
  {
    path: "singleContent/list",
    component: () =>
      import('../components/page/singleContent/list/list'),
  },
  //详情
  {
    path: "singleContent/list/detail",
    component: () =>
      import('../components/page/singleContent/list/detail'),
  },
  //分类
  {
    path: "singleContent/category",
    component: () =>
      import('../components/page/singleContent/category/list'),
  },
]