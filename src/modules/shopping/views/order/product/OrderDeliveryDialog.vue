<template>
  <el-dialog title="商品发货" width="600px" :visible="visible" :append-to-body="true" :show-close="false">
    <el-table
      :data="products"
      size="mini"
      @selection-change="selectRow"
      ref="multipleTable"
      style="margin-bottom:20px;"
    >
      <el-table-column type="selection" width="50px" align="center"></el-table-column>
      <el-table-column label="商品">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="数量" width="100px">
        <template slot-scope="scope">x{{ scope.row.expressQuantity }}</template>
      </el-table-column>
      <el-table-column align="center" label="单价" width="100px">
        <template slot-scope="scope">￥{{ scope.row.price | formatPrice }}</template>
      </el-table-column>
    </el-table>
    <el-form label-width="100px" label-position="right" ref="rule" :model="model">
      <el-form-item label="收货人：" style="margin-bottom:0px">{{ address.receiver }}</el-form-item>
      <el-form-item label="联系电话：" style="margin-bottom:0px">{{ address.mobile }}</el-form-item>
      <el-form-item label="收货地址：" style="margin-bottom:0px">{{ address.address }}</el-form-item>
      <el-form-item label="快递公司：">
        <el-input v-model="model.expressNumber" style="width:300px">
          <el-select slot="prepend" style="width:130px;" v-model="model.expressCompany">
            <el-option :label="item.value" :value="item.value" v-for="item in expressLists" :key="item.id"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onDeliveryClose()">取 消</el-button>
        <el-button type="primary" @click="addExpress()">确认发货</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    products: {
      type: Array
    },
    address: {
      type: Object
    }
  },
  data() {
    return {
      model: {
        expressCompany: '',
        expressNumber: '',
        items: []
      },
      expressLists: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getLogisticsCompanyList()
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    }
  },
  methods: {
    getLogisticsCompanyList() {
      this.$http.getLogisticsCompanyList({ parentId: 'SHOPPING_LOGISTICS_COMPANY' }).then((res) => {
        this.expressLists = res.data.data
      })
    },
    onDeliveryClose(flag = false) {
      this.$emit('onClose', flag)
      this.model = {
        expressCompany: '',
        expressNumber: '',
        items: []
      }
    },
    addExpress() {
      if (!this.model.items.length && this.$message.error('请选择发货商品')) return
      if (!this.model.expressCompany && this.$message.error('请选择物流公司')) return
      if (!this.model.expressNumber && this.$message.error('请填写物流单号')) return
      let model = Object.assign(this.address, this.model)
      this.$http.addExpress(model).then(() => {
        this.$message.success('发货成功')
        this.onDeliveryClose(true)
      })
    },
    selectRow(row) {
      this.model.items = []
      row.map((item) => {
        this.model.items.push({ orderItemId: item.orderItemId })
      })
    }
  }
}
</script>

<style></style>
