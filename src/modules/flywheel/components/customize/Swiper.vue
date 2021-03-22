<template>
  <div :style="style">
    <el-carousel
      class="qc-swiper"
      :autoplay="options.autoplay"
      :height="options.height + 'px'"
      :interval="options.interval"
      arrow="none"
    >
      <el-carousel-item v-for="(item, index) in options.item" :key="index">
        <img class="qc-swiper__image" v-if="item.iconUrl" :src="imgHost + item.iconUrl" />
      </el-carousel-item>
    </el-carousel>
    <QcSplit v-if="options.needSplit" :options="{ height: 15, backgroundColor: '#f1f1f1' }" />
  </div>
</template>

<script>
import QcSplit from './Split'
export default {
  components: {
    QcSplit
  },
  name: 'QcSwiper',
  title: '轮播图',
  props: {
    options: Object
  },
  config: [
    { formName: 'autoplay', label: '自动播放', type: 'el-switch', value: false },
    { formName: 'indicatorDots', label: '指示点', type: 'el-switch', value: true },
    { formName: 'needSplit', label: '需要间隔', type: 'el-switch', value: false },
    {
      formName: 'interval',
      label: '轮播间隔',
      type: 'el-input-number',
      value: 3000,
      props: { step: 1000 }
    },
    { formName: 'height', label: '图片高度', type: 'el-input-number', value: 180 },
    { formName: 'margin', label: '左右间距', type: 'el-input-number', value: 0 },
    { formName: 'borderRadius', label: '圆角', type: 'el-input-number', value: 0 },
    {
      formName: 'item',
      label: '数据源',
      type: 'qc-uploader',
      value: []
    }
  ],
  computed: {
    style() {
      return {
        margin: `0 ${this.options.margin}px`,
        overflow: 'hidden',
        borderRadius: this.options.borderRadius + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.qc-swiper {
  background: #f1f1f1;
  &__image {
    width: 100%;
    display: block;
  }
}
</style>
