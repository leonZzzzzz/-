<template>
  <div>
    <!-- 顶部导航 -->
    <div class="header_nav">
      <el-button
        type="text"
        icon="el-icon-arrow-left"
        @click="$router.go(-1)"
      >客户详情</el-button>
    </div>
    <!-- 内容 -->
    <div class="main_content">
      <!-- 顶部操作与搜索 -->
      <div class="top_search">
        <div class="search_content">
          <el-form
            :inline="true"
            size="small"
          >
            <el-form-item label="客户姓名">
              <el-input
                v-model="searchData.name"
                placeholder="请输入客户姓名"
                @input="pageSearch"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="所属成员">
              <el-input
                v-model="searchData.channel"
                placeholder="请输入所属成员"
                @input="pageSearch"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="searchData.time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                @change="pageSearch"
                clearable
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table_content">
        <el-table
          id="table"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          :height="tableHeight"
        >
          <el-table-column
            prop="avatar"
            label="头像"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <el-image
                  style="width: 44px; height: 44px"
                  :src="scope.row.avatar || defaultHearderImage"
                  fit="fill"
                ></el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="gender"
            label="性别"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.gender | genderFilters }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="channel"
            label="所属成员"
            align="center"
          > </el-table-column>timerFilters
          <!-- <el-table-column prop="updateTime" label="修改时间" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.updateTime | timerFilters }}
              </div>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.createTime | timerFilters }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="page_content">
        <com-pagination
          :page="pageData"
          @sizeChange="onSizeChange"
          @pageChange="onPageChange"
        ></com-pagination>
      </div>
    </div>
  </div>
</template>

<script>
// 分页组件
import ComPagination from '../../../components/common/ComPagination'
import _ from 'lodash'

export default {
  data() {
    return {
      // 搜索数据
      searchData: {
        name: '',
        channel: '',
        time: ''
      },
      // 分页数据
      pageData: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      // 表格数据
      tableData: [],
      tableHeight: 400,
      // 默认头像
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      // 页面id
      pageId: ''
    }
  },
  methods: {
    // ---页面渲染函数---
    // 分页函数
    onSizeChange(val) {
      this.pageData.pageSize = val
      this.pageData.pageNum = 1
      this.getCustomerList({ id: this.pageId })
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.getCustomerList({ id: this.pageId })
    },
    // 表格高度函数
    getTableHeight() {
      const otherHeight = 36 + 30 + 32 + 52
      this.tableHeight = window.innerHeight - document.querySelector('#table').offsetTop - otherHeight
    },
    // 顶部搜索函数
    pageSearch() {
      let options = {
        id: this.pageId,
        name: this.searchData.name,
        channel: this.searchData.channel,
        startTime: this.searchData.time ? this.searchData.time[0] : '',
        endTime: this.searchData.time ? this.searchData.time[1] : ''
      }
      this.getCustomerList(options)
    },
    // ---数据获取函数---
    // 获取客户列表
    getCustomerList(options) {
      options.pageNum = this.pageData.pageNum
      options.pageSize = this.pageData.pageSize
      this.$http.getCustomerList(options).then(res => {
        console.log(res)
        this.tableData = res.data.data.list
        this.pageData.total = res.data.data.total
      })
    }
  },
  components: {
    ComPagination
  },
  filters: {
    genderFilters(options) {
      if (options == 0) {
        return '未知'
      }
      if (options == 1) {
        return '男'
      }
      if (options == 2) {
        return '女'
      }
    },
    timerFilters(options) {
      if (!options) {
        return
      }
      return options.slice(0, options.length - 3)
    }
  },
  created() {
    // 获取页面id
    this.pageId = this.$route.query.id
    // 获取客户数据
    this.getCustomerList({ id: this.pageId })
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
    })
  }
}
</script>

<style lang="scss" scoped>
.main_content {
  background-color: #ffffff;
  padding: 20px;
  margin-top: 20px;
  .top_search {
    display: flex;
    width: 100%;
    .search_content {
      margin-left: auto;
      &::v-deep .el-form-item {
        margin-bottom: 0;
        margin-right: 0;
        margin-left: 20px;
      }
    }
  }
  .table_content {
    margin-top: 20px;
    text-align: left;
  }
}
</style>
