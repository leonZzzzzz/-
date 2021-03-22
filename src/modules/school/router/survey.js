const survey = [
  // 问卷列表
  {
    path: "survey/list",
    component: () =>
      import ('../components/page/survey/list'),
  },
  // 问卷发布
  {
    path: "survey/list/release",
    component: () =>
      import ('../components/page/survey/release'),
  },
  // 编辑问题
  {
    path: "survey/list/question",
    component: () =>
      import ('../components/page/survey/question/release'),
  },

]

export default survey
