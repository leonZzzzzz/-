<template>
  <div class="customer-colony">
    <div class="header_nav"
      style="margin-bottom:15px;"
    >
      <el-button
        type="text"
        icon="el-icon-arrow-left"
        @click="$router.push(`./list`)"
      >拉新详情</el-button>
    </div>
    <div class="container">
      <div class="query-table-box">
        <el-form
          inline
          :model="searchForm"
          label-width="90px"
          label-position="left"
          size="small"
        >
          <el-form-item label="邀请人姓名">
            <el-input placeholder="输入邀请人姓名" v-model="searchForm.invitePeople" @input="searchMoments" clearable/>
          </el-form-item>
          <el-form-item label="成员姓名">
            <el-input placeholder="输入成员名称" v-model="searchForm.userName" @input="searchMoments" clearable/>
          </el-form-item>
          <el-form-item label="客户姓名">
            <el-input placeholder="输入客户名称" v-model="searchForm.custName" @input="searchMoments" clearable/>
          </el-form-item>
          <el-form-item label="加入时间">
            <el-date-picker
              v-model="searchTime"
              type="daterange"
              unlink-panels
              @change="dateChange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
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
import Tag from '../../../components/components/Tag'
export default {
  components: { ComTable, ComPagination, Tag },
  data() {
    return {
      searchTime:'',
      tableData: [],
      column: [
        {
          label: '客户头像',
          minWidth: '150px',
          align: 'center',
          formatter: row => {
            return <el-image src={row.avatar} style="width:60px;height:60px" fit="cover"></el-image>
          }
        },
        {
          label: '客户名',
          minWidth: '150px',
          align: 'center',
          prop: 'name'
        },
        {
          label: '邀请人',
          minWidth: '150px',
          align: 'center',
          prop: 'invitePeople'
        },
        {
          label: '所属成员',
          minWidth: '150px',
          align: 'center',
          prop: 'userName'
        },
        {
          label: '手机',
          minWidth: '150px',
          align: 'center',
          prop: 'mobile'
        },
        {
          label: '客户类型',
          minWidth: '150px',
          align: 'center',
          formatter: row => {
            return <div>{row.isNew?'有效客户':'无效客户'}</div>
          }
        },
        {
          label: '加入时间',
          minWidth: '150px',
          align: 'center',
          formatter: row => {
            var time = row.createTime.substring(0, row.createTime.length - 3)
            return <div>{time}</div>
          }
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
        joinStartTime: '',
        joinEndTime:'',
        custName:'',
        userName:'',
        invitePeople:''
      },
      tableHeight: 400,
      id:''
    }
  },
  created() {
    this.id=this.$route.query.id
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
        PADDING_BOTTOM_HEIGHT-100
    },
    searchMoments() {
      this.page.pageNum = 1
      this.getMomentsPage()
    },
    dateChange(e){
      if(e&&e.length>0){
        this.searchForm.joinStartTime=e[0]
        this.searchForm.joinEndTime=e[1]
      }else{
        console.log(222)
        this.searchForm.joinStartTime=''
        this.searchForm.joinEndTime=''
      }
      this.getMomentsPage()
    },
    getMomentsPage() {
      let params=Object.assign(this.page,this.searchForm)
      params.activityId=this.id,
      this.$http.getPullnewRankDetail(params).then(res => {
        this.tableData = res.data.data.list
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
    },
    timeSubString(time) {
      if (!time) {
        return
      }
      return time.substring(0, time.length - 3)
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
