<template>
  <div :style="{ margin: `${options.intervals ? '0 15px' : 0} ` }">
    <img src="./img/XiaoetechCourseVip.jpg" :style="{ width: '100%', display: 'block' }" />
  </div>
</template>

<script>
export default {
  name: 'QcXiaoetechCourseVip',
  title: '会员卡列表',
  props: {
    options: Object
  },
  config: [
    {
      formName: 'item',
      label: '自定义数据',
      type: 'qc-uploader',
      value: [],
      props: {
        type: ['product'],
        module: ['XiaoeTechCourseVip'],
        propsName: 'iconUrl,id,name'
      }
    }
  ]
}
</script>

<style></style>
