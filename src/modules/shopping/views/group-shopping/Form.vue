<template>
  <QcNavigationPage content="拼团信息" style="width:950px;margin:0 auto;">
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
        <el-form-item label="组团有效期" prop="duration" :rules="[{ required: true, message: '请填写该字段' }]">
          <QcDayPicker class="form-item__input" v-model="model.duration"></QcDayPicker>
        </el-form-item>
        <el-form-item label="拼团价格">
          <el-checkbox v-model="model.isOrganizerDiscount">团长可以享受优惠价</el-checkbox>
          <div class="qty-form-wrap" style="background:#f5f7fa">
            <div class="qty-form-item label">规格</div>
            <!-- <div class="qty-form-item value">
              <el-input placeholder="会员团长价">
                <el-button
                  slot="append"
                  type="primary"
                  icon="el-icon-check"
                  @click="onSyncPrice(item, i)"
                ></el-button>
              </el-input>
            </div>
            <div class="qty-form-item value">
              <el-input placeholder="会员参团价">
                <el-button
                  slot="append"
                  type="primary"
                  icon="el-icon-check"
                  @click="onSyncPrice(item, i)"
                ></el-button>
              </el-input>
            </div>-->
            <div class="qty-form-item value">
              <el-input placeholder="团长价" v-model="organizerPrice">
                <el-button
                  slot="append"
                  type="primary"
                  icon="el-icon-check"
                  @click="onSyncPrice('organizerPrice')"
                ></el-button>
              </el-input>
            </div>
            <div class="qty-form-item value">
              <el-input placeholder="参团价" v-model="price">
                <el-button slot="append" type="primary" icon="el-icon-check" @click="onSyncPrice('price')"></el-button>
              </el-input>
            </div>
            <div class="qty-form-item label">原价</div>
            <div class="qty-form-item label">销售价</div>
            <!-- <div class="qty-form-item label">会员价</div> -->
          </div>
          <div class="qty-form-wrap" v-for="(item, index) in model.items" :key="index">
            <div class="qty-form-item label" v-html="item.specs"></div>
            <!-- <el-form-item class="qty-form-item value" :prop="`items.${index}.organizerPrice`">
              <el-input placeholder="会员团长价" v-model="item.vipLeaderPrice"></el-input>
            </el-form-item>
            <el-form-item class="qty-form-item value" :prop="`items.${index}.price`">
              <el-input placeholder="会员参团价" v-model="item.vipPrice"></el-input>
            </el-form-item>-->
            <el-form-item
              class="qty-form-item value"
              :prop="`items.${index}.organizerPrice`"
              :rules="[{ required: true, message: '请填写该字段' }]"
            >
              <el-input placeholder="团长价" v-model="item.organizerPrice"></el-input>
            </el-form-item>
            <el-form-item
              class="qty-form-item value"
              :prop="`items.${index}.price`"
              :rules="[{ required: true, message: '请填写该字段' }]"
            >
              <el-input placeholder="参团价" v-model="item.price"></el-input>
            </el-form-item>
            <div class="qty-form-item label">{{ item.productOrigPrice / 100 }}</div>
            <div class="qty-form-item label">{{ item.productPrice / 100 }}</div>
            <!-- <div class="qty-form-item label">会员价</div> -->
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
      organizerPrice: '',
      price: '',
      model: {
        isSell: true,
        title: '',
        productId: '',
        quantity: '',
        isLimited: false,
        isOrganizerDiscount: true,
        limitQuantity: 1,
        duration: [],
        items: [],
        startTime_endTime: ''
      }
    }
  },
  created() {
    this.$route.query.id && this.getGroupShopping()
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
          item.productId = id
          item.productItemId = item.id
          item.productPrice = item.price
          item.productOrigPrice = item.origPrice
          item.productVipPrice = item.vipPrice
          item.id = ''
          item.groupShoppingId = null
          item.organizerPrice = null
          item.price = null
          item.vipOranizerPrice = null
          item.vipPrice = null
          item.orderQuantity = 0
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
    // TODO: 拼团详情：缺少 成团人数 团长享受优惠价
    getGroupShopping() {
      this.$http.getGroupShopping({ id: this.$route.query.id }).then((res) => {
        this.model = res.data.data
        this.model.items.map((item) => {
          item.price /= 100
          item.organizerPrice /= 100
          return item
        })
        this.model.duration = this.model.duration.split('-')
        this.$set(this.model, 'startTime_endTime', [this.model.startTime, this.model.endTime])
      })
    },
    addGroupShopping(model) {
      this.$http.addGroupShopping(model).then(() => {
        this.$message.success('保存成功，2秒后将进行跳转')
        setTimeout(() => {
          this.$router.back()
        }, 2000)
      })
    },
    updateGroupShopping(model) {
      this.$http.updateGroupShopping(model).then(() => {
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
            item.price = item.price * 100
            item.organizerPrice *= 100
            return item
          })
          model.startTime = model.startTime_endTime[0]
          model.endTime = model.startTime_endTime[1]
          model.duration = model.duration.join('-')
          delete model.startTime_endTime
          this.model.id ? this.updateGroupShopping(model) : this.addGroupShopping(model)
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
