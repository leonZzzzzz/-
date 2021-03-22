<template>
  <el-dialog
    title="反馈"
    :visible="visible"
    width="600px"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
  >
    <el-form ref="feedbackModel" :model="feedbackModel" label-width="80px" label-position="left">
      <el-form-item label="反馈原因" prop="feedbackInfo" :rules="[{ message: '请填写反馈原因', required: true }]">
        <el-input
          type="textarea"
          v-model="feedbackModel.feedbackInfo"
          :rows="6"
          maxlength="200"
          show-word-limit
          resize="none"
        ></el-input>
      </el-form-item>
      <el-form-item label="反馈素材" prop="feedbackStuff" :rules="[{ message: '请上传反馈素材', required: true }]">
        <el-image
          fit="cover"
          style="width: 60px;height:60px;margin-right:10px;"
          v-for="item in feedbackModel.feedbackStuff"
          :key="item"
          :src="`${baseUrl}/api/admin/v1/WechatMiniProgramThirdParty/getMedia?mediaId=${item}`"
        ></el-image>
        <el-upload
          v-if="feedbackModel.feedbackStuff.length < 5"
          :action="`${baseUrl}/api/admin/v1/WechatMiniProgramThirdParty/uploadMedia`"
          :show-file-list="false"
          :on-success="feedbackUpload"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          只能上传jpg/png文件，且不超过1MB
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="feedbackCodeClose()">关闭</el-button>
      <el-button @click="feedbackCode()" type="primary" :loading="loading">反馈</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      feedbackModel: {
        feedbackInfo: '',
        feedbackStuff: []
      }
    }
  },
  methods: {
    feedbackUpload(res) {
      if (res.code === 20000) {
        this.feedbackModel.feedbackStuff.push(res.message)
      }
    },
    feedbackCode() {
      this.$refs.feedbackModel.validate((flag) => {
        if (flag) {
          this.loading = true
          let model = JSON.parse(JSON.stringify(this.feedbackModel))
          model.feedbackStuff = model.feedbackStuff.join('|')
          this.$http
            .submitAudit(model)
            .then(() => {
              this.feedbackCodeClose(true)
              this.$message.success('反馈成功，请等待微信审核...')
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    feedbackCodeClose(flag = false) {
      this.clearForm('feedbackModel')
      this.$emit('close', flag)
    }
  }
}
</script>
