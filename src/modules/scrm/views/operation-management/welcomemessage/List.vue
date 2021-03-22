<template>
  <div>
    <div class="main_content">
      <el-alert
        title="因企业微信限制，客户添加后只能发送一次欢迎语，如果在企业微信后台有设置欢迎语的话，企业微信会默认发送企业微信后台的欢迎语，小数桔的欢迎语将会失效。
如果您在小数桔设置的欢迎语没有生效，可登录【企业微信后台】，打开客户联系-配置-欢迎语，查看是否有设置欢迎语"
        type="warning"
        show-icon
        :closable="false"
        style="margin-bottom:20px"
      >
      </el-alert>
      <!-- 顶部操作与搜索 -->
      <div class="top_search">
        <el-button
          type="primary"
          size="small"
          @click="$openNewPage({path: '/main/scrm/operation-management/welcomemessage/details'})"
        >新建欢迎语</el-button>
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
            prop="message"
            label="消息内容"
            width="400"
          >
            <template slot-scope="scope">
              <div class="message_content">
                <el-tag
                  :type="scope.row.type | rowContentFilters"
                  size="mini"
                  style="margin-right: 10px"
                >{{
                  scope.row.type | rowMessageFilters
                }}</el-tag>{{ scope.row.message }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="userNameList"
            label="使用成员"
            width="400"
            align="center"
          >
            <template slot-scope="scope">
              <div class="tagname-form">
                <span
                  class="tagName"
                  v-for="(item, index) in scope.row.userNameList"
                  :key="index"
                ><i class="el-icon-user-solid icon-user"></i>{{ item }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            align="center"
          >
            <template slot-scope="scope">
              {{ (scope.row.updateTime ? scope.row.updateTime : scope.row.createTime) | allTableTimefilters }}
            </template>
          </el-table-column>
          <el-table-column
            prop="isEnabled"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.isEnabled ? '启用' : '停用' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="avatar"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$openNewPage({path: '/main/scrm/operation-management/welcomemessage/details?id=' + scope.row.id})"
              >修改</el-button>
              <el-button
                type="text"
                @click="deleteUserWelcome(scope.row.id)"
              >删除</el-button>
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
    <!-- <WelcomeMessage></WelcomeMessage> -->
  </div>
</template>

<script>
// 分页组件
import ComPagination from '../../../components/common/ComPagination'
import Emotion from '../../../components/common/Emotion'
import loginMixin from '@/mixins/loginMixin'
import WelcomeMessage from '../../../components/common/WelcomeMessage'
export default {
  data() {
    return {
      // 分页数据
      pageData: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      // 表格数据
      tableData: [],
      tableHeight: 400,
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
      this.getWelcomePage({})
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.getWelcomePage({})
    },
    // 表格高度函数
    getTableHeight() {
      const otherHeight = 36 + 30 + 30 + 52
      this.tableHeight = window.innerHeight - document.querySelector('#table').offsetTop - otherHeight
    },
    // ---数据获取函数---
    // 获取欢迎语列表
    getWelcomePage(options) {
      options.pageNum = this.pageData.pageNum
      options.pageSize = this.pageData.pageSize
      this.$http.getWelcomePage(options).then(res => {
        console.log(res)
        this.tableData = res.data.data.list
        this.pageData.total = res.data.data.total
      })
    },
    // 删除欢迎语
    deleteUserWelcome(id) {
      this.$confirm('此操作将永久删除该欢迎语, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteUserWelcome({ id }).then(res => {
            this.getWelcomePage({})
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  components: {
    ComPagination,
    Emotion,
    WelcomeMessage
  },
  filters: {
    rowContentFilters(option) {
      if (option == 'text') {
        return 'info'
      }
      if (option == 'image') {
        return ''
      }
      if (option == 'image_text') {
        return 'warning'
      }
      if (option == 'program') {
        return 'success'
      }
      if (option == 'business_card') {
        return 'danger'
      }
    },
    rowMessageFilters(option) {
      if (option == 'text') {
        return '文本'
      }
      if (option == 'image') {
        return '图片'
      }
      if (option == 'image_text') {
        return '图文'
      }
      if (option == 'program') {
        return '小程序'
      }
      if (option == 'business_card') {
        return '名片'
      }
      if (option == 'rolling_lottery') {
        return '抽奖'
      }
    }
  },
  created() {
    // 获取欢迎语列表
    this.getWelcomePage({})
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
  .table_content {
    margin-top: 20px;
    text-align: left;
    .tagname-form {
      min-height: 60px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      .tagName {
        display: inline-block;
        border: 1px solid #dcdfe6;
        padding: 2px 5px;
        cursor: pointer;
        margin: 8px 8px 7px 0;
        margin-right: 8px;
        margin-bottom: 7px;
        border-radius: 3px;
      }
    }
  }
}
::v-deep .el-alert__icon {
  font-size: 20px;
  width: 20px;
}
::v-deep .el-alert__title {
  font-size: 14px;
  line-height: 20px;
}
</style>
