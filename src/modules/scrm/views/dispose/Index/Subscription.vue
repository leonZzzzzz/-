<template>
  <!-- 公众号配置 -->
  <div class="config">
    <div class="c-guide">
      <div class="guide-step" v-if="currentStep === 1">
        <div class="title">第一步：授权公众号及小程序</div>
        <div class="step-content">
          <p>
            授权已经配置的公众号、小程序绑定授权，用于关联公众号、小程序、企业号的客户信息进行直接对应，用于记录客户查看信息的动态，用于动态雷达等
          </p>
          <div class="authorize-list">
            <div class="list-item" v-for="(item, index) in authorizeList" :key="index">
              <img class="item-logo" :src="item.logoUrl" />
              <div class="item-right">
                <div class="right-top">
                  <div class="l-item rt-name">{{ item.name }}</div>
                  <div class="l-item rt-service">{{ item.serviceType | serviceType }}</div>
                  <div class="l-item rt-verify">{{ item.verifyType == -1 ? '未认证' : '认证成功' }}</div>
                </div>
                <div class="right-bottom">
                  <div class="l-item rb-company">{{ item.customerName }}</div>
                  <div class="l-item rb-binding" v-if="item.wxOpenPlatformId && item.wxOpenPlatformId != ''">
                    已绑定：{{ item.wxOpenPlatformId }}
                  </div>
                  <div class="l-item rb-binding" v-else>未绑定开放平台</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 存在记录显示下一步，否则显示更新授权 -->
        <div class="step-btns">
          <el-button type="primary" v-if="authorizeList.length === 0" @click="authorizeHandle">更新授权</el-button>
          <el-button type="primary" v-else @click="checkAppOpenPlatform" :disabled="isLoading" :loading="isLoading"
            >下一步</el-button
          >
        </div>
      </div>
      <div class="guide-step" v-if="currentStep === 2">
        <div class="title">第二步：绑定开放平台</div>
        <div class="step-content">
          <p class="cont-title">{{ stepTips }}</p>
          <p>1.浏览器打开放平台连接 https://open.weixin.qq.com/登录贵司的开放平台账号</p>
          <p>2.进入“管理中心”--“公众号”页面，绑定授权公众号</p>
          <p>3.“管理中心”--“小程序”页面，绑定授权小程序</p>
        </div>
        <div class="step-btns">
          <el-button type="primary" :disabled="isLoading" :loading="isLoading" @click="checkAppOpenPlatform"
            >下一步</el-button
          >
        </div>
      </div>
      <div class="guide-step" v-if="currentStep === 3">
        <div class="title">最后一步：企业号绑定</div>
        <div class="step-content">
          <p class="cont-title">企业微信需要通过授权公众号绑定同一个开放平台完成配置</p>
          <p>1.浏览器打开放平台链接https://work.weixin.qq.com/wework_admin/frame#customer/analysis登录贵司的企业帐号</p>
          <p>
            2.进入“客户联系”--“客户”页面，展开api小菜单，点击微信开发者ID的“绑定”操作按钮，使用公众号管理员微信扫码绑定公众号
          </p>
          <el-image class="cont-img" :src="guideImg" :preview-src-list="[guideImg]"> </el-image>
        </div>
        <div class="step-btns">
          <el-button type="primary" @click="checkConfig" :disabled="isLoading" :loading="isLoading">配置完成</el-button>
        </div>
      </div>
    </div>
    <!-- 授权是否成功弹窗 -->
    <com-dialog :config="authorizeDialog.config" @closeDialog="authorizeDialog.config.visible = false">
      <div class="authorize-dialog">
        <div class="content">请在新开的页面完成授权</div>
        <div class="btn-group">
          <el-button type="primary" @click="authorizeConfirm">已完成授权</el-button>
        </div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComDialog from '../../../components/common/ComDialog'
