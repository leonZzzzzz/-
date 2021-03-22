<template>
  <!-- 表格分页 xfo-->
  <!-- 
    使用方式
    1. 引入组件 
    示例：
    import TablePage from '../../../components/components/TablePage.vue'
    2. 使用组件
    示例：
    <TablePage :page="pageData" @sizeChange="onSizeChange" @pageChange="onPageChange"></TablePage>
    // 分页数据
    pageData: {
      pageNum: 1,
      pageSize: 15,
      total: 0
    },
    // 分页函数
    onSizeChange(val) {
      this.pageData.pageSize = val
      this.pageData.pageNum = 1
    },
    onPageChange(val) {
      this.pageData.pageNum = val
    },
 -->

  <div class="pagination">
    <div class="pagination-count">
      <span class="count">共：{{ page.total }}&nbsp;条数据</span>
    </div>
    <el-pagination
      @size-change="onSizeChange"
      @current-change="onPageChange"
      :page-sizes="[15, 30, 50]"
      :page-size="page.pageSize"
      :current-page="page.pageNum"
      :total="page.total"
      layout="prev, pager, next, sizes"
      background
      style="margin-right: -26px"
    >
    </el-pagination>
  </div>
</template>
<script>
const page = {
  pageNum: 1,
  pageSize: 15,
  total: 0
}
export default {
  props: {
    page: {
      type: Object,
      default: () => {
        return page
      }
    }
  },
  methods: {
    onSizeChange(val) {
      this.$emit('sizeChange', val)
    },
    onPageChange(val) {
      this.$emit('pageChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  &-count {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #7b7b7b;
    .count {
      margin-right: 20px;
    }
  }
}
</style>
