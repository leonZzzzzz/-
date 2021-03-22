<template>
  <div class="qc-customer-service">
    <img width="100%" :src="imgHost + options.icon" />
  </div>
</template>

<script>
export default {
  disabled: true,
  name: 'QcCustomerService',
  max: 1,
  title: '客服组件',
  props: {
    options: Object
  },
  config: [
    {
      label: '客服图片',
      formName: 'icon',
      type: 'qc-image-upload',
      value: '/flywheel/static/kf.png'
    }
  ]
}
</script>

<style lang="scss" scoped>
.qc-customer-service {
  position: fixed;
  bottom: 70px;
  right: 30px;
  width: 35px;
  height: 35px;
  padding: 5px;
  background: rgba(27, 27, 27, 0.4);
  border-radius: 50%;
  z-index: 1000;
}
</style>
