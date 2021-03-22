<template>
  <div class="qc-plate-title">
    <div class="qc-plate-title__left">
      <div class="qc-plate-title__icon" />
      <div class="qc-plate-title__title">{{ title }}</div>
      <div class="qc-plate-title__info">{{ info }}</div>
    </div>
    <div class="qc-plate-title__right">更多<i class="el-icon-arrow-right"></i></div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    },
    more: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.qc-plate-title {
  padding: 15px 15px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  &__left {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  &__title {
    font-size: 18px;
    font-weight: 600;
    margin-right: 10px;
  }
  &__info {
    font-size: 14px;
    color: #737373;
  }
  &__right {
    font-size: 14px;
    color: #737373;
  }
}
</style>
