<template>
  <div class="me-image-group">
    <div v-if="options.style == 'img-style-col1'" class="img-style-col1">
      <div class="group">
        <img :src="options.item[0].img" width="100%" />
      </div>
    </div>
    <div v-if="options.style == 'img-style-col2'" class="img-style-col2" :class="[options.size]">
      <div class="group" v-for="(item, index) in 2" :key="index">
        <img :src="options.item[index].img" width="100%" />
      </div>
    </div>
    <div v-if="options.style == 'img-style-col3'" class="img-style-col3" :class="[options.size]">
      <div class="group" v-for="(item, index) in 3" :key="index">
        <img :src="options.item[index].img" width="100%" />
      </div>
    </div>
    <div v-if="options.style == 'img-style-col4'" class="img-style-col4" :class="[options.size]">
      <div class="group" v-for="(item, index) in 4" :key="index">
        <img :src="options.item[index].img" width="100%" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageGroup',
  title: '图片组',
  props: {
    options: Object
  },
  config: [
    {
      formName: 'style',
      label: '样式类型',
      type: 'el-radio-group',
      value: 'img-style-col2',
      options: [
        { value: 'img-style-col1', label: '单图' },
        { value: 'img-style-col2', label: '两图' },
        { value: 'img-style-col3', label: '三图' },
        { value: 'img-style-col4', label: '四图' }
      ]
    },
    {
      formName: 'size',
      label: '图片间隔',
      type: 'el-radio-group',
      value: 'img-split-none',
      options: [
        { value: 'img-split-none', label: '无' },
        { value: 'img-split-mini', label: '小' },
        { value: 'img-split-big', label: '大' }
      ]
    },
    {
      formName: 'item',
      label: '数据源',
      type: 'qc-uploader',
      value: [
        {
          url: '',
          text: '文本',
          img: 'https://iph.href.lu/200x240'
        },
        {
          url: '',
          text: '文本',
          img: 'https://iph.href.lu/200x240'
        },
        {
          url: '',
          text: '文本',
          img: 'https://iph.href.lu/200x240'
        },
        {
          url: '',
          text: '文本',
          img: 'https://iph.href.lu/200x240'
        }
      ]
    }
  ]
}
</script>

<style lang="scss" scoped>
@mixin imgStyleCol3($split-size) {
  .group {
    overflow: hidden;
  }
  .group:first-child {
    width: 46%;
    height: 200px;
    float: left;
  }
  .group:nth-child(2) {
    width: calc(54% - #{$split-size});
    height: calc(100px - #{$split-size / 2});
    margin-left: $split-size;
    float: left;
  }
  .group:nth-child(3) {
    width: calc(54% - #{$split-size});
    height: calc(100px - #{$split-size / 2});
    margin-top: $split-size;
    margin-left: $split-size;
    float: left;
  }
}
@mixin imgStyleCol4($split-size) {
  .group {
    overflow: hidden;
  }
  .group:first-child {
    width: 46%;
    height: 200px;
    float: left;
  }
  .group:nth-child(2) {
    width: calc(54% - #{$split-size});
    height: calc(100px - #{$split-size / 2});
    margin-left: $split-size;
    float: left;
  }
  .group:nth-child(3) {
    width: calc(27% - #{$split-size});
    height: calc(100px - #{$split-size / 2});
    margin-top: $split-size;
    margin-left: $split-size;
    float: left;
  }
  .group:nth-child(4) {
    width: calc(27% - #{$split-size});
    height: calc(100px - #{$split-size / 2});
    margin-top: $split-size;
    margin-left: $split-size;
    float: left;
  }
}
.me-image-group {
  img {
    display: block;
  }
  // 两张图片组件样式
  .img-style-col2 {
    column-count: 2;
    &.img-split-none {
      column-gap: 0px;
    }
    &.img-split-mini {
      column-gap: 2px;
    }
    &.img-split-big {
      column-gap: 8px;
    }
  }
  // 三张图片组件样式
  .img-style-col3 {
    &::after {
      content: '';
      display: block;
      clear: both;
    }
    &.img-split-none {
      $split-size: 0px;
      @include imgStyleCol3($split-size);
    }
    &.img-split-mini {
      $split-size: 2px;
      @include imgStyleCol3($split-size);
    }
    &.img-split-big {
      $split-size: 8px;
      @include imgStyleCol3($split-size);
    }
  }
  // 四张图片组件样式
  .img-style-col4 {
    &::after {
      content: '';
      display: block;
      clear: both;
    }
    &.img-split-none {
      $split-size: 0px;
      @include imgStyleCol4($split-size);
    }
    &.img-split-mini {
      $split-size: 2px;
      @include imgStyleCol4($split-size);
    }
    &.img-split-big {
      $split-size: 8px;
      @include imgStyleCol4($split-size);
    }
  }
}
</style>
