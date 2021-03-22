<template>
  <div class="editor" :style="{ width: `${config.initialFrameWidth}px` }">
    <!-- <el-button size="mini" type="primary" class="upload-img" @click="openImgBox()">上传图片</el-button> -->
    <div class="upload-img" v-if="editor !== null">
      <input type="file" multiple accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" @change="fileChange" />
      <el-button type="primary" size="mini" :loading="isUpload">上传图片</el-button>
    </div>
    <div type="text/plain" ref="editor"></div>
    <!-- <image-dialog :visible="digImgWrap" imageType='activity' @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc"></image-dialog> -->
    <img-select :visible="isImgSelect" :list="imgSelectList" @close="closeSelect"></img-select>
  </div>
</template>

<script>
const UE = require('UE')
import ImageDialog from './ImageDialog'
import api from 'apiSchool/common'
import lrz from 'lrz'
import ImgSelect from './ImgSelect'

export default {
  props: {
    content: String,
    configs: Object
  },
  components: {
    ImageDialog,
    ImgSelect
  },
  computed: {
    config() {
      let config = Object.assign(this.default, this.configs)
      console.log(config)
      return config
    }
  },
  data() {
    return {
      editor: null,
      id:
        Math.random()
          .toString(36)
          .substr(2) + 'ueditorId',
      digImgWrap: false,
      default: {
        initialFrameWidth: 750,
        initialFrameHeight: 500,
        toolbars: [
          [
            'bold',
            'italic',
            'underline',
            '|',
            'forecolor',
            'backcolor',
            '|',
            'emotion',
            'insertimage',
            'insertvideo',
            'map',
            'horizontal',
            '|',
            'fontfamily',
            'fontsize',
            '|',
            'rowspacingtop',
            'rowspacingbottom',
            'lineheight',
            '|',
            'indent',
            '|',
            'justifyleft',
            'justifycenter',
            'justifyright',
            'justifyjustify',
            '|',
            'link',
            'unlink',
            '|',
            'undo',
            'redo',
            'removeformat',
            'pasteplain',
            'source',
            'fullscreen',
            '|'
          ]
        ]
      },
      isImgSelect: false,
      imgSelectList: [],
      isUpload: false
    }
  },
  mounted() {
    // console.log('id', this.id)
    this.$nextTick(() => {
      this.$refs.editor.id = this.id
      this.editor = UE.getEditor(this.id, this.config)
      this.editor.ready(() => {
        this.editor.setContent(this.content || '')
        // this.editor.addListener('contentChange', () => {
        //   this.getContent()
        // })
      })
    })
  },
  watch: {
    content(val) {
      this.$nextTick(() => {
        this.$refs.editor.id = this.id
        if (!this.editor) this.editor = UE.getEditor(this.id, this.config)

        this.editor.ready(() => {
          this.editor.setContent(this.content || '')
          // this.editor.addListener('contentChange', () => {
          //   this.getContent()
          // })
        })
      })
    }
  },
  methods: {
    fileChange(e) {
      this.isUpload = true
      let files = [...e.target.files]
      files.map((file, i) => {
        this.myUpload(file, i, files.length - 1)
      })
    },
    myUpload(file, count, max) {
      console.log(file, count, max)
      if (file.size / 1024 > 1024) {
        lrz(file).then(file => {
          console.log('lrz')
          file.formData.append('imageType', 'product')
          api.upLoadImg(file.formData).then(res => {
            this.imgSelectList.push(res.data.data)
            if (max === count && count !== 0) {
              this.isImgSelect = true
              this.isUpload = !true
            }
            if (max === 0) this.onImgSuccess(res.data.data)
          })
        })
      } else {
        let form = new FormData()
        form.append('imageType', 'product')
        form.append('file', file)
        api.upLoadImg(form).then(res => {
          console.log(res.data)
          this.imgSelectList.push(res.data.data)
          if (max === count && count !== 0) {
            this.isImgSelect = true
            this.isUpload = !true
          }
          if (max === 0) this.onImgSuccess(res.data.data)
        })
      }
    },
    onImgSuccess(data) {
      this.isUpload = !true
      console.log(data.imageUrl)
      this.editor.execCommand('insertimage', {
        src: this.imgHost + data.imageUrl,
        width: 375
      })
    },
    closeSelect(imgList) {
      this.isImgSelect = false
      this.imgSelectList = []
      imgList.map(item => {
        this.onImgSuccess(item)
      })
    },
    // 设置content
    setContent(content) {
      this.editor.ready(() => {
        this.editor.setContent(content || '')
      })
    },
    // 获取content
    getContent() {
      this.$emit('get-content', this.editor.getContent())
    },
    beforeFileUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      return isJPG
    },
    imgSuccess(res, file, fileList) {
      if (res.code === 20000) {
        this.insertimage(this.imgHost + res.data.imageUrl)
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    imgFail(err, file, fileList) {
      console.log('上传失败 ', err, file, fileList)
      this.$message({
        message: err.data.message,
        type: 'error'
      })
    },
    insertimage(url) {
      this.editor.execCommand('insertimage', {
        src: url,
        width: 375
      })
    },
    // 打开图片对话框
    openImgBox() {
      this.digImgWrap = true
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false
    },
    // 单张图片
    onGetImgsrc(val) {
      // this.model.iconUrl = val
      this.insertimage(this.imgHost + val)
    }
  },
  destoryed() {
    this.editor.destory()
  }
}
</script>

<style lang="scss" scoped>
.editor {
  line-height: 1.2;
  position: relative;
  // .upload-img {
  //   position: absolute;
  //   z-index: 1000;
  //   top: 28px;
  //   right: 3px;
  //   width: 60px;
  //   height: 25px;
  //   padding: 0;
  // }
  .upload-img {
    position: absolute;
    z-index: 10000;
    top: 30px;
    right: 3px;
    padding: 0;
    line-height: 23px;
    font-size: 12px;
    text-align: center;
    color: #fff;
    border-radius: 2px;
    input {
      position: absolute;
      width: 58px;
      opacity: 0;
    }
    button {
      padding: 5px 6px;
      font-size: 11px;
    }
  }
}
</style>
