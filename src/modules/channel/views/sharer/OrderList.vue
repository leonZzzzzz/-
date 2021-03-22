<template>
  <QcTable
    ref="table"
    :option="option"
    :search-form="searchForm"
    :menu="menu"
    :column="column"
  ></QcTable>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1.1/distributer-commission/page'
      },
      searchForm: [
        { label: '订单号', formName: 'fromOrderNumber', type: 'input' },
        { label: '订单标题', formName: 'fromOrderTitle', type: 'input' }
      ],
      menu: [
        // {
        //   type: 'export',
        //   label: '导出',
        //   url: this.$projectUrl + '/api/admin/v1.1/sharer/export'
        // }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center', width: 80 },
        {
          label: '推广者姓名',
          align: 'left',
          prop: 'name'
        },
        {
          label: '推广者手机',
          align: 'left',
          prop: 'mobile'
        },
        {
          label: '买家昵称',
          align: 'left',
          prop: 'buyerAppellation'
        },
        {
          label: '买家手机',
          align: 'left',
          prop: 'buyerMobile'
        },
        {
          label: '订 单 号',
          align: 'left',
          prop: 'fromOrderNumber'
        },
        {
          label: '订单标题',
          align: 'left',
          prop: 'fromOrderTitle'
        },
        {
          label: '订单类型',
          align: 'left',
          formatter: row => {
            switch (row.fromOrderType) {
              case 'activity-sign':
                return '活动签到'
              case 'mall-order':
                return '商城订单'
              default:
                return row.fromOrderType
            }
          }
        },
        {
          label: '佣金金额',
          align: 'center',
          formatter: row => {
            return <div>￥{(row.amount / 100).toFixed(2)}</div>
          }
        },
        {
          label: '商户',
          align: 'left',
          prop: 'store'
        },
        {
          label: '创建时间',
          align: 'left',
          prop: 'createTime'
        }
      ]
    }
  },
  methods: {
    deleteDistributeShopping(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteDistributeShopping({ id }).then(() => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {
          return
        })
    }
  }
}
</script>

<style></style>
