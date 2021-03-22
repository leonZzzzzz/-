<template>
  <div
    class="image-upload-wrap"
    v-loading="isLoading"
    element-loading-text="上传中"
    element-loading-spinner="el-icon-loading"
  >
    <el-upload
      class="upload-wrap"
      :action="action"
      :data="{ imageType: imageType }"
      :show-file-list="false"
      :before-upload="onBeforeUpload"
      :on-progress="onProgress"
      :on-success="success"
      :on-error="onError"
    >
      <el-image
        v-if="value || imageUrl"
        style="width: 100px; height: 100px"
        :src="`${imgHost}${value || imageUrl}`"
        fit="cover"
      ></el-image>
      <div class="tip-text" v-else>
        <p class="icon el-icon-plus"></p>
      </div>
    </el-upload>
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
    // 上传成功后显示的图片
    value: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    onSuccess: {
      type: Function
    }
  },
  data() {
    return {
      isLoading: false, // 上传状态
      action: `${BASEURL}/api/v1/attachments/images/tencent_cloud`
    }
  },
  created() {},
  methods: {
    // 上传前，返回ture表示继续上传 返回false终止上传
    onBeforeUpload(file) {
      this.file = file
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    // 上传中
    onProgress(e, file) {
      this.isLoading = true
      // console.log(e, file)
      // e的数据结构为 ProgressEvent {isTrusted: true, percent: 29.292282774199936, lengthComputable: true, loaded: 2375680, total: 8110259, …}
      // percent为上传进度
    },
    onError(e) {
      console.log(e)
      this.isLoading = false
    },
    // 上传完成
    success(e) {
      this.isLoading = false
      if (e.code === 20000) {
        // 上传成功
        this.$emit('input', e.data.imageUrl)
        this.$emit('onSuccess', { url: e.data.imageUrl, file: this.file })
        this.onSuccess && this.onSuccess(e.data.imageUrl, this.file)
        this.$message.success('上传成功')
      } else {
        this.$message.error(e.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.image-upload-wrap {
  .upload-wrap {
    width: 48px;
    height: 48px;
    position: relative;
    border: 1px solid #ccc;
    overflow: hidden;
    margin-left: 5px;
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
