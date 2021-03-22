<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :column="column"></QcTable>
  </div>
</template>

<script>
import mixins from './mixins'
export default {
  mixins: [mixins],
  data() {
    return {
      option: {
        isFull: true,
        height: 500,
        url: 'api/admin/v1/xiaoe-tech/course-vip/page'
      },
      searchForm: [
        { label: '名称', type: 'input', formName: 'name' },
        {
          label: '状态',
          type: 'select',
          formName: 'saleStatus',
          value: '',
          option: [
            { label: '全部', value: '' },
            { label: '上架', value: 0 },
            { label: '下架', value: 1 }
          ]
        }
      ],
      column: [
        { label: '序号', type: 'index', width: '50px', align: 'center' },
        { label: '名称', prop: 'name' },
        { label: '有效天数', prop: 'validDays', align: 'center' },
        { label: '开始时间', prop: 'startTime', align: 'center' },
        { label: '结束时间', prop: 'endTime', align: 'center' },
        {
          label: '状态',
          formatter: (row) => {
            return row.saleStatus == 0 ? '上架' : '下架'
          }
        },
        {
          label: '操作',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.onSelectRow.bind(this, row)}>
                  使用
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    onSelectRow(row) {
      row.pagePath = '/pagesCoWebs/survey/detail/index?id=' + row.id
      this.$emit('on-select-row', row)
    }
  }
}
</script>
