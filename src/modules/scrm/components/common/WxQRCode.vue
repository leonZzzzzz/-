<template>
  <el-popover placement="right" trigger="click" v-model="showImg">
    <div class="miniQRcode">
      <div class="img-box" v-show="showImg" v-loading="isLoading">
        <img class="img" v-if="imgUrl" :src="imgHost + imgUrl" />
      </div>
      <div class="link-box" v-if="showLink && sharePage">
        <el-input size="mini" style="width: 190px;" v-model="sharePage"></el-input>
        <el-button size="mini" type="primary" style="margin-left: 10px;" @click="copy(sharePage)">复制</el-button>
      </div>
    </div>
    <slot>
      <el-button slot="reference" :type="text ? 'text' : 'primary'" :size="size" style="margin-left: 10px;">{{
        label
      }}</el-button>
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
      default: 'small'
    },
    text: {
      type: Boolean,
      default: false
    },
    showLink: {
      type: Boolean,
      default: true
    },
    options: {
      type: Object,
      default: () => {
        return {
          name: '', // 相当于此配置的key
          scene: '', // 为商城商品的时候 scene = 商品Id
          storeId: '', // 为商城商品的时候才需要传 门店Id
          sourceId: '', // 可选，作用等同于scene（兼容写法，最开始是没有sourceId字段的）
          sourceType: ''
        }
      }
    }
  },
  data() {
    return {
      imgUrl: '',
      showImg: false,
      isLoading: false,
      sharePage: ''
    }
  },
  watch: {
    showImg(val) {
      if (val) {
        console.log(val)
        let { scene = '', storeId = '' } = this.options
        switch (this.options.name) {
          case 'activityShare':
            // 活动详情
            this.sharePage = `pagesCoWebs/activity/detail/index?scene=${scene}`
            break
          case 'activityDetail':
            // 活动样式1
            this.sharePage = `pagesCoWebs/activity/detail/index?scene=${scene}`
            break
          case 'activityDetailCommission':
            // 活动样式2
            this.sharePage = `pagesCoWebs/activity/detail-commission/index?scene=${scene}`
            break
          case 'airborneCheckin':
            // 空降嘉宾
            this.sharePage = `pagesCoWebs/activity/check/airborne/index?scene=${scene}`
            break
          case 'codeCheckin':
            // 暗号签到
            this.sharePage = `pagesCoWebs/activity/check/code/index?scene=${scene}`
            break
          case 'mobileCheckin':
            // 手机签到
            this.sharePage = `pagesCoWebs/activity/check/mobile/index?scene=${scene}`
            break
          case 'survey':
            // 问卷调查
            this.sharePage = `pagesCoWebs/survey/detail/index?scene=${scene}`
            break
          case 'product':
            // 普通商品
            this.sharePage = `pagesMall/product/detail/index?id=${scene}&storeId=${storeId}`
            break
          case 'groupProduct':
            // 拼团商品
            this.sharePage = `pagesMall/group-product/detail/index?id=${scene}&storeId=${storeId}`
            break
          case 'courseShare':
            // 课程分享
            this.sharePage = `pagesCoWebs/course/detail/index?scene=${scene}`
            break
          case 'course':
            // 课程分享
            this.sharePage = `pagesCoWebs/course/detail/index?scene=${scene}`
            break
          case 'singleContent':
            // 图文
            this.sharePage = `pagesCoWebs/news/detail/index?scene=${scene}`
            break
          case 'singleShare':
            // 图文
            this.sharePage = `pagesCoWebs/news/detail/index?scene=${scene}`
            break
          case 'member_fee':
            // 会费
            this.sharePage = `pagesCoWebs/membership/index/index?scene=${scene}`
            break
          case 'certificate':
            // 证书管理
            this.sharePage = `pagesCertificate/index/index${scene ? '?scene=' + scene : ''}`
            break
        }
        console.log(this.options.name, this.sharePage)
        this.getWxQRCode()
      }
    }
  },
  methods: {
    getWxQRCode() {
      let param = this.options
      param.sourceId = param.scene // 兼容写法，最开始是没有sourceId字段的
      param.type = this.type
      this.isLoading = true
      this.$http
        .getWxQRCode(param)
        .then((res) => {
          this.isLoading = false
          if (res.data.data && res.data.data.imgUrl) this.imgUrl = res.data.data.imgUrl
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
