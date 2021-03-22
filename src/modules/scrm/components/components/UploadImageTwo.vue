<template>
  <!-- 
  上传图片 参考新建欢迎语 xfo-->
  <!-- 
 【引入示例】
  import UploadImage from '../../../components/components/UploadImage'

 【使用示例】
  <UploadImage :width='100' :height='100' :maxLength="9" :fileList="imageFileList" @success="imageSuccess"></UploadImage>

 【属性】
  参数         类型                说明                          可选值            默认值
  width       number            图片显示宽度                      --                146
  height      number            图片显示高度                      --                146
  maxLength   number            图片上传最大个数                  --                 1
  fileList    array       上传成功的文件，用以回绑显示内容，       --                --
                           具体参考【属性说明】

 【属性说明】
  参数                     示例
  fileList            [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}] 
  
 【方法】
  方法名           类型                说明                         参数
  success     function(val){}     上传成功后的钩子              val，上传成功文件返回值（name[图片名称],fileId[文件id],url[图片地址]）具体参考【方法说明】
                                                                                                                                        
 【方法说明】
 方法名            示例
 success        [{fileId: 1604656037644,
                 name: "u=1593106255,4245861836&fm=26&gp=0.jpg",
                 url: "/attachments/null/f903fa0ec5e9465284dc521d0cabd954.jpg"}]
  -->
  <div>
    <el-upload
      :action="baseUrl + '/api/v1/attachments/images/tencent_cloud'"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="success"
      :data="{ imageType: imageType }"
      :limit="maxLength"
      :multiple="multiple"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :on-exceed="onExceed"
    >
      <i class="el-icon-plus myIcon"></i>
      <span class="tips">{{ tips }}</span>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" :append-to-body="true" width="600px">
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
    // 限制大小
    size: {
      type: Number,
      default: 5
    },
    width: {
      type: Number,
      default: 146
    },
    height: {
      type: Number,
      default: 146
    },
    // 上传后所属文件夹
    imageType: {
      type: String,
      default: 'scrm'
    },
    // 图片上传列表
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    fileList: {
      handler: function() {
        this.$nextTick(function() {
          this.showUploadButton(this.fileList)
        })
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setUpoadImageBtnSize(this.width, this.height)
    })
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.showUploadButton(fileList)
      let result = this.formatImageData(fileList)
      this.$emit('success', result)
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true
      if (file.url.includes('http')) {
        this.dialogImageUrl = file.url
      } else {
        this.dialogImageUrl = this.imgHost + file.url
      }
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
      this.$nextTick(() => {
        this.setUpoadImagePicSize(this.width, this.height)
      })
      return isImage && isSize
    },
    onExceed() {
      this.$message.error(`请上传小于${this.maxLength}张图片`)
    },
    success(res, file, fileList) {
      console.log('上传成功', res)
      this.showUploadButton(fileList)
      let result = this.formatImageData(fileList)
      console.log('return', result)
      this.$emit('success', result)
    },
    formatImageData(option) {
      let arr = []
      let reg = new RegExp(this.imgHost)
      option.forEach((item) => {
        if (!item.response) {
          let url = ''
          if (reg.test(item.url)) {
            url = item.url.split(reg)[1]
          } else {
            url = item.url || ''
          }
          arr.push({
            name: item.name || '',
            fileId: item.uid || '',
            url
          })
          return
        } else {
          arr.push({
            name: item.name || '',
            fileId: item.uid || '',
            url: item.response.data.imageUrl || ''
          })
        }
      })
      return arr
    },
    showUploadButton(option) {
      this.setUpoadImagePicSize(this.width, this.height)
      if (option.length >= this.maxLength) {
        document.querySelector('.el-upload--picture-card').style.display = 'none'
      } else {
        document.querySelector('.el-upload--picture-card').style.display = 'inline-block'
      }
    },
    setUpoadImageBtnSize(w, h) {
      let btns = document.querySelectorAll('.el-upload--picture-card')
      btns.forEach((item) => {
        item.style.width = w + 'px'
        item.style.height = h + 'px'
        item.style.lineHeight = h + 'px'
      })
    },
    setUpoadImagePicSize(w, h) {
      let imgBox = document.querySelectorAll('.el-upload-list__item')
      imgBox.forEach((item) => {
        item.style.width = w + 'px'
        item.style.height = h + 'px'
        item.style.transition = 'none'
      })
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
