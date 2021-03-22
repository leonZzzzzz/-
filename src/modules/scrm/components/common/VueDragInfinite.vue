<template>
  <div
    class="contain"
    ref="dragContain"
    :style="{
      background: img ? 'transparent' : '#ddd',
      height: img ? size.yy + 'px' : '550px',
      width: '330px',
      position: 'relative',
      userSelect: 'none',
      boxShadow: '3px 3px 7px 6px #eee',
    }"
  >
    <!-- <el-image v-if="img" :src="img" style="width: 100%"> </el-image>  :style="{ height: size.posterHeight + 'px !important' }"-->
    <!-- <div style="display:block;width:330px;margin:0px;padding:0px;position:relative"> -->
    <img
      id="oImg"
      class="o-img"
      :src="img"
      style="width: 100%; display: block;margin:0px;padding:0px"
    />
    <div
      v-drag="size"
      class="drag"
      v-for="(item, index) in json"
      :key="index"
      @click="moveDiv(index, $event)"
      :style="{
        height: item.style.height,
        width: item.style.width,
        lineHeight: item.style.lineHeight + 'px',
        fontSize: item.style.fontSize + 'px',
        letterSpacing: item.style.letterSpacing + 'px',
        color: item.style.color,
        background: item.style.background,
        fontWeight: item.style.fontWeight,
        fontStyle: item.style.fontStyle,
        textAlign: item.style.textAlign,
        alignItems: item.style.alignItems,
        borderRadius: item.style.borderRadius,
        top: item.style.top,
        left: item.style.left,
        zIndex: item.style.zIndex
      }"
      :class="{ active: index == divindex }"
      v-if="item.type === 'text'"
    >
      {{ item.content }}
      <i
        class="el-icon-caret-bottom sacle"
        v-if="index == divindex"
        @click="sacle($event)"
        @mousedown="mouseDown($event, true)"
        unselectable="on"
      ></i>
    </div>
    <img
      v-drag="size"
      class="noheight"
      v-for="(item, index) in json"
      :key="index"
      @click="moveDiv(index, $event)"
      :src="qrcode"
      :style="{
        height: item.style.height,
        width: item.style.width + 'px',
        lineHeight: item.style.lineHeight + 'px',
        fontSize: item.style.fontSize + 'px',
        letterSpacing: item.style.letterSpacing + 'px',
        top: item.style.top,
        left: item.style.left,
        zIndex: item.style.zIndex,
        borderRadius: item.style.borderRadius
      }"
      :class="{ active: index == divindex }"
      v-if="item.mark === 'code'"
    />
    <img
      v-drag="size"
      class="noheight"
      v-for="(item, index) in json"
      :key="index"
      @click="moveDiv(index, $event)"
      :src="logo"
      :style="{
        height: item.style.height,
        width: item.style.width + 'px',
        lineHeight: item.style.lineHeight + 'px',
        fontSize: item.style.fontSize + 'px',
        letterSpacing: item.style.letterSpacing + 'px',
        top: item.style.top,
        left: item.style.left,
        zIndex: item.style.zIndex,
        borderRadius: item.style.borderRadius
      }"
      :class="{ active: index == divindex }"
      v-if="item.mark === 'logo'"
    />
    <!-- </div> -->
    <!-- <div @click="save">保存</div> -->
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
export default {
  name: 'vue-drag-infinite', // 此处name名称  在index.js 文件中有引用  所以最好跟插件名称一致，避免chux
  props: {
    json: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: '小清新'
    },
    id: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    qrcode: {
      type: String,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    },
    //外层容器的宽高 数值不带px单位
    size: {
      type: Object,
      default: () => {
        return {
          xx: 330,
          yy: 550
        }
      }
    }
  },
  data() {
    return {
      // img:'',
      //外层容器的宽高 数值不带px单位
      // contain:{
      //   xx:0,
      //   yy:0
      // },
      //存放拉伸放大时的  div的原始宽高 带px单位
      movejson: {
        moveWidth: '',
        moveHeight: ''
      },
      divindex: 0 //当前选中div的序号  默认为0
    }
  },
  created() {
    console.log(this.json)
  },
  mounted() {
    // this.contain.xx = this.$refs.dragContain.offsetWidth;
    // this.contain.yy = this.$refs.dragContain.offsetHeight;
  },
  methods: {
    save() {
      html2canvas(this.$refs.dragContain).then(canvas => {
        let dataURL = canvas.toDataURL('image/jpeg')
        this.downloadIamge(dataURL, '海报')
      })
    },
    downloadIamge(imgsrc, name) {
      //下载图片地址和图片名
      var image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/jpeg') //得到图片的base64编码数据
        var a = document.createElement('a') // 生成一个a元素
        var event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgsrc
    },

    // 字符串转json对象
    toJson(str) {
      let _str = eval('(' + str + ')')
      return _str
    },
    //外层div点击选择事件 绑定右上角设置面板
    moveDiv(index, e) {
      let jsonNew = this.toJson(
        '{"' +
          e.target.style.cssText
            .replace(/\; +/g, '","')
            .replace(/\: +/g, '":"')
            .replace(/\;+/g, '')
            .replace(/-\w/g, function ($) {
              return $.slice(1).toUpperCase()
            }) +
          '"}'
      )
      console.log(jsonNew)
      //当前选中div的序号
      this.divindex = index
      this.json[index].style = jsonNew
      if (this.json[index].style.lineHeight) {
        this.json[index].style.lineHeight = jsonNew.lineHeight.substring(0, jsonNew.lineHeight.length - 2)
      }
      if (this.json[index].style.fontSize) {
        this.json[index].style.fontSize = jsonNew.fontSize.substring(0, jsonNew.fontSize.length - 2)
      }
      if (this.json[index].style.letterSpacing) {
        this.json[index].style.letterSpacing = jsonNew.letterSpacing.substring(0, jsonNew.letterSpacing.length - 2)
      }
      if (this.json[index].style.borderRadius) {
        this.json[index].style.width = jsonNew.width.substring(0, jsonNew.width.length - 2)
      }
      this.json[index].text = e.target.innerText
      this.$emit('get-index', index)
      this.$emit('get-list', this.json)
      console.log(this.json)
    },
    onSave() {
      let data = this.json
      this.$emit('save', data)
    },
    //div上拉伸的阻止冒泡事件
    sacle(e) {
      e.stopPropagation()
    },
    //div上拉伸的 放大 缩小div宽高
    mouseDown(e, type) {
      if (type) {
        let that = this
        let oldX = e.pageX,
          oldY = e.pageY
        that.movejson.moveWidth = that.json[that.divindex].style.width
        that.movejson.moveHeight = that.json[that.divindex].style.height
        document.onmousemove = function (e) {
          let newX = e.pageX - oldX
          let newY = e.pageY - oldY
          that.json[that.divindex].style.width =
            (newX + parseInt(that.movejson.moveWidth) >= 80 ? newX + parseInt(that.movejson.moveWidth) : '80') + 'px'
          that.json[that.divindex].style.height =
            (newY + parseInt(that.movejson.moveHeight) >= 50 ? newY + parseInt(that.movejson.moveHeight) : '50') + 'px'
        }
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null
        }
      }
      e.stopPropagation()
    }
  },
  computed: {},
  // 自定义v-drag指令，绑定指定的元素
  directives: {
    drag: {
      bind: function (el, binding, vnode) {
        el.onmousedown = function (e) {
          var disx = e.clientX - el.offsetLeft
          var disy = e.clientY - el.offsetTop
          document.onmousemove = function (e) {
            let left = e.clientX - disx
            let top = e.clientY - disy
            if (left < 0) {
              left = 0
            }
            if (top < 0) {
              top = 0
            }
            if (left > binding.value.xx - el.offsetWidth) {
              left = binding.value.xx - el.offsetWidth
            }
            if (top > binding.value.yy - el.offsetHeight) {
              top = binding.value.yy - el.offsetHeight
            }
            el.style.left = left + 'px'
            el.style.top = top + 'px'
          }
          document.onmouseup = function () {
            document.onmousemove = document.onmouseup = null
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
ul,
li {
  margin: 0px;
  list-style: none;
  padding: 0px;
}
.contain {
  // width: 330px;
  // height: 550px;
  // position: relative;
  // user-select: none;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 7px;
}

.drag {
  width: 100px;
  height: 100px;
  position: absolute;
  border: 1px dashed transparent;
  top: 0;
  left: 0;
  cursor: move;
  line-height: 1.7;
  box-sizing: border-box;
  color: #000;
  overflow: hidden;
  padding: 5px;
  .sacle {
    display: none;
    position: absolute;
    right: 0px;
    bottom: 0px;
    // background-color: #909399;
    cursor: se-resize;
    transform: rotate(-45deg);
    font-size: 15px;
  }
  .del {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 5px;
    box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
  }
}
.drag:hover .sacle {
  display: block;
}
.drag:hover {
  border: 1px dashed #eee;
}

.noheight {
  width: 100px;
  position: absolute;
  border: 1px dashed transparent;
  top: 0;
  left: 0;
  cursor: move;
  line-height: 1.7;
  box-sizing: border-box;
  color: #000;
  overflow: hidden;
  padding: 5px;
}
.noheight:hover .sacle {
  display: block;
}
.noheight:hover {
  border: 1px dashed #eee;
}
.control {
  width: 250px;
  border-radius: 5px;
  overflow: hidden;
  background-color: #b3c0d1;
  position: absolute;
  z-index: 999;
  right: 20px;
  top: 15px;
}
</style>
