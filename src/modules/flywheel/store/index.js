import { Message } from 'element-ui'
import { template } from '../utils/template'
import color from 'css-color-function'

const state = {
  // 主题色
  primaryColor: '#294a7b',
  window: {
    config: [
      {
        formName: 'navigationBarBackgroundColor',
        value: '#294A7B',
        type: 'el-color-picker',
        label: '主题色'
      },
      {
        formName: 'navigationBarTextStyle',
        value: 'white',
        type: 'el-radio-group',
        label: '标题颜色',
        options: [
          { label: '白色', value: 'white' },
          { label: '黑色', value: 'black' }
        ]
      },
      {
        formName: 'backgroundColor',
        value: '#f2f2f2',
        type: 'el-color-picker',
        label: '窗口背景色'
      },
      {
        formName: 'backgroundTextStyle',
        value: 'light',
        type: 'el-radio-group',
        label: '加载颜色',
        options: [
          { label: '亮色', value: 'light' },
          { label: '暗色', value: 'dark' }
        ]
      },
      {
        formName: 'navigationBarTitleText',
        value: '',
        type: 'el-input',
        label: '标题文字',
      },
    ],
    options: {
      navigationBarBackgroundColor: '#294A7B',
      navigationBarTextStyle: 'white',
      navigationBarTitleText: '',
      backgroundColor: '#294A7B',
      backgroundTextStyle: 'dark'
    }
  },
  tabbar: {
    config: [
      {
        formName: 'color',
        value: '#000',
        type: 'el-color-picker',
        label: '未选中颜色'
      },
      {
        formName: 'selectedColor',
        value: '#294A7B',
        type: 'el-color-picker',
        label: '选中颜色'
      },
      {
        formName: 'backgroundColor',
        value: '#fff',
        type: 'el-color-picker',
        label: '背景色'
      },
      {
        formName: 'borderStyle',
        value: 'white',
        type: 'el-radio-group',
        options: [
          { label: '白色', value: 'white' },
          { label: '黑色', value: 'black' }
        ],
        label: '边框样式'
      }
    ],
    options: {
      color: '#000',
      selectedColor: '#294A7B',
      backgroundColor: '#fff',
      borderStyle: 'white'
    }
  },
  // 配置页面列表
  configPageList: [],
  // 需要显示的页面列表
  pageList: [],
  // 选中页面的数据
  currentPageId: '',
  // 所有组件列表`
  componentList: [],
  // 模拟器里面的数据
  simulatorComponent: [],
  // 选中模拟器中的组件的数据
  currentComponent: {},
  // 生成基本模版
  template,
  personalMall: '0'
}

const getters = {
  // 选中页面的数据
  currentPage: state => {
    return (
      state.pageList.find(item => {
        return item.id == state.currentPageId
      }) || {}
    )
  },
  // 主题色变化后生成的附加色
  theme: state => {
    const themeColor = state.window.options.navigationBarBackgroundColor
    let colors = { color1: themeColor }
    for (let index = 1; index <= 4; index++) {
      colors[`color${index + 1}`] = color.convert(`color(${themeColor} tint(${index * 2}0%))`)
    }
    return colors
  }
}

const mutations = {
  /**
   * 初始化所有组件
   */
  initComponentList(state, data) {
    state.componentList = data
  },
  /**
   * 更新window/tabbar 的数据
   * @param {object} state
   * @param {object} data type, data {类型，数据}
   */
  updateSideConfig(state, data) {
    state[data.type] = data.data
  },
  /**
   * 更新Simulator中的组件
   * @param {state} state state的数据
   * @param {array} componentList 组件数组
   */
  updateComponentToSimulator(state, componentList) {
    state.simulatorComponent = componentList
  },
  /**
   *
   * 更新当前模拟器选中的组件
   * 当组件被从新编辑后，需要从新渲染到模拟器中。
   * @param {state} state state的数据
   * @param {object} component 组件数据
   */
  updateCurrentComponent(state, component) {
    state.currentComponent = component
    state.simulatorComponent.forEach((item, index) => {
      if (item.id == component.id) {
        state.simulatorComponent[index] = component
      }
    })
  },
  /**
   * 更新页面列表
   * @param {*} state
   * @param {*} pageList
   */
  updateConfigPageList(state, pageList) {
    state.configPageList = pageList
  },
  /**
   * 更新需要显示的页面列表
   * @param {*} state
   * @param {*} pageList
   */
  updatePageList(state, pageList) {
    if (pageList.length <= 5) {
      state.pageList = pageList
    } else {
      Message.info('tabbar最多只显示5个页面')
    }
  },
  /**
   * 更新当前选中的页面
   * @param {string} pageId 页面的id
   */
  updateCurrentPageId(state, pageId) {
    state.currentPageId = pageId
    state.currentComponent = {}
  },
  /**
   * 个人中心是否启用商城功能
   * @param {*} state
   * @param {*} data
   */
  updatePersonalModel(state, data) {
    state.personalMall = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
