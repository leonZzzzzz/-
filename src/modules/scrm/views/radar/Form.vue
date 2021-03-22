<template>
  <div class="radar-form">
    <div class="top-nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)"
        >{{ $route.query.id ? '修改' : '新建' }}雷达</el-button
      >
    </div>
    <div class="container">
      <div class="module">
        <div class="title">基础信息</div>
        <div class="content">
          <div class="c-tips">
            <!-- <i class="el-icon-message-solid"></i>
            <span>提示：上传文件后将自动转换成网页链接，员工发送给客户后可记录客户打开数据</span> -->
            <el-alert
              title="提示：上传文件后将自动转换成网页链接，员工发送给客户后可记录客户打开数据"
              type="warning"
              show-icon
              :closable="false"
            >
            </el-alert>
          </div>
          <div class="content-form">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="标题" :rules="[{ required: true, message: '该字段不能为空' }]">
                <el-input
                  placeholder="名称不会展示给用户，用于企业记录渠道名称或使用场景"
                  v-model="form.title"
                  maxlength="60"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="文件类型" :required="true">
                <el-radio-group v-model="form.type">
                  <el-radio label="link">链接</el-radio>
                  <el-radio label="file">文件</el-radio>
                </el-radio-group>
                <div class="radar-link" v-if="form.type == 'link'">
                  <!-- <div class="btn-group">
                    <el-button-group>
                      <el-button type="primary" size="small" icon="el-icon-folder-opened">从素材库中选择</el-button>
                    </el-button-group>
                  </div> -->
                  <el-form label-width="auto" label-position="right">
                    <!-- <el-form-item label="链接标题" v-show="false">
                      <el-input placeholder="请输入链接标题" v-model="form.title" clearable maxlength="60" show-word-limit></el-input>
                    </el-form-item> -->
                    <el-form-item label="链接简介">
                      <el-input
                        placeholder="请输入链接简介"
                        v-model="form.linkAbstract"
                        clearable
                        maxlength="120"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="链接地址">
                      <el-input
                        placeholder="请输入链接地址"
                        v-model="form.link"
                        clearable
                        maxlength="256"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="链接封面">
                      <div class="image-upload" v-if="form.linkCover === ''">
                        <image-upload :on-success="(e) => getLinkCover(e)"></image-upload>
                      </div>
                      <div class="image-wrap" v-else>
                        <el-image
                          class="link-cover"
                          :src="`${imgHost}${form.linkCover}`"
                          :preview-src-list="[`${imgHost}${form.linkCover}`]"
                        ></el-image>
                        <i class="el-icon-delete" @click="deleteLinkCover"></i>
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="radar-file" v-if="form.type == 'file'">
                  <!-- <div class="btn-group">
                    <el-button-group>
                      <el-button type="primary" size="small" icon="el-icon-folder-opened">从素材库中选择</el-button>
                    </el-button-group>
                  </div> -->
                  <div class="upload-content" v-if="!form.fileUrl || form.fileUrl === ''">
                    <!-- <file-upload @onSuccess="fileUploadSuccess"></file-upload> -->
                    <upload-file
                      api="api/v1/attachments/images/tencent_cloud"
                      :size="20"
                      accept="pdf"
                      @success="fileUploadSuccess"
                    ></upload-file>
                    <!-- <div class="cont-tips">
                      文件最大20MB，支持文件格式: pdf / doc / xls / xlsx / txt / ppt 
                    </div> -->
                    <div class="cont-tips">
                      文件最大20MB，仅支持 pdf 格式文件
                    </div>
                  </div>
                  <div class="file-box" v-else>
                    <div class="file-name">{{ form.fileName }}</div>
                    <i class="el-icon-delete" @click="deleteFile"></i>
                  </div>
                  <div class="file-describe">
                    <span>文件简介</span>
                    <el-input
                      placeholder="请输入文件简介(选填)"
                      v-model="form.fileDescribe"
                      maxlength="256"
                      show-word-limit
                    ></el-input>
                    <el-tooltip
                      effect="dark"
                      placement="right"
                      content="用于发送雷达链接时作为链接的简介展示"
                      style="margin-left: 5px"
                    >
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">链接追踪设置</div>
        <div class="content">
          <div class="radar-setting">
            <div class="setting-item">
              <el-checkbox v-model="form.isBehaviorNotice">行为通知</el-checkbox>
              <span class="s-tips">（当客户点击雷达时，发送雷达的员工将会收到消息提醒）</span>
            </div>
            <div class="setting-item">
              <el-checkbox v-model="form.isActionNotice">动态通知</el-checkbox>
              <span class="s-tips">（当客户点击雷达时，会将客户的打开行为记录在客户动态里）</span>
            </div>
            <div class="setting-item">
              <el-checkbox v-model="form.isBehaviorTag">客户标签</el-checkbox>
              <span class="s-tips">（给点击雷达的客户打上选中的标签）</span>
            </div>
            <!-- <div class="setting-tags" v-if="form.isBehaviorTag">
              <el-button size="mini" icon="el-icon-plus" class="tags-btn" @click="showBehaviorDialog">选择标签</el-button>
              <el-tag type="info" class="tag-item" v-for="(item, index) in selectedTags" :key="index">{{item.name}}</el-tag>
            </div> -->
            <!-- <tags-list :data="behaviorTagList"></tags-list> -->
            <div class="setting-tags" v-if="form.isBehaviorTag">
              <el-button size="mini" icon="el-icon-plus" class="tags-btn" @click="showBehaviorDialog"
                >选择标签</el-button
              >
              <div class="selected-tags-box" v-if="selectedTags.length > 0">
                <div class="s-tag-item" v-for="(item, index) in selectedTags" :key="index">
                  <span class="tag-name">{{ item.name }}：</span>
                  分值&nbsp;&nbsp;<el-input-number size="mini" v-model="item.businessScore"></el-input-number>
                  <i class="el-icon-remove-outline" @click="deleteSelectedTag(index)"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="c-btn-group">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="submitRadarForm" :loading="isLoading">保存</el-button>
      </div>
    </div>
    <!-- 选择客户行为标签 -->
    <com-dialog :config="behaviorDialog.config" @closeDialog="closeBehaviorDialog">
      <div class="tag-dialog">
        <div class="dialog-content">
          <div class="selected-content">
            <div class="content-left">已选</div>
            <div class="content-right">
              <div class="selected-tag" v-for="(item, index) in selectedTags" :key="index">
                <span>{{ item.name }}</span>
                <i class="el-icon-close" @click="cancelSelectTag(item)"></i>
              </div>
            </div>
          </div>
          <div class="tag-list">
            <div class="tag-group" v-for="(item, index) in behaviorTagList" :key="index">
              <div class="group-title">{{ item.name }}</div>
              <div class="group-content">
                <div
                  class="tag-item"
                  v-for="(obj, idx) in item.tagList"
                  :key="idx"
                  :class="checkTagActive(obj) ? 'active' : ''"
                  @click="onTagSelect(obj)"
                >
                  {{ obj.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="group-btn">
          <el-button @click="behaviorCancel">取 消</el-button>
          <el-button type="primary" @click="behaviorConfirm">确 定</el-button>
        </div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ImageUpload from '../../components/common/ImageUpload'
import ComDialog from '../../components/common/ComDialog'
import FileUpload from '../../components/common/FileUpload'
import UploadFile from '../../components/components/UploadFile'
import TagsList from '../../components/components/TagsList.vue'
export default {
  components: {
    ImageUpload,
    ComDialog,
    FileUpload,
    UploadFile,
    TagsList
  },
  data() {
    return {
      form: {
        type: 'link', // 类型(link：链接，pdf：pdf文件)
        title: '', // 标题
        link: '', // 链接
        linkTitle: '', // 链接标题
        linkCover: '', // 链接封面
        linkAbstract: '', // 链接摘要
        fileUrl: '', // 文件路径（pdf）
        fileName: '', // 文件名称，限制100个字
        isBehaviorNotice: false, // 行为通知
        isActionNotice: false, // 动态通知
        isBehaviorTag: false, // 客户（行为）标签
        behaviorTagList: [], // 客户（行为）标签列表
        fileDescribe: '' // 文件简介，限制256个字
      },
      behaviorDialog: {
        config: {
          width: '800px',
          title: '选择标签',
          visible: false
        }
      },
      selectedTags: [], // 已选的行为标签
      behaviorTagList: [], // 行为标签列表
      isLoading: false
    }
  },
  created() {
    // this.getBehaviorTagList()
    if (this.$route.query.id) {
      this.getRadarDetail(this.$route.query.id)
    }
  },
  methods: {
    getRadarDetail(id) {
      this.$http.getInteractRadarDetail({ id }).then((res) => {
        this.form = res.data.data
        this.selectedTags = this.form.behaviorTagList || []
      })
    },
    getBehaviorTagList() {
      this.$http.getBehaviorPages().then((res) => {
        this.behaviorTagList = res.data.data
      })
    },
    // 获取链接封面
    getLinkCover(val) {
      this.form.linkCover = val
    },
    // 删除链接封面
    deleteLinkCover() {
      this.form.linkCover = ''
    },
    // 文件上传成功
    fileUploadSuccess(file) {
      console.log(file)
      if (!file) file = { name: '', address: '' }
      this.form.fileUrl = file.url
      this.form.fileName = file.name
    },
    // 删除文件
    deleteFile() {
      this.form.fileUrl = ''
    },
    showBehaviorDialog() {
      this.behaviorDialog.config.visible = true
      this.getBehaviorTagList()
    },
    closeBehaviorDialog() {
      this.behaviorDialog.config.visible = false
    },
    // 判断当前标签是否被选中
    checkTagActive(obj) {
      let flag = this.selectedTags.some((item) => item.id === obj.id)
      if (flag) {
        return true
      } else {
        return false
      }
    },
    // 选择行为标签
    onTagSelect(obj) {
      // 当前已经选中则取消选择，否则选中当前项
      let flag = this.selectedTags.some((item) => item.id === obj.id)
      if (flag) {
        this.selectedTags.splice(
          this.selectedTags.findIndex((item) => item.id === obj.id),
          1
        )
      } else {
        // obj.businessScore = obj.score || 1
        let tag = {
          id: obj.id,
          name: obj.name,
          businessScore: obj.score || 1
        }
        this.selectedTags.push(tag)
      }
    },
    cancelSelectTag(obj) {
      let flag = this.selectedTags.some((item) => item.id === obj.id)
      if (flag) {
        this.selectedTags.splice(
          this.selectedTags.findIndex((item) => item.id === obj.id),
          1
        )
      }
    },
    behaviorCancel() {
      this.behaviorDialog.config.visible = false
    },
    behaviorConfirm() {
      this.behaviorDialog.config.visible = false
    },
    // 提交雷达表单
    submitRadarForm() {
      if (this.form.title === '') {
        this.$message.warning('请输入标题')
        return
      }
      if (this.form.type === 'link') {
        // if (this.form.linkTitle === '') {
        //   // this.$message.warning('请输入链接标题')
        //   // return
        // } else
        this.form.linkTitle = this.form.title
        if (this.form.linkAbstract === '') {
          this.$message.warning('请输入链接简介')
          return
        } else if (this.form.link === '') {
          this.$message.warning('请输入链接地址')
          return
        } else if (this.form.linkCover === '') {
          this.$message.warning('请上传链接封面')
          return
        }
        this.form.fileUrl = ''
        this.form.fileName = ''
      } else if (this.form.type === 'file') {
        // 文件类型
        if (this.form.fileUrl === '') {
          this.$message.warning('请上传文件')
          return
        }
        this.form.fileName = this.form.fileName.substring(0, 90) // 文件名称限制100以下
        this.form.link = ''
        this.form.linkTitle = ''
        this.form.linkCover = ''
        this.form.linkAbstract = ''
      }
      if (this.form.isBehaviorTag) {
        let list = []
        this.selectedTags.forEach((item) => {
          let obj = {
            id: item.id,
            businessScore: item.businessScore
          }
          list.push(obj)
        })
        this.form.behaviorTagList = list
      } else {
        this.form.behaviorTagList = []
      }
      if (this.form.id) {
        this.isLoading = true
        this.$http.updateInteractRadar(this.form).then(() => {
          this.isLoading = false
          this.$message.success('修改成功')
          this.$openNewPageBack()
        })
      } else {
        this.isLoading = true
        this.$http.addInteractRadar(this.form).then(() => {
          this.isLoading = false
          this.$message.success('新增成功')
          this.$openNewPageBack()
        })
      }
    },
    goBack() {
      this.$openNewPageBack()
    },
    // 删除已选择的标签
    deleteSelectedTag(idx) {
      this.selectedTags.splice(idx, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.radar-form {
  height: 100%;
}
.container {
  // height: calc(100% - 56px);
  background-color: #ffffff;
  margin-top: 20px;
  padding: 20px;
  box-sizing: border-box;
  .module {
    .title {
      position: relative;
      padding: 10px 0;
      color: #606266;
      // border-bottom: 1px solid #f2f2f2;
      &::before {
        content: '';
        width: 6px;
        height: 20px;
        background-color: #294a7b;
        position: absolute;
        top: 0;
        bottom: 0;
        left: -20px;
        top: 8px;
      }
    }
    .content {
      max-width: 600px;
      margin: 20px 0;
      .c-tips {
        line-height: 30px;
      }
      // .c-tips {
      //   font-size: 14px;
      //   display: flex;
      //   align-items: center;
      //   background: #fff7f0;
      //   color: #bb5223;
      //   line-height: 20px;
      //   padding: 6px 10px;
      //   .el-icon-message-solid {
      //     margin-right: 10px;
      //   }
      // }
      .content-form {
        margin-top: 20px;
        .radar-link {
          margin-top: 20px;
          .image-wrap {
            position: relative;
            width: 100px;
            height: 100px;
            .link-cover {
              width: 100px;
              height: 100px;
            }
            .el-icon-delete {
              position: absolute;
              top: 0;
              right: -30px;
              font-size: 24px;
              color: #f56c6c;
              cursor: pointer;
            }
          }
        }
        .radar-file {
          margin-top: 20px;
          .upload-content {
            .cont-tips {
              color: #888;
            }
          }
          .file-box {
            width: 300px;
            border: 1px solid #eee;
            padding: 10px;
            position: relative;
            .file-name {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .el-icon-delete {
              position: absolute;
              top: 0;
              right: -30px;
              font-size: 24px;
              color: #f56c6c;
              cursor: pointer;
            }
          }
          .file-describe {
            display: flex;
            align-items: center;
            margin-top: 20px;
            span {
              width: 80px;
              color: #606266;
            }
          }
        }
      }
      .radar-setting {
        .setting-item {
          margin-bottom: 20px;
          .s-tips {
            font-size: 14px;
            color: #909399;
          }
        }
        .setting-tags {
          margin-left: 25px;
          .tags-btn {
            margin: 0 10px 10px 0;
          }
          .tag-item {
            margin: 0 10px 10px 0;
          }
          .selected-tags-box {
            padding: 20px;
            background: #fbfbfb;
            border-radius: 2px;
            border: 1px solid #eee;
            font-size: 14px;
            .s-tag-item {
              display: flex;
              align-items: center;
              margin-bottom: 20px;
              .tag-name {
                margin-right: 10px;
              }
              .el-icon-remove-outline {
                font-size: 24px;
                margin-left: 10px;
                cursor: pointer;
                color: #82848a;
              }
            }
          }
        }
      }
    }
  }
}
.tag-dialog {
  .dialog-content {
    width: 100%;
    max-height: 450px;
    overflow: auto;
    .selected-content {
      display: flex;
      margin-bottom: 20px;
      .content-left {
        margin-right: 20px;
        line-height: 34px;
      }
      .content-right {
        display: flex;
        flex-wrap: wrap;
        .selected-tag {
          display: flex;
          align-items: center;
          height: 34px;
          border-radius: 17px;
          padding: 0 10px;
          background-color: #f2f2f2;
          margin-right: 10px;
          margin-bottom: 10px;
          .el-icon-close {
            margin-left: 5px;
            cursor: pointer;
          }
        }
      }
    }
    .tag-list {
      .tag-group {
        margin-bottom: 20px;
        .group-title {
          margin-bottom: 10px;
        }
        .group-content {
          width: 100%;
          border: 1px solid #d7d7d7;
          padding: 10px;
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          overflow: auto;
          .tag-item {
            height: 34px;
            border-radius: 17px;
            padding: 0 10px;
            background-color: #f2f2f2;
            margin-right: 10px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 30px;
            cursor: pointer;
          }
          .active {
            background-color: #294a7b;
            color: #ffffff;
          }
        }
      }
    }
  }
  .group-btn {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
  }
}
.btn-group {
  margin-bottom: 20px;
}
::v-deep .el-form-item .el-form-item {
  margin-bottom: 22px;
}
</style>
