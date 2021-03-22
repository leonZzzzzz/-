<template>
  <div>
    <TabButton :navList="navList" @change="changeNav"></TabButton>
    <div class="main_content" id="main_content" :style="`min-height:${pageHeight}px`">
      <Company v-if="navFlag == 0"></Company>
      <Application v-else-if="navFlag == 1"></Application>
      <Subscription v-else-if="navFlag == 2"></Subscription>
      <Weapp v-else-if="navFlag == 3"></Weapp>
      <!-- <BusinessCard v-else-if="navFlag == 4"></BusinessCard> -->
    </div>
  </div>
</template>

<script>
import TabButton from '../../components/components/TabButton.vue'
import Company from './Index/Company.vue'
import Application from './Index/Application.vue'
import Subscription from './Index/Subscription.vue'
import Weapp from './Index/Weapp.vue'
import BusinessCard from './Index/BusinessCard.vue'
export default {
  components: {
    TabButton,
    Company,
    Application,
    Subscription,
    Weapp,
    BusinessCard,
  },
  data() {
    return {
      // 导航栏
      navList: [
        { name: '企业配置', isActive: true },
        { name: '应用配置', isActive: false },
        { name: '公众号配置', isActive: false },
        { name: '小程序配置', isActive: false },
        // { name: '名片小程序配置', isActive: false }
      ],
      // 导航索引
      navFlag: 0,
      // 页面高度
      pageHeight: 0
    }
  },
  methods: {
    //  ---页面渲染函数---
    changeNav(val) {
      this.navFlag = val
      this.$store.commit('scrm/updateDisposeNavFlag', this.navFlag)
    },
    getPageHeight() {
      const TABBUTTON = 44,
        BODYPADDING = 40
      this.pageHeight = window.innerHeight - document.querySelector('#main_content').offsetTop - TABBUTTON - BODYPADDING
    }
  },
  mounted() {
    // 跳转页面后默认选中上次的菜单
    this.navFlag = this.$store.state.scrm.disposeNavFlag
    this.navList.forEach((item, i) => {
      item.isActive = i === this.navFlag
    })
    
    this.$nextTick(() => {
      this.getPageHeight()
    })
  }
}
</script>

<style lang="scss" scoped>
.main_content {
  background-color: #ffffff;
  // height: 500px;
  padding: 0 20px;
}
</style>
