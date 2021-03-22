<template>
  <el-dialog
    :title="config.title"
    :visible="config.visible"
    :width="config.width"
    top="10vh"
    :close-on-click-modal="false"
    append-to-body
    @close="closeDialog"
  >
    <slot></slot>
  </el-dialog>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="scss" scoped>
// ::v-deep .el-dialog {
//   border-radius: 6px;
// }
// ::v-deep .el-dialog__header {
//   padding: 15px 20px;
// }
// ::v-deep .el-dialog__title {
//   font-size: 16px;
//   font-weight: bold;
// }
// ::v-deep .el-dialog__headerbtn {
//   top: 15px;
//   .el-dialog__close {
//     font-size: 20px;
//     font-weight: bold;
//     color: #333;
//   }
// }
// ::v-deep .el-dialog__body {
//   padding: 20px;
//   padding-top: 0;
// }
::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
</style>
