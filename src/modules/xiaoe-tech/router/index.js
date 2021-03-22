export default [
  {
    path: 'xiaoe-tech/app',
    component: () => import('../views/app/List.vue')
  },
  {
    path: 'xiaoe-tech/app/detail',
    component: () => import('../views/app/Detail.vue')
  },
  {
    path: 'xiaoe-tech/course-vip',
    component: () => import('../views/course-vip/List.vue')
  },
  {
    path: 'xiaoe-tech/course-vip/form',
    component: () => import('../views/course-vip/Form.vue')
  },
  {
    path: 'xiaoe-tech/resource',
    component: () => import('../views/resource/List.vue')
  },
]
