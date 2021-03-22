<template>
  <el-dialog
    :title="id ? '修改' : '添加'"
    :visible.sync="visible"
    width="450px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" size="medium" ref="model" label-width="120px" label-position="left">
      <el-form-item label="物流公司名称" prop="value" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.value" maxlength="16"></el-input>
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
    item: Object
  },
  data() {
    return {
      model: {
        type: 2,
        name: '物流公司',
        value: '',
        seqNum: '',
        showType: 1,
        parentId: 'SHOPPING_LOGISTICS_COMPANY'
      },
      loading: false
    }
  },
  watch: {
    visible(val) {
      if (val && this.id) {
        this.model = this.item
      }
    }
  },
  methods: {
    //添加
    addLogisticsCompany() {
      this.$http
        .addLogisticsCompany(this.model)
        .then(() => {
          this.loading = false
          this.$message.success('添加成功')
          this.close(true)
        })
        .catch(() => {
          this.loading = false
        })
    },
    //修改
    updateLogisticsCompany() {
      this.$http
        .updateLogisticsCompany(this.model)
        .then(() => {
          this.loading = false
          this.$message.success('修改成功')
          this.close(true)
        })
        .catch(() => {
          this.loading = false
        })
    },
    success() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          console.log('提交的数据：', this.model)
          this.loading = true
          this.id ? this.updateLogisticsCompany() : this.addLogisticsCompany()
        }
      })
    },
    close(flag) {
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      this.$emit('close', flag)
    }
  }
}
</script>
