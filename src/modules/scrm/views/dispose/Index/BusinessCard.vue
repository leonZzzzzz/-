<template>
  <div style="padding-bottom: 20px">
    <div class="title">配置名片小程序调用接口所需要的密钥等信息</div>
    <div class="tips">
      <p>
        配置已经创建的名片小程序应用，用于成员在企业微信环境中打开名片小程序进行企业用户授权等操作
      </p>
    </div>
    <div class="form">
      <el-form
        :model="formData"
        ref="cardConfig"
        label-width="135px"
        label-position="right"
      >
        <el-form-item
          label="应用名称"
          :rules="[{ required: true, message: '请输入应用名称', trigger: 'blur' }]"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            placeholder="请输入应用名称"
            :disabled="isDisabled"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="应用AgentId"
          :rules="[{ required: true, message: '请输入应用AgentId', trigger: 'blur' }]"
          prop="agentId"
        >
          <el-input
            v-model="formData.agentId"
            placeholder="请输入应用AgentId"
            :disabled="isDisabled"
            clearable
          >
          </el-input>
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
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button plain v-if="isDisabled" @click="isDisabled = false">修改</el-button>
          <el-button type="primary" v-else @click="submitFormData">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="title">配置名片小程序</div>
    <div class="words_content">
      <p>
        登录到
        <a
          href="https://work.weixin.qq.com/wework_admin/frame#apps/minAppIndex"
          target="_blank"
          style="color: #606266"
        >
          [企微后台关联小程序页面]
        </a>，
        关联小程序后，复制应用名称、agentId、secret到上面表单的指定位置后保存即可。
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        appId: '',
        secret: ''
      },
      isDisabled: true,
    }
  },
  created() {
    this.getCardWeapp()
  },
  methods: {
    getCardWeapp() {
      this.$http.getCropBusinessCardWeapp().then(res => {
        if (res.data.data) {
          this.formData = res.data.data
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      })
    },
    submitFormData() {
      this.$refs.cardConfig.validate(valid => {
        if (valid) {
          if (this.formData.id) {
            // 修改数据
            let params = {
              id: this.formData.id,
              agentId: this.formData.agentId,
              name: this.formData.name,
              secret: this.formData.secret
            }
            console.log('修改参数', params)
            this.$http.updateCropBusinessCardWeapp(params).then(() => {
              this.$message.success('修改成功')
              this.getCardWeapp()
            })
          } else {
            // 创建数据
            let params = {
              agentId: this.formData.agentId,
              name: this.formData.name,
              secret: this.formData.secret
            }
            console.log('新建参数', params)
            this.$http.insertCropBusinessCardWeapp(params).then(() => {
              this.$message.success('新建成功')
              this.getCardWeapp()
            })
          }
        }
      })
    }
  }
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
.tips {
  margin-bottom: 20px;
  p {
    width: 660px;
    font-size: 14px;
    color: #606266;
    min-height: 36px;
    line-height: 36px;
  }
}
.form {
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
    width: 660px;
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