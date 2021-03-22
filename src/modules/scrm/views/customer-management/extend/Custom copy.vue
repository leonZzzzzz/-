<template>
  <div>
    <div class="title">
      自定义字段
      <el-button
        style="margin-left: 10px"
        plain
        size="mini"
        @click=";(configure.visible = true), (configure.title = '新建自定义字段')"
        >新建</el-button
      >
    </div>
    <TableList :tableData="tableData" :tableColumn="tableColumn"></TableList>
    <Dialog :configure="configure" @closeDialog="closeDialog" @success="success">
      <el-form :model="ruleForm" label-position="left" ref="ruleForm" label-width="80px">
        <el-form-item
          label="字段名称"
          prop="name"
          :rules="[{ required: true, message: '请输入字段名称', trigger: 'blur' }]"
        >
          <el-input v-model="ruleForm.name" placeholder="请输入字段名称" maxlength="8" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="输入类型" :required="true">
          <el-radio-group v-model="ruleForm.type">
            <el-radio label="text">文本</el-radio>
            <el-radio label="radio">单选</el-radio>
            <el-radio label="checkbox">多选</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" v-if="ruleForm.type != 'text'">
          <el-input placeholder="请输入字段选项，以下划线“_”隔开，例如“男_女”" v-model="ruleForm.optionName"></el-input>
        </el-form-item>
        <el-form-item
          label="排序号"
          prop="sequence"
          :rules="[{ required: true, message: '请输入排序号', trigger: 'blur' }]"
        >
          <el-input-number v-model="ruleForm.sequence" :step="1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="启用" prop="isEnabled" :required="true">
          <el-switch v-model="ruleForm.isEnabled" active-color="#294A7B" inactive-color="#EBEEF5"> </el-switch>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import TableList from '../../../components/components/TableList'
import Dialog from '../../../components/components/Dialog'
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      tableColumn: [
        {
          prop: 'name',
          title: '字段名称',
          align: 'center'
        },
        {
          title: '类型',
          align: 'center',
          prop: 'type',
          formatter: (row) => {
            return row.type === 'text' ? '文本' : row.type === 'radio' ? '单选' : '多选'
          }
        },
        {
          title: '选项',
          align: 'center',
          prop: 'optionName'
        },
        {
          title: '排序号',
          align: 'center',
          prop: 'sequence'
        },
        {
          title: '启用状态',
          align: 'center',
          formatter: (row) => {
            return row.isEnabled === true ? '启用' : '停用'
          }
        },
        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
                  修改
                </el-button>
                {!row.isEnabled && (
                  <el-button type="text" onClick={this.openUsing.bind(this, row)}>
                    启用
                  </el-button>
                )}
                {row.isEnabled && (
                  <el-button type="text" onClick={this.stopUsing.bind(this, row)}>
                    停用
                  </el-button>
                )}
                <el-button type="text" onClick={this.deteleUsing.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      configure: {
        title: '新建自定义字段', // 标题
        visible: false, // 开关
        width: '600px'
      },
      ruleForm: {
        name: '',
        type: 'text',
        optionName: '',
        sequence: '',
        isEnabled: true
      }
    }
  },
  components: {
    TableList,
    Dialog
  },
  methods: {
    closeDialog() {
      this.configure.visible = false
      this.ruleForm = {
        name: '',
        type: 'text',
        optionName: '',
        sequence: '',
        isEnabled: true
      }
    },
    //停用按钮
    stopUsing(row) {
      let list = row
      this.$confirm('是否停用？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          list.isEnabled = false
          this.$http.updateField(list).then(() => {
            this.$message.success('停用成功')
            this.$emit('refresh')
          })
        })
        .catch(() => {
          return
        })
    },
    //启用按钮
    openUsing(row) {
      this.$confirm('是否启用？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            id: row.id,
            isEnabled: true
          }
          this.$http.openField(params).then(() => {
            this.$message.success('启用成功')
            this.$emit('refresh')
          })
        })
        .catch(() => {
          return
        })
    },
    // 显示对话框
    showEditDialog(row) {
      this.configure.title = '修改自定义字段'
      this.ruleForm = row
      this.configure.visible = true
    },
    //删除新增字段
    deteleUsing(id) {
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deteleField({ id }).then(() => {
          this.$message.success('删除成功')
          this.$emit('refresh')
        })
      })
    },
    success() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.ruleForm.type != 'text' && this.ruleForm.optionName == '') {
            console.log('哈哈哈')
            this.$message.error('请输入字段选项，以下划线“_”隔开，例如“男_女”')
            return
          }
          if (this.ruleForm.id) {
            this.updateUsing()
          } else {
            this.createUsing()
          }
        } else {
          return false
        }
      })
    },
    createUsing() {
      this.$http.addField(this.ruleForm).then((res) => {
        this.$message.success('新建成功')
        this.configure.visible = false
        this.ruleForm = {
          name: '',
          type: 'text',
          optionName: '',
          sequence: '',
          isEnabled: true
        }
        this.$emit('refresh')
      })
    },
    updateUsing() {
      this.$http.updateField(this.ruleForm).then((res) => {
        this.$message.success('修改成功')
        this.configure.visible = false
        this.ruleForm = {
          name: '',
          type: 'text',
          optionName: '',
          sequence: '',
          isEnabled: true
        }
        this.$emit('refresh')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  padding: 14px 0;
  font-size: 16px;
  color: #606266;
  position: relative;
  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 20px;
    background-color: #294a7b;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    left: -20px;
  }
}
</style>
