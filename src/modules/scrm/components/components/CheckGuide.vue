<template>
  <!-- 对话框之如何添加新成员 默认点击遮罩不关闭 关闭销毁内容 参考MemberTreeDialog树组件-->
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
          <p class="second">一、什么是企业名片</p>
          <p class="third">
            快速，全面地传递企业、个人、商品信息，展示自己和企业的专业形象。通过企业背书，与客户建立信任关系，把企业里的每个人打造成超级IP；实时记录客户行为，智能提醒员工名片浏览情况和记录客户的动态轨迹，分析客户意向，精准判断客户需求。
          </p>
          <div class="image">
            <el-image
              style="width: 30%;margin-left:10px"
              :src="imgUrlOne"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
            <el-image
              style="width: 30%;margin-left:10px"
              :src="imgUrlTwo"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
            <el-image
              style="width: 30%;margin-left:10px"
              :src="imgUrlThree"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>
          <p class="second">二、使用企业名片工具准备工作</p>
          <p class="third">
            1. 申请一个企业名片小程序 <br />
            2. 小程序添加“企业客户服务”插件 <br />

            在小程序管理后台中请使用插件，添加路径：【设置】>【第三方服务】>【插件管理】>【添加插件】。搜索并添加插件ID：wx104a1a20c3f81ec2
          </p>
          <div class="image">
            <el-image
              style="width: 100%;margin-left:10px"
              :src="imgUrlFour"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>
          <p class="third">
            3. 配置小程序的服务域名，配置路径：【开发】>【开发管理】>【开发设置】>【服务器域名】
          </p>
          <p class="third">
            <span style="color:black; font-weight: 700;">request合法域名：</span><br />
            https://athena-1255600302.cosgz.myqcloud.com;<br />
            https://athena-1255600302.image.myqcloud.com;<br />
            https://thirdwx.qlogo.cn; <br />https://wx.qlogo.cn;<br />
            https://x.wego168.com;<br />
            <span style="color:black; font-weight: 700;">socket合法域名：</span><br />
            wss://x.wego168.com <br />
            <span style="color:black; font-weight: 700;">uploadFile合法域名：</span><br />
            https://athena-1255600302.cosgz.myqcloud.com;<br />
            https://x.wego168.com;<br />
            <span style="color:black; font-weight: 700;">downloadFile合法域名：</span><br />
            https://athena-1255600302.cosgz.myqcloud.com;<br />
            https://athena-1255600302.image.myqcloud.com;<br />
            https://thirdwx.qlogo.cn;<br />
            https://wx.qlogo.cn;<br />
            https://x.wego168.com;
          </p>
          <p class="third">4. 小程序开通微信支付功能</p>
          <div class="image">
            <el-image
              style="width: 100%;margin-left:10px"
              :src="imgUrlFive"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>
          <p class="third">5. 前往小数桔平台关联微信支付</p>
          <p class="third">配置路径：【小蜘蛛】>【平台设置】>【支付配置】>【添加支付目录】</p>
          <div class="image">
            <el-image
              style="width: 100%;margin-left:10px"
              :src="imgUrlSix"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>
          <p class="third">6. 客户微信开发者ID绑定小程序</p>
          <p class="third">
            登陆企业微信配置，进入“客户联系”--“客户”页面，展开api小菜单，点击微信开发者ID的“绑定”操作按钮，使用小程序管理员微信扫码绑定名片小程序
          </p>
          <p
            class="third"
            style="color:red"
          >注：绑定的小程序须是已发布状态的</p>
          <div class="image">
            <el-image
              style="width: 100%;margin-left:10px"
              :src="imgUrlSeven"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>
          <p class="third">7. 小程序关联企业微信</p>
          <p class="third">
            登录企业微信平台，进入“应用管理”--“小程序”页面，点击“+关联小程序”--“开始关联”跳转授权页面，小程序管理员扫描二维码确认授权
          </p>
          <div class="image">
            <el-image
              style="width: 100%;margin-left:10px"
              :src="imgUrlEight"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>
          <p class="second">三、如何配置企业员工名片</p>
          <p class="third">1. 开启成员企业名片</p>
          <p class="third">
            登录小数桔后台，进入【企业名片】菜单，点击【设置成员】按钮，勾选企业成员并确定，成员名片设置完成
          </p>
          <div class="image">
            <el-image
              style="width: 100%;margin-left:10px"
              :src="imgUrlNine"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>
          <p class="third">2. 配置企业官网</p>
          <p class="third">进入【企业名片】菜单，点击【企业信息】-【新建】按钮，进行官网信息填写</p>
          <div class="image">
            <el-image
              style="width: 100%;margin-left:10px"
              :src="imgUrlTen"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>
          <p class="third">3. 配置名片商城</p>
          <p class="third">进入【小蜘蛛】菜单，点击【商品管理】进行商品添加操作</p>
          <div class="image">
            <el-image
              style="width: 100%;margin-left:10px"
              :src="imgUrlEleven"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>
          <p class="second">四、配置企业员工名片入口</p>
          <p class="third">
            管理员需登陆企业微信配置“我的名片”功能入口，方便员工编辑或分享名片。 名片链接：https://x.wego168.com/<span style="color:red">***</span>/scrm/#/card/list（***需更换成指定项目名）
          </p>
          <p class="third">
            配置入口路径1：【客户联系】>【聊天工具】>【聊天工具栏管理】>【配置页面应用】>选择“自建应用>小数桔”配置页面名称和链接
          </p>
          <div class="image">
            <el-image
              style="width: 100%;margin-left:10px"
              :src="imgUrlTwenty"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>
          <div class="image">
            <el-image
              style="width: 100%;margin-left:10px"
              :src="imgUrlThreeteen"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>
          <div class="image">
            <el-image
              style="width: 100%;margin-left:10px"
              :src="imgUrlFourteen"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>
          <p class="third">配置入口路径2：【应用管理】>【应用】>【自建-小数桔】>【自定义菜单】>添加“我的名片”菜单</p>
          <div class="image">
            <el-image
              style="width: 100%;margin-left:10px"
              :src="imgUrlFifthteen"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>
          <p class="second">五、企业员工查看自己的名片</p>
          <p class="third">
            企业成员可通过“工作台>小数桔应用”或通过“聊天页侧边栏”管理或分享自己的名片（Tips：管理员需提前配置名片链接至小数桔应用或聊天页侧边栏）
          </p>
          <p class="third">路径1：工作台>小数桔应用</p>

          <div class="image">
            <el-image
              style="width: 30%;margin-left:10px"
              :src="imgUrlSixteen"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
            <el-image
              style="width: 30%;margin-left:10px"
              :src="imgUrlSeventeen"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
            <el-image
              style="width: 30%;margin-left:10px"
              :src="imgUrlEighteen"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
          </div>

          <p class="third">路径2：通过客户或客户群聊天页侧边栏查看“我的名片”</p>
          <div class="image">
            <el-image
              style="width: 30%;margin-left:10px"
              :src="imgUrlNinteen"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
            <el-image
              style="width: 30%;margin-left:10px"
              :src="imgUrltwolteen"
              :preview-src-list="[
                imgUrlOne,
                imgUrlTwo,
                imgUrlThree,
                imgUrlFour,
                imgUrlFive,
                imgUrlSix,
                imgUrlSeven,
                imgUrlEight,
                imgUrlNine,
                imgUrlTen,
                imgUrlEleven,
                imgUrlTwenty,
                imgUrlThreeteen,
                imgUrlFourteen,
                imgUrlFifthteen,
                imgUrlSixteen,
                imgUrlSeventeen,
                imgUrlEighteen,
                imgUrlNinteen,
                imgUrltwolteen
              ]"
            >
            </el-image>
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
      imgUrlOne: host + 'checkguide_1.png',
      imgUrlTwo: host + 'checkguide_2.png',
      imgUrlThree: host + 'checkguide_3.png',
      imgUrlFour: host + 'checkguide_4.png',
      imgUrlFive: host + 'checkguide_5.png',
      imgUrlSix: host + 'checkguide_6.png',
      imgUrlSeven: host + 'checkguide_7.png',
      imgUrlEight: host + 'checkguide_8.png',
      imgUrlNine: host + 'checkguide_9.png',
      imgUrlTen: host + 'checkguide_10.png',
      imgUrlEleven: host + 'checkguide_11.png',
      imgUrlTwenty: host + 'checkguide_12.png',
      imgUrlThreeteen: host + 'checkguide_13.png',
      imgUrlFourteen: host + 'checkguide_14.png',
      imgUrlFifthteen: host + 'checkguide_15.png',
      imgUrlSixteen: host + 'checkguide_16.png',
      imgUrlSeventeen: host + 'checkguide_17.png',
      imgUrlEighteen: host + 'checkguide_18.png',
      imgUrlNinteen: host + 'checkguide_19.png',
      imgUrltwolteen: host + 'checkguide_20.png'
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
