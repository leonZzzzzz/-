<template>
  <div class="qc-product-item">
    <el-image
      class="qc-product-item__cover"
      :style="{ height: imgHeight, width: imgWidth }"
      :src="!/http/.test(img) ? imgHost + img : img"
      fit="cover"
    ></el-image>
    <div class="qc-product-item__wrap">
      <p class="title">{{ title }}</p>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgWidth: { type: String, default: '60px' },
    imgHeight: { type: String, default: '60px' },
    img: String,
    title: String
  }
}
</script>

<style lang="scss" scoped>
.qc-product-item {
  display: flex;
  &__wrap {
    flex: 1;
    margin-left: 20px;
    .title {
      margin-bottom: 5px;
      height: 40px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
