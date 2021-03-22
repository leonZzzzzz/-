<template>
  <div class="page">
    <!-- 返回上一页 -->
    <GoBack :title="pageId ? '修改企业动态圈' : '新增企业动态圈'"></GoBack>
    <!-- 内容区域 -->
    <div class="main_content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="form_content">
          <el-form-item label="动态内容" :required="true">
            <DynamicContent :value="ruleForm.content" ref="DynamicContent"></DynamicContent>
          </el-form-item>
          <el-form-item label="上传内容" :required="true">
            <el-radio-group v-model="ruleForm.type" @change="radioGroupChange">
              <el-radio v-for="(item, index) in radioGroupList" :key="index" :label="item.type">{{
                item.name
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="radioGroupContent">
            <el-form-item label="" v-if="ruleForm.type == '1'">
              <upload-image
                :width="100"
                :height="100"
                :maxLength="9"
                :fileList="imageFileList"
                @success="imageSuccess"
              ></upload-image>
              <span style="color:#606266;">(可上传1-9张图片，单张像素不可大于2M)</span>
            </el-form-item>
            <el-form-item label="" v-if="ruleForm.type == '2'">
              <UploadVideo :fileList="videoFileList" @success="videoSuccess"></UploadVideo>
              <!-- 仅上传视频 -->
              <!-- <div class="video-add" v-if="ruleForm.momentsUploadContentList.length <= 0">
                <UploadOnlyVideo @success="videoSuccess" />
                <span style="color:#606266;">(支持mp4格式，最大10MB)</span>
              </div>
              <div class="video-show" v-else>
                <div class="video-box">
                  <div style="display: flex; flex-direction: column">
                    <VideoPreview :videoData="ruleForm.momentsUploadContentList[0]" height="150px" width="200px" source="edit" />
                    <i class="el-icon-delete" @click="ruleForm.momentsUploadContentList = []"></i>
                  </div>
                </div>
              </div> -->
            </el-form-item>
            <el-form :model="imageText" ref="imageText" label-width="100px" v-if="ruleForm.type == '3'">
              <el-form-item
                label="链接标题"
                prop="title"
                :required="true"
                :rules="{
                  required: true,
                  message: '请输入链接标题',
                  trigger: 'blur'
                }"
              >
                <el-input v-model="imageText.title" placeholder="请输入链接标题"></el-input>
              </el-form-item>
              <el-form-item
                label="链接简介"
                prop="description"
                :required="true"
                :rules="{
                  required: true,
                  message: '请输入链接简介',
                  trigger: 'blur'
                }"
              >
                <el-input v-model="imageText.description" placeholder="请输入链接简介"></el-input>
              </el-form-item>
              <el-form-item
                label="链接链接"
                prop="link"
                :required="true"
                :rules="{
                  required: true,
                  message: '请输入链接链接',
                  trigger: 'blur'
                }"
              >
                <el-input v-model="imageText.link" placeholder="请输入链接链接"></el-input>
              </el-form-item>
              <el-form-item label="链接封面" :required="true">
                <UploadImage :fileList="textImageFileList" @success="textImageSuccess"></UploadImage>
              </el-form-item>
            </el-form>
          </div>
          <el-form-item label="发表人员" :required="true">
            <div class="tagList">
              <Tag v-for="(item, index) in memberList" :key="index">{{ item.name }}</Tag>
            </div>
            <el-button icon="el-icon-plus" size="small" plain @click="memberConfig.visible = true">添加</el-button>
          </el-form-item>
          <el-form-item label="">
            <el-button plain @click="$router.go(-1)">取消</el-button>
            <el-button type="primary" @click="submit()">保存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- <MemberTreeDialog
      :config="memberConfig"
      @closeDialog="memberConfig.visible = false"
      :selectedList="memberList"
      @handleConfirm="memberSuccess"
     /> -->
    <MemberTreeLinkageDialog
      :config="memberConfig"
      :selectedList="memberList"
      @closeDialog="memberConfig.visible = false"
      @handleConfirm="memberSuccess"
    />
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack.vue'
import DynamicContent from '../../../components/components/DynamicContent.vue'
import UploadImage from '../../../components/components/UploadImage'
import UploadVideo from '../../../components/components/UploadVideo'
// import MemberTreeDialog from '../../../components/components/MemberTreeDialog'
import MemberTreeLinkageDialog from '../../../components/components/MemberTreeLinkageDialog'
import Tag from '../../../components/components/Tag'
// import UploadOnlyVideo from '@/modules/scrm/components/components/UploadOnlyVideo.vue'
// import VideoPreview from '../../../components/common/VideoPreview'
export default {
  components: {
    GoBack,
    DynamicContent,
    UploadImage,
    UploadVideo,
    // MemberTreeDialog,
    Tag,
    MemberTreeLinkageDialog,
    // VideoPreview,
    // UploadOnlyVideo
  },
  data() {
    return {
      // 页面id
      pageId: '',
      // 表单数据与表单验证
      ruleForm: {
        content: '',
        type: '-1',
        momentsUploadContentList: [],
        momentsUsers: []
      },
      rules: {
        content: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 上传内容单选列表
      radioGroupList: [
        {
          name: '无',
          type: '-1'
        },
        {
          name: '图片',
          type: '1'
        },
        {
          name: '视频',
          type: '2'
        },
        {
          name: '图文链接',
          type: '3'
        }
      ],
      // 图片
      imageFileList: [],
      // 视频
      videoFileList: {},
      // 图文链接
      imageText: {
        type: '3',
        title: '',
        description: '查看详情', // 默认“查看详情”
        link: '',
        url: ''
      },
      textImageFileList: [],
      // 发表人员
      memberConfig: {
        title: '选择发表成员',
        visible: false
      },
      memberList: []
    }
  },
  methods: {
    // 页面渲染函数
    // 切换类型
    radioGroupChange() {
      this.ruleForm.momentsUploadContentList = []
    },
    // 图片
    imageSuccess(val) {
      console.log(val)
      this.ruleForm.momentsUploadContentList = []
      val.forEach((item) => {
        console.log(item.url)
        this.ruleForm.momentsUploadContentList.push({
          type: '1',
          url: item.url
        })
      })
    },
    // 视频
    videoSuccess(val) {
      this.ruleForm.momentsUploadContentList = [
        {
          type: 2,
          url: val.coverUrl,
          fileId: val.fileId
        }
      ]
    },
    // 图文链接
    textImageSuccess(val) {
      let url = val[0] ? val[0].url : ''
      this.imageText.url = url
      if (url == '') {
        this.textImageFileList = []
      } else  {
        this.textImageFileList = [{ name: 'textImage', url: this.imgHost + url }]
      }
    },
    // 发表人员
    memberSuccess(val) {
      console.log(val)
      this.memberList = val
      this.memberConfig.visible = false
    },
    // 保存
    submit() {
      // 获取&&设置动态内容
      let content = this.$refs.DynamicContent.success()
      this.ruleForm.content = content
      if (!this.ruleForm.content) {
        return this.$message.warning('请输入动态内容')
      }
      if (this.ruleForm.type == '1' && this.ruleForm.momentsUploadContentList.length == 0) {
        return this.$message.warning('请上传图片')
      }
      if (this.ruleForm.type == '2' && this.ruleForm.momentsUploadContentList.length == 0) {
        return this.$message.warning('请上传视频')
      }
      let bool = true
      if (this.ruleForm.type == '3') {
        this.$refs.imageText.validate((valid) => {
          if (valid) {
            if (!this.imageText.url) {
              bool = false
              return this.$message.warning('请上传图片')
            }
            this.ruleForm.momentsUploadContentList = [this.imageText]
            bool = true
          } else {
            bool = false
          }
        })
      }
      if (!bool) {
        return
      }
      // 获取发表人员
      this.ruleForm.momentsUsers = []
      this.memberList.forEach((item) => {
        this.ruleForm.momentsUsers.push({
          cropUserId: item.id,
          userId: item.userId,
          name: item.name,
          avatar: item.avatar,
          type: 0
        })
      })
      console.log('提交表单', this.ruleForm)
      if (this.pageId) {
        console.log(this.ruleForm)
        this.functions('updateCompMoments', this.ruleForm, (res) => {
          this.$message.success('修改成功')
          this.$openNewPageBack()
        })
      } else {
        // 新增接口
        console.log(this.ruleForm)
        this.functions('addCompMoments', this.ruleForm, (res) => {
          this.$message.success('新建成功')
          this.$openNewPageBack()
        })
      }
    },
    // ---获取数据函数---
    // 获取修改数据
    getCompMomentsDetail() {
      if (this.$route.query.id) {
        this.pageId = this.$route.query.id
        this.functions('getCompMomentsDetail', { id: this.pageId }, (res) => {
          this.ruleForm = res.data.data
          console.log('修改数据', this.ruleForm)
          // 将数据绑定发表人员
          this.ruleForm.momentsUsers.forEach((item) => {
            this.memberList.push({
              id: item.cropUserId,
              name: item.name
            })
          })
          let data = this.ruleForm.momentsUploadContentList
          // 将图片绑定
          if (this.ruleForm.type == '1') {
            data.forEach((item) => {
              this.imageFileList.push({
                name: 'image',
                url: this.imgHost + item.url
              })
            })
          }
          // 将视频绑定
          if (this.ruleForm.type == '2') {
            let fileId = data[0].fileId
            this.functions('getVideoSignatureDetail', { fileId }, (res) => {
              console.log(res)
              let videoUrl = res.data.data.file.url + res.data.data.playSignature.queryString
              this.videoFileList = {
                fileId,
                coverUrl: data[0].url,
                videoUrl: videoUrl
              }
            })
          }
          // 将图文链接绑定
          if (this.ruleForm.type == '3') {
            this.imageText = {
              type: '3',
              title: data[0].title,
              description: data[0].description,
              link: data[0].link,
              url: data[0].url
            }
            this.textImageFileList = [{ name: 'textImage', url: this.imgHost + data[0].url }]
          }
        })
      }
    }
  },
  created() {
    this.getCompMomentsDetail()
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
}
.main_content {
  min-height: calc(100% - 56px);
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px;
  .form_content {
    width: 650px;
  }
  .tagList {
    display: flex;
    flex-wrap: wrap;
  }
}
.video-show {
  .video-box {
    width: 202px;
    height: 152px;
    position: relative;
    border: 1px solid #eee;
    .el-icon-delete {
      position: absolute;
      top: 10px;
      right: -30px;
      font-size: 24px;
      cursor: pointer;
      color: #f56c6c;
    }
  }
}
</style>
