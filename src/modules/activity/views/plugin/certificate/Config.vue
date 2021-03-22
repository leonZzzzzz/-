<template>
  <div class="certificate-config">
    <el-form label-position="right" label-width="140px">
      <el-form-item label="证书首页背景图">
        <ImageUpload
          imageType="certificate"
          :isCrop="false"
          :image-url="model.homeUrl"
          :cropw="250"
          :croph="378"
          :enlarge="5"
          :on-success="(e) => (model.homeUrl = e)"
        ></ImageUpload>
      </el-form-item>
      <el-form-item label="列表页封面图">
        <ImageUpload
          imageType="certificate"
          :image-url="model.listUrl"
          :cropw="250"
          :croph="100"
          :enlarge="5"
          :on-success="(e) => (model.listUrl = e)"
        ></ImageUpload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="certificateCofnigInsert">保&nbsp;存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {
        listUrl: '',
        homeUrl: ''
      },
      cropperOption: {
        autoCropWidth: 375,
        autoCropHeight: 567,
        autoCrop: true,
        fixedBox: true,
        canMoveBox: false
      }
    }
  },
  created() {
    this.certificateCofnigGet()
  },
  methods: {
    certificateCofnigGet() {
      this.$http.certificateCofnigGet().then((res) => {
        this.model = res.data.data.list[0] || { listUrl: '', homeUrl: '' }
      })
    },
    certificateCofnigInsert() {
      this.$http.certificateCofnigInsert(this.model).then((res) => {
        this.$message.success('保存成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.certificate-config {
  padding-top: 50px;
}
</style>
