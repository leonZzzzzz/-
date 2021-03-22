const member = [
  // 会员管理
  {
    path: "member",
    component: () =>
      import ('../components/page/member/list'),
  },
  // 会员等级
  {
    path: "memberLevel",
    component: () =>
      import ('../components/page/memberLevel/list'),
  },
  // 会员头衔
  {
    path: "memberActor",
    component: () =>
      import ('../components/page/memberActor/list'),
  },

  // 会费管理
  {
    path: "memberFees",
    component: () =>
      import ('../components/page/memberFees/list'),
  },
  // 会费配置
  {
    path: "memberFees/config",
    component: () =>
      import ('../components/page/memberFees/config'),
  },
  // 会费订单
  {
    path: "memberFees/order",
    component: () =>
      import ('../components/page/memberFees/order'),
  },
];

export default member;