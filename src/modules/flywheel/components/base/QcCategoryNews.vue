<template>
  <div>
    <div class="category-list-wrap" style="background: #f8f8f8">
      <div
        v-for="item in options.categoryList"
        class="category-list-wrap__item"
        :key="item.id"
        :style="`color: ${options.color}`"
      >
        {{ item.name }}
      </div>
    </div>
    <img src="./img/QcCategoryNews.jpg" width="100%" />
  </div>
</template>

<script>
export default {
  name: 'QcCategoryNews',
  title: '图文分类模块',
  props: {
    options: Object
  },
  config: [
    {
      formName: 'categoryList',
      label: '关联分类',
      type: 'qc-category-picker',
      value: [
        {
          name: '全部',
          id: ''
        }
      ],
      props: {
        type: 8
      }
    },
    {
      formName: 'activeBackgroundColor',
      label: '选中背景色',
      type: 'el-color-picker',
      value: '#777'
    },
    {
      formName: 'activeColor',
      label: '选中文本色',
      type: 'el-color-picker',
      value: '#777'
    },
    {
      formName: 'color',
      label: '未选中文本色',
      type: 'el-color-picker',
      value: '#777'
    }
  ]
}
</script>

<style lang="scss" scoped>
.category-list-wrap {
  overflow-x: auto;
  &__item {
    float: left;
    padding: 8px 18px;
    background: #e4e4e4;
    margin-left: 15px;
    border-radius: 20px;
    font-size: 14px;
    color: #777;
  }
}
</style>
