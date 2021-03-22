<template>
  <QcNavigationMenu style="width:800px;margin:0 auto;" title="交易配置" :path="path"></QcNavigationMenu>
</template>

<script>
export default {
  data() {
    return {
      path: [
        {
          name: '订单配置',
          url: '/main/mall/config/transaction/order'
        },
        {
          name: '运费配置',
          url: '/main/mall/config/transaction/logistics'
        },
        {
          name: '提现配置',
          url: '/main/mall/config/transaction/poundage'
        },
        {
          name: '系统配置',
          url: '/main/mall/config/transaction/stytem'
        }
      ]
    }
  }
}
</script>
