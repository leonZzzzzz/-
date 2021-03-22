<template>
  <el-dialog
    :title="id ? '修改' : '添加'"
    :visible.sync="visible"
    width="400px"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-width="80px" label-position="left">
      <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="seqNum" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input-number v-model="model.seqNum"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer">
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
    },
    type: [Number]
  },
  data() {
    return {
      model: {
        type: '',
        name: '',
        seqNum: 0
      },
      loading: false
    }
  },
  watch: {
    visible(val) {
      if (val && this.id) {
        this.getTag()
      }
    }
  },
  methods: {
    //获取
    async getTag() {
      try {
        let res = await this.$http.getTag({ id: this.id })
        this.model = res.data.data
      } catch (err) {}
    },
    success() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.model.type = this.type
          this.saveModel(this.id ? 'updateTag' : 'addTag')
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
          message: type === 'updateTag' ? '修改成功' : '添加成功',
          type: 'success'
        })
        this.close(true)
      } catch (err) {
        this.loading = false
      }
    },
    close(flag = false) {
      this.$emit('close', flag)
      this.clearForm('model')
    }
  }
}
</script>
