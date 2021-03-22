<template>
  <div class="app-buy-slelct-plugin">
    <el-row :gutter="30">
      <el-col :span="8" v-for="item in list" :key="item.id">
        <div class="plugin-item" :class="{ 'plugin-item--active': hasSelect(item.id) }" @click="addSelectPricing(item)">
          <div class="icon" v-if="hasSelect(item.id)">
            <i class="el-icon-check"></i>
          </div>
          <img :src="imgHost + item.iconUrl" class="plugin-item__avatar" />
          <div class="item-text">
            <div class="plugin-item__name">
              {{ item.name }}
              <span class="money">¥{{ item.price }}元/年</span>
            </div>
            <div class="plugin-item__tips">{{ item.briefDescribe }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
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
      this.$http.pageAppPricingBag({ type: 2 }).then((res) => {
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
.app-buy-slelct-plugin {
  padding: 30px;
  .plugin-item {
    display: flex;
    align-items: center;
    border-radius: 4px;
    border: 1px solid #eeeeee;
    cursor: pointer;
    margin-bottom: 30px;
    padding: 15px;
    position: relative;
    overflow: hidden;

    .icon {
      &::before {
        content: '';
        position: absolute;
        top: -6px;
        right: -19px;
        width: 60px;
        height: 30px;
        background: $--color-primary;
        transform: rotate(45deg);
      }
      .el-icon-check {
        position: absolute;
        right: 5px;
        top: 5px;
        color: #fff;
      }
    }

    &--active {
      border-color: $--color-primary;
    }
    &__avatar {
      width: 60px;
      height: 60px;
      margin-right: 15px;
      border-radius: 4px;
    }
    &__name {
      line-height: 22px;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      .money {
        white-space: nowrap;
        font-weight: 400;
        color: #fb6161;
      }
    }
    &__tips {
      height: 17px;
      line-height: 17px;
      margin-top: 6px;
      font-size: 12px;
      font-weight: 400;
      color: #666666;
      overflow: hidden;
    }
  }
}
</style>
