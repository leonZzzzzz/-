<template>
  <!-- <div class='project-index'>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="用户端" name="first">
        <Config />
      </el-tab-pane>
      <el-tab-pane label="店铺端" name="second">
        <ConfigStore />
      </el-tab-pane>
    </el-tabs>
  </div> -->
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
      <!-- 别删用来触发计算属性的 -->
      <span>{{ showAuthStore }}</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menu: [{ title: '用户端', label: 'user', url: '/main/flywheel/project/config/user' }],
      activeTab: 'user'
    }
  },
  computed: {
    showAuthStore() {
      if ([null, undefined].includes(this.$store.state.showAuthStore)) {
        this.$http.getConfigByKey('AUTHORIZED_MULTI_STORE').then(res => {
          if (res.data.data) {
            this.$store.commit('showAuthStore', res.data.data.value)
          }
        })
      }
      if (this.$store.state.showAuthStore === '1') {
        this.menu.push({ title: '店铺端', label: 'store', url: '/main/flywheel/project/config/store' })
      }
      return ''
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
.project-index {
  ::v-deep.el-tabs__content {
    background: #f6f6f6;
  }
}
</style>
<style lang="scss" scoped>
.platform {
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 90px;
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
    padding: 30px;
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
    overflow: auto;
    box-sizing: border-box;
  }
}
</style>
