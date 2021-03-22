<template>
  <el-card>
    <el-button type="primary" size="medium" @click="insert()">添加</el-button>
    <br />
    <br />
    <el-table
      :data="manageMenu"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      size="medium"
      :tree-props="{ children: 'childs' }"
    >
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="url" label="链接"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">{{ scope.row.isDelete ? '作废' : '正常' }}</template>
      </el-table-column>
      <el-table-column prop="seqNum" label="排序"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="update(scope.row)">编辑</el-button>
          <el-button type="text" @click="insert(scope.row)">添加子菜单</el-button>
          <el-button type="text" @click="$router.push(`permission/detail?id=${scope.row.id}&name=${scope.row.name}`)"
            >编辑权限</el-button
          >
          <el-button type="text" @click="deleteConfirm(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Form
      :visible="formVisible"
      :id="updateId"
      :parentId="parentId"
      @close="onFormDialogClose"
      resourceType="menu"
    ></Form>
  </el-card>
</template>

<script>
import Form from './Form'
export default {
  components: { Form },
  data() {
    return {
      updateId: '',
      parentId: '',
      formVisible: false,
      searchData: {
        name: '',
        resourceType: ''
      },
      manageMenu: []
    }
  },
  created() {
    this.manageMenuTree()
  },
  methods: {
    async manageMenuTree() {
      let res = await this.$http.manageMenuTree()
      this.manageMenu = res.data.data
      // console.log(JSON.stringify(this.manageMenu, 0, 1))
    },
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deletePermission({ id }).then(() => {
            this.manageMenuTree()
            this.$message.success('删除成功')
          })
        })
        .catch(() => {
          return
        })
    },
    insert(item) {
      if (item) this.parentId = item.id
      this.formVisible = true
    },
    update(item) {
      this.updateId = item.id
      this.formVisible = true
    },
    onFormDialogClose(flag) {
      this.updateId = ''
      this.parentId = ''
      this.formVisible = false
      if (typeof flag == 'boolean' && flag) {
        this.manageMenuTree()
      }
    }
  }
}
</script>
