<template>
  <div class="wrap" ref="wrap">
    <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
    <TagFormDialog :visible="digFormWrap" :type="type" :id="updateId" @close="onClose"></TagFormDialog>
  </div>
</template>

<script>
export default {
  props: {
    type: [Number]
  },
  data() {
    return {
      updateId: '',
      digFormWrap: false,
      option: {
        url: 'api/admin/v1/tag/page',
        size: 'small',
        showSearchAndReset: false
      },
      searchForm: [
        {
          formName: 'type',
          value: this.type
        }
      ],
      column: [
        { prop: 'seqNum', label: '序号', width: 50, align: 'center' },
        { prop: 'name', label: '名称', align: 'center' },
        { prop: 'createTime', label: '创建时间', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.digFormWrap = true
                    this.updateId = row.id
                  }}
                >
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteConfirm.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      menu: [
        {
          label: '添加',
          type: 'primary',
          on: () => {
            this.digFormWrap = true
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
          this.delete(id)
        })
        .catch(() => {
          return
        })
    },
    async delete(id) {
      await this.$http.deleteTag({ id })
      this.$refs.table.onSearchKeep()
      this.$message.success('删除成功')
    },
    onClose(isRefresh) {
      if (isRefresh) {
        this.$refs.table.onSearch()
      }
      this.digFormWrap = false
      this.updateId = ''
    }
  }
}
</script>
