<template>
  <div class="add-form">
    <GoBack title="返回"></GoBack>
    <div class="main-content" style="display: flex">
      <div>
        <vue-drag-infinite
          ref="grapost"
          :json="list"
          :img="backPhoto"
          :qrcode="qrcode"
          :size="posterSize"
          :id="id"
          @save="saveJson"
          @get-index="onGetIndex"
          @get-list="onGetList"
        ></vue-drag-infinite>
      </div>

      <el-form :model="model" ref="model" label-position="right" label-width="110px" style="margin-left: 20px">
        <el-form-item label="海报名称" :rules="[{ required: true }]">
          <el-input
            v-model.trim="model.name"
            :maxlength="32"
            placeholder="名称不超过32个字符"
            style="width: 400px"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="背景图片" :required="true">
          <upload-image :imageType="crop" :fileList="fileList" @success="success" :size="4"></upload-image>
          <div class="el-upload__tip">
            <div>背景图片建议尺寸330*550</div>
            <div>图片大小不超过4M，支持JPG / png格式文件</div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="添加元素">
          <el-checkbox v-model="showadd" @change="addCode">添加二维码</el-checkbox>
        </el-form-item> -->

        <div v-if="!showadd">
          <div v-for="(item, index) in list" :key="index">
            <el-form-item :label="item.content">
              <span class="span">
                <span class="span"
                  >宽<el-input
                    v-model="item.style.width"
                    type="number"
                    oninput="if(value>330)value=330"
                    :min="0"
                    :max="330"
                    class="setting"
                  ></el-input
                  >px</span
                >
                <span v-if="item.mark == 'logo'">
                  <el-upload
                    :show-file-list="false"
                    accept="image/jpeg,image/png"
                    :action="baseUrl + '/api/v1/attachments/images/tencent_cloud'"
                    :on-success="updatelogosuccess"
                  >
                    <el-button size="small" type="primary">上传logo</el-button>
                  </el-upload>
                </span>
              </span>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="排序" prop="name">
          <el-input
            v-model.trim="model.sortNumber"
            type="number"
            placeholder="请输入排序"
            style="width: 400px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" size="small">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack.vue'
