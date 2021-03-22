<template>
  <div class="table-box">
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      :highlight-current-row="currentRow"
      @row-click="handleRowClick"
      row-class-name="activity-detail__table-row"
      style="overflow-y: auto;"
      v-loading="isLoading"
      element-loading-text="数据加载中"
    >
      <!-- 勾选框 -->
      <el-table-column v-if="!currentRow" fixed="left" type="selection" width="55" align="center"></el-table-column>
      <div v-for="(item, i) in propData" :key="i">
        <el-table-column
          v-if="!item.template"
          :prop="item.prop"
          :label="item.label"
          :align="item.align || 'center'"
        ></el-table-column>
        <!-- show-overflow-tooltip -->
        <!-- file -->
        <el-table-column
          :align="item.align || 'center'"
          v-else-if="item.template == 'file'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="downLoadFile(scope.row[item.prop])"
              v-if="scope.row[item.prop]"
              >下载</el-button
            >
          </template>
        </el-table-column>
        <!-- signStatus -->
        <el-table-column
          :align="item.align || 'center'"
          v-else-if="item.template == 'signStatus'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">{{ scope.row[item.prop] | signStatus }}</template>
        </el-table-column>
        <el-table-column
          :align="item.align || 'center'"
          v-else-if="item.template == 'channel'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.channel }}{{ scope.row.subChannel ? '-' + scope.row.subChannel : '' }}</div>
          </template>
        </el-table-column>
        <!-- payment -->
        <el-table-column
          :align="item.align || 'center'"
          v-else-if="item.template == 'payment'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">{{ scope.row[item.prop] | payment(scope.row[item.money]) }}</template>
        </el-table-column>

        <!-- payprice -->
        <el-table-column
          :align="item.align || 'center'"
          v-else-if="item.template == 'payprice'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">{{ scope.row[item.prop] | payprice(scope.row[item.pay]) }}</template>
        </el-table-column>

        <el-table-column
          :align="item.align || 'center'"
          v-else-if="item.template == 'channel'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.channel }}{{ scope.row.subChannel ? '-' + scope.row.subChannel : '' }}</div>
          </template>
        </el-table-column>
        <!-- auditStatus -->
        <el-table-column
          :align="item.align || 'center'"
          v-else-if="item.template == 'auditStatus'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">{{ scope.row[item.prop] | auditStatus }}</template>
        </el-table-column>
        <!--布尔值  -->
        <el-table-column
          :align="item.align || 'center'"
          v-else-if="item.template == 'isshow'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">{{ scope.row[item.prop] ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column
          :align="item.align || 'center'"
          v-else-if="item.template == 'price'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">{{ scope.row[item.prop] | formatPrice }}</template>
        </el-table-column>
        <el-table-column
          :align="item.align || 'center'"
          v-else-if="item.template == 'checkWay'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">{{ scope.row[item.prop] | checkWay }}</template>
        </el-table-column>
        <!--图片  -->
        <el-table-column align="center" v-else-if="item.template == 'img'" :label="item.label" :width="140">
          <template slot-scope="scope">
            <img
              style="display: block; margin: 10px auto"
              src="http://athena-1255600302.cosgz.myqcloud.com/attachments/qc-logo.png"
              width="60"
              height="60"
              v-if="scope.row[item.prop] == undefined || scope.row[item.prop] === ''"
            />
            <img
              style="display: block; margin: 10px auto"
              :src="`${imgHost}${scope.row[item.prop]}`"
              width="60"
              height="60"
              v-else-if="item.isPrefix"
            />
            <img
              style="display: block; margin: 10px auto"
              :src="`${scope.row[item.prop]}`"
              width="60"
              height="60"
              v-else-if="item.headImage"
            />
            <img style="display: block; margin: 10px auto" :src="scope.row[item.prop]" width="60" height="60" v-else />
          </template>
        </el-table-column>
      </div>
    </el-table>
    <el-pagination
      style="text-align: center; padding: 10px; 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[10, 20, 30]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="page.total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    tableData: Array,
    propData: Array,
    activeIndex: String,
    page: Object,
    currentRow: {
      default: false,
      type: Boolean
    },
    isLoading: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('size-change', this.activeIndex, val)
    },
    handleCurrentChange(val) {
      console.log(this.activeIndex)
      this.$emit('current-change', this.activeIndex, val)
    },
    handleSelectionChange(val) {
      this.$emit('get-selection', this.activeIndex, val)
    },
    handleRowClick(row) {
      this.$emit('row-click', row)
    },
    downLoadFile(url) {
      console.log(url)
      // let url = `${this.imgHost}/api/admin/v1/activitySign/exportData?sourceId=${params.sourceId}&transferMember=${params.transferMember}`
      window.open(this.imgHost + url)
    }
  },
  filters: {
    //  isshow(val){
    //   console.log(val)
    //   if(val){
    //     return '是'
    //   }else{
    //     return '否'
    //   }
    // },
    // 状态
    signStatus(val) {
      switch (val) {
        case 1:
          return '待审核'
        case 2:
          return '审核通过'
        case 3:
          return '审核不通过'
        case 4:
          return '待支付'
        case 5:
          return '已支付'
        case 6:
          return '已报名'
        case 7:
          return '已退款'
        case 8:
          return '已取消'
        default:
          return val
      }
    },
    // 签到方式
    checkWay(val) {
      if (val === '') return ''
      switch (val) {
        case 1:
          return '手机签到'
        case 2:
          return '暗号签到'
        case 3:
          return '二维码'
        case 5:
          return '空降嘉宾'
      }
    },
    // 评论状态
    auditStatus(val) {
      if (val === '') return ''
      switch (val) {
        case 1:
          return '未审核'
        case 2:
          return '已审核'
        case 3:
          return '已拒绝'
      }
    },
    // 支付方式
    payment(val, data) {
      if (val == false) return ''
      else {
        if (data > 0) {
          return '积分支付'
        } else {
          return '微信支付'
        }
      }
    },
    payprice(val, pay) {
      if (!val) return ''
      else {
        if (val > 0) {
          if (pay > 0) {
            return val
          } else {
            return parseFloat(val / 100).toFixed(2)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.activity-detail__table-row {
  td .cell {
    max-height: 88px; // IE不支持超出显示省略号的css，所以这里限制下高度
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
}
</style>

<style lang="scss" scoped>
.table-box {
  border: 1px solid #f3f3f3;
  height: 600px;
  .el-table thead tr th {
    background-color: #f5f7fa;
  }
}
</style>
