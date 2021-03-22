<template>
  <div
    ref="naviagetionPage"
    class="naviagetion-page"
    :class="{ 'naviagetion-page--full': full }"
    :style="{ background }"
  >
    <div class="naviagetion-page__header">
      <el-page-header :title="title" :content="content" @back="onBack" ></el-page-header>
    </div>
    <div class="naviagetion-page__body">
      <slot></slot>
    </div>
    <div v-if="full" class="naviagetion-page__footer" :style="{ width: naviagetionPageWidth }">
      <slot name="footer"></slot>
    </div>
    <div v-if="footerBlockH" :style="{height: footerBlockH + 'px'}"></div>
  </div>
</template>

<script>
export default {
  props: {
    // 组件头部返回按钮的文字
    title: {
      type: String,
      default: '返回'
    },
    // 页面标题
    content: String,
    // 组件背景色
    background: {
      type: String,
      default: '#fff'
    },
    // 是否显示底部控件，为true时组件高度为100%，超出可在容器内滚动
    full: {
      type: Boolean,
      default: false
    },
    // 底部占位块高度，如果不想显示时设置为0
    footerBlockH: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      naviagetionPageWidth: '1000px'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getPageWidth()
      window.onresize = () => {
        this.getPageWidth()
      }
    })
  },
  methods: {
    getPageWidth() {
      if (this.$refs.naviagetionPage) {
        this.naviagetionPageWidth = this.$refs.naviagetionPage.offsetWidth + 'px'
      }
    },
    onBack() {
      this.$router.back()
      this.$emit('back')
    }
  }
}
</script>

<style lang="scss" scoped>
.naviagetion-page {
  &__header {
    padding: 20px;
  }
  &__body {
    padding: 20px 20px 20px;
  }
  &__footer {
    position: fixed;
    bottom: 20px;
    right: 20px;
    // left: 250px;
    padding: 15px;
    border-top: 1px solid #eee;
    box-sizing: border-box;
    background: #fff;
    z-index: 20;
    text-align: center;
  }
}
.naviagetion-page--full {
  height: 100%;
  overflow: auto;
}
</style>
