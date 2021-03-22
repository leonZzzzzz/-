<template>
  <div class="wrap" ref="wrap">
    <QcTable
      ref="table"
      :option="option"
      :search-form="searchForm"
      :menu="menu"
      :column="column"
    ></QcTable>
    <FormDialog
      v-if="digFormWrap"
      :visible="digFormWrap"
      :type="type"
      :id="updateId"
      @close="onClose"
    ></FormDialog>
  </div>
</template>

<script>
import FormDialog from './form';
export default {
  props: {
    type: [Number]
  },
  components: { FormDialog },
  data() {
    return {
      updateId: '',
      digFormWrap: false,
      option: {
        url: 'api/admin/v1/memberLevelFeeOrder/page',
        size: 'small',
        showSearchAndReset: true
      },
      searchForm: [
        {label: '姓名', type: 'input', formName: 'name'},
        {label: '手机', type: 'input', formName: 'phone'},
        {
          label: '订单状态',
          type: 'select',
          formName: 'status',
          option: [
            { value: '', label: '全部' },
            { value: 'notPay', label: '待支付' },
            { value: 'pendingPayment', label: '待收款' },
            { value: 'notAudit', label: '待审核' },
            { value: 'success', label: '已支付' },
            { value: 'cancel', label: '已取消' },
          ],
          value: ''
        },
      ],
      column: [
        { prop: 'name', label: '姓名', align: 'center' },
        { prop: 'phone', label: '手机号', align: 'center' },
        { prop: 'title', label: '订单来源', align: 'center' },
        { prop: 'amount', label: '订单金额', align: 'center', 
          formatter: row => {
            return (row.amount / 100).toFixed(2)
          }
        },
        { prop: 'status', label: '订单状态', width: 100, align: 'center',
          formatter: row => {
            switch(row.status) {
              case 'notPay':
                return  <el-link type="warning">待支付</el-link>
              case 'pendingPayment':
                return <el-link type="warning">待收款</el-link>
              case 'notAudit':
                return <el-link type="danger">待审核</el-link>
              case 'success':
                return <el-link type="success">已支付</el-link>
              case 'cancel':
                return <el-link type="info">已取消</el-link>
              default: 
                return row.status
            }
          }
        },
        { prop: 'createTime', label: '创建时间', align: 'center' },
        { prop: 'payWay', label: '支付方式', width: 100, align: 'center',
          formatter: row => {
            switch(row.payWay) {
              case 'weChat':
                return '微信支付'
              case 'public':
                return '对公付款'
              case 'offline':
                return '线下收款'
              default: 
                return row.payWay
            }
          }
        },
        { prop: 'payTime', label: '支付时间', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: row => {
            return (
              <div>
                <el-button type="text" disabled={row.status != 'pendingPayment'} onClick={this.btnConfirm.bind(this, row.id)}>
                  确认收款
                </el-button>
              </div>
            )
          }
        }
      ],
      menu: []
    }
  },
  methods: {
    btnConfirm(id) {
      this.$confirm('是否确认收款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.orderUpdate(id)
        })
        .catch(() => {
          return
        })
    },
    async orderUpdate(id) {
      await this.$http.memberFeesOrderUpdate({ id })
      this.$refs.table.onSearchKeep()
      this.$message.success('确认成功')
    },
  }
}
</script>
