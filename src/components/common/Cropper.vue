<template>
  <el-dialog
    title="裁剪图片"
    :visible.sync="visible"
    :width="`${cropperBox.width + 60}px`"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="imgs-dialog"
  >
    <div class="cropper-content">
      <div class="left">
        <div class="cropper" :style="{ width: `${cropperBox.width}px`, height: `${cropperBox.height}px` }">
          <vueCropper
            ref="cropper"
            :img="currentImg"
            :canScale="option.canScale"
            :outputType="option.outputType"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :fixedBox="option.fixedBox"
            @realTime="realTime"
            @imgLoad="imgLoad"
          ></vueCropper>
        </div>
      </div>
    </div>
    <div class="cropper-btn">
      <el-upload
        style="display: inline; margin-right: 20px"
        ref="upload"
        action=""
        :on-change="handleChange"
        :before-upload="beforeUpload"
        :show-file-list="false"
        accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
      </el-upload>
      <el-button type="primary" size="mini" @click="changeScale(0.5)" :disabled="currentImg === ''">
        <i class="el-icon-zoom-in"></i>
      </el-button>
      <el-button type="primary" size="mini" @click="changeScale(-0.5)" :disabled="currentImg === ''">
        <i class="el-icon-zoom-out"></i>
      </el-button>
      <el-button type="primary" size="mini" @click="rotate(1)" :disabled="currentImg === ''">↺</el-button>
      <el-button type="primary" size="mini" @click="rotate()" :disabled="currentImg === ''">↻</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="!crap && !option.fixedBox"
        @click="crop(true)"
        :disabled="currentImg === ''"
        >裁剪</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="crap && !option.fixedBox"
        @click="crop(false)"
        :disabled="currentImg === ''"
        >停止</el-button
      >
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="upload()" :disabled="currentImg === ''" :loading="loading"
        >上 传</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { VueCropper } from 'vue-cropper'

function noop() {}

export default {
  components: {
    VueCropper
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    imageType: String,
    cropperOption: {
      type: Object,
      default: () => {
        return {}
      }
    },
    onClose: {
      type: Function,
      default: noop
    },
    onSuccess: {
      type: Function,
      default: noop
    }
  },
  data() {
    return {
      currentImg: '',
      previews: {},
      option: {
        img: '',
        high: !false,
        outputSize: 1,
        canScale: true,
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: false,
        autoCropWidth: 500,
        autoCropHeight: 500,
        // fixed: true,
        // fixedNumber: [300, 320],
        fixedBox: false,
        mode: 'contain',
        full: true,
        infoTrue: true,
        enlarge: 200
      },
      crap: false,
      file: {},
      loading: false,
      cropperBox: {
        width: 0,
        height: 0,
        default: 500
      }
    }
  },
  created() {
    this.option = Object.assign(this.option, this.cropperOption)
    this.cropperBox.width =
      this.option.autoCropWidth > this.cropperBox.default ? this.option.autoCropWidth : this.cropperBox.default
    this.cropperBox.height =
      this.option.autoCropHeight > this.cropperBox.default ? this.option.autoCropHeight : this.cropperBox.default
    this.crap = this.option.autoCrop
  },
  methods: {
    // 关闭
    close() {
      this.$refs.cropper.clearCrop()
      this.onClose()
    },
    imgLoad(msg) {
      if (msg === 'error') this.currentImg = ''
    },
    // 实时预览
    realTime(data) {
      this.previews = data
    },
    // 缩放
    changeScale(num) {
      num = num || 0.5
      this.$refs.cropper.changeScale(num)
    },
    // 旋转
    rotate(val) {
      if (val) this.$refs.cropper.rotateLeft()
      else this.$refs.cropper.rotateRight()
    },
    // 开始/结束裁剪
    crop(state) {
      this.crap = state
      if (state) this.$refs.cropper.startCrop()
      else this.$refs.cropper.stopCrop()
    },
    //将base64转换为文件
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    upload() {
      this.loading = true
      this.$refs.cropper.getCropData((data) => {
        let file = this.dataURLtoFile(data, this.file.name)
        let params = new FormData()
        params.append('imageType', this.imageType)
        params.append('file', file)
        this.$http
          .upLoadImg(params)
          .then((res) => {
            this.onSuccess(res.data.data.imageUrl)
            this.loading = false
            this.close()
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    handleChange(file) {
      if (!this.beforeUpload(file)) {
        this.$refs.upload.clearFiles()
      } else {
        console.log(file)
        console.log(window.URL.createObjectURL(file.raw))
        this.currentImg = window.URL.createObjectURL(file.raw) || ''
      }
    },
    beforeUpload(file) {
      console.log(file)
      this.file = file
      const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png' || file.raw.type === 'image/gif'
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!')
      }
      return isJPG
    }
  }
}
</script>

<style lang="scss" scoped>
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  justify-content: center;
  .show-preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
    background: #f5f5f5;
    .preview {
      overflow: hidden;
      // border: 1px solid #b3b3b3;
      box-sizing: border-box;
      background: #cccccc;
      // margin-left: 20px;
    }
  }
}
.cropper-btn {
  padding: 10px 30px;
  // width: 400px;
  // text-align: center;
}
.imgs-dialog {
  margin: 0 !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .el-dialog__body {
    // padding: 0 20px;
    padding: 0;
  }
}
</style>
