<template>
  <QcNavigationPage content="项目列表" style="width:900px;margin:0 auto;">
    <el-table :data="itemList" v-loading="pageLaoding" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看捐款名单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="捐款名单"
      :visible.sync="orderVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="closeDialog"
      width="850px"
    >
      <div>
        <QcTable
          v-if="orderVisible"
          ref="table"
          :menu="menu"
          :search-form="searchForm"
          :option="option"
          :column="column"
        >
          <el-table-column label="查看填写信息" align="center" type="expand" width="110px">
            <template slot-scope="props">
              <el-form v-loading="filedLaoding" label-position="left" inline class="demo-table-expand">
                <el-form-item :label="item.name" v-for="(item, index) in fieldList" :key="item.key + index">
                  <span>{{ props.row[item.key] || '-' }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </QcTable>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog()" size="small">关 闭</el-button>
      </span>
    </el-dialog>
  </QcNavigationPage>
</template>

<script>
import { BASEURL } from '@/utils/config'
export default {
  data() {
    return {
      pageLaoding: false,
      orderVisible: false,
      updateId: '',
      itemList: [],
      fieldList: [],
      orderList: [],
      menu: [
        {
          label: '刷新',
          on: () => {
            this.$refs.table.onSearch()
          }
        },
        {
          type: 'export',
          url: `${BASEURL}/api/admin/v1.1/donate-order/item-export`
        }
      ],
      searchForm: [
        {
          formName: 'itemId',
          value: ''
        }
      ],
      option: {
        url: 'api/admin/v1.1/donate-order/item-page',
        showSearchAndReset: false,
        isFull: false,
        height: 400
      },
      column: [
        { type: 'index', label: '序号', align: 'center' },
        {
          prop: 'headImage',
          label: '头像',
          align: 'center',
          width: 70,
          formatter: (row) => {
            return <img src={row.headImage} alt="" width="50" height="50" style="border-radius: 50%;" />
          }
        },
        { prop: 'donator', label: '昵称', align: 'center' },
        { prop: 'orderNumber', label: '订单号', align: 'center' },
        {
          prop: 'amount',
          label: '捐款金额',
          align: 'center',
          formatter: (row) => {
            return (row.amount / 100).toFixed(2)
          }
        },
        {
          prop: 'status',
          label: '捐款状态',
          align: 'center',
          formatter: (row) => {
            switch (row.status) {
              case 'finished':
                return '已支付'
              case 'refund':
                return '已退款'
              default:
                return row.status
            }
          }
        },
        { prop: 'createTime', label: '创建时间', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  size="small"
                  onClick={() => {
                    this.onRefund(row)
                  }}
                >
                  点击退款
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  created() {
    this.getItemList()
  },
  methods: {
    // 获取项目列表
    async getItemList() {
      try {
        this.pageLaoding = true
        let res = await this.$http.donateItemList({ activityId: this.$route.query.id })
        this.itemList = res.data.data || []
      } finally {
        this.pageLaoding = false
      }
    },
    // 获取项目字段列表
    getFiledList(id) {
      if (!id) {
        console.log('没传项目id')
        return
      }
      this.filedLaoding = true
      this.$http
        .donateFieldList({ itemId: id })
        .then((res) => {
          this.filedLaoding = false
          this.fieldList = res.data.data || []
        })
        .catch((err) => {
          this.filedLaoding = false
        })
    },
    handleClick(row) {
      this.searchForm[0].value = row.id
      this.orderVisible = true
      this.getFiledList(row.id)
    },
    closeDialog() {
      this.orderVisible = false
    },
    onRefund(item) {
      this.$confirm(`确认给订单号：${item.orderNumber} 退款吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$http.donateOrderRefund({ orderId: item.id })
        this.$message.success('操作退款成功')
        this.$refs.table.onSearchKeep()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
  line-height: 1.5 !important;
}
.demo-table-expand .el-form-item__content {
  line-height: 1.5 !important;
  flex: 1 !important;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 10px;
  width: 50%;
  display: inline-flex !important;
}
</style>
