<template>
  <el-dialog
    :visible="visible"
    title="短信类型管理"
    width="600px"
    append-to-body
    :before-close="onClose"
    class="type-dialog"
  >
    <QcTable ref="table" :menu="menu" :option="option" :column="column"></QcTable>
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
        url: 'api/admin/v1/smsType/all',
        response: {
          list: 'data.data'
        }
      },
      menu: [
        {
          type: 'primary',
          label: '添加类型',
          on: () => {
            this.onSubmit()
          }
        }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '类型', prop: 'name', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.model = JSON.parse(JSON.stringify(row))
                    this.onSubmit()
                  }}
                >
                  编辑
                </el-button>
                <el-button type="text" onClick={this.delete.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      model: {
        name: ''
      }
    }
  },
  methods: {
    add() {
      this.$http.addSmsCategory(this.model).then(() => {
        this.$refs.table.onSearchKeep()
        this.model = { name: '' }
      })
    },
    update() {
      this.$http.updateSmsCategory(this.model).then(() => {
        this.$refs.table.onSearchKeep()
        this.model = { name: '' }
      })
    },
    delete(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteSmsCategory({ id }).then(() => {
          this.$refs.table.onSearchKeep()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    onSubmit() {
      this.$prompt('请填写类型名称', `${this.model.id ? '修改' : '添加'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S{1,8}$/,
        inputErrorMessage: '类型名称最少1个字，最多8个字',
        inputValue: ''
      })
        .then(({ value }) => {
          this.model.name = value
          this.model.id ? this.update() : this.add()
        })
        .catch(() => {
          this.model = { name: '' }
        })
    },
    onClose() {
      this.$emit('onClose')
    }
  }
}
</script>

<style lang="scss" scoped>
.type-dialog {
  .el-dialog__body {
    padding-top: 0;
  }
}
</style>
