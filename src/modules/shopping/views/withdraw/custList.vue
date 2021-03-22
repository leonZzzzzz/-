<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
  </div>
</template>

<script>
import { BASEURL } from '@/utils/config'
export default {
  data() {
    return {
      list: [],
      model: { id: '' },
      updateId: '',
      tableRow: {},
      formVisible: false,
      option: {
        url: 'api/admin/v1/store/withdrawPage'
        //,showSearchAndReset: false
      },
      searchForm: [
        { value: 'member', formName: 'accountType' },
        { value: '', formName: 'mobile', type: 'input', label: '手机号码' },
        {
          value: '',
          formName: 'auditStatus',
          type: 'select',
          option: [
            { value: 'waiting', label: '待审核' },
            { value: 'audited', label: '已审核' },
            { value: 'refused', label: '已拒绝' }
          ],
          label: '审核状态'
        },
        {
          value: '',
          formName: 'status',
          type: 'select',
          option: [
            { value: 'waiting', label: '未打款' },
            { value: 'ongoing', label: '打款中' },
            { value: 'received', label: '交易成功' },
            { value: 'fail', label: '交易失败' }
          ],
          label: '打款状态'
        },
        {
          type: 'date-picker',
          formName: 'startTime_endTime',
          el: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd'
          },
          label: '申请时间',
          value: ''
        }
      ],
      menu: [
        {
          type: 'export',
          label: '导出',
          url: BASEURL + '/api/admin/v1/store/export'
        },
        {
          label: '同意提现',
          disabled: ({ selectionRow }) => selectionRow.length == 0,
          on: (currentRow, search, selectionRow) => {
            console.log(selectionRow)
            let ids = selectionRow.map((item) => {
              return item.id
            })
            this.wdAudit(ids, 'audited')
          }
        },
        {
          label: '拒绝提现',
          disabled: ({ selectionRow }) => selectionRow.length == 0,
          on: (currentRow, search, selectionRow) => {
            console.log(selectionRow)
            let ids = selectionRow.map((item) => {
              return item.id
            })
            this.wdAudit(ids, 'refused')
          }
        }
      ],
      column: [
        {
          type: 'selection'
        },
        //{ type: 'index', label: '序号', width: '60px', align: 'center' },
        {
          label: '提现类型',
          prop: 'withdrawType',
          formatter: (row) => {
            return { store_wallet: '店铺余额', member_wallet: '账户余额' }[row.withdrawType]
          }
        },
        {
          label: '手机号',
          prop: 'mobilephoneNumber'
        },
        { label: '昵称', prop: 'appellation' },
        {
          label: '提现金额（元）',
          prop: 'amount',
          formatter: (row) => {
            return row.amount / 100
          }
        },
        {
          label: '手续费（元）',
          prop: 'poundage',
          formatter: (row) => {
            return row.poundage / 100
          }
        },
        {
          label: '实际到账（元）',
          prop: 'realAmount',
          formatter: (row) => {
            return row.realAmount / 100
          }
        },
        { label: '姓名', prop: 'receiverName' },
        { label: '卡号', prop: 'bankNumber' },
        { label: '申请时间', prop: 'createTime' },
        {
          label: '审核状态',
          prop: 'auditStatus',
          formatter: (row) => {
            return { waiting: '待审核', audited: '已审核', refused: '已拒绝' }[row.auditStatus]
          }
        },
        {
          label: '打款状态',
          prop: 'transferStatus',
          formatter: (row) => {
            return { waiting: '未打款', ongoing: '打款中', received: '交易成功', fail: '交易失败' }[row.transferStatus]
          }
        },
        { label: '交易信息', prop: 'transferFailMessage' }
      ]
    }
  },
  methods: {
    wdAudit(ids, status) {
      this.$confirm('是否进行该操作', '提示')
        .then(() => {
          this.$http.withdrawAudit({ ids, status }).then(() => {
            this.$message.success('操作成功')
            this.$refs.table.onSearch()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
