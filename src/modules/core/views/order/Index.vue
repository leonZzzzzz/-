<template>
  <div style="background:#fff">
    <div
      class="context-box"
      ref="context"
    >
      <div v-show="activeIndex === 1">
        <!-- 头部 -->
        <div class="header">
          <h2>高版本，简单操作，高效服务</h2>
          <p class="tips">选择合适的版本，更高效的服务你的用户</p>
        </div>
        <!-- 图标介绍 -->
        <ul class="ad-list">
          <li>
            <img
              src="./img/i_weixin.png"
              alt=""
            />
            <p class="title">无缝对接微信生态</p>
            <p class="tips">完美融入微信生态，提供安逸的报名体验</p>
          </li>
          <li>
            <img
              src="./img/i_jishu.png"
              alt=""
            />
            <p class="title">稳定的技术服务</p>
            <p class="tips">完美融入微信生态，提供安逸的报名体验</p>
          </li>
          <li>
            <img
              src="./img/i_pinpai.png"
              alt=""
            />
            <p class="title">知名品牌一致使用</p>
            <p class="tips">完美融入微信生态，提供安逸的报名体验</p>
          </li>
        </ul>
        <!-- 版本 -->
        <ul class="version-list">
          <li v-if="false">
            <div
              class="top"
              style="background-color: #6ca4e8;"
            >
              <p class="title">基础版</p>
              <p class="tips">无需公众号</p>
              <p class="price">
                <span>原￥3980/年</span>
                <span>￥1980/年</span>
              </p>
              <el-button
                class="btn"
                size="medium"
                @click="pay(1)"
              >购 买</el-button>
            </div>
            <div class="bottom">
              <p class="bottom-title">产品服务</p>
              <ul>
                <li
                  v-for="(item, i) in model.version_1.info"
                  :key="i"
                >{{ item }}</li>
              </ul>
            </div>
          </li>
          <li>
            <div
              class="top"
              style="background-color: #417fc8;"
            >
              <div class="banner">限时优惠</div>
              <p class="title">高级版</p>
              <p class="tips">对接自主公众号</p>
              <p class="price">
                <span>原￥5980/年</span>
                <span>￥3980/年</span>
              </p>
              <el-button
                class="btn"
                :class="{ buy: model.version_2.isBuy }"
                size="medium"
                :disabled="model.version_2.isBuy"
                @click="pay(2)"
              >购 买</el-button>
            </div>
            <div class="bottom">
              <p class="bottom-title">产品服务</p>
              <ul>
                <li
                  v-for="(item, i) in model.version_2.info"
                  :key="i"
                >{{ item }}</li>
              </ul>
            </div>
          </li>
          <li>
            <div
              class="top"
              style="background-color: #2161ad;"
            >
              <p class="title">企业版</p>
              <p class="tips">专属为您定制开发</p>
              <p class="price">
                <span>原￥11980/年</span>
                <span>￥9980/年</span>
              </p>
              <el-button
                class="btn"
                size="medium"
                @click="pay(3)"
              >购 买</el-button>
            </div>
            <div class="bottom">
              <p class="bottom-title">产品服务</p>
              <ul>
                <li
                  v-for="(item, i) in model.version_3.info"
                  :key="i"
                >{{ item }}</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 1,
      isSend: false,
      second: 6,
      model: {
        version_1: {
          info: [
            '活动首页',
            ' 活动报名',
            ' 活动收费',
            '报名审核',
            '活动留言',
            '简易版签到',
            '个人中心',
            '活动收费提现',
            '报名数据统计',
            '签到数据统计',
            '会员管理'
          ]
        },
        version_2: {
          isBuy: false,
          info: [
            '活动首页',
            ' 活动报名',
            ' 活动收费',
            '活动留言',
            '报名条件限定',
            '报名数据统计',
            '报名关注限制',
            '报名审核',
            '简易版签到',
            '个人中心',
            '自有微信支付',
            '活动收费提现',
            '签到数据统计',
            '会员管理',
            '关注公众号提醒',
            '自有公众号'
          ]
        },
        version_3: {
          info: [
            '活动首页',
            ' 活动报名',
            ' 活动收费',
            '活动留言',
            '报名条件限定',
            '报名数据统计',
            '报名关注限制',
            '报名审核',
            '简易版签到',
            '高级版签到',
            '活动分销',
            '分销管理',
            '个人中心',
            '自有微信支付',
            '活动收费提现',
            '签到数据统计',
            '会员管理',
            '关注公众号提醒',
            '自有公众号',
            '自有域名独立部署（不含服务器费用）',
            '定制开发（价格另议）'
          ]
        }
      },
      disabled: false,
      dataLoading: false,
      loading: false
    }
  },
  methods: {
    getAppVersion() {
      this.$http.getAppVersion().then(res => {
        console.log(res)
        this.model = res.data.data.list
      })
    },
    openTips() {
      this.$confirm(`需购买正式版本，请与我们联系！<br/>联系方式（微信或电话）：13632366781`, '提示', {
        confirmButtonText: '知道了',
        type: 'warning',
        showCancelButton: false,
        dangerouslyUseHTMLString: true,
        center: true
      })
        .then(() => {})
        .catch(() => {})
    },
    pay(type) {
      this.openTips()
      return
      // let url = `/main/myServices/myOrder/pay`
      // this.$router.push(url)
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
}
.context-box {
  .header {
    margin-top: 50px;
    text-align: center;
    overflow: hidden;
    .tips {
      color: #888;
      margin-top: 10px;
    }
  }
  .ad-list {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 50px auto;
    li {
      text-align: center;
      margin-right: 60px;
      &:last-child {
        margin-right: 0;
      }
      img {
        width: 50px;
        height: 50px;
      }
      .title {
        margin-top: 20px;
        font-size: 18px;
      }
      .tips {
        margin-top: 10px;
        font-size: 14px;
        color: #888;
      }
    }
  }
  .version-list {
    display: flex;
    justify-content: center;
    //   align-items: center;
    & > li {
      width: 390px;
      margin-right: 50px;

      &:last-child {
        margin-right: 0;
      }
      .top {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column;
        height: 220px;
        color: #fff;
        text-align: center;
        border-radius: 10px 10px 0 0;
        overflow: hidden;
        .banner {
          position: absolute;
          top: 10px;
          left: -33px;
          transform: rotate(-45deg);
          background: #5edf9b;
          line-height: 2.8em;
          font-size: 14px;
          padding: 0 35px;
        }
        .title {
          font-size: 22px;
          font-weight: bold;
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
        .btn {
          margin-top: 15px;
          padding: 16px 110px;
          font-size: 16px;
          color: #2161ad;
        }
        .buy {
          background: #265b9a !important;
          border-color: #265b9a !important;
          color: #6aa4e8 !important;
        }
      }
      .bottom {
        border-radius: 0 0 10px 10px;
        background: #fff;
        box-shadow: 1px 0px 10px 1px #eee;
        color: #000;
        min-height: 500px;
        text-align: center;
        overflow: hidden;
        .bottom-title {
          margin: 30px 0;
          font-size: 18px;
          color: #888;
        }
        li {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>
