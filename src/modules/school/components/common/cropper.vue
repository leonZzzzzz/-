<template>
  <el-dialog title="裁剪图片" :visible.sync="visible" width="860px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="cropper-content">
      <div class="left">
        <el-upload
          style="margin-bottom: 5px;"
          ref="upload"
          action=""
          :on-change="handleChange"
          :before-upload="beforeUpload"
          :show-file-list="false"
          :auto-upload="false">
          <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
        </el-upload>
        <div class="cropper">
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
      <div class="show-preview" >
        <div :style="previews.div" class="preview">
          <img :src="previews.url" :style="previews.img">
        </div>
      </div>
    </div>
    <div class="cropper-btn">
      <el-button type="primary" size="small" @click="changeScale(1)" :disabled="currentImg === ''">
        <i class="el-icon-zoom-in"></i>
      </el-button>
      <el-button type="primary" size="small" @click="changeScale(-1)" :disabled="currentImg === ''">
        <i class="el-icon-zoom-out"></i>
      </el-button>
      <el-button type="primary" size="small" @click="rotate(1)" :disabled="currentImg === ''">↺</el-button>
      <el-button type="primary" size="small" @click="rotate()" :disabled="currentImg === ''">↻</el-button>
      <el-button type="primary" size="small" v-if="!crap && !option.fixedBox || !option.autoCrop" @click="crop(true)" :disabled="currentImg === ''">裁剪</el-button>
      <el-button type="primary" size="small"  v-if="crap && !option.fixedBox || !option.autoCrop" @click="crop(false)" :disabled="currentImg === ''">停止</el-button>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="upload()" :disabled="currentImg === ''" :loading="loading">上 传</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {VueCropper} from 'vue-cropper'
import api from "apiSchool/common";

export default {
  components: {
    VueCropper
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    imgUrl: String,
    imageType: String,
    uploadType: String,
    cropperOption: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      currentImg: '',
      previews: {},
      option: {
        img: '',
        outputType: 'png',
        canScale: true,
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: false,
        autoCropWidth: 300,
        autoCropHeight: 200,
        // fixed: true,
				// fixedNumber: [300, 320],
        fixedBox: false,
      },
      crap: false,
      file: {},
      loading: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.img = this.imgUrl
        if (this.img) {
          this.currentImg = this.imgHost + this.img
          console.log(this.currentImg);
        }
      }
    }
  },
  created() {
    this.option = Object.assign(this.option, this.cropperOption)
    if (this.imgUrl) {
      this.currentImg = this.imgHost + this.imgUrl
    }
  },
  methods: {
    // 关闭
    close() {
      this.$refs.cropper.clearCrop()
      this.$emit('close-cropper')
    },
    imgLoad(msg) {
      console.log(msg);
      if (msg === 'error') {
        this.currentImg = ''
      } else {
        this.$nextTick(() => {

          this.$refs.cropper.goAutoCrop
        })
      }
    },
    // 实时预览
    realTime(data) {
      this.previews = data
    },
    // 缩放
    changeScale(num) {
      num = num || 1
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
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
    },
    upload() {
      this.loading = true
      this.$refs.cropper.getCropData((data) => { 
        let file = this.dataURLtoFile(data, this.file.name)
        let params = new FormData()
        params.append('imageType', this.imageType)
        params.append('file', file)
        this.$http.upLoadImg(params).then(res => {
          this.$emit("get-uploadimg", res.data.data.imageUrl, this.uploadType);
          this.loading = false
          this.close()
        })
        .catch(() => {
          this.loading = false
        })
      })
    },
    handleChange(file) {
      console.log('handleChange',file);
      if (!this.beforeUpload(file)) {
        this.$refs.upload.clearFiles();
      } else {
        console.log(window.URL.createObjectURL(file.raw))
        this.currentImg = window.URL.createObjectURL(file.raw) || ''
        // this.currentImg = file.url
      }
    },
    beforeUpload(file) {
      this.file = file;
      const isJPG = file.raw.type === "image/jpeg" || file.raw.type === "image/png" || file.raw.type === "image/gif";
      // const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
      }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      return isJPG;
    }
  }
}
</script>

<style lang="scss" scoped>
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  .cropper{
    width: 400px;
    height: 400px;
  }
  .show-preview{
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 33px;
    .preview{
      overflow: hidden;
      // border: 1px solid #b3b3b3;
      box-sizing: border-box;
      background: #cccccc;
      margin-left: 20px;
    }
  }
}
.cropper-btn {
  padding: 10px 0;
  width: 400px;
  text-align: center;
}
</style>
