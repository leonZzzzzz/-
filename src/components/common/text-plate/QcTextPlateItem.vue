<template>
  <div class="text-plate-item">
    <div class="text-plate-item__label" :style="`flex:${labelWidth} 1 0;text-align:${textAlign}`">{{ label }}</div>
    <div class="text-plate-item__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['textAlign', 'labelWidth'],
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.text-plate-item {
  display: flex;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 20px;
  color: #606266;
  &__content {
    flex: 1;
  }
}
</style>
