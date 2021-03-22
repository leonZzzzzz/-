<template>
  <el-container>
    <el-header style="height:56px;">
      <header class="logo">
        <div
          v-if="isShowLoginPageAppInfo"
          class="logo-content"
        >
          <img
            style="height: 45px"
            :src="`${imgHost}${loginPageInfo.loginLogo}`"
            alt
          />
        </div>
        <div
          v-else-if="companyData && companyData.company == '数字增长'"
          class="logo-content"
        >
          <img
            style="height: 45px"
            :src="`${imgHost}${companyData.logUrl}`"
            alt
          />
        </div>
        <img
          v-else
          class="logo-img"
          src="../login/spider.png"
        />
      </header>
      <div
        v-if="isShowLoginPageAppInfo"
        class="app-name-block"
      >
        <span>{{ loginPageInfo.name }}</span>
        <span class="line">|</span>
      </div>
      <div class="user">
        <span v-if="user && user.app" class="appName">{{ user.app.name }}</span>
        <el-dropdown
          class="el-dropdown"
          :hide-on-click="false"
        >
          <span>
            {{ user.username }}
            <i class="el-icon-arrow-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="showPwd()">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container style="position: fixed;top: 56px;bottom: 0;width:100%;">
      <!-- <AsideOne v-if="!isQYWX"></AsideOne>
      <AsideTwo v-if="isQYWX"></AsideTwo> -->
      <AsideTwo></AsideTwo>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <el-dialog
      title="修改账号密码"
      :visible.sync="visiblePwd"
      :append-to-body="true"
      :before-close="closePwd"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="400px"
    >
      <el-form
        v-if="visiblePwd"
        :model="pwdData"
        ref="pwdData"
        label-position="right"
        label-width="100px"
      >
        <el-form-item
          label="旧密码"
          prop="password"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-input
            type="password"
            v-model="pwdData.password"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPassword"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-input
            type="password"
            v-model="pwdData.newPassword"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-input
            type="password"
            v-model="pwdData.confirmPassword"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closePwd()">取 消</el-button>
        <el-button
          type="primary"
          @click="successPwd()"
          :loading="loading"
        >确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
