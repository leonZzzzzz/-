<template>
  <QcNavigationPage content="支付协议" full>
    <el-form label-position="left" label-width="80px">
      <el-form-item label="标题">
        <el-input placeholder="请输入内容" v-model="model.title">
          <el-select v-model="model.code" slot="prepend" placeholder="请选择">
            <el-option v-for="(code, index) in codes" :key="index" :label="code.name" :value="code.value"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="内容">
        <Editor v-model="model.content"></Editor>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </div>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      model: {},
      codes: []
    }
  },
  created() {
    this.getAgreementCodes()
    this.$route.query.id && this.getAgreement(this.$route.query.id)
  },
  methods: {
    getAgreement(id) {
      this.$http.getAgreement({ id }).then((res) => {
        this.model = res.data.data
      })
    },
    getAgreementCodes() {
      this.$http.getAgreementCodes().then((res) => {
        this.codes = res.data.data.list
      })
    },
    addAgreement() {
      this.$http.addAgreement().then(() => {
        this.$router.back()
      })
    },
    updateAgreement() {
      this.$http.updateAgreement().then(() => {
        this.$router.back()
      })
    },
    onSubmit() {
      this.model.id ? this.saveModel('updateAgreement') : this.saveModel('addAgreement')
    },
    saveModel(type) {
      this.$http[type](this.model)
      this.$message.success(type === 'updateAgreement' ? '修改成功' : '添加成功')
      this.$router.back()
    }
  }
}
</script>

<style></style>
