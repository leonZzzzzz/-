<template>
  <div class="material-item">
    <div class="item-content">
      {{ item.content }}
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
    padding: 10px;
    border: 1px solid #7b8190;
    box-sizing: border-box;
    overflow: hidden;
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
