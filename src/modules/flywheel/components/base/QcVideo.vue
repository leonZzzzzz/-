<template>
  <div class="qc-video" :style="{ padding: `0px ${options.paddingLeftAndRight}px` }">
    <!-- <video 
      v-if="options.info && options.info.videoUrl" 
      :src='options.info.videoUrl'
      controls 
      :style="{ borderRadius: options.borderRadius+'px' }"
      >
      您的浏览器不支持 video 标签
      </video>
      v-else  -->

    <!-- <img 
      class="cover"
      src="./img/QcVideo.png" 
      :style="{ borderRadius: options.borderRadius+'px' }" /> -->
    <div
      :class="`cover ${options.info && options.info.videoUrl ? ' cover-a' : ''}`"
      :style="{ borderRadius: options.borderRadius + 'px' }"
    >
      {{ !options.info || !options.info.videoUrl ? '请上传视频' : '视频已上传，展示效果以小程序为准' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'QcVideo',
  title: '视频组件',
  props: {
    options: Object
  },
  config: [
    {
      label: '左右间距',
      formName: 'paddingLeftAndRight',
      type: 'el-input-number',
      value: 15
    },
    {
      label: '圆角',
      formName: 'borderRadius',
      type: 'el-input-number',
      value: 10
    },
    {
      label: '数据源',
      formName: 'info',
      type: 'qc-upload-video',
      value: {}
    }
  ],
  created() {
    console.log(this)
  }
  // info
  //  {
  //   fileId: string,
  //   videoUrl: string,
  //   coverUrl: string
  // }
}
</script>

<style lang="scss" scoped>
.qc-video {
  video {
    display: block;
    width: 100%;
    height: 160px;
    background: #666;
  }
  // .cover{
  //   display: block;
  //   width: 100%;
  //   height: 160px;
  // }
  .cover {
    width: 100%;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #c0c4cc;
    background: #f5f7fa;
    vertical-align: middle;
  }
  .cover-a {
    background: #666;
    color: #fff;
  }
}
</style>
