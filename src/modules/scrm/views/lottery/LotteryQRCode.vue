<template>
  <el-popover placement="right" trigger="click" v-model="showImg">
    <div class="miniQRcode">
      <div class="img-box" v-show="showImg" v-loading="isLoading">
        <img class="img" v-if="imgUrl" :src="imgUrl" />
      </div>
      <div class="link-box" v-if="showLink && sharePage">
        <el-input size="mini" style="width: 190px;" v-model="sharePage"></el-input>
        <el-button 
          size="mini" 
          type="primary" 
          style="margin-left: 10px;" 
          @click="copy(sharePage)"
          >复制</el-button>
      </div>
    </div>
    <slot>
      <el-button slot="reference" 
      :type="text ? 'text' : 'primary'" 
      :size="size" 
      style="margin-left: 10px; margin-right: 10px;"
      >{{label}}</el-button>
    </slot>
  </el-popover>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '小程序码'
    },
    type: {
      type: String,
      default: 'miniProgramQrCode'
    },
    size: {
      type: String,
      default: 'medium'
    },
    text: {
      type: Boolean,
      default: false
    },
    showLink: {
      type: Boolean,
      default: true
    },
    lotteryId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imgUrl: '',
      showImg: false,
      isLoading: false,
      // defaultPage: 'pages/scrm/card/index',
      defaultPage: 'pagesPlugins/lottery/index/index',
      sharePage: '',
    }
  },
  watch: {
    showImg(val) {
      if (val) {
        console.log(val)
        this.getWxQRCode()
      }
    },
  },
  methods: {
    getWxQRCode() {
      let params = {
        lotteryId: this.lotteryId, // 抽奖的id
        page: this.defaultPage, // 小程序抽奖页面路径，不能以/开头
        type: 'weapp', // 传默认值即可
      }
      this.isLoading = true
      this.$http
        .getLotteryQrcode(params)
        .then(res => {
          this.isLoading = false
          let data = res.data.data
          this.imgUrl = `${data.host}${data.url}`
          this.sharePage = `${this.defaultPage}?scene=${data.scene}`
        })
        .catch(() => {
          this.isLoading = false
          this.imgUrl = ''
        })
    },
    copy(sharePage) {
      let oInput = document.createElement('input')
      oInput.value = sharePage
      document.body.appendChild(oInput)
      oInput.select()
      document.execCommand('copy')
      oInput.style.display = 'none'
      document.body.removeChild(oInput)
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.miniQRcode {
  position: relative;
  display: inline-block;
  .img-box {
    // position: absolute;
    // top: -125px;
    // right: -260px;
    width: 230px;
    height: 230px;
    padding: 10px;
    display: block;
    border-radius: 5px;
    background: #fff;
    box-sizing: border-box;
  }
  .img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
}
</style>
