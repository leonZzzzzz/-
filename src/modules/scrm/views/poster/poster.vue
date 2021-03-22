<template>
  <div>
    <el-row :gutter="20" class="elRow">
      <div class="PosterTitle">电商海报</div>
      <el-col class="elCol" :span="6">
        <el-image class="elImage" :src="url"></el-image>
        <div class="elCover">
          <button>下载海报</button>
        </div>
        <span>好评返现红包海报</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '../../api/poster'
export default {
  data() {
    return {
      url: 'http://static.yzscrm.com/image/poster/1-01.png',
      tableData: [],
      page: []
    }
  },
  methods: {
    getPage() {
      let that = this
      api.dynamicQrcodePage(that.page).then((res) => {
        that.tableData = res.data.data.list
        console.log(res)
      })
    }
  },
  created() {
    this.getPage()
  }
}
</script>
<style lang="scss" scoped>
.elRow {
  background-color: #ffffff;
  padding: 20px;
  .PosterTitle {
    font-size: 20px;
    height: 26px;
    line-height: 26px;
    font-weight: bold;
    padding: 10px;
  }
  .elCol {
    position: relative;
    .elImage {
      width: 291px;
      height: 462px;
    }
    .elCover {
      top: 0;
      left: 10px;
      z-index: 999 !important;
      background: rgba(0, 0, 0, 0.2);
      position: absolute;
      width: 291px;
      height: 462px;
      opacity: 0;
      button {
        // position: absolute;
        margin-left: 90px;
        margin-top: 220px;
        width: 120px;
        height: 30px;
        color: blue;
        border-color: blue;
        border-width: 1px;
        // outline: none;
      }
    }
  }
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 291px;
    padding: 5px 0;
    display: block;
    font-size: 15px;
    color: rgba(21, 38, 52, 1);
  }
}
.elCol:hover > .elCover {
  opacity: 1;
}
</style>
