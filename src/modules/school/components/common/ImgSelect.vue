<template>
  <el-dialog
    title="选择图片顺序"
    :visible.sync="visible"
    width="760px"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="list">
      <div class="item" v-for="(item, i) in imgList" :key="i" @click="selectNum(item, i)">
        <div class="select" v-show="item.num > 0"></div>
        <img :src="imgHost + item.imageUrl" alt="">
      </div>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="onSuccess()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: Array
  },
  data() {
    return {
      imgList: [],
      count: 0
    }
  },
  watch: {
    list(val) {
      if (val.length > 0) {
        this.imgList = [...val]
      }
    }
  },
  methods: {
    selectNum(item, i) {
      console.log(item, i)
      if (item.num && item.num > 0) {
        item.num = ''
      } else {
        this.$set(item, 'num', ++this.count)
      }
    },
    onSuccess() {
      let sortList = []
      let nullList = []
      this.imgList.map(item => {
        if (item.num > 0) sortList.push(item)
        else nullList.push(item)
      })
      let list = sortList.sort((a, b) => {
        return a.num - b.num
      })
      let imgList = [...list, ...nullList]
      this.$emit('close', imgList)
      this.count = 0
      this.imgList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 130px;
    height: 130px;
    line-height: 0;
    border: 1px solid #c7c7c7;
    margin: 6px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
    }
    .select {
      background: rgba(0, 0, 0, 0.3);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}
</style>
