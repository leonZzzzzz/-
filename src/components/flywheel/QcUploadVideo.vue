<template>
  <div class="qc-upload-video">
    <p style="margin-bottom: 10px;color: #666;font-size: 14px;">上传视频和输入视频链接二选一</p>
    <div class="upload-btn">
      <input v-if="!loading" class="input" type="file" accept="video" @change="inputChange" />
      <el-button v-if="!loading" icon="el-icon-plus" plain :loading="loading">{{ text }}</el-button>
      <el-button v-else type="primary" :loading="loading">上传中…</el-button>
      <el-button v-if="loading" type="#E6A23C" @click="cancelUpload">取消</el-button>
    </div>
    <el-input placeholder="请输入视频链接" v-model="videoUrl" style="margin: 10px 0;" clearable> </el-input>

    <p class="qc-upload-video__time" v-if="percent">上传进度 {{ (percent * 100).toFixed(0) }}%</p>
    <p class="qc-upload-video__err" v-if="errMsg">{{ errMsg }}</p>
    <p class="qc-upload-video__tips">建议单个视频不超过10M， 一个页面最多不超过3个视频组件，展示效果以小程序为准</p>
    <pre class="qc-upload-video__tips">
    支持格式	iOS	Android
    mp4	       √	 √
    mov	       √	 x
    m4v	       √	 x
    3gp	       √	 √
    avi 	       √	 x
    m3u8	       √	 √
    webm	       x	 √
    </pre>
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
*/
export default {
  props: {
    text: {
      type: String,
      default: '上传视频'
    }
  },
  data() {
    return {
      loading: false,
      errMsg: '',
      percent: 0,
      videoUrl: '',
      uploader: {}
    }
  },
  watch: {
    videoUrl(val) {
      this.uploadSuccess({
        fileId: '',
        videoUrl: val,
        coverUrl: ''
      })
    }
  },
  methods: {
    inputChange(e) {
      console.log(e.target.files)
      let files = e.target.files
      this.errMsg = ''
      if (files.length > 0) {
        if (!files[0].type.includes('video')) {
          this.$message.warning('请选择视频文件')
          this.errMsg = '请选择视频文件'
          return
        }
        this.uploadFile(files[0])
      }
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
        // npm方式
        // const tcVod = new TcVod({
        //   getSignature: this.getSignature // 前文中所述的获取上传签名的函数
        // })
        // CDN方式
        const tcVod = new TcVod.default({
          getSignature: this.getSignature // 前文中所述的获取上传签名的函数
        })

        const uploader = tcVod.upload({
          mediaFile: file // 媒体文件（视频或音频或图片），类型为 File
        })

        this.uploader = uploader
        console.log(this.uploader)

        uploader.on('media_progress', (info) => {
          this.percent = info.percent
          console.log('上传进度==》' + info.percent) // 进度
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
        console.log(err)
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
      this.uploader.cos.cancelTask(this.uploader.taskId)
      this.loading = false
      this.errMsg = ''
    },
    uploadSuccess(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.qc-upload-video {
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
  }
}
</style>
