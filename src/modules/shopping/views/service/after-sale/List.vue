<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" @get-list="onGetList">
      <div>
        <table cellpadding="0" cellspacing="0" class="theader">
          <tbody>
            <tr>
              <td width="300">商品</td>
              <td width="70">单价（元）</td>
              <td width="50">数量</td>
              <td width="70">申请时间</td>
              <td width="80">售后类型</td>
              <td width="80">订单状态</td>
              <td width="80">售后状态</td>
              <td width="100">订单金额（元）</td>
              <td width="120">买家</td>
            </tr>
          </tbody>
        </table>
        <div v-if="tableData.length > 0">
          <table
            cellpadding="0"
            cellspacing="0"
            class="table"
            v-for="(item, orderIndex) in tableData"
            :key="orderIndex"
          >
            <tbody>
              <tr style="background: #ebeef5;">
                <td class="bb1" colspan="8" style="text-align:left;">
                  订单编号：{{ item.orderNo }}&nbsp;&nbsp;&nbsp;&nbsp;售后单号：{{ item.orderNumber }}
                </td>
                <!-- @click="$router.push(`/main/mall/service/after-sale/detail?id=${item.id}`)" -->
                <td
                  class="bb1"
                  style="color: #2a75ed;cursor: pointer;"
                  @click="openNewPage('/main/mall/service/after-sale/detail', { id: item.id })"
                >
                  查看详情
                </td>
              </tr>
              <tr v-for="(list, productIndex) in item.afterSalesItemList" :key="productIndex">
                <td
                  width="300"
                  class="br1"
                  :class="{ bb1: productIndex < item.afterSalesItemList.length - 1 }"
                  style="text-align:left;"
                >
                  <QcProductItem :img="imgHost + list.icon" :title="list.name">{{ list.spec }}</QcProductItem>
                </td>
                <td width="70" class="br1" :class="{ bb1: productIndex < item.afterSalesItemList.length - 1 }">
                  {{ list.price / 100 }}
                </td>
                <td width="50" class="br1" :class="{ bb1: productIndex < item.afterSalesItemList.length - 1 }">
                  x{{ list.qty }}
                </td>
                <td width="70" class="br1" v-if="productIndex == 0" :rowspan="item.afterSalesItemList.length">
                  {{ item.createTime }}
                </td>
                <td width="80" class="br1" v-if="productIndex == 0" :rowspan="item.afterSalesItemList.length">
                  {{ item.serviceType | serviceTypeName }}
                </td>
                <td width="80" class="br1" v-if="productIndex == 0" :rowspan="item.afterSalesItemList.length">
                  <div>{{ item.orderStatusName }}</div>
                </td>
                <td width="80" class="br1" v-if="productIndex == 0" :rowspan="item.afterSalesItemList.length">
                  <div>{{ item.statusName }}</div>
                </td>
                <td width="100" class="br1" v-if="productIndex == 0" :rowspan="item.afterSalesItemList.length">
                  {{ item.needRefundAmount / 100 }}
                </td>
                <td width="120" v-if="productIndex == 0" :rowspan="item.afterSalesItemList.length">
                  <p>{{ item.receiver }}</p>
                  <p>{{ item.mobile }}</p>
                </td>
              </tr>
              <tr>
                <td colspan="9" style="border-top: 1px solid #ebeef5;text-align: left;padding-left: 15px;">
                  退换理由：{{ item.reason || '--' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else style="padding: 60px;text-align: center;color: #717171;font-size: 14px;">暂无数据</div>
      </div>
    </QcTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/mall/v1/orderAfterSales/page'
      },
      searchForm: [
        { label: '订单编号', formName: 'orderNo', type: 'input' },
        { label: '售后单号', formName: 'orderNumber', type: 'input' },
        {
          label: '退换类型',
          formName: 'serviceType',
          type: 'select',
          option: [
            { label: '全部', value: '' },
            { label: '退货', value: '1' },
            { label: '换货', value: '2' },
            { label: '仅退款', value: '3' }
          ],
          value: ''
        },
        {
          label: '申请时间',
          formName: 'startTime_endTime',
          type: 'date-picker',
          el: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd'
          }
        }
      ],
      tableData: [],
      count: {}
    }
  },
  methods: {
    // 打开新窗口
    openNewPage(path, query, name) {
      let newpage = this.$router.resolve({
        path: path,
        query: query,
        name: name
      })
      window.open(newpage.href, '_blank')
    },
    onGetList(list) {
      this.tableData = list
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  border: 1px solid #ebeef5;
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
  td {
    padding: 10px;
    text-align: center;
  }
  .br1 {
    border-right: 1px solid #ebeef5;
  }
  .bb1 {
    border-bottom: 1px solid #ebeef5;
  }
}
.theader {
  width: 100%;
  font-size: 14px;
  background: #ebeef5;
  color: #909399;
  td {
    padding: 15px 10px;
    text-align: center;
  }
}
</style>
