<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :column="column"></QcTable>
  </div>
</template>

<script>
import mixins from './mixins'
export default {
  mixins: [mixins],
  data() {
    return {
      option: { url: 'api/admin/v1/channel_code/page_for_select', isFull: true, height: 500 },
      searchForm: [
        { label: '联系人', type: 'input', formName: 'name', value: '' },
        { label: '手机', type: 'input', formName: 'mobile', value: '' }
      ],
      column: [
        { type: 'index', label: '序号', width: '60px', align: 'center' },
        { prop: 'channelName', label: '渠道名' },
        { prop: 'channelCodeName', label: '子渠道名' },
        { prop: 'name', label: '联系人' },
        { prop: 'mobile', label: '手机' },
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
      row.module = 'channel'
      this.$emit('on-select-row', row)
    }
  }
}
</script>
