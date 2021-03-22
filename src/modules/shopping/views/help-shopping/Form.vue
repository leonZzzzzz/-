<template>
  <QcNavigationPage content="助力信息" style="width:950px;margin:0 auto;">
    <el-form :model="model" ref="model" label-position="right" label-width="100px">
      <QcTitle title="基础信息">
        <el-form-item label="商品" prop="productId" :rules="[{ required: true, message: '请填写该字段' }]">
          <div>{{ prodcut.name }}</div>
          <el-button type="primary" size="small" @click="dialogVisible = true">关联产品</el-button>
          <ProductWrap :visible="dialogVisible" @onSelect="getProductRow" @onClose="onClose"></ProductWrap>
        </el-form-item>
        <el-form-item label="商品名称" prop="title" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input class="form-item__input" v-model="model.title"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" prop="startTime_endTime" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-date-picker
            v-model="model.startTime_endTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="成团人数" prop="quantity" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input-number class="form-item__input" :min="1" v-model="model.quantity"></el-input-number>
        </el-form-item>
        <el-form-item label="助力有效期" prop="duration" :rules="[{ required: true, message: '请填写该字段' }]">
          <QcDayPicker class="form-item__input" v-model="model.duration"></QcDayPicker>
        </el-form-item>
        <el-form-item label="助力价格">
          <div class="qty-form-wrap" style="background:#f5f7fa">
            <div class="qty-form-item label">规格</div>
            <div class="qty-form-item value">
              <el-input placeholder="助力价" v-model="price">
                <el-button slot="append" type="primary" icon="el-icon-check" @click="onSyncPrice('price')"></el-button>
              </el-input>
            </div>
            <div class="qty-form-item value">
              <el-input placeholder="库存" v-model="qty">
                <el-button slot="append" type="primary" icon="el-icon-check" @click="onSyncPrice('qty')"></el-button>
              </el-input>
            </div>
          </div>
          <div class="qty-form-wrap" v-for="(item, index) in model.items" :key="index">
            <div class="qty-form-item label" v-html="item.specs"></div>
            <el-form-item
              class="qty-form-item value"
              :prop="`items.${index}.price`"
              :rules="[{ required: true, message: '请填写该字段' }]"
            >
              <el-input placeholder="团员价格" v-model="item.price"></el-input>
            </el-form-item>
            <el-form-item
              class="qty-form-item value"
              :prop="`items.${index}.price`"
              :rules="[{ required: true, message: '请填写该字段' }]"
            >
              <el-input placeholder="库存" v-model="item.qty"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
      </QcTitle>
      <QcTitle title="限购设置">
        <el-form-item label="是否限购">
          <el-switch v-model="model.isLimited"></el-switch>
        </el-form-item>
        <el-form-item label="每人限购" v-if="model.isLimited">
          <el-input-number class="form-item__input" :min="1" v-model="model.limitQuantity"></el-input-number>
        </el-form-item>
        <el-form-item label="是否上架">
          <el-switch v-model="model.isSell"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit()">保存</el-button>
        </el-form-item>
      </QcTitle>
    </el-form>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      prodcut: {},
      qty: '',
      price: '',
      model: {
        isSell: true,
        title: '',
        productId: '',
        quantity: '',
        isLimited: false,
        isLeaderDiscount: true,
        limitQuantity: 1,
        duration: [],
        items: [],
        startTime_endTime: ''
      }
    }
  },
  created() {
    this.$route.query.id && this.getHelpShopping()
  },
  methods: {
    getProduct(id) {
      this.$http.getProduct({ id }).then((res) => {
        res.data.data.productItems.map((item) => {
          item.specs = ''
          for (let keys in item) {
            if (/^spec\d+Name$/g.test(keys)) {
              item.specs += item[keys] + ':'
            }
            if (/^spec\d+Value$/g.test(keys)) {
              item.specs += item[keys] + ';<br/>'
            }
          }
          item.productPrice = item.price
          item.price = ''
          item.orderQuantity = 0
          item.productItemId = item.id
          return item
        })
        this.model.items = res.data.data.productItems
      })
    },
    getProductRow(row) {
      this.dialogVisible = false
      this.model.productId = row.id
      this.model.title = row.name
      this.prodcut = row
      this.getProduct(row.id)
    },
    getHelpShopping() {
      this.$http.getHelpShopping({ id: this.$route.query.id }).then((res) => {
        this.model = res.data.data
        this.model.items.map((item) => {
          item.price /= 100
          return item
        })
        this.model.duration = this.model.duration.split('-')
        this.$set(this.model, 'startTime_endTime', [this.model.startTime, this.model.endTime])
      })
    },
    addHelpShopping(model) {
      this.$http.addHelpShopping(model).then(() => {
        this.$message.success('保存成功，2秒后将进行跳转')
        setTimeout(() => {
          this.$router.back()
        }, 2000)
      })
    },
    updateHelpShopping(model) {
      this.$http.updateHelpShopping(model).then(() => {
        this.$message.success('保存成功，2秒后将进行跳转')
        setTimeout(() => {
          this.$router.back()
        }, 2000)
      })
    },
    onClose() {
      this.dialogVisible = false
    },
    onSyncPrice(type) {
      this.model.items.forEach((item, index) => {
        this.$set(this.model.items[index], type, this[type])
      })
    },
    onSubmit() {
      this.$refs.model.validate((value) => {
        if (value) {
          let model = JSON.parse(JSON.stringify(this.model))
          model.items.map((item) => {
            item.price *= 100
            return item
          })
          model.startTime = model.startTime_endTime[0]
          model.endTime = model.startTime_endTime[1]
          model.duration = model.duration.join('-')
          delete model.startTime_endTime
          this.model.id ? this.updateHelpShopping(model) : this.addHelpShopping(model)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item__input {
  width: 400px;
}
.qty-form-wrap {
  padding: 10px;
  width: 700px;
  .qty-form-item {
    &.label {
      width: 100px;
      text-align: center;
      line-height: 16px;
      vertical-align: middle;
    }
    &.value {
      width: 160px;
    }
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
