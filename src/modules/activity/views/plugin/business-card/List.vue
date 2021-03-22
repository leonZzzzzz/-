<template>
  <div class="business-card">
    <QcTable ref="table" :option="option" :menu="menu" :column="column"></QcTable>
    <el-dialog
      title="添加底图"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="onClose"
    >
      <el-form ref="model" :model="model" label-position="right" label-width="120px">
        <el-form-item label="模板" prop="templateId">
          <el-select v-model="model.templateId">
            <el-option
              v-for="option in templateList"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序号" prop="sortNumber">
          <el-input-number v-model="model.sortNumber"></el-input-number>
        </el-form-item>
        <el-form-item label="底图" prop="url">
          <ImageUpload :image-url="model.url" :on-success="(e) => (model.url = e)"></ImageUpload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="onClose()">关闭</el-button>
        <el-button type="primary" @click="onSubmit()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        {
          type: 'primary',
          label: '添加',
          on: () => {
            this.dialogVisible = true
          }
        }
      ],
      option: {
        url: 'api/admin/v1/business-card-background/page'
      },
      column: [
        // {
        //   type: 'index',
        //   label: '序号',
        //   width: '120px',
        //   align: 'center'
        // },
        {
          prop: 'url',
          label: '底图',
          align: 'center',
          width: '150px',
          formatter: (row) => {
            return <img src={this.imgHost + row.url} alt="" width="80px" height="140px" />
          }
        },
        {
          prop: 'sortNumber',
          label: '排序号',
          align: 'center',
          width: '150px'
        },
        {
          prop: 'template',
          label: '模板名称',
          align: 'center',
          width: '150px'
        },
        {
          label: '操作',
          align: 'center',
          fixed: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.updateConfirm.bind(this, row)}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteCardBackground.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      dialogVisible: false,
      templateList: [],
      model: {
        sortNumber: 0,
        url: '',
        templateId: ''
      }
    }
  },
  created() {
    this.getTemplateList()
  },
  methods: {
    // 获取模板列表
    getTemplateList() {
      this.$http.getStyleTemplateList().then((res) => {
        let list = res.data.data
        this.templateList = list
      })
    },
    // 修改底图弹窗
    updateConfirm(row) {
      this.model = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    onSubmit() {
      this.$refs.model.validate((value) => {
        if (value) {
          this.model.id ? this.updateCardBackground() : this.addCardBackground()
        }
      })
    },
    // 修改底图提交数据
    updateCardBackground() {
      this.$http.updateCardBackground(this.model).then(() => {
        this.$message.success('修改成功')
        this.$refs.table.onSearch()
        this.onClose()
      })
    },
    // 创建新底图
    addCardBackground() {
      this.$http.insertCardBackground(this.model).then(() => {
        this.$message.success('添加成功')
        this.$refs.table.onSearch()
        this.onClose()
      })
    },
    deleteCardBackground(id) {
      this.$confirm('是否删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteCardBackground({ id }).then(() => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {
          return
        })
    },
    onClose() {
      this.dialogVisible = false
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.business-card {
  padding-top: 20px;
  box-sizing: border-box;
  background: #fff;
}
</style>
