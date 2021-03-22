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
        url: 'api/admin/v1.1/donate-activity/page',
        isFull: true,
        height: 500
      },
      searchForm: [{ formName: 'title', value: '' }],
      column: [
        { type: 'index', label: '序号', align: 'center' },
        {
          prop: 'cover',
          label: '封面',
          align: 'center',
          width: 90,
          formatter: (row) => {
            return <img src={this.imgHost + row.cover} alt="" width="80" height="80" />
          }
        },
        { prop: 'title', label: '标题', align: 'center' },
        {
          label: '操作',
          align: 'center',
          width: 100,
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
      row.pagePath = '/pagesCoWebs/donate/detail/index?id=' + row.id
      row.module = 'Donate'
      let data = {
        id: row.id,
        iconUrl: row.cover,
        name: row.title,
        pagePath: row.pagePath,
        module: row.module
      }
      this.$emit('on-select-row', data)
    }
  }
}
</script>
