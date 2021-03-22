<template>
  <div class="customer-group">
    <div class="container">
      <div class="operating-btn">
        <el-button size="small" type="primary" @click="addDialog.config.visible = true">新增分组</el-button>
      </div>
      <div class="common-table-box">
        <com-table :tableData="tableData" :column="column"></com-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>
    <com-dialog :config="addDialog.config" @closeDialog="addDialog.config.visible = false">
      <div class="add-content">
        <el-form
          :model="addDialog.model"
          :rules="addDialog.rules"
          ref="groupModel"
          label-position="right"
          label-width="auto"
        >
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="addDialog.model.name" placeholder="请输入分组名称" clearable> </el-input>
          </el-form-item>
          <el-form-item label="分组备注" prop="describe">
            <el-input v-model="addDialog.model.describe" placeholder="请输入分组备注" clearable> </el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="sequence">
            <el-input type="number" v-model="addDialog.model.sequence" placeholder="请输入排序号"> </el-input>
          </el-form-item>
        </el-form>
        <div class="footer_btns" style="display: flex; justify-content: flex-end">
          <el-button @click="addDialog.config.visible = false">取消</el-button>
          <el-button type="primary" @click="addGrouping">确定</el-button>
        </div>
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
      tableData: [],
      column: [
        // {
        //   type: 'index',
        //   label: '序号',
        //   align: 'center',
        //   width: '150px'
        // },
        {
          label: '分组名称',
          align: 'center',
          prop: 'name'
        },
        {
          label: '分组备注',
          align: 'center',
          prop: 'describe'
        },
        {
          label: '客户数量',
          align: 'center',
          prop: ''
        },
        {
          label: '新增时间',
          align: 'center',
          prop: 'createTime',
          formatter: (row) => {
            return row.createTime ? row.createTime.slice(0, row.createTime.length - 3) : ''
          }
        },
        {
          label: '更新时间',
          align: 'center',
          prop: 'updateTime',
          formatter: (row) => {
            return row.updateTime ? row.updateTime.slice(0, row.updateTime.length - 3) : ''
          }
        },
        {
          label: '排序号',
          align: 'center',
          prop: 'sequence'
        },
        {
          label: '操作',
          align: 'center',
          width: '200px',
          fixed: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push(`/main/scrm/customer-management/grouping/detail?id=${row.id}`)
                  }}
                >
                  详情
                </el-button>
                <el-button type="text" onClick={this.deleteGroup.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      addDialog: {
        config: {
          width: '600px',
          title: '新增分组',
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
      }
    }
  },
  created() {
    this.getGroupList()
  },
  methods: {
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getGroupList()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getGroupList()
    },
    // 获取分组列表
    getGroupList() {
      let that = this
      this.$http.getCustomerGroupPage(that.page).then((res) => {
        that.tableData = res.data.data.list
        that.page.total = res.data.data.total
      })
    },
    // 新增分组
    addGrouping() {
      let that = this
      that.$refs.groupModel.validate((valid) => {
        if (valid) {
          // 验证通过提交数据
          that.$http.addCustomerGroup(that.addDialog.model).then(() => {
            that.$message.success('添加成功')
            // 清除表单数据、关闭弹窗、重置page、获取列表数据
            that.$refs.groupModel.resetFields()
            that.addDialog.config.visible = false
            let obj = {
              pageNum: 1,
              pageSize: 15,
              total: 0
            }
            that.page = obj
            that.getGroupList()
          })
        }
      })
    },
    // 删除分组
    deleteGroup(id) {
      let that = this
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
            this.getGroupList()
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-group {
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
  display: flex;
  margin-bottom: 20px;
}
.common-pagination {
  // width: 100%;
  // position: absolute;
  // left: 0;
  // bottom: 0;
}
.add-content {
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
</style>
