<template>
  <QcTable :option="{ url: 'api/admin/v1/memberLevel/page' }" :serch-form="searchFrom" :column="column"></QcTable>
</template>

<script>
export default {
  data() {
    return {
      searchFrom: [{ formName: 'type', value: 'actor' }],
      column: [
        { label: '序号', type: 'index', width: '50px' },
        { label: '等级名称', props: 'name', width: '50px' },
        { label: '创建时间', props: 'createTime', width: '100px' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
