<template>
  <div class="container">
    <div class="query-table-box">
      <div>
        <el-button
          size="small"
          type="primary"
          @click="addMoments('')"
        >新增拉新活动</el-button>
        <el-button
          size="small"
          @click="$router.push('./among')"
        >查看拉新排行</el-button>
        <el-button
          size="small"
          @click="copyMobile(`${BASEURL}/scrm/#/pullnewpeople/pond`)"
        >复制拉新活动链接</el-button>
      </div>
      <div class="search-content">
        <el-form inline :model="searchForm" label-width="100px" label-position="right" size="small">
          <el-form-item label="活动时间">
            <el-date-picker
              v-model="searchTime"
              type="daterange"
              unlink-panels
              @change="searchMoments"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <!-- <el-input placeholder="请输入标题" v-model="searchForm.startTime" @input="searchMoments"></el-input> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- <div class="common-table-box">
      <com-table :tableData="tableData" :column="column"></com-table>
    </div> -->
    <tab-button position="left" :navList="navList" @change="changeNav"></tab-button>
    <!-- <div> -->
      <div class="common-table-box">
       <el-table
          :data="tableData"
          width="100%"
          id="table"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          :height="tableHeight"
        >
          <el-table-column label="标题" prop="title" align="center"> </el-table-column>
          <el-table-column label="海报" align="center">
            <template slot-scope="scope">
              <div style="width:50px;height:50px;overflow:hidden;margin:0 auto"><img :src="imageurl+scope.row.link" alt="" width="60" height="60" style="margin-left:-5px;margin-top:-5px" /></div>
            </template>
          </el-table-column>
          <el-table-column label="拉新数" prop="newCustCount" align="center"> </el-table-column>
          <el-table-column label="活动状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status=='notStart'">未开始</span>
              <span v-if="scope.row.status=='onGoing'">进行中</span>
              <span v-if="scope.row.status=='over'">已结束</span>
            </template>
          </el-table-column>
          <el-table-column label="活动时间" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type=='effective'">长期有效</span>
              <span v-else>{{scope.row.startTime}} 至 {{scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class="caozuo-column">
            <template slot-scope="scope">
              <el-button type="text" @click="pullNewPeople(scope.row.id)">拉新详情</el-button>
              <el-button type="text" @click="addMoments(scope.row.id)">修改</el-button>
              <el-button type="text" @click="deleteMoments(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    <!-- </div> -->
    <!-- <div class="common-pagination">
      <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
    </div> -->
  </div>
</template>

<script>
import { BASEURL } from '@/utils/config'
import ComTable from '../../../components/common/ComTable'
import ComPagination from '../../../components/common/ComPagination'
import Tag from '../../../components/components/Tag'
import TabButton from '@/modules/scrm/components/components/TabButton.vue'
export default {
  components: { ComTable, ComPagination, Tag,TabButton },
  data() {
    return {
      navList:[
        { name: '未开始', isActive: false },
        { name: '进行中', isActive: true },
        { name: '已结束', isActive: false }
      ],
      searchTime:'',
      imageurl:'http://athena-1255600302.cosgz.myqcloud.com',
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      searchForm: {
        startTime: '',
        endTime:'',
        status:'onGoing'
      },
      column: [
        {
          label: '标题',
          align: 'center',
          prop: 'title'
        },
        {
          label: '海报',
          align: 'center',
          formatter: (row) => {
            return <div style="width:50px;height:50px;overflow:hidden;margin:0 auto"><img src={this.imageurl+row.link} alt="" width="60" height="60" style="margin-left:-5px;margin-top:-5px" /></div>
          }
        },
        {
          label: '拉新数',
          align: 'center',
          prop: 'newCustCount'
        },
        {
          label: '活动状态',
          align: 'center',
          prop:'status',
          formatter: (row) => {
            return {
              'notStart':'未开始',
              'onGoing': '进行中',
              'over':'已结束'
            }[row.status]
          }
        },
        {
          label: '活动时间',
          align: 'center',
          formatter: (row) => {
            return  (
              row.type=='effective'?
              <div>长期有效</div>:
              <div>{row.startTime} 至 {row.endTime}</div>
            )
          }
        },
        {
          label: '操作',
          align: 'center',
          fixed: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.pullNewPeople.bind(this, row.id)}>
                  拉新详情
                </el-button>
                <el-button type="text" onClick={this.addMoments.bind(this, row.id)}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteMoments.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      tableHeight: 400,
      BASEURL: BASEURL,
      activeName:'first'
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
    changeNav(index) {
      // this.navIndex = index
      this.searchForm={
        startTime: '',
        endTime:'',
      }
      this.searchTime=''
      if (index == 0) {
        this.searchForm.status='notStart'
      }
      if (index == 1) {
        this.searchForm.status = 'onGoing'
      }
      if (index == 2) {
        this.searchForm.status = 'over'
      }
      this.getMomentsPage()
    },
    // 复制内容
    copyMobile(link) {
      console.log(link)
      this.$copyText(link)
        .then(res => {
          this.$message.success('复制成功')
        })
        .catch(err => {
          this.$message.success('复制失败')
        })
    },
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
    // 拉新详情
    pullNewPeople(id){
      this.$openNewPage({path: `./pullNewDetail?id=${id}`})
    },
    getMomentsPage() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        startTime: this.searchForm.startTime,
        endTime: this.searchForm.endTime,
        status:this.searchForm.status,
      }
      this.$http.PullNewCouponList(params).then(res => {
        this.tableData = res.data.data.list
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
    addMoments(id) {
      console.log(id)
      if (id) {
        this.$openNewPage({path: `./detail?id=${id}`})
      } else {
        this.$openNewPage({path: `./detail`})
      }
    },
    deleteMoments(id) {
      this.$confirm('确定删除该活动吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.pullDeleteCoupon({ id }).then(() => {
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
    searchMoments(e) {
      if(e&&e.length>0){
        this.searchForm.startTime=e[0]
        this.searchForm.endTime=e[1]
      }else{
        this.searchForm.startTime=''
        this.searchForm.endTime=''
      }
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
  // background-color: #ffffff;
  // padding: 20px;
  box-sizing: border-box;
}
.query-table-box {
  background: #fff;
  padding-top: 20px;
  padding-left: 20px;
  margin-bottom: 20px;
  display: flex;
  // align-items: flex-start;
  justify-content: space-between;
  // margin-bottom: 20px;
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
  background: #fff;
  padding: 10px;
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
