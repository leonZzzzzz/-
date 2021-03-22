<template>
  <el-dialog
    title="重新登录"
    :visible.sync="visible"
    width="400px"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" size="small" label-width="50px">
      <el-form-item label="账号" prop="username" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.password" type="password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button size="small" @click="close(false)">取 消</el-button> -->
      <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    isAgain: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    success() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.loading = true
          this.login()
        }
      })
    },
    async login() {
      try {
        let res = this.$http.login(this.model)
        console.log('重新登录 === ', res.data)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.loading = false
        this.reduct()
        if (this.isAgain) this.$emit('again')
        this.close(false)
      } catch (err) {
        this.loading = false
        console.log('登陆失败', err.data)
      }
    },
    close() {
      // if (this.isAgain) this.$emit('again')
      this.$emit('close', false)
    },
    reduct() {
      this.model = {
        username: '',
        password: ''
      }
    }
  }
}
</script>
