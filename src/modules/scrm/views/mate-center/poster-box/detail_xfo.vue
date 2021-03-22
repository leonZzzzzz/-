<template>
  <div class="xfo-page">
    <div class="xfo-left">
      <div class="poster-window">
        <!-- 图片 -->
        <div class="pictrue">
          <img :style="imgStyle" :src="imgUrl" alt="" />
        </div>
        <!-- 元件 -->
        <div class="element-cell">
          <div
            class="text"
            :id="tItem.id"
            :style="
              `color:${tItem.color};fontSize:${tItem.fontSize}px;fontWeight:${tItem.fontWeight}px;fontStyle:${tItem.fontStyle};lineHeight:${tItem.lineHeight}px;letterSpacing:${tItem.letterSpacing};px`
            "
            v-for="(tItem, tIndex) in textCell"
            :key="tIndex"
          >
            {{ tItem.content }}
          </div>
          <div class="image">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="xfo-right"></div>
  </div>
</template>

<script>
const textCellArray = [
  {
    id: 'code',
    content: '这是啥',
    color: '#ff6700',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'italic',
    lineHeight: 14,
    letterSpacing: 14
  },
  {
    id: 'code2',
    content: '这是啥',
    color: '#ff6700',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'italic',
    lineHeight: 14,
    letterSpacing: 14
  },
  {
    ref: 'code3',
    content: '这是啥',
    color: '#ff6700',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'italic',
    lineHeight: 14,
    letterSpacing: 14
  },
  {
    ref: 'code4',
    content: '这是啥',
    color: '#ff6700',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'italic',
    lineHeight: 14,
    letterSpacing: 14
  }
]
export default {
  props: {
    // 海报图片样式
    imgStyle: {
      type: String,
      default: ''
    },
    // 海报图片地址
    imgUrl: {
      type: String,
      default: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
    },
    // 海报文本元件参数
    textCell: {
      type: Array,
      default: () => {
        return textCellArray
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.xfo-page {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
.xfo-left {
  .poster-window {
    width: 400px;
    position: relative;
    .pictrue {
      width: 100%;
      img {
        width: 100%;
        opacity: 0.5;
      }
    }
    .element-cell {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
    }
  }
}
</style>
