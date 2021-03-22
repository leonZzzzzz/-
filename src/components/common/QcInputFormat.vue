<template>
  <el-input :value="count" @input="onInput"></el-input>
</template>

<script>
import { PRICE } from '@/utils/regex'
export default {
  props: {
    value: {
      type: [Number, String],
      default: ''
    }
  },
  computed: {
    count() {
      if (PRICE.test(this.value)) {
        return this.value / 100
      } else {
        return this.value
      }
    }
  },
  methods: {
    onInput(val) {
      let data = null
      if (PRICE.test(val)) {
        data = val * 100
      } else {
        data = val
      }
      this.$emit('input', data)
    }
  }
}
</script>

<style></style>
