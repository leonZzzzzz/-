<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :column="column"></QcTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      model: { id: '' },
      updateId: '',
      tableRow: {},
      formVisible: false,
      option: {
        url: 'api/admin/v1/store/refundEarnestRecord'
        //,showSearchAndReset: false
      },
      searchForm: [
        { value: '', formName: 'storeName', type: 'input', label: '店铺名称' },
        {
          value: '',
          formName: 'type',
          type: 'select',
          option: [
            { value: 'online', label: '线上退还' },
            { value: 'offline', label: '线下退还' }
          ],
          label: '退还方式'
        }
      ],
      column: [
        { type: 'index', label: '序号', width: '100px', align: 'center' },
        {
          label: '店铺名称',
          prop: 'storeName'
        },
        {
          label: '退还方式',
          prop: 'type',
          formatter: (row) => {
            return { online: '线上退还', offline: '线下退还' }[row.type]
          }
        },
        { label: '退还途径', prop: 'way' },
        {
          label: '退还金额',
          prop: 'amount',
          formatter: (row) => {
            return row.arrivalAmount / 100
          }
        },
        { label: '退还时间', prop: 'createTime' },
        { label: '备注信息', prop: 'note' }
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
