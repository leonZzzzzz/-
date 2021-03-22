<template>
  <div>
    <QcTable ref="table" :search-form="searchForm" :option="option" :column="column"></QcTable>
  </div>
</template>

<script>
import mixins from './mixins'
export default {
  mixins: [mixins],
  data() {
    return {
      categoryList: [],
      option: {
        url: 'api/admin/v1/survey/page',
        isFull: true,
        height: 500
      },
      searchForm: [{ formName: 'title', type: 'input', value: '', label: '标题' }],
      column: [
        { type: 'index', label: '序号', align: 'center' },
        { prop: 'title', label: '标题', align: 'center' },
        { prop: 'startTime', label: '开始时间', align: 'center' },
        { prop: 'endTime', label: '结束时间', align: 'center' },
        {
          label: '操作',
          align: 'center',
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
      row.module = 'survey'
      this.$emit('on-select-row', row)
    }
  }
}
</script>
