<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
    <el-dialog
      title="分类信息"
      width="400px"
      append-to-body
      :close-on-click-modal="false"
      :visible="visible"
      :before-close="onClose"
    >
      <el-form ref="model" :model="model" label-position="right" label-width="50px">
        <el-form-item label="类型">
          <el-radio-group v-model="model.type">
            <el-radio :label="12">页面</el-radio>
            <el-radio :label="14">组件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.name" :maxlength="6" placeholder="建议六个字内"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="info">
          <el-input v-model="model.info" :maxlength="60"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="seqNum">
          <el-input v-model="model.seqNum"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="iconUrl">
          <ImageUpload :image-url="model.iconUrl" :on-success="(e) => (model.iconUrl = e)"></ImageUpload>
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
      option: {
        url: 'api/v1.0/layCategory/page'
      },
      searchForm: [
        { label: '名称', type: 'input', formName: 'name' },
        {
          formName: 'type',
          type: 'select',
          value: 12,
          label: '类型',
          option: [
            { value: 12, label: '页面' },
            { value: 14, label: '组件' }
          ]
        }
      ],
      menu: [{ type: 'primary', label: '新建', on: () => (this.visible = true) }],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        {
          label: '图标',
          prop: 'iconUrl',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.iconUrl} fit="cover" style="width:60px;height:60px;"></el-image>
          }
        },
        { label: '名称', prop: 'name', align: 'center' },
        { label: '简介', prop: 'info', align: 'center' },
        { label: '排序号', prop: 'seqNum', align: 'center' },
        { label: '创建时间', prop: 'createTime', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.getTree.bind(this, row)}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteCategory.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      model: {
        type: 12,
        name: '',
        info: '',
        seqNum: '',
        iconUrl: '',
        parentId: 0,
        isDisplay: true
      },
      visible: false
    }
  },
  created() {
    if (this.seqNum) {
      this.column[0] = { label: '序号', prop: 'seqNum', align: 'center' }
    }
  },
  methods: {
    getTree(row) {
      this.model = JSON.parse(JSON.stringify(row))
      this.visible = true
    },
    addCategory() {
      this.$http.addCategory(this.model).then(() => {
        this.$message.success('添加成功')
        this.$refs.table.onSearch()
        this.onClose()
      })
    },
    deleteCategory(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteCategory({ id }).then(() => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {
          return
        })
    },
    updateCategory() {
      this.$http.updateCategory(this.model).then(() => {
        this.$message.success('修改成功')
        this.$refs.table.onSearch()
        this.onClose()
      })
    },
    onSubmit() {
      this.$refs.model.validate((value) => {
        if (value) {
          this.model.id ? this.updateCategory() : this.addCategory()
        }
      })
    },
    onClose() {
      this.visible = false
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
    }
  }
}
</script>
