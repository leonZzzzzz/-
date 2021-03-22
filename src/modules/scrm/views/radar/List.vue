<template>
  <div class="radar-list">
    <div class="query-table-box">
      <el-button size="small" type="primary" @click="addRadar">新建雷达链接</el-button>
      <div class="search-content">
        <el-form label-width="100px" label-position="right" size="small">
          <el-form-item label="链接标题">
            <el-input placeholder="请输入链接标题" v-model="searchForm.title" @input="searchRadars"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="commom-table-box">
      <el-table
        :data="tableData"
        width="100%"
        id="table"
        :height="tableHeight"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="标题" prop="title" align="left">
          <template slot-scope="scope">
            <el-tag :type="scope.row.type | rowContentFilters" size="mini" style="margin-right: 10px">{{
              scope.row.type | typeFilters
            }}</el-tag>
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="链接" prop="link" align="center"></el-table-column> -->
        <el-table-column label="客户标签" align="center" width="300px">
          <template slot-scope="scope">
            <!-- <div class="tag-list">
              <span v-for="(item, index) in scope.row.behaviorTagList" :key="index">{{item.name}}</span>
            </div> -->
            <!-- <el-tag v-for="(item, index) in scope.row.behaviorTagList" :key="index" style="margin: 5px" effect="plain">
              {{ item.name }}
            </el-tag> -->
            <Tag
              type="light"
              icon="el-icon-price-tag"
              v-for="(item, index) in scope.row.behaviorTagList"
              :key="index"
              >{{ item.name }}</Tag
            >
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.createTime | formatterTime }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="类型" prop="type" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.type | radarType }}</div>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="getRadarDetail(scope.row.id)">详情</el-button>
            <el-button type="text" @click="editRadar(scope.row.id)">修改</el-button>
            <el-button type="text" @click="deleteRadar(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="common-pagination">
      <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
    </div>
  </div>
</template>

<script>
import ComTable from '../../components/common/ComTable'
import ComPagination from '../../components/common/ComPagination'
import Tag from '../../components/components/Tag'
import Template from '@/modules/flywheel/views/third-party/template/Template.vue'
export default {
  components: { ComTable, ComPagination, Tag },
  data() {
    return {
      tableData: [],
      tableHeight: 400,
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      searchForm: {
        title: ''
      }
    }
  },
  filters: {
    radarType(val) {
      switch (val) {
        case 'link':
          return '链接'
        case 'file':
          return '文件'
      }
    },
    formatterTime(time) {
      return time.slice(0, time.length - 3)
    },
    typeFilters(option) {
      if (option == 'link') {
        return '链接'
      }
      if (option == 'file') {
        return '文件'
      }
    },
    rowContentFilters(option) {
      if (option == 'link') {
        return 'warning'
      }
      if (option == 'file') {
        return 'success'
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  },
  created() {
    this.getRadarList()
  },
  destroyed() {
    window.onresize = ''
  },
  methods: {
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.tableHeight =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT -
        30
    },
    // 获取雷达列表
    getRadarList() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        title: this.searchForm.title
      }
      this.$http.getInteractRadarPage(params).then((res) => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getRadarList()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getRadarList()
    },
    addRadar() {
      this.$openNewPage({path: `/main/scrm/radar/form`})
    },
    getRadarDetail(id) {
      this.$openNewPage({path: `/main/scrm/radar/detail?id=${id}`})
    },
    editRadar(id) {
      this.$openNewPage({path: `/main/scrm/radar/form?id=${id}`})
    },
    deleteRadar(id) {
      this.$confirm('是否删除该雷达', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteInteractRadar({ id }).then(() => {
          this.$message.success('删除成功')
          this.getRadarList()
        })
      })
    },
    searchRadars() {
      this.page.pageNum = 1
      this.getRadarList()
    }
  }
}
</script>

<style lang="scss" scoped>
.radar-list {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
}
.query-table-box {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
  .search-content {
    display: flex;
    align-items: center;
  }
}
.commom-table-box {
  padding: 0 20px;
  .tag-list {
    span {
      display: inline-block;
      border: 1px solid #dcdfe6;
      padding: 2px 5px;
      margin: 0 8px 7px 0;
      border-radius: 3px;
    }
  }
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
</style>
