export default [
  //#region 用户管理
  {
    path: 'base/member',
    component: () => import('../views/base/member/List')
  },
  {
    path: 'base/member/actor',
    component: () => import('../views/base/member/actor/List')
  },
  // {
  //   path: 'base/member/level',
  //   component: () => import('../views/base/member/level/List')
  // },
  //#endregion
]
