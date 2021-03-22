<template>
  <div style="padding-left: 5px;padding-top: 5px;">
    <img src="./img/QcHotProduct.png" width="100%" />
  </div>
</template>

<script>
export default {
  name: 'QcHotProduct',
  title: '多商家热门商品组件',
  props: {
    options: Object
  },
  config: [
    { formName: 'title', label: '标题文字', type: 'el-input', value: '热门商品' },
    {
      formName: 'item',
      label: '数据源',
      type: 'qc-uploader',
      value: [],
      props: {
        module: ['ProductCategory', 'ProductLevel'],
        type: ['product'],
        max: 1,
        propsName: 'id,name'
      }
    }
  ]
}
</script>

<style></style>
