<template>
  <!-- <ConfigScrmCard /> -->
  <Weapp />
</template>

<script>
// ConfigScrmCard是之前独立的【小数桔名片】小程序，现与小蜘蛛小程序整合到了一起
// import ConfigScrmCard from '@/modules/flywheel/views/project/ConfigScrmCard'
// weapp是飞轮魔盒的用户端模块，同“平台装修”菜单一个页面
import Weapp from '@/modules/flywheel/views/project/Config'
export default {
  components: {
    // ConfigScrmCard, // 原名片小程序
    Weapp
  }
}
</script>
