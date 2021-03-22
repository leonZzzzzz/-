<template>
  <!-- 支持上传 文本text 图文image 视频video 小程序program 文件file -->
  <!-- 
     <UploadEnclosure :radioList="radioList"></UploadEnclosure>

      radioList 选项名称 数组数据 
      [
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
          title: '图文链接',
          type: 'image_text'
        },
        {
          title: '小程序',
          type: 'program'
        },
        {
          title: '文件',
          type: 'file'
        },

      ],

      uploadList  传入的数据
      
      获取数据 this.$refs.UploadEnclosure.onResult()
   -->
  <div>
    <div class="uploadContent">
      <!-- 输入文本 -->
      <div class="text">
        <el-input
          type="textarea"
          :rows="7"
          placeholder="请输入内容"
          v-model="uploadList.textarea"
          resize="none"
          max="1000"
          maxlength="1000"
          show-word-limit
          id="textInput"
        ></el-input>
      </div>
      <div class="radioGroup">
        <el-radio-group v-model="uploadList.radioValue">
          <el-radio v-for="(item, index) in radioList" :key="index" :label="item.type">{{ item.title }}</el-radio>
        </el-radio-group>
        <div class="emotion">
          <Emotion position="left-start" @selectedEmotion="_selectedEmotion"></Emotion>
        </div>
      </div>
      <!-- 上传图片 -->
      <div class="image" v-if="uploadList.radioValue == 'image'">
        <UploadImage @fileListData="fileListData" :fileList="uploadList.image" :maxLength="9"></UploadImage>
      </div>
      <!-- 上传视频 -->
      <div class="video" v-if="uploadList.radioValue == 'video'">
        <UploadVideo @onSuccess="onSuccess" :videoList="uploadList.video"></UploadVideo>
      </div>
      <!-- 图文链接 -->
      <div class="image_text" v-if="uploadList.radioValue == 'image_text'">
        <el-form ref="form" label-width="auto">
          <el-form-item :label="item.title" v-for="(item, index) in uploadList.imageText" :key="index">
            <el-input v-model="item.value" v-if="item.type == 'text'" :placeholder="`请输入${item.title}`"></el-input>
            <UploadImage
              @fileListData="imageTextData"
              :fileList="uploadList.imageText[3].value"
              v-if="item.type == 'image'"
            ></UploadImage>
          </el-form-item>
        </el-form>
      </div>
      <!-- 输入小程序 -->
      <div class="program"></div>
      <!-- 上传文件 -->
      <div class="file"></div>
    </div>
  </div>
</template>
<script>
import UploadImage from './UploadImage.vue'
import UploadVideo from './UploadVideo.vue'
import Emotion from './Emotion.vue'
export default {
  props: {
    // 选项
    radioList: {
      type: Array,
      default: () => {
        return []
      }
    },
    uploadList: {
      type: Object,
      default: () => {
        return {
          // 类型
          radioValue: 'text',
          // 文本
          textarea: '',
          // 图片
          image: [],
          // 视频
          video: {},
          // 图文链接
          imageText: [
            // {
            //   title: '链接标题',
            //   type: 'text',
            //   value: ''
            // },
            // {
            //   title: '链接简介',
            //   type: 'text',
            //   value: ''
            // },
            // {
            //   title: '链接地址',
            //   type: 'text',
            //   value: ''
            // },
            // {
            //   title: '链接封面',
            //   type: 'image',
            //   value: []
            // }
          ]
        }
      }
    }
  },
  data() {
    return {
      data: {
        // // 类型
        // radioValue: 'text',
        // // 文本
        // textarea: '',
        // // 图片
        // image: [],
        // // 图文链接
        // imageText: [
        //   {
        //     title: '链接标题',
        //     type: 'text',
        //     value: ''
        //   },
        //   {
        //     title: '链接简介',
        //     type: 'text',
        //     value: ''
        //   },
        //   {
        //     title: '链接地址',
        //     type: 'text',
        //     value: ''
        //   },
        //   {
        //     title: '链接封面',
        //     type: 'image',
        //     value: []
        //   }
        // ],
        // // 视频
        // video: {}
      }
    }
  },
  components: {
    UploadImage,
    UploadVideo,
    Emotion
  },
  methods: {
    _selectedEmotion(val) {
      let textInput = document.getElementById('textInput')
      // 插入表情
      let insert = textInput.selectionStart
      this.uploadList.textarea = textInput.value.substr(0, insert) + val + textInput.value.substr(insert)
    },
    fileListData(val) {
      // this.data.image = val
      this.uploadList.image = val
    },
    imageTextData(val) {
      this.uploadList.imageText[3].value = val
      // this.data.imageText[3].value = val
    },
    onSuccess(val) {
      this.uploadList.video = val
      // this.data.video = val
    },
    onResult() {
      // this.data.textarea = this.uploadList.textarea
      // this.data.radioValue = this.uploadList.radioValue
      return this.uploadList
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
