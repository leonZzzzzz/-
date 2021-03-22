import thirdParty from './third-party'
import miniApp from './mini-app'
const outFlyWheel = [
  {
    path: '/flywheel/editor',
    component: () => import('../views/editor/Index')
  }
]
const InFlyWheel = [
  {
    path: 'flywheel/component/list',
    component: () => import('../views/manager/List')
  },
  {
    path: 'flywheel/category/list',
    component: () => import('../views/manager/Category')
  },
  {
    path: 'flywheel/navigation/list',
    component: () => import('../views/manager/NavigationBarList')
  },
  {
    path: 'flywheel/project/config',
    component: () => import('../views/project/Index'),
    children: [
      {
        path: 'user',
        component: () => import('../views/project/Config')
      },
      {
        path: 'store',
        component: () => import('../views/project/ConfigStore')
      },
    ]
  },
  
  // 小数桔【名片、商城、官网】小程序提审页面
  // {
  //   path: 'flywheel/project/ConfigScrmCard',
  //   component: () => import('../views/project/ConfigScrmCard'),
  // },

  // 移动端自定义菜单
  {
    path: 'flywheel/custom-menu',
    component: () => import('../views/manager/custom-menu/Index')
  },
  // 移动端自定义菜单
  {
    path: 'flywheel/third-party',
    component: () => import('../views/third-party/Index'),
    children: [
      {
        path: 'server_address_configuration',
        component: () => import('../views/third-party/ServerAddressConfiguration')
      },
      {
        path: 'code',
        component: () => import('../views/third-party/Code')
      },
      {
        path: 'manage',
        component: () => import('../views/third-party/Manage')
      },
    ]
  },
  ...thirdParty,
  ...miniApp
]

export { outFlyWheel, InFlyWheel }
