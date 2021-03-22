<template>
  <div class="material-tag">
    <div class="container">
      <div class="table-info">
        <div class="info-msg">
          目前已有素材标签：&nbsp;<span>{{ page.total }}</span>
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
    <!-- 编辑素材标签 -->
    <com-dialog :config="editDialog.config" @closeDialog="editDialog.config.visible = false">
      <div class="dialog-content">
        <el-form :model="editDialog.form" :rules="rules" ref="editModel" label-position="right" label-width="auto">
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="editDialog.form.name" placeholder="请输入标签名称" clearable> </el-input>
          </el-form-item>
          <el-form-item label="标签备注" prop="describe">
            <el-input v-model="editDialog.form.describe" placeholder="请输入标签备注" clearable> </el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="sequence">
            <el-input type="number" v-model="editDialog.form.sequence" placeholder="请输入排序号"> </el-input>
          </el-form-item>
        </el-form>
        <div class="submit-btn" @click="editTag">确定</div>
      </div>
    </com-dialog>
    <!-- 新增素材标签 -->
    <com-dialog :config="addDialog.config" @closeDialog="closeAddDialog">
      <div class="dialog-content">
        <el-form :model="addDialog.form" :rules="rules" ref="addModel" label-position="right" label-width="auto">
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="addDialog.form.name" placeholder="请输入标签名称" clearable> </el-input>
          </el-form-item>
          <el-form-item label="标签备注" prop="describe">
            <el-input v-model="addDialog.form.describe" placeholder="请输入标签备注" clearable> </el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="sequence">
            <el-input type="number" v-model="addDialog.form.sequence" placeholder="请输入排序号"> </el-input>
          </el-form-item>
        </el-form>
        <div class="submit-btn" @click="addTag">确定</div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComTable from '../../../components/common/ComTable'
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
export default {
  components: {
    ComTable,
    ComPagination,
    ComDialog
  },
  data() {
    let nameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入标签名称'))
      } else {
        callback()
      }
    }
    return {
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
        {
          label: '备注',
          align: 'center',
          minWidth: '150px',
          prop: 'describe'
        },
        {
          label: '排序号',
          align: 'center',
          minWidth: '150px',
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
      editDialog: {
        config: {
          width: '600px',
          title: '编辑素材标签',
          visible: false
        },
        form: {}
      },
      addDialog: {
        config: {
          width: '600px',
          title: '新增素材标签',
          visible: false
        },
        form: {
          name: '', // 名称
          describe: '', // 备注
          sequence: null // 排序号
        }
      },
      rules: {
        name: [{ required: true, validator: nameValidator, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getTagPage()
    // this.getCodeMessage()
  },
  methods: {
    getCodeMessage() {
      let code = 'hyzs'
      this.$http.getCodeMessage().then(() => {
        //
      })
    },
    getTagPage() {
      this.$http.getMaterialTagPage(this.page).then((res) => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getTagPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getTagPage()
    },
    showEditDialog(row) {
      this.editDialog.form = Object.assign({}, row)
      this.editDialog.config.visible = true
    },
    editTag() {
      this.$refs.editModel.validate((valid) => {
        if (valid) {
          this.$http.updateMaterialTag(this.editDialog.form).then(() => {
            this.$message.success('编辑成功')
            this.editDialog.config.visible = false
            this.getTagPage()
          })
        }
      })
    },
    deleteTag(id) {
      this.$confirm('是否删除该标签？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteMaterialTag({ id }).then(() => {
            // 重置page，获取列表数据
            this.$message.success('删除成功')
            this.page.pageSize = 15
            this.page.pageNum = 1
            this.getTagPage()
          })
        })
        .catch(() => {
          return
        })
    },
    addTag() {
      this.$refs.addModel.validate((valid) => {
        if (valid) {
          this.$http.addMaterialTag(this.addDialog.form).then(() => {
            this.$message.success('新增成功')
            this.closeAddDialog()
            this.page.pageSize = 15
            this.page.pageNum = 1
            this.getTagPage()
          })
        }
      })
    },
    closeAddDialog() {
      this.addDialog.config.visible = false
      this.addDialog.form.name = ''
      this.addDialog.form.describe = ''
      this.addDialog.form.sequence = null
    }
  }
}
</script>

<style lang="scss" scoped>
.material-tag {
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
