<template>
  <!-- 数据统计卡 参考客户群发详情  xfo-->
  <!-- 
    import Card from '../../../components/components/Card.vue'
    <Card title="送达客户">{{ detailsList.sendSuccessQuantity || 0 }} </Card>
 -->
  <div>
    <div class="card">
      <p class="tit">{{ title }}</p>
      <p class="num"><slot></slot></p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'card'
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 300px;
  height: 120px;
  border: 1px solid #cccccc;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
  color: #606266;
  border-radius: 3px;
  font-size: 14px;
  user-select: none;
  .tit,
  .num {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .num {
    font-size: 30px;
  }
  &:hover {
    border-color: #294a7b;
    color: #294a7b;
  }
}
</style>
