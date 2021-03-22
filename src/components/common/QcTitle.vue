<template>
  <div class="qc-title">
    <h2 class="qc-title__text">{{ title }}</h2>
    <div class="qc-title__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.qc-title {
  position: relative;
  &__text {
    margin: 0 20px 25px 0;
    display: inline-block;
    font-size: 16px;
    color: #353535;
    font-weight: bold;
    &::before {
      content: '';
      width: 3px;
      height: 20px;
      display: inline-block;
      vertical-align: text-bottom;
      margin-right: 17px;
      background: #409eff;
    }
  }
  &__body {
    padding-left: 20px;
  }
}
</style>
