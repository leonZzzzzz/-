<template>
  <!-- 应用 -->
  <div style="padding-bottom: 20px">
    <div class="title">配置小数桔调用接口所需要的密钥等信息</div>
    <div class="from">
      <el-form :model="formData" ref="ruleForm" label-width="135px" label-position="right" class="demo-ruleForm">
        <el-form-item
          label="应用名称"
          :rules="[{ required: true, message: '请输入应用名称', trigger: 'blur' }]"
          prop="name"
        >
          <el-input v-model="formData.name" placeholder="请输入应用名称" :disabled="isDisabled" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="应用AgentId"
          :rules="[{ required: true, message: '请输入应用AgentId', trigger: 'blur' }]"
          prop="agentId"
        >
          <div class="item_content">
            <el-input
              v-model="formData.agentId"
              placeholder="请输入应用AgentId"
              :disabled="isDisabled"
              clearable
            ></el-input>
            <el-popover
              placement="right"
              title="获取应用ID以及密钥"
              width="400"
              trigger="hover"
              content="进入https://work.weixin.qq.com/wework_admin/frame#apps应用管理-应用，进入最下方创建好的小数桔应用，复制AgentId、Secret"
            >
              <el-button slot="reference" type="text" icon="el-icon-warning-outline"></el-button>
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item
          label="应用Secret"
          :rules="[{ required: true, message: '请输入应用Secret', trigger: 'blur' }]"
          prop="secret"
        >
          <el-input
            v-model="formData.secret"
            placeholder="请输入应用Secret"
            :disabled="isDisabled"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="updateButton" v-show="isDisabled">修改</el-button>
          <el-button type="primary" @click="createCompany" v-if="isNewFlag && !isDisabled">保存</el-button>
          <el-button type="primary" @click="updateCompany" v-if="!isNewFlag && !isDisabled">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="title">配置小数桔应用</div>
    <div class="words_content">
      <p class="second_title">1.配置应用侧边栏</p>
      <p class="second_content">在已创建的应用基础上选择“配置到聊天工具栏”功能；</p>
      <p class="second_content">配置页面：页面名称根据需要填写，例如“话术库/客户画像”，页面内容选择自定义，</p>
      <p class="second_content">页面url根据需要填写：</p>
      <p class="second_content">
        话术库：{{ copySpeechcraft }}
        <el-button type="text" :data-clipboard-text="copySpeechcraft" class="copy-speechcraft" @click="copyTextB('copy-speechcraft')">复制</el-button>
      </p>
      <p class="second_content">
        客户画像：{{ copySustomerInfo }}
        <el-button type="text" :data-clipboard-text="copySustomerInfo" class="copy-sustomer-info" @click="copyTextB('copy-sustomer-info')">复制</el-button>
      </p>
      <p class="second_title">2.配置网页授权域名</p>
      <p class="second_content">
        设置可信域名为“{{ copyCom }}”
        <el-button type="text" :data-clipboard-text="copyCom" class="copy-com" @click="copyTextB('copy-com')">复制</el-button>
        ，可作为应用OAuth2.0网页授权功能的回调域名
      </p>
      <p class="second_title">3.申请校验域名</p>
      <el-form label-width="135px" label-position="right">
        <el-form-item label="上传应用验证文件" :required="true">
          <UploadFile
            :api="'api/admin/v1.2/upload-file'"
            accept="txt"
            :size="5"
            @success="UploadFileSuccess"
          ></UploadFile>
        </el-form-item>
        <el-form-item label="文件" :required="true" v-if="fileName">
          <a :href="`https://x.wego168.com/${fileName}`" target="_blank">{{ fileName }}</a>
        </el-form-item>
      </el-form>
      <p class="second_title">4.接收消息配置</p>
      <el-form label-width="135px" label-position="right">
        <el-form-item label="URL" style="color: #606266; margin-bottom: 4px">
          {{ informationURL }} <el-button type="text" :data-clipboard-text="informationURL" class="copy-info-url" @click="copyTextB('copy-info-url')">复制</el-button>
        </el-form-item>
        <el-form-item label="Token" style="color: #606266; margin-bottom: 4px">
          {{ informationToken }}
          <el-button type="text" :data-clipboard-text="informationToken" class="copy-info-token" @click="copyTextB('copy-info-token')">复制</el-button>
        </el-form-item>
        <el-form-item label="EncodingAESKey" style="color: #606266; margin-bottom: 4px">
          {{ informationEncodingAESKey }}
          <el-button type="text" :data-clipboard-text="informationEncodingAESKey" class="copy-info-key" @click="copyTextB('copy-info-key')">复制</el-button>
        </el-form-item>
      </el-form>
      <p class="second_title">5.可调用应用设置</p>
      <p class="second_content">路径：【客户联系】>【客户】>【可调用应用】>勾选“小数桔"应用</p>
      <p class="second_title">6.配置客户联系权限</p>
      <p class="second_content">拥有客户联系功能权限的成员，才能正常使用渠道活码等功能</p>
    </div>
  </div>
