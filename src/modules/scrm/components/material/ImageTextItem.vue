<template>
  <div class="material-item">
    <div class="item-content">
      <div class="item-title">{{ item.name }}</div>
      <div class="image-text">
        <img class="item-img" :src="`${imgHost}${item.imageUrl}`" alt="" />
        <div class="item-right">{{ item.content }}</div>
      </div>
      <div class="item-link">
        链接:
        <a :href="item.link" target="_blank" style="color: #3977ff">{{ item.link }}</a>
      </div>
    </div>
    <div class="item-footer">
      <div class="footer-left">
        <span>新增人:{{ item.createBy }}</span>
        <span>来源:{{ item.source }}</span>
      </div>
      <div class="footer-right">
        <i class="el-icon-edit-outline edit-icon" />
        <i class="el-icon-delete delete-icon" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.material-item {
  width: 366px;
  margin: 10px;
  box-sizing: border-box;
  .item-content {
    width: 100%;
    height: 214px;
    padding: 20px;
    border: 1px solid #7b8190;
    box-sizing: border-box;
    overflow: hidden;
    .item-title {
      margin-bottom: 10px;
      color: #7b8190;
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .image-text {
      display: flex;
      .item-img {
        display: block;
        width: 120px;
        height: 120px;
      }
      .item-right {
        font-size: 13px;
        color: #7b8190;
        line-height: 24px;
        overflow: hidden;
        margin-left: 10px;
      }
    }
    .item-link {
      margin: 10px 0;
      color: #7b8190;
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .item-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 5px 0;
    color: #7b8190;
    font-size: 13px;
    .footer-left {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        margin-right: 10px;
      }
    }
    .footer-right {
      .edit-icon {
        color: #294a7b;
        margin-right: 10px;
        font-size: 16px;
      }
      .delete-icon {
        font-size: 16px;
      }
    }
  }
}
</style>
