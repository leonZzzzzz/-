export default [
  {
    path: 'service/setting/my',
    redirect: 'service/setting/my/config',
    component: () => import('../views/service/platform/Index'),
    children: [
      {
        path: 'config',
        component: () => import('../views/service/platform/Config')
      },
      {
        path: 'management',
        component: () => import('../views/service/platform/Management')
      }
    ]
  },
  {
    path: 'service/setting/AuthorizeSuccess',
    component: () => import('../views/service/platform/AuthorizeSuccess')
  },
  {
    path: 'service/setting/pay',
    component: () => import('../views/service/pay/List')
  },
  {
    path: 'service/setting/pay/agreement',
    component: () => import('../views/service/pay/Agreement')
  },
  {
    path: 'service/setting/pay/agreement/form',
    component: () => import('../views/service/pay/AgreementForm')
  }
]
