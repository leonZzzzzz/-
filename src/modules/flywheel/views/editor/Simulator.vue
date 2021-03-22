<template>
  <div class="simulator">
    <header
      class="simulator__header"
      :style="{
        background: window.options.navigationBarBackgroundColor,
        color: window.options.navigationBarTextStyle
      }"
    >
      <img
        src="./img/status_bar.png"
        width="100%"
      />
      <img
        src="./img/menu.png"
        class="simulator__header-menu"
      />
      <p
        v-if="!currentPage.isCustomNavigation"
        class="title"
      >{{ currentPage.navigationBarTitleText }}</p>
      <div
        v-else
        class='personal-center'
      >
        <img
          class='avatar'
          src='http://wx.qlogo.cn/mmhead/0sDCa2E8S1uD0yhBkCDIObtoDLwiagu0cvwUwnsX5zBgoia4YavzTOJQ/0'
        />
        <span class="name">个人中心</span>
      </div>
    </header>
    <section
      class="simulator__main"
      :style="{ background: currentPage.background }"
    >
      <div
        v-if="currentPage.isHeaderColor"
        :style="
          `height: ${currentPage.height}px;background: ${theme.color1};position: absolute;top: 0;left: 0;right: 0;`
        "
      ></div>
      <div class="simulator__move">
        <div v-if="currentPage.isSystem">
          <SimulatorPersonal v-if="currentPage.pagePath == 'pages/my/index'" />
          <img
            v-else
            :src="imgHost + currentPage.pageImg"
            width="100%"
          />
        </div>
        <template
          v-else
          v-for="component in simulatorComponent"
        >
          <div
            class="comp-wrap"
            :key="component.id"
            v-if="currentPage.id == component.pageId && !component.disabled"
            @click="updateCurrentComponent(component)"
          >
            <div
              class="border"
              :class="{ 'border-active': component.id == currentComponent.id }"
            ></div>
            <i
              class="comp-icon el-icon-remove"
              @click.stop="removeComponentToSimulator(component.id)"
            ></i>
            <component
              :is="component.name"
              :options="component.options"
            ></component>
          </div>
        </template>
        <template v-for="component in simulatorComponent">
          <div
            :key="component.id"
            v-if="currentPage.id == component.pageId && component.disabled"
            style="position: fixed;bottom: 70px;right: 30px;width: 46px;height: 46px;z-index:10000"
          >
            <div style="position: relative;width: 45px;height: 45px;">
              <i
                style="position: absolute;z-index:10000;color:#ff5433;right:-5px;top:-5px"
                class="el-icon-remove"
                @click.stop="removeComponentToSimulator(component.id)"
              ></i>
              <component
                @click.native.stop="updateCurrentComponent(component)"
                :is="component.name"
                :options="component.options"
              ></component>
            </div>
          </div>
        </template>
      </div>
      <div
        class="simulator__tabbar"
        :style="{
          background: tabbar.options.backgroundColor,
          borderTop: `1px solid ${tabbar.options.borderStyle}`
        }"
      >
        <template v-for="page in pageList">
          <div
            class="tab"
            v-if="page.isShow"
            :key="page.id"
            @click="updateCurrentPageId(page.id)"
          >
            <img
              v-if="page.id != currentPageId && page.iconPath"
              class="tab-icon"
              height="25"
              width="25"
              :src="imgHost + page.iconPath"
            />
            <img
              v-if="page.id == currentPageId && page.selectedIconPath"
              class="tab-icon"
              height="25"
              width="25"
              :src="imgHost + page.selectedIconPath"
            />
            <p
              class="tab-text"
              :style="{
                color: currentPageId == page.id ? tabbar.options.selectedColor : tabbar.options.color
              }"
            >
              {{ page.text }}
            </p>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script>
import SimulatorPersonal from './SimulatorPersonal'
import index from '@/modules/flywheel/mixins'
import Sortable from 'sortablejs'
import _ from 'lodash'

