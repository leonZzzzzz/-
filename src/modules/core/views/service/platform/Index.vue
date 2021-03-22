<template>
  <div class="platform">
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
    <div class="content-wrap">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        { title: '店铺信息', label: 'config', url: '/main/service/setting/my/config' },
        { title: '成员管理', label: 'management', url: '/main/service/setting/my/management' }
      ],
      activeTab: 'config'
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
.platform {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 140px 30px 20px 30px;
  background-color: #ffffff;
  font-size: 14px;
  box-sizing: border-box;
  overflow: hidden;
  .tab-bar {
    display: flex;
    align-items: flex-end;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 99;
    background-color: #fff;
    padding: 40px 30px 50px 30px;
    box-sizing: border-box;
    .t-bar-item {
      padding: 12px 25px;
      background-color: #f1f0f0;
      font-size: 16px;
      color: #000000;
      cursor: pointer;
    }
    .active-item {
      padding: 17px 25px;
      background-color: #294a7b;
      color: #ffffff;
    }
  }
  .content-wrap {
    width: calc(100% - 20px);
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
}
</style>
