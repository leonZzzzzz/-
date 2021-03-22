<template>
  <div class="qc-hot-zone">
    <img v-if="options.data.iconUrl" :src="imgHost + options.data.iconUrl" width="100%" />
    <div
      v-for="(item, index) in options.data.item"
      :key="index"
      :style="
        `background:rgba(0, 0, 0, 0.5);border:1px solid #fff;position:absolute;top:${item.top}px;left:${item.left}px;width:${item.width}px;height:${item.height}px`
      "
    ></div>
  </div>
</template>

<script>
export default {
  name: 'QcHotZone',
  title: '热区',
  props: {
    options: Object
  },
  config: [
    {
      label: '热区配置',
      type: 'qc-hot-zone-dialog',
      formName: 'data',
      value: {
        iconUrl: '',
        item: []
      }
    }
  ]
}
</script>

<style lang="scss" scoped>
.qc-hot-zone {
  position: relative;
  overflow: hidden;
  background: #f2f2f2;
  min-height: 50px;
}
</style>
