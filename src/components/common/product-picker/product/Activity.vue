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
        url: 'api/admin/v1/activity/page',
        size: 'small',
        height: 500,
        isFull: true
      },
      searchForm: [
        {
          label: '活动名称',
          formName: 'title',
          type: 'input',
          value: ''
        }
      ],
      column: [
        { type: 'index', label: '序号', align: 'center', width: 50 },
        {
          prop: 'iconUrl',
          label: '封面',
          align: 'center',
          formatter: (row) => {
            return <el-image fit="cover" src={this.imgHost + row.iconUrl} style="width:55px;height:55px" />
          }
        },
        { prop: 'title', label: '活动名称' },
        {
          prop: 'isRelease',
          label: '发布',
          align: 'center',
          formatter: (row) => {
            if (row.isRelease) return '是'
            else return '否'
          }
        },
        { prop: 'startTime', label: '开始时间', align: 'center' },
        { prop: 'endTime', label: '结束时间', align: 'center' },
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
      row.pagePath = '/pagesCoWebs/activity/detail/index?id=' + row.id
      row.module = 'activity'
      this.$emit('on-select-row', row)
    }
  }
}
</script>
