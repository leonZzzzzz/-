<template>
  <div class="product-order-detail">
    <div class="product-order-detail__status">
      <p class="status">{{ model.status }}</p>
      <div>
        <el-button
          size="small"
          @click="orderCompensationVisible = true"
          v-if="isStoreRole && compensationStatus.showCompensationApply"
          >申请赔付</el-button
        >
        <el-button
          v-if="isStoreRole && compensationStatus.compensationIsOngoing"
          size="small"
          @click="orderCompensationHistoryVisible = true"
          >赔付中...</el-button
        >
        <el-button
          v-if="compensationStatus.showCompensationHistory"
          size="small"
          @click="orderCompensationHistoryVisible = true"
          >赔付详情</el-button
        >
        <el-button
          size="small"
          type="primary"
          v-if="isStoreRole && (model.statusValue == 1 || model.statusValue == 7)"
          @click="orderDeliveryVisible = true"
          >商品发货</el-button
        >
      </div>
    </div>

    <div class="product-order-detail__info">
      <div class="info-plate">
        <QcTextPlate title="订单信息">
          <QcTextPlateItem label="订单编号：">{{ model.number }}</QcTextPlateItem>
          <QcTextPlateItem label="订单类型：">{{ model.type }}</QcTextPlateItem>
          <QcTextPlateItem label="订单来源：">{{ model.source }}</QcTextPlateItem>
          <QcTextPlateItem label="下单时间：">{{ model.createTime }}</QcTextPlateItem>
          <QcTextPlateItem label="完成时间：">{{ model.finishTime || '--' }}</QcTextPlateItem>
          <QcTextPlateItem label="购买用户："
            >{{ model.buyer }}&nbsp;&nbsp;&nbsp;{{ model.buyerMobile }}</QcTextPlateItem
          >
        </QcTextPlate>
      </div>
      <div class="info-plate">
        <QcTextPlate title="收货人信息">
          <QcTextPlateItem label="收货人：">{{ model.receiver }}</QcTextPlateItem>
          <QcTextPlateItem label="地址：">{{ model.receiverAddress }}</QcTextPlateItem>
          <QcTextPlateItem label="手机号码：">{{ model.receiverMobile }}</QcTextPlateItem>
          <QcTextPlateItem label="买家留言：">{{ model.remark || '--' }}</QcTextPlateItem>
          <el-button
            type="primary"
            plain
            size="mini"
            @click="orderTakeDeliveryVisible = true"
            v-if="model.status == '待发货' && isStoreRole"
            >修改收货信息</el-button
          >
        </QcTextPlate>
      </div>
      <div class="info-plate">
        <QcTextPlate title="支付信息">
          <QcTextPlateItem label="支付方式：">{{ model.payWay }}</QcTextPlateItem>
          <QcTextPlateItem label="支付时间：">{{ model.payTime }}</QcTextPlateItem>
        </QcTextPlate>
      </div>
    </div>
    <OrderDeliveryList :order-id="model.id" :is-store-role="isStoreRole" />
    <div class="product-order-detail__product">
      <el-table :data="model.itemList" size="small">
        <el-table-column label="商品" width="450px">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="4">
                <el-image :src="imgHost + scope.row.icon" style="width:50px;height:50px"></el-image>
              </el-col>
              <el-col :span="20">
                <div>
                  <p>{{ scope.row.name }}</p>
                  <p style="color:#878787">{{ scope.row.spec }}</p>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="单价" align="center">
          <template slot-scope="scope">
            <div>￥{{ scope.row.price | formatPrice }}</div>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center">
          <template slot-scope="scope">x{{ scope.row.quantity }}</template>
        </el-table-column>
        <el-table-column label="发货状态" align="center">
          <template slot-scope="scope">{{ scope.row.expressed ? '已发货' : '待发货' }}</template>
        </el-table-column>
        <el-table-column label="售后记录" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.afterSaleItemList">{{ scope.row.afterSaleItemList.length }}条</div>
            <div v-else>无</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="isStoreRole"
              :disabled="scope.row.expressQuantity <= 0"
              @click="onShowOrderRefundDialog(scope.$index)"
              size="mini"
              type="primary"
              >退款</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="total-plate">
        <QcTextPlate>
          <QcTextPlateItem label="订单总额：">￥{{ model.totalAmount | formatPrice }}</QcTextPlateItem>
          <QcTextPlateItem label="店铺优惠：" v-if="model.storeCouponPayAmount"
            ><span class="total-plate-span">-￥{{ model.storeCouponPayAmount | formatPrice }}</span></QcTextPlateItem
          >
          <QcTextPlateItem label="快 递 费：" v-if="model.transportAmount"
            >￥{{ model.transportAmount | formatPrice }}</QcTextPlateItem
          >
          <QcTextPlateItem label="支付金额：">￥{{ model.payAmount | formatPrice }}</QcTextPlateItem>
        </QcTextPlate>
        <el-button size="small" @click="exportOrder()">导出订单</el-button>
      </div>
    </div>
    <OrderRefundDialog
      :visible="orderRefundVisible"
      :order-id="model.id"
      :product="refundProduct"
      @onClose="onCloseOrderRefundDialog"
    />
    <OrderDeliveryDialog
      :visible="orderDeliveryVisible"
      :products="products"
      :address="address"
      @onClose="onCloseOrderDeliveryDialog"
    />
    <!-- 修改收货人信息 -->
    <OrderTakeDeliveryDialog
      :visible="orderTakeDeliveryVisible"
      :order-id="model.id"
      :address="address"
      @onClose="onCloseOrderTakeDeliveryDialog"
    />
    <OrderCompensationDialog
      :order-id="model.id"
      :visible="orderCompensationVisible"
      @close="onCloseOrderCompensationDialog"
    />
    <OrderCompenstaionHistoryDialog
      :order-id="model.id"
      :visible="orderCompensationHistoryVisible"
      @close="orderCompensationHistoryVisible = false"
    />
  </div>
