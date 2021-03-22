<template>
  <!-- 返回上一级 参考新建企业动态圈 xfo-->
  <!-- 
    使用方式
    1. 引入组件 
    示例：
    import GoBack from '../../../components/components/GoBack.vue'
    2. 使用组件
    示例：
    <GoBack title="所在群聊"></GoBack>
    参数：
    名称        类型                   示例                                       说明
    title    string                 这是标题                                    可选，返回标题，默认为‘详情’
  -->
  <div>
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="goBack">{{ title }}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 返回标题
    title: {
      type: String,
      default: '详情'
    }
  },
  methods: {
    goBack() {
      this.$openNewPageBack()
    }
  }
}
</script>
<style lang="scss" scoped>
.header_nav {
  padding-bottom: 20px; // 保持上下距离一致，可取消
}
</style>
