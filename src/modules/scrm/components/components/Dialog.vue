<template>
  <!-- 对话框 默认点击遮罩不关闭 关闭销毁内容 xfo-->
  <!-- 
    <Dialog :configure="configure" height="300px" @closeDialog="closeDialog" @success="success"></Dialog>
    configure : {
      title: '对话框',  // 标题
      visible: false,   // 开关
      width: '600px',   // 宽度
      top: '15vh',      // 顶部距离
      closeOnClickModal: false,  // 点击遮罩是否关闭
      destroyOnClose: true   // 关闭是否销毁内容
    }
    closeDialog()  // 关闭对话框方法
    success()  // 确认提交方法
 -->
  <div>
    <el-dialog
      :title="configure.title"
      :visible.sync="configure.visible"
      :width="configure.width"
      :top="configure.top"
      :modal-append-to-body="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="closeDialog"
    >
      <div class="main" :style="`height:${height}`">
        <slot></slot>
      </div>
      <div class="footer_btns">
        <el-button plain @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="success">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const config = {
  title: '对话框',
  visible: false,
  width: '600px',
  top: '15vh'
}
export default {
  props: {
    configure: {
      type: Object,
      default: () => {
        return config
      }
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeDialog')
    },
    success() {
      this.$emit('success')
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  overflow-y: auto;
  padding-right: 10px;
}
.footer_btns {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
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
