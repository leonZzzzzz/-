<template>
  <QcTable :option="option" :search-form="searchForm" :column="column"></QcTable>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/mall/v1/groupOrder/listJoinOrder'
      },
      searchForm: [
        { formName: 'organizeOrderId', value: '' },
        { label: '姓名', formName: 'orderNo', type: 'input' },
        { label: '手机', formName: 'name', type: 'input' }
      ],
      column: [
        { label: '序号', type: 'index' },
        { label: '头像', prop: '' },
        { label: '姓名', prop: '' },
        { label: '手机', prop: '' },
        { label: '助力时间', prop: '' }
      ]
    }
  }
}
</script>

<style></style>
