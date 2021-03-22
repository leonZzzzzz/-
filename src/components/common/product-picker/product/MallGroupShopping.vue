<template>
  <QcTable ref="table" :option="option" :search-form="searchForm" :column="column"></QcTable>
</template>

<script>
import mixins from './mixins'
export default {
  mixins: [mixins],
  data() {
    return {
      option: {
        url: 'api/admin/mall/v1/groupShopping/page',
        isFull: true,
        height: 500
      },
      searchForm: [{ label: '名称', formName: 'title', type: 'input' }],
      // TODO: 拼团列表：缺少 销量 封面
      column: [
        { label: '序号', type: 'index', align: 'center' },
        {
          label: '封面',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.iconUrl} style="width:80px;height:80px;"></el-image>
          }
        },
        { label: '名称', prop: 'title', align: 'center' },
        {
          label: '团长价',
          align: 'center',
          formatter: (row) => {
            return row.organizerPrice / 100
          }
        },
        {
          label: '参团价',
          align: 'center',
          formatter: (row) => {
            return row.price / 100
          }
        },
        { label: '销量', prop: 'salesQty', align: 'center' },
        { label: '状态', prop: 'statusName', align: 'center' },
        { label: '拼团有效期', prop: 'duration', align: 'center', width: '100px' },
        { label: '开始时间', prop: 'startTime', align: 'center', width: '100px' },
        { label: '结束时间', prop: 'endTime', align: 'center', width: '100px' },
        { label: '创建时间', prop: 'createTime', align: 'center', width: '100px' },
        {
          label: '操作',
          prop: '',
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
      row.pagePath = `/pagesMall/group-product/detail/index?id=${row.id}&storeId=${row.storeId}`
      row.module = 'group-shopping'
      this.$emit('on-select-row', row)
    }
  }
}
</script>

<style></style>
