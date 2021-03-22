// 行为痕迹
export default [
    // 行为痕迹-列表
    {
      path: 'scrm/traces-behavior/list',
      component: () => import('../views/traces-behavior/List')
    },
    // 行为痕迹-新增 修改 详情
    {
      path: 'scrm/traces-behavior/details',
      component: () => import('../views/traces-behavior/Details')
    },
  ]