<template>
  <div>
    <QcTable ref="table" :option="option" :column="column"> </QcTable>
  </div>
</template>

<script>
import mixins from './mixins'
export default {
  mixins: [mixins],
  data() {
    return {
      option: {
        url: 'api/admin/v1/course/page',
        isFull: true,
        height: 500
      },
      column: [
        { type: 'index', label: '序号', align: 'center', width: '60px' },
        {
          label: '封面',
          formatter: (row) => {
            return (
              <el-image src={this.imgHost + row.iconUrl} mode="widthFix" style="width:60px;height:50px;"></el-image>
            )
          }
        },
        { prop: 'title', label: '课程' },
        { prop: 'educationalSystem', label: '学制' },
        { prop: 'advanceCharge', label: '预付款金额' },
        { prop: 'city', label: '城市' },
        {
          prop: 'isRelease',
          label: '发布',
          formatter: (row) => {
            return row.isRelease ? '是' : '否'
          }
        },
        { prop: 'createTime', label: '创建时间' },
        {
          label: '操作',
          formatter: (row) => {
            return (
              <el-button type="text" onClick={this.onSelectRow.bind(this, row)}>
                使用
              </el-button>
            )
          }
        }
      ]
    }
  },
  methods: {
    onSelectRow(row) {
      row.pagePath = `/pagesCoWebs/course/detail/index?id=${row.id}`
      row.module = 'lesson'
      this.$emit('on-select-row', row)
    }
  }
}
</script>
