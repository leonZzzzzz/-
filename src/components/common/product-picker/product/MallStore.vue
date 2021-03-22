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
        url: 'api/admin/v1/storeApply/pageStore?storeStatus=1',
        isFull: true,
        height: 500
      },
      searchForm: [{ formName: 'name', value: '', label: '店铺名称' }],
      column: [
        { type: 'index', label: '序号', align: 'center' },
        {
          prop: 'logoIconUrl',
          label: '封面',
          align: 'center',
          width: 90,
          formatter: (row) => {
            return <img src={this.imgHost + row.logoIconUrl} alt="" width="80" height="80" />
          }
        },
        { prop: 'name', label: '名称', align: 'center' },
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
      row.pagePath = '/pagesMall/store/detail/index?id=' + row.id
      row.module = 'MallStore'
      let data = {
        id: row.id,
        iconUrl: row.logoIconUrl,
        name: row.name,
        pagePath: row.pagePath,
        module: row.module
      }
      this.$emit('on-select-row', data)
    }
  }
}
</script>
