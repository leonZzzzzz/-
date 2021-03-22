<template>
  <!-- 支持上传 文本text 图文image 视频video 小程序program 图文链接link 基本废弃 xfo-->
  <!-- 
  <UploadEnclosure ref="UploadEnclosure" :navList="navList" :dataList='dataList' ></UploadEnclosure>
  获取表单数据
  let result = this.$refs.UploadEnclosure.success()



   ======> navList 附件单选选项导航列表，可随意选择，但是type必须与之匹配，否则无效
  默认值 [
  {
    title: '文本',
    type: 'text'
  },
  {
    title: '图文',
    type: 'image'
  },
  {
    title: '视频',
    type: 'video'
  },
  {
    title: '小程序',
    type: 'program'
  },
  {
    title: '图文链接',
    type: 'image_text'
  }
  ]
  ======>  dataList 回传绑定的数据
 默认值为空 {
  type: '',
  textarea: '',
  uploadImageFileList: [],
  uploadVideoFileList: {},
  imageTextList: {},
  programId: ''
}

type 默认选中的附件单选选项，默认值为text
textarea 多本文内容
uploadImageFileList 图片列表 请参考uploadImage   
uploadVideoFileList 视频列表 请参考uploadVideo 
imageTextList       图文链接列表  请参考FillImageText
programId           小程序id，默认值为空  
      
   -->
  <div>
    <div class="uploadContent">
      <!-- 输入文本 -->
      <div class="text">
        <el-input
          type="textarea"
          :rows="7"
          placeholder="请输入内容"
          v-model="dataList.textarea"
          resize="none"
          max="1000"
          maxlength="1000"
          show-word-limit
          id="uploadEnclosureTextarea"
        ></el-input>
      </div>
      <div class="radioGroup">
        <el-radio-group v-model="navType">
          <el-radio v-for="(item, index) in navList" :key="index" :label="item.type">{{ item.title }}</el-radio>
        </el-radio-group>
        <div class="emotion">
          <Emotion position="left-start" @selectedEmotion="_selectedEmotion"></Emotion>
        </div>
      </div>
      <!-- 图片 -->
      <div class="image" v-if="navType == 'image'">
        <UploadImage @success="uploadImageSuccess" :fileList="dataList.uploadImageFileList"></UploadImage>
      </div>
      <!-- 视频 -->
      <div class="video" v-if="navType == 'video'">
        <UploadVideo @success="uploadVideoSuccess" :fileList="dataList.uploadVideoFileList"></UploadVideo>
      </div>
      <!-- 小程序 -->
      <div class="program" v-if="navType == 'program'">
        <SelectProgramItem ref="SelectProgramItem" :programIdProps="dataList.programId"></SelectProgramItem>
      </div>
      <!-- 图文链接 -->
      <div class="image_text" v-if="navType == 'image_text'">
        <FillImageText ref="FillImageText" :imageText="dataList.imageTextList"></FillImageText>
      </div>
    </div>
  </div>
</template>
<script>
import UploadImage from './UploadImage.vue'
import UploadVideo from './UploadVideo.vue'
import Emotion from './Emotion.vue'
import SelectProgramItem from './SelectProgramItem.vue'
import FillImageText from './FillImageText.vue'
const dataObj = {
  type: '',
  textarea: '',
  uploadImageFileList: [],
  uploadVideoFileList: {},
  imageTextList: {},
  programId: ''
}
const navListArray = [
  {
    title: '文本',
    type: 'text'
  },
  {
    title: '图文',
    type: 'image'
  },
  {
    title: '视频',
    type: 'video'
  },
  {
    title: '小程序',
    type: 'program'
  },
  {
    title: '图文链接',
    type: 'image_text'
  }
]
export default {
  props: {
    dataList: {
      type: Object,
      default: () => {
        return dataObj
      }
    },
    navList: {
      type: Array,
      default: () => {
        return navListArray
      }
    }
  },
  data() {
    return {
      navType: 'text',
      uploadImageFileList: [],
      uploadVideoFileList: {}
    }
  },
  components: {
    UploadImage,
    UploadVideo,
    Emotion,
    SelectProgramItem,
    FillImageText
  },
  watch: {
    type() {
      this.navType = this.type
    }
  },
  methods: {
    _selectedEmotion(val) {
      let inp = document.getElementById('uploadEnclosureTextarea')
      let insert = inp.selectionStart
      this.dataList.textarea = inp.value.substr(0, insert) + val + inp.value.substr(insert)
    },
    uploadImageSuccess(val) {
      console.log(val)
      this.uploadImageFileList = val
    },
    uploadVideoSuccess(val) {
      console.log(val)
      this.uploadVideoFileList = val
    },
    success() {
      if (this.navType == 'text') {
        let result = {
          textarea: this.dataList.textarea
        }
        return result
      }
      if (this.navType == 'image') {
        let result = {
          textarea: this.dataList.textarea,
          uploadImageFileList: this.uploadImageFileList
        }
        return result
      }
      if (this.navType == 'video') {
        let result = {
          textarea: this.dataList.textarea,
          uploadVideoFileList: this.uploadVideoFileList
        }
        return result
      }
      if (this.navType == 'program') {
        let program = this.$refs.SelectProgramItem.success()
        let result = {
          textarea: this.dataList.textarea,
          uploadProgram: program
        }
        return result
      }
      if (this.navType == 'image_text') {
        try {
          let imageText = this.$refs.FillImageText.success()
          let result = {
            textarea: this.dataList.textarea,
            imageTextList: imageText
          }
          return result
        } catch (err) {
          return false
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.uploadContent {
  padding: 13px 16px;
  width: 600px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  // min-height: 289px;
  background-color: #f5f5f5;
  .text {
    ::v-deep .el-textarea__inner {
      padding: 5px 15px 20px;
    }
    ::v-deep .el-input__count {
      width: calc(100% - 12px);
      background-color: #ffffff;
      right: 11px;
      bottom: 1px;
      border-bottom-left-radius: 4px;
      text-align: right;
      padding: 4px;
      box-sizing: border-box;
    }
  }
  .image,
  .video,
  .program,
  .image_text {
    margin-top: 13px;
  }
  .radioGroup {
    position: relative;
    .emotion {
      position: absolute;
      top: 4px;
      right: 0;
    }
  }
}
</style>
