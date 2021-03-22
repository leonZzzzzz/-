<template>
  <div class="grouping-detail">
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">分组详情</el-button>
    </div>
    <div class="container">
      <div class="g-module">
        <div class="operating-group">
          <div class="base-btn">
            <el-button type="primary" size="small" @click="editDialog.config.visible = true">编辑</el-button>
          </div>
        </div>
        <div class="grouping-msg">
          <div class="msg-label">分组名称：</div>
          <div class="msg-desc">{{ groupData.name }}</div>
        </div>
        <div class="grouping-msg">
          <div class="msg-label">分组备注：</div>
          <div class="msg-desc">{{ groupData.describe }}</div>
        </div>
        <div class="grouping-msg">
          <div class="msg-label">添加时间：</div>
          <div class="msg-desc">{{ groupData.createTime }}</div>
        </div>
      </div>
      <div class="g-module customer-list-module">
        <div class="query-table">
          <div class="query-table-right">
            <el-button size="small" type="primary" @click="showSelectionCustomerList">添加客户</el-button>
            <div class="customer-total" style="margin-left: 10px">
              客户总数：<span>{{ customerPage.total }}</span>
            </div>
          </div>
          <div class="query-table-left">
            <div class="search-input" style="display: flex">
              <div class="name" style="width: 100px; line-height: 32px; color: #606266">客户名称</div>
              <el-input
                size="small"
                placeholder="输入客户名称"
                v-model="customerSearchContent"
                clearable
                @input="customerSearch"
              >
              </el-input>
            </div>
            <!-- <el-button size="small" type="info" @click="refreshCustomerList">&nbsp;&nbsp;重置&nbsp;&nbsp;</el-button> -->
          </div>
        </div>
        <div class="common-table-box">
          <com-table :tableData="tableData" :column="column"></com-table>
        </div>
        <div class="common-pagination">
          <com-pagination :page="customerPage" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>
      </div>
    </div>
    <com-dialog :config="editDialog.config" @closeDialog="editDialog.config.visible = false">
      <div class="edit-content">
        <el-form :model="groupForm" :rules="rules" ref="groupModel" label-position="right" label-width="auto">
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="groupForm.name" placeholder="请输入分组名称" clearable> </el-input>
          </el-form-item>
          <el-form-item label="分组备注" prop="describe">
            <el-input v-model="groupForm.describe" placeholder="请输入分组备注" clearable> </el-input> </el-form-item
          ><el-form-item label="排序号" prop="sequence">
            <el-input type="number" v-model="groupForm.sequence" placeholder="请输入排序号"> </el-input>
          </el-form-item>
        </el-form>
        <div class="submit_btn" style="display: flex; justify-content: flex-end">
          <el-button @click="editDialog.config.visible = false">取消</el-button>
          <el-button type="primary" @click="editBaseInfo()">确定</el-button>
        </div>
      </div>
    </com-dialog>
    <com-dialog :config="addDialog.config" @closeDialog="closeAddDialog">
      <div class="add-content">
        <div class="query-table" style="display: flex;justify-content: flex-end">
          <div class="query-table-left">
            <div class="search-input" style="display: flex">
              <div class="name" style="width: 100px; line-height: 32px; color: #606266">客户名称</div>
              <el-input
                size="small"
                placeholder="输入客户名称"
                v-model="selectionSearchContent"
                @input="selectionSearch"
                clearable
              >
              </el-input>
            </div>
          </div>
        </div>
        <div class="selection-table">
          <el-table
            ref="multipleTable"
            :data="selectionData"
            style="width: 100%"
            height="400"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              v-for="(item, index) in selectionColumn"
              :key="index"
              v-bind="item"
              :reserve-selection="true"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="selection-pagination">
          <com-pagination
            :page="selectionPage"
            @sizeChange="onSelectionSizeChange"
            @pageChange="onSelectionPageChange"
          ></com-pagination>
        </div>
        <div class="submit_btn" style="display: flex; justify-content: flex-end;margin-top:20px">
          <el-button @click="closeAddDialog">取消</el-button>
          <el-button type="primary" @click="submitSelectionData()">确定</el-button>
        </div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComTable from '../../../components/common/ComTable'
