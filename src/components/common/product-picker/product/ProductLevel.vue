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
      option: { url: 'api/admin/mall/v1/productLevel/page', isFull: true, height: 500 },
      searchForm: [],
      column: [
        { type: 'index', label: '序号', width: '60px', align: 'center' },
        { prop: 'name', label: '名称' },
        { prop: 'info', label: '简介' },
        { prop: 'createTime', label: '创建时间', align: 'center' },
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
      row.module = 'ProductLevel'
      row.pagePath = `/pagesMall/hot-product/index?level=${row.id}&pageTitle=${row.name}`
      this.$emit('on-select-row', row)
    }
  }
}
</script>
