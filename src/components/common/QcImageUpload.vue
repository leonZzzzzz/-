<template>
  <!-- <div class="qc-image-upload"> -->
  <el-upload
    class="qc-image-upload"
    :style="style"
    :data="data"
    :action="baseUrl + '/api/v1/attachments/images/tencent_cloud'"
    :show-file-list="false"
    :before-upload="onBeforeUpload"
    :on-success="success"
  >
    <el-image v-if="value" :style="style" :src="`${isPrefix ? imgHost : ''}${value}`" fit="cover"></el-image>
    <div class="qc-image-upload__icon" v-else>
      <i class="icon el-icon-plus"></i>
    </div>
  </el-upload>
  <!-- </div> -->
</template>

<script>
export default {
  props: {
    isPrefix: {
      type: Boolean,
      default: true
    },
    value: String,
    // 图片上传的路径
    data: {
      type: Object,
      default: () => {
        return {
          imageType: 'common'
        }
      }
    },
    // 图片大小
    size: {
      type: Number,
      default: 2
    },
    // 图片宽高
    width: {
      type: String,
      default: '60px'
    },
    // 图片宽高
    height: {
      type: String,
      default: '60px'
    }
  },
  computed: {
    style() {
      return { width: this.width, height: this.height }
    }
  },
  methods: {
    onBeforeUpload(file) {
      console.log(file)
      const isIMG = { 'image/jpeg': true, 'image/png': true }[file.type] || false
      const isSIZE = file.size / 1024 / 1024 < this.size
      !isIMG && this.$message.error('图片只能是 JPG/PNG 格式!')
      !isSIZE && this.$message.error(`图片大小不能超过 ${this.size}M!`)
      console.log(isIMG, isSIZE)
      return isIMG && isSIZE
    },
    success(res) {
      if (res.code === 20000) {
        this.$emit('input', res.data.imageUrl)
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.qc-image-upload {
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  &:hover {
    border-color: #c0c4cc;
  }
  &__icon {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    text-align: center;
    .icon {
      position: absolute;
      font-size: 40px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #b5b5b5;
    }
  }
}
</style>
