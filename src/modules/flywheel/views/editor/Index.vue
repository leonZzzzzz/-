<template>
  <div>
    <div class="mall-menu">
      <div class="flex">
        <el-button
          size="mini"
          icon="el-icon-arrow-left"
          @click="$router.back()"
        >返回</el-button>
      </div>
      <div class="name">页面编辑器</div>
      <div class="flex save">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-check"
          @click="onDialogShow()"
        >保存</el-button>
      </div>
    </div>
    <div class="mall-editor">
      <Side />
      <Simulator />
      <Configure />
    </div>
    <el-dialog
      :visible="visible"
      append-to-body
      title="信息简介"
      :show-close="false"
      width="450px"
    >
      <el-form
        ref="extModel"
        :model="extModel"
        label-position="right"
        label-width="80px"
      >
        <el-form-item
          label="版本号"
          prop="userVersion"
          :rules="[{ required: true, message: '请填写版本号' }]"
        >
          <el-input
            v-model="extModel.userVersion"
            placeholder="例：1.0.0"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="版本简介"
          prop="userDesc"
          :rules="[{ required: true, message: '请填写版本简介' }]"
        >
          <el-input
            type="textarea"
            v-model="extModel.userDesc"
            placeholder="简介该版本的功能"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onClose()">关闭</el-button>
        <el-button
          @click="onSubmit()"
          type="primary"
          :loading="uploadLoading"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/modules/flywheel/mixins'
import Side from './Side'
import Simulator from './Simulator'
import Configure from './Configure'
import { uuid } from '../../utils/tools'
import _ from 'lodash'

import axios from 'axios'
import { BASEURL, PluginApi } from '@/utils/config'
const _http = axios.create({
  baseURL: BASEURL,
  timeout: 60000
})
_http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' //配置请求头
// 插件文档 https://www.npmjs.com/package/pinyin
const pinyin = require('pinyin')

