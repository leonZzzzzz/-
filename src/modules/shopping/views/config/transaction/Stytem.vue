<template>
  <el-form label-position="right" label-width="320px" style="margin:40px 100px">
    <el-form-item :label="storeJoinConfig.name" :rules="[{ required: true, message: '该项为必填项' }]">
      <el-switch
        v-model="storeJoinConfig.value"
        class="switch"
        active-color="#13ce66"
        inactive-color="#eee"
        active-value="1"
        inactive-value="0"
      >
      </el-switch>
      <el-button
        style="margin-left:10px"
        type="text"
        :loading="storeJoinConfig.loading"
        @click="updateStoreJoinConfig()"
        >保存</el-button
      >
      <el-popover
        width="400"
        style="color:red!important"
        placement="top-start"
        trigger="hover"
        content="开启后店铺小程序登录页面会显示 '店铺入驻' 按钮"
      >
        <i class="el-icon-question popover-icon" slot="reference"></i>
      </el-popover>
    </el-form-item>
    <!-- 是否:显示授权店铺小程序按钮 -->
    <el-form-item :label="authMultiStoreConfig.name" :rules="[{ required: true, message: '该项为必填项' }]">
      <el-switch
        v-model="authMultiStoreConfig.value"
        class="switch"
        active-color="#13ce66"
        inactive-color="#eee"
        active-value="1"
        inactive-value="0"
      >
      </el-switch>
      <el-button
        style="margin-left:10px"
        type="text"
        :loading="authMultiStoreConfig.loading"
        @click="updateAuthMultiStoreConfig()"
        >保存</el-button
      >
      <el-popover
        width="400"
        style="color:red!important"
        placement="top-start"
        trigger="hover"
        content="多店铺账号请开启，开启后PC端会显示:授权店铺小程序按钮，店铺小程序飞轮魔盒"
      >
        <i class="el-icon-question popover-icon" slot="reference"></i>
      </el-popover>
    </el-form-item>
    <!-- 是否显示店铺信息 -->
    <el-form-item :label="mallTypeConfig.name" :rules="[{ required: true, message: '该项为必填项' }]">
      <el-switch
        v-model="mallTypeConfig.value"
        class="switch"
        active-color="#13ce66"
        inactive-color="#eee"
        active-value="1"
        inactive-value="0"
      >
      </el-switch>
      <el-button style="margin-left:10px" type="text" :loading="mallTypeConfig.loading" @click="updateMallTypeConfig()"
        >保存</el-button
      >
      <el-popover
        width="400"
        style="color:red!important"
        placement="top-start"
        trigger="hover"
        content="多店铺账号请开启，开启后小程序端购物车，订单列表、详情等页面，会显示店铺信息"
      >
        <i class="el-icon-question popover-icon" slot="reference"></i>
      </el-popover>
    </el-form-item>
    <!-- 多商家商城： 是否允许店铺自行设置商品等级 -->
    <el-form-item :label="productLevalConfig.name" :rules="[{ required: true, message: '该项为必填项' }]">
      <el-switch
        v-model="productLevalConfig.value"
        class="switch"
        active-color="#13ce66"
        inactive-color="#eee"
        active-value="1"
        inactive-value="0"
      >
      </el-switch>
      <el-button
        style="margin-left:10px"
        type="text"
        :loading="productLevalConfig.loading"
        @click="updateProductLevalConfig()"
        >保存</el-button
      >
      <el-popover
        width="400"
        style="color:red!important"
        placement="top-start"
        trigger="hover"
        content="多商家商城：是否允许店铺自行设置商品等级；<Br\>关闭后只有【平台】账号可设置，而【店铺】账号不能设置；"
      >
        <i class="el-icon-question popover-icon" slot="reference"></i>
      </el-popover>
    </el-form-item>
    <!-- 是否显示VIP价格 -->
    <el-form-item :label="productVipPriceConfig.name" :rules="[{ required: true, message: '该项为必填项' }]">
      <el-switch
        v-model="productVipPriceConfig.value"
        class="switch"
        active-color="#13ce66"
        inactive-color="#eee"
        active-value="1"
        inactive-value="0"
      >
      </el-switch>
      <el-button
        style="margin-left:10px"
        type="text"
        :loading="productVipPriceConfig.loading"
        @click="updateProductVipPriceConfig()"
        >保存</el-button
      >
      <el-popover
        width="400"
        style="color:red!important"
        placement="top-start"
        trigger="hover"
        content="开启后商品详情将显示VIP价格，会员下单时自动使用VIP价格"
      >
        <i class="el-icon-question popover-icon" slot="reference"></i>
      </el-popover>
    </el-form-item>
    <!-- VIP价格显示名称 -->
    <el-form-item :label="productVipNameConfig.name" :rules="[{ required: true, message: '该项为必填项' }]">
      <el-input
        placeholder="请输入名称"
        v-model="productVipNameConfig.value"
        maxlength="3"
        show-word-limit
        clearable
        style="width: 120px;padding-left: 20px;"
      ></el-input>
      <el-button
        style="margin-left:10px"
        type="text"
        :loading="productVipNameConfig.loading"
        @click="updateProductVipNameConfig()"
        >保存</el-button
      >
      <el-popover
        width="400"
        style="color:red!important"
        placement="top-start"
        trigger="hover"
        content="例如输入‘会员价’ 页面将显示 ‘会员价￥99.00’"
      >
        <i class="el-icon-question popover-icon" slot="reference"></i>
      </el-popover>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      storeJoinConfig: {
        name: '是否开启店铺入驻',
        value: '0',
        loading: true
      },
      mallTypeConfig: {
        name: '是否开启多商家',
        value: '0',
        loading: true
      },
      authMultiStoreConfig: {
        name: '是否显示授权多商家',
        value: '0',
        loading: true
      },
      // 默认允许，接口配置可能需要后端手动初始化，
      // 所以在判断时只有value === 0时才是关闭，如果配置不存在或者value不存在就当它是开启的，
      productLevalConfig: {
        name: '是否允许店铺自行设置商品等级',
        value: '1', // 0是关，1是开
        loading: true
        // is_show_product_level
      },
      productVipPriceConfig: {
        name: '是否开启商品VIP价格',
        value: '0',
        loading: true
      },
      productVipNameConfig: {
        name: '商品VIP价格显示的名称',
        value: '',
        loading: true
      }
    }
  },
  created() {
    this.getConfigItem('STORE_REGISTRATED')
    this.getConfigItem('AUTHORIZED_MULTI_STORE')
    this.getConfigItem('MULTI_STORE')
    this.getConfigItem('is_show_product_level')
    this.getConfigItem('is_open_product_vip_price')
    this.getConfigItem('product_vip_name')
  },
  methods: {
    getConfigItem(key) {
      this.$http.getConfigByKey(key).then((res) => {
        switch (key) {
          case 'MULTI_STORE':
            this.mallTypeConfig = res.data.data || {}
            break
          case 'is_open_product_vip_price':
            this.productVipPriceConfig = res.data.data || {}
            break
          case 'product_vip_name':
            this.productVipNameConfig = res.data.data || {}
            break
          case 'AUTHORIZED_MULTI_STORE':
            this.authMultiStoreConfig = res.data.data || {}
            break
          case 'STORE_REGISTRATED':
            this.storeJoinConfig = res.data.data || {}
            break
          case 'is_show_product_level':
            this.productLevalConfig = res.data.data || {}
            break
        }
      })
    },
    updateStoreJoinConfig() {
      let model = JSON.parse(JSON.stringify(this.storeJoinConfig))
      this.$http.updateConfig(model).then(() => {
        this.$message.success('修改成功')
      })
    },
    async updateProductLevalConfig() {
      let model = JSON.parse(JSON.stringify(this.productLevalConfig))
      await this.$http.updateConfig(model)
      this.$message.success('修改成功')
    },
    updateMallTypeConfig() {
      let model = JSON.parse(JSON.stringify(this.mallTypeConfig))
      this.$http.updateConfig(model).then(() => {
        this.$message.success('修改成功')
        this.$store.commit('setMallType', model.value)
      })
    },
    updateAuthMultiStoreConfig() {
      let model = JSON.parse(JSON.stringify(this.authMultiStoreConfig))
      this.$http.updateConfig(model).then(() => {
        this.$message.success('修改成功')
        this.$store.commit('showAuthStore', model.value)
      })
    },
    async updateProductVipPriceConfig() {
      let model = JSON.parse(JSON.stringify(this.productVipPriceConfig))
      await this.$http.updateConfig(model)
      this.$message.success('修改成功')
    },
    async updateProductVipNameConfig() {
      let model = JSON.parse(JSON.stringify(this.productVipNameConfig))
      await this.$http.updateConfig(model)
      this.$message.success('修改成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.popover-icon {
  color: #f7b393;
  font-size: 20px;
  padding: 10px 10px;
  cursor: pointer;
}
.switch {
  padding: 10px 10px;
  margin: 0 10px;
}
</style>
