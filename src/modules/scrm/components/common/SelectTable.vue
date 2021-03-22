<template>
  <div class="select-table">
    <el-table
      ref="selectTable"
      id="table"
      :data="tableData"
      v-loading="loading"
      element-loading-text="加载中"
      style="width: 100%"
      :height="isFull ? fullHeight : height"
      highlight-current-row
      :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
      @current-change="handleCurrentChange"
    >
      <el-table-column v-for="(item, index) in column" :key="index" v-bind="item"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    column: {
      type: Array,
      default: () => {
        return []
      }
    },
    currentRow: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isFull: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    height: {
      type: Number,
      default: () => {
        return 400
      }
    }
  },
  data() {
    return {
      fullHeight: 400
    }
  },
  watch: {
    currentRow(newVal) {
      this.$refs.selectTable.setCurrentRow(newVal)
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isFull) {
        this.fullTableHeight()
        window.onresize = () => {
          this.fullTableHeight()
        }
      }
    })
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
      this.fullHeight =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT
    },
    handleCurrentChange(row) {
      this.$emit('handleCurrentChange', row)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table th {
  color: #303133;
  background-color: rgb(223, 234, 241);
}
::v-deep .el-table__body tr {
  cursor: pointer;
}
::v-deep .el-table__body tr.current-row > td {
  background-color: #294a7b !important;
  color: #fff;
}
::v-deep .el-table--enable-row-transition .el-table__body td {
  padding: 15px 0;
}
</style>
