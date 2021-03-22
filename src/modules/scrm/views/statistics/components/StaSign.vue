<template>
  <div class="sta-sign">
    <div class="sta-sign-title">{{ signTitle }}<span v-if="isMore">更多</span></div>
    <div class="sta-sign-list">
      <ul>
        <li v-for="(item, index) in list" :key="index">
          <p class="title">{{ item.title }}</p>
          <p class="time" v-if="item.time">{{ item.time }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const listObj = [
  {
    title: '3.5.1版本新功能介绍',
    time: '01.29'
  },
  {
    title: '3.5.1版本新功能介绍',
    time: '01.29'
  },
  {
    title: '3.5.1版本新功能介绍',
    time: '01.29'
  },
  {
    title: '3.5.1版本新功能介绍',
    time: '01.29'
  },
  {
    title: '3.5.1版本新功能介绍',
    time: '01.29'
  }
]
export default {
  props: {
    signTitle: {
      type: String,
      default: '公告'
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
  }
}
</script>

<style lang="scss" scoped>
.sta-sign {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
}
.sta-sign-title {
  font-size: 14px;
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
.sta-sign-list {
  ul {
    li {
      padding-top: 20px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        flex: 1;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .time {
      font-size: 12px;
      color: #a3a2a2;
      padding-left: 5px;
    }
  }
}
</style>