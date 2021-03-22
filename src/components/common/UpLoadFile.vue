<template>
  <div style="display: inline-block;">
    <el-upload
      :action="action"
      :show-file-list="false"
      :disabled="id == null"
      :on-success="fileSuccess"
      :on-error="fileError"
      :data="data"
      :before-upload="beforeFileUpload"
      :accept="accept"
    >
      <el-button :loading="isLoading" :size="size" :type="type" :disabled="id == null">{{ title }}</el-button>
    </el-upload>
  </div>
</template>

<script>
import { BASEURL } from '@/utils/config'

export default {
  props: {
    url: String,
    id: {
      default: null,
      type: String
    },
    fileType: Array,
    data: Object,
    title: {
      default: '导入',
      type: String
    },
    size: {
      default: 'mini',
      type: String
    },
    type: {
      default: 'primary',
      type: String
    },
    accept: {
      type: String,
      default: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
    }
  },
  data() {
    return {
      isLoading: false,
      action: '',
      file: {}
    }
  },
  mounted() {
    this.action = `${BASEURL}/${this.url}`
  },
  methods: {
    clearFiles() {
      this.$refs.upload.clearFiles()
    },
    beforeFileUpload(file) {
      if (!this.fileType || this.fileType.length == 0) {
        const type = file.name.split('.')[1] == 'xlsx' || file.name.split('.')[1] == 'xls'
        if (!type) {
          this.$message.error('请上传xlsx或xls')
        }
        this.file = file
        return type
      } else {
        const type = this.fileType.findIndex((item) => {
          return item === file.type
        })
        const size = file.size / 1024 / 1024 < 4
        if (type < 0) {
          this.$message.error('上传文件格式不正确')
          this.file = file
          return file
        }
        if (!size) {
          this.file = file
          this.$message.error('上传文件大小不能超过 4MB')
          return file
        }
      }
      this.isLoading = true
    },
    fileError(err) {
      this.isLoading = false
      this.$message({
        message: err || '上传失败',
        type: 'error'
      })
    },
    fileSuccess(res) {
      this.isLoading = false
      if (res.code === 20000) {
        this.$emit('file-success', this.file)
        this.file = {}
        this.$message({
          message: res.message || '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message || '上传失败',
          type: 'error'
        })
      }
    }
  }
}
</script>