export default {
  mixins: [mixins],
  components: {
    Side,
    Simulator,
    Configure
  },
  data() {
    return {
      qrcode: '',
      uploadLoading: false,
      visible: false,
      navigateToMiniProgramAppIdList: [],
      extModel: {
        userVersion: this.$route.query.userVersion,
        userDesc: this.$route.query.userDesc
      }
    }
  },
  created() {
    this.addWeapp()
  },
  methods: {
    addWeapp() {
      this.$http.miniAppPage({ pageSize: 10 }).then(res => {
        this.navigateToMiniProgramAppIdList = res.data.data.list.map(item => item.wxAppId)
      })
    },
    // 生成项目
    async createProject(userVersion, userDesc) {
      // 是否存在ID，不存在创建新的，存在继续使用这个id对应接口的layoutId
      const id = this.$route.query.id || uuid()
      let templates = [],
        pages = [], // 使用到的pages集合
        tabbar = _.cloneDeep(this.tabbar.options), // 小程序的tabbar设置项
        window = _.cloneDeep(this.window.options), // 小程序的window 设置项
        extPages = {}, // ext 中每个页面的一些配置项
        extConfigTabbar = [], // ext.config.tabbar 到时候会替换小程序的tabbar 的图片，文字
        extConfigPages = [], // ext.config.pages 页面自定义的一些配置项
        plugins = {}

      tabbar.list = []
      let customPageIndex = 0
      // 这是tabbar的配置
      this.pageList.forEach((page, index) => {
        // 如果该页面显示，将执行四件事
        /**
         * isShow控制是否显示为在tabbar
         * isJoinPages控制是否加入到pages中
         * 注意：只要isShow为true 那isJoinPages必须为true, 相反isJoinPages为true而isShow不一定为true
         **/
        if (page.isShow || page.isJoinPages) {
          let newPage = _.cloneDeep(page)
          let { navigationBarTitleText, enablePullDownRefresh } = newPage
          let _tabbarItem = {}
          // 1、把每个显示的页面路径放在pages 里面
          if (!pages.includes(newPage.pagePath)) {
            if (!newPage.isSystem) {
              ++customPageIndex
              newPage.pagePath = 'pages/custom/tabbar' + customPageIndex
              pages.push(newPage.pagePath)
              // 2、获取每个页面的自己的config
              extPages[newPage.pagePath] = {
                navigationBarTitleText,
                enablePullDownRefresh
              }
              // 自定义导航栏字段 暂时只给自定义页面添加
              // 只有开启自定义导航栏的时候才将该字段放入模板中，否则不要处理，避免覆盖到小程序端的配置
              if (page.isCustomNavigation) {
                extPages[newPage.pagePath].navigationStyle = 'custom'
              }
            } else {
              extPages[newPage.pagePath] = {
                navigationBarTitleText
              }
              pages.push(newPage.pagePath)
            }
          }
          // 注意只将显示的页面放入tabbar，没显示的页面只放入pages不需要放入tabbar
          if (page.isShow) {
            _tabbarItem = {
              index,
              text: newPage.text
            }
            newPage.pagePath && (_tabbarItem.pagePath = newPage.pagePath) // pagePath在设置tababr时没用,但有时需要判断有哪些tabbar页面
            newPage.iconPath && (_tabbarItem.iconPath = this.imgHost + newPage.iconPath)
            newPage.selectedIconPath && (_tabbarItem.selectedIconPath = this.imgHost + newPage.selectedIconPath)
            extConfigTabbar.push(_tabbarItem)
            // 3、因为小程序模版不会存在新上传的icon，所有只需要text，和pagePath
            // 4、把显示的页面添加到导航栏的配置里面
            const { text, pagePath } = newPage
            tabbar.list.push({ text, pagePath })
          }
        }
        // 如果不是系统创建的页面，则需要把当前页面所用到的组件查询出来
        if (!page.isSystem) {
          const components = this.simulatorComponent
            .filter(comp => {
              return page.id == comp.pageId
            })
            .map(item => {
              return { name: item.name, options: item.options }
            })
          templates.push({
            file: page.id,
            components
          })
          let extConfigPageItem = {
            layoutAppId: id,
            fileId: page.id,
            background: page.background,
            filledBlock: {
              isHeaderColor: page.isHeaderColor,
              height: page.height * 2,
              themeColor: this.theme.color1
            }
          }
          // 只有开启自定义导航栏的时候才将该字段放入模板中，否则不要处理。避免覆盖到小程序端的配置
          if (page.isCustomNavigation) {
            extConfigPageItem.navigationStyle = 'custom'
          }
          extConfigPages.push(extConfigPageItem)
        }
      })
      const theme = {
        '--color-primary': this.theme.color1,
        '--color-primary2': this.theme.color5,
        '--color-primary4': this.theme.color4,
        '--color-primary6': this.theme.color3,
        '--color-primary8': this.theme.color2
      }
      try {
        this.uploadLoading = true
        const data = await this.$http.getWxAppConfig().then(res => {
          return res.data.data
        })

        if (data.cosHost && !data.cosHost.includes('https')) {
          this.$alert('图片域名(cosHost和IMG_HOST)应该使用https，请修改域名配置，否则小程序端无法生成海报', '温馨提示', {
            confirmButtonText: '确定',
          })
          this.uploadLoading = false
          return 
        }

        // 以小程序名作为小程序标题
        if (data && data.projectName) {
          window.navigationBarTitleText = data.projectName
        }

        // 处理插件
        plugins = await this.createPlugins(data.wechatAppId, plugins)
        // console.log('ext.json添加的插件==》', plugins)

        const project = {
          templates,
          window: this.window,
          tabbar: this.tabbar,
          configPageList: this.configPageList,
          pages: this.pageList,
          components: this.simulatorComponent
        }

        const extJson = {
          extEnable: true,
          pages,
          window,
          tabBar: tabbar,
          extPages,
          extAppid: data.wechatAppId,
          plugins,
          navigateToMiniProgramAppIdList: this.navigateToMiniProgramAppIdList,
          ext: {
            tabbar: extConfigTabbar,
            theme,
            pageConfig: extConfigPages,
            config: {
              HOME_PATH: '/' + pages[0],
              baseUrl: data.projectApi + '/',
              IMG_HOST: data.cosHost,
              appId: data.wechatAppId
            }
          }
        }
        // 保存数据
        await this.$http.addProject1_2({
          id,
          projectName: data.projectName,
          json: JSON.stringify(project),
          extJson: JSON.stringify(extJson),
          userVersion,
          userDesc,
          status: 10,
          path: pages[0]
        })
        this.onClose()
        this.uploadLoading = false
        this.$confirm('数据已保存', '操作提示', {
          type: 'success',
          center: true,
          confirmButtonText: '返回列表',
          cancelButtonText: '关闭'
        })
          .then(() => {
            this.$router.back()
          })
          .catch(() => {})
      } catch (error) {
        this.uploadLoading = false
        console.log(error)
      }
    },
    /**
     * 处理小程序用到的插件
     * @param {string} wechatAppId 小程序ID
     * @param {object} plugins 小程序插件对象
     * @returns {object} 返回插件对象
     */
    async createPlugins(wechatAppId, plugins = {}) {
      // 此处还需获取该小程序的插件 再提交
      if (wechatAppId) {
        let param = new FormData()
        param.append('appId', wechatAppId)
        param.append(
          'paramJson',
          JSON.stringify({
            action: 'list'
          })
        )
        // 如果接口报错api is unauthorized to component 那就需要小程序重新扫码授权应用
        // 报错的话 ：为了兼容老客户，避免让老客户重新扫码，就直接return 成功了
        try {
          let resPlugin = await _http.post(PluginApi, param, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          if (!resPlugin || resPlugin.data.errcode !== 0) {
            return this.$message.error(!resPlugin || !resPlugin.data.errmsg ? '插件查询失败' : resPlugin.data.errmsg)
          }
          if (resPlugin.data.plugin_list) {
            resPlugin.data.plugin_list.forEach(item => {
              // 将插件中文名称转换为拼音，在 ext.json 中声明插件时用到
              // 也可以不用这么麻烦，直接使用插件ID作为名称，但有多个插件时 可读性不好
              // pluginName为自定义的插件名称
              let pluginName = item.appid
              try {
                // STYLE_NORMAL 不带风格
                // STYLE_TONE2  声调风格2 即拼音声调以数字形式在各个拼音之后，用数字 [0-4] 进行表示。如：pin1 yin1
                pluginName = pinyin(item.nickname, {
                  style: pinyin.STYLE_NORMAL,
                  heteronym: false // 启用多音字模式
                })
              } catch (error) {
                console.log('中文转拼音失败===》', error)
              }
              pluginName = pluginName.join ? pluginName.join('_') : pluginName
              // 微信这个插件管理的接口有点坑，有时不会返回版本号字段，就导致提交不了
              if ((!item.version || item.version == 'undefined') && item.appid === 'wx104a1a20c3f81ec2') {
                item.version = '1.3.1'
              }
              plugins[pluginName] = {
                version: item.version, // 插件的版本号
                provider: item.appid //插件的 APPID
              }
              // console.log(plugins[pluginName])
            })
          }
        } catch (error) {
          console.log('如果接口报错api is unauthorized to component 就需要小程序重新扫码授权应用')
          console.log('必须提交插件，因为小程序代码里使用到了插件，但此处没导入插件，代码就会报错')
          console.log(
            '如果没有在本页面的【插件管理】添加插件，那需要去微信公众平台登录小程序账号添加 企微客服插件(以后可能还有其他插件)，否则代码提交不成功'
          )
          // // // 企微客服插件
          // plugins['qi_ye_ke_hu_fu_wu'] = {
          //   version: '1.3.1',
          //   provider: 'wx104a1a20c3f81ec2'
          // }
          // if (error.data && error.data.message && error.data.message.includes('api is unauthorized to component')) {
          //   await this.$alert('获取插件失败，请重新扫码授权应用；api is unauthorized to component', '提示', {
          //     confirmButtonText: '知道了',
          //     showCancelButton: false,
          //     type: 'warning'
          //   })
          // }
          // return Promise.resolve(plugins)
        }
      }

      if (wechatAppId === 'wx1f09080c8b5c8e3d') {
        // 直播插件
        plugins['live-player-plugin'] = {
          version: '1.0.0', // 填写该直播组件最新版本号，微信开发者工具调试时可获取最新版本号
          provider: 'wx2b03c6e691cd7370' // 必须填该直播组件appid，该示例值即为直播组件appid
        }
      }
      return Promise.resolve(plugins)
    },
    onSubmit() {
      this.$refs.extModel.validate(flag => {
        if (flag) {
          this.createProject(this.extModel.userVersion, this.extModel.userDesc, this.type)
        }
      })
    },

    onDialogShow(type = 'save') {
      this.type = type
      this.visible = true
    },
    onClose() {
      this.extModel = {
        userVersion: this.$route.query.userVersion,
        userDesc: this.$route.query.userDesc
      }
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.mall-menu {
  height: 60px;
  width: 100%;
  padding: 0 20px;
  position: absolute;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 0px 0px 10px #eee;
  .flex {
    width: 375px;
    &.save {
      text-align: right;
    }
  }
  .name {
    text-align: center;
  }
}
.mall-editor {
  width: 100%;
  position: absolute;
  top: 60px;
  bottom: 0;
  background: #eee;
  // filter: blur(4px);
}
</style>
