export default [
  {
    path: 'sms/list',
    component: () => import(/*webpackChunkName: "sms"*/ '../views/SmsQuotaList')
  },
  {
    path: 'sms/charge',
    component: () => import(/*webpackChunkName: "sms"*/ '../views/SmsCharge')
  },
  {
    path: 'sms/charge/list',
    component: () => import(/*webpackChunkName: "sms"*/ '../views/recharge/List')
  },
  {
    path: 'sms/send/list',
    component: () => import(/*webpackChunkName: "sms"*/ '../views/send/List')
  },
]
