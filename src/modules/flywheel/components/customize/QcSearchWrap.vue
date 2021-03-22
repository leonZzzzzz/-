<template>
  <div class="qc-search-wrap">
    <div class="qc-search-wrap__input" :style="{ background: colors.color2 }">
      <i class="el-icon-search"></i>
      找一找，查一查
    </div>
    <el-image :src="imgHost + options.icon" style="width: 38px;height: 38px;margin-left: 15px;"></el-image>
  </div>
</template>

<script>
export default {
  name: 'QcSearchWrap',
  title: '搜索栏',
  props: {
    options: Object
  },
  config: [
    { label: '显示客服', type: 'el-switch', value: false, formName: 'isService' },
    {
      label: '客服图标',
      type: 'qc-image-upload',
      value: '/flywheel/static/kf.png',
      formName: 'icon'
    }
  ],
  computed: {
    colors() {
      return this.$store.getters['editor/theme']
    }
  }
}
</script>

<style lang="scss" scoped>
.qc-search-wrap {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  &__input {
    color: #fff;
    padding: 10px 15px;
    border-radius: 25px;
    flex: 1;
  }
}
</style>
