export default [
  // 群发-群发客户-新增群发
  {
    path: 'scrm/groupsend/newlyadded',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/newlyadded')
  },
  // 群发-群发客户-群发记录
  {
    path: 'scrm/groupsend/sendingrecord',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/sendingrecord')
  },
  // 群发-群发客户-草稿箱
  {
    path: 'scrm/groupsend/drafts',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/drafts')
  },
  {
    path: 'scrm/groupsend/newlyadded/groupSendingDetail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/groupSendingDetails')
  },
  {
    path: 'scrm/groupsend/drafts/editDrafts',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/EditDrafts')
  },
  {
    path: 'scrm/groupsend/sendingrecord/recordgroup',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/recordgroup')
  },
  //个人群发
  {
    path: 'scrm/groupsend/personalsend/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/personalsend/Form')
  },
  //客户群发
  {
    path: 'scrm/groupsend/customersend/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/customersend/Form')
  },
  //草稿箱--列表
  {
    path: 'scrm/groupsend/drafts/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/drafts/List')
  },
  //草稿箱--个人列表
  {
    path: 'scrm/groupsend/drafts/personal',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/drafts/Personal')
  },
  //草稿箱--群列表
  {
    path: 'scrm/groupsend/drafts/group',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/drafts/Group')
  },
  //草稿箱--表单
  {
    path: 'scrm/groupsend/drafts/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/drafts/Form')
  },
  //再次群发--列表
  {
    path: 'scrm/groupsend/regroupsend/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/regroupsend/List')
  },
  //再次群发--个人列表
  {
    path: 'scrm/groupsend/regroupsend/personal',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/regroupsend/Personal')
  },
  //再次群发--群列表
  {
    path: 'scrm/groupsend/regroupsend/group',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/regroupsend/Group')
  },
  //再次群发--表单
  {
    path: 'scrm/groupsend/regroupsend/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/regroupsend/Form')
  },
  {
    path: 'scrm/groupsend/regroupsend/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/regroupsend/Detail')
  },
  {
    path: 'scrm/groupsend/regroupsend/editform',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/regroupsend/EditForm')
  },
  {
    path: 'scrm/groupsend/operation/details',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/operation/Details')
  },
  {
    path: 'scrm/groupsend/operation/group-details',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/groupsend/operation/GroupDetails')
  },
]
