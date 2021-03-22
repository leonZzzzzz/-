<template>
  <div class="inner-tag">
    <div class="container">
      <!-- <div class="query-table">
        <div class="query-table-left">
          <div class="search-input">
            <el-input size="small" placeholder="输入标签名称" v-model="searchForm.content"></el-input>
          </div>
          <el-button size="small" type="primary" @click="onSearch">查询</el-button>
          <el-button size="small" type="info" @click="onReset">重置</el-button>
        </div>
      </div> -->
      <div class="operating-btn">
        <el-button size="small" type="primary" :loading="syncLoading" @click="dataSync">数据同步</el-button>
      </div>
      <div class="common-table-box">
        <com-table :tableData="tableData" :column="column"></com-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ComTable from '../../../components/common/ComTable'
import ComPagination from '../../../components/common/ComPagination'
export default {
  components: { ComTable, ComPagination },
  data() {
    return {
      searchForm: {
        content: ''
      },
      tableData: [],
      column: [
        {
          type: 'index',
          label: '序号',
          align: 'center',
          width: '150px'
        },
        {
          label: '标签名称',
          align: 'center',
          minWidth: '150px',
          prop: 'name'
        },
        {
          label: '创建时间',
          align: 'center',
          minWidth: '150px',
          prop: 'createTime',
          formatter: (row) => {
            return row.createTime ? row.createTime.slice(0, row.createTime.length - 3) : ''
          }
        },
        {
          label: '更新时间',
          align: 'center',
          minWidth: '150px',
          prop: 'updateTime',
          formatter: (row) => {
            return row.updateTime ? row.updateTime.slice(0, row.updateTime.length - 3) : ''
          }
        }
        // {
        //   label: '操作',
        //   align: 'center',
        //   width: '200px',
        //   fixed: 'right',
        //   formatter: row => {
        //     return (
        //       <div>
        //         <el-button
        //           type="text"
        //           onClick={() => {
        //             this.$router.push(`/main/scrm/inner-management/tag/detail?id=${row.id}`)
        //           }}>
        //           查看
        //         </el-button>
        //       </div>
        //     )
        //   }
        // }
      ],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      syncLoading: false
    }
  },
  created() {
    this.getTagPage()
  },
  methods: {
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getTagPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getTagPage()
    },
    getTagPage() {
      let that = this
      that.$http.getInnerTagPage(that.page).then((res) => {
        that.tableData = res.data.data.list
        that.page.total = res.data.data.total
      })
    },
    // 数据同步
    dataSync() {
      this.syncLoading = true
      this.$http.syncCustomerList().then(() => {
        this.$message.success('同步成功')
        this.syncLoading = false
        this.page.pageNum = 1
        this.getInnerTagPage()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inner-tag {
  width: 100%;
  height: 100%;
  position: relative;
}
.navigation {
  width: 100%;
  color: #909399;
  font-size: 14px;
  margin-bottom: 20px;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
}
.operating-btn {
  margin-bottom: 20px;
}
.query-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  &-left {
    display: flex;
    .search-input {
      width: 300px;
      margin-right: 10px;
    }
  }
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
::v-deep .el-input-group__append {
  background-color: #294a7b;
  border: 1px solid #284a7b;
}
::v-deep .el-icon-search {
  color: #ffffff;
}
</style>
