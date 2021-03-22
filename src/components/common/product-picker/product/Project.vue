<template>
  <div class="wrap" ref="wrap">
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
        url: 'api/admin/v1/mini-program-page/page',
        size: 'small',
        height: 500,
        isFull: true
      },
      searchForm: [
        {
          label: '页面名称',
          formName: 'title',
          type: 'input',
          value: ''
        }
      ],
      column: [
        { type: 'index', label: '序号', align: 'center', width: 50 },
        { prop: 'name', label: '页面名称' },
        { prop: 'path', label: '页面路径', align: 'center' },
        { prop: 'createTime', label: '创建时间', align: 'center' },
        {
          label: '操作',
          align: 'center',
          fixed: 'right',
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
      console.log(row)
      row.pagePath = '/pagesCommon/channelTransfer/index?id=' + row.id
      row.module = 'mini-program-page'
      this.$emit('on-select-row', row)
    }
  }
}
</script>
