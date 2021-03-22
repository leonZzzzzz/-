<template>
  <div class="customer-colony">
    <div class="header_nav" style="margin-bottom: 20px">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">扩展字段</el-button>
    </div>
    <div class="cutomer-title">
      说明:客户详情页面显示的字段在不满足使用的情况下,企业可自定义添加更多的信息字段来记录客户信息
    </div>
    <div class="container">
      <div class="operating-btn">
        <el-button size="small" type="primary" @click="addField">新增字段</el-button>
      </div>
      <div class="common-table-box">
        <com-table :tableData="tableData" :column="column"></com-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>

    <com-dialog :config="editDialog.config" @closeDialog="editDialog.config.visible = false">
      <div class="dialog-content">
        <el-form
          :model="editDialog.model"
          :rules="editDialog.rules"
          ref="editModel"
          label-position="right"
          label-width="auto"
        >
          <el-form-item label="字段名称" prop="name">
            <el-input v-model="editDialog.model.name" placeholder="请输入修改字段" clearable> </el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="sequence">
            <el-input type="number" v-model="editDialog.model.sequence" placeholder="请输入排序号"> </el-input>
          </el-form-item>
        </el-form>
        <div class="submit_btn" style="display: flex; justify-content: flex-end">
          <el-button @click="editDialog.config.visible = false">取消</el-button>
          <el-button type="primary" @click="editColony()">确定</el-button>
        </div>
      </div>
    </com-dialog>

    <com-dialog :config="eidtExtendlDialog.config" @closeDialog="closePerExtendDialog()" class="dialogSelect">
      <el-form label-position="right" label-width="auto" ref="addModel">
        <el-form-item label="字段名称">
          <el-input placeholder="请输入字段名称" v-model="eidtExtendlDialog.model.name"></el-input>
        </el-form-item>
        <el-form-item label="输入类型">
          <el-radio-group v-model="eidtExtendlDialog.model.type">
            <el-radio :label="1">文本</el-radio>
            <el-radio :label="2">单选</el-radio>
            <el-radio :label="3">多选</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" v-if="eidtExtendlDialog.model.type != 1">
          <el-input placeholder="请输入选项以'|'隔开" v-model="eidtExtendlDialog.model.typeItem"></el-input>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input placeholder="请输入排序号" v-model="eidtExtendlDialog.model.sequence"></el-input>
        </el-form-item>
      </el-form>
      <div class="submit_btn" style="display: flex; justify-content: flex-end">
        <el-button @click="closePerExtendDialog()">取消</el-button>
        <el-button type="primary" @click="sumbitAddPerTagDialog()">确定</el-button>
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
      tableData: [], //存储从后台获取到的数组
      column: [
        {
          prop: 'name',
          label: '字段名称',
          align: 'center'
        },
        {
          label: '排序号',
          align: 'center',
          prop: 'sequence'
        },
        {
          label: '输入类型',
          align: 'center',
          prop: ''
        },
        {
          label: '选项',
          align: 'center',
          prop: ''
        },
        {
          label: '状态',
          align: 'center',
          formatter: (row) => {
            return row.isEnabled === true ? '启用' : '停用'
          }
        },

        {
          label: '操作',

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
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },

      editDialog: {
        config: {
          width: '600px',
          title: '修改字段',
          visible: false
        },
        model: {},
        rules: {
          name: [{ required: true, validator: nameValidator, trigger: 'blur' }]
        }
      },
      syncLoading: false,
      eidtExtendlDialog: {
        config: {
          width: '600px',
          title: '新增字段',
          visible: false
        },
        model: {
          name: '', // 名称
          sequence: 0, // 排序号
          type: 1,
          typeItem: ''
        },
        rules: {
          name: [{ required: true, validator: nameValidator, trigger: 'blur' }]
        }
      },
      isEnabled: false
    }
  },
  created() {
    this.getColonyList()
  },
  methods: {
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getColonyList()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getColonyList()
    },
    // 获取客户群列表
    getColonyList() {
      let that = this
      that.$http.getFieldList(that.page).then((res) => {
        that.tableData = res.data.data.list
        that.page.total = res.data.data.total
      })
    },
    // 显示编辑弹窗
    showEditDialog(row) {
      this.editDialog.model = Object.assign({}, row)
      this.editDialog.config.visible = true
    },
    editColony() {
      let that = this
      that.$refs.editModel.validate((valid) => {
        if (valid) {
          // 验证通过提交数据
          that.$http.updateField(that.editDialog.model).then(() => {
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
            that.getColonyList()
          })
        }
      })
    },
    // 客户同步

    //点击新增按钮的触发事件
    addField() {
      let that = this
      that.eidtExtendlDialog.model.name = ''
      that.eidtExtendlDialog.config.visible = true
    },
    //关闭弹窗的x按钮
    closePerExtendDialog() {
      let that = this
      that.eidtExtendlDialog.config.visible = false
    },
    //新增弹窗里的确认按钮
    sumbitAddPerTagDialog() {
      let that = this
      if (that.eidtExtendlDialog.model.name == '') {
        that.$message.warning('请填写字段名称')
      } else {
        that.$http.addField(that.eidtExtendlDialog.model).then(() => {
          that.eidtExtendlDialog.model.name = ''
          that.eidtExtendlDialog.model.sequence = 0
          that.$message.success('新增字段成功')
          that.getColonyList()
          that.eidtExtendlDialog.config.visible = false
        })
      }
    },
    //停用按钮
    stopUsing(row) {
      let that = this
      let list = row
      that
        .$confirm('是否停用？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          list.isEnabled = false
          that.$http.updateField(list).then(() => {
            that.$message.success('停用成功')
            that.getColonyList()
          })
        })
        .catch(() => {
          return
        })
    },
    //启用按钮
    openUsing(row) {
      let that = this
      that
        .$confirm('是否启用？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let params = {
            id: row.id,
            isEnabled: true
          }
          that.$http.openField(params).then(() => {
            that.$message.success('启用成功')
            that.getColonyList()
          })
        })
        .catch(() => {
          return
        })
    },
    //删除新增字段
    deteleUsing(id) {
      let that = this
      that
        .$confirm('是否删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.$http.deteleField({ id }).then(() => {
            that.$message.success('删除成功')
            that.getColonyList()
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-colony {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
}
.operating-btn {
  margin-bottom: 20px;
}
.common-pagination {
  // width:calc(100% - 30px) ;
  // position: absolute;
  // left: 0;
  // bottom: 0;
}
.dialog-content {
  width: 100%;
  // height: 260px;
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
  margin: 30px auto;
  border-radius: 3px;
  cursor: pointer;
}
.cutomer-title {
  color: #aaaaaa;
  font-size: 14px;
  padding-bottom: 20px;
}
</style>
