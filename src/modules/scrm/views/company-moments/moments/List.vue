<template>
  <div>
    <tab-button :navList="navList" @change="changeNav"></tab-button>
    <moment-list v-if="navIndex == 0"></moment-list>
    <moment-setting v-if="navIndex == 1"></moment-setting>
  </div>
</template>

<script>
import TabButton from '@/modules/scrm/components/components/TabButton.vue'
import MomentList from './MomentList.vue'
import MomentSetting from './MomentSetting.vue'
export default {
  components: { TabButton, MomentList, MomentSetting },
  data() {
    return {
      navList: [
        { name: '动态圈', isActive: true },
        { name: '设置', isActive: false },
      ],
      navIndex: 0
    }
  },
  methods: {
    /*页面渲染*/
    changeNav(val) {
      this.navIndex = val
    }
    /*数据获取*/
  }
}
</script>

<style lang="scss" scoped>
</style>