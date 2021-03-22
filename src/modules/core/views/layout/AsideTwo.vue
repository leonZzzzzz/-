<template>
  <div>
    <el-aside style="user-select: none;">
      <ul class="nav-items" :style="`width: ${open ? 100 : 50}px`" v-if="asideMinLengthFlag">
        <li
          v-for="(item, index) in menuTree"
          :key="item.id"
          :class="{ 'nav-item--active': index == selectTreeIndex }"
          class="nav-item"
          @click="fristChangeItem(index)"
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
        :style="
          `border: none;margin-left: ${asideMinLengthFlag ? (open ? 100 : 50) : 0}px;width:220px ;transition: all 0.5s;`
        "
        class="level_content"
      >
        <ul class="second_level" v-if="menuTree[selectTreeIndex]">
          <li
            v-for="(item, index) in menuTree[selectTreeIndex].childs"
            :index="index + '-'"
            :key="index"
            class="second_level_item"
          >
            <div class="level_item_title">
              <img
                v-if="item.activateIcon || item.icon"
                style="vertical-align: text-top;width: 18px;display: inline-block;height: 18px;margin-right:12px;"
                :src="`${imgHost}${index == selectTreeIndex ? item.activateIcon : item.icon}`"
                :title="item.name"
              />
              <span :title="item.name">{{ item.name }}</span>
            </div>
            <div class="level_item_content">
              <ul class="third_level">
                <li class="third_level_name" v-for="(list, listIndex) in item.childs" :key="list.id" :index="list.url">
                  <div
                    :class="[
                      'third_level_name_content',
                      activeIndex.toString() == [index, listIndex].toString() ? 'active' : ''
                    ]"
                    @click="secondChangeItem(index, listIndex, list)"
                    :title="list.name"
                  >
                    <span>{{ list.name }}</span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="line_box">
              <div class="line"></div>
            </div>
          </li>
        </ul>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      selectTreeIndex: 0,
      menuTree: [{ childs: [{ childs: [] }] }],
      activeIndex: [0, 0],
      asideMinLengthFlag: true
    }
  },
  methods: {
    getMenuTree() {
      this.$http.getMenuTree().then((res) => {
        this.menuTree = res.data.data
        if (this.menuTree.length <= 1) {
          this.asideMinLengthFlag = false
        }
        this.getChangeItem()
      })
    },
    fristChangeItem(index) {
      this.selectTreeIndex = index
      this.activeIndex = [0, 0]
      let defaultPath = this.menuTree[this.selectTreeIndex].childs[0].childs[0].url
      this.$router.push(defaultPath)
      let indexObj = {
        firstIndex: this.selectTreeIndex,
        secondIndex: this.activeIndex
      }
      sessionStorage.setItem('indexObj', JSON.stringify(indexObj))
    },
    secondChangeItem(index, listIndex, list) {
      this.activeIndex = [index, listIndex]
      this.$router.push(list.url)
      let indexObj = {
        firstIndex: this.selectTreeIndex,
        secondIndex: this.activeIndex
      }
      sessionStorage.setItem('indexObj', JSON.stringify(indexObj))
      localStorage.setItem('defaultPath', this.menuTree[0].childs[0].childs[0].url)
    },
    getChangeItem() {
      let indexObj = JSON.parse(sessionStorage.getItem('indexObj'))
      if (!indexObj) {
        return
      }
      if (!this.menuTree[indexObj.firstIndex]) return
      this.selectTreeIndex = indexObj.firstIndex
      this.activeIndex = indexObj.secondIndex
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
    // background: $--color-primary;
    background: #25282b;
    transition: all 0.5s;
    .nav-item {
      height: 40px;
      line-height: 40px;
      padding: 0 12px;
      overflow: hidden;
      cursor: pointer;
      &--active {
        position: relative;
        background: $--color-primary;
        color: #ffffff;
      }
    }
  }
}
.level_content {
  height: 100%;
  background-color: $--color-primary;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
  .second_level {
    width: 100%;
    min-height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    padding-bottom: 57px;
    .second_level_item {
      .level_item_title {
        font-size: 14px;
        color: #ffffff;
        height: 40px;
        // line-height: 40px;
        display: flex;
        align-items: center;
      }
      .level_item_content {
        .third_level {
          display: flex;
          flex-wrap: wrap;
          .third_level_name {
            height: 40px;
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #ffffff;
            width: 50%;
            box-sizing: border-box;
            .third_level_name_content {
              padding: 6px 9px;
              border-radius: 3px;
              color: #ffffff;
              cursor: pointer;
              max-width: 72px;
              height: 14px;
              line-height: 14px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: clip;
              &:hover {
                background-color: rgba(255, 255, 255, 0.1);
              }
              &.active {
                background-color: #ffffff;
                color: $--color-primary;
              }
              span {
                display: inline-block;
                width: 100%;
                height: 100%;
                overflow: hidden;
              }
            }
          }
        }
      }
      .line_box {
        width: 100%;
        height: 12px;
        display: flex;
        align-items: center;
        .line {
          width: 100%;
          height: 1px;
          background-color: #3e6094;
        }
      }
      &:nth-last-child(1) {
        .line_box {
          display: none;
        }
      }
    }
  }
}
</style>
