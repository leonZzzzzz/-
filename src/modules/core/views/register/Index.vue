<template>
  <div id="register" class="container">
    <section class="content">
      <!-- 注册 开始-->
      <div class="register">
        <el-form :model="register" class="form" :rules="rules" ref="model" label-position="left" label-width="80px">
          <p class="register-title theme-color">免费注册</p>
          <el-form-item label="平台名称" prop="appName">
            <el-input type="text" v-model.trim="register.appName" placeholder="请输入平台名称"></el-input>
          </el-form-item>
          <el-form-item label="公司名称" prop="customerName">
            <el-input type="text" v-model.trim="register.customerName" placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobilePhoneNumber">
            <el-input
              type="text"
              v-model.trim="register.mobilePhoneNumber"
              placeholder="以后可以使用手机号登陆"
            ></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="validateCodeByMember">
            <el-input
              type="text"
              v-model.trim="register.validateCodeByMember"
              placeholder="请输入验证码"
              style="display: inline-block; width: 120px;"
            ></el-input>
            <div class="get-code" style="width: 120px;">
              <span v-if="!isSend" @click="sendCode()">获取验证码</span>
              <span v-else style="color: #999;">重新获取 ({{ second }}) s</span>
            </div>
          </el-form-item>
          <el-form-item label="输入密码" prop="password">
            <el-input type="password" v-model.trim="register.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input type="password" v-model.trim="register.confirmPassword" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <p style="cursor: pointer;font-size: 12px;">
            <el-checkbox style="color: #999 !important;" v-model="isAgree" @change="agree">我已阅读并同意</el-checkbox>
            <span class="theme-color" @click="toQcService('/service')">&lt;&lt;企成科技服务协议&gt;&gt;</span>
          </p>
          <el-button type="primary" class="button" :disabled="!isAgree" @click="reg()" :loading="loading"
            >我要注册</el-button
          >
        </el-form>
        <p class="text-reg">
          已有账号？
          <span @click="jumpPage('/login')">马上登陆</span>
        </p>
      </div>
    </section>
    <footer class="footer">
      <p class="theme-color">Copyright 2013-2018 企成科技 版权所有</p>
    </footer>
  </div>
