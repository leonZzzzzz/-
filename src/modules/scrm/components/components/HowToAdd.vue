<template>
  <!-- 对话框之如何添加对外展示信息 默认点击遮罩不关闭 关闭销毁内容-->
  <!-- 
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
      width="800px"
      top="100px"
      :modal-append-to-body="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="closeDialog"
    >
      <div
        class="main"
        style="height: 600px"
      >
        <div class="guidePage">
          <p class="third">成员的对外信息展示，如何添加？</p>
          <p class="third">
            1. 进入企业微信 ，找到【我的企业】-【通讯录管理】-【成员资料显示】-【对外资料显示】下的【修改】
          </p>
          <div class="image">
            <el-image
              style="width: 100%"
              :src="imgUrlOne"
              :preview-src-list="[imgUrlOne, imgUrlTwo]"
            > </el-image>
          </div>
          <p class="third">2. 打开修改界面，点击【 + 添加自定义信息】，或点击已创建的自定义信息进行修改或删除</p>
          <div class="image">
            <el-image
              style="width: 100%"
              :src="imgUrlTwo"
              :preview-src-list="[imgUrlOne, imgUrlTwo]"
            > </el-image>
          </div>
        </div>
      </div>
      <div class="footer_btns">
        <el-button
          plain
          @click="closeDialog"
        >取消</el-button>
        <el-button
          type="primary"
          @click="success"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const config = {
  title: '对话框',
  visible: false,
  width: '1000',
  top: '15vh'
}
export default {
  props: {
    configure: {
      type: Object,
      default: () => {
        return config
      }
    }
  },
  data() {
    let host = this.imgHost + '/public/pc-guide/'
    return {
      imgUrlOne: host + 'how_a.png',
      imgUrlTwo: host + 'how_b.png'
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
  .guidePage {
    background-color: #ffffff;
    padding: 0 20px;
    color: #606266;
    .first {
      font-size: 18px;
      font-weight: bold;
      line-height: 2em;
    }
    .second {
      font-size: 16px;
      font-weight: bold;
      line-height: 2em;
    }
    .third {
      font-size: 14px;
      // font-weight: bold;
      line-height: 2em;
    }
    .content {
      font-size: 14px;
      text-indent: 2em;
      line-height: 1.5em;
    }
    .image {
      padding: 20px 0;
    }
  }
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
