<template>
  <div class="page">
    <go-back title="详情"></go-back>
    <tab-button :navList="navList" @change="changeNav"></tab-button>
    <div class="main-content">
      <!-- 客户详情 -->
      <customer-details v-if="navIndex == 0"></customer-details>
        <!-- 跟进记录 -->
      <follow-recording v-if="navIndex == 1"></follow-recording>
      <!-- 动态记录 -->
      <dynamic-recording v-if="navIndex == 2"></dynamic-recording>
      <!-- 所在群聊 -->
      <group-details v-if="navIndex == 3"></group-details>
    </div>
  </div>
</template>
<script>
import GoBack from '@/modules/scrm/components/components/GoBack.vue'
import TabButton from '@/modules/scrm/components/components/TabButton.vue'
import CustomerDetails from './CustomerDetails.vue'
import DynamicRecording from './DynamicRecording.vue'
import FollowRecording from './FollowRecording.vue'
import GroupDetails from './GroupDetails.vue'
export default {
  components: { GoBack, TabButton, CustomerDetails, DynamicRecording, FollowRecording, GroupDetails },
  data() {
    return {
      navList: [
        { name: '客户详情', isActive: true },
        { name: '跟进记录', isActive: false },
        { name: '动态记录', isActive: false },
        { name: '所在群聊', isActive: false }
      ],
      navIndex: 0,
      isworkwechat:''
    }
  },
  created(){
    console.log(this.$route.query)
    this.isworkwechat=this.$route.query.isworkwechat
  },
  methods: {
    changeNav(index) {
      this.navIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
}
.main-content {
  min-height: calc(100% - 100px);
}
</style>
