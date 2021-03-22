export default [
  //运营管理--加人活码
  {
    path: 'scrm/operation-management/addlivecode/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/addlivecode/List'),
    meta: {
      // keepAlive: true // true 需要被缓存
    }
  },
  //运营管理-加人活码新增
  {
    path: 'scrm/operation-management/addlivecode/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/addlivecode/Form')
  },
  //运营管理-加人活码客户详情列表
  {
    path: 'scrm/operation-management/addlivecode/detailslist',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/addlivecode/Details')
  },
  {
    path: 'scrm/operation-management/addlivecode/editform',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/addlivecode/EditForm')
  },
  //运营管理--加群活码
  {
    path: 'scrm/operation-management/labelgroupbuilding/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/labelgroupbuilding/List')
  },
  //运营管理--加群活码列表
  {
    path: 'scrm/operation-management/labelgroupbuilding/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/labelgroupbuilding/Form')
  },
  //运营管理--欢迎语
  {
    path: 'scrm/operation-management/welcomemessage/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/welcomemessage/List')
  },
  //运营管理--欢迎语新建
  {
    path: 'scrm/operation-management/welcomemessage/details',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/welcomemessage/Details')
  },
  //运营管理--欢迎语我的小小项目
  {
    path: 'scrm/operation-management/welcomemessage/mydemo',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/welcomemessage/MyDemo')
  },
  //运营管理--批量加好友
  {
    path: 'scrm/operation-management/addfriends/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/addfriends/List'),
    meta: {
      // keepAlive: true // true 需要被缓存
    }
  },
  //运营管理--查看好友详情
  {
    path: 'scrm/operation-management/addfriends/details',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/addfriends/Details')
  },
  //运营管理--会话监控
  {
    path: 'scrm/operation-management/sessionmonitoring/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/sessionmonitoring/List')
  },
  //运营管理--会话监控--敏感词库
  {
    path: 'scrm/operation-management/sessionmonitoring/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/sessionmonitoring/Detail')
  },
  //运营管理--互动监测--列表
  {
    path: 'scrm/operation-management/interactivemonitoring/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/interactivemonitoring/List')
  },
  //运营管理--互动监测--表单
  {
    path: 'scrm/operation-management/interactivemonitoring/detail',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/interactivemonitoring/Detail')
  },
  //运营管理--互动监测--详情
  {
    path: 'scrm/operation-management/interactivemonitoring/form',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/interactivemonitoring/Form')
  },
  //运营管理--聊天会话配置--列表
  {
    path: 'scrm/operation-management/chatsessionconfig/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/chatsessionconfig/List')
  },
  //运营管理--流失提醒--列表
  {
    path: 'scrm/operation-management/lossreminder/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/lossreminder/List')
  },
  //违规检测--列表
  {
    path: 'scrm/operation-management/vlolation/list',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/violationmonitoring/List')
  },
  //引导页
  {
    path: 'scrm/operation-management/guide/guidePage',
    component: () => import(/* webpackChunkName: "scrm" */ '../views/operation-management/guide/GuidePage')
  }
]
