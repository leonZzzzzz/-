<template>
  <div>
    <img src="./img/activity-list.png" width="100%" />
  </div>
</template>

<script>
export default {
  name: 'QcActivityList',
  title: '活动组件',
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
        propsName: 'title,iconUrl,id,price,origPrice,startTime,endTime,isEnableFee,signNum',
        module: ['Activity'],
        type: ['product']
      }
    }
  ]
}
</script>

<style></style>
