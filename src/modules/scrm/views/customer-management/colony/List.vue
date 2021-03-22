<template>
  <div class="customer-colony">
    <div class="container">
      <div class="operating-btn">
        <div>
          <el-form label-width="50px" :inline="true">
            <el-form-item label="群名">
              <el-input
                size="small"
                v-model="searchData.name"
                placeholder="请输入群名"
                @input="searchGroupChange"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="群主">
              <el-select
                v-model="searchData.owner"
                filterable
                placeholder="请选择"
                clearable
                @change="searchGroupChange"
              >
                <el-option v-for="item in ownerOptions" :key="item.owner" :label="item.ownerName" :value="item.owner">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" label-width="70px">
              <el-date-picker
                v-model="createTime"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
                @change="searchGroupChange"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button size="small" type="primary" @click="refreshCustomer" :loading="syncLoading">客户同步</el-button>
          <el-button size="small" type="primary" @click="setGroupRules">客户加群领券规则设置</el-button>
        </div>
      </div>
      <div class="common-table-box">
        <com-table :tableData="tableData" :column="column"></com-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>
    <com-dialog :config="addDialog.config" @closeDialog="addDialog.config.visible = false">
      <div class="dialog-content">
        <el-form
          :model="addDialog.model"
          :rules="addDialog.rules"
          ref="colonyModel"
          label-position="right"
          label-width="auto"
        >
          <el-form-item label="群名称" prop="name">
            <el-input v-model="addDialog.model.name" placeholder="请输入群名称" clearable> </el-input>
          </el-form-item>
          <el-form-item label="群备注" prop="describe">
            <el-input v-model="addDialog.model.describe" placeholder="请输入群备注" clearable> </el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="sequence">
            <el-input type="number" v-model="addDialog.model.sequence" placeholder="请输入排序号"> </el-input>
          </el-form-item>
        </el-form>
        <div class="submit-btn" @click="addColony">确定</div>
      </div>
    </com-dialog>
    <com-dialog :config="editDialog.config" @closeDialog="editDialog.config.visible = false">
      <div class="dialog-content">
        <el-form
          :model="editDialog.model"
          :rules="editDialog.rules"
          ref="editModel"
          label-position="right"
          label-width="auto"
        >
          <el-form-item label="群名称" prop="name">
            <el-input v-model="editDialog.model.name" placeholder="请输入群名称" clearable> </el-input>
          </el-form-item>
          <el-form-item label="群备注" prop="describe">
            <el-input v-model="editDialog.model.describe" placeholder="请输入群备注" clearable> </el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="sequence">
            <el-input type="number" v-model="editDialog.model.sequence" placeholder="请输入排序号"> </el-input>
          </el-form-item>
        </el-form>
        <div class="submit-btn" @click="editColony">确定</div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComTable from '../../../components/common/ComTable'
