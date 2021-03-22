<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
    <dig-form :visible="digFormWrap" :id="updateId" @close="digClose"></dig-form>
  </div>
</template>

<script>
import DigForm from './Form'
export default {
  components: { DigForm },
  data() {
    return {
      updateId: '',
      option: {
        url: 'api/admin/v1/role/page'
      },
      searchForm: [
        { type: 'input', label: '角色名', formName: 'name' },
        // { type: 'input', label: '角色', formName: 'role' },
        {
          label: '应用角色',
          type: 'select',
          formName: 'type',
          option: [
            { label: '全部', value: '' },
            { label: '用户角色', value: 'accountRole' },
            { label: '应用成员角色', value: 'userAccountRole' }
          ],
          value: ''
        }
      ],
      menu: [
        {
          type: 'primary',
          on: this.insert,
          label: '添加'
        },
        {
          type: 'primary',
          on: this.update,
          label: '修改',
          disabled: ({ currentRow }) => currentRow.id == null
        },
        {
          type: 'primary',
          on: this.detail,
          label: '编辑权限',
          disabled: ({ currentRow }) => currentRow.id == null
        },
        {
          type: 'danger',
          on: this.deleteConfirm,
          label: '删除',
          disabled: ({ currentRow }) => currentRow.id == null
        }
      ],
      column: [
        {
          label: '序号',
          align: 'center',
          type: 'index'
        },
        {
          label: '角色名',
          prop: 'name',
          width: '200px'
        },
        {
          label: '角色标识',
          align: 'center',
          prop: 'role'
        },
        {
          label: '角色信息',
          prop: 'description'
        },
        {
          label: '应用角色',
          formatter: (row) => {
            return row.type == 'accountRole' ? '用户角色' : '应用成员角色'
          },
          align: 'center'
        },
        {
          label: '排序号',
          align: 'center',
          prop: 'seqNum'
        },
        {
          label: '是否冻结',
          align: 'center',
          formatter: (currtRow) => {
            return currtRow.isFrozen ? '是' : '否'
          }
        },
        {
          label: '创建时间',
          align: 'center',
          prop: 'createTime'
        }
      ],
      isAdd: true,
      digFormWrap: false
    }
  },
  methods: {
    onGeiList(list) {
      this.tableData = list
    },
    deleteConfirm(row) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delete(row)
        })
        .catch(() => {
          return
        })
    },
    async delete(row) {
      await this.$http.deleteRole({ id: row.id })
      this.$refs.table.onSearchKeep()
      this.$message.success('删除成功')
    },
    insert() {
      this.isAdd = true
      this.digFormWrap = true
    },
    update(row) {
      this.updateId = row.id
      this.isAdd = false
      this.digFormWrap = true
    },
    detail(row) {
      this.$router.push(`role/detail?id=${row.id}`)
    },
    digClose(flag) {
      this.updateId = ''
      this.digFormWrap = false
      if (typeof flag == 'boolean' && flag) {
        this.$refs.table.onSearchKeep()
      }
    }
  }
}
</script>
