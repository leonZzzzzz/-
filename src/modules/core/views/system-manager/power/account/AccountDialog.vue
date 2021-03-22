<template>
  <el-dialog
    :title="id ? '修改' : '添加'"
    :visible.sync="visible"
    width="400px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-position="right" label-width="100px">
      <el-form-item label="用户名" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input size="small" v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item
        v-if="!id"
        label="用户账号"
        prop="username"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input size="small" v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item
        v-if="!id"
        label="用户密码"
        prop="password"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input size="small" v-model="model.password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
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
        password: ''
      },
      loading: false,
      dataLoading: false
    }
  },
  watch: {
    visible(val) {
      if (val && this.id) {
        this.dataLoading = true
        this.detail()
      }
    }
  },
  methods: {
    async detail() {
      try {
        let res = await this.$http.getAccount({ id: this.id })
        this.model.id = res.data.data.id
        this.model.name = res.data.data.name
        this.dataLoading = false
      } catch (err) {
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true, true)
        }
      }
    },
    success() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.loading = true
          this.saveModel(this.id ? 'updateAccount' : 'addAccount')
        } else {
          return false
        }
      })
    },
    async saveModel(type) {
      try {
        await this.$http[type](this.model)
        this.loading = false
        this.$message({
          message: type === 'updateAccount' ? '修改成功' : '添加成功',
          type: 'success'
        })
        this.close(true)
      } catch (err) {
        this.loading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true)
        }
      }
    },
    close(flag) {
      this.model = this.reduc()
      this.$emit('close', flag)
    },
    reduc() {
      let model = {
        name: '',
        username: '',
        password: ''
      }
      return model
    }
  }
}
</script>
