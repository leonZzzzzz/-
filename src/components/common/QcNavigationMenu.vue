<template>
  <div class="qc-navigation-menu">
    <h1 class="qc-navigation-menu__title">
      <slot>{{ title }}</slot>
    </h1>
    <el-menu mode="horizontal" :default-active="$route.path" :router="true">
      <el-menu-item v-for="(item, index) in path" :key="index" :index="item.url">{{ item.name }}</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    path: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.qc-navigation-menu {
  background: #fff;
  padding-bottom: 20px;
  &__title {
    padding: 30px 20px 10px;
    font-size: 22px;
  }
}
</style>
