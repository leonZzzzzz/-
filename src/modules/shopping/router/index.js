export default [
  //#region 门店
  // {
  //   path: 'mall/store/list',
  //   component: () => import('../views/store/List')
  // },
  // {
  //   path: 'mall/store/form',
  //   component: () => import('../views/store/Form')
  // },
  //#endregion
  //#region 店铺
  {
    path: 'mall/store/list',
    component: () => import('../views/store/List')
  },
  {
    path: 'mall/store/config',
    component: () => import('../views/store/Config')
  },
  {
    path: 'mall/store/room/list',
    component: () => import('../views/store/LiveRoomList')
  },
  {
    path: 'mall/store/room/data',
    component: () => import('../views/store/LiveRoomData')
  },
  {
    path: 'mall/store/category',
    component: () => import('../views/store/category/List')
  },
  {
    path: 'mall/store/category/store',
    component: () => import('../views/store/category/StoreList')
  },
  {
    path: 'mall/store/form',
    component: () => import('../views/store/Form')
  },
  {
    path: 'mall/store/registration/list',
    component: () => import('../views/store/store-registration/List')
  },
  {
    path: 'mall/store/refundRecord/list',
    component: () => import('../views/store/refundRecord/List')
  },

  // 店铺优惠券管理
  {
    path: 'mall/store/coupon/list',
    component: () => import('../views/store/coupon/List')
  },
  {
    path: 'mall/store/coupon/form',
    component: () => import('../views/store/coupon/Form')
  },

  //店铺轮播图
  {
    path: 'mall/store/carousel/list',
    component: () => import('../views/store/carousel/List')
  },
  //店铺轮播图
  {
    path: 'mall/store/kefu/qwkf',
    component: () => import('../views/store/kefu/QwKefu')
  },
  //#endregion

  //#region 商品管理
  {
    path: 'mall/product/list',
    component: () => import('../views/product/List')
  },
  {
    path: 'mall/product-platform/list',
    component: () => import('../views/product/platform-product/List')
  },
  {
    path: 'mall/product/list/form',
    component: () => import('../views/product/Form')
  },
  {
    path: 'mall/product/category/list',
    component: () => import('../views/category/List')
  },
  {
    path: 'mall/product/brand/list',
    component: () => import('../views/brand/List')
  },
  {
    path: 'mall/product/level/list',
    component: () => import('../views/level/List')
  },
  {
    path: 'mall/product/group-shopping/list',
    component: () => import('../views/group-shopping/List')
  },
  {
    path: 'mall/product/group-shopping/form',
    component: () => import('../views/group-shopping/Form')
  },
  {
    path: 'mall/product/help-shopping/list',
    component: () => import('../views/help-shopping/List')
  },
  {
    path: 'mall/product/help-shopping/form',
    component: () => import('../views/help-shopping/Form')
  },
  {
    path: 'mall/product/sales-shopping/List',
    component: () => import('../views/sales-shopping/List')
  },
  {
    path: 'mall/product/sales-shopping/Form',
    component: () => import('../views/sales-shopping/Form')
  },
  //#endregion

  //#region 订单管理
  {
    path: 'mall/order/product/list',
    component: () => import('../views/order/product/List')
  },
  {
    path: 'mall/order/product/detail',
    component: () => import('../views/order/product/Detail')
  },
  {
    path: 'mall/order/group-shopping/list',
    component: () => import('../views/order/group-shopping/List')
  },
  {
    path: 'mall/order/help-shopping/list',
    component: () => import('../views/order/help-shopping/List')
  },

  //#endregion

  //#region 售后
  {
    path: 'mall/service/after-sale/list',
    component: () => import('../views/service/after-sale/List')
  },
  {
    path: 'mall/service/after-sale/detail',
    component: () => import('../views/service/after-sale/Detail')
  },
  {
    path: 'mall/service/compensation/list',
    component: () => import('../views/service/compensation/List')
  },
  //#endregion

  //#region 配置
  {
    path: 'mall/config/logistics',
    component: () => import( /* webpackChunkName: "main" */ '../views/config/logistics/List')
  },
  {
    path: 'mall/config/transaction',
    redirect: 'mall/config/transaction/order',
    component: () => import( /* webpackChunkName: "main" */ '../views/config/transaction/Index'),
    children: [{
        path: 'order',
        component: () => import('../views/config/transaction/Order')
      },
      {
        path: 'logistics',
        component: () => import('../views/config/transaction/Logistics')
      },
      {
        path: 'poundage',
        component: () => import('../views/config/transaction/Poundage')
      },
      {
        path: 'stytem',
        component: () => import('../views/config/transaction/Stytem')
      },
    ]
  },
  //#endregion

  {
    path: 'mall/config/agreement',
    redirect: 'mall/config/agreement/MEMBER_TOS',
    component: () => import( /* webpackChunkName: "config" */ '../views/config/agreement/Index'),
    children: [{
        path: 'MEMBER_TOS',
        component: () => import('../views/config/agreement/MemberTos')
      },
      {
        path: 'STORE_TOS',
        component: () => import('../views/config/agreement/StoreTos')
      },
      {
        path: 'WITHDRAWAL_MEMBER_FAQ',
        component: () => import('../views/config/agreement/WithdrawalMember')
      },
      {
        path: 'WITHDRAWAL_STORE_FAQ',
        component: () => import('../views/config/agreement/WithdrawalStore')
      }
    ]
  },

  {
    path: 'mall/withdraw/custList',
    component: () => import('../views/withdraw/custList')
  },
  {
    path: 'mall/withdraw/storeList',
    component: () => import('../views/withdraw/storeList')
  },

  // ip
  {
    path: 'mall/ip/list',
    component: () => import( /*webpackChunkName: "mall"*/ '../views/ip/List')
  },
  // 平台优惠券管理
  {
    path: 'mall/coupon/list',
    component: () => import( /*webpackChunkName: "mall"*/ '../views/coupon/List')
  },
  // 平台优惠券添加和修改
  {
    path: 'mall/coupon/form',
    component: () => import( /*webpackChunkName: "mall"*/ '../views/coupon/Form')
  },
  // 客服管理-店铺客服
  {
    path: 'mall/store/kf',
    component: () => import( /*webpackChunkName: "mall"*/ '../views/store/kefu/List')
  }
]