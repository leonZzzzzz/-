<template>
  <div style="width: 830px;padding: 20px;background: #fff;margin: 0 auto;">
    <el-form label-position="left">
      <el-form-item label-width="80px" label="客服热线">
        <el-input v-model="model.phone"></el-input>
      </el-form-item>
      <el-form-item label-width="80px" label="内容">
        <Editor v-model="model.content"></Editor>
      </el-form-item>
      <el-form-item label-width="80px">
        <el-button type="primary" @click="updateQcAbout()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {}
    }
  },
  created() {
    this.getQcAbout()
  },
  methods: {
    updateQcAbout() {
      this.$http.updateQcAbout(this.model).then(() => {
        this.$message.success('修改成功')
      })
    },
    getQcAbout() {
      this.$http.getQcAbout().then((res) => {
        this.model = res.data.data
      })
    }
  }
}
</script>
