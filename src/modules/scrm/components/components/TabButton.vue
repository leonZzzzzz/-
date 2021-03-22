<template>
  <!-- 导航条 参考客户标签 xfo -->
  <!-- 
    使用方式
    1. 引入组件 
    示例：
    import TabButton from '../../../components/components/TabButton.vue'
    2. 使用组件
    示例：
    <TabButton :navList="navList" @change="changeNav"></TabButton>
    参数：
    名称        类型                   示例                                       说明
    navList    array          navList:[{name: '文本',isActive: true}]          必选，导航的列表 name导航选项标题，isActive导航选项是否被激活
    change     function       changeNav(val) {console.log(val)}                必选，返回值val为索引值
    bgColor    string         #ebeef5                                          可选，导航背景色，默认#ebeef5
    atColor    string         #ffffff                                          可选，导航激活色，默认#ffffff
    position   string         left | right                                     可选，默认left，导航条位置，左边或者右边
 -->
  <div>
    <div :class="['top_nav', { right: position == 'right' }]">
      <ul :style="`background-image: linear-gradient(to bottom, ${bgColor},${atColor});background-color:${bgColor};`">
        <li
          v-for="(item, index) in navList"
          :key="index"
          :class="[
            item.isActive ? 'active' : '',
            navList[index + 1] && navList[index + 1].isActive ? 'borderRight' : '',
            navList[index - 1] && navList[index - 1].isActive ? 'borderLeft' : ''
          ]"
          :style="`background-color: ${item.isActive ? atColor : bgColor};`"
          @click="changeNavBarFun(index)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 导航列表
    navList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 背景色
    bgColor: {
      type: String,
      default: '#ebeef5'
    },
    // 激活颜色
    atColor: {
      type: String,
      default: '#ffffff'
    },
    // 位置
    position: {
      type: String,
      default: 'left'
    }
  },
  methods: {
    // 切换顶部分类
    changeNavBarFun(index) {
      if (this.navList[index].isActive) {
        return
      }
      for (var i = 0; i < this.navList.length; i++) {
        this.navList[i].isActive = false
      }
      this.navList[index].isActive = true
      this.$emit('change', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.top_nav {
  width: 100%;
  height: 44px;
  display: flex;
  ul {
    display: flex;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
    li {
      width: 120px;
      height: 44px;
      text-align: center;
      line-height: 44px;
      font-size: 14px;
      user-select: none;
      cursor: pointer;
      &.active {
        border-radius: 0px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      &.borderLeft {
        border-bottom-left-radius: 10px;
      }
      &.borderRight {
        border-bottom-right-radius: 10px;
      }
    }
  }
  &.right {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
