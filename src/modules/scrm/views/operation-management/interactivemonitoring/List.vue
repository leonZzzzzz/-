<template>
  <div class="interactive-monitoring">
    <div class="container">
      <div class="query-table-box">
        <el-form inline :model="searchForm" label-width="100px" label-position="right" size="small">
          <el-form-item label="链接标题">
            <el-input placeholder="请输入链接标题" v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="searchList">查询</el-button>
            <el-button size="small" type="info" @click="reSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="operating-btn">
        <el-button size="small" type="primary" @click="openAddInteractive">添加互动监测</el-button>
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
          <el-table-column label="标题链接" prop="name" align="center"> </el-table-column>
          <el-table-column label="监测链接" prop="createTime" align="center"> </el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center"> </el-table-column>
          <el-table-column label="总点击次数" prop="createTime" align="center"> </el-table-column>
          <el-table-column label="总点击人数" prop="createTime" align="center"> </el-table-column>
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
      tableData: [{ name: '1' }],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      height: 400
    }
  },
  methods: {
    //点击添加互动监测按钮
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
    openAddInteractive() {
      this.$router.push('/main/scrm/operation-management/interactivemonitoring/form')
    },
    //点击详情按钮
    getInteractive() {},
    showEditDialog() {
      this.$router.push('/main/scrm/operation-management/interactivemonitoring/detail')
    },
    formatterColumn(row) {
      return (
        <div>
          <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
            详情
          </el-button>
        </div>
      )
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getFriendsPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getFriendsPage()
    },
    searchList() {},
    reSearch() {}
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.interactive-monitoring {
  width: 100%;
  height: 100%;
  position: relative;
  .container {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .query-table-box {
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    .operating-btn {
      display: flex;
      flex-direction: row-reverse;
      margin-right: 20px;
      margin-bottom: 5px;
    }
  }
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
</style>
