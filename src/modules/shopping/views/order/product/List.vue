<template>
  <div>
    <QcTable
      ref="table"
      :option="option"
      :menu="menu"
      :search-form="searchForm"
      @get-list="onGetList"
    >
      <div>
        <el-tabs
          v-model="searchForm[0].value"
          @tab-click="onSearch"
          type="card"
          style="margin:0 15px"
        >
          <el-tab-pane
            :label="`全部(${count.total || 0})`"
            :name="' '"
          ></el-tab-pane>
          <el-tab-pane
            :label="`待付款(${count.pay || 0})`"
            name="0"
          ></el-tab-pane>
          <el-tab-pane
            :label="`待发货(${count.unDeliver || 0})`"
            name="1"
          ></el-tab-pane>
          <el-tab-pane
            :label="`已发货(${count.deliver || 0})`"
            name="2"
          ></el-tab-pane>
          <el-tab-pane
            :label="`已取消(${count.cancel || 0})`"
            name="-1"
          ></el-tab-pane>
          <el-tab-pane
            :label="`已完成(${count.finish || 0})`"
            name="10"
          ></el-tab-pane>
        </el-tabs>
        <table
          cellpadding="0"
          cellspacing="0"
          class="theader"
        >
          <tbody>
            <tr>
              <td width="300">商品</td>
              <td width="70">单价（元）</td>
              <td width="50">数量</td>
              <td width="70">订单时间</td>
              <td width="80">订单类型</td>
              <td width="80">订单状态</td>
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
                <td
                  class="bb1"
                  colspan="7"
                  style="text-align:left;"
                >
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
              <tr
                v-for="(list, productIndex) in item.orderItems"
                :key="productIndex"
              >
                <td
                  width="300"
                  class="br1"
                  :class="{ bb1: productIndex < item.orderItems.length - 1 }"
                  style="text-align:left;"
                >
                  <QcProductItem
                    :img="imgHost + list.iconUrl"
                    :title="list.name"
                  >{{ list.specs }}</QcProductItem>
                </td>
                <td
                  width="70"
                  class="br1"
                  :class="{ bb1: productIndex < item.orderItems.length - 1 }"
                >
                  {{ list.price | formatPrice }}
                </td>
                <td
                  width="50"
                  class="br1"
                  :class="{ bb1: productIndex < item.orderItems.length - 1 }"
                >
                  x{{ list.qty }}
                </td>
                <td
                  width="70"
                  class="br1"
                  v-if="productIndex == 0"
                  :rowspan="item.orderItems.length"
                >
                  {{ item.createTime }}
                </td>
                <td
                  width="80"
                  class="br1"
                  v-if="productIndex == 0"
                  :rowspan="item.orderItems.length"
                >
                  {{ item.bizTypeName }}
                </td>
                <td
                  width="80"
                  class="br1"
                  v-if="productIndex == 0"
                  :rowspan="item.orderItems.length"
                >
                  <div>{{ item.statusName }}</div>
                </td>
                <td
                  width="100"
                  class="br1"
                  v-if="productIndex == 0"
                  :rowspan="item.orderItems.length"
                >
                  <!-- <div>{{ item.needPayTotalAmount | formatPrice }}</div> -->
                  <div>{{ item.payAmount | formatPrice }}</div>
                </td>
                <td
                  width="120"
                  v-if="productIndex == 0"
                  :rowspan="item.orderItems.length"
                >
                  <p>{{ item.buyerName }}</p>
                  <p>{{ item.buyerMobile }}</p>
                </td>
              </tr>
              <tr>
                <td
                  colspan="8"
                  style="border-top: 1px solid #ebeef5;text-align: left;padding-left: 15px;"
                >
                  买家留言：{{ item.remark || '--' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-else
          style="padding: 60px;text-align: center;color: #717171;font-size: 14px;"
        >暂无数据</div>
      </div>
    </QcTable>
    <el-dialog
      title="批量发货信息"
      :visible="deliver.dialog"
      width="480px"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row :gutter="20">
        <el-col :span="8">共导入：{{ deliver.model.totalNum || 0 }}&nbsp;条</el-col>
        <el-col :span="8">
          成功：
          <span style="color: #67c23a">{{ deliver.model.successNum || 0 }}</span>&nbsp;条
        </el-col>
        <el-col :span="8">
          失败：
          <span style="color: #ff5433">{{ deliver.model.failNum || 0 }}</span>&nbsp;条
        </el-col>
      </el-row>
      <br />
      <el-table
        v-if="deliver.model.failNum > 0"
        :data="deliver.model.rowList"
      >
        <el-table-column
          v-if="deliver.model.failNum > 10"
          :label="deliver.model.remark"
        >
          <el-table-column
            width="50"
            label="行数"
            align="center"
            prop="rowNum"
          ></el-table-column>
          <el-table-column
            label="错误信息"
            prop="colList"
          ></el-table-column>
        </el-table-column>
        <div v-else>
          <el-table-column
            label="错误信息"
            prop="colList"
          ></el-table-column>
          <el-table-column
            width="50"
            label="行数"
            align="center"
            prop="rowNum"
          ></el-table-column>
        </div>
      </el-table>
      <span slot="footer">
        <el-button
          type="info"
          @click="deliver.dialog = false"
        >关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { BASEURL } from '../../../../../utils/config'
export default {
  data() {
    return {
      option: {
        url: 'api/admin/mall/v1/order/page'
      },
      searchForm: [
        { formName: 'status', value: ' ' },
        { label: '微信订单', formName: 'tradeNo', type: 'input' },
        { label: '订单编号', formName: 'orderNo', type: 'input' },
        { label: '店铺名称', formName: 'storeName', type: 'input' },
        { label: '商品名称', formName: 'name', type: 'input' },
        { label: '收货人', formName: 'receiver', type: 'input' },
        { label: '收货手机', formName: 'mobile', type: 'input' },
        { label: '买家姓名', formName: 'buyerName', type: 'input' },
        { label: '买家手机', formName: 'buyerMobile', type: 'input' }
        // { label: '订单时间', formName: 'startCreateTime_endCreateTime', type: 'date-picker' }
      ],
      menu: [{ label: '导出商品订单', type: 'export', url: `${BASEURL}/api/admin/mall/v1/order/exportItems` }],
      tableData: [],
      count: {},
      // 功能数据
      deliver: {
        dialog: false,
        model: {}
      }
    }
  },
  created() {
    this.countOrder()
  },
  filters: {
    formatPrice(val) {
      return val / 100 || 0
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
    countOrder() {
      this.$http.countOrder().then(res => {
        this.count = res.data.data
      })
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
