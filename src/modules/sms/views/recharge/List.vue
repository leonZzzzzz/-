<template>
  <div>
    <QcTable ref="table" :option="option" :column="column"></QcTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/v1/sms/smsorder/page'
      },
      column: [
        { label: '序号', type: 'index', align: 'center' },
        {
          label: '流水单号',
          align: 'center',
          prop: 'outTradeNo'
        },
        {
          label: '套餐类型',
          align: 'center',
          prop: 'name'
        },
        { label: '产品内容', prop: 'content', align: 'center' },
        {
          label: '交易金额',
          align: 'center',
          formatter: (row) => {
            return row.payAmount / 100
          }
        },
        { label: '支付方式', prop: 'frpCode', align: 'center' },
        {
          label: '支付状态',
          align: 'center',
          formatter: (row) => {
            return row.status == 1 ? '已支付' : '未支付'
          }
        },
        {
          label: '交易时间',
          prop: 'outNotifyTime',
          align: 'center',
          width: '100px'
        },
        { label: '创建时间', prop: 'createTime', align: 'center', width: '100px' }
      ]
    }
  }
}
</script>

<style></style>