import VueDragInfinite from '../../../components/common/VueDragInfinite'
import html2canvas from 'html2canvas'
import UploadImage from '../../../components/components/UploadImage.vue'
export default {
  components: { GoBack, VueDragInfinite, UploadImage },
  data() {
    return {
      model: {
        name: '',
        background: '',
        width: '',
        height: '',
        qrcodeSize: '',
        qrcodeOffsetX: '',
        qrcodeOffsetY: '',
        sortNumber: 0
      },
      backPhoto: '', //绑定的海报地图
      qrcode: '', //绑定的二维码图
      logo: '', //绑定的logo
      posterSize: {
        xx: 330,
        yy: 550
      }, //海报底图长款
      id: '', //
      fileList: [],
      crop: 'crop-company-poster', //上传图片所属的文件夹
      iamgeurl: 'http://athena-1255600302.cosgz.myqcloud.com',
      showadd: false,
      windowWidthData: 900,
      list: []
    }
  },
  methods: {
    getWindowWidth() {
      this.windowWidthData = window.innerWidth - 500
    },
    // 添加二维码
    addCode(e) {
      var url = 'http://athena-1255600302.cosgz.myqcloud.com/attachments/null/d8ba2e2ab95c4050ab67e19bd4ecba83.jpg'
      var json = {
        type: 'img',
        content: '二维码样式', //文本内容
        imgUrl: url, //二维码图片
        mark: 'code', //二维码
        style: {
          width: '100', //文本宽度
          height: '', //文本高度
          left: '0', //距离海报左边
          top: '0', //距离海报顶端
          background: 'transparent', //背景色
          color: '#000', //文字颜色
          fontSize: '14', //大小
          fontWeight: '500', //是否加粗
          fontStyle: 'normal', //是否倾斜
          letterSpacing: '0', //字距
          lineHeight: '14', //行高
          textAlign: 'left', //左右对齐方式，
          alignItems: 'center', //上下对齐方式
          zIndex: 1,
          borderRadius: '0px'
        }
      }
      console.log(this.list)
      this.list.push(json)
      this.imgToBase64(url, 2)
    },
    editCode(e) {
      var url = 'http://athena-1255600302.cosgz.myqcloud.com/attachments/null/d8ba2e2ab95c4050ab67e19bd4ecba83.jpg'
      var json = {
        type: 'img',
        content: '二维码样式', //文本内容
        imgUrl: url, //二维码图片
        mark: 'code', //二维码
        style: {
          width: e.qrcodeSize, //文本宽度
          height: e.qrcodeSize, //文本高度
          left: e.qrcodeOffsetX + 'px', //距离海报左边
          top: e.qrcodeOffsetY + 'px', //距离海报顶端
          background: 'transparent', //背景色
          color: '#000', //文字颜色
          fontSize: '14', //大小
          fontWeight: '500', //是否加粗
          fontStyle: 'normal', //是否倾斜
          letterSpacing: '0', //字距
          lineHeight: '14', //行高
          textAlign: 'left', //左右对齐方式，
          alignItems: 'center', //上下对齐方式
          zIndex: 1,
          borderRadius: '0px'
        }
      }
      this.list.push(json)
      this.imgToBase64(url, 2)
    },
    // 图片转base64--接口转
    imgToBase64(img, num) {
      this.$http.imgToBase64({ img }).then((res) => {
        if (num == 1) {
          this.poster = 'data:image/jpeg;base64,' + res.data.message
        } else if (num == 2) {
          this.qrcode = 'data:image/jpeg;base64,' + res.data.message
        }
      })
    },
    // 图片转base64
    imageUrlToBase64(url, num) {
      //一定要设置为let，不然图片不显示
      let image = new Image()
      //解决跨域问题
      image.setAttribute('crossOrigin', '*')
      image.src = url + '?v=' + Math.random()
      let that = this
      //image.onload为异步加载
      image.onload = () => {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.fillStyle = '#fff'
        context.fillRect(0, 0, image.width, image.height)
        context.drawImage(image, 0, 0)
        var quality = 0.8
        //这里的dataurl就是base64类型
        var dataURL = canvas.toDataURL('image/jpeg', quality) //使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
        if (num == 1) {
          let oImg = that.$refs.grapost.$el.children[0]
          oImg.src = dataURL
          oImg.style.width = '330px'
          that.backPhoto = dataURL
          that.posterSize.yy = that.$refs.grapost.$el.children[0].clientHeight
          that.posterSize.xx = that.$refs.grapost.$el.children[0].clientWidth
        }
      }
    },
    //图片上传成功的回调事件
    success(val) {
      this.fileList = []
      var url = val[0] ? this.iamgeurl + val[0].url : ''
      this.model.background = url
      this.fileList.push({ url: url, name: val[0].name })
      let oImg = this.$refs.grapost.$el.children[0]
      oImg.src = url
      oImg.style.width = '330px'
      this.imageUrlToBase64(url, 1)
    },
    // 获取index
    onGetIndex(e) {
      this.divindex = e
    },
    // 获取list
    onGetList(e) {
      this.list = e
    },
    //保存格式
    saveJson: function(data) {},
    //点击保存按钮
    save() {
      if (this.model.name == '') {
        this.$message.warning('海报名称不能为空')
        return
      }
      if (this.model.background == '') {
        this.$message.warning('背景图片不能为空')
        return
      } else {
        this.model.background = this.model.background.replace('http://athena-1255600302.cosgz.myqcloud.com', '')
      }
      this.model.width = this.posterSize.xx
      this.model.height = this.posterSize.yy
      if (this.list.length > 0 && this.list[0].style != undefined) {
        this.model.qrcodeOffsetX = this.list[0].style.left.replace('px', '')
        this.model.qrcodeOffsetY = this.list[0].style.top.replace('px', '')
        this.model.qrcodeSize = this.list[0].style.width
      } else {
        this.model.qrcodeOffsetX = ''
        this.model.qrcodeOffsetY = ''
        this.model.qrcodeSize = ''
      }
      if (this.$route.query.id == undefined) {
        this.addPoster(this.model)
        return
      } else {
        this.updatePoster(this.model)
      }
      // if (this.$route.query.id != '') {
      //   if (this.model.name == '') {
      //     this.$message.warning('海报名称不能为空')
      //     return
      //   }
      //   if (this.model.background == '') {
      //     this.$message.warning('背景图片不能为空')
      //     return
      //   } else {
      //     this.model.background = this.model.background.replace('http://athena-1255600302.cosgz.myqcloud.com', '')
      //   }
      //    this.model.width = this.posterSize.xx
      //   this.model.height = this.posterSize.yy
      //    if (this.list.length > 0 && this.list[0].style != undefined) {
      //     this.model.qrcodeOffsetX = this.list[0].style.left.replace('px', '')
      //     this.model.qrcodeOffsetY = this.list[0].style.top.replace('px', '')
      //     this.model.qrcodeSize = this.list[0].style.width
      //   } else {
      //     this.model.qrcodeOffsetX = ''
      //     this.model.qrcodeOffsetY = ''
      //     this.model.qrcodeSize = ''
      //   }
      // }
    },
    //接口部分
    //添加得方法
    addPoster(params) {
      this.$http.addPoster(params).then((res) => {
        if (res.data.code == 20000) {
          this.$message.success('新增企业海报成功')
          this.$openNewPageBack()
        } else {
          this.$message.warning('新增企业海报失败')
        }
      })
    },
    //更新的方法
    updatePoster(params) {
      this.$http.updatePoster(params).then((res) => {
        if (res.data.code == 20000) {
          this.$message.success('修改企业海报成功')
          this.$openNewPageBack()
          return
        } else {
          this.$message.warning('修改企业海报失败')
          return
        }
      })
    },
    //获取得方法
    getPoster(params) {
      this.$http.getPoster({ id: params }).then((res) => {
        let data = res.data.data
        this.model.name = data.name
        this.model.background = data.background
        this.model.sortNumber = data.sortNumber
        this.model.qrcodeOffsetX = data.qrcodeOffsetX
        this.model.qrcodeOffsetY = data.qrcodeOffsetY
        this.model.qrcodeSize = data.qrcodeSize
        this.model.width = data.width
        this.model.height = data.height
        this.model.id = data.id
        this.imageUrlToBase64(data.host + this.model.background, 1)
        this.fileList = [{ name: '底图', url: data.host + this.model.background }]
        this.editCode(data)
      })
    }
    //接口结束
  },
  created() {
    this.getWindowWidth()
    if (this.$route.query.id) {
      this.getPoster(this.$route.query.id)
    } else {
      this.addCode()
    }
  }
}
</script>

