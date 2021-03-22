<template>
  <QcNavigationMenu title="协议&条款管理" :path="path" style="width:900px;margin:0 auto"></QcNavigationMenu>
</template>

<script>
export default {
  data() {
    return {
      path: [
        // { name: '服务条款-买家', url: '/main/mall/config/agreement/MEMBER_TOS' },
        { name: '服务条款-店铺', url: '/main/mall/config/agreement/STORE_TOS' },
        { name: '提现相关问题-店铺', url: '/main/mall/config/agreement/WITHDRAWAL_STORE_FAQ' }
        // { name: '提现相关问题-买家', url: '/main/mall/config/agreement/WITHDRAWAL_MEMBER_FAQ' }
      ]
    }
  }
}
</script>
