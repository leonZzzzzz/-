<template>
  <!-- 填写图文链接 基本废弃 -->
  <!-- 
    <FillImageText ref="FillImageText" :imageText="dataList.imageTextList"></FillImageText>
    获取数据
     let imageText = this.$refs.FillImageText.success()

    imageText 重新绑定数据的对象
    {
      title: '',
      description: '',
      link: '',
      url: ''
    }
    title 链接标题
    description 链接简介
    link 链接地址
    url 链接封面
   -->
  <div>
    <el-form :model="imageText" label-position="right" label-width="auto" ref="imageText">
      <el-form-item
        label="链接标题"
        :rules="[{ required: true, message: '请输入链接标题', trigger: 'blur' }]"
        prop="title"
      >
        <el-input v-model="imageText.title" placeholder="请输入链接标题"></el-input>
      </el-form-item>
      <el-form-item
        label="链接简介"
        :rules="[{ required: true, message: '请输入链接简介', trigger: 'blur' }]"
        prop="description"
      >
        <el-input v-model="imageText.description" placeholder="请输入链接简介"></el-input>
      </el-form-item>
      <el-form-item
        label="链接地址"
        :rules="[{ required: true, message: '请输入链接地址', trigger: 'blur' }]"
        prop="link"
      >
        <el-input v-model="imageText.link" placeholder="请输入链接地址"></el-input>
      </el-form-item>
      <el-form-item label="链接封面" :required="true">
        <UploadImage @success="uploadImageSuccess" :fileList="fileList"></UploadImage>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
const imageTextObj = {
  title: '',
  description: '',
  link: '',
  url: ''
}
import UploadImage from './UploadImage.vue'
export default {
  components: {
    UploadImage
  },
  props: {
    imageText: {
      type: Object,
      default: () => {
        return imageTextObj
      }
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  watch: {
    'imageText.url': () => {
      this.fileList = []
      this.fileList.push({ name: '链接封面', url: this.imageText.url })
    }
  },
  methods: {
    uploadImageSuccess(val) {
      this.imageText.url = val.length == 0 ? '' : val[0].url
    },
    success() {
      return new Promise((res, reject) => {
        this.$refs.imageText.validate((valid) => {
          if (valid && this.imageText.url) {
            return res(this.imageText)
          } else {
            return reject(false)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
