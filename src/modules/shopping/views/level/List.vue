<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"> </QcTable>
    <el-dialog
      :title="model.id ? '修改' : '添加'"
      :visible.sync="visible"
      width="400px"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="model" ref="model" label-width="80px" label-position="left">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="info" :rules="[{ required: false, message: '该字段不能为空' }]">
          <el-input v-model="model.info"></el-input>
        </el-form-item>
        <!-- <el-form-item
          label="排序"
          prop="seqNum"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-input-number v-model="model.seqNum"></el-input-number>
        </el-form-item> -->
      </el-form>
      <span slot="footer">
        <el-button @click="onClose(false)">取 消</el-button>
        <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      loading: false,
      model: {
        id: '',
        name: '',
        info: '',
        seqNum: 1
      },
      option: {
        url: 'api/admin/mall/v1/productLevel/page'
      },
      searchForm: [],
      menu: [{ type: 'primary', label: '新建', on: () => (this.visible = true) }],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '名称', prop: 'name', align: 'center' },
        { label: '简介', prop: 'info', align: 'center' },
        // { label: '排序号', prop: 'seqNum', align: 'center' },
        { label: '创建时间', prop: 'createTime', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.visible = true
                    this.model = JSON.parse(JSON.stringify(row))
                  }}
                >
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteLevel.bind(this, row)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  created() {},
  methods: {
    deleteLevel(row) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteProductLevel({ id: row.id }).then(() => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    },
    success() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.saveModel(this.model.id ? 'updateProductLevel' : 'addProductLevel')
        } else {
          return false
        }
      })
    },
    async saveModel(type) {
      try {
        this.loading = true
        await this.$http[type](this.model)
        this.loading = false
        this.$message({
          message: type === 'updateProductLevel' ? '修改成功' : '添加成功',
          type: 'success'
        })
        this.onClose(true)
      } catch (err) {
        this.loading = false
      }
    },
    onClose(isRefresh) {
      if (isRefresh) {
        this.$refs.table.onSearch()
      }
      this.visible = false
      this.model = {}
    }
  }
}
</script>
