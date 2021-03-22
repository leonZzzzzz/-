<template>
  <div class="tree-table">
    <el-table
      :data="tableData"
      style="width: 100%"
      :height="height"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'childs' }"
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
    column: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      height: 400
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-table {
  width: 100%;
}
::v-deep .categoryDialog-row-popover {
  position: relative;
  display: inline-block;
  box-shadow: 0 0 3px 1px #eee;
  .categoryDialog-row-btns {
    position: absolute;
    right: 0;
    bottom: 0;
    .categoryDialog-row-btn {
      border-bottom: 2px solid #eee;
      &:last-child {
        border-bottom-color: transparent;
      }
    }
  }
}
</style>
