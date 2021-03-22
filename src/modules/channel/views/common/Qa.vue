<template>
  <el-form label-position="top">
    <el-form-item label="标题">
      <el-input v-model="model.title" style="width: 650px;"></el-input>
    </el-form-item>
    <el-form-item label="内容">
      <Editor v-model="model.content"></Editor>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="margin-top: 15px;" @click="distributerMaterialQaUpdate">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'QA',
  data() {
    return {
      title: '常见问题',
      type: 'QAData',
      model: {
        title: '',
        content: ''
      }
    }
  },
  created() {
    this.distributerMaterialQaGet()
  },
  methods: {
    // QA
    distributerMaterialQaGet() {
      this.$http.distributerMaterialQaGet().then((res) => {
        this.model = Object.assign(this.model, res.data.data)
      })
    },
    distributerMaterialQaUpdate() {
      this.$http.distributerMaterialQaUpdate(this.model).then(() => {
        this.$message.success('保存成功')
      })
    }
  }
}
</script>
