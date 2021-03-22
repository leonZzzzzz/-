<template>
  <!-- 对话框之如何添加新成员 默认点击遮罩不关闭 关闭销毁内容 参考MemberTreeDialog树组件 xfo-->
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
      <div class="main" style="height: 600px">
        <div class="guidePage">
          <p class="third">
            在企业微信里发送小程序，均须先将其关联到企业微信，否则发送失败，客户接收不到。
            关联的小程序必须在微信公众平台通过审核和发布的
          </p>
          <p>&nbsp;</p>
          <p class="third">1.登录企业微信平台，进入“应用管理”--“应用”页面，点击“+创建应用· 支持小程序”</p>
          <div class="image">
            <el-image style="width: 100%" :src="imgUrlOne" :preview-src-list="[imgUrlOne, imgUrlTwo, imgUrlThree]">
            </el-image>
          </div>
          <p class="third">2.在“创建应用”页面，点击“已有小程序快速创建”跳转授权页面，小程序管理员扫描二维码确认授权</p>
          <div class="image">
            <el-image style="width: 100%" :src="imgUrlTwo" :preview-src-list="[imgUrlOne, imgUrlTwo, imgUrlThree]">
            </el-image>
          </div>
          <p class="third">3.确认授权成功后，点击“添加部门/成员”设置小程序可见范围，并点击“创建应用”，小程序关联成功</p>
          <div class="image">
            <el-image style="width: 100%" :src="imgUrlThree" :preview-src-list="[imgUrlOne, imgUrlTwo, imgUrlThree]">
            </el-image>
          </div>
        </div>
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
    let host = this.imgHost
    return {
      imgUrlOne: host + '/attachments/scrm/448553aa5cf4444297b5046914ed4b08.png',
      imgUrlTwo: host + '/attachments/scrm/6fbea9f1bcc04f439bdcef4289a16b2b.png',
      imgUrlThree: host + '/attachments/scrm/8774e7e30a0f48c392ffbf088014a1d4.png'
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
