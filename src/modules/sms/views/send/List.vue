<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :column="column"></QcTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/mobileMsg/page'
      },
      searchForm: [
        { label: '手机', formName: 'mobile', type: 'input' },
        {
          label: '发送时间',
          formName: 'startSendTime_endSendTime',
          type: 'date-picker',
          el: {
            type: 'datetimerange',
            valueFormat: 'yyyy-MM-dd HH:mm:ss'
          }
        }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        {
          label: '手机',
          align: 'center',
          prop: 'mobile'
        },
        {
          label: '发送状态',
          align: 'center',
          prop: 'status',
          formatter: (row) => {
            return row.status == 0 ? '成功' : '失败'
          }
        },
        { label: '发送时间', prop: 'createTime', align: 'center' }
      ]
    }
  }
}
</script>

<style></style>
