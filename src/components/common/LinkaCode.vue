<template>
  <el-popover
    placement="right"
    trigger="click"
    v-model="showImg"
  >
    <div class="miniQRcode">
      <div
        class="img-box"
        v-show="showImg"
        v-loading="isLoading"
      >
        <img
          class="img"
          v-if="imgUrl"
          :src="imgHost + imgUrl"
        />
      </div>
      <div
        class="link-box"
        v-if="link"
      >
        <el-input
          size="mini"
          style="width: 190px;"
          v-model="link"
        ></el-input>
        <el-button
          size="mini"
          type="primary"
          style="margin-left: 10px;"
          @click="copy(link)"
        >复制</el-button>
      </div>
    </div>
    <slot>
      <el-button
        slot="reference"
        :type="text ? 'text' : 'primary'"
        :size="size"
        :style="{color:color}"
        :class="color=='#606266'?'one':'two'"
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
    size: {
      type: String,
      default: 'medium'
    },
    color: {
      type: String,
      default: '#294A7B'
    },
    text: {
      type: Boolean,
      default: false
    },
    id:{
      type: String,
      default: ''
    },
  },
  data() {
    return {
      imgUrl: '',
      showImg: false,
      isLoading: false,
      sharePage: '',
      link:''
    }
  },
  watch: {
    showImg(val) {
      if (val) {
        this.getWxQRCode()
      }
    }
  },
  methods: {
    getWxQRCode() {
      console.log(this.id)
      this.isLoading = true
      this.$http
        .getLinkandCode({id:this.id})
        .then(res => {
          this.isLoading = false
          if (res.data.data && res.data.data.qrCodeUrl) this.imgUrl = res.data.data.qrCodeUrl
          this.link=res.data.data.link
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
.one {
  margin-left: 10px;
  border: 1px solid #dcdfe6;
  padding: 9px 15px;
}
.two {
  margin-left: 10px;
}
</style>
