<template>
  <div>
    <b><slot></slot></b><em v-if="lookText">|</em><span v-if="lookText" @click="look">{{ lookText }}</span>
  </div>
</template>

<script>
export default {
  props: {
    lookText: {
      type: String,
      default: ''
    }
  },
  methods: {
    look() {
      this.$emit('lookLink')
    }
  }
}
</script>

<style lang="scss" scoped>
b {
    font-size: 14px;
    color: #202020;
    font-weight: bold;
}
em {
    font-size: 14px;
    color: #C3C2C2;
    margin: 0 3px;
}
span {
    font-size: 12px;
    color: #A3A2A2;
    cursor: pointer;
    &:hover {
       color: #294A7B; 
    }
}
</style>