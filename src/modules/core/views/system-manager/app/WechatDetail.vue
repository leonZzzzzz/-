<template>
  <div class="wrap">
    <TableLayout ref="table" :search="searchData" url="api/admin/v1/wxApp/page" @get-list="onGetList">
      <el-table :data="tableData">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="头像" prop="logoUrl"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="主体名称" prop="customerName"></el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">{{ scope.row.serviceType | serviceType }}</template>
        </el-table-column>
        <el-table-column label="认证类型">
          <template slot-scope="scope">{{ scope.row.verifyType | verifyType }}</template>
        </el-table-column>
        <el-table-column label="微信号" prop="wxNo"></el-table-column>
        <el-table-column label="备注说明" prop="remark"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
      </el-table>
    </TableLayout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      updateId: '',
      digFormWrap: false,
      searchData: {
        appId: this.$route.query.appId
      },
      tableData: []
    }
  },
  filters: {
    serviceType(val) {
      switch (val) {
        case 0:
          return '订阅号'
        case 1:
          return '历史老账号升级后的订阅号'
        case 2:
          return '服务号'
        case 3:
          return '小程序'
      }
    },
    verifyType(val) {
      switch (val) {
        case -1:
          return '未认证'
        case 0:
          return '微信认证'
        case 1:
          return '新浪微博认证'
        case 2:
          return '腾讯微博认证'
        case 3:
          return '资质认证通过但还未通过名称认证'
        case 4:
          return '资质认证通过、还未通过名称认证，但通过了新浪微博认证'
        case 5:
          return '资质认证通过、还未通过名称认证，但通过了腾讯微博认证'
      }
    }
  },
  methods: {
    onGetList(list) {
      this.tableData = list
    },
    authorize() {
      console.log(`${this.base.baseHost}${this.base.projectName()}/open/wx/login?appId=${this.tableList.id}`)
      // return
      window.open(`${this.base.baseHost}${this.base.projectName()}/open/wx/login?appId=${this.tableList.id}`)
    }
  }
}
</script>
