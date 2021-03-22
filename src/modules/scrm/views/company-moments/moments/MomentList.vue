<template>
  <div class="container">
    <div class="query-table-box">
      <el-button
        size="small"
        type="primary"
        @click="addMoments"
      >新增企业动态圈</el-button>
      <div class="search-content">
        <el-form
          inline
          :model="searchForm"
          label-width="100px"
          label-position="right"
          size="small"
        >
          <el-form-item label="动态内容">
            <el-input
              placeholder="请输入动态内容"
              v-model="searchForm.content"
              @input="searchMoments"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- <div class="common-table-box">
      <com-table :tableData="tableData" :column="column"></com-table>
    </div> -->
    <div class="common-table-box">
      <el-table
        :data="tableData"
        style="width: 100%"
        :height="tableHeight"
        id="table"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column
          label="动态内容"
          align="left"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.type | rowContentFilters"
              size="mini"
              style="margin-right: 10px"
            >{{
              scope.row.type | typeFilters
            }}</el-tag>
            {{ scope.row.content.length > 50 ? scope.row.content.slice(0, 50) + '...' : scope.row.content }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="附加内容" prop="type" align="center">
          <template slot-scope="scope">
            {{ scope.row.type | typeFilters }}
          </template>
        </el-table-column> -->
        <el-table-column
          label="发表成员"
          prop="userNameList"
          align="center"
          width="400px"
        >
          <template slot-scope="scope">
            <div class="member-list">
              <!-- <span v-for="(item, index) in scope.row.userNameList" :key="index"
                ><i class="el-icon-user-solid icon-user"></i>{{ item }}</span
              > -->
              <Tag
                type="light"
                v-for="(item, index) in scope.row.userNameList"
                :key="index"
              > {{ item }} </Tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="发布时间"
          prop="pushTime"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.pushTime | allTableTimefilters }}
          </template>
        </el-table-column>
        <el-table-column
          label="发布状态"
          prop="status"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.status ? '已发布' : '未发布' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="!scope.row.status"
              @click="publishMoments(scope.row.id)"
            >发布</el-button>
            <el-button
              type="text"
              v-if="!scope.row.status"
              @click="editMoments(scope.row.id)"
            >修改</el-button>
            <el-button
              type="text"
              v-if="scope.row.status"
              @click="getMomentsDetail(scope.row.id)"
            >详情</el-button>
            <el-button
              type="text"
              @click="deleteMoments(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="common-pagination">
      <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
    </div> -->
    <table-page
      :page="page"
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
    ></table-page>
  </div>
</template>

<script>
import ComTable from '../../../components/common/ComTable'
// import ComPagination from '../../../components/common/ComPagination'
import Tag from '../../../components/components/Tag'
import TablePage from '@/modules/scrm/components/components/TablePage.vue'
export default {
  components: {
    // ComTable,
    // ComPagination,
    Tag,
    TablePage
  },
  data() {
    return {
      tableData: [],
      // column: [
      //   // {
      //   //   label: '动态名称',
      //   //   minWidth: '150px',
      //   //   align: 'center',
      //   //   prop: 'title'
      //   // },
      //   {
      //     label: '动态内容',
      //     minWidth: '150px',
      //     align: 'center',
      //     formatter: row => {
      //       return <div>{row.content.length > 50 ? <div>{row.content.slice(0, 50) + '...'}</div> : row.content}</div>
      //     }
      //   },
      //   {
      //     label: '类型',
      //     minWidth: '150px',
      //     align: 'center',
      //     prop: 'typeName'
      //   },
      //   {
      //     label: '发布时间',
      //     minWidth: '150px',
      //     align: 'center',
      //     prop: 'pushTime'
      //   },
      //   {
      //     label: '发布状态',
      //     minWidth: '150px',
      //     align: 'center',
      //     formatter: row => {
      //       return <div>{row.status ? '已发布' : '未发布'}</div>
      //     }
      //   },
      //   {
      //     label: '操作',
      //     minWidth: '150px',
      //     align: 'center',
      //     fixed: 'right',
      //     formatter: row => {
      //       return (
      //         <div>
      //           {row.status ? (
      //             <div>
      //               <el-button
      //                 type="text"
      //                 onClick={() => {
      //                   this.$openNewPage({path: `/main/scrm/moments/detail?id=${row.id}`})
      //                 }}
      //               >
      //                 详情
      //               </el-button>
      //               <el-button type="text" onClick={this.deleteMoments.bind(this, row.id)}>
      //                 删除
      //               </el-button>
      //             </div>
      //           ) : (
      //             <div>
      //               <el-button type="text" onClick={this.publishMoments.bind(this, row.id)}>
      //                 发布
      //               </el-button>
      //               <el-button
      //                 type="text"
      //                 onClick={() => {
      //                   this.$openNewPage({path: `/main/scrm/moments/form?id=${row.id}`})
      //                 }}
      //               >
      //                 修改
      //               </el-button>
      //             </div>
      //           )}
      //         </div>
      //       )
      //     }
      //   }
      // ],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      searchForm: {
        content: ''
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
        PADDING_BOTTOM_HEIGHT -
        62
    },
    getMomentsPage() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        content: this.searchForm.content
      }
      this.$http.getCompMomentsPage(params).then(res => {
        this.tableData = res.data.data.list
        // this.tableData.forEach((item, index) => {
        //   console.log('列表')
        //   this.$set(this.tableData[index], 'content', this.parsingEmoji(item.content))
        // })
        this.page.total = res.data.data.total
      })
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
    addMoments() {
      this.$router.push(`/main/scrm/moments/form`)
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
      this.$openNewPage({path: `/main/scrm/moments/form?id=${id}`})
    },
    getMomentsDetail(id) {
      this.$openNewPage({path: `/main/scrm/moments/detail?id=${id}`})
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
  align-items: flex-start;
  justify-content: space-between;
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