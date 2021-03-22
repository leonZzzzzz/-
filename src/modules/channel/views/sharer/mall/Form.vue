<template>
  <QcNavigationPage content="分销商品信息" style="width:950px;margin:0 auto;">
    <el-form :model="model" ref="model" label-position="right" label-width="100px">
      <QcTitle title="基础信息">
        <el-form-item label="商品" prop="productId" :rules="[{ required: true, message: '请填写该字段' }]">
          <div>{{ prodcut.name }}</div>
          <el-button type="primary" size="small" :disabled="model.id ? true : false" @click="dialogVisible = true"
            >关联产品</el-button
          >
          <ProductWrap :visible="dialogVisible" @onSelect="getProductRow" @onClose="onClose"></ProductWrap>
        </el-form-item>
        <el-form-item
          label="商品名称"
          prop="title"
          :rules="[
            { required: true, message: '商品名称不能为空' },
            { max: 60, message: '建议字数不超过60字' }
          ]"
        >
          <el-input class="form-item__input" v-model="model.title" :maxlength="60" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="推广佣金" prop="sharerCommission" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input class="form-item__input" v-model="model.sharerCommission"></el-input>
        </el-form-item>
        <el-form-item
          v-if="false"
          label="推广积分"
          prop="sharerPoint"
          :rules="[{ required: true, message: '请填写该字段' }]"
        >
          <el-input class="form-item__input" v-model="model.sharerPoint"></el-input>
        </el-form-item>
        <el-form-item
          v-if="false"
          label="销售佣金"
          prop="distributerCommission"
          :rules="[{ required: true, message: '请填写该字段' }]"
        >
          <el-input class="form-item__input" v-model="model.distributerCommission"></el-input>
        </el-form-item>
        <el-form-item
          v-if="false"
          label="销售积分"
          prop="distributerPoint"
          :rules="[{ required: true, message: '请填写该字段' }]"
        >
          <el-input class="form-item__input" v-model="model.distributerPoint"></el-input>
        </el-form-item>
        <el-form-item label="">
          <div class="qty-form-wrap" style="background:#f5f7fa">
            <div class="qty-form-item label">规格</div>
            <div class="qty-form-item value">
              <el-input placeholder="推广佣金" v-model="sharerCommission">
                <el-button
                  slot="append"
                  type="primary"
                  icon="el-icon-check"
                  @click="onSyncPrice('sharerCommission')"
                ></el-button>
              </el-input>
            </div>
            <div class="qty-form-item value" v-if="false">
              <el-input placeholder="推广积分" v-model="sharerPoint">
                <el-button
                  slot="append"
                  type="primary"
                  icon="el-icon-check"
                  @click="onSyncPrice('sharerPoint')"
                ></el-button>
              </el-input>
            </div>
            <div class="qty-form-item value" v-if="false">
              <el-input placeholder="销售佣金" v-model="distributerCommission">
                <el-button
                  slot="append"
                  type="primary"
                  icon="el-icon-check"
                  @click="onSyncPrice('distributerCommission')"
                ></el-button>
              </el-input>
            </div>
            <div class="qty-form-item value" v-if="false">
              <el-input placeholder="销售积分" v-model="distributerPoint">
                <el-button
                  slot="append"
                  type="primary"
                  icon="el-icon-check"
                  @click="onSyncPrice('distributerPoint')"
                ></el-button>
              </el-input>
            </div>
          </div>
          <div class="qty-form-wrap" v-for="(item, index) in model.items" :key="index">
            <div class="qty-form-item label" v-html="item.specs" :title="item.specs"></div>
            <el-form-item
              class="qty-form-item value"
              :prop="`items.${index}.sharerCommission`"
              :rules="[{ required: true, message: '请填写该字段' }]"
            >
              <el-input placeholder="推广佣金" v-model="item.sharerCommission"></el-input>
            </el-form-item>
            <el-form-item
              v-if="false"
              class="qty-form-item value"
              :prop="`items.${index}.sharerPoint`"
              :rules="[{ required: true, message: '请填写该字段' }]"
            >
              <el-input placeholder="推广积分" v-model="item.sharerPoint"></el-input>
            </el-form-item>
            <el-form-item
              v-if="false"
              class="qty-form-item value"
              :prop="`items.${index}.distributerCommission`"
              :rules="[{ required: true, message: '请填写该字段' }]"
            >
              <el-input placeholder="销售佣金" v-model="item.distributerCommission"></el-input>
            </el-form-item>
            <el-form-item
              v-if="false"
              class="qty-form-item value"
              :prop="`items.${index}.distributerPoint`"
              :rules="[{ required: true, message: '请填写该字段' }]"
            >
              <el-input placeholder="销售积分" v-model="item.distributerPoint"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saveBtnLoading" @click="onSubmit()">保存</el-button>
        </el-form-item>
      </QcTitle>
    </el-form>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false, // 弹窗
      saveBtnLoading: false, // 保存按钮loading
      prodcut: {}, // 商品详情
      sharerCommission: '',
      sharerPoint: 0,
      distributerCommission: 0,
      distributerPoint: 0,
      model: {
        title: '', // 商品标题
        productId: '', // 商品ID
        sharerCommission: '', // 推广佣金（单位分）
        sharerPoint: 0, // 推广积分
        distributerCommission: 0, // 销售佣金（单位分）
        distributerPoint: 0, // 销售积分（单位分）
        items: []
      }
    }
  },
  created() {
    this.$route.query.id && this.getSharerShopping()
  },
  methods: {
    // 查询商品详情（分销专用）
    getProduct(id) {
      // 这个接口是给分销用的，不管单规格还是多规格都会返回 productItems字段，这点和商品详情接口有点不一样，
      this.$http.getProductForDistribute({ id }).then((res) => {
        let productItems = res.data.data.productItems.map((item) => {
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

          item.sharerCommission = 0
          item.sharerPoint = 0
          item.distributerCommission = 0
          item.distributerPoint = 0
          return item
        })
        // this.$set(this.model, 'items', res.data.data.productItems)
        this.model.items = productItems
      })
    },
    // 选择商品
    getProductRow(row) {
      this.dialogVisible = false
      this.model.productId = row.id
      this.model.title = row.name
      this.prodcut = row
      this.getProduct(row.id)
    },
    // 配置详情
    getSharerShopping() {
      this.$http.getSharerShopping({ id: this.$route.query.id }).then((res) => {
        this.model = res.data.data
        this.model.sharerCommission /= 100
        this.model.distributerCommission /= 100
        this.model.items.map((item) => {
          item.sharerCommission /= 100
          item.distributerCommission /= 100
          return item
        })
      })
    },
    // 新增
    addSharerShopping(model) {
      this.$http
        .addSharerShopping(model)
        .then(() => {
          this.$message.success('保存成功，2秒后将进行跳转')
          setTimeout(() => {
            this.$router.back()
          }, 1500)
        })
        .finally(() => (this.saveBtnLoading = false))
    },
    // 修改
    updateSharerShopping(model) {
      this.$http
        .updateSharerShopping(model)
        .then(() => {
          this.$message.success('保存成功，2秒后将进行跳转')
          setTimeout(() => {
            this.$router.back()
          }, 1500)
        })
        .finally(() => (this.saveBtnLoading = false))
    },
    onClose() {
      this.dialogVisible = false
    },
    // 同步整列的值
    onSyncPrice(type) {
      this.model.items.forEach((item, index) => {
        this.$set(this.model.items[index], type, this[type])
      })
    },
    // 保存提交
    onSubmit() {
      this.$refs.model.validate((value) => {
        if (value) {
          let model = JSON.parse(JSON.stringify(this.model))
          // *= 100 是把元转为分
          model.sharerCommission *= 100
          model.distributerCommission *= 100
          model.sharerPoint = model.sharerPoint || 0
          model.distributerPoint = model.distributerPoint || 0
          model.items = model.items.map((item) => {
            item.sharerCommission *= 100
            item.distributerCommission *= 100
            // 重新构建，剔除接口不需要的字段
            return {
              productItemId: item.productItemId,
              sharerCommission: item.sharerCommission, // 推广佣金
              sharerPoint: item.sharerPoint || 0, // 推广积分
              distributerCommission: item.distributerCommission, // 销售佣金
              distributerPoint: item.distributerPoint || 0 // 销售积分
            }
          })
          this.saveBtnLoading = true // 设置按钮加载状态
          this.model.id ? this.updateSharerShopping(model) : this.addSharerShopping(model)
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
      width: 60px;
      text-align: center;
      line-height: 16px;
      word-break: break-all;
      vertical-align: middle;
      text-overflow: -o-ellipsis-lastline;
      cursor: pointer;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 2;
      // -webkit-box-orient: vertical;
    }
    &.value {
      width: 145px;
    }
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
