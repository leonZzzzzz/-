<template>
  <el-dialog append-to-body :visible="visible" title="产品选择" :before-close="onClose" width="600px">
    <QcTable :option="option" :column="column"></QcTable>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      option: {
        height: 400,
        url: 'api/admin/v1/journey-product/page'
      },
      searchForm: [{ label: '名称', type: 'input', formName: 'name' }],
      column: [
        { label: '排序', type: 'index', align: 'center' },
        {
          label: '封面',
          width: '100px',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.cover} style="width:50px;height:50px"></el-image>
          }
        },
        { label: '名称', prop: 'title', align: 'center', width: '300px' },
        {
          label: '操作',
          formatter: (row) => {
            return (
              <el-button type="primary" size="mini" onClick={this.onSelect.bind(this, row)}>
                使用
              </el-button>
            )
          }
        }
      ]
    }
  },
  methods: {
    onSelect(row) {
      this.$emit('onSelect', row)
    },
    onClose() {
      this.$emit('onClose')
    }
  }
}
</script>
