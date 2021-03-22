<template>
  <div class="person-tag">
    <div class="container">
      <div class="query-table-box">
        <div class="search-content">
          <div class="search-input">
            <el-input size="small" placeholder="请输入标签名称" v-model="searchForm.content"></el-input>
          </div>
          <el-button size="small" type="primary" @click="onSearch">查询</el-button>
          <el-button size="small" type="info" @click="onReset">重置</el-button>
        </div>
      </div>
      <div class="table-info">
        <div class="info-msg">
          目前已有个人标签：&nbsp;<span>{{ page.total }}</span>
        </div>
        <el-button size="small" type="primary" @click="addDialog.config.visible = true">新增标签</el-button>
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
        <el-form :model="tagForm" :rules="rules" ref="tagModel" label-position="right" label-width="auto">
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="tagForm.name" placeholder="请输入标签名称" clearable> </el-input>
          </el-form-item>
          <!-- <el-form-item
            label="标签备注"
            prop="name">
            <el-input
              v-model="tagForm.describe"
              placeholder="请输入标签备注"
              clearable>
            </el-input>
          </el-form-item> -->
          <el-form-item label="排序号" prop="order">
            <el-input type="number" v-model="tagForm.order" placeholder="请输入排序号"> </el-input>
          </el-form-item>
        </el-form>
        <div class="submit-btn" @click="addTag">确定</div>
      </div>
    </com-dialog>
    <com-dialog :config="editDialog.config" @closeDialog="editDialog.config.visible = false">
      <div class="dialog-content">
        <el-form :model="editForm" :rules="rules" ref="editModel" label-position="right" label-width="auto">
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="editForm.name" placeholder="请输入标签名称" clearable> </el-input>
          </el-form-item>
          <!-- <el-form-item
            label="标签备注"
            prop="name">
            <el-input
              v-model="editForm.describe"
              placeholder="请输入标签备注"
              clearable>
            </el-input>
          </el-form-item> -->
          <el-form-item label="排序号" prop="order">
            <el-input type="number" v-model="editForm.order" placeholder="请输入排序号"> </el-input>
          </el-form-item>
        </el-form>
        <div class="submit-btn" @click="editTag">确定</div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComTable from '../../../components/common/ComTable'
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
import Utils from '../../../utils/utils'
export default {
  components: { ComTable, ComPagination, ComDialog },
  data() {
    let nameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入标签名称'))
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
      searchConfig: {
        labelWidth: '60px',
        labelPosition: 'right',
        size: 'small'
      },
      searchForm: {
        content: ''
      },
      tableData: [],
      column: [
        {
          type: 'index',
          label: '序号',
          align: 'center',
          width: '150px'
        },
        {
          label: '标签名称',
          align: 'center',
          minWidth: '150px',
          prop: 'name'
        },
        // {
        //   label: '备注',
        //   align: 'center',
        //   minWidth: '150px',
        //   prop: 'describe'
        // },
        {
          label: '排序号',
          align: 'center',
          minWidth: '150px',
          prop: 'sequence'
        },
        {
          label: '新增时间',
          align: 'center',
          minWidth: '150px',
          prop: 'createTime'
        },
        {
          label: '更新时间',
          align: 'center',
          minWidth: '150px',
          prop: 'updateTime'
        },
        {
          label: '操作',
          align: 'center',
          width: '200px',
          fixed: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
                  编辑
                </el-button>
                <el-button type="text" onClick={this.deleteTag.bind(this, row.id)}>
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
          title: '新增个人标签',
          visible: false
        }
      },
      editDialog: {
        config: {
          width: '600px',
          title: '编辑个人标签',
          visible: false
        }
      },
      tagForm: {
        name: '', // 名称
        // describe: '', // 备注、简介
        order: 0 // 排序号
      },
      rules: {
        name: [{ required: true, validator: nameValidator, trigger: 'blur' }]
        // describe: [
        //   { required: true, validator: describeValidator, trigger: 'blur' }
        // ],
        // sequence: [
        //   { required: true, validator: sequenceValidator, trigger: 'blur' }
        // ]
      },
      editForm: {}
    }
  },
  created() {
    this.getTagPage()
  },
  methods: {
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getTagPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getTagPage()
    },
    onSearch() {
      console.log('搜索的内容' + this.searchForm.content)
    },
    onReset() {
      //
    },
    // 获取个人标签列表
    getTagPage() {
      let that = this
      that.$http.getPersonalTagPage(that.page).then((res) => {
        that.tableData = res.data.data.list
        that.page.total = res.data.data.total
      })
    },
    // 新增个人标签
    addTag() {
      let that = this
      that.$refs.tagModel.validate((valid) => {
        if (valid) {
          // 验证通过提交数据
          that.$http.addPersonalTag(that.tagForm).then(() => {
            // 清除表单数据、关闭弹窗、重置page、获取列表数据
            that.$message.success('添加成功')
            that.$refs.tagModel.resetFields()
            that.addDialog.config.visible = false
            let obj = {
              pageNum: 1,
              pageSize: 15,
              total: 0
            }
            that.page = obj
            that.getTagPage()
          })
        }
      })
    },
    // 显示编辑弹窗
    showEditDialog(row) {
      // this.editForm = row
      this.editForm = Object.assign({}, row)
      this.editDialog.config.visible = true
    },
    // 更新个人标签
    editTag() {
      let that = this
      that.$refs.editModel.validate((valid) => {
        if (valid) {
          // 验证通过提交数据
          // 获取当前时间
          let updateTime = Utils.formatDate(new Date())
          that.$set(that.editForm, 'updateTime', updateTime)
          that.$http.updatePersonalTag(that.editForm).then((res) => {
            // 关闭弹窗、获取列表数据
            that.$message.success('编辑成功')
            that.editDialog.config.visible = false
            that.getTagPage()
          })
        }
      })
    },
    // 删除个人标签
    deleteTag(id) {
      let that = this
      that
        .$confirm('是否删除该标签？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.$http.deletePersonalTag({ id }).then(() => {
            // 重置page，获取列表数据
            that.$message.success('删除成功')
            let obj = {
              pageNum: 1,
              pageSize: 15,
              total: 0
            }
            that.page = obj
            that.getTagPage()
          })
        })
        .catch(() => {
          return
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.person-tag {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
}
.query-table-box {
  margin-bottom: 20px;
  .search-content {
    display: flex;
    .search-input {
      width: 300px;
      margin-right: 10px;
    }
  }
}
.table-info {
  color: #303133;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .info-msg {
    margin-right: 40px;
    span {
      color: #1e90ff;
    }
  }
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
