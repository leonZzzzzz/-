<template>
  <div class="sta-box">
    <div class="sta-box-title">{{ signTitle }}<span v-if="isMore">更多</span></div>
    <div class="sta-box-list">
      <ul>
        <li v-for="(item, index) in list" :key="index" @click="jumpTo(item.url)">
          <p class="title">{{ item.title }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    signTitle: {
      type: String,
      default: 'Demo'
    },
    isMore: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => {
        return listObj
      }
    }
  },
  methods: {
    jumpTo(url) {
      if (url) window.open(url, '_blank');
    }
  }
}
</script>

<style lang="scss" scoped>
.sta-box {
  margin-bottom: 20px;
  padding: 20px;
  width: 230px;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #fff;
}
.sta-box-title {
  font-size: 15px;
  color: #202020;
  font-weight: bold;
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f5f5f5;
  span {
    font-size: 12px;
    color: #a3a2a2;
    cursor: pointer;
    &:hover {
      color: #294a7b;
    }
  }
}
.sta-box-list {
  ul {
    li {
      padding-top: 20px;
      font-size: 14px;
      .title {
        flex: 1;
        color: #a6a6a6;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>