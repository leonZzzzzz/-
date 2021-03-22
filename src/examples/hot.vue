<template>
  <div>
    <div>
      <div id="hot" class="hot-wrap-no-use"></div>
    </div>
    <QcProductPicker type="" module="" :visible="visible" @close="onQcProductPickerClose"></QcProductPicker>
    <el-button @click="onSubmit()">保存热区</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      // 是否可以执行移动事件
      isMove: false,
      // 是否拖拽物体
      isDrag: false,
      // 是否改变物体大小
      isSize: false,
      downClientX: 0,
      downClientY: 0,
      downOffsetLeft: 0,
      downOffsetTop: 0,
      maxHeight: 800,
      maxWidth: 750,
      hotList: [
        { top: 10, left: 10, widht: 100, height: 200 },
        { top: 40, left: 60, widht: 150, height: 90 }
      ]
    }
  },
  mounted() {
    this.hotList.map((item, index) => {
      let div = document.createElement('div')
      div.className = 'hot-wrap-no-use__item'
      div.style.top = item.top + 'px'
      div.style.left = item.left + 'px'
      div.style.height = item.height + 'px'
      div.style.width = item.widht + 'px'
      div.setAttribute('data-index', index)
      document.querySelector('#hot').appendChild(div)
    })
    document.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener(
      'dblclick',
      (e) => {
        if (e.target.className == 'hot-wrap-no-use__item') {
          this.div = e.target
          this.visible = true
        }
      },
      true
    )
  },
  destroyed() {
    document.removeEventListener('mousedown', this.onMouseDown)
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  },
  methods: {
    onMouseDown(e) {
      let { offsetTop, offsetLeft } = document.querySelector('#hot')
      this.offsetTop = offsetTop
      this.offsetLeft = offsetLeft
      this.isMove = true
      if (e.target.id == 'hot') {
        this.div = document.createElement('div')
        this.div.className = 'hot-wrap-no-use__item'
        this.downClientX = e.clientX - this.offsetLeft
        this.downClientY = e.clientY
      }
      if (e.target.className == 'hot-wrap-no-use__item') {
        this.div = e.target
        //获取x坐标和y坐标
        this.downClientX = e.clientX
        this.downClientY = e.clientY
        //获取左部和顶部的偏移量
        this.downOffsetLeft = this.div.offsetLeft
        this.downOffsetTop = this.div.offsetTop
        if (this.div.offsetWidth - e.offsetX <= 15 && e.offsetY <= 15) {
          document.querySelector('#hot').removeChild(this.div)
        } else if (this.div.offsetWidth - e.offsetX <= 10 && this.div.offsetHeight - e.offsetY <= 10) {
          this.isSize = true
        } else {
          this.isDrag = true
        }
      }
    },
    onMouseMove(e) {
      if (this.isMove) {
        this.div.style.zIndex = 1
        if (this.isDrag) {
          //计算移动后的左偏移量和顶部的偏移量
          let moveLeft = e.clientX - (this.downClientX - this.downOffsetLeft)
          let moveTop = e.clientY - (this.downClientY - this.downOffsetTop)
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
            this.div.style.top = this.downClientY + 'px'
            this.div.style.left = this.downClientX + 'px'
            y = this.downClientY
            x = this.downClientX
            document.querySelector('#hot').appendChild(this.div)
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
      this.isMove = false
      this.isDrag = false
      this.isSize = false
    },
    onQcProductPickerClose(row) {
      if (row) {
        this.div.setAttribute('data-url', row.pagePath)
      }
      this.visible = false
    },
    onSubmit() {
      let domList = document.querySelectorAll('.hot-wrap-no-use__item')
      for (let index = 0; index < domList.length; index++) {
        console.log({
          height: domList[index].clientHeight,
          width: domList[index].clientWidth,
          top: domList[index].offsetTop,
          left: domList[index].offsetLeft,
          url: domList[index].dataset.url
        })
      }
    }
  }
}
</script>

<style lang="scss">
.hot-wrap-no-use {
  position: relative;
  width: 750px;
  height: 800px;
  background: #eee;
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
      background: red;
      text-align: center;
      color: #fff;
    }
  }
}
</style>
