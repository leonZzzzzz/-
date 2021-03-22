<template>
  <div :style="{ margin: `${options.intervals ? '0 15px' : 0} ` }">
    <img src="./img/OfficialAccount.jpg" :style="{ width: '100%', display: 'block' }" />
  </div>
</template>

<script>
export default {
  name: 'OfficialAccount',
  title: '关注公众号',
  props: {
    options: Object
  },
  config: [
    {
      label: '左右间距',
      formName: 'intervals',
      type: 'el-switch',
      value: false
    }
  ]
}
</script>

<style></style>
