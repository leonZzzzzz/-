export default [
  {
    path: 'scrm/mate-center/poster',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/mate-center/poster-box/poster')
  },
  {
    path: 'scrm/mate-center/manager',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/mate-center/manager-box/manager')
  },
  {
    path: 'scrm/mate-center/textcategory',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/mate-center/manager-box/textcategory')
  },
  {
    path: 'scrm/mate-center/imagecategory',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/mate-center/manager-box/imagecategory')
  },
  {
    path: 'scrm/mate-center/videocategory',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/mate-center/manager-box/videocategory')
  },
  {
    path: 'scrm/mate-center/filecategory',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/mate-center/manager-box/filecategory')
  },
  {
    path: 'scrm/mate-center/minicategory',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/mate-center/manager-box/minicategory')
  },
  {
    path: 'scrm/mate-center/singlecategoryDetail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/mate-center/manager-box/singlecategoryDetail')
  },
  {
    path: 'scrm/mate-center/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/mate-center/poster-box/detail')
  },
  {
    path: 'scrm/mate-center/external/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/mate-center/external/list')
  },
  {
    path: 'scrm/mate-center/external/RelatedDialog',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/mate-center/external/RelatedDialog')
  },
  {
    path: 'scrm/mate-center/external/AccountDialog',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/mate-center/external/AccountDialog')
  },

]