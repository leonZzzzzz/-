<template>
  <el-form label-position="top" style="width:background: #fff;padding: 15px 0 15px 30px;margin: 0 auto;width: 850px;">
    <el-form-item label="关于我们">
      <Editor v-model="model.content"></Editor>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="updateAbout()">保存</el-button>
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
    this.$http.getAbout().then((res) => {
      this.model = res.data.data
    })
  },
  methods: {
    updateAbout() {
      this.$http.updateAbout(this.model).then(() => {
        this.$message.success('更新成功')
      })
    }
  }
}
</script>

<style></style>
