// 新闻
const news = [
  //列表
  {
    path: "news/list",
    component: () =>
      import ('../components/page/news/list/list'),
  },
  //详情
  {
    path: "news/list/detail",
    component: () =>
      import ('../components/page/news/list/detail'),
  },
  //分类
  {
    path: "news/category",
    component: () =>
      import ('../components/page/news/category/list'),
  },

  //留言列表
  {
    path: "news/leaveMsg",
    component: () =>
      import ('../components/page/news/leaveMsg/list'),
  },
]

export default news
