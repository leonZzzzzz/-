<template>
  <div>
    <div v-if="imageType">
      <el-upload
        v-loading="loading"
        v-if="uploadType === 'radio'"
        ref="upload"
        class="upload-img-box"
        :action="action"
        :data="{ imageType: imageType }"
        accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
        :before-upload="beforeUpload"
        :on-success="imgSuccess"
        :on-error="imgFail"
      >
        <img v-if="imageUrl" :src="`${imgHost}${imageUrl}`" style="width: 120px;" />
        <i v-else class="el-icon-plus upload-icon"></i>
      </el-upload>
      <el-upload
        v-else
        ref="upload"
        multiple
        :action="action"
        list-type="picture-card"
        accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
        :data="{ imageType: imageType }"
        :before-upload="beforeUpload"
        :on-success="imgSuccess"
        :on-error="imgFail"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus upload-icon"></i>
      </el-upload>
    </div>
    <div v-else>
      <p>应用组件需传imageType（imageType="xxxx"）！</p>
    </div>
    <!-- <el-button
      type="danger"
      size="mini"
      style="margin: 10px;"
      @click.native="getImg('')"
      v-if="imageUrl"
    >删除</el-button> -->
  </div>
</template>

<script>
import { BASEURL } from '@/utils/config'
function noop() {}

export default {
  props: {
    url: String,
    imageUrl: String,
    imageType: String,
    uploadType: {
      type: String,
      default: 'radio' // 单选 radio, 多选 select
    },
    onSuccess: {
      type: Function,
      default: noop
    }
  },
  data() {
    return {
      thumbnail: '',
      dialogImageUrl: '',
      dialogVisible: false,
      action: '',
      fileList: [],
      loading: false
    }
  },
  mounted() {
    this.action = `${BASEURL}/api/v1/attachments/images/tencent_cloud`
  },
  methods: {
    clearFiles() {
      this.$refs.upload.clearFiles()
    },
    getImg(val) {
      this.onSuccess(val)
      this.$refs.upload.clearFiles()
    },
    getImglist(list) {
      console.log('fileList', list)
      this.fileList = list
      this.$emit('get-uploadimglist', list)
    },
    // FIX: 解决上传图片后重新打开弹出框，点击确定会出现请上传或选择图片的限制
    getFileList() {
      console.log(this.fileList)
      this.$emit('get-uploadimglist', this.fileList)
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      this.loading = true
      return isJPG && isLt2M
    },
    imgSuccess(res, file, fileList) {
      this.loading = !true
      if (res.code === 20000) {
        if (this.uploadType === 'radio') this.getImg(res.data.imageUrl)
        else {
          this.getImglist(fileList)
        }
      } else {
        if (this.uploadType === 'select') {
          fileList.map((item, i) => {
            if (file.uid === item.uid) {
              fileList.splice(i, 1)
            }
          })
        }
        this.$message.error(res.message)
      }
    },
    imgFail(err, file, fileList) {
      this.loading = !true
      console.log('上传失败 ', err, file, fileList)
      if (this.uploadType === 'select') {
        fileList.map((item, i) => {
          if (file.uid === item.uid) {
            fileList.splice(i, 1)
          }
        })
      }
      this.$message.error(err.data.message)
    },
    handleRemove(file, fileList) {
      fileList.map((item, i) => {
        if (file.uid === item.uid) {
          fileList.splice(i, 1)
        }
      })
      this.getImglist(fileList)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-upload--picture-card {
  width: 120px;
  height: 120px;
  line-height: 120px;
}
.el-upload-list--picture-card .el-upload-list__item {
  width: 120px;
  height: 120px;
}
</style>
