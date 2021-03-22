<template>
  <QcTable :column="column" :menu="menu" :search-form="searchForm" :option="option"></QcTable>
</template>

<script>
export default {
  data() {
    return {
      searchForm: [
        { label: '标题', formName: 'title', type: 'input' },
        {
          label: '状态',
          value: '',
          type: 'select',
          formName: 'status',
          option: [
            { label: '全部', value: '' },
            { label: '草稿', value: 0 },
            { label: '待发送', value: 1 },
            { label: '已发送', value: 2 }
          ]
        }
      ],
      menu: [
        {
          type: 'primary',
          label: '添加',
          on: () => {
            this.$router.push(`/main/activity/plugin/notice/form`)
          }
        }
      ],
      option: {
        url: 'api/admin/v1/notice/page'
      },
      column: [
        { type: 'index', label: '序号', align: 'center' },
        { prop: 'title', label: '标题', align: 'center' },
        {
          label: '状态',
          formatter: (row) => {
            return {
              0: '草稿',
              1: '待发送',
              2: '已发送'
            }[row.status]
          },
          align: 'center'
        },
        { prop: 'sendTime', label: '发送时间', align: 'center' },
        { prop: 'createTime', label: '创建时间', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onclick={() => {
                    this.$router.push(`/main/activity/plugin/notice/form?id=${row.id}`)
                  }}
                >
                  修改
                </el-button>
                <el-button type="text" onclick={this.deleteConfirm.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    deleteConfirm() {
      this.$confirm('是否删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteNotice({ id }).then((res) => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style></style>
