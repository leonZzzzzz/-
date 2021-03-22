<template>
  <div>
    <QcTable
      ref="table"
      :option="{ url: 'api/admin/v1/channel/page' }"
      :search-form="searchForm"
      :menu="menu"
      :column="column"
    ></QcTable>
    <el-dialog
      title="编辑渠道信息"
      :visible.sync="visible"
      width="400px"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="model" ref="model" label-width="100px" label-position="left">
        <el-form-item label="渠道商名称" prop="channelName" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input v-model="model.channelName"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人手机" prop="mobile" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input v-model="model.mobile" :disabled="model.id"></el-input>
        </el-form-item>
        <!-- <div v-if="!model.id">
          <el-form-item
            label="登录用户名"
            prop="username"
            :rules="[{ required: true, message: '该字段不能为空' }]"
          >
            <el-input v-model="model.username"></el-input>
          </el-form-item>
          <el-form-item
            label="登录密码"
            prop="password"
            :rules="[{ required: true, message: '该字段不能为空' }]"
          >
            <el-input v-model="model.password"></el-input>
          </el-form-item>
        </div> -->
      </el-form>
      <span slot="footer">
        <el-button @click="onClose()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      searchForm: [
        { label: '联系人', type: 'input', formName: 'name', value: '' },
        { label: '手机', type: 'input', formName: 'mobile', value: '' }
      ],
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
        { type: 'index', label: '序号', width: '60px', align: 'center' },
        { prop: 'channelName', label: '渠道名' },
        { prop: 'name', label: '联系人' },
        { prop: 'mobile', label: '手机' },
        { prop: 'createTime', label: '创建时间', align: 'center' },
        {
          label: '操作',
          align: 'center',
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
              </div>
            )
          }
        }
      ],
      model: {
        name: '',
        mobile: '',
        channelName: '',
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSave(type) {
      this.$http[type](this.model).then((res) => {
        this.$message.success('保存成功')
        this.$refs.table.onSearchKeep()
        this.onClose()
      })
    },
    onClose() {
      this.visible = false
      this.clearForm('model')
    },
    onSubmit() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          this.model.id ? this.onSave('updateChannel') : this.onSave('addChannel')
        }
      })
    },
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteChannel({ id }).then(() => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
