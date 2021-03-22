<template>
  <el-form label-position="top" style="padding: 15px 0 15px 30px;margin: 0 auto;width: 850px;">
    <el-form-item>
      <Editor v-model="model.content"></Editor>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="updateAgreement()">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      model: {}
    }
  },
  created() {
    this.$http.getAgreementByTpey({ type: 'WITHDRAWAL_MEMBER_FAQ' }).then((res) => {
      this.model = res.data.data
    })
  },
  methods: {
    updateAgreement() {
      this.$http.updateAgreement(this.model).then(() => {
        this.$message.success('更新成功')
      })
    }
  }
}
</script>

<style></style>
