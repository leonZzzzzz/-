<template>
  <div class="AuthorizeSuccess">
    <span class="qcfont qc-icon-chenggong"></span>
    <p class="title">授权成功</p>
    <!-- <el-button @click="onClose">关闭页面</el-button> -->
  </div>
</template>

<script>
export default {
  methods: {
    onClose() {
      // 火狐默认不支持js关闭浏览器窗口，可以在about:config中将dom.allow_scripts_to_close_windows改为true。
      console.log('onClose')
      var userAgent = navigator.userAgent
      if (userAgent.includes('Firefox') || userAgent.includes('Chrome')) {
        console.log('火狐和谷歌')
        // window.open('','_self').close()  // 试了没效果
        window.location.href = 'about:blank'
      } else {
        // 试了没效果
        window.opener = null
        window.open('about:blank', '_self')
        window.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.AuthorizeSuccess {
  margin: 0 auto;
  margin-top: 15vh;
  width: 500px;
  text-align: center;
  .qcfont {
    font-size: 80px;
    color: #67c23a;
  }
  .title {
    font-size: 22px;
    margin: 30px 0;
    margin-top: 50px;
  }
  .tips {
    margin: 15px 0;
    font-size: 13px;
    color: #888;
  }
}
</style>
