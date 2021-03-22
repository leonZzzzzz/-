<template>
  <el-dialog
    title="小鹅通应用信息"
    :visible="visible"
    :show-close="false"
    append-to-body
    :close-on-click-modal="false"
    width="650px"
  >
    <el-form :model="model" ref="model" label-width="180px" label-position="left">
      <el-form-item prop="clientId" label="clientId" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-input v-model="model.clientId"></el-input>
      </el-form-item>
      <el-form-item prop="clientSecret" label="clientSecret" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-input v-model="model.clientSecret"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="应用名称" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item prop="storeId" label="授权店铺ID" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-input v-model="model.storeId"></el-input>
      </el-form-item>
      <el-form-item prop="token" label="消息校验Token" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-input
          v-model="model.token"
          readonly
          placeholder="如小鹅通应用未配置消息验证Token，请点击随机生成"
          maxlength="16"
          show-word-limit
        ></el-input>
        <el-button type="text" @click="createValue('token')">随机生成</el-button>
      </el-form-item>
      <el-form-item prop="key" label="消息加密key" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-input
          readonly
          v-model="model.key"
          placeholder="如小鹅通应用未配置消息加密key，请点击随机生成"
          maxlength="43"
          show-word-limit
        ></el-input>
        <el-button type="text" @click="createValue('key')">随机生成</el-button>
      </el-form-item>
      <el-form-item
        prop="miniProgramAppId"
        label="小鹅通小程序appid"
        :rules="[{ required: true, message: '请填写该字段' }]"
      >
        <el-input v-model="model.miniProgramAppId"></el-input>
      </el-form-item>
      <el-form-item
        prop="miniProgramIndexPath"
        label="小鹅通小程序首页路径"
        :rules="[{ required: true, message: '请填写该字段' }]"
      >
        <el-input v-model="model.miniProgramIndexPath"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="open" type="text" style="float: left;">接入指南</el-button>
      <el-button @click="onClose()">关闭</el-button>
      <el-button type="primary" @click="onSave()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from '../../api/app'
export default {
  props: {
    guide: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible(val) {
      if (val && this.id != '') {
        this.appList()
      }
    }
  },
  data() {
    return {
      model: {
        clientId: '',
        clientSecret: '',
        name: '',
        storeId: '',
        token: '',
        key: '',
        miniProgramAppId: '',
        miniProgramIndexPath: ''
      }
    }
  },
  methods: {
    open() {
      window.open(this.guide)
    },
    appList() {
      api.appList().then((res) => {
        this.model = res.data.data[0]
      })
    },
    createValue(type) {
      const url =
        type == 'token' ? 'api/admin/v1/xiaoe-tech/app/create-token' : 'api/admin/v1/xiaoe-tech/app/create-key'
      this.$http.get(url).then((res) => {
        this.model[type] = res.data.message
      })
    },
    onSave() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          api[this.model.id ? 'appUpdate' : 'appAdd'](this.model).then(() => {
            this.$message.success('保存成功')
            this.onClose(true)
          })
        }
      })
    },
    onClose(flag = false) {
      this.clearForm('model')
      this.$emit('close', flag)
    }
  }
}
</script>

<style></style>
