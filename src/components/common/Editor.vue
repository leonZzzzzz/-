<template>
  <div class="editor" :style="{ width: `${config.initialFrameWidth}px` }">
    <div ref="editor"></div>
  </div>
</template>

<script>
// import lrz from 'lrz'
const UE = require('UE')

export default {
  props: {
    content: String,
    configs: Object,
    value: String
  },
  computed: {
    config() {
      let config = Object.assign(this.default, this.configs)
      console.log(config)
      return config
    }
  },
  data() {
    return {
      editor: null,
      id:
        Math.random()
          .toString(36)
          .substr(2) + 'ueditorId',
      digImgWrap: false,
      default: {
        catchRemoteImageEnable: true,
        serverUrl: `${this.baseUrl}/api/v1/attachments/images/ueditor`,
        autoHeightEnabled: false,
        initialFrameWidth: 750,
        initialFrameHeight: 500,
        toolbars: Object.freeze([
          [
            'bold',
            'italic',
            'underline',
            '|',
            'forecolor',
            'backcolor',
            '|',
            'emotion',
            'simpleupload',
            'insertimage',
            'insertvideo',
            'map',
            'horizontal',
            '|',
            'fontfamily',
            'fontsize',
            '|',
            'rowspacingtop',
            'rowspacingbottom',
            'lineheight',
            '|',
            'indent',
            '|',
            'justifyleft',
            'justifycenter',
            'justifyright',
            'justifyjustify',
            '|',
            'link',
            'unlink',
            '|',
            'undo',
            'redo',
            'removeformat',
            'pasteplain',
            'source',
            'fullscreen',
            '|'
          ]
        ])
      },
      contentHtml: ''
    }
  },
  watch: {
    value(val) {
      // 第一次进来拿到接口返回的富文本后设置一次值, 后面就不用再设置
      if (val === this.contentHtml) return
      this.$nextTick(() => {
        if (this.editor) {
          this.editor.ready(() => {
            this.editor.setContent(val)
          })
        }
      })
    }
  },
  created() {
    // console.log('created')
    // this.initEditor()
  },
  mounted() {
    console.log('mounted')
    this.initEditor()
  },
  methods: {
    initEditor() {
      // setTimeout(() => {
      this.$refs.editor.id = this.id
      this.editor = UE.getEditor(this.id, this.config)
      this.editor.ready(() => {
        // this.editor.setContent(this.value) // this.value是异步的所以不在这里设置
        this.editor.addListener('contentChange', () => {
          console.log('编辑器输入监听中 =============>')
          let html = this.editor.getContent()
          try {
            // 此段代码是为了兼容还没更新到最新小程序版本的客户）
            // 旧版小程序自定义的content-wrap富文本组件，在处理样式自适应时带有小数点的会匹配不到
            // 现将有小数的width转为整数
            html = html.replace(/width:([^;]+)px;/gi, function(match, $1) {
              // console.log(match, $1)
              // $1为每次匹配到的第一组内容
              return `width ${Math.floor($1)}px;`
            })
          } catch (error) {
            console.log(error)
          }
          this.contentHtml = html
          this.$emit('input', html)
        })
        this.editor.addListener('catchremotesuccess', () => {
          console.log('编辑器图片抓取成功 =============>')
          this.$emit('input', this.editor.getContent())
        })
        this.editor.addListener('selectionchange', () => {
          // 查询当前编辑区域的状态是源码模式还是可视化模式--	如果当前是源码编辑模式，返回1，否则返回0
          // 解决切换到html模式编辑不会触发contentChange事件，需要再次点击html按钮退出源码模式才可以
          if (this.editor.queryCommandState('source') == 1) {
            this.$notify({
              title: '小提示',
              message: '切换到“ HTML源码模式 ”编辑完成后，需再次点击“ HTML ”按钮退出源码模式才会保存当前的内容',
              type: 'warning',
              offset: 100,
              duration: 10000
            })
          }
        })
      })
      // }, 500)
    }
  },

  beforeDestroy() {
    console.log('beforeDestroy ')
    // this.editor && this.editor.destory()
  },
  destoryed() {
    console.log('destoryed')
    // this.editor.destory()
  }
}
</script>

<style lang="scss" scoped>
.editor ::v-deep .edui-default .edui-editor {
  z-index: 10 !important;
}
.editor {
  line-height: 1.2;
  position: relative;
  .upload-img {
    position: absolute;
    z-index: 11;
    top: 30px;
    right: 3px;
    padding: 0;
    line-height: 23px;
    font-size: 12px;
    text-align: center;
    color: #fff;
    border-radius: 2px;
    input {
      position: absolute;
      width: 58px;
      opacity: 0;
    }
    button {
      padding: 5px 6px;
      font-size: 11px;
    }
  }
}
</style>
