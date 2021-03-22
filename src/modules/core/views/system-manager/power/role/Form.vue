<template>
  <el-dialog
    :title="id ? '修改账号' : '添加账号'"
    :visible.sync="visible"
    width="450px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-width="100px" label-position="right">
      <el-form-item label="角色名" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="角色标识" prop="role" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.role"></el-input>
      </el-form-item>
      <el-form-item label="角色信息" prop="description" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.description"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="seqNum">
        <el-input-number v-model="model.seqNum" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="是否冻结" prop="isFrozen">
        <el-checkbox v-model="model.isFrozen">冻结</el-checkbox>
      </el-form-item>
      <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-select v-model="model.type" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
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
        role: '',
        description: '',
        seqNum: 0,
        isFrozen: false,
        type: ''
      },
      dataLoading: false,
      loading: false,
      options: [
        { label: '用户角色', value: 'accountRole' },
        { label: '应用成员角色', value: 'userAccountRole' }
      ]
    }
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.id) {
          this.dataLoading = true
          this.detail()
        }
      }
    }
  },
  methods: {
    async detail() {
      try {
        let res = await this.$http.getRole({ id: this.id })
        this.model = res.data.data
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
          this.saveModel(this.id ? 'updateRole' : 'addRole')
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
          message: type === 'updateRole' ? '修改成功' : '添加成功',
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
      this.reduc()
      this.$emit('close', flag)
    },
    reduc() {
      this.model = {
        name: '',
        role: '',
        description: '',
        isFrozen: false
      }
    }
  }
}
</script>