<style lang="scss" scoped>
.add-form {
  width: 100%;
  height: 100%;
  .main-content {
    background-color: #fff;
    padding: 20px;
    min-height: calc(100% - 96px);
  }
  .span {
    display: flex;
    margin-right: 20px;
  }
  .setting {
    width: 70px;
    display: flex;
    margin-left: 5px;
    margin-right: 5px;
  }
  ul,
  li {
    margin: 0px;
    list-style: none;
    padding: 0px;
  }

  .el-form-item--mini.el-form-item {
    margin-bottom: 7px;
  }
  .drag {
    width: 100px;
    height: 100px;
    position: absolute;
    border: 1px dashed transparent;
    top: 0;
    left: 0;
    cursor: move;
    line-height: 1.7;
    box-sizing: border-box;
    color: #000;
    overflow: hidden;
    padding: 5px;
    .sacle {
      display: none;
      position: absolute;
      right: 0px;
      bottom: 0px;
      // background-color: #909399;
      cursor: se-resize;
      transform: rotate(-45deg);
      font-size: 15px;
    }
    .del {
      position: absolute;
      top: 0px;
      right: 0px;
      padding: 5px;
      box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
    }
  }
  .drag:hover .sacle {
    display: block;
  }
  .drag:hover {
    // border-radius: 5px;
    border: 1px dashed #eee;
    // box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  }
  .control {
    width: 250px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #b3c0d1;
    position: absolute;
    z-index: 999;
    right: 20px;
    top: 15px;
  }
}
</style>
