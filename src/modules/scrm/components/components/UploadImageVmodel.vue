<template>
<!-- xfo 著 -->
<!-- 
  import UploadImageVmodel from '@/modules/scrm/components/components/UploadImageVmodel.vue'

  <upload-image-vmodel :width="120" :height="120" v-model="companyInfo.logo"></upload-image-vmodel>
 -->
  <div>
    <el-upload
      class="avatar-uploader"
      :action="baseUrl + '/api/v1/attachments/images/tencent_cloud'"
      :data="data"
      :show-file-list="false"
      :on-success="onSuccess"
      :before-upload="beforeUpload"
    >
      <el-image
        v-if="value"
        :style="style"
        :src="`${isPrefix ? imgHost : ''}${value}`"
        fit="cover"
        class="avatar"
      ></el-image>
      <i v-else class="el-icon-plus avatar-uploader-icon" :style="style"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 5
    },
    value: String,
    isPrefix: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 148
    },
    height: {
      type: Number,
      default: 148
    },
    data: {
      type: Object,
      default: () => {
        return {
          imageType: 'qc'
        }
      }
    }
  },
  computed: {
    style() {
      return `width:${this.width}px;height:${this.height}px;line-height:${this.height}px;`
    }
  },
  methods: {
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < this.size
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 ' + this.size + 'MB!')
      }
      return isJPG && isLt2M
    },
    onSuccess(res, file) {
      this.$emit('input', res.data.imageUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
  border: 1px dashed #c0ccda;
  border-radius: 4px;
  background-color: #fbfdff;
}
.avatar {
  display: block;
  border-radius: 4px;
  border: 1px dashed #c0ccda;
}
</style>
