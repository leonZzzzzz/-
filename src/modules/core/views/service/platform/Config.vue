<template>
  <div class="platform-config">
    <QcTitle title="平台信息">
      <div class="config-item">
        <div class="config-item__label">平台名称</div>
        <div class="config-item__container">
          <div class="config-item__container-info">{{ wechatConfig.wxName }}</div>
          <div class="config-item__container-menu">
            <el-button
              type="text"
              @click="wechatConfigVisible = true"
            >设置</el-button>
          </div>
        </div>
      </div>
      <div class="config-item">
        <div class="config-item__label">转发配置</div>
        <div class="config-item__container">
          <div class="config-item__container-info">
            <div
              v-for="item in shareList"
              :key="item.id"
              style="display: flex;"
            >
              <div style="flex: 1;display: flex;background: #f7f7f7;padding: 10px;border-radius: 5px;margin:0 15px 15px 0;">
                <img
                  :src="imgHost + item.image"
                  width="50"
                  height="50"
                />
                <div style="margin-left:10px;">
                  <p style="margin-bottom:20px;">{{ item.title }}</p>
                  <p>{{ item.description }}</p>
                </div>
              </div>
              <el-button
                type="text"
                @click="onShareShow(item)"
              >修改</el-button>
            </div>
          </div>
          <div class="config-item__container-menu"></div>
        </div>
      </div>
      <div class="config-item">
        <div class="config-item__label">支付配置</div>
        <div class="config-item__container">
          <div class="config-item__container-info">
            <div style="display: flex;justify-content: space-between;margin-bottom:10px;align-items: center;width: 170px;">
              开启微信支付
              <el-switch
                @change="updateAppWechatConfig()"
                v-model="wechatConfig.isOpenWxPay"
              ></el-switch>
            </div>
            <div style="display: flex;justify-content: space-between;align-items: center;width: 170px;">
              开启微信支付协议
              <el-switch
                @change="updateAppWechatConfig()"
                v-model="wechatConfig.isOpenWxPayAgreement"
              ></el-switch>
            </div>
          </div>
          <div class="config-item__container-menu">
            <el-button
              type="text"
              @click="$router.push('/main/service/setting/pay')"
            >添加支付</el-button>
          </div>
        </div>
      </div>
    </QcTitle>
    <QcTitle title="应用管理">
      <div class="config-item">
        <div class="config-item__label">应用列表</div>
        <div class="config-item__container">
          <div class="config-item__container-info">
            <div
              v-for="item in appList"
              :key="item.id"
              class="app-items"
            >
              <img
                :src="item.logoUrl"
                width="50"
                height="50"
              />
              <div class="app-items__info">
                <div class="text">
                  <div class="name">{{ item.name }}</div>
                  <div class="type">{{ item.serviceType | serviceType }}</div>
                  <div class="status">{{ item.verifyType == -1 ? '未认证' : '认证成功' }}</div>
                </div>
                <p class="customer">{{ item.customerName }}</p>
              </div>
            </div>
          </div>
          <div class="config-item__container-menu">
            <el-button
              type="text"
              @click="authorize()"
            >获取授权</el-button>
            <el-button
              type="text"
              v-if="showAuthStore === '1'"
              @click="authorizeStore()"
            >授权店铺小程序</el-button>
          </div>
        </div>
      </div>
    </QcTitle>
    <QcTitle title="引导关注">
      <div class="config-item">
        <div class="config-item__label">引导关注公众号</div>
        <div class="config-item__container">
          <div class="config-item__container-info">
            <div style="margin-bottom: 20px;display: flex;justify-content: space-between;align-items: center;width: 170px;">
              开启引导关注
              <el-switch
                @change="updateAppWechatConfig()"
                v-model="wechatConfig.isSubscribeGuidenceEnabled"
              ></el-switch>
            </div>
            <QcImageUpload
              v-model="wechatConfig.wechatSubscribeQrcode"
              width="100px"
              height="100px"
            ></QcImageUpload>
          </div>
          <div class="config-item__container-menu"></div>
        </div>
      </div>
    </QcTitle>
    <el-dialog
      title="修改平台信息"
      append-to-body
      :visible.sync="wechatConfigVisible"
      width="500px"
    >
      <el-form
        :model="wechatConfig"
        label-position="left"
        label-width="130px"
      >
        <el-form-item label="微信公众号名称">
          <el-input v-model="wechatConfig.wxName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          size="small"
          type="primary"
          @click="updateAppWechatConfig()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改转发信息"
      append-to-body
      :visible.sync="shareVisible"
      width="500px"
    >
      <el-form
        :model="shareModel"
        label-position="left"
        label-width="80px"
      >
        <el-form-item
          label="标题"
          prop="title"
        >
          <el-input v-model="shareModel.title"></el-input>
        </el-form-item>
        <el-form-item
          label="摘要"
          prop="description"
        >
          <el-input v-model="shareModel.description"></el-input>
        </el-form-item>
        <el-form-item
          label="链接"
          prop="url"
        >
          <el-input v-model="shareModel.url"></el-input>
        </el-form-item>
        <el-form-item label="分享图片">
          <QcImageUpload v-model="shareModel.image"></QcImageUpload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          size="small"
          type="primary"
          @click="updateShare()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wechatConfigVisible: false,
      wechatConfig: {},
      appList: [],
      shareList: [],
      shareVisible: false,
      shareModel: {}
    }
  },
  created() {
    this.getAppWechatConfig()
    this.pageWxApp()
    this.pageShare()
  },
  computed: {
    showAuthStore() {
      if ([null, undefined].includes(this.$store.state.showAuthStore)) {
        this.$http.getConfigByKey('AUTHORIZED_MULTI_STORE').then(res => {
          if (res.data.data) {
            this.$store.commit('showAuthStore', res.data.data.value)
          }
        })
      }
      return this.$store.state.showAuthStore
    }
  },
  watch: {
    'wechatConfig.wechatSubscribeQrcode'() {
      this.updateAppWechatConfig()
    }
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
    getAppWechatConfig() {
      this.$http.getAppWechatConfig().then(res => {
        this.wechatConfig = res.data.data
      })
    },
    updateAppWechatConfig() {
      this.$http.updateAppWechatConfig(this.wechatConfig).then(() => {
        this.wechatConfigVisible = false
        this.getAppWechatConfig()
      })
    },
    pageWxApp() {
      this.$http.pageWxApp().then(res => {
        this.appList = res.data.data.list
      })
    },
    pageShare() {
      this.$http.pageShare().then(res => {
        this.shareList = res.data.data.list
      })
    },
    updateShare() {
      this.$http.updateShare(this.shareModel).then(() => {
        this.shareVisible = false
        this.pageShare()
      })
    },
    onShareShow(item) {
      this.shareModel = JSON.parse(JSON.stringify(item))
      this.shareVisible = true
    },
    authorize() {
      window.open(`${this.baseUrl}/open/wx/login?appId=${this.wechatConfig.appId}`)
    },
    authorizeStore() {
      window.open(`${this.baseUrl}/open/wx/login?appId=${this.wechatConfig.appId}&purpose=mall-store`)
    }
  }
}
</script>

<style lang="scss" scoped>
.platform-config {
  width: calc(100% + 10px);
  height: 100%;
  background: #fff;
  font-size: 14px;
  overflow-x: auto;
  box-sizing: border-box;
  .config-item {
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    &__label {
      color: #888;
      width: 140px;
    }
    &__container {
      border-bottom: 1px solid #eee;
      flex: 1;
      padding: 20px 0 20px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .app-items {
        display: flex;
        background: #f7f7f7;
        padding: 10px;
        border-radius: 5px;
        color: #6d6d6d;
        &:first-child {
          margin-bottom: 20px;
        }
        &__info {
          margin-left: 10px;
          .text {
            margin-bottom: 20px;
            overflow: hidden;
            .name {
              float: left;
              width: 150px;
            }
            .type {
              float: left;
              width: 80px;
            }
            .status {
              float: left;
              width: 80px;
            }
          }
        }
      }
    }
  }
}
</style>
