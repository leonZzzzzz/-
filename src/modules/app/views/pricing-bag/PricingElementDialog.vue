<template>
  <el-dialog :visible="visible" title="选择功能点" append-to-body width="550px" :show-close="false">
    <QcTable ref="table" :option="option" :column="column" :searchForm="searchForm" @select="onSelect"></QcTable>
    <div slot="footer">
      <!-- <el-button>关闭</el-button> -->
      <el-button type="primary" @click="onSubmit()">确定</el-button>
    </div>
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
        url: 'api/admin/v1/appPricingElement/page',
        isFull: false,
        height: '400px'
      },
      searchForm: [{ label: '名称', type: 'input', formName: 'name' }],
      column: [
        { type: 'selection', align: 'center' },
        { label: '名称', prop: 'name', align: 'center' },
        { label: '说明', prop: 'describe', align: 'center' },
        {
          label: '状态',
          align: 'center',
          formatter: (row) => {
            return row.status === 1 ? '正常' : '冻结'
          }
        },
        { label: '创建时间', prop: 'createTime', align: 'center', width: '100px' }
      ],
      selectRow: []
    }
  },
  methods: {
    onSelect(row) {
      this.selectRow = row
    },
    onSubmit() {
      this.$emit('get-list', this.selectRow)
      this.$refs.table.onSearch()
    }
  }
}
</script>
