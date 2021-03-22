<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" @get-list="onGetList">
      <el-tabs v-model="searchForm[0].value" @tab-click="onSearch" type="card" style="margin:0 15px">
        <el-tab-pane :label="`全部（${statusTotal || 0}）`" name=" "></el-tab-pane>
        <el-tab-pane :label="`待审核（${count.waiting || 0}）`" name="waiting"></el-tab-pane>
        <el-tab-pane :label="`已取消（${count.canceled || 0}）`" name="canceled"></el-tab-pane>
        <el-tab-pane :label="`已完成（${count.finished || 0}）`" name="finished"></el-tab-pane>
      </el-tabs>
      <el-table :data="tableData">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="订单单号" prop="orderNumber" align="center"></el-table-column>
        <el-table-column label="赔付单号" prop="number" align="center"></el-table-column>
        <el-table-column label="会员昵称" prop="memberAppellation" align="center"></el-table-column>
        <el-table-column label="发起人" prop="creatorType" align="center"></el-table-column>
        <el-table-column label="订单金额" align="center">
          <template slot-scope="scope">{{ scope.row.orderAmount | formatPrice }}</template>
        </el-table-column>
        <el-table-column label="赔付金额" align="center">
          <template slot-scope="scope">{{ scope.row.applyAmount | formatPrice }}</template>
        </el-table-column>
        <el-table-column label="实际赔付金额" align="center">
          <template slot-scope="scope">{{ scope.row.refundAmount | formatPrice }}</template>
        </el-table-column>
        <el-table-column label="赔付类型" prop="reasonType" align="center"></el-table-column>
        <el-table-column label="赔付状态" prop="status" align="center"></el-table-column>
        <el-table-column label="操作" align="right">
          <template slot-scope="scope">
            <span v-if="scope.row.statusValue == 'waiting'">
              <el-button type="text" @click="onShowAgreeDialog(scope.$index)">同意</el-button>
              <el-button type="text" @click="cancelOrderCompensation(scope.row.id)">拒绝</el-button>
            </span>
            <el-button type="text" @click="getOrderCompensation(scope.row.id)" style="margin-left:10px;"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </QcTable>
    <el-dialog
      :visible="detail.visible"
      title="赔付详情"
      width="675px"
      :append-to-body="true"
      :before-close="
        () => {
          detail.visible = false
        }
      "
    >
      <CompensationHistoryItem :flow-list="detail.model"></CompensationHistoryItem>
    </el-dialog>
    <el-dialog
      title="同意赔付"
      width="480px"
      :visible="agree.visible"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="100px" label-position="left">
        <QcTextPlate>
          <QcTextPlateItem label="订单单号：">{{ agree.model.orderNumber }}</QcTextPlateItem>
          <QcTextPlateItem label="赔付单号：">{{ agree.model.number }}</QcTextPlateItem>
          <QcTextPlateItem label="订单金额：">￥{{ agree.model.orderAmount | formatPrice }}</QcTextPlateItem>
          <QcTextPlateItem label="赔付类型：">{{ agree.model.reasonType }}</QcTextPlateItem>
          <QcTextPlateItem label="赔付原因：">{{ agree.model.reason }}</QcTextPlateItem>
        </QcTextPlate>
        <el-form-item label="赔付金额：">
          <el-input v-model="agree.model.refundAmount"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="agree.visible = false">关闭</el-button>
          <el-button type="primary" :loading="loading" @click="agreeOrderCompensation()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import CompensationHistoryItem from './CompensationHistoryItem'
export default {
  components: {
    CompensationHistoryItem
  },
  data() {
    return {
      option: {
        url: 'api/admin/mall/v1/order-compensation/page'
      },
      searchForm: [
        { formName: 'status', value: ' ' },
        { label: '订单单号', formName: 'orderNumber', type: 'input' },
        { label: '赔付单号', formName: 'number', type: 'input' },
        { label: '会员昵称', formName: 'memberAppellation', type: 'input' },
        {
          label: '发起人',
          formName: 'creatorType',
          type: 'select',
          value: '',
          option: [
            { label: '全部', value: '' },
            { label: '买家', value: 'buyer' },
            { label: '商家', value: 'seller' }
          ]
        }
      ],
      tableData: [],
      count: {},
      agree: {
        visible: false,
        model: {}
      },
      // 退款金额
      refundAmount: '',
      loading: false,
      detail: {
        visible: false,
        model: {}
      }
    }
  },
  computed: {
    statusTotal() {
      return (this.count.waiting || 0) + (this.count.canceled || 0) + (this.count.finished || 0)
    }
  },
  created() {
    this.countOrderCompensation()
  },
  methods: {
    onGetList(list) {
      this.tableData = list
    },
    onSearch(v) {
      this.searchForm[0].value = v.name
      this.$refs.table.transformSearchForm().then(() => {
        this.$refs.table.onSearch()
      })
    },
    countOrderCompensation() {
      this.$http.countOrderCompensation().then((res) => {
        this.count = res.data.data
      })
    },
    getOrderCompensation(id) {
      this.$http.getOrderCompensation({ id }).then((res) => {
        this.detail.model = res.data.data
        this.detail.visible = true
      })
    },
    cancelOrderCompensation(id) {
      this.$prompt('', '是否取消赔付申请？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '取消原因'
      })
        .then(({ value }) => {
          this.$http.cancelOrderCompensation({ cancelReason: value, id }).then(() => {
            this.$message.success('操作成功')
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    },
    onShowAgreeDialog(index) {
      let model = JSON.parse(JSON.stringify(this.tableData[index]))
      model.refundAmount = model.applyAmount / 100
      this.agree.model = model
      this.agree.visible = true
    },
    agreeOrderCompensation() {
      this.loading = true
      let model = JSON.parse(JSON.stringify(this.agree.model))
      model.refundAmount = model.refundAmount * 100
      let total = model.refundAmount
      if (model.refundAmount === total) {
        this.$http
          .agreeOrderCompensation(model)
          .then(() => {
            this.$message.success('操作成功')
            this.orderCompensationPage()
            this.agree.dialog = false
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.$message.error('赔付总额必须等于各项收益的总和')
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
