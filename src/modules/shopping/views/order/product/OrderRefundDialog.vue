<template>
  <el-dialog title="申请退款" :visible="visible" :show-close="false" :append-to-body="true" width="480px">
    <section class="product-item">
      <el-image :src="imgHost + product.icon" style="width:70px;height:70px;margin:0 16px;"></el-image>
      <div class="info">
        <p class="product-name">{{ product.name }}</p>
        <p class="product-price">￥{{ price | formatPrice }}</p>
        <el-input-number v-model="qty" :min="1" :max="product.expressQuantity" size="mini"></el-input-number>
      </div>
    </section>
    <el-form :model="model" ref="model" label-position="righht" label-width="100px">
      <el-form-item label="退款理由：">
        <el-select v-model="model.reasonType">
          <el-option
            v-for="item in reasonTypeList"
            :key="item.value"
            :value="item.value"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退款原因：">
        <el-input v-model="model.reason"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onClose()">取消</el-button>
        <el-button type="primary" @click="addRrderRefund()" :loading="loading">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    orderId: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    product: {}
  },
  data() {
    return {
      loading: false,
      reasonTypeList: [],
      model: {},
      qty: 1
    }
  },
  computed: {
    price() {
      return this.product.price * this.qty
    }
  },
  watch: {
    visible(flag) {
      flag && this.orderRefundReasonType(this.orderId)
    }
  },
  methods: {
    orderRefundReasonType(orderId) {
      this.$http.orderRefundReasonType({ orderId }).then((res) => {
        this.reasonTypeList = res.data.data
      })
    },
    addRrderRefund() {
      let model = JSON.parse(JSON.stringify(this.model))
      this.loading = true
      model.orderId = this.orderId
      model.afterSalesItemList = [{ qty: this.qty, orderItemId: this.product.orderItemId }]
      this.$http
        .addRrderRefund(model)
        .then(() => {
          this.$message.success('操作成功')
          this.onClose(true)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onClose(flag = false) {
      this.model = {}
      this.qty = 1
      this.$emit('onClose', flag)
    }
  }
}
</script>

<style lang="scss" scoped>
.product-item {
  display: flex;
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  .info {
    width: 345px;
    .product-price {
      margin: 10px 0;
    }
  }
}
</style>
