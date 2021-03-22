const base = [
  // 图片管理
  {
    path: "attachment",
    component: () =>
      import('../components/page/attachment/list'),
  },
  // 校友库列表
  {
    path: "alumniStore",
    component: () =>
      import('../components/page/alumniStore/list'),
  },
  // 国家管理
  {
    path: "countryAndCity/country",
    component: () =>
      import('../components/page/countryAndCity/countryList'),
  },

  // 分值管理
  {
    path: "score",
    component: () =>
      import('../components/page/score/form'),
  },
  // 敏感词管理
  {
    path: "sensitiveWords",
    component: () =>
      import('../components/page/sensitiveWords/list'),
  },
  // 教学项目
  {
    path: "setting/profession/list",
    component: () =>
      import('../components/page/setting/profession/list'),
  },

  // 班级
  {
    path: "classes",
    component: () =>
      import('../components/page/classes/list'),
  },

  // 其它设置
  {
    path: "setting/other",
    component: () =>
      import('../components/page/setting/other'),
  },
  // 积分设置
  {
    path: "setting/cards",
    component: () =>
      import('../components/page/setting/cards'),
  },

  // 协议设置
  {
    path: "setting/agreement",
    component: () =>
      import('../components/page/setting/agreement/list'),
  },
  {
    path: "setting/agreement/detail",
    component: () =>
      import('../components/page/setting/agreement/detail'),
  },
  {
    path: "setting/registerConfig/index",
    component: () =>
      import('../components/page/setting/registerConfig/index'),
  },
];

export default base;
