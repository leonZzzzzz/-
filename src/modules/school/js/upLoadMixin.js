import ImageDialog from 'commonSchool/ImageDialog'

export default {
  components: {
    ImageDialog,
  },
  data() {
    return {
      digImgWrap: false,
      uploadType: 'radio',
      imgName: '',
    }
  },
  methods: {
    // 打开图片对话框
    showImgBox(state, imgName, type, cropperOption) {
      // console.log('showImgBox', state, imgName, type, cropperOption);
      if (imgName) this.imgName = imgName
      if (type) this.uploadType = type
      if (cropperOption) {
        this.cropperOption.autoCropWidth = cropperOption.width
        this.cropperOption.autoCropHeight = cropperOption.height
      }
      this.digImgWrap = state
    },
    // 单张图片
    onGetImgsrc(val, imgName) {
      let keys = imgName.split('.')
      if (keys.length > 1) {
        this.model[keys[0]][keys[1]] = val
      } else {
        this.model[imgName] = val
      }
      // this.model[imgName] = val;
      // console.log("imgName", this.model.activityCheckinSetting);
    },
    // 多张图片
    onGetImglistsrc(list, state) {
      // console.log('onGetImglistsrc', list, state)
      if (state === 1) {
        list.map((item, i) => {
          // let url = item.response.data.imageUrl
          this.imgList.push({ url: item })
        })
      } else {
        list.map((item, i) => {
          let url = item.imageUrl
          this.imgList.push({ url: url })
        })
      }
    },
  },
}
