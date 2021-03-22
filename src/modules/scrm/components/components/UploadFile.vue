<template>
  <!-- 上传文件 参考授权配置 xfo -->
  <!-- 
  【引入示例】
  import UploadFile from '../../../components/components/UploadFile'

 【使用示例】
  <UploadFile :api="'api/admin/v1.2/upload-file'" accept="txt|pdf|doc" :size="5" @success="UploadFileSuccess"></UploadFile>

 【属性】
  参数         类型                说明                          可选值                   默认值
  api         string            上传文件接口地址                  --                        --
  accept      string            文件选择时预览的文件类型        txt|pdf|doc|xls|xslx|ppt    txt
                                文件可上传的文件类型
  size        number            文件最大大小                      --                        5M

 【属性说明】
  参数                     示例
  无

 【方法】
  方法名           类型                说明                         参数
  success     function(val){}     上传成功后的钩子              val，上传成功文件返回值（name[文件名称],fileId[文件id],url[文件地址]）具体参考【方法说明】
                                                                                                                                        
 【方法说明】
 方法名            示例
 success        {fileId: 1605702574375 
                 name: "aaa.txt"
                 url: "https://athena-1255600302.cos.ap-guangzhou.myqcloud.com"}
  -->
  <div>
    <el-upload
      class="upload-demo"
      :action="action"
      :data="data"
      :before-upload="beforeUpload"
      :on-progress="onProgress"
      :on-success="onSuccess"
      :show-file-list="false"
      :accept="accept | typeFilters(that)"
      :disabled="isUpload && !isSuccessUpload"
    >
      <el-button size="small" plain icon="el-icon-plus" :loading="isUpload && !isSuccessUpload">上传文件</el-button>
    </el-upload>
    <div class="percent" v-show="isUpload && !isSuccessUpload">上传进度：{{ percent }} %</div>
  </div>
</template>

<script>
export default {
  props: {
    api: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 5
    },
    accept: {
      type: String,
      default: 'txt'
    },
    // 路径参数 必传
    data: {
      type: Object,
      default: () => {
        return {
          imageType: 'qc'
        }
      }
    }
  },
  data() {
    return {
      percent: 0,
      isUpload: false,
      isSuccessUpload: false,
      action: '',
      that: this
    }
  },
  methods: {
    beforeUpload(file) {
      console.log(file.type)
      this.isUpload = false
      this.isSuccessUpload = false
      let reg = new RegExp('(' + this.getType(this.accept, '|') + ')')
      const isFile = reg.test(file.type)
      const isSize = file.size / 1024 / 1024 < this.size
      if (!isFile) {
        this.$message.error('请上传' + this.accept.replace('|', '、') + '格式文件')
      }
      if (!isSize) {
        this.$message.error(`请上传文件大小小于${this.size}M`)
      }
      return isSize && isFile
    },
    onProgress(event, file) {
      this.isUpload = true
      this.percent = event.percent.toFixed(0)
      console.log(event.percent)
    },
    onSuccess(res, file) {
      this.isSuccessUpload = true
      console.log(res)
      let result = {
        name: file.name,
        url: res.data.host || res.data.imageUrl,
        fileId: file.uid
      }
      this.$emit('success', result)
    },
    getType(option, symbol) {
      let optionItem = [
        {
          name: 'txt',
          value: 'text/plain'
        },
        {
          name: 'doc',
          value: 'application/msword'
        },
        {
          name: 'pdf',
          value: 'application/pdf'
        },
        {
          name: 'ppt',
          value: 'application/vnd.ms-powerpoint'
        },
        {
          name: 'xls',
          value: 'application/vnd.ms-excel'
        },
        {
          name: 'xslx',
          value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ]
      let optionArr = option.split('|')
      let result = ''
      optionArr.forEach((m) => {
        optionItem.forEach((n) => {
          if (m == n.name) {
            result = result + symbol + n.value
          }
        })
      })
      return result.slice(1)
    }
  },
  filters: {
    typeFilters(option, that) {
      let result = that.getType(option, ',')
      return result
    }
  },
  mounted() {
    this.action = `${this.baseUrl}/${this.api}`
    console.log(this.action)
  }
}
</script>

<style lang="scss" scoped>
.percent {
  font-size: 12px;
  color: #606266;
  margin-top: 10px;
}
</style>
