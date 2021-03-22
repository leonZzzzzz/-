<template>
  <div>
    <div
      :style="
        `
      padding: 5px;
      background-color:${options.backgroundColor};
      color:${options.color};
      font-size:${options.fontSize}px;
      line-height:${options.lineHeight}px;
      text-align:${options.textAlign};
      font-weight:${options.fontWeight};
      `
      "
    >
      {{ options.value }}
    </div>
  </div> </template
>` `

<script>
export default {
  name: 'QcText',
  title: '文本',
  props: {
    options: Object
  },
  config: [
    { formName: 'value', label: '文本内容', type: 'el-input', value: '请输入内容' },
    { formName: 'backgroundColor', label: '背景颜色', type: 'el-color-picker', value: '#ffffff' },
    { formName: 'color', label: '字体颜色', type: 'el-color-picker', value: '#000000' },
    {
      formName: 'fontWeight',
      label: '字体粗细',
      type: 'el-radio-group',
      value: 'normal',
      options: [
        { value: 'normal', label: '细体' },
        { value: 'bold', label: '粗体' }
      ]
    },
    { formName: 'fontSize', label: '字体大小', type: 'el-input-number', value: 14 },
    { formName: 'lineHeight', label: '字体行高', type: 'el-input-number', value: 14 },
    {
      formName: 'textAlign',
      label: '对齐方式',
      type: 'el-radio-group',
      value: 'left',
      options: [
        { value: 'left', label: '左对齐' },
        { value: 'center', label: '居中对齐' },
        { value: 'right', label: '右对齐' }
      ]
    }
  ]
}
</script>