export default {
  components: {
    SimulatorPersonal
  },
  mixins: [index],
  mounted() {
    this.onComponentSort()
    this.onTabbarSort()
  },
  methods: {
    onComponentSort() {
      const el = document.querySelector('.simulator__move')
      this.sortable = new Sortable.create(el, {
        filter: '.filter',
        ghostClass: 'sortable-ghost',
        draggable: '.comp-wrap',
        animation: 200,
        onEnd: evt => {
          let simulatorComponentList = _.cloneDeep(this.simulatorComponent)
          // 当前选中页面存在的组件
          let currentPageComponentList = simulatorComponentList.filter(item => item.pageId === this.currentPage.id)
          // 查询替换的两个数据在所有页面的组件集合中，所属的下标
          let oldIndex = simulatorComponentList.findIndex(item => {
            return item.id === currentPageComponentList[evt.oldIndex].id
          })
          let newIndex = simulatorComponentList.findIndex(item => {
            return item.id === currentPageComponentList[evt.newIndex].id
          })
          const targetRow = simulatorComponentList.splice(oldIndex, 1)[0]
          simulatorComponentList.splice(newIndex, 0, targetRow)
          this.updateComponentToSimulator(simulatorComponentList)
        }
      })
    },
    onTabbarSort() {
      const el = document.querySelector('.simulator__tabbar')
      this.sortable = new Sortable.create(el, {
        draggable: '.tab',
        animation: 200,
        onEnd: evt => {
          let newPage = _.cloneDeep(this.pageList)
          const targetRow = newPage.splice(evt.oldIndex, 1)[0]
          newPage.splice(evt.newIndex, 0, targetRow)
          this.updatePageList(newPage)
        }
      })
    },
    /**
     * 移除仿真器的组件
     * @param {number} id 组件
     */
    removeComponentToSimulator(id) {
      let simulatorComponent = _.cloneDeep(this.simulatorComponent)
      simulatorComponent.forEach((component, index) => {
        if (id === component.id) {
          simulatorComponent.splice(index, 1)
        }
      })
      this.updateComponentToSimulator(simulatorComponent)
      this.updateCurrentComponent({})
    }
  }
}
</script>

<style lang="scss" scoped>
.simulator {
  width: 375px;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 10px #dedede;
  box-sizing: border-box;
  background: #fff;
  bottom: 20px;
  z-index: 10;
  &__header {
    height: 64px;
    text-align: center;
    position: relative;
    &-menu {
      width: 80px;
      position: absolute;
      right: 10px;
      top: 26px;
    }
    .title {
      line-height: 40px;
    }
    .personal-center {
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      flex-shrink: 0;
      margin-right: 10px;
      margin-left: 10px;
      margin-top: 3px;
      padding: 3px;
      width: 100px;
      height: 32px;
      border-radius: 16px;
      background: #fff;
      border: 1px solid #eee;
      color: #000;
      .avatar {
        width: 26px;
        height: 26px;
        border-radius: 13px;
        margin-right: 3px;
        overflow: hidden;
      }
      .name {
        text-align: center;
        flex: 1;
        font-size: 12px;
      }
    }
  }
  &__main {
    flex: 1;
    position: relative;
    overflow-y: auto;
    padding-bottom: 52px;
    &::-webkit-scrollbar {
      display: none;
    }
    .simulator__tabbar {
      height: 50px;
      width: 100%;
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 10;
      .tab {
        padding: 5px 0;
        flex: 1;
        text-align: center;
        display: flex;
        flex-flow: column;
        justify-content: center;
        &-icon {
          width: 25px;
          height: 25px;
          margin: 0 auto;
          display: block;
        }
        &-text {
          margin-top: 5px;
          font-size: 12px;
        }
      }
    }
    .comp-wrap {
      position: relative;
      cursor: move;
      &:hover {
        .border {
          border: 2px dashed #b3b3b3;
          border-radius: 2px;
        }
        .comp-icon {
          display: block;
        }
      }
      .comp-icon {
        display: none;
        position: absolute;
        right: 5px;
        top: 5px;
        font-size: 18px;
        color: #ff5433;
        cursor: pointer;
        z-index: 10;
      }
      .border {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 10;
        border-radius: 2px;
      }
      .border-active {
        border: 2px #ff5433 solid !important;
      }
    }
  }
  &__footer {
    height: 64px;
    background: red;
  }
}
</style>
