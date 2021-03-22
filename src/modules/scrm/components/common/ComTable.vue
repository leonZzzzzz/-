<template>
  <div class="common-table">
    <el-table
      id="table"
      :data="tableData"
      v-loading="loading"
      element-loading-text="加载中"
      style="width: 100%"
      :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
      :height="isFull ? fullHeight : height"
    >
      <el-table-column v-for="(item, index) in column" :key="index" :align="item.align || 'left'" v-bind="item">
      </el-table-column>
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
    column: {
      type: Array,
      default: () => {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
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
        return 300
      }
    }
  },
  data() {
    return {
      fullHeight: 300
    }
  },
  mounted() {
    console.log(this.isFull, this.height)
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
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table {
  background: transparent;
}
::v-deep .el-table__body {
  background: transparent;
  border-collapse: separate;
  border-spacing: 0 12px;
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
::v-deep .el-table__body tr {
  border-radius: 10px;
  background: #fff;
}
</style>
