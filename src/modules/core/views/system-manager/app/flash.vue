<template>
  <el-dialog
    :title="'调整企微限定人数'"
    :visible.sync="visible"
    width="480px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="model"
      ref="model"
      label-position="right"
      label-width="100px"
      size="medium"
    >
      <el-form-item
        label="人数扩容至"
        prop="volume"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input
          v-model="model.volume"
          type="number"
        ></el-input>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="close(false)"
      >取 消</el-button>
      <el-button
        size="medium"
        type="primary"
        @click="success()"
        :loading="loading"
      >确 定</el-button>
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
        volume: '',
        appId: ''
      },
      loading: false,
      dataLoading: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.model.appId = this.id
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
        let res = await this.$http.getexpansionTankPermission({ appId: this.id })
        this.model = res.data.data
        this.dataLoading = false
      } catch (err) {
        console.log(err)
      }
    },
    async saveModel(type) {
      try {
        await this.$http[type](this.model)
        this.loading = false
        this.$message({
          message: '扩容成功',
          type: 'success'
        })
        this.close(true)
      } catch (err) {
        this.loading = false
      }
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true
          this.saveModel('expansionPermission')
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