import ComDialog from '../../../components/common/ComDialog'
import ComPagination from '../../../components/common/ComPagination'
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
    return {
      tableData: [],
      searchData: {
        owner: '',
        startTime: '',
        endTime: '',
        name: ''
      },
      ownerOptions: [],
      createTime: '',
      column: [
        // {
        //   type: 'index',
        //   label: '序号',
        //   align: 'center',
        //   width: '150px'
        // },
        {
          label: '群名',
          minWidth: '150px',
          align: 'center',
          prop: 'name'
        },
        {
          label: '群主',
          minWidth: '150px',
          align: 'center',
          prop: 'ownerName'
        },
        {
          label: '群人数',
          minWidth: '150px',
          align: 'center',
          prop: 'quantity'
        },
        {
          label: '今日加群人数',
          minWidth: '150px',
          align: 'center',
          prop: 'todayIn',
          formatter: row => {
            return row.todayIn || 0
          }
        },
        {
          label: '今日退群人数',
          minWidth: '150px',
          align: 'center',
          prop: 'todayOut',
          formatter: row => {
            return row.todayIn || 0
          }
        },

        {
          label: '创建时间',
          minWidth: '150px',
          align: 'center',
          prop: 'createAtToTime'
        },
        {
          label: '操作',
          minWidth: '150px',
          align: 'center',
          fixed: 'right',
          formatter: row => {
            return (
              <el-button type="text" onClick={this.toDetalis.bind(this, row)}>
                详情
              </el-button>
            )
          }
        }
      ],
      // <el-button
      //   type="text" onClick={this.showEditDialog.bind(this, row)}>
      //   编辑
      // </el-button>
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0,
        showTodayUserChange: true
      },
      addDialog: {
        config: {
          width: '600px',
          title: '新增客户群',
          visible: false
        },
        model: {
          name: '', // 名称
          describe: '', // 备注/简介
          sequence: 0 // 排序号
        },
        rules: {
          name: [{ required: true, validator: nameValidator, trigger: 'blur' }]
          // describe: [
          //   { required: true, validator: describeValidator, trigger: 'blur' }
          // ],
          // sequence: [
          //   { required: true, validator: sequenceValidator, trigger: 'blur' }
          // ]
        }
      },
      editDialog: {
        config: {
          width: '600px',
          title: '修改客户群信息',
          visible: false
        },
        model: {},
        rules: {
          name: [{ required: true, validator: nameValidator, trigger: 'blur' }]
          // describe: [
          //   { required: true, validator: describeValidator, trigger: 'blur' }
          // ],
          // sequence: [
          //   { required: true, validator: sequenceValidator, trigger: 'blur' }
          // ]
        }
      },
      syncLoading: false
    }
  },
  created() {
    this.getColonyList({})
    this.selectForGroupSendNew()
  },
  methods: {
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getColonyList({})
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getColonyList({})
    },
    // 获取客户群列表
    getColonyList(options) {
      options.pageSize = this.page.pageSize
      options.pageNum = this.page.pageNum
      this.$http.getCustomerColonyPage(options).then(res => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    addColony() {
      let that = this
      that.$refs.colonyModel.validate(valid => {
        if (valid) {
          // 验证通过提交数据
          that.$http.addCustomerColony(that.addDialog.model).then(() => {
            that.$message.success('添加成功')
            // 清除表单数据、关闭弹窗、重置page、获取列表数据
            that.$refs.colonyModel.resetFields()
            that.addDialog.config.visible = false
            let obj = {
              pageNum: 1,
              pageSize: 15,
              total: 0
            }
            that.page = obj
            that.getColonyList({})
          })
        }
      })
    },
    // 查看详情
    toDetalis(row) {
      this.$openNewPage({
        path: '/main/scrm/customer-management/colony/details',
        query: {
          id: row.id,
          chatId: row.chatId
        }
      })
    },
    // 显示编辑弹窗
    showEditDialog(row) {
      this.editDialog.model = Object.assign({}, row)
      this.editDialog.config.visible = true
    },
    editColony() {
      let that = this
      that.$refs.editModel.validate(valid => {
        if (valid) {
          // 验证通过提交数据
          that.$http.updateCustomerColony(that.editDialog.model).then(() => {
            that.$message.success('修改成功')
            // 清除表单数据、关闭弹窗、重置page、获取列表数据
            that.$refs.editModel.resetFields()
            that.editDialog.config.visible = false
            let obj = {
              pageNum: 1,
              pageSize: 15,
              total: 0
            }
            that.page = obj
            that.getColonyList({})
          })
        }
      })
    },
    // 客户同步
    refreshCustomer() {
      let that = this
      that.syncLoading = true
      that.$http.syncCustomerList().then(() => {
        that.$message.success('同步成功')
        that.syncLoading = false
        that.getColonyList({})
      })
    },
    setGroupRules() {
      this.$openNewPage({path: '/main/scrm/coupon-setting/grouprules'})
    },
    searchGroupChange() {
      console.log(this.createTime)
      let options = {
        owner: this.searchData.owner,
        startTime: this.createTime ? this.createTime[0] : '',
        endTime: this.createTime ? this.createTime[1] : '',
        name: this.searchData.name
      }
      this.getColonyList(options)
    },
    selectForGroupSendNew(name) {
      this.$http.selectForGroupSendNew({ name }).then(res => {
        this.ownerOptions = res.data.data
        console.log('this.ownerOptions', this.ownerOptions)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 0;
}
.customer-colony {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
}
.operating-btn {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
.dialog-content {
  width: 100%;
  height: 260px;
  padding: 0 40px;
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
</style>
