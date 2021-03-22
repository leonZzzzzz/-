/* eslint-disable */

// 生产页面的模板
export const template = `
  import Taro, { Component } from '@tarojs/taro'
  import { View } from '@tarojs/components'
  import { getProjectPage } from '@/api/flywheel'
  import RenderComponent from '@/components/flywheel/render-component'
  import withShare from '@/utils/withShare'
  import { LogoWrap } from '@/components/common'
  import api from '@/api/distributer'

  export default class {{fileName}} extends Component {
    {{config}}
    constructor(props) {
      super(props)
      this.state = {
        pageConfig: []
      }
    }
    onShareAppMessage() {
      return withShare()
    }
    onPullDownRefresh() {
      Taro.eventCenter.trigger('pullDownRefresh')
      setTimeout(() => {
        Taro.stopPullDownRefresh()
      }, 500)
    }
    componentDidMount() {
      getProjectPage({fileId: '{{pageId}}',layoutAppId: '{{layoutAppId}}'}).then(res => {
        this.setState({
          pageConfig: JSON.parse(res.data.data.json)
        })
      })

      const options = Taro.getLaunchOptionsSync()
      console.log('--------getLaunchOptionsSync----------', options)
      if ((options.scene === 1047 || options.scene === 1048 || options.scene === 1049) && options.query.scene != 'norequest') {
        this.distributerScanBind(options.query.scene)
      }
    }

    async distributerScanBind(scene: any) {
      const res = await api.distributerScanBind({ scene })
      const data = res.data.data
      console.log('扫码绑定---------distributerScanBind', data)
    }

    render() {
      return (
        <View>
          {
            {{isHeaderColor}} &&
            <View style="height: {{height}}rpx;background: {{themeColor}};position: absolute;top: 0;left: 0;right: 0;"></View>
          }
          {this.state.pageConfig.map(copmonent => {
            return (
              <RenderComponent
                key={copmonent.name}
                is={copmonent.name}
                options={copmonent.options}
              />
            )
          })}
          <LogoWrap />
        </View>
      )
    }
  }
  `
// 主题模板
export const theme = ``
