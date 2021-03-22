<template>
  <div class="wrap">
    <!-- <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: 'other' }">活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>-->
    <el-tabs type="border-card" class="border" @tab-click="handleClick">
      <!-- <el-tab-pane label="临时验证码">
        <div class="key">
          <el-button type="primary" @click="getKey()" :loading="loading">生成验证码</el-button>
          <span>验证码10分钟内有效</span>
          <p v-if="code">
            验证码：{{ code }}
            <el-button type="primary" @click="copy()" size="mini" style="margin-left: 10px;"
              >复制</el-button
            >
          </p>
        </div>
      </el-tab-pane>-->
      <el-tab-pane label="热门城市">
        <el-card class="card-wrapper" shadow="hover">
          <div slot="header" class="clearfix">
            <span>热门城市：</span>
          </div>
          <div class="tags-wrapper">
            <el-tag
              :key="index"
              v-for="(tag, index) in city.reportOptions"
              closable
              :disable-transitions="false"
              @close="handleClose(tag, 'city')"
            >{{ tag }}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
              clearable
            ></el-input>
            <el-button
              icon="el-icon-edit"
              type="primary"
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
            >新增城市</el-button>
          </div>
        </el-card>
        <div class="bottom-btn">
          <el-button @click="cancelTags()" size="small" :loading="saveLoading">取消</el-button>
          <el-button type="primary" @click="saveTag()" size="small" :loading="saveLoading">保存</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="行业">
        <el-card class="card-wrapper" shadow="hover">
          <div slot="header" class="clearfix">
            <span>热门城市：</span>
          </div>
          <div class="tags-wrapper">
            <el-tag
              :key="index"
              v-for="(tag, index) in trade.reportOptions"
              closable
              :disable-transitions="false"
              @close="handleClose(tag, 'trade')"
            >{{ tag }}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
              clearable
            ></el-input>
            <el-button
              icon="el-icon-edit"
              type="primary"
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
            >新增城市</el-button>
          </div>
        </el-card>
        <div class="bottom-btn">
          <el-button @click="cancelTags()" size="small" :loading="saveLoading">取消</el-button>
          <el-button type="primary" @click="saveTag()" size="small" :loading="saveLoading">保存</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="举报设置">
        <label>资讯举报值：</label>
        <el-input-number size="small" :min="1" v-model="report.reportNumber"></el-input-number>
        <el-card class="card-wrapper" shadow="hover">
          <div slot="header" class="clearfix">
            <span>举报原因选项信息：</span>
          </div>
          <div class="tags-wrapper">
            <el-tag
              :key="index"
              v-for="(tag, index) in report.reportOptions"
              closable
              :disable-transitions="false"
              @close="handleClose(tag, 'report')"
            >{{ tag }}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
              clearable
            ></el-input>
            <el-button
              icon="el-icon-edit"
              type="primary"
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
            >新增原因</el-button>
          </div>
        </el-card>
        <div class="bottom-btn">
          <el-button @click="cancelTags()" size="small" :loading="saveLoading">取消</el-button>
          <el-button type="primary" @click="saveTag()" size="small" :loading="saveLoading">保存</el-button>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="验证方式">
        <el-radio-group v-model="verifyModel.value" @change="changeVerifyModel('verifyModel')">
          <el-radio label="1">学号验证</el-radio>
          <el-radio label="2">班级+姓名验证</el-radio>
          <el-radio label="3">入学年份+姓名验证</el-radio>
        </el-radio-group>
      </el-tab-pane>-->
      <el-tab-pane label="分享背景图">
        <QcImageUpload v-model="imgModel.url"></QcImageUpload>
        <br />
        <br />
        <el-button @click="activitySignPostSaveOrUpdate()">保存</el-button>
        <ConfigItem name="邀请海报提示一" type="POSTER_TIPS1" />
        <ConfigItem name="邀请海报提示二" type="POSTER_TIPS2" />
      </el-tab-pane>
      <el-tab-pane label="其它设置">
        <el-switch
          inactive-text="开启资源审核"
          v-model="resourceAudit.value"
          inactive-value="close"
          active-value="open"
          @change="updateConfig('resourceAudit')"
        ></el-switch>
        <br />
        <br />
        <el-switch
          inactive-text="是否需要跳转cowebs发布资讯"
          v-model="releaseByCowebsModel.value"
          inactive-value="2"
          active-value="1"
          @change="updateConfig('releaseByCowebsModel')"
        ></el-switch>
      </el-tab-pane>
      <el-tab-pane label="客服热线">
        <el-input v-model="customer.value" style="width: 200px"></el-input>
        <br />
        <br />
        <el-button @click="updateCustomer()">保存</el-button>
      </el-tab-pane>
      <el-tab-pane label="搜索设置">
        <QcTable
          ref="table"
          :option="{
            url: 'api/admin/v1/miniProgramSearchApp/get',
            response: { list: 'data.data' }
          }"
          :column="column"
        ></QcTable>
      </el-tab-pane>
      <el-tab-pane label="咨询标题">
        <el-input v-model="titleModel.value"></el-input>
        <br />
        <br />
        <el-button type="primary" @click="updateConfig('titleModel')">保存</el-button>
      </el-tab-pane>
      <el-tab-pane label="关于我们">
        <Editor v-model="cowebsAbout.content"></Editor>
        <br />
        <br />
        <el-button type="primary" @click="updateCowebsAbout()">保存</el-button>
      </el-tab-pane>
      <el-tab-pane label="注册说明设置" v-if="isLingnan">
        <explain />
        <!-- <div class="bottom-btn">
          <el-button @click="cancelTags()" size="small" :loading="saveLoading">取消</el-button>
          <el-button type="primary" @click="saveTag()" size="small" :loading="saveLoading">保存</el-button>
        </div>-->
      </el-tab-pane>
    </el-tabs>
    <edit-image
      :visible="digImgWrap"
      image-type="activity"
      :img-name="imgName"
      :on-close="showImgBox"
      :on-singleimg="getSingleimg"
    ></edit-image>
  </div>
