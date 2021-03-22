<template>
  <div class="service-order-detail">
    <div class="plate flows">
      <QcTextPlate title="售后信息">
        <QcTextPlateItem label="售后单号：">{{ model.orderNumber }}</QcTextPlateItem>
        <QcTextPlateItem label="售后类型：">{{ model.serviceType | serviceTypeName }}</QcTextPlateItem>
        <QcTextPlateItem label="售后原因：">{{ model.reasonType }}</QcTextPlateItem>
      </QcTextPlate>
      <el-timeline class="flows__timeline">
        <el-timeline-item
          size="large"
          v-for="(item, index) in model.afterSalesFlowList"
          :key="index"
          :color="index === 0 ? '#ff6c4a' : ''"
        >
          <el-form>
            <!-- 标题和时间 s -->
            <el-row>
              <el-col :span="16" :style="`margin-bottom: 10px;fontSize:${index === 0 ? '18px' : '16px'}`">{{
                item.title
              }}</el-col>
              <el-col :span="8">{{ item.createTime }}</el-col>
            </el-row>
            <!-- 标题和时间 e -->
            <!-- 当状态是换货并且买家已经退货时 s -->
            <div v-if="item.status == 'buyer_upload_express_bill'">
              <el-form-item style="margin-bottom:0px;color:#a9a9a9"
                >快递单号：{{ model.tosellerCourierNumber }}</el-form-item
              >
              <el-form-item style="margin-bottom:0px;color:#a9a9a9"
                >快递公司：{{ model.tosellerExpressCompany }}</el-form-item
              >
            </div>
            <!-- 当状态是换货并且买家已经退货时 e -->
            <el-form-item
              style="margin-bottom: 0px;color:#a9a9a9"
              v-if="item.status === 'seller_confirm_and_refund' || item.status === 'buyer_apply_refund'"
              >退款金额：{{ model.needRefundAmount | formatPrice }}</el-form-item
            >
            <el-form-item
              style="margin-bottom: 0px;color:#a9a9a9"
              v-if="item.content && item.status != 'buyer_upload_express_bill'"
              >{{ item.content }}</el-form-item
            >
            <el-form-item style="margin-bottom: 0px;" v-if="item.imgUrl">
              <el-image
                v-for="img in item.imgUrl.split(',')"
                :key="img"
                :src="imgHost + img"
                style="width:100px;height:100px;"
                @click.native="onPreview(img)"
              ></el-image>
            </el-form-item>
            <el-form-item style="margin-bottom: 0px;" label="凭证图片：" v-if="item.voucherImage">
              <el-image
                v-for="img in item.voucherImage.split(',')"
                :key="img"
                :src="imgHost + img"
                style="width:100px;height:100px;"
                @click.native="onPreview(img)"
              ></el-image>
            </el-form-item>
            <el-form-item style="margin-bottom: 0px;" v-if="isStoreRole && model.status > 0 && index == 0">
              <div v-if="model.serviceType == 1">
                <el-button
                  v-if="index === 0 && item.status === 'buyer_apply_return_goods'"
                  size="mini"
                  type="primary"
                  @click="orderAfterSalesReturnGoodsAgree()"
                  >同意退货</el-button
                >
                <el-button
                  v-if="index === 0 && item.status === 'buyer_apply_return_goods'"
                  size="mini"
                  @click="orderAfterSalesReturnGoodsRefuse()"
                  >拒绝退货</el-button
                >
                <el-button v-if="index === 0 && item.status === 'seller_agree_return_goods'" size="mini" type="text"
                  >等待买家发货</el-button
                >
                <el-button
                  v-if="index === 0 && item.status === 'buyer_upload_express_bill'"
                  size="mini"
                  type="primary"
                  @click="orderAfterSalesReturnGoodsConfirmReceive()"
                  >确认收货</el-button
                >
                <el-button
                  v-if="index === 0 && item.status === 'buyer_upload_express_bill'"
                  size="mini"
                  @click="orderAfterSalesReturnGoodsCancel()"
                  >取消退货</el-button
                >
                <el-button
                  v-if="index === 0 && item.status === 'seller_confirm_and_refund'"
                  size="mini"
                  type="primary"
                  @click="orderAfterSalesReturnGoodsRefund()"
                  >退款</el-button
                >
                <el-button
                  v-if="index === 0 && item.status === 'seller_confirm_and_refund'"
                  size="mini"
                  @click="orderAfterSalesReturnGoodsCancel()"
                  >取消退货</el-button
                >
              </div>
              <div v-if="model.serviceType == 2">
                <el-button
                  v-if="index === 0 && item.status === 'buyer_apply_exchange_goods'"
                  size="mini"
                  type="primary"
                  @click="orderAfterSaleseExhangeGoodsAgree()"
                  >同意换货</el-button
                >
                <el-button
                  v-if="index === 0 && item.status === 'buyer_apply_exchange_goods'"
                  size="mini"
                  @click="orderAfterSalesExchangeGoodsRefuse()"
                  >拒绝换货</el-button
                >
                <el-button v-if="index === 0 && item.status === 'seller_agree_return_goods'" size="mini" type="text"
                  >等待买家发货</el-button
                >
                <el-button
                  v-if="index === 0 && item.status === 'buyer_upload_express_bill'"
                  size="mini"
                  type="primary"
                  @click="orderAfterSalesExchangeGoodsConfirmReceive()"
                  >确认收货</el-button
                >
                <el-button
                  v-if="index === 0 && item.status === 'buyer_upload_express_bill'"
                  size="mini"
                  @click="orderAfterSalesExchangeGoodsConfirmCancel()"
                  >取消换货</el-button
                >
                <el-button
                  v-if="index === 0 && item.status === 'seller_confirm_receive_goods'"
                  size="mini"
                  type="primary"
                  @click="expressModelVisible = true"
                  >重新发货</el-button
                >
                <el-button
                  v-if="index === 0 && item.status === 'seller_confirm_receive_goods'"
                  size="mini"
                  @click="orderAfterSalesExchangeGoodsConfirmCancel()"
                  >取消换货</el-button
                >
              </div>
              <div v-if="model.serviceType == 3">
                <el-button
                  v-if="index === 0 && item.status === 'buyer_apply_refund'"
                  size="mini"
                  type="primary"
                  @click="orderAftersalesRefundAgree()"
                  >同意并退款</el-button
                >
                <el-button
                  v-if="index === 0 && item.status === 'buyer_apply_refund'"
                  size="mini"
                  @click="orderAftersalesRefundRefuse()"
                  >拒绝退款</el-button
                >
              </div>
              <el-button
                v-if="index === 0 && (item.status === 'seller_agree_refund' || item.status === 'refund_fail')"
                size="mini"
                @click="orderAftersalesRefundRetry()"
                >重新退款</el-button
              >
            </el-form-item>
          </el-form>
        </el-timeline-item>
      </el-timeline>
    </div>

    <div class="plate product-order-detail__info">
      <div class="info-plate">
        <QcTextPlate title="订单信息">
          <QcTextPlateItem label="订单编号：">{{ model.order.orderNo }}</QcTextPlateItem>
          <QcTextPlateItem label="订单类型：">{{ model.order.bizTypeName }}</QcTextPlateItem>
          <QcTextPlateItem label="下单时间：">{{ model.order.createTime }}</QcTextPlateItem>
        </QcTextPlate>
      </div>
      <div class="info-plate">
        <QcTextPlate title="收货人信息">
          <QcTextPlateItem label="收货人：">{{ model.order.receiver }}</QcTextPlateItem>
          <QcTextPlateItem label="地址：">{{ model.order.address }}</QcTextPlateItem>
          <QcTextPlateItem label="手机号码：">{{ model.order.mobile }}</QcTextPlateItem>
        </QcTextPlate>
      </div>
      <div class="info-plate">
        <QcTextPlate title="支付信息">
          <QcTextPlateItem label="支付方式：">{{ model.order.payWayName }}</QcTextPlateItem>
          <QcTextPlateItem label="支付时间：">{{ model.order.payTime }}</QcTextPlateItem>
        </QcTextPlate>
      </div>
    </div>
    <el-table :data="model.afterSalesItemList" :span-method="objectSpanMethod">
      <el-table-column label="商品">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-image
              :src="`${imgHost}${scope.row.orderItem.iconUrl}`"
              fit="cover"
              style="flex:70px 0;height:70px;"
            ></el-image>
            <div style="margin-left:10px;flex:1">
              <p class="title">{{ scope.row.orderItem.name }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center" width="100px">
        <template slot-scope="scope">￥{{ scope.row.orderItem.nowPrice / 100 }}</template>
      </el-table-column>
      <el-table-column prop="qty" label="数量" align="center" width="100px"></el-table-column>
      <el-table-column label="订单状态" align="center" width="200px">
        <template>
          <div>{{ model.statusName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" align="center" width="150px">
        <template>￥{{ model.needRefundAmount | formatPrice }}</template>
      </el-table-column>
    </el-table>
    <el-dialog title="重新发货" :visible="expressModelVisible" :show-close="false" append-to-body width="520px">
      <el-form label-width="85px" label-position="left">
        <el-form-item style="margin:0" label="收货人：">{{ model.receiver }}</el-form-item>
        <el-form-item style="margin:0" label="收货手机：">{{ model.mobile }}</el-form-item>
        <el-form-item label="收货地址：">{{ model.address }}</el-form-item>
        <el-form-item label="快递信息：">
          <el-input placeholder="请输入物流单号" v-model="expressModel.expressNumber">
            <el-select slot="prepend" style="width:130px" placeholder="选择快递" v-model="expressModel.expressCompany">
              <el-option
                :value="item.value"
                :label="item.value"
                v-for="item in logisticsData"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="expressClose()">取消</el-button>
          <el-button type="primary" @click="orderAfterSalesExchangeGoodsDelivery()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 重新发货
      expressModelVisible: false,
      expressModel: {
        expressCompany: '',
        expressNumber: ''
      },
      // 快递列表
      logisticsData: [],
      model: {
        order: {}
      }
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
    }
  },
  created() {
    this.getServiceOrder()
    this.getLogisticsCompanyList()
    this.getIsStoreRole()
  },
  methods: {
    getIsStoreRole() {
      let user = JSON.parse(localStorage.getItem('user'))
      if (user && user.storeId) {
        this.isStoreRole = true
      } else {
        this.isStoreRole = false
      }
    },
    getLogisticsCompanyList() {
      this.$http.getLogisticsCompanyList({ parentId: 'SHOPPING_LOGISTICS_COMPANY' }).then((res) => {
        this.logisticsData = res.data.data
      })
    },
    getServiceOrder() {
      this.$http.getServiceOrder({ id: this.$route.query.id }).then((res) => {
        console.log(res.data.data)
        this.model = res.data.data
      })
    },
    //#region 换货
    orderAfterSaleseExhangeGoodsAgree() {
      this.$prompt('', '是否同意买家的换货申请？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请填写收货信息，退货须知等内容'
      })
        .then(({ value }) => {
          this.$http.orderAfterSaleseExhangeGoodsAgree({ afterSaleOrderId: this.model.id, remark: value }).then(() => {
            this.$message.success('操作成功')
            this.getServiceOrder()
          })
        })
        .catch(() => {})
    },
    orderAfterSalesExchangeGoodsRefuse() {
      this.$prompt('', '是否拒绝买家的换货申请？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '拒绝原因'
      })
        .then(({ value }) => {
          this.$http
            .orderAfterSalesExchangeGoodsRefuse({ afterSaleOrderId: this.model.id, refuseReason: value })
            .then(() => {
              this.$message.success('操作成功')
              this.getServiceOrder()
            })
        })
        .catch(() => {})
    },
    orderAfterSalesExchangeGoodsConfirmReceive() {
      this.$confirm('请确保收到退货物品后再进行操作。', '是否收到买家退还的物品？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.orderAfterSalesExchangeGoodsConfirmReceive({ afterSaleOrderId: this.model.id }).then(() => {
            this.$message.success('操作成功')
            this.getServiceOrder()
          })
        })
        .catch(() => {})
    },
    orderAfterSalesExchangeGoodsConfirmCancel() {
      this.$prompt('', '是否取消买家的换货申请？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '取消原因'
      })
        .then(({ value }) => {
          this.$http
            .orderAfterSalesExchangeGoodsConfirmCancel({ afterSaleOrderId: this.model.id, cancelReason: value })
            .then(() => {
              this.$message.success('操作成功')
              this.getServiceOrder()
            })
        })
        .catch(() => {})
    },
    orderAfterSalesExchangeGoodsDelivery() {
      this.expressModel.afterSaleOrderId = this.model.id
      this.$http.orderAfterSalesExchangeGoodsDelivery(this.expressModel).then(() => {
        this.$message.success('操作成功')
        this.getServiceOrder()
        this.expressClose()
      })
    },
    expressClose() {
      this.expressModelVisible = false
      this.expressModel = {
        expressCompany: '',
        expressNumber: ''
      }
    },
    //#endregion

    //#region 退货
    orderAfterSalesReturnGoodsAgree() {
      this.$prompt('', '是否同意买家的退货申请？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请填写收货信息，退货须知等内容'
      })
        .then(({ value }) => {
          this.$http.orderAfterSalesReturnGoodsAgree({ afterSaleOrderId: this.model.id, remark: value }).then(() => {
            this.$message.success('操作成功')
            this.getServiceOrder()
          })
        })
        .catch(() => {})
    },
    orderAfterSalesReturnGoodsConfirmReceive() {
      this.$confirm('请确保收到退货物品后再进行操作。', '是否收到买家退还的物品？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.orderAfterSalesReturnGoodsConfirmReceive({ afterSaleOrderId: this.model.id }).then(() => {
            this.$message.success('操作成功')
            this.getServiceOrder()
          })
        })
        .catch(() => {})
    },
    orderAfterSalesReturnGoodsRefund() {
      this.$confirm(`退款金额：${this.model.needRefundAmount / 100}`, '是否同意买家的退款申请？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.orderAfterSalesReturnGoodsRefund({ afterSaleOrderId: this.model.id }).then(() => {
            this.$message.success('操作成功')
            this.getServiceOrder()
          })
        })
        .catch(() => {})
    },
    orderAfterSalesReturnGoodsRefuse() {
      this.$prompt('', '是否拒绝买家的退货申请？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '拒绝原因'
      })
        .then(({ value }) => {
          this.$http
            .orderAfterSalesReturnGoodsRefuse({ afterSaleOrderId: this.model.id, refuseReason: value })
            .then(() => {
              this.$message.success('操作成功')
              this.getServiceOrder()
            })
        })
        .catch(() => {})
    },
    orderAfterSalesReturnGoodsCancel() {
      this.$prompt('', '是否取消买家的退货申请？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '取消原因'
      })
        .then(({ value }) => {
          this.$http
            .orderAfterSalesReturnGoodsCancel({ afterSaleOrderId: this.model.id, cancelReason: value })
            .then(() => {
              this.$message.success('操作成功')
              this.getServiceOrder()
            })
        })
        .catch(() => {})
    },
    //#endregion

    //#region 仅退款
    orderAftersalesRefundAgree() {
      this.$confirm(`退款金额：${this.model.needRefundAmount / 100}`, '是否同意买家的退款申请？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.orderAftersalesRefundAgree({ afterSaleOrderId: this.model.id }).then(() => {
            this.$message.success('操作成功')
            this.getServiceOrder()
          })
        })
        .catch(() => {})
    },
    orderAftersalesRefundRefuse() {
      this.$prompt('', '是否拒绝买家的仅退款申请？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '拒绝原因'
      })
        .then(({ value }) => {
          this.$http.orderAftersalesRefundRefuse({ afterSaleOrderId: this.model.id, refuseReason: value }).then(() => {
            this.$message.success('操作成功')
            this.getServiceOrder()
          })
        })
        .catch(() => {})
    },
    orderAftersalesRefundRetry() {
      this.$confirm('确认退款后，退款金额将会退还买家账户', '是否进行重新退款操作？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.orderAftersalesRefundRetry({ afterSaleOrderId: this.model.id }).then(() => {
            this.$message.success('操作成功')
            this.getServiceOrder()
          })
        })
        .catch(() => {})
    },
    //#endregion

    objectSpanMethod({ columnIndex }) {
      if (columnIndex > 2) {
        return {
          rowspan: this.model.afterSalesItemList.length,
          colspan: 1
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.service-order-detail {
  width: 1100px;
  margin: 0 auto;
  .plate {
    padding: 30px 15px;
    background: #fff;
    display: flex;
    margin-bottom: 30px;
  }
  .flows {
    &__timeline {
      display: inline-block;
      width: 725px;
      height: 200px;
      overflow: auto;
      padding-top: 10px;
      padding-left: 55px;
      margin-left: 55px;
      box-sizing: border-box;
      border-left: 1px solid #eee;
    }
  }
  .product-order-detail__info {
    .info-plate {
      flex: 1;
      padding-right: 20px;
      &:not(:last-child) {
        margin-right: 20px;
        border-right: 1px solid #eee;
      }
    }
  }
}
</style>
