<template>
  <QcNavigationPage content="套餐定价">
    <el-form ref="model" :model="model" label-width="100px" label-position="left" hide-required-asterisk>
      <el-form-item label="类型">
        <el-radio-group v-model="model.type">
          <el-radio :label="1">标准</el-radio>
          <el-radio :label="2">插件</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图标">
        <ImageUpload :imageUrl="model.iconUrl" :on-success="(e) => (model.iconUrl = e)"></ImageUpload>
      </el-form-item>
      <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-input v-model="model.name" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="所属应用" prop="categoryId" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-select v-model="model.categoryId" style="width:400px">
          <el-option v-for="item in appCategoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="简介" prop="briefDescribe" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-input v-model="model.briefDescribe" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="describe" :rules="[{ required: true, message: '请填写该字段' }]">
        <editor v-model="model.describe"></editor>
      </el-form-item>
      <el-form-item label="售价">
        <div class="price-wrap price-wrap--header">
          <div class="price-wrap__item">价格</div>
          <div class="price-wrap__item">有效期</div>
        </div>
        <div class="price-wrap" v-for="(item, index) in model.pricingBagPriceList" :key="index">
          <el-form-item
            :prop="`pricingBagPriceList.${index}.price`"
            class="price-wrap__item"
            :rules="[
              { required: true, message: '请填写该字段' },
              { message: '金额格式不正确', pattern: regPrice }
            ]"
          >
            <el-input v-model="item.price">
              <template slot="prepend">￥</template>
            </el-input>
          </el-form-item>
          <el-form-item
            :prop="`pricingBagPriceList.${index}.months`"
            class="price-wrap__item"
            style="margin-left: 20px;"
            :rules="[
              { required: true, message: '请填写该字段' },
              { message: '请填写正整数', pattern: /^\d+$/ }
            ]"
          >
            <el-input v-model="item.months">
              <template slot="append">个月</template>
            </el-input>
          </el-form-item>
          <div class="price-wrap__item price-wrap__item--absolute" style="margin-left: 20px;">
            <i class="price-wrap__item-icon el-icon-circle-plus-outline" @click="addPriceItem"></i>
            <i
              class="price-wrap__item-icon el-icon-remove-outline"
              v-if="model.pricingBagPriceList.length != 1"
              @click="removePriceItem(index)"
            ></i>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="关联功能点" prop="pricingElementList" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-tag
          style="margin-right: 10px;"
          closable
          @close="removeElement(index)"
          v-for="(item, index) in model.pricingElementList"
          :key="item.id"
          >{{ item.name }}</el-tag
        >
        <el-button icon="el-icon-plus" size="mini" @click="pricingElementVisible = true" circle></el-button>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="model.status" :active-value="1" :inactive-value="-1"></el-switch>（是否公开）
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit()" type="primary">保存</el-button>
      </el-form-item>
    </el-form>
    <PricingElementDialog :visible="pricingElementVisible" @get-list="addElement"></PricingElementDialog>
  </QcNavigationPage>
</template>

<script>
import PricingElementDialog from './PricingElementDialog'
import { PRICE } from '@/utils/regex'
export default {
  components: {
    PricingElementDialog
  },
  data() {
    return {
      regPrice: PRICE,
      pricingElementVisible: false,
      model: {
        type: 1,
        price: 0,
        iconUrl: '',
        name: '',
        categoryId: '',
        describe: '',
        briefDescribe: '',
        pricingElementList: [],
        pricingBagPriceList: [{ price: '', months: '' }],
        status: 1
      },
      appCategoryList: []
    }
  },
  created() {
    this.listAppCategory()
    if (this.$route.query.id) {
      this.getAppPricingBag(this.$route.query.id)
    }
  },
  methods: {
    listAppCategory() {
      this.$http.listAppCategory().then((res) => {
        this.appCategoryList = res.data.data
      })
    },
    addPriceItem() {
      this.model.pricingBagPriceList.push({ price: '', months: '' })
    },
    removePriceItem(index) {
      this.model.pricingBagPriceList.splice(index, 1)
    },
    addElement(row) {
      row.forEach((item) => {
        if (JSON.stringify(this.model.pricingElementList).indexOf(item.id) == -1) {
          this.model.pricingElementList.push(item)
        }
      })
      this.pricingElementVisible = false
    },
    removeElement(index) {
      this.model.pricingElementList.splice(index, 1)
    },
    getAppPricingBag(id) {
      this.$http.getAppPricingBag({ id }).then((res) => {
        this.model = res.data.data
        this.model.pricingBagPriceList.map((item) => {
          item.price /= 100
        })
      })
    },
    addAppPricingBag(model) {
      this.$http.addAppPricingBag(model).then(() => {
        this.$message.success('保存成功')
      })
    },
    updateAppPricingBag(model) {
      this.$http.updateAppPricingBag(model).then(() => {
        this.$message.success('修改成功')
      })
    },
    onSubmit() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          let model = JSON.parse(JSON.stringify(this.model))
          model.pricingBagPriceList.map((item) => {
            item.price *= 100
          })
          model.id ? this.updateAppPricingBag(model) : this.addAppPricingBag(model)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.price-wrap {
  width: 440px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
  &--header {
    background: #eee;
    text-align: center;
  }
  &__item {
    width: 250px;
    &--absolute {
      line-height: 10px;
      width: 90px;
      right: -100px;
      position: absolute;
    }
    &-icon {
      font-size: 24px;
      margin-right: 10px;
      display: inline-block;
      color: #9093b1;
    }
  }
}
</style>
