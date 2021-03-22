<template>
  <QcTable ref="table" :option="option" :column="column"></QcTable>
</template>

<script>
import mixins from './mixins'
export default {
  mixins: [mixins],
  data() {
    return {
      option: {
        url: 'api/admin/v1/singleContent/page',
        isFull: true,
        height: 500
      },
      column: [
        { type: 'index', label: '序号', align: 'center' },
        {
          label: '封面',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.iconUrl} style="width:50px;height:50px"></el-image>
          }
        },
        { prop: 'title', label: '标题', align: 'center' },
        { prop: 'categoryName', label: '分类', align: 'center' },
        { prop: 'info', label: '简介', align: 'center' },
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
      row.pagePath = `/pagesCoWebs/news/detail/index?id=${row.id}`
      row.module = 'news'
      this.$emit('on-select-row', row)
    }
  }
}
</script>
