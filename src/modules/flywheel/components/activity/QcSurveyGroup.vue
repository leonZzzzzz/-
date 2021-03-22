<template>
  <div>
    <img src="./img/activity-survey.png" width="100%" />
  </div>
</template>

<script>
export default {
  name: 'QcSurveyGroup',
  title: '问卷',
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
        type: ['product'],
        module: ['Survey']
      }
    }
  ]
}
</script>

<style></style>
