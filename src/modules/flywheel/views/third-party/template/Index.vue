<template>
  <div style="background:#fff">
    <div class="template-bar">
      <span :style="`color: ${type == 'draft' ? '#294a7b' : ''}`" @click="() => (type = 'draft')">草稿箱</span>
      <span style="margin:0 10px;">|</span>
      <span :style="`color: ${type == 'template' ? '#294a7b' : ''}`" @click="() => (type = 'template')"
        >小程序模版库</span
      >
    </div>
    <Draft v-if="type == 'draft'" />
    <Template v-else />
  </div>
</template>

<script>
import Draft from './Draft'
import Template from './Template'
export default {
  components: {
    Draft,
    Template
  },
  data() {
    return {
      type: 'draft'
    }
  }
}
</script>
<style lang="scss" scoped>
.template-bar {
  padding: 30px 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
