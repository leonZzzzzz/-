<template>
  <div class="customer-colony">
    <div
      class="header_nav"
      style="margin-bottom:15px;"
    >
      <el-button
        type="text"
        icon="el-icon-arrow-left"
        @click="$router.push(`./list`)"
      >拉新排行</el-button>
    </div>
    <div class="container">
      <div class="top_nav">
        <div class="query-table-box">
          <el-form
            inline
            :model="searchForm"
            label-width="70px"
            label-position="left"
            size="small"
          >
            <el-form-item label="榜单">
              <el-select
                v-model="searchForm.type"
                clearable
                placeholder="请选择"
                @change="checkselect"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="common-table-box">
        <el-table
          :data="tableData"
          style="width: 100%"
          :height="tableHeight"
          id="table"
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column
            label="头像"
            align="center"
          >
            <template slot-scope="scope">
              <img
                style="width:50px;height:50px;"
                :src="scope.row.avatar"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="昵称"
            prop="custName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="拉新数"
            prop="qty"
            align="center"
          ></el-table-column>
          <!-- <el-table-column label="活动时间" prop="pushTime" align="center">
            <template slot-scope="scope"> {{ scope.row.startTime }} 至 {{ scope.row.endTime }} </template>
          </el-table-column> -->
          <!-- <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="addMoments(scope.row.id)"
              >详情</el-button>
              <el-button
                type="text"
                @click="deleteMoments(scope.row.id)"
              >删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div class="common-pagination">
        <com-pagination
          :page="page"
          @sizeChange="onSizeChange"
          @pageChange="onPageChange"
        ></com-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ComTable from '../../../components/common/ComTable'
import ComPagination from '../../../components/common/ComPagination'
import Tag from '../../../components/components/Tag'
export default {
  components: { ComTable, ComPagination, Tag },
  data() {
    return {
      options: [
        { label: '日榜', value: 'day' },
        { label: '周榜', value: 'week' },
        { label: '月榜', value: 'month' },
        { label: '总榜', value: 'total' }
      ],
      tableData: [],
      column: [
        {
          label: '客户名',
          minWidth: '150px',
          align: 'center',
          prop: 'custName'
        },
        {
          label: '客户',
          minWidth: '150px',
          align: 'center',
          formatter: row => {
            return <el-image src={this.imgHost + row.avatar} style="width:60px;height:60px" fit="cover"></el-image>
          }
        },
        {
          label: '邀请数量',
          minWidth: '150px',
          align: 'center',
          prop: 'qty'
        }
        // {
        //   label: '操作',
        //   minWidth: '150px',
        //   align: 'center',
        //   fixed: 'right',
        //   formatter: (row) => {
        //     return (
        //       <div>
        //         <el-button type="text" onClick={this.publishMoments.bind(this, row.id)}>
        //           发布
        //         </el-button>
        //         <el-button
        //           type="text"
        //           onClick={() => {
        //             this.$router.push(`/main/scrm/moments/form?id=${row.id}`)
        //           }}
        //         >
        //           修改
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
      searchForm: {
        type: 'total'
      },
      tableHeight: 400
    }
  },
  created() {
    this.getMomentsPage()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  },
  destroyed() {
    window.onresize = ''
  },
  methods: {
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_TOP_HEIGHT = 20,
        PADDING_BOTTOM_HEIGHT = 20
      this.tableHeight =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_TOP_HEIGHT -
        PADDING_BOTTOM_HEIGHT
    },
    getMomentsPage() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        type: this.searchForm.type
      }
      this.$http.getPullnewRank(params).then(res => {
        this.tableData = res.data.data
        this.page.total = res.data.data.total
      })
    },
    checkselect(e){
      console.log(e)
      this.searchForm.type=e
      this.getMomentsPage()
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getMomentsPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getMomentsPage()
    },
    addMoments(id) {
      console.log(id)
      if (id) {
        this.$router.push(`./detail?id=${id}`)
      } else {
        this.$router.push(`./detail`)
      }
    },
    deleteMoments(id) {
      this.$confirm('是否删除该动态？删除后，已发布动态圈的该条动态也会被删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteCompMoments({ id }).then(() => {
          this.$message.success('删除成功')
          this.getMomentsPage()
        })
      })
    },
    publishMoments(id) {
      this.$http.publishCompMoments({ id }).then(() => {
        this.$message.success('发布成功')
        this.getMomentsPage()
      })
    },
    searchMoments() {
      this.page.pageNum = 1
      this.getMomentsPage()
    },
    editMoments(id) {
      this.$router.push(`/main/scrm/moments/form?id=${id}`)
    },
    getMomentsDetail(id) {
      this.$router.push(`/main/scrm/moments/detail?id=${id}`)
    }
  },
  filters: {
    typeFilters(option) {
      if (option == 1) {
        return '图片'
      }
      if (option == 2) {
        return '视频'
      }
      if (option == 3) {
        return '图文链接'
      }
      return '文本'
    },
    rowContentFilters(option) {
      if (option == 1) {
        return ''
      }
      if (option == 3) {
        return 'warning'
      }
      if (option == 2) {
        return 'success'
      }
      return 'info'
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
}
.query-table-box {
  display: flex;
  // align-items: flex-start;
  // justify-content: space-between;
  margin-bottom: 20px;
  .search-content {
    display: flex;
    align-items: center;
    .search-label {
      margin-right: 10px;
      font-size: 14px;
      color: #606266;
    }
    .search-input {
      width: 250px;
      margin-right: 10px;
    }
  }
}
.common-table-box {
  .member-list {
    span {
      display: inline-block;
      border: 1px solid #dcdfe6;
      padding: 2px 5px;
      margin: 0 8px 7px 0;
      border-radius: 3px;
      .icon-user {
        color: #294a7b;
      }
    }
  }
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
</style>
