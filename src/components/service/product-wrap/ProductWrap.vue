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
        isFull: false,
        url: 'api/admin/mall/v1/product/page?salesStatus=0'
      },
      column: [
        {
          label: '序号',
          type: 'index',
          align: 'center'
        },
        {
          label: '图片',
          width: '100px',
          align: 'center',
          formatter: (row) => {
            return <img class="cover" src={this.imgHost + row.iconUrl} width="50px" height="50px" />
          }
        },
        {
          label: '标题',
          width: '300px',
          prop: 'name'
        },
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
