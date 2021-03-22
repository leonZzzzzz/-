<template>
  <div>
    <div class="main_content">
      <el-form label-width="90px" label-position="left" :model="model" ref="model">
        <el-form-item
          label="欢迎语"
          prop="message"
          :rules="{ required: true, message: '请输入欢迎语', trigger: 'blur' }"
        >
          <el-input
            id="textInput"
            type="textarea"
            width="600px"
            maxlength="100"
            show-word-limit
            size="small"
            placeholder="最多可输入100字"
            height="400px"
            :rows="6"
            resize="none"
            v-model="model.message"
          ></el-input>
          <div class="welcome_buttom">
            <div class="welcome_emjoi">
              <emotion @selectedEmotion="selectedEmotion"></emotion>
            </div>
            <div class="welcome_div">
              <el-button type="text" size="mini">插入昵称</el-button>
              <el-button plain size="mini" @click="insert('<客户昵称>')">客户昵称</el-button>
              <el-button plain size="mini" @click="insert('<成员昵称>')">成员昵称</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="附加内容" :required="true">
          <el-radio-group v-model="model.type">
            <el-radio label="text">无</el-radio>
            <el-radio label="image">图片</el-radio>
            <el-radio label="image_text">网页</el-radio>
            <el-radio label="program">小程序</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="image-div" v-if="model.type === 'image'">
          <el-form-item>
            <QcImageUpload width="100px" height="100px" class="image-upload" v-model="imageUrl" prop="imageUrl">
            </QcImageUpload>
            <span class="picture_tips">(上传图片)</span>
          </el-form-item>
        </div>
        <div class="web-div" v-if="model.type === 'image_text'">
          <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接标题" prop="name"
            ><el-input placeholder="最多可输入32个字" v-model="model.name"></el-input
          ></el-form-item>
          <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接简介" prop="content"
            ><el-input placeholder="最多可输入32个字" v-model="model.content"></el-input
          ></el-form-item>
          <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接地址" prop="link"
            ><el-input placeholder="请输入链接地址" v-model="model.link"></el-input
          ></el-form-item>
          <el-form-item>
            <QcImageUpload width="100px" height="100px" v-model="linkImageUrl"></QcImageUpload>
            <span class="picture_tips">(上传图片)</span>
          </el-form-item>
        </div>
        <div class="app-div" v-if="model.type === 'program'">
          <el-form-item label="配置小程序">
            <el-select placeholder="请选择" v-model="model.programId" @change="getProgramInfo()">
              <el-option
                class="app-select"
                v-for="(item, index) in options"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" v-if="model.programId">
            <div class="programInfo">
              <el-card shadow="hover" :body-style="{ padding: '10px' }">
                <div class="programInfoContent">
                  <div class="logo">
                    <el-avatar size="medium" :src="imgHost + programInfoOption.logo"></el-avatar>
                  </div>
                  <div class="name">{{ programInfoOption.name }}</div>
                </div>
              </el-card>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Emotion from '../../components/common/Emotion'
export default {
  data() {
    return {
      // 数据
      model: {
        id: '',
        createTime: '',
        updateTime: '',
        appId: '',
        type: 'text',
        name: '',
        content: '',
        imageUrl: '',
        videoUrl: '',
        link: '',
        programId: '',
        file: '',
        fileId: '',
        message: '',
        userId: '',
        isEnabled: true,
        source: '',
        mediaId: '',
        mediaIdExpireTime: '',
        userType: 0
      },
      // 附加内容类型
      changeFlagValue: 'text',
      // 小程序选择列表
      options: [],
      // 上传图片
      imageUrl: '',
      linkImageUrl: '',
      programInfoOption: {
        logo: '',
        name: ''
      }
    }
  },
  methods: {
    //  ---数据渲染函数---
    // 插入表情包
    selectedEmotion(val) {
      let message = document.getElementById('textInput')
      let insert = message.selectionStart
      this.model.message = message.value.substr(0, insert) + val + message.value.substr(insert)
    },
    // 插入昵称
    async insert(myValue) {
      let myField = document.getElementById('textInput')
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.model.message =
          myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)
        await this.$nextTick()
        myField.focus()
        myField.setSelectionRange(endPos + myValue.length, endPos + myValue.length)
      } else {
        this.model.message += myValue
      }
    },
    // 获取小程序信息
    getProgramInfo() {
      this.options.forEach((item) => {
        if (item.id == this.model.programId) {
          this.programInfoOption = item
        }
      })
    },
    // ---获取数据函数---
    // 获取小程序列表
    getProgarm() {
      this.$http.getProgarm().then((res) => {
        this.options = res.data.data
        console.log('这是小程序', res.data.data)
      })
    }
  },
  components: {
    Emotion
  }
}
</script>

<style lang="scss" scoped>
.main_content {
  background-color: #ffffff;
  width: 800px;
  .welcome_buttom {
    display: flex;
    .welcome_emjoi {
      display: flex;
      align-items: center;
      margin-right: auto;
    }
  }
}
.programInfo {
  width: 217px;
  .programInfoContent {
    height: 36px;
    display: flex;
    .name {
      margin-left: 5px;
      line-height: 36px;
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>
