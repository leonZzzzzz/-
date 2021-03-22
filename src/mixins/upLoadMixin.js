// import editImage from 'common/editImage'
// import ImageDialog from 'common/ImageDialog'

export default {
  // components: {
  //   editImage, ImageDialog
  // },
  data() {
    return {
      digImgWrap: false,
      uploadType: 'radio',
      imgName: '',
    }
  },
  methods: {
    // 打开图片对话框
    showImgBox(state, imgName, type) {
      if (imgName) {
        this.imgName = imgName
        if (this.cropperConfig && this.cropperConfig[imgName]) {
          this.cropperOption = Object.assign(this.cropperOption, this.cropperConfig[imgName])
        }
      }
      if (type) this.uploadType = type || 'radio'
      this.digImgWrap = state
    },
    // 单张图片
    onGetImgsrc(val, imgName) {
      let keys = imgName.split('.')
      if (keys.length > 1) {
        if (keys.length === 2 && this[keys[0]] !==undefined && this[keys[0]][keys[1]] !== undefined) {
          this[keys[0]][keys[1]] = val
        } else {
          this.model[keys[0]][keys[1]] = val
        }
      } else {
        this.model[imgName] = val
      }
    },
    // 多张图片
    onGetImglistsrc(list, state) {
      console.log('onGetImglistsrc', list, state)
      if (state === 1) {
        list.map((item, i) => {
          let url = item.response.data.imageUrl
          this.imgList.push({ url: url })
        })
      } else {
        list.map((item, i) => {
          let url = item.imageUrl
          this.imgList.push({ url: url })
        })
      }
    },

    getSingleimg(val, imgName) {
      let keys = imgName.split('.')
      if (keys.length > 1) {
        if (keys.length === 2 && this[keys[0]] !== undefined && this[keys[0]][keys[1]] !== undefined) {
          this[keys[0]][keys[1]] = val
        } else {
          this.model[keys[0]][keys[1]] = val
        }
      } else {
        this.model[imgName] = val
      }
    },
  },
}
