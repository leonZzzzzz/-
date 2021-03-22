<template>
  <div>
    <QcTable :option="option" :search-form="searchForm" @get-list="onGetList">
      <div class="table">
        <el-row class="row table-header">
          <el-col :span="7">
            <div class="content">商品</div>
          </el-col>
          <el-col :span="2">
            <div class="content center">单价</div>
          </el-col>
          <el-col :span="2">
            <div class="content center">数量</div>
          </el-col>
          <el-col :span="2">
            <div class="content center">订单时间</div>
          </el-col>
          <el-col :span="2">
            <div class="content center">拼团状态</div>
          </el-col>
          <el-col :span="3">
            <div class="content center">角色</div>
          </el-col>
          <el-col :span="2">
            <div class="content">订单状态</div>
          </el-col>
          <el-col :span="2">
            <div class="content center">支付金额</div>
          </el-col>
          <el-col :span="2">
            <div class="content center">买家</div>
          </el-col>
        </el-row>
        <div v-for="(item, index) in tableData" :key="item.id" style="margin-top: 10px;">
          <div class="table-wrap">
            <div>
              <el-row class="row table-body" style="background:rgb(235, 238, 245);">
                <el-col :span="22">
                  <div class="content">
                    店铺：{{ item.storeName || '--' }}&nbsp;&nbsp;&nbsp;订单编号：{{
                      item.orderNo || '--'
                    }}&nbsp;&nbsp;&nbsp;微信单号：{{ item.tradeNo || '--' }}
                  </div>
                </el-col>
                <el-col :span="2">
                  <!-- @click="$router.push(`/main/mall/order/product/detail?id=${item.id}`)" -->
                  <div
                    class="content"
                    style="color: #409eff; cursor: pointer;text-align: center;"
                    @click="openNewPage('/main/mall/order/product/detail', { id: item.id })"
                  >
                    查看详情
                  </div>
                </el-col>
              </el-row>
              <el-row class="row table-body">
                <el-col :span="7">
                  <div class="content">
                    <QcProductItem :img="imgHost + item.orderItems[0].iconUrl" :title="item.name">{{
                      item.orderItems[0].specs
                    }}</QcProductItem>
                  </div>
                </el-col>
                <el-col :span="2">
                  <div class="content center">￥{{ item.orderItems[0].price | formatPrice }}</div>
                </el-col>
                <el-col :span="2">
                  <div class="content center">x{{ item.qty }}</div>
                </el-col>
                <el-col :span="2">
                  <div class="content center">{{ item.createTime }}</div>
                </el-col>
                <el-col :span="2">
                  <div class="content center">
                    <p>{{ item.groupStatusName }}</p>
                    <p>{{ item.groupHaveQuantity }}/{{ item.groupQuantity }}</p>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="content center">{{ item.organizer ? '团长' : '参团' }}</div>
                </el-col>
                <el-col :span="2">
                  <div class="content">{{ item.statusName }}</div>
                </el-col>
                <el-col :span="2">
                  <div class="content center">￥{{ item.totalAmount | formatPrice }}</div>
                </el-col>
                <el-col :span="2">
                  <div class="content center">
                    <p>{{ item.buyerName }}</p>
                    <p>{{ item.buyerMobile }}</p>
                  </div>
                </el-col>
              </el-row>
            </div>
            <template v-if="openIndex === index">
              <div v-for="child in item.child" :key="child.id">
                <div class="table-wrap">
                  <el-row class="row table-body" style="background:#fbfbfb;">
                    <el-col :span="22">
                      <div class="content">订单编号：{{ child.orderNo }}&nbsp;&nbsp;微信单号：{{ child.tradeNo }}</div>
                    </el-col>
                    <!-- $router.push(`/main/mall/order/product/detail?id=${child.id}`)" -->
                    <el-col :span="2">
                      <div
                        class="content"
                        style="color: #409eff; cursor: pointer;text-align: center;"
                        @click="openNewPage('/main/mall/order/product/detail', { id: child.id })"
                      >
                        查看详情
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="row table-body">
                    <el-col :span="7">
                      <div class="content">
                        <QcProductItem :img="imgHost + child.orderItems[0].iconUrl" :title="child.name">{{
                          child.orderItems[0].specs
                        }}</QcProductItem>
                      </div>
                    </el-col>
                    <el-col :span="2">
                      <div class="content center">￥{{ child.orderItems[0].price | formatPrice }}</div>
                    </el-col>
                    <el-col :span="2">
                      <div class="content center">x{{ child.qty }}</div>
                    </el-col>
                    <el-col :span="2">
                      <div class="content center">{{ child.createTime }}</div>
                    </el-col>
                    <el-col :span="2">
                      <div class="content center">
                        <p>{{ child.groupStatusName }}</p>
                        <!-- <p>{{child.groupHaveQuantity}}/{{child.groupQuantity}}</p> -->
                      </div>
                    </el-col>
                    <el-col :span="3">
                      <div class="content center">{{ child.organizer ? '团长' : '参团' }}</div>
                    </el-col>
                    <el-col :span="2">
                      <div class="content">{{ child.statusName }}</div>
                    </el-col>
                    <el-col :span="2">
                      <div class="content center">￥{{ child.totalAmount | formatPrice }}</div>
                    </el-col>
                    <el-col :span="2">
                      <div class="content center">
                        <p>{{ child.buyerName }}</p>
                        <p>{{ child.buyerMobile }}</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </template>
            <div v-if="item.organizer" class="open-button">
              <p v-if="openIndex === index" @click="openIndex = null">
                关闭
                <i class="el-icon-arrow-up"></i>
              </p>
              <p v-else @click="getListJoinOrder(index, item.id)">
                展开
                <i class="el-icon-arrow-down"></i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </QcTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/mall/v1/groupOrder/page'
      },
      searchForm: [
        {
          type: 'input',
          formName: 'orderNo',
          label: '订单编号',
          value: ''
        },
        {
          type: 'select',
          formName: 'payStatus',
          label: '支付状态',
          option: [
            { value: '', label: '全部' },
            { value: 1, label: '未支付' },
            { value: 3, label: '已支付' }
          ],
          value: ''
        },
        {
          type: 'date-picker',
          formName: 'startCreateTime_endCreateTime',
          el: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd'
          },
          label: '下单时间',
          value: ''
        }
      ],
      tableData: [],
      openIndex: null
    }
  },
  methods: {
    openNewPage(path, query) {
      let newpage = this.$router.resolve({
        path: path,
        query: query
      })
      window.open(newpage.href, '_blank')
    },
    onGetList(row) {
      this.openIndex = null
      this.tableData = row
    },
    getListJoinOrder(index, organizeOrderId) {
      this.openIndex = index
      this.$http.getListJoinOrder({ organizeOrderId }).then((res) => {
        this.$set(this.tableData[index], 'child', res.data.data.list)
        this.tableData[index].child = res.data.data.list
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  padding: 0 15px;
  &-wrap {
    border: 1px solid #f5f7fa;
  }
  &-header {
    background: rgb(235, 238, 245);
    color: #909399;
  }
  &-body {
    color: #606266;
    // border-bottom: 1px solid #f5f7fa;
  }
  .row {
    font-size: 14px;
    .el-col {
      padding: 8px 0;
      line-height: 22px;
      .content {
        padding: 0 15px;
        display: block;
      }
    }
  }
  .center {
    text-align: center;
  }
  .open-button {
    text-align: center;
    color: #409eff;
    border-top: 1px solid #f5f7fa;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
  }
}
</style>
