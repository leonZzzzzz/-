<template>
  <el-dialog
    title="预览小程序"
    :visible="visible"
    :before-close="onClose"
    width="450px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
  >
    <div style="text-align: center;width: 250px;margin: 0 auto 20px;">
      <p style="padding: 20px 0;">体验版二维码，可扫码或下载进行预览</p>
      <img v-if="visible" :src="qrcodeImage" style="display: block;width: 150px;height:150px;margin: 0 auto;" />
      <el-button @click="onDownLoad(qrcodeImage)" style="margin-top: 10px;" type="text" size="mini"
        >下载二维码</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      value: ''
    },
    type: String
  },
  computed: {
    qrcodeImage() {
      let url = this.baseUrl + '/api/admin/v1/WechatMiniProgramThirdParty/getQRCode?'
      let parmes = `path=${this.path || ''}&${this.type ? 'purpose=' + this.type : ''}`
      return url + parmes
    }
  },
  methods: {
    onDownLoad(url) {
      window.open(url)
    },
    onClose() {
      this.$emit('close')
    }
  }
}
</script>
