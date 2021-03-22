<template>
  <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/sharer/platform-audit-page'
      },
      menu: [
        {
          label: '通过',
          disabled: ({ selectionRow }) => selectionRow.length == 0,
          on: (currentRow, search, selectionRow) => {
            console.log(selectionRow)
            let ids = selectionRow.map((item) => {
              return item.id
            })
            this.auditData(ids.join(','), true)
          }
        },
        {
          label: '不通过',
          disabled: ({ selectionRow }) => selectionRow.length == 0,
          on: (currentRow, search, selectionRow) => {
            console.log(selectionRow)
            let ids = selectionRow.map((item) => {
              return item.id
            })
            this.auditData(ids.join(','), false)
          }
        }
      ],
      searchForm: [
        { label: '手机', formName: 'mobile', type: 'input' },
        {
          label: '审核状态',
          type: 'select',
          formName: 'auditStatus',
          option: [
            { value: '', label: '全部' },
            { value: 'waiting', label: '待审核' },
            { value: 'refused', label: '审核不通过' },
            { value: 'audited', label: '已审核' }
          ],
          value: 'waiting'
        }
      ],
      column: [
        {
          type: 'selection'
        },
        // { label: '序号', type: 'index', align: 'center', width: 80 },
        {
          label: '头像',
          align: 'center',
          prop: 'headImage',
          formatter: (row) => {
            return <img src={row.headImage} alt="" style="width: 50px;height: 50px;border-radius: 50%;" />
          }
        },
        {
          label: '昵称',
          align: 'left',
          prop: 'appellation'
        },
        {
          label: '手机',
          align: 'center',
          prop: 'mobile'
        },
        {
          label: '商户',
          align: 'left',
          prop: 'store'
        },
        {
          label: '审核状态',
          align: 'left',
          prop: 'auditStatus',
          formatter: (row) => {
            return (
              <div>
                {
                  {
                    waiting: '待审核',
                    refused: '审核不通过',
                    audited: '已审核'
                  }[row.auditStatus]
                }
              </div>
            )
          }
        },
        {
          label: '注册时间',
          align: 'left',
          prop: 'createTime'
        }
        // {
        //   label: '操作',
        //   width: '120px',
        //   align: 'center',
        //   fixed: 'right',
        //   formatter: row => {
        //     return (
        //       <div>
        //         <el-button
        //           type="text"
        //           onClick={this.auditData.bind(this, row.id, 1)}
        //         >
        //           通过
        //         </el-button>
        //         <el-button
        //           type="text"
        //           onClick={this.auditData.bind(this, row.id, 2)}>
        //           不通过
        //         </el-button>
        //       </div>
        //     )
        //   }
        // }
      ]
    }
  },
  methods: {
    auditData(ids, audit) {
      this.$confirm(`确认${!audit ? '不' : ''}通过吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let apiName = !audit ? 'sharerRefuse' : 'sharerAudit'
          this.$http[apiName]({ id: ids }).then(() => {
            this.$refs.table.onSearchKeep()
            this.$message.success('操作成功')
          })
        })
        .catch(() => {
          return
        })
    }
  }
}
</script>

<style></style>