</template>
<script>
import api from '../../../api/dispose'
import Clipboard from 'clipboard'
import UploadFile from '../../../components/components/UploadFile'
export default {
  components: {
    UploadFile
  },
  data() {
    return {
      // 表单数据
      formData: {
        name: '',
        appId: '',
        secret: ''
      },
      // 是否为修改可编辑状态
      isDisabled: true,
      // 是否未新建
      isNewFlag: true,
      // 企业号名称
      id: '',
      // 企业号id
      name: '',
      clipboardB: '',
      copySpeechcraft: '',
      copySustomerInfo: '',
      copyCom: 'x.wego168.com',
      informationURL: '',
      informationToken: 'fGd8gtYy4HSiGw3O7CBM9',
      informationEncodingAESKey: '7eeFtWjgRV4SzdxhJKA3cPZlGQqkm877fgyVqj8zkCQ',
      fileName: '',
      appCode: ''
    }
  },
  methods: {
    // ---页面渲染---
    // 修改
    updateButton() {
      this.isDisabled = false
    },
    UploadFileSuccess(val) {
      console.log(val)
      this.$message.success('上传成功')
      this.fileName = val.name
    },
    // 获取appCode
    getAppCode() {
      this.appCode = sessionStorage.getItem('appCode')
      if (!this.appCode || this.appCode == '-1') {
        this.appCode = location.pathname.match(/\/\w+/g)[0].replace('/', '')
      }
      this.copySpeechcraft = 'https://x.wego168.com/' + this.appCode + '/scrm/#/sidebar/speechcraft'
      this.copySustomerInfo = 'https://x.wego168.com/' + this.appCode + '/scrm/#/sidebar/customerInfo'
      this.informationURL = 'https://x.wego168.com/' + this.appCode + '/api/v1/crop/receive'
    },
    // ---获取数据---
    // 获取授权信息
    disposePage(options) {
      let id = this.$store.state.dispose.id
      let name = this.$store.state.dispose.name
      if (!id || !name) {
        this.$message.success('请先完成企业配置再进行应用配置')
        return
      }
      this.id = id
      this.name = name
      api.disposePage(options).then(res => {
        let data = res.data.data.list
        if (!data || data.length == 0) {
          this.isDisabled = false
          this.isNewFlag = true
          return
        }
        for (var i = 0; i < data.length; i++) {
          if (data[i].mark == 'contact') {
            console.log('item.agentId != -1，进入了这里，禁止输入框，进行修改操作')
            this.formData = data[i]
            this.isDisabled = true
            this.isNewFlag = false
            break
          } else {
            console.log('item.agentId == -1，进入了这里，允许输入框，进行新增操作')
            this.isDisabled = false
            this.isNewFlag = true
          }
        }
      })
    },
    // 新建授权
    createCompany() {
      if (this.isDisabled) {
        return
      }
      this.$refs.ruleForm.validate(valid => {
        this.formData.cropId = this.id
        this.formData.customerSecret = -1
        this.formData.mark = 'contact'
        this.formData.signatureToken = -1
        this.formData.signatureKey = -1
        if (valid) {
          api.disposeAdd(this.formData).then(() => {
            this.$message.success('新建成功')
            this.isDisabled = true
            this.disposePage()
          })
        } else {
          return false
        }
      })
    },
    // 修改授权
    updateCompany() {
      if (this.isDisabled) {
        return
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          api.disposeUpdate(this.formData).then(res => {
            this.disposePage()
            this.$message.success('修改成功')
          })
        } else {
          return false
        }
      })
    },
    copyTextB(className) {
      this.clipboardB = new Clipboard('.' + className)
      this.clipboardB.on('success', e => {
        this.$message.success('复制成功')
        if (this.clipboardB) {
          this.clipboardB.destroy()
        }
      })
      this.clipboardB.on('error', e => {
        this.$message.error('复制失败')
        if (this.clipboardB) {
          this.clipboardB.destroy()
        }
      })
    }
  },
  created() {
    this.disposePage()
    this.getAppCode()
  },
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  padding: 20px 0;
  color: #606266;
  position: relative;
  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 20px;
    background-color: #294a7b;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    left: -20px;
  }
}
.from {
  width: 600px;
  .item_content {
    width: 494px;
    display: flex;
    .el-button {
      margin-left: 10px;
    }
  }
}
.words_content {
  p {
    width: 600px;
    font-size: 14px;
    color: #606266;
    min-height: 36px;
    line-height: 36px;
    &.second_content {
      text-indent: 2em;
    }
  }
}
</style>
