<template>
  <div class="page">
    <div class="create">
      <el-button type="primary" size="small" @click="createHistory">新建记录</el-button>
    </div>
    <div class="table-list">
      <table-list :tableHeight="tableHeight" :tableData="tableData" :tableColumn="tableColumn" id="table"></table-list>
      <table-page :page="pageData" @sizeChange="onSizeChange" @pageChange="onPageChange"></table-page>
    </div>
    <Dialog :configure="configure" height="180px" @closeDialog="closeDialog" @success="success">
      <dynamic-content-vmodel v-model="content"></dynamic-content-vmodel>
    </Dialog>
  </div>
</template>

<script>
import TablePage from '@/modules/scrm/components/components/TablePage.vue'
import TableList from '@/modules/scrm/components/components/TableList.vue'
import Dialog from '@/modules/scrm/components/components/Dialog.vue'
import DynamicContentVmodel from '@/modules/scrm/components/components/DynamicContentVmodel.vue'
export default {
  components: {
    TablePage,
    TableList,
    Dialog,
    DynamicContentVmodel
  },
  created() {
    this.pageId = this.$route.query.id
    this.getCustomerRecordList({})
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
    })
  },
  data() {
    return {
      // 页面id
      pageId: '',
      // 表格数据
      tableData: [],
      tableColumn: [
        {
          prop: 'content',
          title: '跟进内容',
          align: 'center'
        },
        {
          prop: 'createBy',
          title: '跟进人',
          align: 'center'
        },
        {
          prop: 'createTime',
          title: '跟进时间',
          align: 'center'
        },
        {
          prop: '',
          title: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.updateHistory.bind(this, row)}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteHistory.bind(this, row.id)}>
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
      },
      // 弹框数据
      configure: {
        title: '对话框',
        visible: false,
        width: '600px',
        top: '15vh'
      },
      content: '',
      tableHeight: 400,
      updateData: {},
      isUpdateFlag: false
    }
  },
  methods: {
    // ---页面渲染函数---
    getTableHeight() {
      this.tableHeight = window.innerHeight - document.getElementById('table').offsetTop - 150
    },
    // 分页函数
    onSizeChange(val) {
      this.pageData.pageSize = val
      this.pageData.pageNum = 1
      this.getCustomerRecordList({})
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.getCustomerRecordList({})
    },
    // 关闭对话框
    closeDialog() {
      this.configure.visible = false
    },
    success() {
      if (!this.content) {
        return this.$message.warning('请输入跟进内容')
      }
      if (this.isUpdateFlag) {
        this.updateData.content = this.content
        this.updateCustomerRecord(this.updateData, (res) => {
          this.$message.success('修改跟进内容成功')
          this.configure.visible = false
          this.getCustomerRecordList({})
        })
      } else {
        let options = {
          customerId: this.pageId,
          content: this.content
        }
        this.addCustomerRecord(options, (res) => {
          this.$message.success('新增跟进内容成功')
          this.configure.visible = false
          this.getCustomerRecordList({})
        })
      }
    },
    // 新建记录按钮方法
    createHistory() {
      this.configure.visible = true
      this.content = ''
      this.isUpdateFlag = false
    },
    // 修改记录按钮方法
    updateHistory(row) {
      console.log(row)
      this.updateData = row
      this.content = row.content
      this.configure.visible = true
      this.isUpdateFlag = true
    },
    // 删除记录按钮方法
    deleteHistory(id) {
      this.deteleCustomerRecord({ id }, (res) => {
        this.$confirm('此操作将永久删除该跟进记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.getCustomerRecordList({})
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      })
    },
    // ---数据获取函数---
    // 获取跟进记录
    // 类型type：0：自动，1：手动
    getCustomerRecordList(options) {
      options.pageSize = this.pageData.pageSize
      options.pageNum = this.pageData.pageNum
      options.type = 1
      options.customerId = this.pageId
      this.functions('getCustomerRecordList', options, (res) => {
        this.tableData = res.data.data.list
        this.pageData.total = res.data.data.total
        console.log(res)
      })
    },
    // 新增跟进记录
    addCustomerRecord(options, callback) {
      this.functions('addCustomerRecord', options, (res) => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 修改跟进记录
    updateCustomerRecord(options, callback) {
      this.functions('updateCustomerRecord', options, (res) => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 删除跟进记录
    deteleCustomerRecord(options, callback) {
      this.functions('deteleCustomerRecord', options, (res) => {
        if (callback) {
          callback(res)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  box-sizing: border-box;
  .create {
    padding-bottom: 20px;
  }
}
</style>
