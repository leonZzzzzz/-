<template>
  <div style="padding:20px;background:#fff;margin:0 auto;width:770px">
    <el-button @click="onPush()" type="primary">添加</el-button>
    <br /><br />
    <el-table :data="list">
      <el-table-column label="图标" width="60px">
        <template slot-scope="scope">
          <QcImageUpload width="40px" height="40px" v-model="scope.row.icon"></QcImageUpload>
        </template>
      </el-table-column>
      <el-table-column label="标题" width="170px">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.title" style="width:150px"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="路径" width="270px">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.path" style="width:250px"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="序号" width="120px">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.seqNum" style="width:100px"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="saveOrUpdateCustomMenu(scope.row)">保存</el-button>
          <el-button size="mini" type="danger" @click="onDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      customer: {}
    }
  },
  created() {
    this.pageMyMenu()
  },
  methods: {
    pageMyMenu() {
      this.$http.get('api/admin/v1/miniProgram/myMenu/get').then((res) => {
        this.list = res.data.data
      })
    },
    saveOrUpdateCustomMenu(row) {
      this.$http.saveOrUpdateCustomMenu([row]).then(() => {
        this.$message.success('保存成功')
      })
    },
    onPush() {
      this.list.push({
        path: '',
        seqNum: 0,
        icon: '',
        title: ''
      })
    },
    onDelete(id) {
      this.$http.deleteCustomMenu({ id }).then(() => {
        this.pageMyMenu()
      })
    }
  }
}
</script>
