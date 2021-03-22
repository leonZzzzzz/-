<template>
  <div class="form-type-title">
    <p class="text">{{text}}</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.form-type-title {
  padding: 15px 0;
  position: relative;
  .text {
    margin-right: 15px;
    display: inline-block;
    font-size: 16px;
    color: #353535;
    font-weight: bold;
    vertical-align: middle;
  }
  &::before {
    content: '';
    width: 3px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 20px;
    background: #2a75ed;
  }
}
</style>
