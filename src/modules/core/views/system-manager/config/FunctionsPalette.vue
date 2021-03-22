<template>
  <div>
    <QcTable ref="table" :option="option" :menu="menu" :column="column"></QcTable>
    <el-dialog append-to-body :visible="visible" width="500px" :show-close="false" title="功能模板">
      <el-form :model="model" ref="model" label-position="left" label-width="100px">
        <el-form-item label="功能名称" prop="name" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="功能代码" prop="code" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.code"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="description" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.description"></el-input>
        </el-form-item>
        <el-form-item
          label="父功能代码"
          prop="parentCode"
          v-if="!model.id"
          :rules="[{ required: true, message: '请填写该字段' }]"
        >
          <el-input v-model="model.parentCode"></el-input>
        </el-form-item>
        <el-form-item label="显示方式" prop="showType" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.showType" disabled></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon" v-if="model.id" :rules="[{ required: true, message: '请填写该字段' }]">
          <QcImageUpload v-model="model.icon"></QcImageUpload>
        </el-form-item>
        <el-form-item
          label="启用状态"
          prop="value"
          v-if="model.id"
          :rules="[{ required: true, message: '请填写该字段' }]"
        >
          <el-input v-model="model.value"></el-input>
        </el-form-item>
        <el-form-item label="值域" prop="valueRange" v-if="model.id">
          <el-input v-model="model.valueRange"></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="sortNumber" v-if="model.id">
          <el-input-number style="width:100%" v-model="model.sortNumber"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onClose()">关闭</el-button>
        <el-button type="primary" @click="onSubmit()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/ability-template/list',
        showPagination: false,
        response: {
          list: 'data.data'
        }
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
        { label: '序号', type: 'index', width: '50px', align: 'center' },
        { label: '功能名称', prop: 'name' },
        { label: '功能简介', prop: 'description' },
        { label: '层级', prop: 'level', align: 'center' },
        { label: '功能代码', prop: 'code', align: 'center' },
        { label: '父功能代码', prop: 'parentCode', align: 'center' },
        { label: '功能启用状态', prop: 'value', align: 'center' },
        { label: '显示方式', prop: 'showType', align: 'center' },
        { label: '排序号', prop: 'sortNumber', align: 'center' },
        {
          label: '操作',
          align: 'left',
          width: '100px',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.model = JSON.parse(JSON.stringify(row))
                    this.visible = true
                  }}
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$confirm('是否删除该数据?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    })
                      .then(() => {
                        this.$http.abilityTemplateDelete({ code: row.code }).then(() => {
                          this.$refs.table.onSearchKeep()
                        })
                      })
                      .catch(() => {})
                  }}
                >
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      visible: false,
      model: {
        name: '',
        code: '',
        showType: 'checkbox',
        description: '',
        parentCode: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          if (this.model.id) {
            this.$http.abilityTemplateUpdate(this.model).then((res) => {
              this.$message.success('修改成功')
              this.$refs.table.onSearch()
              this.onClose()
            })
          } else {
            this.$http.abilityTemplateAdd(this.model).then((res) => {
              this.$message.success('添加成功')
              this.$refs.table.onSearch()
              this.onClose()
            })
          }
        }
      })
    },
    onClose() {
      this.clearForm('model')
      this.visible = false
    }
  }
}
</script>
