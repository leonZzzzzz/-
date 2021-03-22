<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
    <FormDialog :item="tableRow" :visible="formVisible" :id="updateId" @close="onFormDialogClose"></FormDialog>
  </div>
</template>

<script>
import FormDialog from './FormDialog'
export default {
  components: { FormDialog },
  data() {
    return {
      updateId: '',
      tableRow: {},
      formVisible: false,
      option: {
        url: 'api/admin/v1/config/listByParentId',
        showSearchAndReset: false,
        showPagination: false,
        response: {
          list: 'data.data'
        }
      },
      searchForm: [{ value: 'SHOPPING_LOGISTICS_COMPANY', formName: 'parentId' }],
      menu: [
        {
          type: 'primary',
          label: '添加',
          on: () => {
            this.formVisible = true
          }
        }
      ],
      column: [
        { type: 'index', label: '序号', width: '60px', align: 'center' },
        { label: '物流公司', prop: 'value' },
        { label: '创建时间', prop: 'createTime' },
        { label: '排序号', prop: 'seqNum', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onclick={this.update.bind(this, row)}>
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
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .deleteLogisticsCompany({ id })
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.$refs.table.onSearchKeep()
            })
            .catch((err) => {
              this.$message({
                message: err.data.data.errMsg,
                type: 'error'
              })
            })
        })
        .catch(() => {
          return
        })
    },
    update(row) {
      this.updateId = row.id
      this.tableRow = JSON.parse(JSON.stringify(row))
      this.formVisible = true
    },
    onFormDialogClose(flag) {
      this.updateId = ''
      this.formVisible = false
      if (typeof flag == 'boolean' && flag) {
        this.$refs.table.onSearchKeep()
      }
    }
  }
}
</script>
