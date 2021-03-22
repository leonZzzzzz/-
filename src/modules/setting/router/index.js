export default [
  {
    path: 'setting/store/setting',
    redirect: 'setting/store/setting/management',
    component: () => import('../views/store/index'),
    children: [
      {
        path: 'information',
        component: () => import('../views/store/information')
      },
      {
        path: 'management',
        component: () => import('../views/store/management')
      }
    ]
  }
]