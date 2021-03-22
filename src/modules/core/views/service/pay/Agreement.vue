<template>
  <QcTable ref="table" :option="option" :menu="menu" :column="column"></QcTable>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/agreement/page'
      },
      menu: [
        {
          label: '添加支付协议',
          type: 'primary',
          on: () => {
            this.$router.push(`/main/service/setting/pay/agreement/form`)
          }
        }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '标题', prop: 'title', align: 'center' },
        { label: '协议组代码', align: 'center', prop: 'agreementGroup' },
        { label: '排序', prop: 'sortNumber', align: 'center' },
        {
          label: '操作',
          width: '150px',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push(`/main/service/setting/pay/agreement/form?id=${row.id}`)
                  }}
                >
                  修改
                </el-button>
                <el-button type="text" onClick={this.delAgreementTip.bind(this, row.id)}>
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
    delAgreementTip(id) {
      this.$confirm('是否删除该数据？', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteAgreement(row.row.id).then(() => {
            this.$message.success('删除成功')
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>

<style></style>
