<template>
  <div>
    <img src="./img/activity-group.png" width="100%" />
  </div>
</template>

<script>
export default {
  name: 'QcActivityGroup',
  title: '活动模块',
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
        propsName: 'title,iconUrl,id',
        type: ['product'],
        module: ['Activity']
      }
    }
  ]
}
</script>