import ComDialog from '../../../components/common/ComDialog'
import ComPagination from '../../../components/common/ComPagination'
import Utils from '../../../utils/utils'
export default {
  components: { ComTable, ComDialog, ComPagination },
  data() {
    let nameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入名称'))
      } else {
        callback()
      }
    }
    // let describeValidator = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入备注'))
    //   } else {
    //     callback()
    //   }
    // }
    // let sequenceValidator = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入排序号'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      groupForm: {},
      rules: {
        name: [{ required: true, validator: nameValidator, trigger: 'blur' }]
        // describe: [
        //   { required: true, validator: describeValidator, trigger: 'blur' }
        // ],
        // sequence: [
        //   { required: true, validator: sequenceValidator, trigger: 'blur' }
        // ]
      },
      groupId: '',
      groupData: {},
      tableData: [],
      column: [
        // {
        //   type: 'index',
        //   label: '序号',
        //   align: 'center',
        //   width: '100px'
        // },
        {
          label: '姓名',
          align: 'center',
          minWidth: '150px',
          prop: 'name'
        },
        {
          label: '头像',
          align: 'center',
          minWidth: '150px',
          prop: 'avatar',
          formatter: (row) => {
            return <img src={row.avatar} alt="" width="44" height="44" />
          }
        },
        {
          label: '性别',
          align: 'center',
          minWidth: '150px',
          prop: 'genderName'
        },
        {
          label: '操作',
          align: 'center',
          minWidth: '150px',
          fixed: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.removeCustomer.bind(this, row)}>
                  移除该客户
                </el-button>
              </div>
            )
          }
        }
      ],
      customerPage: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      customerSearchContent: '',
      editDialog: {
        config: {
          width: '600px',
          title: '编辑基础信息',
          visible: false
        }
      },
      addDialog: {
        config: {
          width: '900px',
          title: '添加客户',
          visible: false
        }
      },
      selectionData: [],
      selectionColumn: [
        {
          type: 'selection',
          align: 'center',
          width: '55px'
        },
        {
          label: '姓名',
          align: 'center',
          minWidth: '120px',
          prop: 'name'
        },
        {
          label: '头像',
          align: 'center',
          minWidth: '120px',
          prop: 'avatar',
          formatter: (row) => {
            return <img src={row.avatar} alt="" width="44" height="44" />
          }
        },
        {
          label: '性别',
          align: 'center',
          minWidth: '120px',
          prop: 'genderName'
        },
        {
          label: '创建时间',
          align: 'center',
          minWidth: '120px',
          prop: 'createTime'
        },
        {
          label: '更新时间',
          align: 'center',
          minWidth: '120px',
          prop: 'updateTime'
        }
      ],
      selectionPage: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      selectionSearchContent: '',
      multipleSelection: [],
      // 获取row的key值
      getRowKeys(row) {
        return row.id
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.groupId = this.$route.query.id
      this.getGroupDetail()
      this.getCustomerList()
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$openNewPageBack()
    },
    // 获取客户分组详情
    getGroupDetail() {
      let that = this
      let id = that.groupId
      that.$http.getCustomerGroupDetail({ id }).then((res) => {
        that.groupData = res.data.data
        that.groupForm = Object.assign({}, res.data.data)
      })
    },
    onSizeChange(val) {
      this.customerPage.pageSize = val
      this.customerPage.pageNum = 1
      // this.getCustomerPage()
      this.getCustomerList()
    },
    onPageChange(val) {
      this.customerPage.pageNum = val
      // this.getCustomerPage()
      this.getCustomerList()
    },
    // 获取该分组下的客户列表
    getCustomerList() {
      let that = this
      let params = {
        pageNum: that.customerPage.pageNum,
        pageSize: that.customerPage.pageSize,
        groupId: that.groupId,
        name: that.customerSearchContent
      }
      that.$http.getGroupCustomerPage(params).then((res) => {
        that.tableData = res.data.data.list
        that.customerPage.total = res.data.data.total
      })
    },
    // 搜索当前的客户列表
    customerSearch() {
      this.customerPage.pageNum = 1
      this.customerPage.pageSize = 15
      this.customerPage.total = 0
      this.getCustomerList()
    },
    // 重置当前的客户列表
    refreshCustomerList() {
      this.customerPage.pageNum = 1
      this.customerPage.pageSize = 15
      this.customerPage.total = 0
      this.customerSearchContent = ''
      this.getCustomerList()
    },
    // 编辑基础信息
    editBaseInfo() {
      let that = this
      that.$refs.groupModel.validate((valid) => {
        if (valid) {
          // 验证通过提交数据
          // 获取当前时间
          let updateTime = Utils.formatDate(new Date())
          that.$set(that.groupForm, 'updateTime', updateTime)
          that.$http.updateCustomerGroup(that.groupForm).then(() => {
            that.$message.success('修改成功')
            // 关闭弹窗、获取详情
            that.editDialog.config.visible = false
            that.getGroupDetail()
          })
        }
      })
    },
    // 删除分组
    deleteGroup() {
      let that = this
      let id = that.groupData.id
      that
        .$confirm('是否删除该分组？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.$http.deleteCustomerGroup({ id }).then(() => {
            // 返回上一页
            that.$message.success('删除成功')
            that.$router.go(-1)
          })
        })
    },
    // 将客户移除该分组
    removeCustomer(row) {
      let that = this
      that
        .$confirm('是否移除该客户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let params = {
            groupId: that.groupId,
            customerId: row.id
          }
          that.$http.removeCustomerToGroup(params).then(() => {
            // 重置page，搜索内容，刷新当前客户列表
            that.$message.success('移除成功')
            that.customerPage.pageNum = 1
            that.customerPage.pageSize = 15
            that.customerPage.total = 0
            that.customerSearchContent = ''
            that.getCustomerList()
          })
        })
    },
    onSelectionSizeChange(val) {
      this.selectionPage.pageSize = val
      this.selectionPage.pageNum = 1
      // this.$refs.multipleTable.clearSelection()
      // this.multipleSelection = []
      this.getSelectionCustomerList()
    },
    onSelectionPageChange(val) {
      this.selectionPage.pageNum = val
      this.getSelectionCustomerList()
      // let num = this.selectionPage.pageNum
      // this.$confirm('页面改变，当前选中的选项将被清除，是否继续', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.selectionPage.pageNum = val
      //     this.$refs.multipleTable.clearSelection()
      //     this.multipleSelection = []
      //     this.getSelectionCustomerList()
      //   })
      //   .catch(() => {
      //     //
      //   })
    },
    // 显示弹窗
    showSelectionCustomerList() {
      this.addDialog.config.visible = true
      this.getSelectionCustomerList()
    },
    // 获取客户选择列表
    getSelectionCustomerList() {
      let that = this
      let params = {
        pageNum: that.selectionPage.pageNum,
        pageSize: that.selectionPage.pageSize,
        name: that.selectionSearchContent
      }
      that.$http.getCustomerSelectPage(params).then((res) => {
        that.selectionData = res.data.data.list
        that.selectionPage.total = res.data.data.total
        // 选中的项
        // let rows = that.multipleSelection
        // that.$nextTick(() => {
        //   if (rows) {
        //     rows.forEach(row => {
        //       that.$refs.multipleTable.toggleRowSelection(row)
        //     })
        //   }
        // })
      })
    },
    // 搜索客户选择列表中的客户
    selectionSearch() {
      this.selectionPage.pageNum = 1
      this.selectionPage.pageSize = 15
      this.selectionPage.total = 0
      this.getSelectionCustomerList()
    },
    // 重置客户选择列表中的客户
    refreshSelectionList() {
      this.selectionPage.pageNum = 1
      this.selectionPage.pageSize = 15
      this.selectionPage.total = 0
      this.selectionSearchContent = ''
      this.getSelectionCustomerList()
    },
    // 选项改变
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('选中的项目' + val.length)
      // console.log('选项' + this.multipleSelection)
    },
    // 手动勾选checkbox触发
    handleSelect(val) {
      this.multipleSelection = val
      // console.log('选中的项目' + val.length)
    },
    // 手动勾选全选checkbox触发
    handleSelectAll(val) {
      this.multipleSelection = val
      // console.log('选中的项目' + val.length)
    },
    // 提交选项，添加客户到分组
    submitSelectionData() {
      let that = this
      if (that.multipleSelection.length <= 0) {
        that.$message.warning('请选择客户')
        return
      }
      let groupId = that.groupData.id
      let customerIds = ''
      that.multipleSelection.forEach((item, idx) => {
        if (idx === 0) {
          customerIds += item.id
        } else {
          customerIds += '_' + item.id
        }
      })
      console.log('获取选中客户项' + customerIds)
      let params = {
        groupId: groupId,
        customerIds: customerIds
      }
      that.$http.pullCustomerToGroup(params).then(() => {
        // 添加成功，关闭弹窗，重置page，清空选择列表，获取客户列表
        that.$message.success('添加成功')
        that.addDialog.config.visible = false
        this.selectionPage.pageSize = 15
        this.selectionPage.pageNum = 1
        this.selectionPage.total = 0
        this.selectionSearchContent = ''
        that.$refs.multipleTable.clearSelection()
        that.multipleSelection = []
        that.getCustomerList()
      })
    },
    // 关闭添加客户弹窗，重置page
    closeAddDialog() {
      this.addDialog.config.visible = false
      this.selectionPage.pageSize = 15
      this.selectionPage.pageNum = 1
      this.selectionPage.total = 0
      this.selectionSearchContent = ''
      this.$refs.multipleTable.clearSelection()
    }
  }
}
</script>

