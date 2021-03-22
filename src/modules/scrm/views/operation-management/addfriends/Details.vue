<template>
  <div class="addfriends_details">
    <div class="topNav">
      <!-- <el-button type="text" icon="el-icon-arrow-left" @back="goBack">返回</el-button> -->
      <!-- <el-page-header @back="goBack" content="详情"> </el-page-header> -->
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">详情</el-button>
    </div>
    <div class="search">
      <div class="search_content">
        <ul>
          <li>
            <div class="title">企业成员</div>
            <div class="inp">
              <el-select v-model="list.userId" placeholder="请选择企业成员" clearable @change="searchListFun">
                <el-option v-for="item in nameOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </div>
          </li>
          <li>
            <div class="title">客户姓名</div>
            <div class="inp">
              <el-input
                v-model="list.customerName"
                placeholder="请输入客户姓名"
                clearable
                @input="searchListFun"
              ></el-input>
            </div>
          </li>
          <li>
            <div class="title">手机号码</div>
            <div class="inp">
              <el-input v-model="list.mobile" placeholder="请输入手机号码" clearable @input="searchListFun"></el-input>
            </div>
          </li>
          <!-- <li>
            <el-button type="primary" size="small" @click="searchListFun">查询</el-button>
          </li> -->
        </ul>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        id="table"
        style="width: 100%"
        v-loading="isLoading"
        :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
        :height="height"
      >
        <el-table-column prop="customerName" label="客户姓名" align="center"> </el-table-column>
        <el-table-column prop="userName" label="企业成员" align="center"> </el-table-column>
        <el-table-column prop="mobile" label="客户手机" align="center"> </el-table-column>
        <el-table-column prop="statusName" label="添加状态" align="center">
          <template slot-scope="scope">
            <div :class="{ red: scope.row.statusName == '未添加' }">
              {{ scope.row.statusName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="isCopied" label="复制状态" align="center">
          <template slot-scope="scope">
            <div :class="{ red: !scope.row.isCopied }">
              {{ scope.row.isCopied ? '已复制' : '未复制' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="copyTime" label="复制时间" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.copyTime | allTableTimefilters }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="friendTime" label="成功添加时间" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.friendTime | allTableTimefilters }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.createTime | allTableTimefilters }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <div class="pagination-count">
        <span class="count">共：{{ search.total }}&nbsp;条数据</span>
      </div>
      <el-pagination
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-sizes="[15, 30, 50]"
        :page-size="search.pageSize"
        :current-page="search.pageNum"
        :total="search.total"
        layout="prev, pager, next, sizes"
        background
        style="margin-right: -26px"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      friendId: '',
      tableData: [],
      list: {
        userId: '',
        mobile: '',
        customerName: ''
      },
      isLoading: true,
      nameOptions: [],
      search: {
        pageSize: 15,
        pageNum: 1,
        total: 0
      },
      height: 400
    }
  },
  methods: {
    // ---页面渲染函数---
    // 分页
    onSizeChange(val) {
      this.search.pageSize = val
      this.addFriendPageDetails({ friendId: this.friendId })
    },
    onPageChange(val) {
      this.search.pageNum = val
      this.addFriendPageDetails({ friendId: this.friendId })
    },
    searchListFun() {
      this.addFriendPageDetails({
        friendId: this.friendId,
        userId: this.list.userId,
        customerName: this.list.customerName,
        mobile: this.list.mobile
      })
    },
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 76,
        PAGINATION_HEIGHT = 52
      this.height =
        window.innerHeight - document.querySelector('#table').offsetTop - TOP_HEADER_HEIGHT - PAGINATION_HEIGHT - 10
    },
    goBack() {
      this.$openNewPageBack()
    },
    // ---获取数据函数---
    addFriendPageDetails(options) {
      this.isLoading = true
      options.pageSize = this.search.pageSize
      options.pageNum = this.search.pageNum
      this.$http.addFriendPageDetails(options).then((res) => {
        console.log(res)
        this.tableData = res.data.data.list
        this.search.total = res.data.data.total
        this.isLoading = false
      })
    },
    getTree() {
      this.$http.getTree().then((res) => {
        console.log('树', res)
        let list = res.data.data[0].userList
        list.forEach((item) => {
          this.nameOptions.push({ id: item.id, name: item.name })
        })
        console.log(this.nameOptions)
      })
    }
  },
  created() {
    console.log('进入了详情')
    this.friendId = this.$route.query.id
    this.addFriendPageDetails({ friendId: this.friendId })
    this.getTree()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  }
}
</script>

<style lang="scss" scoped>
.addfriends_details {
  .topNav {
    margin-bottom: 20px;
  }
  .search {
    background-color: #ffffff;
    padding: 20px;
    display: flex;
    min-height: 36px;
    .search_content {
      margin-left: auto;
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          height: 36px;
          display: flex;
          align-items: center;
          font-size: 14px;
          margin-left: 20px;
          .title {
            text-align: right;
            color: #606266;
            margin-right: 10px;
          }
        }
      }
    }
    .search_btns {
      display: flex;
      align-items: center;
    }
  }
  .table {
    background-color: #ffffff;
    padding: 0 20px;
  }
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
  // 颜色
  .red {
    color: #f56c6c;
  }
}
</style>
