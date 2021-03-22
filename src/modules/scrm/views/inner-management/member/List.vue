<template>
  <div class="inner-member">
    <div class="container">
      <!-- <div class="query-table">
        <div class="query-table-left">
          <div class="search-input">
            <el-input size="small" placeholder="输入成员姓名" v-model="searchForm.content"></el-input>
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
    <com-dialog :config="editDialog.config" @closeDialog="closeEditDialog"></com-dialog>
  </div>
</template>

<script>
import ComTable from '../../../components/common/ComTable'
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
export default {
  components: { ComTable, ComPagination, ComDialog },
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
          width: '100px'
        },
        {
          label: '姓名',
          align: 'center',
          minWidth: '150px',
          prop: 'name'
        },
        {
          label: '头像',
          align: 'center',
          minWidth: '150px',
          prop: 'avatar',
          formatter: (row) => {
            return <img src={row.avatar} alt="" width="44" height="44" />
          }
        },
        {
          label: '性别',
          align: 'center',
          minWidth: '150px',
          prop: 'gender',
          formatter: (row) => {
            return {
              1: '男',
              2: '女'
            }[row.gender]
          }
        },
        {
          label: '职务',
          align: 'center',
          minWidth: '150px',
          prop: 'position'
        },
        {
          label: '部门',
          align: 'center',
          minWidth: '150px',
          prop: ''
        },
        {
          label: '手机',
          align: 'center',
          minWidth: '150px',
          prop: 'mobile'
        },
        {
          label: '邮箱',
          align: 'center',
          minWidth: '150px',
          prop: 'email'
        },
        {
          label: '添加时间',
          align: 'center',
          minWidth: '150px',
          prop: 'createTime'
        }
        // {
        //   label: '操作',
        //   align: 'center',
        //   width: '150px',
        //   fixed: 'right',
        //   formatter: row => {
        //     return (
        //       <div>
        //         <el-button
        //           type="text" onClick={this.showEditDialog.bind(this, row)}>
        //           调整成员部门
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
      editDialog: {
        config: {
          width: '600px',
          title: '调整成员部门',
          visible: false
        }
      },
      syncLoading: false
    }
  },
  created() {
    this.getMemberPage()
  },
  methods: {
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getMemberPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getMemberPage()
    },
    getMemberPage() {
      let that = this
      that.$http.getMemberPage(that.page).then((res) => {
        that.tableData = res.data.data.list
        that.page.total = res.data.data.total
      })
    },
    // 打开弹窗
    showEditDialog() {
      this.editDialog.config.visible = true
    },
    // 关闭弹窗
    closeEditDialog() {
      this.editDialog.config.visible = false
    },
    // 数据同步
    dataSync() {
      this.syncLoading = true
      this.$http.syncCustomerList().then(() => {
        this.$message.success('同步成功')
        this.syncLoading = false
        this.page.pageNum = 1
        this.getMemberPage()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inner-member {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
}
.operating-btn {
  display: flex;
  flex-direction: row-reverse;
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
