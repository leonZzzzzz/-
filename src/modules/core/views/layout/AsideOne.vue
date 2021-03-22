<template>
  <div>
    <el-aside style="user-select: none;">
      <ul class="nav-items" :style="`width: ${open ? 100 : 50}px`">
        <li
          v-for="(item, index) in menuTree"
          :key="item.id"
          :class="{ 'nav-item--active': index == selectTreeIndex }"
          class="nav-item"
          @click="selectTreeIndex = index"
        >
          <img
            v-if="item.activateIcon || item.icon"
            style="vertical-align: text-top;width: 18px;display: inline-block;height: 18px;"
            :src="`${imgHost}${index == selectTreeIndex ? item.activateIcon : item.icon}`"
            :title="item.name"
          />
          <span style="margin-left:15px" :title="item.name">{{ item.name }}</span>
        </li>
        <li
          class="nav-item"
          @click="open = !open"
          style="text-align: center;position: absolute;bottom: 60px;width: 100%;padding: 0;"
        >
          <span :class="`${open ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'}`"></span>
        </li>
      </ul>
      <el-menu
        :unique-opened="true"
        :router="true"
        :default-active="$route.path"
        :style="`border: none;margin-left: ${open ? 100 : 50}px;width:130px ;transition: all 0.5s;`"
      >
        <div v-if="menuTree[selectTreeIndex]">
          <el-submenu v-for="(item, index) in menuTree[selectTreeIndex].childs" :index="index + '-'" :key="index">
            <template slot="title">{{ item.name }}</template>
            <el-menu-item v-for="list in item.childs" :key="list.id" :index="list.url" :title="list.name">{{
              list.name
            }}</el-menu-item>
          </el-submenu>
        </div>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: true,
      selectTreeIndex: 0,
      menuTree: [{ childs: [] }]
    }
  },
  methods: {
    getMenuTree() {
      this.$http.getMenuTree().then((res) => {
        this.menuTree = res.data.data
      })
    }
  },
  created() {
    this.getMenuTree()
  }
}
</script>

<style lang="scss" scoped>
.el-aside {
  position: relative;
  width: auto !important;
  height: 100vh;
  &::-webkit-scrollbar {
    display: none;
  }
  .nav-items {
    font-size: 14px;
    color: #fff;
    position: absolute;
    left: 0;
    height: 100vh;
    background: $--color-primary;
    transition: all 0.5s;
    .nav-item {
      height: 54px;
      line-height: 54px;
      padding: 0 15px;
      overflow: hidden;
      cursor: pointer;
      &--active {
        background: #ffffff;
        color: $--color-primary;
      }
    }
  }
}
</style>
