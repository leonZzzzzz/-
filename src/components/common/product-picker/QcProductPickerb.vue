<template>
  <div class="qc-product-picker" v-if="visible">
    <div class="qc-product-picker__mask"></div>
    <transition name="slide-fade">
      <div v-if="show" class="qc-product-picker__container">
        <i class="qc-product-picker__close el-icon-close" @click="onClose()"></i>
        <ul class="qc-product-picker__type-wrap">
          <li
            v-if="!type || type == 'page'"
            @click="onChangeType('page')"
            class="qc-product-picker__type-wrap__list"
            :class="{ 'qc-product-picker__type-wrap__list--activity': selectType == 'page' }"
          >
            页面
          </li>
          <li
            v-if="!type || type == 'product'"
            @click="onChangeType('product')"
            class="qc-product-picker__type-wrap__list"
            :class="{ 'qc-product-picker__type-wrap__list--activity': selectType == 'product' }"
          >
            产品
          </li>
        </ul>
        <div v-if="selectType == 'product'">
          <el-tabs v-model="selectModule" type="card" v-if="module == ''">
            <el-tab-pane :label="title" :name="value" v-for="(title, value) in modules" :key="value">
              <component v-if="selectModule == value" :is="value" @on-select-row="onSelectRow" />
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-model="selectModule" type="card" v-else>
            <el-tab-pane :label="modules[module]" :name="module">
              <component :is="module" @on-select-row="onSelectRow" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-if="selectType == 'page'">
          <Page @on-select-row="onSelectRow"></Page>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Page from './Page'
import Mall from './product/Mall'
import MallGroupShopping from './product/MallGroupShopping'
import Activity from './product/Activity'
import Survey from './product/Survey'
import Channel from './product/Channel'
import News from './product/News'
import Project from './product/Project'
export default {
  components: {
    Mall,
    MallGroupShopping,
    Activity,
    Page,
    Survey,
    Channel,
    News,
    Project
  },
  props: {
    type: {
      validator: (value) => {
        return ['', 'product', 'page', 'custom'].includes(value)
      }
    },
    module: {
      validator: (value) => {
        return ['', 'Mall', 'MallGroupShopping', 'Activity', 'Lesson', 'News', 'Survey', 'Channel', 'News'].includes(
          value
        )
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      selectType: 'product',
      selectModule: '',
      modules: {
        Activity: '活动',
        News: '图文',
        Channel: '渠道',
        Project: '小程序'
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        setTimeout(() => {
          this.show = val
        }, 100)
      }
    },
    module: {
      handler(val) {
        if (val == '') {
          this.selectModule = 'Activity'
        } else {
          this.selectModule = val
        }
      },
      immediate: true
    },
    type: {
      handler(val) {
        if (val == '') {
          this.selectType = 'page'
        } else {
          this.selectType = val
        }
      },
      immediate: true
    }
  },
  methods: {
    onChangeType(type) {
      this.selectType = type
    },
    onSelectRow(row) {
      this.onClose(row)
    },
    onClose(row = null) {
      this.show = false
      setTimeout(() => {
        this.$emit('close', row)
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100%);
}
.qc-product-picker {
  &__mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.65);
  }
  &__container {
    position: fixed;
    width: 75%;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 101;
    background: #fff;
    padding: 25px;
  }
  &__close {
    position: absolute;
    left: -30px;
    background: #ff5433;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    top: 0;
    font-size: 24px;
    color: #fff;
    cursor: pointer;
  }
  &__type-wrap {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
    &__list {
      cursor: pointer;
      background: #eaeaea;
      padding: 0px 25px;
      font-size: 14px;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 25px;
      height: 34px;
      line-height: 34px;
      &--activity {
        background: $--color-primary;
        color: #fff;
      }
    }
  }
}
</style>
