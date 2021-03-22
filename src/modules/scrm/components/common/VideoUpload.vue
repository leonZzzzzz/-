<template>
  <div class="video-upload" :style="{ testAlign: showimage != 'videocate' ? 'center' : 'left' }">
    <div class="upload-btn">
      <!-- <input v-if="!loading" class="input" type="file" accept="video/*" @change="inputChange" />
      <div class="upload-wrap" v-if='!loading'>
        <i class="el-icon-plus"></i>
      </div> -->
      <div class="upload-box">
        <div class="upload-box__item" v-if="showimage != 'videocate'">
          <input v-show="!loading" class="input" type="file" accept="image/*" @change="inputChangeCover" />
          <el-button icon="el-icon-plus" :class="{ greenColor: coverFile }">{{
            !coverFile ? '选择封面' : '已选择'
          }}</el-button>
        </div>
        <div class="upload-box__item">
          <input v-show="!loading" class="input" type="file" accept="video/*" @change="inputChange" />
          <el-button icon="el-icon-plus" :class="{ greenColor: videoFile }">{{
            !videoFile ? '选择视频' : '已选择'
          }}</el-button>
        </div>
        <el-button v-show="!loading" icon="el-icon-upload" type="primary" @click="submitUpload">{{
          issuccess ? '已上传' : '确认上传'
        }}</el-button>
        <el-button
          v-show="loading"
          class="el-btn"
          icon="el-icon-upload"
          type="primary"
          :loading="loading"
          @click="submitUpload"
          >上传中 {{ (percent * 100).toFixed(0) }}%</el-button
        >
        <template v-if="showimage != 'videocate'">
          <el-button v-if="loading" class="el-btn" type="#E6A23C" @click="cancelUpload">取消</el-button>
        </template>
        <p class="tips">支持mp4格式，最大10MB</p>
      </div>
      <!-- <el-button v-if='loading' type="primary" :loading="loading">上传中…</el-button>
      <el-button v-if="loading" type="#E6A23C" @click="cancelUpload">取消</el-button> -->
    </div>
    <!-- <p class='video-upload__time' v-if="percent">上传进度 {{ (percent * 100).toFixed(0) }}%</p> -->
    <p class="video-upload__err" v-if="errMsg">{{ errMsg }}</p>
  </div>
</template>

<script>
// import TcVod from 'vod-js-sdk-v6'
export default {
  props: {
    showimage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      errMsg: '',
      videoUrl: '',
      percent: 0,
      coverFile: null,
      videoFile: null,
      uploader: {},
      issuccess: ''
    }
  },
  watch: {
    videoUrl(val) {
      this.uploadSuccess({
        fileId: '',
        coverUrl: '',
        videoUrl: val
      })
    }
  },
  methods: {
    inputChange(e) {
      console.log(e.target.files)
      let files = e.target.files
      let file = files[0]
      this.errMsg = ''
      if (!files.length) return
      const isMP4 = file.type === 'video/mp4'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isMP4) {
        return this.$message.warning('视频只能是 MP4 格式!')
      }
      if (!isLt10M) {
        return this.$message.warning('视频大小不能超过 10MB!')
      }
      this.videoFile = file
    },
    inputChangeCover(e) {
      console.log(e.target.files)
      let files = e.target.files
      let file = files[0]
      this.errMsg = ''
      if (!files.length) return
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.warning('图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.warning('图片大小不能超过 2MB!')
      }
      if ((isJPG || isPNG) && isLt2M) this.coverFile = file
    },
    submitUpload() {
      if (!this.videoFile) {
        return this.$message.warning('请选择视频!')
      }
      this.uploadFile()
    },
    getSignature() {
      return this.$http.uploadVideoSignature().then((res) => {
        return res.data.data.signature
      })
    },
    uploadFile(file) {
      this.loading = true
      this.errMsg = ''
      this.percent = 0
      try {
        const tcVod = new TcVod.default({
          getSignature: this.getSignature // 前文中所述的获取上传签名的函数
        })

        const uploader = tcVod.upload({
          mediaFile: this.videoFile, // 视频文件，类型为 File
          coverFile: this.coverFile // 封面文件，类型为 File
        })

        this.uploader = uploader
        console.log(this.uploader)

        uploader.on('media_progress', (info) => {
          this.percent = info.percent
          // console.log('上传进度==》'+info.percent) // 进度
        })

        uploader
          .done()
          .then((doneResult) => {
            this.loading = false
            this.uploadSuccess({
              fileId: doneResult.fileId,
              videoUrl: doneResult.video ? doneResult.video.url : '',
              coverUrl: doneResult.cover ? doneResult.cover.url : ''
            })
          })
          .catch((err) => {
            console.log(err)
            this.loading = false
            let errMsg = err && err.data && err.data.data.message ? err.data.data.message : JSON.stringify(err)
            this.errMsg = '上传失败，请重试' + errMsg
          })
      } catch (err) {
        this.loading = false
        this.errMsg = '上传失败，请重试'
      }
      // 回调结果说明
      // type doneResult = {
      //   fileId: string,
      //   video: {
      //     url: string
      //   },
      //   cover: {
      //     url: string
      //   }
      // }
    },
    // 取消上传
    cancelUpload() {
      if (this.uploader && this.uploader.os) this.uploader.cos.cancelTask(this.uploader.taskId)
      this.loading = false
      this.errMsg = ''
      console.log('取消')
    },
    uploadSuccess(val) {
      this.issuccess = val.videoUrl
      this.$message.success('上传成功')
      this.$emit('onSuccess', { video: val, file: this.videoFile })
    }
  }
}
</script>

<style lang="scss" scoped>
.video-upload {
  // text-align: center;
  &__tips {
    margin-top: 15px;
    line-height: 1.6;
    font-size: 12px;
    color: #666;
    word-wrap: break-word;
  }
  &__err {
    color: #f56c6c;
    font-size: 14px;
    margin-top: 5px;
  }
  &__time {
    margin-top: 5px;
  }

  .greenColor {
    color: #67c23a;
    border-color: #67c23a;
    background: rgba(103, 194, 58, 0.05);
  }

  .upload-btn {
    position: relative;
    display: inline-block;
    input {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    .upload-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 100px;
      padding: 0;
      font-size: 30px;
      color: #b5b5b5;
      border-radius: 0;
      border: 1px solid #ccc;
      background-color: #f9f9f9;
    }

    .upload-box {
      text-align: left;
      &__item {
        position: relative;
        // display: inline-block;
        margin-right: 15px;
        margin-bottom: 15px;
        cursor: pointer;
      }
      .el-btn {
        margin-left: 0;
        margin-right: 20px;
      }
      .tips {
        margin-top: 15px;
        font-size: 13px;
      }
    }
  }
}
</style>
