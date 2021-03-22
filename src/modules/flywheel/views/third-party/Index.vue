<template>
  <QcNavigationMenu style="width:1000px;margin:0 auto;" title="第三方设置" :path="path"> </QcNavigationMenu>
</template>

<script>
export default {
  data() {
    return {
      path: [
        { name: '服务器域名', url: '/main/flywheel/third-party/server_address_configuration' },
        { name: '版本管理', url: '/main/flywheel/third-party/code' },
        { name: '成员管理', url: '/main/flywheel/third-party/manage' }
      ]
    }
  }
}
</script>

<style></style>
