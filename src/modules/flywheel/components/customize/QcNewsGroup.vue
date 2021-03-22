<template>
  <div>
    <img src="./img/QcNewsGroup.png" width="100%" />
  </div>
</template>

<script>
export default {
  name: 'QcNewsGroup',
  title: '图文模块',
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
        propsName: 'name,iconUrl,id',
        module: ['News'],
        type: ['product']
      }
    }
  ]
}
</script>

<style></style>
