<template>
  <div>
    <QcTable ref="table" :option="option" :menu="menu" :column="column"></QcTable>
    <el-dialog :visible="visible" title="小程序信息" width="400px" :before-close="onClose" append-to-body>
      <el-form ref="model" :model="model" label-position="left" label-width="100px" hide-required-asterisk>
        <el-form-item label="小程序标题" prop="name" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="AppId" prop="wxAppId" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.wxAppId"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onClose()">关闭</el-button>
        <el-button type="primary" @click="miniPageAdd()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      option: {
        url: 'api/admin/v1/skipApp/page'
      },
      menu: [
        {
          label: '添加',
          type: 'primary',
          on: () => {
            this.visible = true
          }
        }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '组件识别码', prop: 'name', align: 'center' },
        { label: 'AppId', prop: 'wxAppId', align: 'center' },
        {
          label: '操作',
          align: 'left',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.miniPageGet.bind(this, row)}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.miniAppDelete.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      model: {
        name: '',
        wxAppId: '',
        type: 'weapp'
      }
    }
  },
  methods: {
    miniPageGet(model) {
      this.visible = true
      this.model = JSON.parse(JSON.stringify(model))
    },
    miniPageAdd() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          this.$http.miniPageAdd(this.model).then(() => {
            this.onClose(true)
            this.$refs.table.onSearch()
            this.$message.success('保存成功')
          })
        }
      })
    },
    miniAppDelete(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.miniAppDelete({ id }).then(() => {
            this.$message.success('删除成功')
            this.$refs.table.onSearch()
          })
        })
        .catch(() => {})
    },
    onClose() {
      this.visible = false
      this.clearForm('model')
    }
  }
}
</script>
