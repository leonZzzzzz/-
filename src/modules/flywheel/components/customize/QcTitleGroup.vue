<template>
  <div class="title-style" :style="`background:${options.backgroundColor}`">
    <div class="title-style__text">
      {{ options.title }}
    </div>
    <div class="title-style__more" v-if="options.isMore">
      {{ options.more }}
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QcTitleGroup',
  title: '标题',
  props: {
    options: Object
  },
  config: [
    { formName: 'backgroundColor', label: '背景色', type: 'el-color-picker', value: '#fff' },
    { formName: 'title', label: '标题文字', type: 'el-input', value: '请输入内容' },
    { formName: 'isMore', label: '显示更多', type: 'el-switch', value: true },
    { formName: 'more', label: '跳转文字', type: 'el-input', value: '更多' },
    {
      formName: 'href',
      label: '跳转链接',
      type: 'qc-uploader',
      value: ''
    }
  ]
}
</script>

<style lang="scss" scoped>
.title-style {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 15px;
  &__text {
    position: relative;
    font-size: 17px;
    font-weight: 600;
    padding-left: 15px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 5px;
      background: #ff5433;
    }
  }
  &__more {
    font-size: 15px;
    color: #888;
  }
}
</style>
