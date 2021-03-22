<template>
  <div>
    <div class="searchtop">
      <div class="topbox">
        <span style="width:130px">已离职员工</span>
        <el-input
          placeholder="请输入"
          width="200px"
          v-model="pageData.name"
          size="small"
          clearable
          @input="seachleaveList"
        ></el-input>
      </div>
      <div class="topbox">
        <span style="width:75px">离职日期</span>
        <el-date-picker
          @input="getDatePicker"
          v-model="value"
          clearable
          size="small"
          format="yyyy-MM-dd"
          type="datetimerange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <!-- <el-button type="primary" size="small" style='margin-left:10px' @click='seachleaveList'>查询</el-button>
      <el-button  size="small" style='margin-left:10px' @click='reset'>重置</el-button> -->
    </div>
    <div class="centerbox">
      <div style="display:flex;justify-content:space-between">
        <div style="display:flex;">
          <h1>离职继承</h1>
          <span
            style="color:#999;font-size:14px;margin-top:2px;margin-left:10px;border-left:3px solid #294A7B;padding-left:10px"
            >从通讯录将离职员工删除后，可以分配他的客户及客户群给其他员工继续跟进</span
          >
        </div>
        <!-- <div>
          <el-button type="text" @click="goForm">已分配的离职员工</el-button>
          <el-button type="primary">分配给其他员工</el-button>
        </div> -->
      </div>
      <!-- <div class='staffnum'>
        <div>从通讯录将离职员工删除后，可以分配他的客户及客户群给其他员工继续跟进，且客户及客户群信息也一并给接替的员工。</div>
      </div> -->
      <el-table
        :data="stafflist"
        :slot="`empty`"
        stripe
        id="table"
        ref="multipleTable"
        :height="height + 'px'"
        style="width:100%;margin-top:30px;"
      >
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
        <el-table-column prop="name" label="已离职员工" align="center"></el-table-column>
        <el-table-column prop="deptName" label="所属部门" align="center"> </el-table-column>
        <!-- <el-table-column prop="holdCustomer" label="持有客户数" width="140" align="center"> </el-table-column>
        <el-table-column prop="holdGroup" label="持有群数" width="140" align="center"> </el-table-column> -->
        <el-table-column prop="unallocatedCustomer" label="待分配客户数" align="center"> </el-table-column>
        <el-table-column prop="unallocatedGroup" label="待分配群聊数" align="center"> </el-table-column>
        <el-table-column prop="time" label="离职时间" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="godetail(scope.row)">明细</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page">
        <div class="pagination-count">
          <span class="count">共：{{ pageData.total }}&nbsp;条数据</span>
        </div>
        <el-pagination
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-sizes="[15, 30, 50]"
          :page-size="pageData.pageSize"
          :current-page="pageData.pageNum"
          :total="pageData.total"
          layout="prev, pager, next, sizes"
          background
          style="margin-right: -26px"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: '',
      pageData: {
        pageSize: 15,
        pageNum: 1,
        total: 0,
        name: '',
        startTime: '',
        endTime: ''
      },
      value: '',
      stafflist: []
    }
  },
  created() {
    this.getdimission()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  },
  methods: {
    // 离职员工列表
    getdimission() {
      this.$http.getLeaveOffice(this.pageData).then((res) => {
        this.stafflist = res.data.data.list
        this.stafflist.forEach((item) => {
          item.time = item.resignTime.slice(0, 16)
        })
        this.pageData.total = res.data.data.total
        console.log(this.stafflist)
      })
    },
    // 查看明细
    godetail(row) {
      this.$openNewPage({path: 
        './leaveDetail?quitRecordId=' + row.quitRecordId + '&name=' + row.name + '&deptName=' + row.deptName
      })
    },
    // 时间
    getDatePicker(e) {
      if (e) {
        this.pageData.startTime = e[0]
        this.pageData.endTime = e[1]
      } else {
        this.pageData.startTime = ''
        this.pageData.endTime = ''
      }
      this.seachleaveList()
    },
    // 查询
    seachleaveList() {
      this.getdimission()
    },
    // 重置
    reset() {
      this.pageData.name = ''
      this.pageData.startTime = ''
      this.pageData.endTime = ''
      this.value = ''
      this.getdimission()
    },
    goForm() {
      this.$router.push('./Form')
    },
    // 分页
    onSizeChange(val) {
      this.pageData.pageSize = val
      this.getPosterList(this.searchData.name, this.tagId)
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.getPosterList(this.searchData.name, this.tagId)
    },
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.height =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px 15px;
  .pagination-count {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #7b7b7b;
    .count {
      margin-right: 20px;
    }
  }
}
.staffnum {
  background: rgba(65, 133, 244, 0.1);
  border: 1px solid rgba(65, 133, 244, 0.2);
  border-radius: 3px;
  padding: 10px;
  font-size: 14px;
  // margin-top: 20px;
  // line-height: 20px;
}
.centerbox {
  background: #fff;
  margin-top: 10px;
  padding: 20px;
}

.searchtop {
  background: #fff;
  display: flex;
  padding: 20px 10px;
  justify-content: flex-start;
}
.topbox {
  display: flex;
  margin-left: 20px;
  span {
    // width: 130px;
    font-size: 14px;
    margin-top: 10px;
    color: #606266;
  }
}
</style>
