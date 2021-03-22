<template>
  <div :style="`height:${options.height}px;background-color: ${options.backgroundColor}`"></div>
</template>

<script>
export default {
  name: 'QcSplit',
  title: '间隔条',
  props: {
    options: Object
  },
  config: [
    { formName: 'height', label: '高度', type: 'el-input-number', value: '10' },
    { formName: 'backgroundColor', label: '背景色', type: 'el-color-picker', value: '#ffffff' }
  ]
}
</script>
