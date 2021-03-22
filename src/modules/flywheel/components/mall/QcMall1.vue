<template>
  <div class="qc-shopping2">
    <div class="banner">
      <el-image
        class="banner__cover"
        :src="imgHost + options.cover"
      >
        <div
          slot="error"
          class="el-image__error"
        >请上传图片，建议尺寸345*150</div>
      </el-image>
      <div
        class="banner__text-warp"
        :style="{ color: options.color }"
      >
        <p class="banner__title">{{ options.title }}</p>
        <p class="banner__info">{{ options.info }}</p>
      </div>
    </div>
    <img
      src="./img/mall1.jpg"
      width="100%"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'QcMall1',
  title: '商城组件',
  props: {
    options: Object
  },
  config: [
    { formName: 'cover', label: '封面图', type: 'qc-image-upload', value: '' },
    {
      formName: 'dataType',
      label: '加载方式',
      type: 'el-select',
      value: 'custom',
      tips: '选择分类时，请把多余的自定义数据删除，数据源里只能有一个分类',
      options: [
        { label: '自定义', value: 'custom' },
        { label: '商品分类', value: 'ProductCategory' }
      ]
    },
    {
      formName: 'item',
      label: '自定义数据',
      type: 'qc-uploader',
      value: [],
      props: {
        type: ['product'],
        module: ['Mall', 'ProductCategory'],
        propsName: 'iconUrl,id,price,name,origPrice,storeId'
      }
    }
  ]
}
</script>

<style lang="scss" scoped>
.banner {
  position: relative;
  height: 150px;
  padding-top: 15px;
  margin: 0 15px 15px;
  &__cover {
    height: 150px;
    width: 100%;
    vertical-align: top;
  }
  &__text-warp {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  &__title {
    font-size: 26px;
    margin-bottom: 10px;
  }
  &__info {
    font-size: 14px;
  }
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent white transparent;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
