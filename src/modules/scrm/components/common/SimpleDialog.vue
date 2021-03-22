<template>
  <el-dialog
    :title="config.title"
    :visible="config.visible"
    :width="config.width"
    :close-on-click-modal="false"
    append-to-body
    @close="closeDialog"
  >
    <slot></slot>
    <div slot="footer">
      <div class="group-btn">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
      <!-- <div class="simple-btn" v-else>
        <el-button type="primary" @click="handleConfirm"
          >确定</el-button
        >
      </div> -->
    </div>
  </el-dialog>
</template>

<script>
const dialogConfig = {
  width: '400px', // 宽度
  title: '', // 标题
  position: 'right', // 按钮位置，支持center、right
  visible: false // 是否显示弹窗
}
export default {
  props: {
    config: {
      // 基本配置信息
      type: Object,
      default: () => {
        return {}
      }
    },
    showClose: {
      // 是否显示取消按钮
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeDialog')
    },
    // 确认提交
    handleConfirm() {
      this.$emit('handleConfirm')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  flex-flow: column-reverse;
}
.flex-center {
  display: flex;
  justify-content: flex-end;
}
::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
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
