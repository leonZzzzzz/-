<template>
  <!-- 上传视频 参考企业动态圈 xfo-->
  <!-- 
  【引入示例】
  import UploadVideo from '../../../components/components/UploadVideo'

  【使用示例】
  <UploadVideo :fileList="videoFileList" @success="videoSuccess"></UploadVideo>

  【属性】
  参数         类型                说明                          可选值           默认值
  fileList    object       上传成功的文件，用以回绑显示内容，      --               --
                           具体参考【属性说明】

  【属性说明】
  参数                     示例
  fileList        {fileId: '5285890809543471296',
                   coverUrl:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                   videoUrl:'http://1255600302.vod2.myqcloud.com/cc5a8997vodgzp1255600302/4dc550345285890809543471296/maF9Z6icJKYA.mp4'}                  
  
  【方法】
  方法名           类型                说明                         参数
  success     function(val){}     上传成功后的钩子              val，上传成功文件返回值（coverUrl[封面地址],fileId[文件id],videoUrl[视频地址]）具体参考【方法说明】
                                                                                                                                        
  【方法说明】
  方法名                  示例
  success          [{ coverUrl: "http://1255600302.vod2.myqcloud.com/cc5a8997vodgzp1255600302/0b10cef25285890809708646125/5285890809708646126.jpg"
                   fileId: "5285890809708646125"
                   videoUrl: "http://1255600302.vod2.myqcloud.com/cc5a8997vodgzp1255600302/0b10cef2528}] 
   -->
  <div class="video-upload">
    <div class="upload-btn">
      <div class="upload-box">
        <div class="upload-box__item">
          <input v-show="!loading" class="input" type="file" accept="image/*" @change="inputChangeCover" />
          <el-button icon="el-icon-plus" size="small" :class="{ greenColor: coverFile || fileList.coverUrl }"
            >选择封面</el-button
          >
        </div>
        <div class="upload-box__item">
          <input v-show="!loading" class="input" type="file" accept="video/*" @change="inputChange" />
          <el-button icon="el-icon-plus" size="small" :class="{ greenColor: videoFile || fileList.videoUrl }"
            >选择视频</el-button
          >
        </div>
        <div class="upload-box__item">
          <el-button v-show="!loading" icon="el-icon-upload" size="small" type="primary" @click="submitUpload" plain
            >确认上传</el-button
          >
          <el-button
            v-show="loading"
            class="el-btn"
            icon="el-icon-upload"
            type="primary"
            size="small"
            :loading="loading"
            @click="submitUpload"
            style="margin-right: 10px"
            >上传中 {{ (percent * 100).toFixed(0) }}%</el-button
          >
          <el-button v-if="loading" class="el-btn" size="small" type="#E6A23C" @click="cancelUpload">取消</el-button>
        </div>
      </div>
    </div>
    <div class="details">
      <div class="image">
        <el-image style="width: 148px; height: 148px" :src="fileList.coverUrl" :preview-src-list="[fileList.coverUrl]">
          <div slot="error" class="image-slot">上传图片(JPG/PNG)</div>
        </el-image>
      </div>
      <div :class="['video', fileList.videoUrl ? 'preview' : '']">
        <i
          :class="dialogVisible ? 'el-icon-video-pause' : 'el-icon-video-play'"
          v-if="fileList.videoUrl"
          @click="previewVideo"
        ></i>
        <div class="tips" v-else>上传视频(MP4)</div>
      </div>
    </div>
    <!-- 视频预览 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
      modal
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <video style="width: 100%" autoplay controls id="video">
        <source :src="fileList.videoUrl" type="video/mp4" />
      </video>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 已在index.html使用CDN引入
 * import TcVod from 'vod-js-sdk-v6'
 *
 * 注意： 如果腾讯云开启了防盗链，那么下面的上传接口返回的 URL 是不能直接播放的
 * 需要调用我们接口：api/v1/vod/file/get 拿到返回的url 和签名数据 拼接起来 才是播放的URL 
 * 例：
 * const res = await getVideoDetail({fileId: fileId});
    let data = res.data.data
    let url = data.file.url + data.playSignature.queryString
    fileList.videoUrl
*/
export default {
  props: {
    fileList: {
      type: Object,
      default: () => {
        return {
          fileId: '',
          coverUrl: '',
          videoUrl: ''
        }
      }
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
      imagePreviewUrl: '',
      videoPreviewUrl: '',
      dialogVisible: false
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
      if (!this.coverFile) {
        return this.$message.warning('请选择封面!')
      }
      if (!this.videoFile) {
        return this.$message.warning('请选择视频!')
      }
      this.uploadFile()
    },
    getSignature() {
      return this.$http.uploadVideoSignature().then((res) => {
        console.log(res.data.data.signature)
        return res.data.data.signature
      })
    },
    uploadFile(file) {
      this.loading = true
      this.errMsg = ''
      this.percent = 0
      try {
        console.log('this.getSignature', this.getSignature)
        const tcVod = new TcVod.default({
          getSignature: this.getSignature // 前文中所述的获取上传签名的函数
        })

        const uploader = tcVod.upload({
          mediaFile: this.videoFile, // 视频文件，类型为 File
          coverFile: this.coverFile // 封面文件，类型为 File
        })

        this.uploader = uploader
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
            this.loading = false
            let errMsg = err && err.data && err.data.data.message ? err.data.data.message : JSON.stringify(err)
            this.errMsg = '上传失败，请重试' + errMsg
          })
      } catch (err) {
        this.loading = false
        this.errMsg = '上传失败，请重试'
      }
    },
    // 取消上传
    cancelUpload() {
      if (this.uploader && this.uploader.os) this.uploader.cos.cancelTask(this.uploader.taskId)
      this.loading = false
      this.errMsg = ''
    },
    uploadSuccess(val) {
      this.fileList.coverUrl = val.coverUrl
      this.fileList.videoUrl = val.videoUrl
      this.$message.success('上传成功')
      this.$emit('success', val)
    },
    previewVideo() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.video-upload {
  .greenColor {
    color: #294a7b;
    border-color: #294a7b;
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
      // text-align: left;
      display: flex;
      &__item {
        position: relative;
        // display: inline-block;
        margin-right: 10px;
        // margin-bottom: 13px;
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
  .details {
    margin-top: 13px;
    display: flex;
    .image,
    .video {
      width: 148px;
      height: 148px;
      border: 1px dashed #c0ccda;
      background-color: #fbfdff;
      border-radius: 6px;
      overflow: hidden;
      ::v-deep .el-image__error {
        background-color: #fbfdff;
      }
    }
    .image {
      .el-image {
        display: flex;
        justify-content: center;
        align-items: center;
        ::v-deep .image-slot {
          width: 100%;
          height: 16px;
          font-size: 14px;
          line-height: 16px;
          color: #8c939d;
          text-align: center;
        }
      }
    }
    .video {
      margin-left: 13px;
      display: flex;
      justify-content: center;
      align-items: center;
      &.preview {
        background-color: #4c4c4c;
      }
      i {
        font-size: 40px;
        color: #ffffff;
        cursor: pointer;
      }
      .tips {
        width: 100%;
        height: 16px;
        font-size: 14px;
        line-height: 16px;
        color: #8c939d;
        text-align: center;
      }
    }
  }
}
</style>