</template>
<script>
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.register.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      digImgWrap: false,
      isAgree: false,
      isSend: false,
      showBtn: false,
      second: 59,
      timeJump: 5,
      setTimeJump: null,
      versionList: [],
      register: {
        appName: '',
        customerName: '',
        logUrl: '',
        mobilePhoneNumber: '',
        validateCodeByMember: '',
        password: '',
        // 确认密码
        confirmPassword: '',
        // 版本id(具体到某个时长)
        configId: ''
      },
      rules: {
        appName: [{ required: true, message: '字段不能为空', trigger: 'blur' }],
        customerName: [{ required: true, message: '字段不能为空', trigger: 'blur' }],
        mobilePhoneNumber: [{ required: true, message: '字段不能为空', trigger: 'blur' }],
        validateCodeByMember: [{ required: true, message: '字段不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '字段不能为空', trigger: 'blur' }],
        confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
        configId: [{ required: true, message: '字段不能为空', trigger: 'blur' }]
      }
    }
  },
  beforeDestroy() {
    console.log('跳转了……')
    clearInterval(this.setTimeJump)
  },
  created() {
    this.getAppVersion()
    if (this.setTimeJump) clearInterval(this.setTimeJump)
    // this.startInterval();
  },
  methods: {
    handleSelect(index) {
      this.showTab = index
    },
    jumpPage(url) {
      this.$router.push(url)
    },
    toQcService() {
      let routeData = this.$router.resolve({ path: '/service' })
      window.open(routeData.href, '_blank')
    },
    agree(val) {
      this.isAgree = val
    },
    getAppVersion() {
      this.$http.getAppVersion().then((res) => {
        console.log('版本信息', res)
        this.versionList = res.data.data.list
        this.register.configId = this.versionList[0].list[0].id
        // if (location && location.host == 'go.growth168.com' && this.versionList[1]) {
        //   // go.growth168.com 域名用数字增长的
        //   this.register.configId = this.versionList[1].list[0].id
        //   return
        // } else {
        //   this.register.configId = this.versionList[0].list[0].id
        // }
      })
    },
    apiRegister(data) {
      this.$http
        .register(data)
        .then((res) => {
          this.$message.success('注册成功！')
          this.loading = false
          this.jumpPage('/login')
        })
        .catch((err) => {
          this.loading = false
          this.$message.error(err.message)
          this.$message.error('注册失败，请重试！')
          console.log('注册接口失败', err)
        })
    },
    reg() {
      this.loading = true
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.apiRegister(this.register)
        } else {
          this.loading = false
        }
      })
    },
    // 发送验证码
    sendCode() {
      if (this.isSend) return
      if (!this.register.mobilePhoneNumber) {
        this.$message.warning('请输入手机号')
        return
      }
      this.countDown()
      this.getMobileCode()
    },
    getMobileCode() {
      this.$http.getMobileCode({ mobilePhoneNumber: this.register.mobilePhoneNumber }).then((res) => {
        this.$message.success('验证码已发送')
      })
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
          this.$router.replace('/main/platformSituation')
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
  overflow: auto;
  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  .title-top {
    position: relative;
    color: #fff;
    margin-bottom: 30px;
    line-height: 2;
    text-align: center;
    font-family: 'Microsoft YaHei';
    .logo {
      width: 150px;
      // margin: -55px auto 0 auto;
      line-height: 1;
      text-align: center;
      margin: 0 auto;
      img {
        width: 100%;
      }
    }
    p {
      margin: 10px 0;
      font-size: 16px;
      color: #999;
    }
  }
  .content {
    position: relative;
    background: #fff;
    width: 450px;
    height: auto;
    margin: 0 auto;
    margin-top: 100px;
    border-radius: 10px;
    box-shadow: 0px 1px 10px 0px #ccc;
    padding: 30px 50px;
    box-sizing: border-box;
    .tabhead {
      display: flex;
      .tab {
        flex: 1;
        color: #999;
        font-size: 20px;
        text-align: center;
        cursor: pointer;
        padding: 5px;
        &:first-child {
          border-right: 1px solid #eee;
        }
        i {
          font-size: 20px;
        }
      }
    }
    .form {
      width: 300px;
      padding: 20px 0 0;
      clear: both;
      .el-form-item .el-form-item__label {
        line-height: 40px;
      }

      .get-code {
        display: inline-block;
        width: 120px;
        height: 36px;
        border-radius: 4px;
        text-align: center;
        border: 1px solid #2161ad;
        color: #2161ad;
        cursor: pointer;
        float: right;
      }
      .button {
        width: 90%;
        margin: 0 5%;
        margin-top: 53px;
        line-height: 1.5;
      }
    }
    .wechat {
      width: 300px;
      .qrcode {
        width: 230px;
        margin: 30px auto;
        img {
          width: 100%;
        }
      }
      p {
        color: #999;
        font-size: 14px;
        text-align: center;
        line-height: 2;
        margin: 0 auto;
      }
    }
    .text-reg {
      text-align: center;
      margin-top: 30px;
      color: #999;
      span {
        color: #2161ad;
        cursor: pointer;
      }
    }
    // 注册
    .register {
      width: 350px;
      padding-top: 0;
      .form {
        width: 100%;
        padding-top: 0;
      }
      .register-title {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 20px;
      }
      .head-img {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 1px solid #ccc;
        cursor: pointer;
        line-height: 1;
        margin: 0 auto 20px;
        img {
          width: 100%;
          border-radius: 50%;
          height: 100%;
        }
        &:after {
          content: '上传Logo';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 0px 0px 50px 50px;
          color: #fff;
        }
      }
      .form-label {
        color: #999;
        width: 100px;
        margin-bottom: 20px;
      }
    }
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
    position: static !important;
    width: 100%;
    padding: 40px 0;
    text-align: center;
    color: #2161ad !important;
    font-size: 14px;
  }
}
</style>