export default {
  components: { ComDialog },
  data() {
    return {
      authorizeList: [], // 授权记录列表
      currentStep: 1, // 当前步骤
      authorizeDialog: {
        // 授权是否成功弹窗
        config: {
          width: '500px',
          title: '授权完成前请不要关闭此窗口',
          visible: false
        }
      },
      guideImg: this.imgHost + '/attachments/scrm/54b1259625ec41dbae3ea514112fdfda.png',
      isLoading: false,
      stepTips: '', // 接口返回给用户的提示
      wechatConfig: {} // 微信配置信息
    }
  },
  created() {
    this.getAuthorizeWxAppPage()
  },
  filters: {
    serviceType(value) {
      switch (value) {
        case 0:
          return '订阅号'
        case 1:
          return '历史老账号升级后的订阅号'
        case 2:
          return '服务号'
        case 3:
          return '小程序'
      }
    }
  },
  methods: {
    // 获取授权的公众号
    getAuthorizeWxAppPage() {
      this.$http.getAuthorizeWxAppPage().then((res) => {
        this.authorizeList = res.data.data.list
      })
    },
    // 检查授权的公众号是否绑定了同一个开放平台
    checkAppOpenPlatform() {
      this.isLoading = true
      this.$http.checkAppOpenPlatform().then((res) => {
        this.isLoading = false
        if (res.data.code == 20000) {
          this.currentStep = 3
        } else if (res.data.code == 91001 || res.data.code == 91004) {
          this.currentStep = 1
          this.$message.warning(res.data.message)
        } else if (res.data.code == 91002 || res.data.code == 91003) {
          this.currentStep = 2
          this.stepTips = res.data.message
          this.$message.warning(res.data.message)
        }
      })
    },
    // 公众号授权操作
    authorizeHandle() {
      // 获取微信配置信息
      this.$http.getAppWechatConfig().then((res) => {
        this.wechatConfig = res.data.data
        window.open(`${this.baseUrl}/open/wx/login?appId=${this.wechatConfig.appId}`)
        this.authorizeDialog.config.visible = true
      })
    },
    // 确认完成授权
    authorizeConfirm() {
      this.authorizeDialog.config.visible = false
      this.checkAppOpenPlatform()
    },
    // 调用客户同步接口，只调用第一个客户，如能取到unionid说明配置完成
    checkConfig() {
      this.isLoading = true
      this.$http.syncCustomerList().then(() => {
        this.isLoading = false
        let params = {
          pageNum: 1,
          pageSize: 1
        }
        this.$http.getCustomerPage(params).then((res) => {
          let list = res.data.data.list
          if (list.length > 0) {
            let obj = list[0]
            console.log('返回数据', obj)
            if (obj.unionid) {
              // 配置完成，返回第一步
              this.$message.success('配置完成')
              this.currentStep = 1
              this.getAuthorizeWxAppPage()
            } else {
              this.$message.warning('检测失败，未成功配置')
            }
          } else {
            this.$message.warning('检测失败，未成功配置')
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  padding: 20px 0;
  color: #606266;
  position: relative;
  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 20px;
    background-color: #294a7b;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    left: -20px;
  }
}
.c-guide {
  width: 800px;
}
.step-content {
  p {
    font-size: 14px;
    color: #606266;
    min-height: 36px;
    line-height: 36px;
    text-indent: 2em;
  }
  .cont-title {
    text-indent: 0;
  }
  .cont-img {
    margin-top: 20px;
    max-width: 800px;
  }
}
.step-btns {
  margin-top: 40px;
  text-align: center;
}
.authorize-list {
  .list-item {
    width: 600px;
    padding: 10px;
    border-radius: 5px;
    background: #f7f7f7;
    display: flex;
    line-height: 24px;
    margin-top: 20px;
    color: #606266;
    .l-item {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .item-logo {
      width: 80px;
      height: 80px;
      margin-right: 10px;
    }
    .item-right {
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      .right-top {
        display: flex;
        .rt-name {
          width: 250px;
          margin-right: 10px;
        }
        .rt-service {
          width: 120px;
          margin-right: 10px;
        }
        .rt-verify {
          width: 120px;
        }
      }
      .right-bottom {
        display: flex;
        .rb-company {
          width: 250px;
          margin-right: 10px;
        }
        .rb-binding {
          width: 240px;
          color: #000;
          text-align: right;
        }
      }
    }
  }
}
.authorize-dialog {
  .content {
    margin: 20px 0 40px 0;
  }
  .btn-group {
    text-align: center;
  }
}
</style>
