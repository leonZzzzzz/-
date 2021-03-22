<template>
  <div>
    <QcImageUpload
      style="margin-bottom:30px;"
      :value="newValue.iconUrl"
      width="67px"
      height="67px"
      @input="updateDate"
    ></QcImageUpload>
    <el-button v-if="newValue.iconUrl" @click="visible = true" type="primary">
      {{ newValue.item.length == 0 ? '设置热区' : `已设置${newValue.item.length}个热区` }}
    </el-button>
    <div class="qc-hotzone-mask" v-if="visible">
      <div class="qc-hotzone-mask__body">
        <i
          @click="onSubmit()"
          class="el-icon-circle-close"
          style="font-size: 32px;color: #fff;margin-left: -50px;position: absolute;"
        />
        <img
          id="bgImg"
          :src="imgHost + newValue.iconUrl"
          width="100%"
          style="pointer-events: none;position: absolute;"
        />
        <div id="hot" class="hot-wrap" :style="`height:${maxHeight}px`"></div>
      </div>
      <QcProductPicker
        :type="['product', 'page', 'miniApp']"
        :module="[
          'Mall',
          'MallGroupShopping',
          'ProductCategory',
          'XiaoeTechCourseVip',
          'Activity',
          'Lesson',
          'News',
          'Survey',
          'Channel'
        ]"
        :visible="productPickerVisible"
        @close="onQcProductPickerClose"
      ></QcProductPicker>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // 热区元素#hot
      HotDom: null,
      visible: false,
      productPickerVisible: false,
      // 是否可以执行移动事件
      isMove: false,
      // 是否拖拽物体
      isDrag: false,
      // 是否改变物体大小
      isSize: false,
      mousedownClientX: 0,
      mousedownClientY: 0,
      domOffsetLeft: 0,
      domOffsetTop: 0,
      maxHeight: 800,
      maxWidth: 375
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          const HotDom = this.HotDom || document.querySelector('#hot')
          this.maxHeight = document.querySelector('#bgImg').clientHeight || 600
          this.value.item.map((item) => {
            let div = document.createElement('div')
            div.className = 'hot-wrap__item'
            div.style.top = item.top + 'px'
            div.style.left = item.left + 'px'
            div.style.height = item.height + 'px'
            div.style.width = item.width + 'px'
            div.setAttribute('data-url', item.url)
            HotDom.appendChild(div)
          })
          document.addEventListener('mousedown', this.onMouseDown)
          document.addEventListener('mousemove', this.onMouseMove)
          document.addEventListener('mouseup', this.onMouseUp)
          document.addEventListener('dblclick', this.onQcProductPickerShow)
        })
      } else {
        console.log('removeEventListener')
        document.removeEventListener('mousedown', this.onMouseDown)
        document.removeEventListener('mousemove', this.onMouseMove)
        document.removeEventListener('mouseup', this.onMouseUp)
        document.removeEventListener('dblclick', this.onQcProductPickerShow)
      }
    }
  },
  computed: {
    newValue() {
      return _.cloneDeep(this.value)
    }
  },
  mounted() {
    this.HotDom = document.querySelector('#hot')
  },
  methods: {
    onMouseDown(e) {
      console.log('onMouseDown')
      const HotDom = this.HotDom || document.querySelector('#hot')
      if (e.target.id == 'hot') {
        this.isMove = true
        let {
          offsetParent: { offsetTop, offsetLeft }
        } = HotDom
        this.offsetTop = offsetTop
        this.offsetLeft = offsetLeft
        this.div = document.createElement('div')
        this.div.className = 'hot-wrap__item'
        this.mousedownClientX = e.clientX - this.offsetLeft
        this.mousedownClientY = e.clientY - this.offsetTop
      }
      if (e.target.className == 'hot-wrap__item') {
        this.isMove = true
        this.div = e.target || e.srcElement
        //获取x坐标和y坐标
        this.mousedownClientX = e.clientX
        this.mousedownClientY = e.clientY
        //获取左部和顶部的偏移量
        this.domOffsetLeft = this.div.offsetLeft
        this.domOffsetTop = this.div.offsetTop
        if (this.div.offsetWidth - e.offsetX <= 15 && e.offsetY <= 15) {
          // 点击热点上的小红叉就移除元素
          this.isMove = false
          this.div.remove && this.div.remove() // 删除自身
          // let delDom = HotDom.removeChild(this.div) // 从父元素里删除自身
          // this.isMove = true
          console.log('移除元素', delDom)
        } else if (this.div.offsetWidth - e.offsetX <= 10 && this.div.offsetHeight - e.offsetY <= 10) {
          this.isSize = true
        } else {
          this.isDrag = true
        }
      }
    },
    onMouseMove(e) {
      console.log('onMouseMove')
      if (this.isMove) {
        const HotDom = this.HotDom || document.querySelector('#hot')
        this.div.style.zIndex = 1
        if (this.isDrag) {
          //计算移动后的左偏移量和顶部的偏移量
          let moveLeft = e.clientX - (this.mousedownClientX - this.domOffsetLeft)
          let moveTop = e.clientY - (this.mousedownClientY - this.domOffsetTop)
          let isHeight = moveTop + this.div.clientHeight <= this.maxHeight
          let isWidth = moveLeft + this.div.clientWidth <= this.maxWidth
          if (moveLeft >= 0 && isWidth) {
            this.div.style.left = moveLeft + 'px'
          }
          if (moveTop >= 0 && isHeight) {
            this.div.style.top = moveTop + 'px'
          }
        } else {
          let width, height, x, y
          if (this.isSize) {
            x = this.div.offsetLeft
            y = this.div.offsetTop
          } else {
            this.div.style.top = this.mousedownClientY + 'px'
            this.div.style.left = this.mousedownClientX + 'px'
            y = this.mousedownClientY
            x = this.mousedownClientX
            HotDom.appendChild(this.div)
          }
          height = e.clientY - this.offsetTop - y
          width = e.clientX - this.offsetLeft - x
          let isHeight = this.maxHeight - this.div.offsetTop - 2 >= height
          let isWidth = this.maxWidth - this.div.offsetLeft - 2 >= width
          if (isHeight) {
            this.div.style.height = height + 'px'
          }
          if (isWidth) {
            this.div.style.width = width + 'px'
          }
        }
      }
    },
    onMouseUp() {
      console.log('onMouseUp')
      this.isMove = false
      this.isDrag = false
      this.isSize = false
    },
    onQcProductPickerShow(e) {
      if (e.target.className == 'hot-wrap__item') {
        this.div = e.target
        this.productPickerVisible = true
      }
    },
    onQcProductPickerClose(row) {
      if (row) {
        this.div.setAttribute('data-url', row.pagePath)
      }
      this.productPickerVisible = false
    },
    updateDate(val) {
      this.newValue.iconUrl = val
      this.$emit('input', this.newValue)
    },
    onSubmit() {
      let item = [],
        domList = document.querySelectorAll('.hot-wrap__item')
      for (let index = 0; index < domList.length; index++) {
        item.push({
          width: domList[index].clientWidth,
          height: domList[index].clientHeight,
          top: domList[index].offsetTop,
          left: domList[index].offsetLeft,
          url: domList[index].dataset.url
        })
      }
      this.newValue.item = item
      this.visible = false
      this.$emit('input', this.newValue)
    }
  }
}
</script>

<style lang="scss">
.qc-hotzone-mask {
  padding-top: 60px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
  &__body {
    width: 375px;
    margin: 0 auto;
    position: relative;
    background: #fff;
    .hot-wrap {
      position: relative;
      width: 375px;
      margin: 0 auto;
      &__item {
        position: absolute;
        border: 1px solid #fff;
        background-color: rgba(0, 0, 0, 0.5);
        &::before {
          content: '×';
          position: absolute;
          width: 15px;
          height: 15px;
          top: 0;
          right: 0;
          line-height: 15px;
          background: #ff5433;
          text-align: center;
          color: #fff;
        }
      }
    }
  }
}
</style>
