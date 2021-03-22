<template>
  <div class="source-data-wrap">
    <template v-if="valueType">
      <div
        style="margin-bottom: 10px;"
        v-for="(item, index) in value"
        :key="index"
      >
        <div class="qc-data-source__item">
          <div>
            <QcImageUpload
              :value="item.iconUrl"
              width="67px"
              height="67px"
              :is-prefix="!/http/.test(item.iconUrl)"
              @input="changeCustomData($event, index, 'iconUrl')"
              style="border:none;border-right:1px solid #eee;"
            ></QcImageUpload>
          </div>
          <div class="qc-data-source__item-text">
            <el-input
              v-if="isChangeName"
              :value="item.name"
              @input="changeCustomData($event, index, 'name')"
            ></el-input>
            <div
              v-else
              class="text"
              style="background: #e8e8e847;color: #b9b9b9;"
            >{{ item.name }}</div>
            <div
              class="text"
              @click="onQcProductPickerShow(index)"
            ><i class="el-icon-paperclip" />&nbsp;关联产品</div>
          </div>
          <div
            class="qc-data-source__item-remove"
            @click="delSource(index)"
          >
            <i class="el-icon-delete"></i>
          </div>
        </div>
        <p
          style="cursor: default;color: #2196f3;font-size: 14px;line-height: 1;margin: 10px 0 5px 84px;display: inline-block;"
          v-if="item.url"
          @click="onParamsVisibleShow(index)"
        >
          添加自定义参数
        </p>
      </div>
    </template>
    <div v-else>
      <p
        @click="productPickerVisible = true"
        style="position: relative;color: #606266;padding-left: 15px;border: 1px solid #dcdfe6;border-radius: 4px;height: 32px;line-height: 32px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;padding-right: 15px;"
      >
        {{ value }}
      </p>
      <p
        style="cursor: default;color: #2196f3;font-size: 14px;line-height: 1;margin: 10px 0 5px 15px;display: inline-block;"
        v-if="value"
        @click="onParamsVisibleShow()"
      >
        添加自定义参数
      </p>
    </div>
    <el-button
      style="width:100%"
      type="primary"
      @click="addSource()"
      icon="el-icon-plus"
      v-if="valueType && value.length < max"
    >&nbsp;&nbsp;添加数据源</el-button>
    <QcProductPicker
      :type="type"
      :module="module"
      :beform-value="model"
      :visible="productPickerVisible"
      @close="onQcProductPickerClose"
    ></QcProductPicker>
    <QcParamsDialog
      :visible="paramsVisible"
      :url="url"
      @close="onParamsVisibleClose"
    ></QcParamsDialog>
  </div>
</template>

<script>
// 解决分类 各种详情的加载情况
import _ from 'lodash'
export default {
  props: {
    // 类型
    type: {
      type: Array,
      default: () => {
        return ['product', 'page', 'miniApp']
      }
    },
    // 加载那些模块
    module: {
      type: Array,
      default: () => {
        return [
          'Mall',
          'MallGroupShopping',
          'ProductCategory',
          'ProductLevel',
          'XiaoeTechCourseVip',
          'Activity',
          'Lesson',
          'News',
          'Survey',
          'Channel',
          'Donate',
          'DonateCategory'
        ]
      }
    },
    // 保存数据的格式
    value: {
      type: [Array, String],
      required: true
    },
    // 最多可添加多少
    max: {
      type: Number,
      default: 15
    },
    // 选择加载那些字段
    propsName: {
      type: String,
      default: ''
    },
    // 文本字段是否可以修改
    isChangeName: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      productPickerVisible: false,
      paramsVisible: false,
      url: '',
      model: {}
    }
  },
  computed: {
    newValue() {
      return _.cloneDeep(this.value)
    },
    valueType() {
      return typeof this.value !== 'string'
    }
  },
  methods: {
    changeCustomData($event, index, type) {
      this.newValue[index][type] = $event
      this.$emit('input', this.newValue)
    },
    addSource() {
      this.newValue.push({ name: '', iconUrl: '', url: '' })
      this.$emit('input', this.newValue)
    },
    delSource(index) {
      this.newValue.splice(index, 1)
      this.$emit('input', this.newValue)
    },
    onQcProductPickerShow(index) {
      this.sourceIndex = index
      this.model = JSON.parse(JSON.stringify(this.value[index]))
      this.productPickerVisible = true
    },
    onQcProductPickerClose(data) {
      if (data) {
        if (this.valueType) {
          let _model = {}
          // 此为动态字段，看传入的需要什么字段
          if (this.propsName !== '') {
            this.propsName.split(',').map(key => {
              _model[key] = data[key]
            })
          }
          // 此为固定字段，无论如何都会返回
          if (data.id) _model.id = data.id
          if (data.storeId) _model.storeId = data.storeId

          _model.name = data.name || data.title || data.text
          // _model.name = this.model.name ? this.model.name : data.name || data.title || data.text
          _model.iconUrl = data.iconUrl || data.cover || data.icon
          // _model.iconUrl = this.model.iconUrl ? this.model.iconUrl : data.iconUrl || data.cover || data.icon
          _model.url = data.pagePath
          _model.pickerType = data.pickerType || data.module || ''
          this.newValue[this.sourceIndex] = _model
          this.$emit('input', this.newValue)
        } else {
          this.$emit('input', data.pagePath)
        }
      }
      this.productPickerVisible = false
    },
    onParamsVisibleShow(index) {
      if (this.valueType) {
        this.sourceIndex = index
        this.url = this.newValue[this.sourceIndex].url
      } else {
        this.url = this.newValue
      }
      this.paramsVisible = true
    },
    onParamsVisibleClose(url) {
      this.paramsVisible = false
      if (url) {
        if (this.valueType) {
          this.newValue[this.sourceIndex].url = url
          this.$emit('input', this.newValue)
        } else {
          this.$emit('input', url)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.source-data-wrap {
  .qc-data-source__item {
    display: flex;
    position: relative;
    border: 1px solid #eee;
    overflow: hidden;

    ::v-deep.el-input__inner {
      border: none;
    }
    .qc-data-source__item-text .text {
      width: 150px;
      height: 33px;
      line-height: 33px;
      padding-left: 15px;
      color: #606266;
      overflow: hidden;
      &:last-child {
        border-top: 1px solid #eee;
      }
    }
    &:hover {
      .qc-data-source__item-remove {
        right: 0;
      }
    }
    .qc-data-source__item-remove {
      position: absolute;
      top: 0;
      bottom: 0;
      color: #fff;
      background: #ff5433;
      line-height: 67px;
      width: 40px;
      text-align: center;
      font-size: 20px;
      right: -40px;
    }
  }
}
</style>
