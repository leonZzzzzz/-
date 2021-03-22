import Vue from 'vue'
import Router from 'vue-router'
import core from '@/modules/core/router'
import shopping from '@/modules/shopping/router'
import activity from '@/modules/activity/router'
import app from '@/modules/app/router'
import sms from '@/modules/sms/router'
import school from '@/modules/school/router'
import lesson from '@/modules/lesson/router'
import channel from '@/modules/channel/router'
import xiaoeTech from '@/modules/xiaoe-tech/router'
import setting from '@/modules/setting/router'
import store from '@/modules/store/router'
import {
  InFlyWheel,
  outFlyWheel
} from '@/modules/flywheel/router'
import examples from '@/examples'
import scrm from '@/modules/scrm/router'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/login',
    component: () => import( /* webpackChunkName: "main" */ '@/modules/core/views/login/Login.vue'),
    name: 'login'
  },
  {
    path: '/register',
    component: () => import( /* webpackChunkName: "main" */ '@/modules/core/views/register/Index.vue')
  },
  {
    path: '/service',
    component: () => import( /* webpackChunkName: "main" */ '@/modules/core/views/register/Service.vue')
  },
  {
    path: '/main',
    component: () => import( /* webpackChunkName: "main" */ '@/modules/core/views/layout/Main.vue'),
    children: [{
      path: 'index',
      component: () => import( /* webpackChunkName: "main" */ '@/modules/core/views/index/Index')
    },
    ...core,
    ...activity,
    ...app,
    ...shopping,
    ...InFlyWheel,
    ...sms,
    ...school,
    ...lesson,
    ...channel,
    ...xiaoeTech,
    ...setting,
    ...store,
    ...scrm
    ]
  },
  {
    path: '*',
    redirect: '/main/404'
  },
  ...outFlyWheel,
  ...examples
  ]
})

// 解决重复点击同一路由报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}