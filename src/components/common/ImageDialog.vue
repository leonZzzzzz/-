<template>
  <el-dialog
    title="上传图片"
    @open="showOpen()"
    :visible.sync="visible"
    width="840px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="img-box">
      <el-menu mode="horizontal" :default-active="activeIndex" @select="handleSelect">
        <el-menu-item v-for="(item, i) in sidebarList" :key="i" :index="item.index">{{ item.title }}</el-menu-item>
      </el-menu>
      <div v-show="activeIndex === '1'" class="item-box">
        <up-load-img
          ref="uploadImg"
          :imgSrc="imageUrl"
          :uploadType="uploadType"
          :imageType="imageType"
          @get-uploadimg="getUploadimg"
          @get-uploadimglist="getUploadimglist"
        ></up-load-img>
        <!-- <div class="upload-img-box" @click="openCropper()">
          <img v-if="imageUrl" :src="`${imgHost}${imageUrl}`" style="width: 120px;">
          <i v-else class="el-icon-plus upload-icon"></i>
        </div>-->
      </div>
      <!-- <div v-show="activeIndex === '2'" class="item-box">
        <div class="img-list">
          <div class="item-img" v-for="(item, i) in latelyImglist" :key="i" @click="chooseImg(item, i)">
            <img :src="`${imgHost}${item.imageUrl}`" alt="">
            <i class="el-icon-success check" v-if="item.check"></i>
          </div>
        </div>
      </div>-->
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="success()" :disabled="disabled">确 定</el-button>
    </span>
    <cropper :visible="visibleCropper" :imageUrl="imageUrl" @close-Cropper="closeCropper"></cropper>
  </el-dialog>
</template>

/* prop传参数 uploadType: 选填，单选 radio, 多选 select, 默认单选 imageType： 必填，文件夹名 vm.$emit
this.$emit('get-imgsrc', this.imageUrl) this.$emit('get-imglistsrc', this.uploadImglist, 1) this.$emit('close-imgbox',
state) 父组件参考方法 打开图片对话框 openImgBox (type) { this.uploadType = type this.digImgWrap = true }, 关闭图片对话框
closeImgbox (state) { this.digImgWrap = false }, 单张图片 onGetImgsrc (val) { this.model.iconUrl = val }, 多张图片
onGetImglistsrc (list, state) { list 图片数组 state 1/2, 上传或最近 if (state === 1) { list.map((item, i) => {
this.imgList.push({url: item.response.data.imageUrl}) }) } else { list.map((item, i) => { this.imgList.push({url:
item.imageUrl}) }) } }, */

<script>
export default {
  props: {
    visible: Boolean,
    uploadType: {
      type: String,
      default: 'radio' // 单选 radio, 多选 select
    },
    imageType: String,
    imgList: Array,
    imgName: String
  },
  data() {
    return {
      visibleCropper: false,
      sidebarList: [
        { index: '1', title: '本地上传' }
        // { index: '2', title: '最近上传' }
      ],
      activeIndex: '1',
      imageUrl: '',
      uploadImglist: [],
      latelyImglist: [
        {
          imageUrl: '/attachments/activity/f903180cce2f4cc6b8576c3089ed96aa.jpg',
          check: false
        },
        {
          imageUrl: '/attachments/activity/69d0c9047c4a4418a1eef89eccd5ef9f.png',
          check: false
        }
      ],
      disabled: false
    }
  },

  methods: {
    showOpen() {
      console.log('img:', this.imageUrl)
      console.log('uploadImglist:', this.uploadImglist)
      console.log('imgList:', this.imgList)
    },
    openCropper() {
      this.visibleCropper = true
    },
    closeCropper() {
      this.visibleCropper = false
    },
    // 切换side
    handleSelect(index) {
      if (index === this.activeIndex) return
      this.activeIndex = index
    },
    // 获取图片
    getUploadimg(val) {
      this.imageUrl = val
    },
    getUploadimglist(list) {
      this.uploadImglist = list
    },
    // 选择图片
    chooseImg(data, index) {
      if (this.uploadType === 'radio') {
        this.latelyImglist.map((item, i) => {
          if (index === i) {
            item.check = !item.check
          } else {
            item.check = false
          }
        })
      } else if (this.uploadType === 'select') {
        this.latelyImglist[index].check = !this.latelyImglist[index].check
      }
    },
    checkUp() {
      // debugger;
      if (this.activeIndex === '1') {
        this.$refs.uploadImg.getFileList()
        console.log(this.uploadImglist)
        if (!this.imageUrl && this.uploadImglist.length === 0) return true
        else return false
      } else {
        let list = []
        this.latelyImglist.map((item) => {
          if (item.check) list.push(item)
        })
        if (list.length === 0) {
          return true
        } else return false
      }
    },
    close(state) {
      this.activeIndex = '1'
      // this.$refs.uploadImg.clearFiles();
      this.imageUrl = ''
      this.uploadImglist = []
      this.latelyImglist.map((item) => {
        item.check = false
      })
      this.$emit('close-imgbox', state)
    },
    success() {
      if (!this.imageType) {
        this.$message.error('需传imageType（:imageType="xxxx"）！')
      }
      let state = this.checkUp()
      if (state) {
        // this.$message.error("只可选择一种方式！");
        this.$message.error('请上传或选择图片')
        return false
      }
      if (this.activeIndex === '1') {
        if (this.uploadType === 'radio') this.$emit('get-imgsrc', this.imageUrl, this.imgName)
        else this.$emit('get-imglistsrc', this.uploadImglist, 1)
      } else if (this.activeIndex === '2') {
        let list = []
        this.latelyImglist.map((item) => {
          if (item.check) list.push(item)
        })
        if (this.uploadType === 'radio') this.$emit('get-imgsrc', list[0].imageUrl, this.imgName)
        else this.$emit('get-imglistsrc', list, 2)
      }
      this.close(false)
    }
  }
}
</script>

<style lang="scss" scoped>
.img-box {
  height: 400px;
  .item-box {
    padding: 10px;
    .img-list {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      overflow-y: scroll;
      height: 360px;
      .item-img {
        width: 100px;
        height: 100px;
        border: 1px solid #eee;
        flex-shrink: 0;
        margin: 0 6px 6px 0;
        overflow: hidden;
        position: relative;
        &:nth-child(7n) {
          margin: 0 0 6px 0;
        }
        img {
          width: 100%;
        }
        .check {
          color: green;
          font-size: 24px;
          position: absolute;
          bottom: 5px;
          right: 5px;
        }
      }
    }
  }
}
</style>
