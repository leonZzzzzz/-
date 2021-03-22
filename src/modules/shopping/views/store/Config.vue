<template>
  <el-form
    label-position="left"
    label-width="120px"
    style="width:300px"
  >
    <el-form-item :label="model.name">
      <el-input
        v-model="model.value"
        style="width:140px"
      ></el-input>&nbsp;元
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="updateConfigItem()"
      >保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { PRICE } from '../../../../utils/regex'
export default {
  data() {
    return {
      model: {}
    }
  },
  created() {
    this.listBaseConfigByParentId()
  },
  methods: {
    listBaseConfigByParentId() {
      this.$http.get('api/admin/v1/config/PLATFORM_SERVICE_FEE_ANNUAL_FEE').then(res => {
        this.model = res.data.data
        this.model.value /= 100
      })
    },
    updateConfigItem() {
      const model = JSON.parse(JSON.stringify(this.model))
      if (PRICE.test(model.value)) {
        model.value = parseFloat(model.value) * 100
        this.$http.updateConfigItem(model).then(res => {
          this.$message.success('保存成功')
        })
      } else {
        this.$message.error('金额格式不正确')
      }
    }
  }
}
</script>

<style></style>
