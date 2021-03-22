<template>
  <QcNavigationPage
    content="店铺信息"
    style="width:900px;margin:0 auto;"
  >
    <el-form
      :model="model"
      ref="model"
      label-width="120px"
      label-position="right"
    >
      <el-form-item
        label="商户名称"
        prop="name"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item
        label="行业"
        prop="industry"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input v-model="model.industry"></el-input>
      </el-form-item>
      <el-form-item
        label="城市"
        prop="city"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input v-model="model.city"></el-input>
      </el-form-item>
      <el-form-item
        label="地址"
        prop="address"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input v-model="model.address"></el-input>
      </el-form-item>
      <el-form-item
        label="负责人"
        prop="personInCharge"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input v-model="model.personInCharge"></el-input>
      </el-form-item>
      <el-form-item
        label="负责人手机号码"
        prop="mobile"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input v-model="model.mobile"></el-input>
      </el-form-item>
      <el-form-item
        label="客服电话"
        prop="customerServiceNumbers"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input v-model="model.customerServiceNumbers"></el-input>
      </el-form-item>
      <el-form-item
        label="店铺说明"
        prop="info"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input v-model="model.info"></el-input>
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-select v-model="model.status">
          <el-option
            label="新建"
            :value="0"
          ></el-option>
          <el-option
            label="开业"
            :value="1"
          ></el-option>
          <el-option
            label="歇业"
            :value="2"
          ></el-option>
          <el-option
            label="结业"
            :value="3"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否使用平台的商品" prop="isPlatformProduct">
            <el-switch
              v-model="model.isPlatformProduct"
              active-text="使用平台的商品"
              active-color="#409EFF"
            ></el-switch>
      </el-form-item>-->
      <el-form-item
        label="商标"
        prop="logoIconUrl"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <ImageUpload
          :image-url="model.logoIconUrl"
          :on-success="(e) => (model.logoIconUrl = e)"
        ></ImageUpload>
      </el-form-item>
      <el-form-item
        label="店铺大图"
        prop="facadeUrl"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <ImageUpload
          :image-url="model.facadeUrl"
          :on-success="(e) => (model.facadeUrl = e)"
        ></ImageUpload>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="onSubmit"
          type="primary"
        >保存</el-button>
      </el-form-item>
    </el-form>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      model: {
        name: '',
        logoIconUrl: '',
        facadeUrl: '',
        type: 0,
        industry: '',
        city: '',
        address: '',
        personInCharge: '',
        mobile: '',
        customerServiceNumbers: '',
        info: '',
        status: 0,
        auditStatus: '',
        isPlatformProduct: false
      }
    }
  },
  created() {
    this.$route.query.id && this.getStore()
  },
  methods: {
    getStore() {
      this.$http.getStore({ id: this.$route.query.id }).then(res => {
        this.model = res.data.data
      })
    },
    addStore(model) {
      this.$http.addStore(model).then(() => {
        this.$message.success('保存成功')
      })
    },
    updateStore(model) {
      this.$http.updateStore(model).then(() => {
        this.$message.success('保存成功')
      })
    },
    onSubmit() {
      this.$refs.model.validate(value => {
        if (value) {
          this.model.id ? this.updateStore(this.model) : this.addStore(this.model)
        }
      })
    }
  }
}
</script>
