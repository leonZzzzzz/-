<template>
  <div class="app-project">
    <div class="app-project__item app-wrap">
      <div class="app-info">
        <img class="app-info__avatar" :src="model.logo" style="width:70px;height:70px;" />
        <div class="app-info__text">
          <p class="project-name">{{ model.projectName }}</p>
          <p>AppId：{{ model.wechatAppId }}</p>
          <el-button
            v-if="isShowAuthorize"
            type="primary"
            size="mini"
            style="margin-top: 10px;margin-right: 10px;"
            :loading="authorizeBtnLoading"
            @click="authorizeWeapp"
            >授权小程序</el-button
          >
          <el-button type="primary" size="mini" style="margin-top: 10px;" @click="pluginsVisible = true"
            >插件管理</el-button
          >
        </div>
      </div>
      <div><el-button type="text" @click="uploadProject()">上传项目</el-button><br /></div>
    </div>

    <div class="app-project__item" v-if="auditModel">
      <div class="app-project__item-title">审核版本</div>
      <div class="app-project__item-wrap">
        <el-form style="flex: 110px 0 1;" label-position="top">
          <el-form-item label="版本号" style="margin-bottom:0">
            <p style="font-size: 22px;margin-top: -12px;">{{ auditModel.userVersion }}</p></el-form-item
          >
        </el-form>
        <el-form style="flex: 500px 0 1;" label-position="left" label-width="85px">
          <el-form-item label="提审时间" style="margin-bottom:0">{{
            auditModel.updateTime || auditModel.createTime
          }}</el-form-item>
          <el-form-item label="简介" style="margin-bottom:0">{{ auditModel.userDesc }}</el-form-item>
          <el-form-item label="状态" style="margin-bottom:0">{{ auditModel.status | projectStatus }}</el-form-item>
          <el-form-item label="拒绝原因" v-if="auditModel.status === 'AUDIT_FAIL'" style="margin-bottom:0"
            ><div v-html="auditModel.reason"></div
          ></el-form-item>
        </el-form>
        <div style="flex: 1;text-align:right">
          <template
            v-if="
              auditModel.status === 'AUDIT_GOING' ||
                auditModel.status === 'AUDIT_SPEED' ||
                auditModel.status === 'AUDIT_FEEDBACKING'
            "
          >
            <el-button type="text" @click="getLatestAuditstatus(auditModel.status)">查询审核状态</el-button><br />
            <el-button type="text" @click="undoCodeAudit()">撤销审核</el-button><br />
            <el-button type="text" @click="speedAudit()" v-if="auditModel.status === 'AUDIT_GOING'">加速审核</el-button
            ><br />
          </template>
          <template v-else>
            <el-button type="text" @click="getLatestAuditstatus(auditModel.status)">刷新</el-button><br />
          </template>
          <template v-if="auditModel.status === 'AUDIT_SUCCESS'">
            <el-button type="text" @click="releasePassCode()">发布小程序</el-button><br />
          </template>
          <template v-if="auditModel.status === 'AUDIT_RELEASE'">
            <el-button type="text" @click="revertCode()">回退版本</el-button><br />
          </template>
          <template v-if="auditModel.status === 'AUDIT_FAIL'">
            <el-button type="text" @click="feedbackVisible = true">反馈</el-button><br />
          </template>
        </div>
      </div>
    </div>
    <div class="app-project__item" v-if="previewModel">
      <div class="app-project__item-title">体验版本</div>
      <div class="app-project__item-wrap">
        <el-form style="flex: 110px 0 1;" label-position="top">
          <el-form-item label="版本号" style="margin-bottom:0">
            <p style="font-size: 22px;margin-top: -12px;">{{ previewModel.userVersion }}</p></el-form-item
          >
        </el-form>
        <el-form style="flex: 500px 0 1;" label-position="left" label-width="85px">
          <el-form-item label="上传时间" style="margin-bottom:0">{{
            previewModel.updateTime || previewModel.createTime
          }}</el-form-item>
          <el-form-item
            label="简介"
            style="m+
          argin-bottom:0"
            >{{ previewModel.userDesc }}</el-form-item
          >
        </el-form>
        <div style="flex: 1;text-align:right">
          <el-button type="text" @click="qrcodeVisible = true">项目预览</el-button>
          <br />
          <el-button type="text" @click="submitAudit()">提交审核</el-button>
        </div>
      </div>
    </div>
    <PreviewDialog
      :visible="qrcodeVisible"
      :path="previewModel ? previewModel.path : ''"
      type="mall-store"
      @close="qrcodeVisible = false"
    ></PreviewDialog>
    <FeedbackDialog :visible="feedbackVisible" @close="feedbackClose"></FeedbackDialog>
    <TemplateDialog :visible="showSelectTemp" @close="templateClose"></TemplateDialog>
    <!-- 版本简介 -->
    <el-dialog :visible="versionVisible" append-to-body title="信息简介" :show-close="false" width="450px">
      <el-form ref="extModel" :model="extModel" label-position="right" label-width="80px">
        <el-form-item label="版本号" prop="userVersion" :rules="[{ required: true, message: '请填写版本号' }]">
          <el-input v-model="extModel.userVersion" placeholder="例：1.0.0"></el-input>
        </el-form-item>
        <el-form-item label="版本简介" prop="userDesc" :rules="[{ required: true, message: '请填写版本简介' }]">
          <el-input type="textarea" v-model="extModel.userDesc" placeholder="简介该版本的功能"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onCloseVersion()">关闭</el-button>
        <el-button @click="onSubmitVersion()" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <PluginsDialog v-if="pluginsVisible" :visible.sync="pluginsVisible" :weapp-id="model.wechatAppId"></PluginsDialog>
  </div>
