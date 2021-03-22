<template>
  <div class="image-upload-wrap">
    <el-upload
      class="upload-wrap"
      :action="action"
      :show-file-list="false"
      :before-upload="onBeforeUpload"
      :on-success="success"
    >
      <el-image
        v-if="imageUrl"
        style="width: 100px; height: 100px"
        :src="`${imgHost}${imageUrl}`"
        fit="cover"
      ></el-image>
      <div class="tip-text" v-else>
        <p class="icon el-icon-plus"></p>
      </div>
    </el-upload>
    <CropperNew
      :visible="visible"
      :imageType="imageType"
      :cropperOption="cropperOption"
      :on-close="
        () => {
          visible = false
        }
      "
      :on-success="success"
    ></CropperNew>
  </div>
</template>

<script>
import { BASEURL } from '@/utils/config'
export default {
  props: {
    // 上传后所属文件夹
    imageType: {
      type: String,
      default: 'common'
    },
    // 上传成功后显示的图片
    imageUrl: {
      type: String,
      default: ''
    },
    // 是否需要裁剪
    isCrop: {
      type: Boolean,
      default: false
    },
    // 裁剪的宽
    cropw: {
      type: Number,
      default: 150
    },
    // 裁剪的高
    croph: {
      type: Number,
      default: 150
    },
    enlarge: {
      type: Number,
      default: 1
    },
    onSuccess: {
      type: Function
    }
  },
  data() {
    return {
      action: '',
      visible: false,
      cropperOption: {
        img: '',
        autoCropWidth: 0,
        autoCropHeight: 0,
        autoCrop: true,
        fixedBox: true,
        canMoveBox: false
      }
    }
  },
  created() {
    this.cropperOption.autoCropWidth = this.cropw
    this.cropperOption.autoCropHeight = this.croph
    this.cropperOption.enlarge = this.enlarge
    this.action = `${BASEURL}/api/v1/attachments/images/tencent_cloud`
  },
  methods: {
    onBeforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      if (this.isCrop) {
        this.cropperOption.img = window.URL.createObjectURL(file)
        this.visible = true
        return false
      } else {
        return (isJPG || isPNG) && isLt2M
      }
    },
    success(e) {
      if (e.code === 20000) {
        this.onSuccess(e.data.imageUrl)
        this.$message.success('上传成功')
      } else {
        this.$message.error(e.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.image-upload-wrap {
  .upload-wrap {
    width: 100px;
    height: 100px;
    position: relative;
    border: 1px dashed #ccc;
    overflow: hidden;
  }
  .tip-text {
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
