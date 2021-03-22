<template>
  <div class="tabbar">
    <div class="item active" v-if="tabText">{{ tabText }}</div>
    <template v-if="tabList.length > 0">
      <div
        class="item"
        :class="{ active: i + 1 === activeIndex }"
        v-for="(item, i) in tabList"
        :key="i"
        @click="handleSelect(item.index)"
      >
        {{ item.name }}
      </div>
    </template>
    <el-button type="primary" size="mini" class="back" @click="back">返回</el-button>
  </div>
</template>

<script>
export default {
  props: {
    tabText: String,
    tabList: {
      type: Array,
      default: () => {
        return []
      }
    },
    activeIndex: Number,
    onChange: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    // 切换tab
    handleSelect(index) {
      if (this.activeIndex === index) return false
      this.onChange(index)
    }
  }
}
</script>

<style lang="scss" scoped>
.tabbar {
  min-width: 850px;
  display: flex;
  border-bottom: 1px solid #e7eaec;
  position: relative;
  background-color: #353b3f !important;
  height: 50px;
  .back {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }
  .item {
    padding: 0 20px;
    color: #bfbfbf;
    cursor: pointer;
    line-height: 50px;
    transition: all 0.3s;
    &:hover {
      background-color: $--color-primary !important;
      color: #fff !important;
    }
  }
  .active {
    // background-color: #3091f2;
    background-color: $--color-primary;
    color: #fff;
  }
}
</style>
