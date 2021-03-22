<template>
  <!-- 
  上传图片
  fileListData
 -->
  <div>
    <el-upload
      :action="baseUrl + '/api/v1/attachments/images/tencent_cloud'"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="success"
      :limit="maxLength"
      :multiple="multiple"
      :before-upload="beforeUpload"
      :file-list="fileList"
    >
      <i class="el-icon-plus myIcon"></i>
      <span class="tips">{{ tips }}</span>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" width="600px">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    // 最大上传限制
    maxLength: {
      type: Number,
      default: 1
    },
    // 是否支持多传
    multiple: {
      type: Boolean,
      default: true
    },
    // 上传按钮名称
    tips: {
      type: String,
      default: '上传图片'
    },
    // 上传类型 image 图片 video 视频
    type: {
      type: String,
      default: 'image'
    },
    // 限制大小
    size: {
      type: Number,
      default: 5
    },
    // 图片上传列表
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      isHasUpload: true
    }
  },
  methods: {
    handleRemove(file, fileList) {
      if (fileList.length == this.maxLength) {
        document.querySelector('.el-upload--picture-card').style.display = 'none'
      } else {
        document.querySelector('.el-upload--picture-card').style.display = 'inline-block'
      }
      let fileListData = []
      fileList.forEach((item) => {
        if (item.response) {
          fileListData.push({ url: item.response.data.imageUrl })
        } else {
          fileListData.push({ url: item.url.split('http://athena-1255600302.cosgz.myqcloud.com')[1] })
        }
      })
      this.$emit('fileListData', fileListData)
    },
    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = this.imgHost + file.url
      this.dialogVisible = true
    },
    beforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isSize = file.size / 1024 / 1024 < this.size
      if (!isImage) {
        this.$message.error('请上传正确格式图片')
      }
      if (!isSize) {
        this.$message.error(`请上传小于${this.size}M大小图片`)
      }
      return isImage && isSize
    },
    success(res, file, fileList) {
      console.log('这是', fileList)
      if (fileList.length == this.maxLength) {
        document.querySelector('.el-upload--picture-card').style.display = 'none'
      } else {
        document.querySelector('.el-upload--picture-card').style.display = 'inline-block'
      }
      let fileListData = []
      fileList.forEach((item) => {
        if (item.response) {
          fileListData.push({ url: item.response.data.imageUrl })
        } else {
          fileListData.push({ url: item.url.split('http://athena-1255600302.cosgz.myqcloud.com')[1] })
        }
      })
      console.log('返回的结果', fileListData)
      if (res.code === 20000) {
        this.$emit('fileListData', fileListData)
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload--picture-card i {
  font-size: 14px;
}
.tips {
  width: 100%;
  height: 16px;
  font-size: 14px;
  line-height: 16px;
  color: #8c939d;
}
</style>
