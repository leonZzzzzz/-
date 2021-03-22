<template>
  <div class="product-order-detail__express" v-if="expressProductLists.length > 0">
    <ul class="express-wrap">
      <li
        class="express-list"
        v-for="(item, index) in expressProductLists"
        :key="item.id"
        :style="{ background: index === expressIndex ? '#eb4c28' : '#ffa2a2' }"
        @click="expressIndex = index"
      >
        包裹{{ index + 1 }}
      </li>
    </ul>
    <div class="data-plate">
      <QcTextPlate class="data-plate__list" width="80px">
        <QcTextPlateItem label="快递单号：">{{ expressProductLists[expressIndex].expressNumber }}</QcTextPlateItem>
        <QcTextPlateItem label="快递公司：">{{ expressProductLists[expressIndex].expressCompany }}</QcTextPlateItem>
        <QcTextPlateItem label="发货时间：">{{ expressProductLists[expressIndex].deliverTime }}</QcTextPlateItem>
        <QcTextPlateItem>
          <el-button size="mini" @click="onShowExpressUpdateDialog()" v-if="isStoreRole">修改物流</el-button>
        </QcTextPlateItem>
      </QcTextPlate>
      <el-table
        class="data-plate__table"
        :data="expressProductLists[expressIndex].items"
        :span-method="objectSpanMethod"
      >
        <el-table-column label="商品">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="单价" width="100px" align="center">
          <template slot-scope="scope">{{ scope.row.price | formatPrice }}</template>
        </el-table-column>
        <el-table-column label="数量" width="100px" align="center">
          <template slot-scope="scope">x{{ scope.row.quantity }}</template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="修改物流信息"
      :visible="productDeliveryUpdateDialog"
      width="480px"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="100px" label-position="left" ref="rule" :model="expressUpdateModel">
        <el-form-item label="快递公司：">
          <el-input v-model="expressUpdateModel.expressNumber" style="width:300px">
            <el-select slot="prepend" style="width:130px;" v-model="expressUpdateModel.expressCompany">
              <el-option
                :label="item.value"
                :value="item.value"
                v-for="item in expressLists"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="productDeliveryUpdateDialog = false">关闭</el-button>
          <el-button type="primary" @click="updateExpress()">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    orderId: {
      type: String,
      default: ''
    },
    isStoreRole: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    orderId(val) {
      if (val) {
        this.pageExpress(val)
        this.getLogisticsCompanyList()
      }
    }
  },
  data() {
    return {
      expressProductLists: [],
      expressIndex: 0,
      expressUpdateModel: {
        expressCompany: '',
        expressNumber: '',
        id: ''
      },
      productDeliveryUpdateDialog: false,
      expressLists: []
    }
  },
  methods: {
    getLogisticsCompanyList() {
      this.$http.getLogisticsCompanyList({ parentId: 'SHOPPING_LOGISTICS_COMPANY' }).then((res) => {
        this.expressLists = res.data.data
      })
    },
    pageExpress(orderId) {
      this.$http.pageExpress({ orderId }).then((res) => {
        this.expressProductLists = res.data.data
        this.$emit('onReady', this.expressProductLists.length > 0)
      })
    },
    updateExpress() {
      this.$http.updateExpress(this.expressUpdateModel).then(() => {
        this.$message.success('修改成功')
        this.pageExpress(this.orderId)
        this.productDeliveryUpdateDialog = false
      })
    },
    onShowExpressUpdateDialog() {
      let { expressCompany, expressNumber, id } = this.expressProductLists[this.expressIndex]
      this.expressUpdateModel = { expressCompany, expressNumber, id }
      this.productDeliveryUpdateDialog = true
    },
    objectSpanMethod({ columnIndex }) {
      if (columnIndex > 2) {
        if (this.model.itemList.length > 1) {
          return {
            rowspan: this.model.itemList.length,
            colspan: 1
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.product-order-detail__express {
  background: #fff;
  margin-bottom: 40px;
}
.express-wrap {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
  cursor: pointer;
  .express-list {
    padding: 12px 22px;
    margin-right: 1px;
    font-size: 14px;
    color: #fff;
    list-style: none;
  }
}
.data-plate {
  padding: 15px;
  display: flex;
  padding-right: 80px;
  &__list {
    flex: 345px 0;
    border-right: 1px solid #eee;
    margin-right: 60px;
  }
  &__table {
    flex: 1;
  }
}
</style>