</template>

<script>
import api from 'apiSchool/common'
import Explain from './explain'
import upLoadMixin from '@/mixins/upLoadMixin'
import ConfigItem from './ConfigItem'
export default {
  mixins: [upLoadMixin],
  components: {
    Explain,
    ConfigItem
  },
  data() {
    return {
      code: '',
      loading: false,
      reportOptions: [],
      cacheOptions: [],
      inputVisible: false,
      inputValue: '',
      saveLoading: false,
      city: {
        reportOptions: [],
        cacheOptions: [],
        saveLoading: false,
        isGet: false
      },
      trade: {
        reportOptions: [],
        cacheOptions: [],
        saveLoading: false,
        isGet: false
      },
      report: {
        reportOptions: [],
        cacheOptions: [],
        reportNumber: 5,
        cacheNumber: 5,
        isGet: false
      },
      digImgWrap: false,
      activeIndex: 0,
      isLingnan: false,
      verifyModel: {},
      imgModel: {
        url: ''
      },
      customer: {},
      column: [
        { type: 'index', label: '序号', align: 'center' },
        { prop: 'showName', label: '名称', align: 'center' },
        {
          label: '排序',
          align: 'center',
          formatter: row => {
            return (
              <div>
                <el-button type="text" onClick={this.changeSeqnum.bind(this, row)}>
                  {row.seqNum}
                </el-button>
              </div>
            )
          }
        },
        {
          prop: 'seqNum',
          label: '操作',
          align: 'center',
          formatter: row => {
            return (
              <div>
                <el-button type="text" onClick={this.changeShowName.bind(this, row)}>
                  修改
                </el-button>
              </div>
            )
          }
        }
      ],
      cowebsAbout: {
        content: ''
      },
      resourceAudit: {
        isShow: true,
        key: 'audit_switch',
        name: '资讯发布是否需要审核',
        seqNum: 1,
        showType: 1,
        showValue: '资讯发布是否需要审核',
        type: 10,
        value: 'open'
      },
      releaseByCowebsModel: {
        isShow: true,
        key: 'RELEASE_BY_COWEBS',
        name: '发布资讯',
        seqNum: 0,
        showType: 0,
        showValue: '是否需要跳转cowebs发布资讯',
        type: 10,
        value: 1
      },
      registerModel: {
        isShow: true,
        key: 'REGISTER_AUDIT',
        name: '注册审核',
        seqNum: 0,
        showType: 0,
        showValue: '是否需要注册审核',
        type: 10,
        value: 1
      },
      titleModel: {
        isShow: true,
        key: 'INFORMATION_PAGE_TITLE',
        name: '咨询标题',
        seqNum: 0,
        showType: 0,
        showValue: '咨询标题',
        type: 10,
        value: 1
      }
    }
  },
  created() {
    // this.isLingnan = /lingnan/.test(this.base.projectName())
    // this.isLingnan =
    //   /lingnan/.test(this.base.projectName()) ||
    //   this.base.projectName() === "alumni";
    this.getVerifyType()
    // this.getVerifyType2()
    this.activitySignPostGet()

    this.appCustomer()
    this.getResourceAudit()
    this.getCowebsAbout()
    this.releaseByCowebs()
    this.getRegisterAudit()
    this.getTitle()
  },
  methods: {
    getKey() {
      this.loading = true
      api.getKey().then(res => {
        this.loading = !true
        this.code = res.data.message
      })
    },
    copy() {
      let oInput = document.createElement('input')
      oInput.value = this.code
      document.body.appendChild(oInput)
      oInput.select()
      document.execCommand('copy')
      oInput.style.display = 'none'
      document.body.removeChild(oInput)
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    handleClick(tab) {
      if (this.activeIndex === Number(tab.index)) return
      this.activeIndex = Number(tab.index)
      if (this.activeIndex === 0 && !this.city.isGet) this.getHotCity()
      if (this.activeIndex === 1 && !this.trade.isGet) this.getTrade()
      if (this.activeIndex === 2 && !this.report.isGet) {
        this.getReportNumber()
        this.getReportOptions()
      }
    },
    // 获取城市
    getHotCity() {
      api.getHotCity().then(res => {
        this.city.isGet = true
        console.log('获取城市：', res)
        let tags = res.data.data.value
        if (tags) {
          this.city.reportOptions = tags.split('_')
          this.city.cacheOptions = tags.split('_')
        } else {
          this.city.reportOptions = []
          this.city.cacheOptions = []
          this.$message.warning('暂无城市选项，请新增城市')
        }
      })
    },
    // 获取城市
    getTrade() {
      api.getTrade().then(res => {
        this.trade.isGet = true
        console.log('获取行业：', res)
        let tags = res.data.data.value
        if (tags) {
          console.log(tags.split('_'))
          this.trade.reportOptions = tags.split('_')
          this.trade.cacheOptions = tags.split('_')
        } else {
          this.trade.reportOptions = []
          this.trade.cacheOptions = []
          this.$message.warning('暂无城市选项，请新增城市')
        }
      })
    },
    // 获取资讯举报值
    getReportNumber() {
      api.getReportNumber().then(res => {
        this.report.isGet = true
        console.log('获取资讯举报值：', res.data.data)
        this.report.reportNumber = res.data.data.value
        this.report.cacheNumber = res.data.data.value
      })
    },
    // 获取举报原因选项信息
    getReportOptions() {
      api.getReportOptions().then(res => {
        this.report.isGet = true
        console.log('获取举报原因选项信息：', res)
        let tags = res.data.data.value
        if (tags) {
          this.report.reportOptions = tags.split('_')
          this.report.cacheOptions = tags.split('_')
        } else {
          this.report.reportOptions = []
          this.report.cacheOptions = []
          this.$message({
            message: '暂无举报原因选项，请新增原因',
            type: 'warning'
          })
        }
      })
    },
    getVerifyType() {
      api.getConfigType('verify_type').then(res => {
        this.verifyModel = res.data.data
      })
    },
    getVerifyType2() {
      api.getConfigType('coweb_m_logo').then(res => {
        this.model = res.data.data
      })
    },
    changeVerifyModel(type) {
      api.activitySignSuccessPost(this[type]).then(() => {
        this.$message.success('修改成功')
      })
    },
    activitySignPostSaveOrUpdate() {
      api.activitySignPostSaveOrUpdate(this.imgModel).then(() => {
        this.$message.success('保存成功')
      })
    },
    activitySignPostGet() {
      api.activitySignPostGet().then(res => {
        this.imgModel = res.data.data || { url: '' }
      })
    },
    // 删除
    handleClose(tag, type) {
      this[type].reportOptions.splice(this[type].reportOptions.indexOf(tag), 1)
    },
    // 输入
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 新增tag
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this[{ 0: 'city', 1: 'trade', 2: 'report' }[this.activeIndex]].reportOptions.push(
          inputValue
        )
        console.log('inputValue')
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 取消操作
    cancelTags() {
      this.$confirm('是否取消操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let indnex = { 0: 'city', 1: 'trade', 2: 'report' }[this.activeIndex]
          this[indnex].reportOptions = JSON.parse(JSON.stringify(this[indnex].cacheOptions))
          if (this.activeIndex === 2) this[indnex].reportNumber = this[indnex].cacheNumber
        })
        .catch(() => {})
    },
    // 保存城市信息
    saveTag() {
      this.$confirm('是否保存操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.saveLoading = true
          if (this.activeIndex === 0) {
            this.updateHotCity()
          } else if (this.activeIndex === 1) {
            this.updateTrade()
          } else {
            this.updateReportNumber()
            this.updateReportOptions()
          }
        })
        .catch(() => {})
    },
    updateTrade() {
      api.updateTrade({ value: this.trade.reportOptions.join('_') }).then(res => {
        console.log('options:', res)
        this.getHotCity()
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.saveLoading = false
      })
    },
    updateHotCity() {
      api.updateHotCity({ value: this.city.reportOptions.join('_') }).then(res => {
        console.log('options:', res)
        this.getHotCity()
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.saveLoading = false
      })
    },
    updateReportNumber() {
      api.updateReportNumber({ value: this.report.reportNumber }).then(res => {
        console.log('num:', res)
        this.getReportNumber()
      })
    },
    updateReportOptions() {
      api.updateReportOptions({ value: this.report.reportOptions.join('_') }).then(res => {
        console.log('options:', res)
        this.getReportOptions()
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.saveLoading = false
      })
    },
    appCustomer() {
      api.appCustomer().then(res => {
        this.customer = res.data.data
      })
    },
    updateCustomer() {
      api.updateCustomer(this.customer).then(() => {
        this.$message.success('保存成功')
      })
    },
    releaseByCowebs() {
      api.releaseByCowebs().then(res => {
        this.releaseByCowebsModel = Object.assign(this.releaseByCowebsModel, res.data.data)
      })
    },
    getResourceAudit() {
      api.getResourceAudit().then(res => {
        this.resourceAudit = Object.assign(this.resourceAudit, res.data.data)
      })
    },
    getRegisterAudit() {
      api.getRegisterAudit().then(res => {
        this.registerModel = Object.assign(this.registerModel, res.data.data)
        console.log(this.registerModel)
      })
    },
    getTitle() {
      api.getTitle().then(res => {
        this.titleModel = Object.assign(this.titleModel, res.data.data)
      })
    },
    updateConfig(type) {
      console.log('type',type)
      if (this[type].id) {
        api.updateConfig(this[type]).then(() => {
          this.$message.success('保存成功')
        })
      } else {
        api.insertConfig(this[type]).then(() => {
          this.$message.success('保存成功')
        })
      }
    },
    changeShowName(row) {
      let model = JSON.parse(JSON.stringify(row))
      this.$prompt('', '修改名称', {
        inputValue: model.showName
      }).then(({ value }) => {
        model.showName = value
        api.updateProjectMiniProgramSearch([model]).then(res => {
          this.$message.success('保存成功')
          this.$refs.table.onSearchKeep()
        })
      })
    },
    changeSeqnum(row) {
      let model = JSON.parse(JSON.stringify(row))
      this.$prompt('', '修改排序', {
        inputValue: model.seqNum
      }).then(({ value }) => {
        model.seqNum = value
        api.updateProjectMiniProgramSearch([model]).then(res => {
          this.$message.success('保存成功')
          this.$refs.table.onSearchKeep()
        })
      })
    },
    getCowebsAbout() {
      api.getCowebsAbout().then(res => {
        this.cowebsAbout = Object.assign(this.cowebsAbout, res.data.data)
      })
    },
    updateCowebsAbout() {
      api.updateCowebsAbout(this.cowebsAbout).then(() => {
        this.$message.success('保存成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  padding: 20px;
}
.border {
  box-shadow: 0 0 0 0;
}
.key {
  padding: 30px;
  p {
    padding: 20px 0;
    font-size: 18px;
  }
}
.card-wrapper {
  margin-top: 15px;
}
.select-text {
  margin-right: 10px;
  font-size: 16px;
  color: #606266;
}

.tags-wrapper {
  white-space: normal;
  ::v-deep .el-tag {
    background-color: transparent;
    border: 1px solid #409eff;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
  margin-top: 10px;
}

.button-new-tag {
  margin-left: 10px;
  margin-top: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  margin-top: 10px;
  vertical-align: bottom;
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
