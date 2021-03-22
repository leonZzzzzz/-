<template>
  <el-card class="recharge">
    <div class="alert">
      <p>
        短信套餐包仅可用于国内文本短信，不包括语音短信和海外短信；其中个人用户仅可用于短信验证码、短信通知等，不可用于营销短信；
      </p>
      <br />
      <p>
        请详细了解企成互动短信《服务协议》，如违反该协议企成互动将有权随时单方采取限制，中止或终止服务、封号等措施，并不予退订/退款；
      </p>
    </div>
    <br />
    <br />
    <el-form label-position="right" label-width="90px">
      <el-form-item label="套餐类型" style="margin-bottom: 40px;">
        <el-radio-group v-model="smsTypeId" @change="findByTypeSms">
          <el-radio-button :key="item.id" :label="item.id" v-for="item in smsTypeList">{{ item.name }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="套餐配额" style="margin-bottom: 40px;">
        <div
          class="option"
          :class="{ active: item.id == model.smsQuotaId }"
          v-for="(item, index) in smsQuotaList"
          :key="index"
          @click="onChangeOption(item.id)"
        >
          <p class="num">{{ item.count }}条</p>
        </div>
      </el-form-item>
      <el-form-item label="购买数量">
        <el-input-number v-model="model.num" :min="1"></el-input-number>
      </el-form-item>
      <div style="margin: 60px 0 40px;border-bottom: 1px solid #409EFF;"></div>
      <el-form-item label="总计费用">
        <p class="price">
          {{ price | formatPrice }}
          <span class="unit">元</span>
        </p>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-radio-group v-model="payWay">
          <el-radio label="WEIXIN_NATIVE">微信支付</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="createSmsOrder()">立刻购买</el-button>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked">我已阅读并同意企成互动短信《服务协议》</el-checkbox>
      </el-form-item>
    </el-form>
    <el-dialog
      title="扫码支付"
      append-to-body
      :visible="payVisible"
      :before-close="
        () => {
          payVisible = false
        }
      "
      width="300px"
    >
      <img :src="payUrl" width="255px" />
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      model: {
        smsQuotaId: '',
        num: 1
      },
      payWay: 'WEIXIN_NATIVE',
      smsTypeId: '',
      checked: true,
      smsTypeList: [],
      smsQuotaList: [],
      payVisible: false,
      payUrl: ''
    }
  },
  computed: {
    price() {
      let price = 0
      this.smsQuotaList.forEach((item) => {
        if (item.id === this.model.smsQuotaId) {
          price = item.amount * this.model.num
        }
      })
      return price
    }
  },
  created() {
    this.pageSmsType()
  },
  methods: {
    pageSmsType() {
      this.$http.listSmsCategory().then((res) => {
        this.smsTypeList = res.data.data
        this.smsTypeId = res.data.data[0].id
        this.findByTypeSms(this.smsTypeId)
      })
    },
    findByTypeSms(smsTypeId) {
      this.$http.findByTypeSms({ smsTypeId }).then((res) => {
        this.smsQuotaList = res.data.data
        this.model.smsQuotaId = res.data.data[0].id
      })
    },
    createSmsOrder() {
      this.$http.createSmsOrder(this.model).then((res) => {
        let { orderId, orderType } = res.data.data
        this.paySms({ orderId, orderType, frpCode: this.payWay })
      })
    },
    paySms(model) {
      this.$http.paySms(model).then((res) => {
        this.payUrl = res.data.data.payUrl
        this.payVisible = true
      })
    },
    onChangeOption(val) {
      this.model.smsQuotaId = val
    }
  }
}
</script>

<style lang="scss" scoped>
.recharge {
  .price {
    font-size: 30px;
    color: #409eff;
    .unit {
      font-size: 20px;
      margin-left: 5px;
    }
  }
  .alert {
    padding: 40px 20px;
    font-size: 14px;
    background: #fffae6;
    border: 1px solid #ffcc00;
  }
  .option {
    display: inline-block;
    margin-right: 20px;
    padding: 10px 20px;
    font-size: 14px;
    border: 1px solid #409eff;
    line-height: 1;
    border-radius: 3px;
    cursor: pointer;
    &.active {
      background: #409eff;
      color: #fff;
    }
    .num {
      font-size: 15px;
    }
  }
}
</style>
