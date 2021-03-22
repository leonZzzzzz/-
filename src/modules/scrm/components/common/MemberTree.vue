<template>
  <div>
    <el-tree
      :data="data"
      :props="defaultProps"
      :show-checkbox="showCheckbox"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script>
export default {
  props: {
    // 树数据
    data: {
      type: Array,
      default: () => []
    },
    // key值选中节点
    nodeKey: {
      type: String,
      default: ''
    },
    // 是否可选择
    showCheckbox: {
      type: Boolean,
      default: false
    },
    // 配置
    defaultProps: {
      children: { default: 'children', type: String },
      label: { default: 'label', type: String },
      disabled: { default: false, type: Boolean }
    }
  },
  data() {
    return {}
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped></style>
