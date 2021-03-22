<template>
  <div>
    <tab-button :navList="navList" @change="changeNav"></tab-button>
    <div class="main-content">
        <!-- 企微客户 -->
        <enterprise-micro v-if="navIndex == 0"></enterprise-micro>
        <!-- 非企微客户 -->
        <enterprise-not-micro v-if="navIndex == 1"></enterprise-not-micro>
        <!-- 客户回收规则 -->
        <recycle v-if="navIndex == 2"></recycle>
    </div>
  </div>
</template>

<script>
import TabButton from '@/modules/scrm/components/components/TabButton.vue'
import EnterpriseMicro from './EnterpriseMicro.vue'
import EnterpriseNotMicro from './EnterpriseNotMicro.vue'
import Recycle from './recycle.vue'
export default {
  components: {
    TabButton,
    EnterpriseMicro,
    EnterpriseNotMicro,
    Recycle
  },
  data() {
    return {
      navList: [
        { name: '企微客户', isActive: true },
        { name: '非企微客户', isActive: false },
        { name: '客户回收规则', isActive: false }
      ],
      navIndex: 0
    }
  },
  methods: {
    /*页面渲染*/
    changeNav(index) {
      this.navIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-alert__icon {
  font-size: 20px;
  width: 20px;
}
::v-deep .el-alert__title {
  font-size: 14px;
  line-height: 20px;
}
</style>