<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div class="context-box" ref="context">
      <el-button class="back" type="primary" size="small" @click="back">返回</el-button>
      <div v-show="activeIndex === 1">
        <!-- 步骤条 -->
        <div class="steps">
          <p :class="{ 'active-step': step === 1 }">确认订单信息</p>
          <span></span>
          <p :class="{ 'active-step': step === 2 }">确认支付</p>
          <span></span>
          <p :class="{ 'active-step': step === 3 }">完成订购</p>
        </div>
        <!-- 第一步 -->
        <div class="section step_1" v-if="step === 1">
          <!-- 订单信息 -->
          <div class="order">
            <p class="section-title">确认订单信息</p>
            <div class="left">
              <p class="title">高级版</p>
              <p class="tips">对接自主公众号</p>
              <p class="price">
                <span>原￥3980/年</span>
                <span>￥1980/年</span>
              </p>
              <i class="gou iconfont icon-xuanzhong"></i>
            </div>
            <div class="right">
              <div>
                <p>购买内容</p>
                <p>高级版</p>
              </div>
              <div>
                <p>购买时长</p>
                <p>1年</p>
              </div>
              <div>
                <p>费用（元）</p>
                <p>1980</p>
              </div>
            </div>
          </div>
          <!-- 支付方式 -->
          <div class="pay-way">
            <p class="section-title">选择支付方式</p>
            <div class="pay-content">
              <div class="pay-item" :class="{ activePay: payWay === 1 }" @click="chosePay(1)">
                <i class="icon iconfont icon-weixindenglu-hui" style="color: #00c204;"></i>
                <p>使用微信扫码付款</p>
                <i v-if="payWay === 1" class="gou iconfont icon-xuanzhong"></i>
              </div>
              <!-- <div class="pay-item" :class="{ 'activePay': payWay === 2 }" @click="chosePay(2)">
                        <i class="icon iconfont icon-zhifubao" style="color: #00aef5;"></i>
                        <p>使用支付宝扫码付款</p>
                        <i v-if="payWay === 2" class="gou iconfont icon-xuanzhong"></i>
              </div>-->
            </div>
          </div>
          <!-- 立即支付 -->
          <div class="pay">
            <el-button class="pay-btn" type="primary" :disabled="!isAgree || !payWay" @click="pay">立即支付</el-button>
            <div class="agree">
              <el-checkbox style="color: #999 !important;" v-model="isAgree" @change="agree"
                >我已阅读并同意</el-checkbox
              >
              <span class="theme-color" @click="toQcService('/qcService')">&lt;&lt;企成科技服务协议&gt;&gt;</span>
            </div>
          </div>
        </div>
        <!-- 第二步 -->
        <div class="section step_2" v-if="step === 2">
          <div class="header">
            <p class="title">微信扫码支付</p>
            <p class="price">￥3950.00</p>
          </div>
          <hr />
          <div class="main">
            <img class="qr-img" src="@/assets/img/qrImg.jpg" alt="" />
            <div class="right">
              <p>请使用微信扫码支付，支付成功后自动开通服务</p>
              <el-button class="pay-btn" type="primary">我已完成支付</el-button>
              <p class="theme-color" @click="step = 1">&lt;选择其他支付方式</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 1,
      digShow: false,
      isSend: false,
      second: 6,
      step: 1,
      payWay: 1,
      model: {},
      isAgree: false,
      disabled: false,
      dataLoading: false,
      loading: false
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    toQcService() {
      let routeData = this.$router.resolve({ path: '/qcService' })
      window.open(routeData.href, '_blank')
    },
    close() {
      this.digShow = false
      this.$refs.mobile.resetFields()
    },

    chosePay(way) {
      this.payWay = way
    },

    agree(val) {
      this.isAgree = val
    },

    pay() {
      this.step = 2
    }
  }
}
</script>

<style lang="scss" scoped>
hr {
  border: 0;
  outline: 0;
  height: 1px;
  background-color: #ccc;
  border-color: #ccc;
}
ul {
  list-style: none;
}
.gou {
  position: absolute;
  top: -1px;
  right: -9px;
  font-size: 26px;
  color: #f66f2c;
}
.context-box {
  position: relative;
  width: 1200px;
  padding: 20px;
  margin: 0 auto;
  overflow: auto;
  .section-title {
    position: relative;
    margin-bottom: 20px;
    padding-left: 10px;
    line-height: 1;
    font-size: 18px;
    &:before {
      position: absolute;
      content: '';
      border-left: 3px solid #2161ad;
      left: 0;
      top: 0;
      bottom: 0;
    }
  }
  .steps {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
    text-align: center;
    span {
      display: inline-block;
      width: 150px;
      margin: 0 50px;
      border-top: 1px dashed #000;
    }
    p {
      font-size: 18px;
      color: #999;
    }
    .active-step {
      color: #000 !important;
    }
  }
  .pay-btn {
    padding: 18px 35px !important;
    font-size: 16px !important;
  }
  .step_1 {
    .order {
      margin: 50px auto 0;
      overflow: hidden;
      .left {
        position: relative;
        float: left;
        background-color: #2161ad;
        border-radius: 10px;
        text-align: center;
        color: #fff;
        width: 300px;
        height: 150px;
        .title {
          font-size: 22px;
          font-weight: bold;
          margin-top: 20px;
        }
        .tips {
          color: #f2f2f2;
          margin-top: 5px;
        }
        .price {
          margin-top: 20px;
          span:first-child {
            text-decoration: line-through;
            color: #f2f2f2;
          }
          span:last-child {
            font-size: 24px;
            // font-weight: bold;
          }
        }
      }
      .right {
        float: right;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f2f2f2;
        border-radius: 10px;
        width: 840px;
        height: 150px;
        &::after {
          content: ' ';
          width: 0;
          height: 0;
          clear: both;
        }
        & > div {
          //   flex: 1;
          width: 200px;
          text-align: center;
          & > p:first-child {
            color: #999;
          }
          & > p:last-child {
            font-size: 16px;
            margin-top: 30px;
          }
        }
      }
    }
    .pay-way {
      margin: 50px auto 0;
      .pay-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .pay-item {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 250px;
          height: 80px;
          border-radius: 10px;
          background-color: #fff;
          border: 1px solid #ccc;
          cursor: pointer;
          margin-right: 40px;
          .icon {
            font-size: 50px;
            margin-right: 10px;
          }
        }
        .activePay {
          position: relative;
          border-color: #f66f2c !important;
          overflow: hidden;
        }
      }
    }
    .pay {
      margin-top: 50px;
      text-align: right;
      .agree {
        margin-top: 10px;
      }
    }
  }

  .step_2 {
    width: 700px;
    margin: 0 auto;
    .header {
      margin: 100px auto;
      text-align: center;
      .title {
        font-size: 18px;
        font-weight: bold;
      }
      .price {
        margin-top: 30px;
        color: red;
        font-size: 24px;
      }
    }
    .main {
      display: flex;
      justify-content: center;
      margin: 50px auto 0;
      .qr-img {
        width: 180px;
        height: 180px;
        margin-right: 100px;
      }
      .right {
        p {
          margin-bottom: 20px;
          &:last-child {
            margin: 0;
            margin-top: 60px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
