<template>
  <div class="xfo-page">
    <go-back :title="this.pageId ? (this.pageType == 'update' ? '修改群发' : '再次群发') : '新建群发'"></go-back>
    <div class="main-content">
      <el-form :model="message" ref="message" label-width="auto" class="demo-message">
        <el-form-item label="群发标题" prop="name">
          <el-input v-model="message.name" placeholder="请输入群发标题" maxlength="60" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="选择客户">
          <el-radio-group v-model="customerType" @change="customerTypeChange">
            <el-radio :label="0">全部客户</el-radio>
            <el-radio :label="1">筛选客户</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 筛选客户 -->
        <el-form-item label="" v-if="customerType == 1">
          <el-form label-width="auto" class="screen">
            <el-form-item label="生命周期" label-width="auto">
              <el-select
                style="width: 300px"
                multiple
                v-model="lifeCycleValue"
                placeholder="请选择生命周期"
                @change="selectForGroupSendChange"
              >
                <el-option-group v-for="group in lifeCycleList" :key="group.id" :label="group.name">
                  <el-option v-for="item in group.children" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="企业标签" label-width="auto">
              <el-select
                style="width: 300px"
                multiple
                v-model="companyTagsValue"
                placeholder="请选择企业标签"
                @change="selectForGroupSendChange"
              >
                <el-option-group v-for="group in companyTagsList" :key="group.id" :label="group.name">
                  <el-option v-for="item in group.tagList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="未收到群发" label-width="auto" class="noMessageDays">
              超过&nbsp;&nbsp;<el-input-number
                v-model="noMessageDays"
                :min="0"
                :step="1"
                size="mini"
                @change="selectForGroupSendChange"
              ></el-input-number
              >&nbsp;&nbsp;天
            </el-form-item>
            <!-- <el-form-item label="目标客户">
              <Tag v-for="(item,index) in sendCustomerData" :key="index">{{item.name}}</Tag>
              <p v-if="sendCustomerData.length == 0" class="tips" style="color:#C0C4CC">暂无客户</p>
            </el-form-item> -->
          </el-form>
        </el-form-item>
        <div class="xfo-item">
          <el-alert
            style="height: 30px"
            :title="`该消息预计送达人数${sendCustomerData.length}人`"
            type="info"
            :closable="false"
          ></el-alert>
        </div>
        <el-form-item label="群发消息">
          <dynamic-content-vmodel :nickname="true" v-model="message.message"></dynamic-content-vmodel>
        </el-form-item>
        <el-form-item label="附加内容">
          <el-radio-group v-model="enclosureType" @change="enclosureTypeChange">
            <el-radio label="text">无</el-radio>
            <el-radio label="image">图片</el-radio>
            <el-radio label="image_text">图文链接</el-radio>
            <el-radio label="program">小程序</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 图片 -->
        <el-form-item label="" v-if="enclosureType == 'image'">
          <upload-image @success="imageSuccess" :fileList="imageFileList"></upload-image>
        </el-form-item>
        <!-- 图文链接 -->
        <el-form-item label="" v-if="enclosureType == 'image_text'">
          <el-form ref="imageText" :model="imageText" label-width="auto">
            <el-form-item label="链接标题">
              <el-input v-model="imageText.name" placeholder="请输入链接标题"></el-input>
            </el-form-item>
            <el-form-item label="链接简介">
              <el-input v-model="imageText.content" placeholder="请输入链接简介"></el-input>
            </el-form-item>
            <el-form-item label="链接地址">
              <el-input v-model="imageText.link" placeholder="请输入链接地址"></el-input>
            </el-form-item>
            <el-form-item label="链接封面">
              <upload-image @success="imageTextSuccess" :fileList="imageTextFileList"></upload-image>
            </el-form-item>
          </el-form>
        </el-form-item>
        <!-- 小程序 -->
        <el-form-item label="" v-if="enclosureType == 'program'">
          <select-program-item
            ref="SelectProgramItem"
            :programProps="programFileList"
            @success="selectProgramItemChange"
          ></select-program-item>
        </el-form-item>
        <div class="xfo-item">
          <el-alert
            title="注意：客户每个月最多接收来自同一企业的管理员的4条群发消息，4条消息可在同一天发送"
            type="info"
            :closable="false"
          ></el-alert>
        </div>
        <el-form-item label="群发时间">
          <el-radio-group v-model="releaseTimeType" @change="releaseTimeTypeChange">
            <el-radio label="now">立即发送</el-radio>
            <el-radio label="time">定时发送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" v-if="releaseTimeType == 'time'">
          <el-date-picker
            v-model="releaseTime"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-button plain>取消</el-button>
          <el-button
            plain
            v-show="releaseTimeType == 'time'"
            @click="publishGroupPost(null)"
            :disabled="isCanSubmit"
            :loading="isCanSubmit"
            >保存草稿</el-button
          >
          <el-button type="primary" @click="publishGroupPost('new')" :disabled="isCanSubmit" :loading="isCanSubmit"
            >确认发布</el-button
          >
        </el-form-item>
      </el-form>
      <mobile-phone-effect
        style="margin-left: 50px"
        :message="message.message"
        :imageUrl="imageUrl"
        :imageText="imageText"
        :program="program"
      ></mobile-phone-effect>
    </div>
  </div>
