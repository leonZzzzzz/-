<template>
  <el-button
    v-if="selectedKeyWords.length == 0"
    @click="getKeySear()"
  ><i class="el-icon-plus"></i>添加</el-button>
  <div
    v-else
    style="display:flex;flex-wrap:wrap"
  >
    <div
      class="havekey"
      v-for="(item, i) in selectedKeyWords"
      :key="i"
    >{{ item }}<i class="el-icon-circle-close keydelete" @click="selectedKeyWords.splice(i,1),selectedKeyWordIds.splice(i,1)"></i></div>
    <el-button
      class="haveedit"
      size="mini"
      @click="getKeySear()"
    ><i class="el-icon-edit"></i>编辑</el-button>
  </div>
</template>

<script>
export default {
  props: {
    selectedKeyWords: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectedKeyWordIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      keyslist: []
    }
  },
  mounted() {},
  methods: {
    // 获取关键字列表
    getKeySear() {
      this.$http.searchKeyWord().then(res => {
        this.keyslist = res.data.data.list
        this.keyslist.forEach(item => {
          item.checked = false
        })
        console.log(this.keyslist)
        this.$emit('getkeywordlist', this.keyslist, true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.keys {
  padding: 8px 24px;
  border-radius: 4px;
  background-color: #e8e7e6;
  margin-right: 10px;
  margin-bottom: 8px;
  cursor: pointer;
}
.activekey {
  background-color: #294a7b;
  color: #ffffff;
}
.add-btn {
  padding: 8px 24px;
  border-radius: 4px;
  background-color: #ffffff;
  margin-right: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  border: 1px solid #e8e7e6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #294a7b;
}
.havekey {
  margin-right: 10px;
  margin-bottom: 8px;
  padding: 0px 24px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  background-color: #e8e7e6;
  position: relative;
  .keydelete {
    position: absolute;
    top: 0;
    right: 0;
    display: none;
  }
}
.havekey:hover .keydelete {
  display: block;
}
.haveedit {
  margin-right: 10px;
  margin-bottom: 8px;
  padding: 0px 15px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
}
</style>
