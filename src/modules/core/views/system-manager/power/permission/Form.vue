<template>
  <el-dialog
    :title="id ? '修改权限' : '添加权限'"
    :visible.sync="visible"
    width="480px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-position="right" label-width="90px" size="medium">
      <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="资源路径">
        <el-input v-model="model.url"></el-input>
      </el-form-item>
      <el-form-item label="权限字符串">
        <el-input v-model="model.permission"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="isDeleted" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-select v-model="model.isDeleted" placeholder="请选择" style="width:100%;">
          <el-option label="正常" :value="false"></el-option>
          <el-option label="作废" :value="true"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="model.seqNum" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="选中图标">
        <QcImageUpload v-model="model.activateIcon"></QcImageUpload>
      </el-form-item>
      <el-form-item label="未选中图标">
        <QcImageUpload v-model="model.icon"></QcImageUpload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close(false)">取 消</el-button>
      <el-button size="medium" type="primary" @click="success()" :loading="loading">确 定</el-button>
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
    parentId: String,
    resourceType: String
  },
  data() {
    return {
      digLogin: false,
      model: {
        name: '',
        resourceType: '',
        url: '',
        permission: '',
        parentId: '',
        seqNum: 0,
        activateIcon: '',
        icon: '',
        isDeleted: false
      },
      loading: false,
      dataLoading: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.model.parentId = this.parentId
        this.model.resourceType = this.resourceType
        if (this.id) {
          this.dataLoading = true
          this.getPermission()
        }
      }
    }
  },
  methods: {
    async getPermission() {
      try {
        let res = await this.$http.getPermission({ id: this.id })
        this.model = res.data.data
        this.dataLoading = false
      } catch (err) {}
    },
    async saveModel(type) {
      try {
        await this.$http[type](this.model)
        this.loading = false
        this.$message({
          message: type === 'updatePermission' ? '修改成功' : '添加成功',
          type: 'success'
        })
        this.close(true)
      } catch (err) {
        this.loading = false
      }
    },
    success() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.loading = true
          this.saveModel(this.id ? 'updatePermission' : 'addPermission')
        } else {
          return false
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
