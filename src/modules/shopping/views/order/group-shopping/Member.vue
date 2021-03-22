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
        { label: '状态', prop: '' },
        { label: '商品', prop: '' },
        { label: '规格', prop: '' },
        { label: '类型', prop: '' },
        { label: '金额', prop: '' },
        { label: '付款时间', prop: '' },
        { label: '下单时间', prop: '' },
        { label: '下单姓名', prop: '' }
      ]
    }
  }
}
</script>

<style></style>
