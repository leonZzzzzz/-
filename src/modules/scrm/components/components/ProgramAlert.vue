<template>
  <div>
    <el-alert type="warning" :closable="false" class="alert">
      <template>
        <div class="alert-content">
          <div class="cont-left">
            <p>
              在企业微信里发送小程序（必须在微信公众平台通过审核和发布的），请先将其关联到企业微信（<el-button
                type="text"
                @click="openHowLink()"
                >如何关联</el-button
              >）,再到本系统添加该小程序，否则发送失败，客户接收不到
            </p>
            <p>
              如果没有微信小程序，请前往微信小程序进行注册。<el-button type="text" @click="openNowGo"
                >立即前往</el-button
              >
            </p>
          </div>
        </div>
      </template>
    </el-alert>
    <program-how
      :configure="configureWhatToAdd"
      @closeDialog="closeWhatToAdd"
      @success="successWhatToAdd"
    ></program-how>
  </div>
</template>
<script>
import ProgramHow from './ProgramHow'
export default {
  components: { ProgramHow },
  data() {
    return {
      configureWhatToAdd: {
        // 如何添加新成员
        title: '如何关联',
        visible: false
      }
    }
  },
  methods: {
    //关联窗口关闭
    closeWhatToAdd() {
      this.configureWhatToAdd.visible = false
    },
    //关联窗口确认
    successWhatToAdd() {
      this.configureWhatToAdd.visible = false
    },
    //点击如何关联按钮
    openHowLink() {
      this.configureWhatToAdd.visible = true
    },
    // 点击立即前往按钮
    openNowGo() {
      window.open('https://mp.weixin.qq.com/cgi-bin/registermidpage?action=index&lang=zh_CN&token=')
    }
  }
}
</script>
<style lang="scss" scoped>
.alert-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
</style>
