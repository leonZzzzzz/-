<template>
  <div class="app-buy-slelct-standard">
    <div v-for="item in list" :key="item.id" class="standard-item">
      <div class="standard-item__header">
        <h1 class="standard-item__header-title">{{ item.name }}</h1>
        <h2 class="standard-item__header-desc">{{ item.briefDescribe }}</h2>
      </div>
      <div class="standard-item__price">
        <span class="standard-item__price-symbol">￥</span>
        <span class="standard-item__price-value">{{ item.price | formatPrice }}</span>
        <span class="standard-item__price-unit">/年</span>
      </div>
      <div class="standard-item__content">
        <div v-html="item.describe"></div>
      </div>
      <button
        class="standard-item__btn"
        :class="{ 'standard-item__btn--active': hasSelect(item.id) }"
        @click="addSelectPricing(item)"
      >
        立刻开通
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  created() {
    this.pageAppPricingBag()
  },
  methods: {
    hasSelect(id) {
      let ids = this.$store.state.pricing.selectPricing.find((item) => item.id === id)
      if (ids) {
        return true
      } else {
        return false
      }
    },
    pageAppPricingBag() {
      this.$http.pageAppPricingBag({ type: 1 }).then((res) => {
        this.list = res.data.data.list
      })
    },
    addSelectPricing(row) {
      this.$store.commit('pricing/addSelectPricing', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-buy-slelct-standard {
  display: flex;
  padding: 80px 14% 120px;
  .standard-item {
    position: relative;
    flex: 1;
    height: auto;
    padding: 0 0 63px;
    text-align: center;
    margin: 0 7% 0 0;
    box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.02), 0px 20px 40px 0px rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    &__header {
      position: relative;
      height: 200px;
      color: #fff;
      background: linear-gradient(90deg, #40a9ff 0%, #105cfb 100%);
      padding: 52px 0 37px 0;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      box-sizing: border-box;
      &-title {
        height: 40px;
        line-height: 40px;
        font-size: 28px;
        font-weight: 500;
        color: white;
      }
      &-desc {
        width: 199px;
        height: 48px;
        line-height: 24px;
        margin: 15px auto 45px auto;
        font-size: 14px;
        font-weight: 400;
        color: white;
      }
    }
    &__price {
      display: flex;
      align-items: baseline;
      justify-content: center;
      height: 56px;
      line-height: 56px;
      margin-top: 20px;
      color: #333333;
      &-symbol {
        width: 20px;
        height: 28px;
        font-size: 20px;
        font-weight: 400;
        line-height: 28px;
      }
      &-value {
        display: inline-block;
        font-size: 40px;
        font-weight: 500;
      }
      &-unit {
        font-size: 16px;
        font-weight: 600;
      }
    }
    &__content {
      height: 250px;
      margin-top: 40px;
      overflow: auto;
    }
    &__btn {
      display: block;
      width: 160px;
      height: 48px;
      line-height: 48px;
      border-radius: 4px;
      margin: 16px auto 0;
      color: #fff;
      border: none;
      outline: none;
      font-size: 16px;
      font-weight: 500;
      background-color: #fff;
      color: #2878f0;
      border: 1px solid #2878f0;
      &--active {
        color: white;
        background: linear-gradient(90deg, #40a9ff 0%, #105cfb 100%);
        box-shadow: 0px 6px 12px 0px rgba(23, 71, 139, 0.08);
        border: none;
      }
    }
  }
}
</style>
