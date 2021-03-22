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
              <td width="70">订单时间</td>
              <td width="80">订单类型</td>
              <td width="80">订单状态</td>
              <td width="80">助力状态</td>
              <td width="100">支付金额（元）</td>
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
                  店铺：{{ item.storeName || '--' }}&nbsp;&nbsp;&nbsp;订单编号：{{
                    item.orderNo || '--'
                  }}&nbsp;&nbsp;&nbsp;微信单号：{{ item.tradeNo || '--' }}
                </td>
                <!-- @click="$router.push(`/main/mall/order/product/detail?id=${item.id}`)" -->
                <td
                  class="bb1"
                  style="color: rgb(64, 158, 255);cursor: pointer;"
                  @click="openNewPage('/main/mall/order/product/detail', { id: item.id })"
                >
                  查看详情
                </td>
              </tr>
              <tr v-for="(list, productIndex) in item.orderItems" :key="productIndex">
                <td
                  width="300"
                  class="br1"
                  :class="{ bb1: productIndex < item.orderItems.length - 1 }"
                  style="text-align:left;"
                >
                  <QcProductItem :img="imgHost + list.iconUrl" :title="list.name">{{ list.specs }}</QcProductItem>
                </td>
                <td width="70" class="br1" :class="{ bb1: productIndex < item.orderItems.length - 1 }">
                  {{ list.price | formatPrice }}
                </td>
                <td width="50" class="br1" :class="{ bb1: productIndex < item.orderItems.length - 1 }">
                  x{{ list.qty }}
                </td>
                <td width="70" class="br1" v-if="productIndex == 0" :rowspan="item.orderItems.length">
                  {{ item.createTime }}
                </td>
                <td width="80" class="br1" v-if="productIndex == 0" :rowspan="item.orderItems.length">
                  {{ item.bizTypeName }}
                </td>
                <td width="80" class="br1" v-if="productIndex == 0" :rowspan="item.orderItems.length">
                  <div>{{ item.statusName }}</div>
                </td>
                <td width="80" class="br1" v-if="productIndex == 0" :rowspan="item.orderItems.length">
                  <div>{{ item.helpStatusName }}</div>
                </td>
                <td width="100" class="br1" v-if="productIndex == 0" :rowspan="item.orderItems.length">
                  <div>{{ item.needPayTotalAmount | formatPrice }}</div>
                </td>
                <td width="120" v-if="productIndex == 0" :rowspan="item.orderItems.length">
                  <p>{{ item.buyerName }}</p>
                  <p>{{ item.buyerMobile }}</p>
                </td>
              </tr>
              <tr>
                <td colspan="9" style="border-top: 1px solid #ebeef5;text-align: left;padding-left: 15px;">
                  买家留言：{{ item.remark || '--' }}
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
        url: 'api/admin/mall/v1/helpOrder/page'
      },
      searchForm: [
        { label: '订单号', formName: 'orderNo', type: 'input' },
        { label: '下单用户', formName: 'buyerName', type: 'input' },
        { label: '下单手机', formName: 'buyerMobile', type: 'input' }
      ],
      tableData: []
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
    },
    onSearch(v) {
      this.searchForm[0].value = v.name
      this.$refs.table.transformSearchForm().then(() => {
        this.$refs.table.onSearch()
      })
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
