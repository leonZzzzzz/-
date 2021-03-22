<template>
  <div style="display: inline-block; margin-left: 10px;">
    <el-upload
      :action="action"
      :show-file-list="false"
      :on-success="fileSuccess"
      :data="data"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      :before-upload="beforeFileUpload"
    >
      <el-button :size="size" type="info" :loading="loading">{{title}}</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    url: String,
    id: {
      default: null,
      type: String
    },
    data: Object,
    title: {
      default: '导入',
      type: String
    },
    size: {
      default: 'mini',
      type: String
    },
    errTip: {
      default: true,
      type: Boolean
    },
    successTip: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      action: '',
      loading: false
    }
  },
  mounted() {
    this.action = `${this.baseUrl}/${this.url}`
  },
  methods: {
    clearFiles() {
      this.$refs.upload.clearFiles()
    },
    beforeFileUpload(file) {
      this.loading = true
      const type = file.name.split('.')[1] == 'xlsx' || file.name.split('.')[1] == 'xls'
      if (!type) {
        this.loading = !true
        this.$message.error('请上传xlsx或xls')
      }
      return type
    },
    fileSuccess(res) {
      if (res.code === 20000) {
        if (this.successTip) {
          this.$message({
            message: res.message,
            type: 'success'
          })
        }
        this.$emit('file-success', res.data)
      } else {
        if (this.errTip) {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
        this.$emit('file-error', res.data)
      }
      this.loading = !true
    }
  }
}
</script>
