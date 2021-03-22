const category = [
  // 分类列表
  {
    path: "category/list",
    component: () => import ('../components/page/category/list'),
  },
  {
    path: "category/form",
    component: () => import ('../components/page/category/form'),
  },
  {
    path: "category/tags",
    component: () => import("../components/page/category/tags/list")
  }
];

export default category;