</template>

<script>
import GoBack from '@/modules/scrm/components/components/GoBack.vue'
// import Tag from '@/modules/scrm/components/components/Tag.vue'
import DynamicContentVmodel from '@/modules/scrm/components/components/DynamicContentVmodel.vue'
import UploadImage from '@/modules/scrm/components/components/UploadImage.vue'
// import SelectProgramItem from '@/modules/scrm/components/components/SelectProgramItem.vue'
import SelectProgramItem from '@/modules/scrm/components/components/SelectProgramItemNew.vue'
import MobilePhoneEffect from '@/modules/scrm/components/components/MobilePhoneEffect.vue'

export default {
  components: { GoBack, DynamicContentVmodel, UploadImage, SelectProgramItem, MobilePhoneEffect },
  created() {
    this.getLifeCycleUsers()
    this.getEnterTagList()
    this.selectForGroupSend({})
    this.pageType = this.$route.query.type
    if (this.pageType == 'update') {
      console.log('修改群发')
      this.groupChatSendGet('groupChatSendGet') // 修改详情
    }
    if (this.pageType == 'copy') {
      console.log('再次群发')
      this.groupChatSendGet('reCordGroup') // 再次群发详情
    }
  },
  data() {
    return {
      pageId: '',
      pageType: '',
      // 群发数据
      message: {
        name: '',
        message: '',
        chatType: 'single',
        sendType: 'now',
        scheduledSendTime: '',
        sendTime: '',
        status: '',
        messageItemList: [],
        messageTargetList: [],
        isNowUser: false
      },
      // 群发客户类型 0 全部客户 1 指定客户
      customerType: 0,
      // --> 筛选客户数据
      // 生命周期数据
      lifeCycleValue: [],
      lifeCycleList: [],
      // 企业标签数据
      companyTagsValue: [],
      companyTagsList: [],
      // 未收到群发超过天数
      noMessageDays: 0,
      // 发送客户数据
      sendCustomerData: [],
      // -->群发附件数据
      enclosureType: 'text',
      // 图片
      imageUrl: '',
      imageFileList: [],
      // 图文链接
      imageText: {
        name: '',
        content: '',
        link: '',
        imageUrl: '',
        type: 'image_text'
      },
      imageTextFileList: [],
      // 小程序
      program: {},
      programFileList: {},
      // 发布时间
      releaseTimeType: 'now',
      releaseTime: '',
      // 时间选择
      pickerOptions: {
        disabledDate(time) {
          const dateTime = new Date()
          const startTime = dateTime.getTime()
          return time.getTime() < startTime
        }
      },
      isCanSubmit: false
    }
  },
  methods: {
    // ---页面渲染---
    // 客户筛选
    customerTypeChange() {
      this.lifeCycleValue = []
      this.companyTagsValue = []
      this.noMessageDays = 0
      if (this.customerType == 0) {
        this.selectForGroupSend({})
      }
    },
    // 查询客户
    selectForGroupSendChange() {
      let tagGroups = []
      if (this.companyTagsValue.length > 0) {
        // 循环选择框返回数据
        this.companyTagsValue.forEach(tagsValue => {
          // 循环标签列表数据
          this.companyTagsList.forEach(tagsItem => {
            // 循环标签组数据
            tagsItem.tagList.forEach(tag => {
              if (tag.id == tagsValue) {
                tagGroups.push({
                  id: tagsItem.id,
                  tags: [tag.id]
                })
              }
            })
          })
        })
      }
      for (let i = 0, len = tagGroups.length; i < len; i++) {
        for (let j = i + 1, len = tagGroups.length; j < len; j++) {
          if (tagGroups[i].id === tagGroups[j].id) {
            tagGroups[i].tags = tagGroups[i].tags.concat(tagGroups[j].tags)
            tagGroups.splice(j, 1)
            j--
            len--
          }
        }
      }
      let options = {
        tagGroups,
        customerLifeCycles: this.lifeCycleValue,
        notReceiveGroupSendDays: this.noMessageDays
      }
      console.log('天数改变')
      this.selectForGroupSend(options)
    },
    // 附加内容
    enclosureTypeChange() {
      console.log('aaa')
      // 图片
      this.imageUrl = ''
      this.imageFileList = []
      // 图文链接
      this.imageText = {
        name: '',
        content: '',
        link: '',
        imageUrl: '',
        type: 'image_text'
      }
      this.imageTextFileList = []
      // 小程序
      this.program = {}
      this.programFileList = {}
    },
    // 发送方式
    releaseTimeTypeChange() {
      this.releaseTime = ''
    },
    // 图片上传成功
    imageSuccess(val) {
      this.imageUrl = val[0] ? val[0].url : ''
    },
    // 图文图片上传成功
    imageTextSuccess(val) {
      this.imageText.imageUrl = val[0] ? val[0].url : ''
    },
    // 小程序选择
    selectProgramItemChange(val) {
      this.program = val
    },
    // 发布群发/保存草稿
    publishGroupPost(status) {
      let messageItemList = []
      // 表单验证
      if (this.message.name == '') {
        return this.$message.warning('请输入群发标题')
      }
      if (this.message.message == '') {
        return this.$message.warning('请输入群发消息')
      }
      if (this.enclosureType == 'image') {
        if (this.imageUrl == '') {
          return this.$message.warning('请上传图片')
        }
        messageItemList.push({ imageUrl: this.imageUrl, type: this.enclosureType })
      }
      if (this.enclosureType == 'image_text') {
        if (
          this.imageText.name == '' ||
          this.imageText.content == '' ||
          this.imageText.link == '' ||
          this.imageText.imageUrl == ''
        ) {
          return this.$message.warning('请完整输入图文链接信息')
        }
        messageItemList.push(this.imageText)
      }
      // 获取小程序数据
      if (this.enclosureType == 'program') {
        // this.program = this.$refs.SelectProgramItem.success()
        if (!this.program.id) {
          return this.$message.warning('请选择小程序')
        }
        messageItemList.push({
          type: this.enclosureType,
          programId: this.program.id,
          name: this.program.name,
          link: this.program.page,
          imageUrl: this.program.logo
        })
      }
      if (this.releaseTimeType == 'time' && this.releaseTime == '') {
        return this.$message.warning('请选择发布时间')
      }
      // 目标成员
      let messageTargetList = []
      this.sendCustomerData.forEach(item => {
        messageTargetList.push({
          targetId: item.id
        })
      })
      // 接口参数数据
      this.message.name = this.message.name
      this.message.chatType = 'single'
      this.message.sendType = this.releaseTimeType
      this.message.scheduledSendTime = this.releaseTime
      this.message.sendTime = ''
      this.message.status = status
      this.message.message = this.message.message
      this.message.messageItemList = messageItemList
      this.message.messageTargetList = messageTargetList
      this.message.isNowUser = true
      this.message.lifeCycleId = this.lifeCycleValue.join('_')
      this.message.tagId = this.companyTagsValue.join('_')
      console.log('提交的参数', this.message)
      this.isCanSubmit = true
      if (this.pageId && this.type == 'update') {
        this.groupChatUpdate(this.message, res => {
          this.$openNewPageBack()
          this.isCanSubmit = false
        })
      } else {
        this.publishGroupPostNow(this.message, () => {
          this.$openNewPageBack()
          this.isCanSubmit = false
        })
      }
    },
    // ---获取数据---
    // 生命周期列表
    getLifeCycleUsers() {
      this.functions('customerLifeCycleTree', '', res => {
        this.lifeCycleList = res.data.data
        console.log('生命周期列表', this.lifeCycleList)
      })
    },
    // 企业标签列表
    getEnterTagList() {
      this.functions('getEnterTagList', '', res => {
        this.companyTagsList = res.data.data
        console.log('企业标签列表', this.companyTagsList)
      })
    },
    // 查询筛选客户
    selectForGroupSend(options, callback) {
      this.functions('selectForGroupSend', options, res => {
        this.sendCustomerData = res.data.data
      })
    },
    // 发布群发 status --> drafs(保存到草稿箱) new(立即发布)
    publishGroupPostNow(options, callback) {
      this.$http
        .reSaveSend(options)
        .then(res => {
          if (callback) {
            callback(res)
          }
        })
        .catch(err => {
          console.log(err)
          if (err.data.code == 4001) {
            setTimeout(() => {
              this.$message.warning('图文链接不可填写特殊字符“|”或“*”')
            }, 50)
            this.isCanSubmit = false
            return
          }
        })
    },
    // 获取群发详情 / 再次群发详情
    groupChatSendGet(name) {
      if (!this.$route.query.id) {
        return
      }
      this.pageId = this.$route.query.id
      this.$http[name]({ id: this.pageId }).then(res => {
        let data = res.data.data
        console.log('群发详情', data)
        let customerCondition = JSON.parse(data.customerCondition)
        if (customerCondition.tagIdList || customerCondition.lifeCycleId) {
          this.customerType = 1
          this.sendCustomerData = data.messageTargetList
          this.lifeCycleValue = customerCondition.lifeCycleId ? customerCondition.lifeCycleId.split('_') : []
          this.companyTagsValue = customerCondition.tagIdList
            ? customerCondition.tagIdList[0].split(',')[0].split('_')
            : []
        }
        if (data.messageItemList.length == 0) {
          this.enclosureType = 'text'
        } else {
          this.enclosureType = data.messageItemList[0].type
        }
        if (this.enclosureType == 'image') {
          this.imageUrl = data.messageItemList[0].imageUrl
          this.imageFileList = [{ name: 'image', url: this.imgHost + this.imageUrl }]
        }
        if (this.enclosureType == 'image_text') {
          this.imageText.name = data.messageItemList[0].name
          this.imageText.content = data.messageItemList[0].content
          this.imageText.link = data.messageItemList[0].link
          this.imageText.imageUrl = data.messageItemList[0].imageUrl
          this.imageTextFileList = [{ name: 'image', url: this.imgHost + this.imageText.imageUrl }]
        }
        if (this.enclosureType == 'program') {
          this.program.type = this.enclosureType
          this.program.programId = data.messageItemList[0].programId
          this.program.name = data.messageItemList[0].name
          this.program.link = data.messageItemList[0].link
          this.program.imageUrl = data.messageItemList[0].imageUrl
          this.programFileList = {
            id: this.program.programId,
            name: this.program.name,
            logo: this.program.imageUrl
          }
        }
        this.message = data
      })
    },
    // 修改群发
    groupChatUpdate(options, callback) {
      this.$http
        .groupChatUpdate(options)
        .then(res => {
          if (callback) {
            callback(res)
          }
        })
        .catch(err => {
          console.log(err)
          if (err.data.code == 4001) {
            setTimeout(() => {
              this.$message.warning('图文链接不可填写特殊字符“|”或“*”')
            }, 50)
            this.isCanSubmit = false
            return
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.xfo-page {
  width: 100%;
  height: 100%;
}
.main-content {
  width: 100%;
  min-height: calc(100% - 56px);
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  .demo-message {
    width: 800px;
    .title {
      margin-bottom: 10px;
    }
    .el-form-item {
      margin-bottom: 22px;
    }
    .noMessageDays {
      color: #606266;
      font-size: 12px;
      ::v-deep .el-input-number {
        width: 120px;
      }
    }
    .screen {
      padding: 20px 20px 1px;
      box-sizing: border-box;
      width: 100%;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
    }
  }
}
.xfo-item {
  margin-bottom: 22px;
}
</style>