</template>

<script>
import FeedbackDialog from './FeedbackDialog'
import PreviewDialog from './PreviewDialog'
import TemplateDialog from './TemplateDialog'
import createExtJson from './storeExt'
import PluginsDialog from './PluginsDialog'

/**
 * 模板类型（前后端约定的字段，并非微信官方提供）
 * 不传purpose字段时 默认是小蜘蛛用户端小程序；
 * mall-store: 小蜘蛛商家端小程序；
 * scrm-card: 小数桔【名片，商城，官网】小程序；
 */
const purpose = 'scrm-card'

export default {
  components: {
    FeedbackDialog,
    PreviewDialog,
    TemplateDialog,
    PluginsDialog
  },
  data() {
    return {
      model: {},
      feedbackVisible: false,
      qrcodeVisible: false,
      pluginsVisible: false, // 插件管理
      showSelectTemp: false,
      previewModel: null,
      auditModel: null,
      versionVisible: false,
      authorizeBtnLoading: false, // 授权按钮加载状态
      isShowAuthorize: false, // 是否显示授权小程序按钮
      extModel: {
        userVersion: '',
        userDesc: ''
      }
    }
  },
  created() {
    this.getWxAppConfig()
  },
  filters: {
    projectStatus(val) {
      return {
        AUDIT_SUCCESS: '审核通过',
        AUDIT_FAIL: '审核失败',
        AUDIT_GOING: '审核中',
        AUDIT_SPEED: '加速审核中',
        AUDIT_UNDO: '审核撤回',
        AUDIT_DELAY: '审核延后',
        AUDIT_RELEASE: '小程序已发布',
        AUDIT_REVERT: '版本已回退',
        AUDIT_FEEDBACKING: '审核反馈中'
      }[val]
    }
  },
  methods: {
    async getWxAppConfig() {
      try {
        let res = await this.$http.getWxAppConfig({ purpose: purpose })
        this.model = res.data.data
        this.getThirdPartyCommitCode('preview')
        this.getThirdPartyCommitCode('audit')
        let res2 = await this.$http.getWxAppConfig() // 对应的用户端小程序appId
        this.model.consumerWXAppId = res2.data.data.appId
      } catch (err) {
        if (err && err.data) {
          // 报错一般是因为没授权小程序(这里的授权需要加指定的参数purpose)
          this.isShowAuthorize = true
        }
      }
    },
    // 授权小程序
    authorizeWeapp() {
      // 获取微信配置信息
      this.authorizeBtnLoading = true
      this.$http
        .getAppWechatConfig()
        .then((res) => {
          this.authorizeBtnLoading = false
          let wechatConfig = res.data.data
          this.$confirm('请在新打开的页面中完成授权', '提示', {
            confirmButtonText: '已完成授权',
            cancelButtonText: '取消',
            type: 'info'
          })
            .then(() => {
              // 刷新当前页面，重新get数据
              this.getWxAppConfig()
            })
            .catch(() => {
              // 刷新当前页面，重新get数据
              this.getWxAppConfig()
            })
          window.open(
            `${this.baseUrl}/open/wx/login?appId=${wechatConfig.appId}${purpose ? '&purpose=' + purpose : ''}`
          )
        })
        .catch(() => {
          this.authorizeBtnLoading = false
        })
    },
    uploadProject() {
      // 获取ext的相关数据
      if (!this.model.wechatAppId) {
        this.$message.error('getWxAppConfig：未获取小程序到配置信息')
        return
      }
      this.$confirm('上传成功后将会替换之前的体验版的小程序，是否确认上传？', '操作提示', {
        center: true,
        type: 'warning'
      })
        .then(() => {
          this.versionVisible = true
          this.projectId = ''
        })
        .catch(() => {})
    },
    onSubmitVersion() {
      this.$refs.extModel.validate((flag) => {
        if (flag) {
          this.versionVisible = false
          this.showSelectTemp = true
        }
      })
    },
    onCloseVersion() {
      this.versionVisible = false
    },
    templateClose(data) {
      this.showSelectTemp = false
      let { templateId } = data
      console.log('上传==>', data)
      if (templateId) {
        this.commitCode(this.projectId, templateId)
      }
    },
    async commitCode(id, templateId) {
      const loading = this.$loading({
        lock: true,
        text: '请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(135, 135, 135, 0.7)'
      })
      try {
        let storeExtData = createExtJson(this.model)
        const commitModel = {
          extJson: JSON.stringify(storeExtData),
          // path: storeExtData.pages[0],
          userVersion: this.extModel.userVersion,
          userDesc: this.extModel.userDesc
        }
        const { extJson, userVersion, userDesc } = commitModel
        // 注意区分是店铺端小程序还是门店端
        // 现在模板库对接了店铺的端的代码，所以不能默认选中最新的，需要让用户手动选择模板
        // 代码上传第三方
        await this.$http.commitCode({
          extJson,
          userVersion,
          userDesc,
          templateId,
          purpose: purpose
        })
        const content = {
          userVersion,
          userDesc,
          code: 'preview',
          status: 'AUDIT_GOING'
        }
        this.$message.success('上传成功！')
        loading.close()
        this.updateThirdPartyCommitCode('AUDIT_GOING', 'preview', content)
      } catch (err) {
        console.log(err)
        loading.close()
      }
    },
    submitAudit() {
      if (this.auditModel) {
        const status = this.auditModel.status
        if (status === 'AUDIT_FEEDBACKING' || status === 'AUDIT_GOING' || status === 'AUDIT_SPEED') {
          this.$message.warning('当前有版本在审核，请等待审核完成后再尝试。')
          return
        }
      }
      this.$confirm('项目将提交到微信，进行审核。这通常需要1~7天。', '提交审核', {
        confirmButtonText: '提交审核',
        cancelButtonText: '关闭',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http.submitAudit({ purpose: purpose }).then(() => {
            let model = JSON.parse(JSON.stringify(this.previewModel))
            model.code = 'audit'
            this.updateThirdPartyCommitCode('AUDIT_GOING', 'audit', model)
            this.$message.success('提交成功，请等待微信审核...')
          })
        })
        .catch(() => {})
    },
    speedAudit() {
      this.$http.getLatestAuditstatus({ purpose: purpose }).then((res) => {
        if (res.data.data.code !== 0) {
          this.$confirm('加急成功后，微信将会在2~12小时内处理你的审核请求。是否执行该操作', '操作提示', {
            center: true,
            type: 'warning'
          })
            .then(() => {
              this.$http.speedAudit({ auditId: res.data.data.auditid, purpose: purpose }).then(() => {
                this.$message.success('加急处理成功！')
                this.updateThirdPartyCommitCode('AUDIT_SPEED', 'audit')
              })
            })
            .catch(() => {})
        } else {
          this.$message.success('项目已经审核完成，无需进行加速审核')
          this.updateThirdPartyCommitCode('AUDIT_SUCCESS', 'audit')
        }
      })
    },
    undoCodeAudit() {
      this.$confirm('每天审核撤回次数最多不超过 1 次，一个月不超过 10 次。', '次数限制，请谨慎操作', {
        confirmButtonText: '确认撤销',
        cancelButtonText: '关闭',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http.undoCodeAudit({ purpose: purpose }).then(() => {
            this.updateThirdPartyCommitCode('AUDIT_UNDO', 'audit')
          })
        })
        .catch(() => {})
    },
    releasePassCode() {
      this.$http
        .releasePassCode({ purpose: purpose })
        .then(() => {
          this.$message.success('发布成功')
          this.updateThirdPartyCommitCode('AUDIT_RELEASE', 'audit')
        })
        .catch((err) => {
          if (
            err &&
            err.data &&
            err.data.message &&
            err.data.message.includes('发布已通过审核的小程序失败app is already released')
          ) {
            setTimeout(() => {
              this.$message.close()
              this.$message.success('当前版本已经发布过啦')
              this.updateThirdPartyCommitCode('AUDIT_RELEASE', 'audit')
            }, 500)
          }
        })
    },
    revertCode() {
      this.$http.revertCode({ purpose: purpose }).then(() => {
        this.$message.success('版本回退成功')
        this.updateThirdPartyCommitCode('AUDIT_REVERT', 'audit')
      })
    },
    feedbackClose(flag) {
      this.feedbackVisible = false
      if (flag) {
        this.updateThirdPartyCommitCode('AUDIT_FEEDBACKING', 'audit')
      }
    },
    // 查询状态
    getThirdPartyCommitCode(code) {
      this.$http.getThirdPartyCommitCode({ code, purpose: purpose }).then((res) => {
        if (res.data.data) {
          this[code + 'Model'] = res.data.data
        }
      })
    },
    /**
     * 更新版本的状态
     * @params {string} status 审核状态
     * @params {string} type 类型 audit 审核 preview 预览
     * @params {object} content 数据 如果传了使用传递的，没传则根据类型来获取相关的数据
     */
    updateThirdPartyCommitCode(status, type, content = null) {
      let model = null
      if (content) {
        model = content
      } else {
        model = JSON.parse(JSON.stringify(this[type + 'Model']))
        model.status = status
      }
      model.purpose = purpose
      console.log(model)
      this.$http.updateThirdPartyCommitCode(model).then(() => {
        this.getThirdPartyCommitCode(type)
      })
    },
    // 查询最后一次的审核状态
    getLatestAuditstatus(status) {
      this.$http.getLatestAuditstatus({ purpose: purpose }).then((res) => {
        let code = { 0: 'AUDIT_SUCCESS', 1: 'AUDIT_FAIL', 2: 'AUDIT_GOING', 3: 'AUDIT_UNDO', 4: 'AUDIT_DELAY' }[
          res.data.data.status
        ]
        if (code === 'AUDIT_GOING' && (status === 'AUDIT_SPEED' || status === 'AUDIT_FEEDBACKING')) {
          return
        }
        if (code !== status) {
          this.auditModel.status = code
          this.auditModel.reason = res.data.data.reason
          this.updateThirdPartyCommitCode(code, 'audit')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-project {
  // padding: 40px 60px 0;
  padding-top: 20px;
  width: 800px;
  margin: 0 auto;
  &__item {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-bottom: 1px solid #eee;
    &-title {
      font-size: 22px;
      padding-bottom: 20px;
    }
    &-wrap {
      display: flex;
    }
  }
  .app-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .app-info {
      display: flex;
      align-items: center;
      &__avatar {
        border-radius: 50%;
        margin-right: 20px;
        border: 1px solid #eee;
      }
      &__text {
        font-size: 14px;
        .project-name {
          font-size: 18px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .pay-config {
    padding: 25px 15px;
    border-radius: 3px;
    margin-top: 34px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #dcdcdc;
    .info {
      font-size: 14px;
      span {
        color: #696969;
      }
    }
  }
}
</style>
