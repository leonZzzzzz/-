import {
  uuid
} from './tools'

/**
 * 创建表单列表
 * @param {string} formName 字段名
 * @param {string} type 类型
 * @param {string} label 标题
 * @param {any} value 默认值
 * @param {Array} options 选项
 */
function createFormItem(formName, value, label, type, options) {
  validateType(type, options)
  let model = {}
  for (let i = 0; i < arguments.length; i++) {
    if (arguments[i]) {
      let keys = {
        0: 'formName',
        1: 'value',
        2: 'label',
        3: 'type',
        4: 'options'
      } [i]
      model[keys] = arguments[i]
    }
  }
  return model
}

function validateType(type = '', options) {
  const count = [
    '',
    'el-input',
    'el-color-picker',
    'el-switch',
    'el-select',
    'qc-image-upload',
    'el-input-number'
  ].indexOf(type)
  if (count === -1) {
    throw '请传入有效的类型'
  } else if (type === 'el-select' && options.length <= 0) {
    throw '但类型为slelct时候，请提供options选项'
  } else {
    return true
  }
}

/**
 * isShow控制是否显示为在tabbar
 * isJoinPages控制是否加入到pages中
 * 注意：只要isShow为true 那isJoinPages必须为true, 相反isJoinPages为true而isShow不一定为true
 **/
export default function createPage({
  id = uuid(),
  isShow = true,
  isJoinPages = false,
  isCustomNavigation = false,
  text = '新页面',
  iconPath = null,
  selectedIconPath = null,
  pagePath = null,
  navigationBarTitleText = '新页面',
  enablePullDownRefresh = false,
  isSystem = false,
  pageImg = null
}) {
  let config = null
  pagePath ? pagePath : (pagePath = `pages/custom/${id}/index`)
  if (isSystem) {
    config = [
      createFormItem('id', id),
      createFormItem('isSystem', isSystem),
      createFormItem('pageImg', pageImg),
      createFormItem('pagePath', pagePath),
      createFormItem('isShow', isShow, '是否显示', 'el-switch'),
      createFormItem('isJoinPages', isJoinPages, '是否启用', 'el-switch'),
      createFormItem('navigationBarTitleText', navigationBarTitleText, '页面标题', 'el-input'),
      createFormItem('text', text, '菜单标题', 'el-input'),
      createFormItem('iconPath', iconPath, '未选中图标', 'qc-image-upload'),
      createFormItem('selectedIconPath', selectedIconPath, '选中图标', 'qc-image-upload')
    ]
  } else {
    config = [
      createFormItem('id', id),
      createFormItem('isSystem', isSystem),
      createFormItem('pageImg', pageImg),
      createFormItem('pagePath', pagePath),
      createFormItem('isShow', isShow, '是否显示', 'el-switch'),
      createFormItem('isJoinPages', isJoinPages, '是否启用', 'el-switch'),
      // 自定义导航栏字段 暂时只给自定义页面添加
      //isCustomNavigation 只有为true的时候才放入模板中，false不会被处理
      createFormItem('isCustomNavigation', isCustomNavigation, '自定义导航栏', 'el-switch'),
      createFormItem('enablePullDownRefresh', enablePullDownRefresh, '下拉刷新', 'el-switch'),
      createFormItem('background', '#f2f2f2', '页面背景色', 'el-color-picker'),
      createFormItem('navigationBarTitleText', navigationBarTitleText, '页面标题', 'el-input'),
      createFormItem('text', text, '菜单标题', 'el-input'),
      createFormItem('iconPath', iconPath, '未选中图标', 'qc-image-upload'),
      createFormItem('selectedIconPath', selectedIconPath, '选中图标', 'qc-image-upload'),
      createFormItem('isHeaderColor', false, '占位色块', 'el-switch'),
      createFormItem('height', 40, '色块高度', 'el-input-number')
      /**是否需要每个也面都可以配置 */
      // createFormItem('navigationBarBackgroundColor', '#eee', '导航背景色', 'el-color-picker'),
      // createFormItem('navigationBarTextStyle', 'black', '标题颜色', 'el-select', [
      //   { label: '黑色', value: 'black' },
      //   { label: '白色', value: 'white' }
      // ]),
      // createFormItem('backgroundColor', '#fff', '窗口背景色', 'el-color-picker'),
      // createFormItem('backgroundTextStyle', 'light', '下拉样式', 'el-select', [
      //   { label: '亮色', value: 'light' },
      //   { label: '暗色', value: 'dark' }
      // ])
    ]
  }
  return {
    config
  }
}
