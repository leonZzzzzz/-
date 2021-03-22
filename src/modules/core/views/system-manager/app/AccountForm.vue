<template>
  <el-dialog
    title="添加账号"
    :visible.sync="visible"
    width="450px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-position="right" label-width="100px">
      <el-form-item label="用户名" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="用户账号" prop="username" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="password" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      model: {
        name: '',
        username: '',
        password: '',
        appId: ''
      },
      loading: false
    }
  },
  watch: {
    visible(val) {
      if (val && this.id != '') {
        this.model.appId = this.id
      }
    }
  },
  methods: {
    //添加
    async save() {
      try {
        await this.$http.addAppAccount(this.model)
        this.loading = false
        this.$message.success('添加成功')
        this.close(true)
      } catch (err) {
        this.loading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true, true)
        }
      }
    },
    success() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.loading = true
          this.save()
        } else {
          return false
        }
      })
    },
    close(flag) {
      this.$emit('close', flag)
    }
  }
}
</script>