</template>

<script>
import OrderRefundDialog from './OrderRefundDialog'
import OrderDeliveryDialog from './OrderDeliveryDialog'
// 修改收货信息弹框
import OrderTakeDeliveryDialog from './OrderTakeDeliveryDialog'
import OrderCompensationDialog from './OrderCompensationDialog'
import OrderCompenstaionHistoryDialog from './OrderCompenstaionHistoryDialog'
import OrderDeliveryList from './OrderDeliveryList'
export default {
  components: {
    OrderRefundDialog,
    OrderDeliveryDialog,
    OrderTakeDeliveryDialog,
    OrderCompensationDialog,
    OrderCompenstaionHistoryDialog,
    OrderDeliveryList
  },
  data() {
    return {
      // isStoreRole: false,
      model: {},
      orderRefundVisible: false,
      refundProduct: {},
      orderDeliveryVisible: false,
      orderTakeDeliveryVisible: false,
      orderCompensationVisible: false,
      compensationStatus: {},
      orderCompensationHistoryVisible: false
    }
  },
  computed: {
    isStoreRole() {
      // 计算属性不能在v-if上用？？？
      if (
        this.$store.state.isStoreRole === null ||
        this.$store.state.isStoreRole === undefined ||
        this.$store.state.isStoreRole === 'undefined'
      ) {
        // 判断当前登录账号是否是店铺角色
        let user = JSON.parse(localStorage.getItem('user'))
        if (user && user.storeId) {
          this.$store.commit('setIsStorerole', true)
        } else {
          this.$store.commit('setIsStorerole', false)
        }
      }
      return this.$store.state.isStoreRole
    },
    products() {
      if (!this.model.itemList) return
      let product = JSON.parse(JSON.stringify(this.model.itemList))
      return product.filter((res) => {
        return !res.expressed && res.expressQuantity > 0
      })
    },
    address() {
      return {
        receiver: this.model.receiver,
        mobile: this.model.receiverMobile,
        address: this.model.receiverAddress,
        province: this.model.province,
        city: this.model.city,
        area: this.model.area
      }
    }
  },
  created() {
    this.getOrder()
  },
  methods: {
    getOrder() {
      this.$http.getOrder({ id: this.$route.query.id }).then((res) => {
        this.model = res.data.data
        this.statusOrderCompensation(this.model.id)
      })
    },
    //#region 退款
    onShowOrderRefundDialog(index) {
      this.refundProduct = this.model.itemList[index]
      this.orderRefundVisible = true
    },
    onCloseOrderRefundDialog(update) {
      if (update) {
        this.getOrder()
      }
      this.orderRefundVisible = false
    },
    //#endregion

    //#region 赔付
    statusOrderCompensation(orderId) {
      this.$http.statusOrderCompensation({ orderId }).then((res) => {
        this.compensationStatus = res.data.data
      })
    },
    onCloseOrderCompensationDialog(update) {
      if (update) {
        this.getOrder()
      }
      this.orderCompensationVisible = false
    },
    //#endregion
    onCloseOrderDeliveryDialog(update) {
      if (update) {
        this.getOrder()
      }
      this.orderDeliveryVisible = false
    },
    // 修改收货
    //#endregion
    onCloseOrderTakeDeliveryDialog(update) {
      if (update) {
        this.getOrder()
      }
      this.orderTakeDeliveryVisible = false
    },
    exportOrder() {
      window.open(this.baseUrl + '/api/admin/mall/v1/order/exportDetail?id=' + this.$route.query.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.product-order-detail {
  width: 1100px;
  margin: 0 auto;
  &__status {
    margin-bottom: 30px;
    padding: 35px;
    background: #fef5e5;
    border: 1px solid #ffd68a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .status {
      font-size: 26px;
      color: #ca2108;
    }
  }
  &__info {
    padding: 30px 15px;
    background: #fff;
    display: flex;
    margin-bottom: 30px;
    .info-plate {
      flex: 1;
      padding-right: 20px;
      &:not(:last-child) {
        margin-right: 20px;
        border-right: 1px solid #eee;
      }
    }
  }
  &__product {
    background: #fff;
    overflow: hidden;
    padding-bottom: 40px;
    .total-plate {
      width: 250px;
      float: right;
      padding: 30px 40px 0 0;
      .total-plate-span {
        white-space: nowrap;
      }
    }
  }
}
</style>
