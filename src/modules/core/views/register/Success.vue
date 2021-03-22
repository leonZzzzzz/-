<template>
  <div id="register" class="container">
    <!-- 注册成功 -->
    <div class="register-ok">
      <p class="theme-color">恭喜您注册成功!</p>
      <span>{{ timeJump }}秒后自动跳转...</span>
      <div>
        <el-button class="btn" @click="$router.replace('/login')">立即登陆</el-button>
      </div>
    </div>
    <footer class="footer">
      <p class="theme-color">Copyright 2013-2018 企成科技 版权所有</p>
    </footer>
    <image-dialog
      :visible="digImgWrap"
      uploadType="radio"
      imageType="regType"
      @close-imgbox="closeImgbox"
      @get-imgsrc="onGetImgsrc"
    ></image-dialog>
  </div>
</template>
<script>
import api from 'api/common.js'
import ImageDialog from 'common/ImageDialog'
export default {
  components: {
    ImageDialog
  },
  data() {
    return {
      loading: false,
      digImgWrap: false,
      registerOk: false,
      second: 6,
      timeJump: 5,
      setTimeJump: null
    }
  },
  beforeDestroy() {
    console.log('跳转了……')
    clearInterval(this.setTimeJump)
  },
  created() {
    if (this.setTimeJump) clearInterval(this.setTimeJump)
    this.startInterval()
  },
  methods: {
    handleSelect(index) {
      this.showTab = index
    },
    jumpPage(url) {
      this.$router.push(url)
    },
    // 验证码倒计时
    countDown() {
      this.isSend = true
      this.timer = setInterval(() => {
        this.second--
        if (this.second < 1) {
          clearInterval(this.timer)
          this.isSend = false
          this.second = 59
          return
        }
      }, 1000)
    },

    startInterval() {
      this.setTimeJump = setInterval((_) => {
        if (this.timeJump <= 0) {
          clearInterval(this.setTimeJump)
          this.timeJump = 0
          this.$router.replace('/login')
          return
        }
        this.timeJump--
      }, 1000)
    },

    // 打开图片对话框
    openImgBox() {
      // this.uploadType = type
      this.digImgWrap = true
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false
    },
    // 单张图片
    onGetImgsrc(val) {
      this.register.logUrl = val
      // console.log(this.register.logUrl, val)
    }
  }
}
</script>

<style lang="scss">
#register {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  min-height: 100%;
  background: #ebeef2;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  // overflow: hidden;
  overflow: scroll;
  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  // 注册成功
  .register-ok {
    height: 500px;
    text-align: center;
    color: #999;
    p {
      font-size: 26px;
      font-weight: bold;
      line-height: 3;
      margin-top: 30px;
    }
    div {
      margin-top: 50px;
    }
    .btn {
      background: #999 !important;
      color: #f2f2f2 !important;
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 40px 0;
    text-align: center;
    color: #fff;
    font-size: 14px;
  }
}
</style>
