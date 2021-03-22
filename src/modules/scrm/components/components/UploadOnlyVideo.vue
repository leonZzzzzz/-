<template>
  <!--   xfo
  <UploadOnlyVideo :url="url" @success="videoUploadSuccess"></UploadOnlyVideo>

  url 视频完整路径 如 https://XXX
  返回数据
  {
    fileId: '腾讯云文件id',
    videoUrl: '视频路径',
  }
 -->
  <div>
    <label class="upload-video-btn" v-if="!videoUrl">
      <input ref="xfoFile" type="file" accept="video/*" v-show="false" @input="getFile" />
      <i class="el-icon-plus"></i>上传视频
    </label>
    <div v-else class="show-video">
      <i class="el-icon-circle-close xfo-icon" @click="closeVideoShow"></i>
      <video width="100%" :src="videoUrl" controls></video>
      <el-progress v-if="percent != 100" class="xfo-progress" :percentage="percent"></el-progress>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  watch: {
    url() {
      this.videoUrl = this.url
    }
  },
  data() {
    return {
      videoUrl: '',
      uploader: '',
      percent: ''
    }
  },
  methods: {
    getFile() {
      let inp = this.$refs.xfoFile
      let reader = new FileReader()
      let _this = this
      if (!/video\/\w+/.test(inp.files[0].type)) {
        this.$message.warning('请上传视频')
        return false
      }
      reader.readAsDataURL(inp.files[0])
      reader.onload = function (evt) {
        _this.uploadFile(inp.files[0])
        _this.videoUrl = this.result
      }
    },
    getSignature() {
      return this.$http.uploadVideoSignature().then(res => {
        return res.data.data.signature
      })
    },
    uploadFile(file) {
      this.percent = 0
      try {
        const tcVod = new TcVod.default({
          getSignature: this.getSignature // 前文中所述的获取上传签名的函数
        })

        const uploader = tcVod.upload({
          mediaFile: file
        })

        this.uploader = uploader
        uploader.on('media_progress', info => {
          this.percent = parseInt(info.percent * 100)
        })

        uploader
          .done()
          .then(doneResult => {
            let result = {
              fileId: doneResult.fileId,
              videoUrl: doneResult.video ? doneResult.video.url : ''
            }
            this.$emit('success', result)
            this.$message.success('上传成功')
          })
          .catch(err => {
            let errMsg = err && err.data && err.data.data.message ? err.data.data.message : JSON.stringify(err)
            this.$message.error('上传失败，请重试' + errMsg)
          })
      } catch (err) {
        this.$message.error('上传失败，请重试')
      }
    },
    // 取消上传
    cancelUpload() {
      this.uploader.cancel()
    },
    closeVideoShow() {
      this.videoUrl = ''
      this.cancelUpload()
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-video-btn,
.show-video {
  width: 148px;
  height: 148px;
  border: 1px dashed #c0ccda;
  border-radius: 10px;
  background-color: #fbfdff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #8c939d;
  &:hover {
    border-color: #294a7b;
  }
}
.show-video {
  position: relative;
  .xfo-icon {
    z-index: 8888;
    font-size: 24px;
    position: absolute;
    top: 0;
    right: 0;
    color: #dcdfe6;
    &:hover {
      color: #f68080;
      cursor: pointer;
    }
  }
  .xfo-progress {
    width: calc(100% - 10px);
    position: absolute;
    left: 5px;
    bottom: 0;
  }
}
</style>