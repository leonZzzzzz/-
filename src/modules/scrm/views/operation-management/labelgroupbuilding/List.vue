<template>
  <div class="addlivecode">
    <div class="container">
      <div class="query-table-box">
        <el-form inline :model="searchForm" label-width="100px" label-position="right" size="small">
          <el-form-item label="任务名称">
            <el-input placeholder="请输入任务名称" v-model="searchForm.name"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button size="small" type="primary" @click="searchLiveCodeList">查询</el-button>
            <el-button size="small" type="info" @click="reLiveCodeSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="operating-btn">
        <el-button size="small" type="primary" @click="openAddLiveCode">创建群邀请</el-button>
      </div>
      <div class="common-table-box">
        <el-table
          :data="tableData"
          width="100%"
          id="table"
          class="el-table"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          :height="height"
        >
          <el-table-column label="任务名称" prop="name" align="center"> </el-table-column>
          <el-table-column label="群名称" align="center"> </el-table-column>
          <el-table-column label="发送邀请成员" align="center"> </el-table-column>
          <el-table-column label="创建时间" align="center"> </el-table-column>
          <el-table-column label="已邀请客户" align="center"> </el-table-column>
          <el-table-column label="已入群客户" align="center"> </el-table-column>
          <el-table-column label="未发送成员" align="center"> </el-table-column>
          <el-table-column label="未邀请成员" align="center"> </el-table-column>
          <el-table-column label="操作" align="center" :formatter="formatterColumn"> </el-table-column>
        </el-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ComPagination from '../../../components/common/ComPagination'
export default {
  components: { ComPagination },
  data() {
    return {
      searchForm: {
        name: ''
      },
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      height: 400
    }
  },
  methods: {
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getCustomerPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getCustomerPage()
    },
    //点击查询按钮
    searchLiveCodeList() {},
    //点击重置按钮
    reLiveCodeSearch() {},
    formatterColumn(row) {
      return (
        <div>
          <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
            提醒发送
          </el-button>
          <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
            详情
          </el-button>
        </div>
      )
    },
    // 获取客户列表
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.height =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT
    },
    //打开创建活码
    openAddLiveCode() {
      this.$router.push('/main/scrm/operation-management/labelgroupbuilding/form')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  }
}
</script>
<style lang="scss" scoped>
.addlivecode {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
.query-table-box {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.common-table-box {
  padding: 0 20px;
  box-sizing: border-box;
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
.operating-btn {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 20px;
  margin-bottom: 5px;
}
</style>