// import AsideOne from './AsideOne.vue'
import AsideTwo from './AsideTwo.vue'
export default {
  components: {
    // AsideOne,
    AsideTwo
  },
  data() {
    return {
      user: {
        username: ''
      },
      visiblePwd: false,
      loading: false,
      pwdData: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      appMsgValid: false,
      activeIndex: [0, 0],
      // 登录页的显示和main.vue页面的显示要区分下
      companyData: {}, // 存放网站标题和ico图标等
      loginPageInfo: {}, // 存放登录页logo和name等
      isShowLoginPageAppInfo: false
      // isQYWX: false
    }
  },
  created() {
    // console.log(this.$route)
    console.log('main created ===>')
    this.user = JSON.parse(localStorage.getItem('user')) || {}
    this.getApplist()
    // this.getCurrentPath()
    this.getIsStoreRole()
    this.getLoginPageInfo()
  },
  methods: {
    // 判断当前登录账号是否是店铺角色
    getIsStoreRole() {
      let isStoreRole = this.$store.state.isStoreRole
      let values = [null, undefined, 'undefined', '']
      if (values.includes(isStoreRole)) {
        let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
        if (user && user.storeId) {
          this.$store.commit('setIsStorerole', true)
        } else {
          this.$store.commit('setIsStorerole', false)
        }
      }
    },
    getApplist() {
      let appTypeList = []
      this.$http.pageWxApp().then(res => {
        if (res.data.data && res.data.data.list) {
          appTypeList = res.data.data.list.filter(item => item.serviceType).map(item => item.serviceType)
          this.$store.commit('updateAppTypeList', appTypeList)
          localStorage.setItem('appTypeList', JSON.stringify(appTypeList))
          console.log('getApplist', appTypeList)
        }
      })
    },
    logout() {
      this.$confirm('确定退出当前账号吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.logout().then(() => {
            this.$router.replace('/login')
            localStorage.removeItem('user')
            sessionStorage.removeItem('indexObj')
          })
        })
        .catch(() => {
          return
        })
    },
    getLoginPageInfo() {
      try {
        this.companyData = JSON.parse(localStorage.getItem('companyData')) || {}
      } catch (error) {
        console.log(error)
      }
      let strs = location.pathname.split('/')
      let code = strs[1]
      // let code = 'wghjy'
      // console.log(code)
      if (code) {
        // let _loginPageInfo = localStorage.getItem('loginPageInfo')
        // if (_loginPageInfo) {
        //   let loginPageInfo = JSON.parse(_loginPageInfo) || {}
        //   if (loginPageInfo.loginLogo) {
        //     this.isShowLoginPageAppInfo = true
        //     this.loginPageInfo = loginPageInfo
        //     return
        //   }
        // }
        this.$http.getAppMessage({ code: code }).then(res => {
          let obj = res.data.data
          if (obj && obj.loginLogo) {
            this.isShowLoginPageAppInfo = true
            this.loginPageInfo = obj
          } else {
            this.isShowLoginPageAppInfo = false
          }
        })
      }
      // console.log('当前URL的路径部分:' + pathName + '截取字符串:' + code)
    },
    showPwd() {
      this.visiblePwd = true
    },
    closePwd() {
      this.visiblePwd = false
      this.pwdData = {
        password: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    successPwd() {
      this.$refs.pwdData.validate(valid => {
        if (valid) {
          if (this.pwdData.newPassword === this.pwdData.confirmPassword) {
            this.loading = true
            this.updatePwd()
          } else {
            this.$message.error('两次密码不一致，请确认。')
          }
        } else {
          return false
        }
      })
    },
    async updatePwd() {
      try {
        let data = {
          password: this.pwdData.password,
          newPassword: this.pwdData.newPassword,
          confirmPassword: this.pwdData.confirmPassword
        }
        await this.$http.updatePwd(data)
        this.loading = false
        this.$message.success('修改成功')
        this.closePwd(false)
        this.$store.commit('updateSession', false)
        this.$router.replace('/login')
        localStorage.removeItem('user')
      } catch (err) {
        this.loading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true)
        }
      }
    }
    // getCurrentPath() {
    //   if (this.$route.path.indexOf('/main/scrm') != -1) {
    //     this.isQYWX = true
    //   } else {
    //     this.isQYWX = false
    //   }
    // }
  }
  // watch: {
  //   $route() {
  //     console.log(this.$route.path.indexOf('/main/scrm'))
  //     if (this.$route.path.indexOf('/main/scrm') != -1) {
  //       this.isQYWX = true
  //     } else {
  //       this.isQYWX = false
  //     }
  //   }
  // },
}
</script>

<style lang="scss" scoped>
.el-container {
  .el-header {
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: space-between;
    box-shadow: 1px 2px 3px rgba(218, 218, 218, 0.88);
    // background-color: #305791;
    // background-color: #1D3963;
    background-color: #ffffff;
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      &-img {
        height: 45px;
      }
    }
    .user {
      margin: 20px 0;
      color: #606266;
      font-size: 14px;
      .appName {
        display: inline-block;
        margin-right: 5px;
        padding-right: 5px;
        border-right: 2px solid #606266;
      }
    }
    .el-dropdown {
      span {
        // color: #ffffff;
        cursor: pointer;
      }
    }
  }
  .el-main {
    background: #f5f5f5;
  }
}
.logo-content {
  display: flex;
  align-items: center;
  .app-name {
    font-size: 16px;
    color: #215ba1;
    font-weight: bold;
  }
}

.app-name-block {
  position: absolute;
  top: 0;
  right: 125px;
  height: 56px;
  line-height: 56px;
  color: #606266;
  font-size: 14px;
  .line {
    padding: 0 15px;
  }
}
</style>