<style lang="scss" scoped>
.grouping-detail {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
}
.g-module {
  width: 100%;
  font-size: 14px;
  padding: 10px 20px;
  box-sizing: border-box;
  background-color: #ffffff;
  margin: 20px 0;
  position: relative;
}
.customer-list-module {
  position: relative;
  padding-bottom: 56px;
  padding-top: 20px;
}
.operating-group {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
.grouping-msg {
  max-width: 800px;
  display: flex;
  align-items: center;
  line-height: 24px;
  padding: 10px 0;
  box-sizing: border-box;

  .msg-label {
    color: #909399;
    margin-right: 10px;
  }
  .msg-desc {
    color: #303133;
  }
}
.query-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  &-left {
    display: flex;
    .search-input {
    }
  }
  &-right {
    display: flex;
    align-items: center;
    .customer-total {
      margin-right: 30px;
      span {
        color: #ffa500;
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
.edit-content {
  width: 100%;
  box-sizing: border-box;
}
.submit-btn {
  width: 200px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
  margin: 60px auto;
  border-radius: 3px;
  cursor: pointer;
}
.submit-btn-add {
  margin: 10px auto;
}
.add-content {
  width: 100%;
  box-sizing: border-box;
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
::v-deep .el-input-group__append {
  background-color: #294a7b;
  border: 1px solid #284a7b;
}
::v-deep .el-icon-search {
  color: #ffffff;
}
</style>
