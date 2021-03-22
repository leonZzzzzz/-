import Vue from 'vue'
import _ from 'lodash'
import { mapState, mapGetters, mapMutations } from 'vuex'
import customComponents from '../components/index'
import { uuid } from '../utils/tools'

export default {
  created() {
    this.initComponent()
  },
  computed: {
    ...mapState('editor', {
      // 选中的页面id
      currentPageId: state => state.currentPageId,
      // 所有组件
      tabbar: state => state.tabbar,
      // 全局导航栏
      window: state => state.window,
      // 所有页面
      configPageList: state => state.configPageList,
      // 显示的页面所有页面
      pageList: state => state.pageList,
      // 所有组件
      componentList: state => state.componentList,
      // 选中模拟器的组件
      currentComponent: state => state.currentComponent,
      // 模拟器的组件
      simulatorComponent: state => state.simulatorComponent
    }),
    ...mapGetters({
      // 选中的页面数据
      currentPage: 'editor/currentPage',
      theme: 'editor/theme'
    })
  },
  methods: {
    ...mapMutations('editor', [
      'initComponentList',
      'updateCurrentPageId',
      'updatePageList',
      'updateComponentToSimulator',
      'updateCurrentComponent'
    ]),
    /**
     * 初始化组件
     */
    initComponent() {
      const componentList = customComponents.map(component => {
        component.options = this.formatComponentOptions(component.config)
        Vue.component(component.name, component)
        const { name, title, options, config } = component
        return { name, title, options, config }
      })
      this.initComponentList(componentList)
    },
    /**
     * 生成项目
     */
    async createProject() {
      const id = this.$route.query.id
      let templates = [],
        pages = [],
        tabbar = _.cloneDeep(this.tabbar.options),
        window = _.cloneDeep(this.window.options),
        config = {},
        images = [],
        appId = id ? id : uuid()

      tabbar.list = []
      this.pageList.forEach((page, index) => {
        // 如果该页面显示，将执行四件事
        if (page.isShow) {
          let newPage = _.cloneDeep(page)
          let { navigationBarTitleText, enablePullDownRefresh } = newPage
          // 1、把每个显示的页面路径放在pages 里面
          if (!pages.includes(newPage.pagePath)) {
            pages.push(newPage.pagePath)
          }
          // 2、获取每个页面的自己的config 属性
          config = {
            navigationBarTitleText,
            enablePullDownRefresh
          }
          // 3、替换tabbar icon 的远程图片
          newPage.iconPath = this.replaceTabbarListIcon(newPage.iconPath, images, index)
          newPage.selectedIconPath = this.replaceTabbarListIcon(newPage.selectedIconPath, images, index, 's')
          // 4、把显示的页面添加到导航栏的配置里面
          tabbar.list.push(newPage)
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
            components,
            code: this.createPageTemplate(
              'Page' + index,
              `config = ${JSON.stringify(config, 0, 2)}`,
              page.id,
              appId,
              page.isHeaderColor,
              page.height * 2,
              this.theme.color1
            )
          })
        }
      })
      const { color1, color2, color3, color4, color5 } = this.theme
      let theme = `
        $color-primary: ${color1};
        $color-primary--2: ${color5};
        $color-primary--4: ${color4};
        $color-primary--6: ${color3};
        $color-primary--8: ${color2};
        `
      let project = {
        app: {
          pages,
          window,
          tabbar
        },
        window: this.window,
        tabbar: this.tabbar,
        configPageList: this.configPageList,
        pages: this.pageList,
        components: this.simulatorComponent,
        templates,
        images,
        theme
      }
      console.log(JSON.stringify(project, null, 2))
      try {
        const data = await this.$http.getWxAppConfig().then(res => {
          return res.data.data
        })
        await this.$http.addProject({
          id: appId,
          json: JSON.stringify(project),
          projectName: data.projectName,
          projectApi: data.projectApi + '/',
          wechatAppId: data.wechatAppId,
          cosHost: data.cosHost,
          homePath: project.pages[0].id
        })
        this.$confirm('项目正在后台进行编译，这可能需要一点时间。完成编译后可在列表中下载。', '编译提示', {
          confirmButtonText: '确定',
          showCancelButton: true,
          type: 'success',
          center: true
        }).then(() => {
          this.$router.back()
        })
      } catch (error) {}
    },
    /**
     * 格式化样式，将组件的配置项 转化成 props 给组件使用
     * @param {object} config 组件中config的配置项
     */
    formatComponentOptions(config) {
      let options = {}
      config.forEach(item => {
        options[item.formName] = item.value
      })
      return options
    },
    /**
     * 生成的每一个模版文件
     * @param {string} fileName 文件名
     * @param {string} pageId 页面id
     */
    createPageTemplate() {
      let template = this.$store.state.editor.template
      let map = template.match(/(\{\{{1})([\w_]+)(\}\}{1})/gm)
      map.forEach((reg, index) => {
        template = template.replace(new RegExp(reg, 'g'), arguments[index])
      })
      return template
    },
    /**
     * 替换tabbar.list 的icon目录，加远程图片替换成本地图片
     * @param {string} iconPath 原地址
     * @param {Array} images 存放要下载图片的数组
     * @param {number} index 下标，用于拼接新地址文件名
     * @param {string} isSelect 用于拼接新地址文件名，是选中的还是未选中的
     */
    replaceTabbarListIcon(iconPath, images, index, isSelect = '') {
      if (iconPath) {
        const suffix = iconPath.substring(iconPath.lastIndexOf('.') + 1)
        images.push({
          name: `t${index}${isSelect}.${suffix}`,
          url: this.imgHost + iconPath
        })
        return `./images/tabbar/t${index}${isSelect}.${suffix}`
      } else {
        return null
      }
    }
  }
}
