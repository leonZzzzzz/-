<template>
  <div>
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">详情</el-button>
    </div>
    <!-- 内容中心 -->
    <div class="main_content">
      <!-- 群资料 -->
      <div class="title">群资料</div>
      <div class="group_data">
        <el-form class="form" label-width="82px" label-position="left">
          <el-form-item label="群名称：">
            <div class="form_item">{{ groupDataFormData.name }}</div>
          </el-form-item>
          <el-form-item label="群主：">
            <div class="form_item">{{ groupDataFormData.owner }}</div>
          </el-form-item>
          <el-form-item label="群人数：">
            <div class="form_item">{{ groupDataFormData.quantity }}</div>
          </el-form-item>
          <el-form-item label="创建时间：">
            <div class="form_item">{{ groupDataFormData.createTime }}</div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 群成员 -->
      <div class="title">群成员</div>
      <div class="group_members">
        <el-table
          :data="GroupMembersTableData"
          :height="tableHeight"
          id="table"
          v-loading="isLoading"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
        >
          <el-table-column prop="userAvatar" label="头像" align="center">
            <template slot-scope="scope">
              <div>
                <el-image
                  style="width: 44px; height: 44px"
                  :src="scope.row.userAvatar || defaultHearderImage"
                  fit="fill"
                ></el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="姓名" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.type == 1 ? scope.row.userName : '非企微客户' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="身份" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.type == 1 ? '内部人员' : '外部人员' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.status == 'in' ? '在群' : '已退群' }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="height: 52px"></div>
      </div>
    </div>
  </div>
</template>
<script>
// 分页组件
import ComPagination from '../../../components/common/ComPagination'
export default {
  data() {
    return {
      // 导航列表
      navList: [
        {
          name: '群成员',
          isActive: true
        },
        {
          name: '群资料',
          isActive: false
        }
      ],
      // 内容显示开关
      isShowGroupMembers: true,
      // 表格高度
      tableHeight: 400,
      // 页面id
      pageId: '',
      groupMembersId: '',
      // ------ 群成员数据
      // 表格数据
      GroupMembersTableData: [],
      // 表格加载
      isLoading: false,
      // 分页数据
      GroupMembersPageData: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      // ------ 群资料数据
      groupDataFormData: {}
    }
  },
  methods: {
    // ---页面渲染函数---
    // 切换导航
    changeNavBarFun(index) {
      if (this.navList[index].isActive) {
        return
      }
      for (var i = 0; i < this.navList.length; i++) {
        this.navList[i].isActive = false
      }
      this.navList[index].isActive = true
      this.isShowGroupMembers = !this.isShowGroupMembers
    },
    // 获取表格高度函数
    getTableHeight() {
      const OTHERHEIGHT = 56 + 52 + 20 + 8
      this.tableHeight = window.innerHeight - OTHERHEIGHT - document.querySelector('#table').offsetTop
      let table = document.querySelector('.el-table__body-wrapper')
      console.log(table)
      table.addEventListener('scroll', () => {
        console.log('aaa',table.scrollTop ,table.scrollHeight)
        if (table.scrollTop >= table.scrollHeight) {
          console.log('bbb')
          this.GroupMembersPageData.pageSize += 20
          this.getPageCustomerList({ chatId: this.groupMembersId })
        }
      })
    },
    // ------ 群成员方法
    // 分页函数
    onGroupMembersSizeChange(val) {
      this.GroupMembersPageData.pageSize = val
      this.GroupMembersPageData.pageNum = 1
    },
    onGroupMembersPageChange(val) {
      this.GroupMembersPageData.pageNum = val
    },
    // ------ 群资料方法
    // ---获取数据函数---
    // 获取群成员列表
    getPageCustomerList(options) {
      this.isLoading = true
      options.pageSize = this.GroupMembersPageData.pageSize
      options.pageNum = 1
      this.$http.getPageCustomerList(options).then(res => {
        console.log('666', res)
        this.GroupMembersTableData = res.data.data
        this.isLoading = false
      })
    },
    // 获取群资料
    getCustomerColonyDetail(options) {
      this.$http.getCustomerColonyDetail(options).then(res => {
        console.log('群资料', res)
        this.groupDataFormData = res.data.data
      })
    }
  },
  components: {
    ComPagination
  },
  created() {
    this.pageId = this.$route.query.id
    this.groupMembersId = this.$route.query.chatId
    this.getPageCustomerList({ chatId: this.groupMembersId })
    this.getCustomerColonyDetail({ id: this.pageId })
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
    })
  }
}
</script>

<style lang="scss" scoped>
.header_nav {
  margin-bottom: 20px;
}
.top_nav {
  width: 100%;
  height: 44px;
  // background-color: #F5F5F5;
  display: flex;
  ul {
    display: flex;
    background-color: #ffffff;
    background-image: linear-gradient(to bottom, #ebeef5, #ffffff);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
    li {
      width: 120px;
      height: 44px;
      text-align: center;
      line-height: 44px;
      background-color: #ebeef5;
      font-size: 14px;
      user-select: none;
      // border-radius: 20px;
      cursor: pointer;
      &.active {
        border-radius: 0px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: #ffffff;
      }
      &.borderLeft {
        border-bottom-left-radius: 10px;
      }
      &.borderRight {
        border-bottom-right-radius: 10px;
      }
    }
  }
}
.main_content {
  background-color: #ffffff;
  padding: 20px 20px 0;
  .group_data {
    .form {
      box-sizing: border-box;
      .form_item {
        font-size: 14px;
        color: #606266;
        border-bottom: 1px solid #ebeef5;
        width: 800px;
        text-indent: 2em;
      }
      .el-form-item {
        margin-bottom: 14px;
      }
    }
  }
  .title {
    font-size: 16px;
    color: #606266;
    padding-bottom: 20px;
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 8px;
      height: 20px;
      background-color: #294a7b;
      position: absolute;
      left: -20px;
      top: -2px;
    }
  }
}
</style>
