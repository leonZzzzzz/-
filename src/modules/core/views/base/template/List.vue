<template>
  <QcTable ref="table" :option="option" :menu="menu" :column="column"></QcTable>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/wxMsgTemplate/page'
      },
      menu: [
        {
          type: 'primary',
          label: '添加',
          on: () => {
            this.$router.push(`/main/base/template/form`)
          }
        }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '标题', prop: 'name' },
        { label: '关键字', prop: 'templateItemShow' },
        { label: '模版ID', prop: 'wxTemplateId' },
        {
          label: '操作',
          width: '150px',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push(`/main/base/template/form?id=${row.id}`)
                  }}
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push(`/main/base/template/detail?id=${row.id}`)
                  }}
                >
                  详情
                </el-button>
                {!row.isSystem && (
                  <el-button type="text" onClick={this.wxTemplateDelete.bind(this, row.id)}>
                    删除
                  </el-button>
                )}
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    wxTemplatePage() {
      this.$http.wxTemplatePage(this.search).then((res) => {
        this.tableData = res.data.data.list
        this.search.total = res.data.data.total
      })
    },
    wxTemplateDelete(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.wxTemplateDelete({ id }).then(() => {
            this.$message.success('删除成功')
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style></style>
