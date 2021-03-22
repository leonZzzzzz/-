<template>
  <div style="display: flex; justify-content: center;">
    <div class="video-content" :style="{ width: width, height: height }">
      <video :style="{ width: width, height: height }" controls></video>
      <div class="video-wrap" :style="{ width: width, height: height }" @click="showVideoDialog">
        <i class="el-icon-video-play" />
      </div>
    </div>
    <com-dialog :config="config" @closeDialog="closeVideoDialog">
      <div class="video-dialog">
        <video :src="videoUrl" style="width: 800px; height: 450px;" controls></video>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComDialog from './ComDialog'
export default {
  components: {
    ComDialog
  },
  props: {
    videoData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    playUrl: {
      type: String,
      default: () => {
        return ''
      }
    },
    height: {
      type: String,
      default: () => {
        return '90px'
      }
    },
    width: {
      type: String,
      default: () => {
        return '120px'
      }
    },
    source: { // source值为edit时，提示用户稍后重试；
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      config: {
        width: '840px',
        title: '视频详情',
        visible: false
      },
      videoUrl: ''
    }
  },
  methods: {
    showVideoDialog() {
      // console.log('点击视频')
      let fileId = this.videoData.fileId
      // 上传视频成功后立即通过fileId去获取视频文件可能会提示文件不存在问题，需提示用户稍后重试
      if (this.source == 'edit') {
        this.$http.getVideoSignatureDetail({ fileId }).then((res) => {
          this.videoUrl = res.data.data.file.url + res.data.data.playSignature.queryString
          this.config.visible = true
        })
        .catch(() => {
          this.$message.warning('视频文件正在处理中，请稍后重试')
        })
      } else {
        this.$http.getVideoSignatureDetail({ fileId }).then((res) => {
          this.videoUrl = res.data.data.file.url + res.data.data.playSignature.queryString
        })
        this.config.visible = true
      }
    },
    closeVideoDialog() {
      this.videoUrl = ''
      this.config.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.video-content {
  position: relative;
  width: 120px;
  height: 90px;
  .video-wrap {
    position: absolute;
    width: 120px;
    height: 90px;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .el-icon-video-play {
      font-size: 32px;
      color: #ffffff;
      // background-color: #000;
      border-radius: 16px;
    }
  }
}
</style>
