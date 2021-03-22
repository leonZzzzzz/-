<template>
  <div class="store">
    <div class="tab-bar">
      <div
        class="t-bar-item"
        v-for="(item, index) in menu"
        :key="index"
        @click="getPath(item)"
        :class="{ 'active-item': activeTab === item.label }"
      >
        {{ item.title }}
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        { title: '店铺信息', label: 'information', url: '/main/setting/store/setting/information' },
        { title: '成员管理', label: 'management', url: '/main/setting/store/setting/management' }
      ],
      activeTab: 'management'
    }
  },
  methods: {
    getPath(item) {
      this.activeTab = item.label
      this.$router.push(item.url)
    }
  }
}
</script>

<style lang="scss" scoped>
.store {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px 60px 20px 20px;
  background-color: #ffffff;
  font-size: 14px;
  box-sizing: border-box;
  overflow-x: auto;
  .tab-bar {
    display: flex;
    align-items: flex-end;
    margin-bottom: 30px;
    .t-bar-item {
      padding: 10px 20px;
      background-color: #f6f6f6;
      font-size: 16px;
      color: #000000;
      cursor: pointer;
    }
    .active-item {
      padding: 15px 20px;
      background-color: #294a7b;
      color: #ffffff;
    }
  }
}
</style>
