<template>
  <QcNavigationPage>
    <div style="width: 400px;margin: 20px auto;">
      <el-form label-position="top" label-width="50" style="width: 100%;">
        <el-form-item label="客服名称" label-width="50" :rules="[{ required: true, message: '该项为必填项' }]">
          <el-input placeholder="请输入客服名称" v-model="qwKefuConfig.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="客服ID" label-width="50" :rules="[{ required: true, message: '该项为必填项' }]">
          <el-input placeholder="请输入客服ID" v-model="qwKefuConfig.configId" clearable></el-input>
        </el-form-item>
        <el-form-item label-width="50">
          <el-button style="" type="primary" :loading="qwKefuConfig.loading" @click="updateQwKefuConfig()"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
      <p class="tips">
        1）配置前需确认小程序已添加【企业客户服务】插件；<br />
        2）配置后，将可在小程序-商品详情、订单详情中显示客服按钮；<br />
        3）客服ID：在企业微信管理后台-客户联系-加客户-联系我中，新建联系方式，并复制配置ID；
      </p>
    </div>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      qwKefuConfig: {
        name: '',
        configId: '',
        loading: true
      }
    }
  },
  created() {
    this.getQwKefu()
  },
  methods: {
    // 企维客服
    async getQwKefu() {
      try {
        let { data } = await this.$http.getStoreCustomerServer()
        this.qwKefuConfig.loading = false
        if (!data.data) return
        this.qwKefuConfig = Object.assign(this.qwKefuConfig, {
          loading: false,
          id: data.data.id,
          name: data.data.name,
          configId: data.data.configId
        })
      } catch (error) {
        this.qwKefuConfig.loading = false
      }
    },
    async updateQwKefuConfig() {
      if (!this.qwKefuConfig.configId) return this.$message.warning('请输入客服ID')
      if (this.qwKefuConfig.id) await this.$http.updateStoreCustomerServer(this.qwKefuConfig)
      else await this.$http.addStoreCustomerServer(this.qwKefuConfig)
      this.$message.success('保存成功')
      this.getQwKefu()
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  color: #888;
  font-size: 13px;
  line-height: 1.6;
  padding: 10px 0;
}
</style>
