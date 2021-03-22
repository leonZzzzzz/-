<template>
  <div class="text-plate">
    <h4 v-if="title" class="text-plate__title">{{ title }}</h4>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    align: {
      type: String,
      default: 'left'
    },
    width: {
      type: String,
      default: '100px'
    },
    title: String
  },
  provide() {
    return {
      textAlign: this.align,
      labelWidth: this.width
    }
  }
}
</script>

<style lang="scss" scoped>
.text-plate {
  &__title {
    font-size: 16px;
    margin-bottom: 20px;
  }
}
</style>
