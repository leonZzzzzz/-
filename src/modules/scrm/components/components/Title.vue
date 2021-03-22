<template>
  <!-- 一级标题 参考客户群发详情 xfo -->
  <!-- 
  【引入示例】
  import Title from '../../../components/components/Title.vue'

  【使用示例】
  <Title>基础信息</Title>

  【属性】
  无
  
  【方法】
  无
 -->
  <div>
    <div class="title"><slot></slot></div>
  </div>
</template>

<script>
export default {}
</script>
<style lang="scss" scoped>
.title {
  font-size: 16px;
  color: #606266;
  padding: 10px 0;
  position: relative;
  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 20px;
    background-color: #294a7b;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    left: -20px;
  }
}
</style>
