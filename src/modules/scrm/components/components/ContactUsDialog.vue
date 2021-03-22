<template>
  <!-- 联系客服弹窗 -->
  <div>
    <el-dialog
      title="联系客服"
      :visible="visible"
      width="600px"
      top="100px"
      :modal-append-to-body="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="closeDialog"
    >
      <div class="contact-content">
        <el-image
          style="width: 300px"
          :src="imgHost + '/attachments/scrm/92b9e8b18bea437298043e95bf7ccd17.png'"
        >
        </el-image>
        <p>扫一扫上方二维码，添加客服微信</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeDialog')
    },
  }
}
</script>

<style lang="scss" scoped>
.contact-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  p {
    margin-top: 20px;
  }
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