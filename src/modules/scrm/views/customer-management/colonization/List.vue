<template>
  <div class="xfo-page">
    <div class="xfo-search">
      <el-button
        type="primary"
        size="small"
        style="margin-right: auto; height: 32px"
        @click="$router.push('/main/scrm/customer-management/colonization/details')"
        >新建建群规则</el-button
      >
      <el-form label-width="auto" :inline="true">
        <el-form-item label="规则名称">
          <el-input v-model="search.name" size="small" placeholder="请输入规则名称" @input="searchChatRule"></el-input>
        </el-form-item>
        <el-form-item label="群名模板">
          <el-input
            v-model="search.groupNameTemplate"
            size="small"
            placeholder="请输入群名模板"
            @input="searchChatRule"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <TableList id="table" :tableData="tableData" :tableColumn="tableColumn" :tableHeight="tableHeight"></TableList>
    <TablePage :page="pageData" @sizeChange="onSizeChange" @pageChange="onPageChange"></TablePage>
  </div>
</template>

<script>
import TableList from '../../../components/components/TableList.vue'
import TablePage from '../../../components/components/TablePage.vue'
export default {
  components: {
    TableList,
    TablePage
  },
  created() {
    this.getOpenEnterpriseChatRulePage({})
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
    })
  },
  data() {
    return {
      // 搜索
      search: {
        name: '',
        groupNameTemplate: ''
      },
      // 表格数据
      tableHeight: 400,
      tableData: [],
      tableColumn: [
        {
          prop: 'name',
          title: '规则名称',
          align: 'center'
        },
        {
          prop: 'groupNameTemplate',
          title: '群名模板',
          align: 'center'
        },
        {
          prop: 'userContent',
          title: '成员',
          align: 'center'
        },
        {
          prop: 'createTime',
          title: '创建时间',
          align: 'center'
        },
        {
          prop: '',
          title: '操作',
          align: 'center',
          formatter: row => {
            return (
              <div>
                <el-button type="text" onClick={this.updateChatRule.bind(this, row.id)}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.delteChatRule.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      // 分页数据
      pageData: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      }
    }
  },
  methods: {
    /*页面渲染*/
    // 分页函数
    onSizeChange(val) {
      this.pageData.pageSize = val
      this.pageData.pageNum = 1
      this.getOpenEnterpriseChatRulePage({})
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.getOpenEnterpriseChatRulePage({})
    },
    updateChatRule(id) {
      this.$router.push({
        path: '/main/scrm/customer-management/colonization/details',
        query: {
          id
        }
      })
    },
    delteChatRule(id) {
      this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteOpenEnterpriseChatRule(id, res => {
            this.getOpenEnterpriseChatRulePage({})
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
    },
    getTableHeight() {
      this.tableHeight = window.innerHeight - document.getElementById('table').offsetTop - 160
    },
    searchChatRule() {
      this.getOpenEnterpriseChatRulePage(this.search)
    },
    /* 数据获取 */
    // 获取建群列表
    getOpenEnterpriseChatRulePage(options) {
      options.pageNum = this.pageData.pageNum
      options.pageSize = this.pageData.pageSize
      this.$http.getOpenEnterpriseChatRulePage(options).then(res => {
        this.tableData = res.data.data.list
        this.pageData.total = res.data.data.total
      })
    },
    // 删除规则
    deleteOpenEnterpriseChatRule(id, callback) {
      this.$http.deleteOpenEnterpriseChatRule({ id }).then(res => {
        if (callback) {
          callback(res)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.xfo-page {
  background-color: #fff;
  padding: 20px;
  .xfo-search {
    padding-bottom: 20px;
    align-items: center;
    display: flex;
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>