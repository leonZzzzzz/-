<template>
  <div
    class="file-upload-wrap"
    element-loading-spinner="el-icon-loading"
  >
    <el-upload
      v-if='progressFlag==false'
      class="upload-wrap"
      :action="action"
      :show-file-list="false"
      :before-upload="onBeforeUpload"
      :on-progress="onProgress"
      :on-success="success"
      :on-error="onError"
    >
      <div class="tip-text">
        <p class="icon el-icon-plus"></p>
      </div>
    </el-upload>
    <div v-show="progressFlag" class="head-img" style="z-index:8">
        <el-progress :stroke-width="14" :percentage="progressPercent" status="success"></el-progress>
    </div>
  </div>
</template>

<script>
import { BASEURL } from '@/utils/config'
export default {
  props: {
    // 上传后所属文件夹
    imageType: {
      type: String,
      default: 'scrm'
    },
    // 支持的文件类型
    fileTypes: {
      type: Array,
      default: () => {
        return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'ppt', 'pptx']
      }
    }
  },
  data() {
    return {
      isLoading: false, // 上传状态
      action: '',
      file: {
        name: '',
        address: ''
      },
      progressFlag:false,
      progressPercent:0
    }
  },
  mounted() {
    this.action = `${BASEURL}/api/v1/attachments/images/tencent_cloud?imageType=` + this.imageType
  },
  methods: {
    onBeforeUpload(file) {
      this.progressFlag = true; 
      const maxSize = file.size / 1024 / 1024 < 20 // 最大文件大小（MB）
      const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1) // 根据文件名截取文件类型
      // const types = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'ppt', 'pptx'] // 支持的文件类型
      const types = this.fileTypes
      if (!types.includes(fileSuffix)) {
        this.$message.error(`文件只能是 ${types.join('/')} 格式!`)
        this.progressFlag=false
      } else {
        if (!maxSize) {
          this.$message.error('文件大小不能超过 20MB!')
        } else {
          this.file.name = file.name
        }
        this.progressFlag=false
      }
      return types.includes(fileSuffix) && maxSize
    },
    onProgress(e, file) {
      this.isLoading = true
      this.progressFlag=true
      this.progressPercent = e.percent.toFixed(0)
      // console.log(e, file)
      // e的数据结构为 ProgressEvent {isTrusted: true, percent: 29.292282774199936, lengthComputable: true, loaded: 2375680, total: 8110259, …}
      // percent为上传进度
    },
    onError(e) {
      console.log(e)
      this.isLoading = false
    },
    success(e) {
      this.isLoading = false
      if (e.code === 20000) {
        this.file.address = e.data.imageUrl
        this.$emit('onSuccess', this.file)
        this.$message.success('上传成功')
        this.progressFlag = false; 
      } else {
        this.$message.error(e.message)
        this.progressFlag = false; 
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.file-upload-wrap {
  .upload-wrap {
    width: 100px;
    height: 100px;
    position: relative;
    border: 1px solid #ccc;
    overflow: hidden;
  }
  .tip-text {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    text-align: center;
    .icon {
      position: absolute;
      font-size: 30px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #b5b5b5;
    }
  }
}
</style>
