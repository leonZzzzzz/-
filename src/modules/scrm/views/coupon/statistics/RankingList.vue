<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :height="tableHeight"
      :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333', padding: '5px 0' }"
      id="table"
      :default-sort="{ prop: 'receivedQuantity', order: 'descending' }"
      @sort-change="sortChange"
    >
      <el-table-column
        :prop="item.prop"
        :label="item.title"
        :formatter="item.formatter"
        :sortable="item.sortable"
        :align="item.align"
        v-for="(item, index) in tableColumn"
        :key="index"
      >
      </el-table-column>
    </el-table>
    <TablePage :page="pageData" @sizeChange="onSizeChange" @pageChange="onPageChange"></TablePage>
  </div>
</template>

<script>
import TablePage from '../../../components/components/TablePage'
export default {
  components: {
    TablePage
  },
  created() {
    this.getRealtimeRank({ orderBy: this.orderBy })
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
    })
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      tableColumn: [
        {
          prop: 'couponTitle',
          title: '优惠券名称',
          sortable: false,
          align: 'center'
        },
        {
          prop: 'receivedQuantity',
          title: '领取数量（张）',
          sortable: 'custom',
          align: 'center'
        },
        {
          prop: 'usedQuantity',
          title: '使用数量（张）',
          sortable: 'custom',
          align: 'center'
        },
        {
          prop: 'usedPercent',
          title: '使用率',
          sortable: 'custom',
          align: 'center',
          formatter: row => {
            return row.receivedQuantity ? ((row.usedQuantity / row.receivedQuantity) * 100).toFixed(2) + '%' : '0.00%'
          }
        },
        {
          prop: 'deductAmount',
          title: '抵扣金额（元）',
          sortable: 'custom',
          align: 'center',
          formatter: row => {
            return row.custom || 0
          }
        }
      ],
      tableHeight: 400,
      // 分页数据
      pageData: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      orderBy: 'moreReceivedQuantityFirst'
    }
  },
  methods: {
    /* 页面渲染 */
    // 分页函数
    onSizeChange(val) {
      this.pageData.pageSize = val
      this.pageData.pageNum = 1
      this.getRealtimeRank({ orderBy: this.orderBy })
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.getRealtimeRank({ orderBy: this.orderBy })
    },
    // 排序方法
    sortChange(col) {
      let order = col.order == 'descending' ? 'more' : col.order == 'ascending' ? 'less' : ''
      if (!order) {
        // order不允许为null
        return
      }
      this.orderBy = order + col.prop.slice(0, 1).toLocaleUpperCase() + col.prop.slice(1) + 'First'
      this.getRealtimeRank({ orderBy: this.orderBy })
    },
    // 获取表格高度
    getTableHeight() {
      this.tableHeight = window.innerHeight - document.getElementById('table').offsetTop - 117 - 130
    },
    /* 获取数据 */
    getRealtimeRank(options) {
      options.pageSize = this.pageData.pageSize
      options.pageNum = this.pageData.pageNum
      this.$http.getRealtimeRank(options).then(res => {
        this.tableData = res.data.data.list
        this.pageData.total = res.data.data.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>