<template>
  <div>
    <QcTable ref="table" :menu="menu" :search-form="searchForm" :option="option" :column="column"></QcTable>
  </div>
</template>

<script>
import { BASEURL } from '@/utils/config'
export default {
  data() {
    return {
      updateId: '',
      menu: [
        {
          type: 'export',
          url: `${BASEURL}/api/admin/v1.1/pay/export`
        }
      ],
      searchForm: [
        {
          formName: 'orderTitle',
          label: '标题',
          type: 'input',
          value: ''
        },
        {
          formName: 'mobile',
          label: '手机',
          type: 'input',
          value: ''
        },
        {
          label: '交易场景',
          type: 'select',
          formName: 'scene',
          option: [
            { value: '', label: '全部' },
            { value: 1, label: '交易' },
            { value: 2, label: '退款' }
          ],
          value: 1
        },
        {
          label: '支付状态',
          type: 'select',
          formName: 'status',
          option: [
            { value: '', label: '全部' },
            { value: 1, label: '未支付' },
            { value: 3, label: '已支付' }
          ],
          value: 3
        },
        {
          label: '订单时间',
          type: 'date-picker',
          formName: 'startCreateTime_endCreateTime',
          el: {
            type: 'datetimerange',
            'value-format': 'yyyy-MM-dd HH:mm:ss'
          }
        }
      ],
      option: {
        url: 'api/admin/v1.1/pay/page'
      },
      column: [
        { type: 'index', label: '序号', align: 'center' },
        {
          prop: 'headImage',
          label: '头像',
          align: 'center',
          width: 90,
          formatter: (row) => {
            return <img src={row.headImage} alt="" width="50" height="50" style="border-radius: 50%;" />
          }
        },
        { prop: 'appellation', label: '昵称', align: 'left' },
        { prop: 'mobile', label: '手机', align: 'left' },
        { prop: 'orderTitle', label: '订单标题', align: 'left' },
        { prop: 'orderType', label: '订单类型', align: 'center' },
        { prop: 'amountYuan', label: '订单金额', align: 'center' },
        {
          prop: 'currency',
          label: '支付方式',
          align: 'left',
          formatter: (row) => {
            return row.channel + '-' + row.currency
          }
        },
        { prop: 'status', label: '支付状态', align: 'left' },
        {
          prop: 'outTradeNumber',
          label: '微信支付单号',
          align: 'left',
          formatter: (row) => {
            return row.outTradeNumber || '-'
          }
        },
        { prop: 'scene', label: '交易场景', align: 'center' },
        { prop: 'payTime', label: '支付时间', align: 'left' },
        { prop: 'createTime', label: '下单时间', align: 'left' }
      ]
    }
  },
  methods: {}
}
</script>
