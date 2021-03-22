<template>
  <div class="qc-product-picker" v-if="visible">
    <div class="qc-product-picker__mask"></div>
    <transition name="slide-fade">
      <div v-if="show" class="qc-product-picker__container">
        <i class="qc-product-picker__close el-icon-close" @click="onClose()"></i>
        <ul class="qc-product-picker__type-wrap">
          <template v-for="(list, index) in type">
            <li
              :key="index"
              @click="selectType = list"
              class="qc-product-picker__type-wrap__list"
              :class="{ 'qc-product-picker__type-wrap__list--activity': selectType == list }"
            >
              {{
                {
                  product: '产品',
                  page: '页面',
                  miniApp: '小程序'
                }[list]
              }}
            </li>
          </template>
        </ul>
        <div v-if="selectType == 'product'">
          <ul class="qc-product-picker__type-wrap">
            <template v-for="(list, index) in module">
              <li
                :key="index"
                @click="selectModule = list"
                class="qc-product-picker__type-wrap__list"
                :class="{ 'qc-product-picker__type-wrap__list--activity': selectModule == list }"
              >
                {{
                  {
                    Mall: '商品',
                    MallGroupShopping: '商品拼团',
                    ProductCategory: '商品分类',
                    ProductLevel: '商品等级',
                    MallStore: '店铺列表',
                    Activity: '活动',
                    Lesson: '课程',
                    Survey: '问卷',
                    Channel: '渠道',
                    News: '图文',
                    XiaoeTechCourseVip: '小鹅通会员课程',
                    Donate: '随喜乐捐',
                    DonateCategory: '随喜乐捐分类'
                  }[list]
                }}
              </li>
            </template>
          </ul>
          <div v-for="value in module" :label="value" :name="value" :key="value">
            <component v-if="selectModule == value" :is="value" @on-select-row="onSelectRow" />
          </div>
        </div>
        <div v-if="selectType == 'page'">
          <Page @on-select-row="onSelectRow"></Page>
        </div>
        <div v-if="selectType == 'miniApp'">
          <Weapp :beform-value="beformValue" @on-success="onSelectRow"></Weapp>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Page from './Page'
import Weapp from './Weapp'
import Mall from './product/Mall'
import MallGroupShopping from './product/MallGroupShopping'
import Activity from './product/Activity'
import Survey from './product/Survey'
import Channel from './product/Channel'
import News from './product/News'
import XiaoeTechCourseVip from './product/XiaoeTechCourseVip'
import Donate from './product/Donate'
import DonateCategory from './product/DonateCategory'
import ProductCategory from './product/ProductCategory'
import ProductLevel from './product/ProductLevel'
import MallStore from './product/MallStore'
export default {
  components: {
    Page,
    Weapp,
    Mall,
    MallGroupShopping,
    ProductCategory,
    ProductLevel,
    MallStore,
    Activity,
    Survey,
    Channel,
    News,
    XiaoeTechCourseVip,
    Donate,
    DonateCategory
  },
  props: {
    type: {
      validator: (value) => {
        const type = ['product', 'page', 'miniApp']
        if (Array.isArray(value) && value.length > 0) {
          for (let index = 0; index < value.length; index++) {
            if (!type.includes(value[index])) {
              console.error(`${value[index]}类型不包含在：${type.join('、')}内，请检查传入字段。`)
              return false
            }
          }
          return true
        } else {
          console.error('传递的值无效，需要一个数组且数组不能为空。')
        }
      }
    },
    module: {
      validator: (value) => {
        const module = [
          'Mall',
          'MallGroupShopping',
          'ProductCategory',
          'ProductLevel',
          'MallStore',
          'Activity',
          'Lesson',
          'News',
          'Survey',
          'Channel',
          'News',
          'XiaoeTechCourseVip',
          'Donate',
          'DonateCategory'
        ]
        if (Array.isArray(value) && value.length > 0) {
          for (let index = 0; index < value.length; index++) {
            if (!module.includes(value[index])) {
              console.error(`${value[index]}模块不包含在：${module.join('、')}内，请检查传入字段。`)
              return false
            }
          }
          return true
        } else {
          console.error('传递的值无效，需要一个数组且数组不能为空。')
        }
      }
    },
    beformValue: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 控制动画的
      show: false,
      // 选中的类型
      selectType: '',
      // 选中的模块
      selectModule: ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        setTimeout(() => {
          this.show = val
        }, 100)
      } else {
        this.selectType = this.selectModule = ''
      }
    },
    selectType: {
      handler(val) {
        val ? (this.selectType = val) : (this.selectType = this.type[0])
      },
      immediate: true
    },
    selectModule: {
      handler(val) {
        val ? (this.selectModule = val) : (this.selectModule = this.module[0])
      },
      immediate: true
    }
  },
  methods: {
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
    width: 65%;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 101;
    background: #fff;
    padding: 25px;
    overflow: auto;
  }
  &__close {
    position: absolute;
    left: 0px;
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
    margin-top: 10px;
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
