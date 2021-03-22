<template>
  <div class="app-project">
    <div class="app-project__item app-wrap">
      <div class="app-info">
        <img class="app-info__avatar" :src="model.logo" style="width:70px;height:70px;" />
        <div class="app-info__text">
          <p class="project-name">{{ model.projectName }}</p>
          <p>AppId：{{ model.wechatAppId }}</p>
          <el-button type="primary" size="mini" style="margin-top: 10px;" @click="pluginsVisible = true"
            >插件管理</el-button
          >
          <p v-if="isShowAuthorize" class="authorize-tips">
            <i class="el-icon-warning" style="color: #E6A23C;font-size: 16px;"></i>
            请先到【公众号配置】页面授权小程序，并绑定开放平台
          </p>
        </div>
      </div>
      <el-button type="primary" @click="$router.push('/flywheel/editor')">新建项目</el-button>
    </div>
    <div class="app-project__item">
      <div class="app-project__item-title">页面管理</div>
      <QcTable
        ref="table"
        :option="{ url: 'api/v1.0/layout-app/page', isFull: false, height: '250px' }"
        :column="column"
      ></QcTable>
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
      @close="qrcodeVisible = false"
    ></PreviewDialog>
    <FeedbackDialog :visible="feedbackVisible" @close="feedbackClose"></FeedbackDialog>
    <TemplateDialog :visible="showSelectTemp" @close="templateClose"></TemplateDialog>
    <PluginsDialog v-if="pluginsVisible" :visible.sync="pluginsVisible" :weapp-id="model.wechatAppId"></PluginsDialog>
  </div>
</template>

<script>
import FeedbackDialog from './FeedbackDialog'
import PreviewDialog from './PreviewDialog'
import TemplateDialog from './TemplateDialog'
import PluginsDialog from './PluginsDialog'
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
      showSelectTemp: false,
      pluginsVisible: false,
      column: [
        { label: '版本号', prop: 'userVersion', width: '100px' },
        { label: '版本简介', prop: 'userDesc' },
        { label: '创建时间', prop: 'createTime' },
        {
          label: '版本管理',
          align: 'center',
          formatter: (row) => {
            return (
              <el-button
                type="text"
                onClick={() => {
                  this.showSelectTemp = true
                  this.projectId = row.id
                }}
              >
                上传项目
              </el-button>
            )
          }
        },
        {
          label: '操作',
          width: '200px',
          align: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  style="margin-left: 10px;"
                  type="text"
                  icon="el-icon-edit"
                  onClick={() =>
                    this.$router.push({
                      path: `/flywheel/editor`,
                      query: { id: row.id, userVersion: row.userVersion, userDesc: row.userDesc }
                    })
                  }
                >
                  修改
                </el-button>
                <el-button
                  style="margin-left: 10px;"
                  type="text"
                  icon="el-icon-delete"
                  onClick={this.deleteProject.bind(this, row.id)}
                >
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      isShowAuthorize: false, // 是否显示授权小程序按钮
      previewModel: null,
      auditModel: null
    }
  },
  created() {
    this.getWxAppConfig()
    this.getThirdPartyCommitCode('preview')
    this.getThirdPartyCommitCode('audit')
    // setTimeout(() => {
    //   this.updateThirdPartyCommitCode('AUDIT_FAIL', 'audit')
    // }, 3000)
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
    getWxAppConfig() {
      this.$http
        .getWxAppConfig()
        .then((res) => {
          this.isShowAuthorize = false
          this.model = res.data.data
        })
        .catch((err) => {
          if (err && err.data) {
            // 报错一般是因为没授权小程序
            this.isShowAuthorize = true
          }
        })
    },
    deleteProject(id) {
      this.$confirm('删除后将不可恢复，请谨慎操作', '删除提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '关闭',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http.deleteProject({ id }).then(() => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    },
    templateClose(data) {
      this.showSelectTemp = false
      let { templateId } = data
      console.log('上传中', data)
      if (this.projectId && templateId) {
        this.$confirm('上传成功后将会替换之前的体验版的小程序，是否确认上传？', '操作提示', {
          center: true,
          type: 'warning'
        })
          .then(() => {
            this.commitCode(this.projectId, templateId)
          })
          .catch(() => {})
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
        // 获取ext的相关数据
        const commitModel = await this.$http.getProject({ id })
        const { extJson, userVersion, userDesc, path } = commitModel.data.data
        // 注意区分是店铺端小程序还是门店端
        // 现在模板库对接了店铺的端的代码，所以不能默认选中最新的，需要让用户手动选择模板
        // 获取最新版本的小程序模板ID
        // const res = await this.$http.getTemplateList()
        // const templateId = Math.max.apply(
        //   null,
        //   res.data.data.map(item => {
        //     return item.template_id
        //   })
        // )
        // 代码上传第三方
        await this.$http.commitCode({
          extJson,
          userVersion,
          userDesc,
          templateId
        })
        const content = {
          userVersion,
          userDesc,
          path,
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
          this.$http.submitAudit().then(() => {
            let model = JSON.parse(JSON.stringify(this.previewModel))
            model.code = 'audit'
            this.updateThirdPartyCommitCode('AUDIT_GOING', 'audit', model)
            this.$message.success('提交成功，请等待微信审核...')
          })
        })
        .catch(() => {})
    },
    speedAudit() {
      this.$http.getLatestAuditstatus().then((res) => {
        if (res.data.data.code !== 0) {
          this.$confirm('加急成功后，微信将会在2~12小时内处理你的审核请求。是否执行该操作', '操作提示', {
            center: true,
            type: 'warning'
          })
            .then(() => {
              this.$http.speedAudit({ auditId: res.data.data.auditid }).then(() => {
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
          this.$http.undoCodeAudit().then(() => {
            this.updateThirdPartyCommitCode('AUDIT_UNDO', 'audit')
          })
        })
        .catch(() => {})
    },
    releasePassCode() {
      this.$http
        .releasePassCode()
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
      this.$http.revertCode().then(() => {
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
      this.$http.getThirdPartyCommitCode({ code }).then((res) => {
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
      console.log(model)
      this.$http.updateThirdPartyCommitCode(model).then(() => {
        this.getThirdPartyCommitCode(type)
      })
    },
    // 查询最后一次的审核状态
    getLatestAuditstatus(status) {
      this.$http.getLatestAuditstatus().then((res) => {
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
        .authorize-tips {
          margin-top: 10px;
          font-size: 14px;
          line-height: 1.5;
          color: #888;
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
