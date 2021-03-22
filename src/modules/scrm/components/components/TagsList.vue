<template>
<!-- xfo -->
  <div class="xfo-tags">
    <el-button icon="el-icon-plus" circle size="mini"></el-button>
    <ul>
      <li v-for="group in data" :key="group.id">
        <div class="xfo-item-title">{{ group.name }}</div>
        <div class="xfo-item-content">
          <el-button class="xfo-tag" plain size="mini" v-for="tag in group.tagList" :key="tag.id">{{
            tag.name
          }}</el-button>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.xfo-tags {
  background-color: #f4f4f4;
  padding: 40px 20px 10px;
  .xfo-item-title {
    font-size: 14px;
    color: #606266;
    padding: 5px 0 15px 0;
  }
  .xfo-item-content {
    .xfo-tag {
      margin: 0 10px 10px 0;
    }
  }
}
</style>
