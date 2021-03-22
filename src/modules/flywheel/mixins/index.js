import Vue from 'vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
import customComponents from '../components/index'

export default {
  created() {
    this.initComponent()
  },
  data() {
    return {
      userVersion: '',
      userDesc: ''
    }
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
        const { name, title, options, config, disabled, max } = component
        return { name, title, options, config, disabled, max }
      })
      this.initComponentList(componentList)
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
    }
  }
}
