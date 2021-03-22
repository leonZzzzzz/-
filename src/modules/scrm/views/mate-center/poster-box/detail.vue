<template>
  <div style="height: 100%">
    <go-back title="素材海报"></go-back>
    <div class="main-content" style="display: flex">
      <div>
        <vue-drag-infinite
          ref="grapost"
          :json="model.list"
          :img="backPhoto"
          :qrcode="qrcode"
          :logo="logo"
          :size="posterSize"
          :id="id"
          @save="saveJson"
          @get-index="onGetIndex"
          @get-list="onGetList"
        ></vue-drag-infinite>
      </div>

      <!-- <div ref="dragContain" class="contain">
        <el-image v-if="backPhoto" :src="backPhoto" style="width: 100%"> </el-image>
        <div
          v-for="(item, index) in model.list"
          :key="index"
          v-drag="contain"
          class="drag"
          :class="{ active: index == divindex }"
          v-if="item.type == 'text'"
          @click="moveDiv(index, $event)"
          :style="item.style"
        >
          {{ item.content }}
          <i
            class="el-icon-caret-bottom sacle"
            v-if="index == divindex"
            @click="sacle($event)"
            @mousedown="mouseDown($event, true)"
            unselectable="on"
          ></i>
          <el-image :src="item.imgUrl" v-if="item.type == 'img'"></el-image>
        </div>
      </div> -->
      <el-form :model="model" ref="model" label-position="left" label-width="110px" style="margin-left: 20px">
        <el-form-item label="海报名称" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input
            v-model.trim="model.name"
            :maxlength="24"
            placeholder="名称不超过24个字符"
            style="width: 400px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="海报分类" prop="groupId" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-cascader
            :options="classify"
            :props="{ value: 'id', label: 'name', children: 'childs' }"
            :show-all-levels="true"
            v-model="model.groupId"
            style="width: 400px"
            @change="changeCascader"
            ref="elcascader"
            @visible-change="elCascaderOnlick"
            @expand-change="elCascaderOnlick"
            clearable
          ></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="初始下载量" prop="info" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input-number
            type="number"
            :rows="4"
            :min="0"
            v-model="model.info"
            style="width: 400px"
            clearable
          ></el-input-number>
        </el-form-item> -->
        <el-form-item label="背景图片" prop="imgUrl" :rules="[{ required: true, message: '该字段不能为空' }]">
          <!-- <el-upload
            class="upload-demo"
            accept="image/jpeg,image/png"
            :file-list="fileList"
            :action="baseUrl + '/api/v1/attachments/images/tencent_cloud'"
            :on-success="success"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              <div>背景图片建议尺寸330*550</div>
              <div>图片大小不超过4M，支持JPG / png格式文件</div>
            </div>
          </el-upload> -->
          <upload-image :fileList="fileList" @success="success" :size="4"></upload-image>
          <div class="el-upload__tip">
            <div>背景图片建议尺寸330*550</div>
            <div>图片大小不超过4M，支持JPG / png格式文件</div>
          </div>
        </el-form-item>
        <el-form-item label="添加元素">
          <el-checkbox v-model="showclient" @change="addclient">客户昵称</el-checkbox>
          <el-checkbox v-model="showmember" @change="addmember">成员昵称</el-checkbox>
          <el-checkbox v-model="showadd" @change="addCode">添加二维码</el-checkbox>
          <el-checkbox v-model="showlogo" @change="addlogo">添加logo</el-checkbox>
        </el-form-item>
        <div v-if="showclient || showmember">
          <div v-for="(item, index) in model.list" :key="index" v-if="item.type == 'text'">
            <el-form-item label="文本">
              <el-input
                type="textarea"
                v-model="item.content"
                :maxlength="24"
                placeholder="昵称不超过24个字符"
              ></el-input>
            </el-form-item>
            <el-form-item label="字体样式">
              <span class="span">
                <span class="span"
                  >大小
                  <!-- <el-input v-model="item.style.fontSize" type="number" :min="0" class="setting"></el-input> -->
                  <el-input-number
                    v-model="item.style.fontSize"
                    style="width:120px"
                    :step="1"
                    :min="0"
                    step-strictly
                  ></el-input-number>
                  px</span
                >
                <span class="span"
                  >行高
                  <!-- <el-input v-model="item.style.lineHeight" type="number" :min="0" class="setting"></el-input
                  > -->
                  <el-input-number
                    v-model="item.style.lineHeight"
                    style="width:120px"
                    :step="1"
                    :min="0"
                    step-strictly
                  ></el-input-number>
                  px</span
                >
                <span class="span"
                  >字距
                  <!-- <el-input v-model="item.style.letterSpacing" type="number" :min="0" class="setting"></el-input
                  > -->
                  <el-input-number
                    v-model="item.style.letterSpacing"
                    style="width:120px"
                    :step="1"
                    :min="0"
                    step-strictly
                  ></el-input-number>
                  px</span
                >
                <span class="span">颜色<el-color-picker v-model="item.style.color"></el-color-picker></span>
              </span>
              <span>
                <span class="span">
                  <span style="margin-right: 15px">对齐</span>
                  <el-button type="text" style="font-size: 12px" @click="item.style.textAlign = 'left'"
                    >左对齐</el-button
                  >
                  <el-button type="text" style="font-size: 12px" @click="item.style.textAlign = 'center'"
                    >水平居中</el-button
                  >
                  <el-button type="text" style="font-size: 12px" @click="item.style.textAlign = 'right'"
                    >右对齐</el-button
                  >
                  <!-- <el-button type="text" style="font-size: 12px" @click="item.style.alignItems = 'flex-start'"
                    >上对齐</el-button
                  >
                  <el-button type="text" style="font-size: 12px" @click="item.style.alignItems = 'center'"
                    >垂直居中</el-button
                  >
                  <el-button type="text" style="font-size: 12px" @click="item.style.alignItems = 'flex-end'"
                    >下对齐</el-button
                  > -->
                </span>
                <span class="span">
                  <span style="margin-right: 15px">其他</span>
                  <span
                    style="margin-right: 15px; font-weight: bold"
                    @click="
                      item.style.fontWeight == '500'
                        ? (item.style.fontWeight = 'bold')
                        : item.style.fontWeight == 'bold'
                        ? (item.style.fontWeight = '500')
                        : (item.style.fontWeight = 'bold')
                    "
                    >B</span
                  >
                  <span
                    @click="
                      item.style.fontStyle == 'oblique'
                        ? (item.style.fontStyle = 'normal')
                        : item.style.fontStyle == 'normal'
                        ? (item.style.fontStyle = 'oblique')
                        : (item.style.fontStyle = 'normal')
                    "
                    >/</span
                  >
                </span>
              </span>
            </el-form-item>
          </div>
        </div>
        <div v-if="showadd || showlogo">
          <div v-for="(item, index) in model.list" :key="index" v-if="item.type == 'img'">
            <el-form-item :label="item.content">
              <span class="span">
                <span class="span"
                  >宽
                  <!-- <el-input
                    v-model="item.style.width"
                    type="number"
                    oninput="if(value>330)value=330"
                    :min="0"
                    :max="330"
                    class="setting"
                  ></el-input
                  > -->
                  <el-input-number
                    v-model="item.style.width"
                    style="width:120px"
                    :step="1"
                    :min="0"
                    :max="330"
                    step-strictly
                  ></el-input-number>
                  px</span
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
                <!-- <span class="span" v-if="showadd">高
                  <el-input v-model="item.style.height" value="14px" class="setting"></el-input>
                </span> -->
                <!-- <span class="span" style="margin-top:10px">
                  <el-radio v-model="radio" label="1" @change="getValue()">直角</el-radio>
                  <el-radio v-model="radio" label="2" @change="getValue()">圆角</el-radio>
                </span> -->
              </span>
            </el-form-item>
          </div>
        </div>
        <el-form-item>
          <el-button type="primary" @click="save" size="small">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import VueDragInfinite from '../../../components/common/VueDragInfinite'
import html2canvas from 'html2canvas'
import GoBack from '../../../components/components/GoBack.vue'
import UploadImage from '../../../components/components/UploadImage.vue'
export default {
  components: {
    VueDragInfinite,
    GoBack,
    UploadImage
  },
  data() {
    return {
      radio: '1',
      fs: 12,
      lh: 14,
      ls: 0,
      //外层容器的宽高 数值不带px单位
      contain: {
        xx: 330,
        yy: 550
      },
      //存放拉伸放大时的  div的原始宽高 带px单位
      movejson: {
        moveWidth: '',
        moveHeight: ''
      },
      divindex: 0, //当前选中div的序号  默认为0
      iamgeurl: 'http://athena-1255600302.cosgz.myqcloud.com',
      backPhoto: '',
      model: {
        name: '',
        groupId: '',
        imgUrl: '',
        link: '',
        list: []
      },
      category: [], //海报分类
      showclient: false,
      showmember: false,
      showadd: false,
      showlogo: false,
      qrcode: '',
      logo: '',
      classify: [],
      id: '',
      posterSize: {
        xx: 330,
        yy: 550
      },
      fileList: [],
      windowWidthData: 900
    }
  },
  created() {
    this.getWindowWidth()
    if (this.$route.query.tagId) {
      this.model.groupId = this.$route.query.tagId
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getDetail()
    }
    this.getDepartmentTreeData()
  },
  mounted() {},

  methods: {
    saveJson: function(data) {},
    // 获取分类数据
    getDepartmentTreeData() {
      this.$http.getMateTree({ type: 'poster' }).then((res) => {
        this.classify = res.data.data
        this.classify.forEach((item) => {
          if (item.childs.length == 0) {
            item.childs = null
          }
        })
      })
    },
    elCascaderOnlick(e) {
      let that = this
      setTimeout(function() {
        document.querySelectorAll('.el-cascader-node__label').forEach((el) => {
          el.onclick = function() {
            // this.previousElementSibling.onclick();
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
        document.querySelectorAll('.el-cascader-panel .el-radio').forEach((el) => {
          el.onclick = function() {
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
      }, 100)
    },
    // 获取详情
    getDetail() {
      this.$http.mateDetailPoster({ id: this.id }).then((res) => {
        var data = res.data.data
        this.model.name = data.name
        this.model.groupId = data.groupId
        this.model.imgUrl = data.imageUrl
        this.model.list = data.posterSubs
        this.fileList = [{ name: this.model.name, url: this.model.imgUrl }]
        data.posterSubs.forEach((val) => {
          if (val.mark == 'clientName') {
            this.showclient = true
          }
          if (val.mark == 'memberName') {
            this.showmember = true
          }
          if (val.mark == 'code') {
            if (val.style.borderRadius == '0px') {
              this.radio = '1'
            } else if (val.style.borderRadius == '50%') {
              this.radio = '2'
            }
            this.showadd = true
            this.imgToBase64(val.imgUrl, 2)
          }
          if (val.mark == 'logo') {
            if (val.style.borderRadius == '0px') {
              this.radio = '1'
            } else if (val.style.borderRadius == '50%') {
              this.radio = '2'
            }
            this.showlogo = true
            this.imgToBase64(val.imgUrl, 3)
          }
        })
        let oImg = this.$refs.grapost.$el.children[0]
        oImg.src = data.imageUrl
        oImg.style.width = '330px'
        this.imageUrlToBase64(data.imageUrl, 1)
      })
    },
    // 获取分类id
    changeCascader(e) {
      if (e.length == 1) {
        this.model.groupId = e[0]
      }
      if (e.length == 2) {
        this.model.groupId = e[1]
      }
      if (e.length == 3) {
        this.model.groupId = e[2]
      }
    },
    success(val) {
      this.fileList = []
      var url = val[0] ? this.iamgeurl + val[0].url : ''
      this.model.imgUrl = url
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
      this.model.list = e
    },
    // 客户昵称
    addclient(e) {
      if (e) {
        var json = {
          type: 'text',
          content: '客户昵称', //文本内容
          imgUrl: '', //二维码图片
          mark: 'clientName', //客户昵称
          style: {
            width: '100px', //文本宽度
            height: '50px', //文本高度
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
            zIndex: 1
          }
        }
        this.model.list.push(json)
      } else {
        var newabc = []
        if (this.model.list.length > 1) {
          this.model.list.forEach((item) => {
            if (item.mark != 'clientName') {
              newabc.push(item)
            }
          })
          this.model.list = newabc
        } else {
          this.model.list = []
        }
      }
    },
    // 成员昵称
    addmember(e) {
      if (e) {
        var json = {
          type: 'text',
          content: '成员昵称', //文本内容
          imgUrl: '', //二维码图片
          mark: 'memberName', //成员昵称
          style: {
            width: '100px', //文本宽度
            height: '50px', //文本高度
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
            zIndex: 1
          }
        }
        this.model.list.push(json)
      } else {
        var newabc = []
        if (this.model.list.length > 1) {
          this.model.list.forEach((item) => {
            if (item.mark != 'memberName') {
              newabc.push(item)
            }
          })
          this.model.list = newabc
        } else {
          this.model.list = []
        }
      }
    },
    // 添加二维码
    addCode(e) {
      var url = 'http://athena-1255600302.cosgz.myqcloud.com/attachments/null/d8ba2e2ab95c4050ab67e19bd4ecba83.jpg'
      if (e) {
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
        this.model.list.push(json)
        this.imgToBase64(url, 2)
      } else {
        this.qrcode = ''
        var newabc = []
        if (this.model.list.length > 1) {
          this.model.list.forEach((item) => {
            if (item.mark != 'code') {
              newabc.push(item)
            }
          })
          this.model.list = newabc
        } else {
          this.model.list = []
        }
      }
    },
    // 添加logo
    addlogo(e) {
      var url = 'http://athena-1255600302.cosgz.myqcloud.com/attachments/common/f0434789e8314457b087f7a16e1d54f3.png'
      if (e) {
        var json = {
          type: 'img',
          content: 'logo样式', //文本内容
          imgUrl: url, //logo
          mark: 'logo', //二维码
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
        this.model.list.push(json)
        this.imgToBase64(url, 3)
      } else {
        this.logo = ''
        var newabc = []
        if (this.model.list.length > 1) {
          this.model.list.forEach((item) => {
            if (item.mark != 'logo') {
              newabc.push(item)
            }
          })
          this.model.list = newabc
        } else {
          this.model.list = []
        }
      }
    },
    // 上传logo
    updatelogosuccess(e) {
      var url = this.iamgeurl + e.data.imageUrl
      this.model.list.forEach((item) => {
        if (item.mark == 'logo') {
          item.imgUrl = url
        }
      })
      this.imgToBase64(url, 3)
    },
    // 图片转base64--接口转
    imgToBase64(img, num) {
      this.$http.imgToBase64({ img }).then((res) => {
        if (num == 1) {
          this.poster = 'data:image/jpeg;base64,' + res.data.message
        } else if (num == 2) {
          this.qrcode = 'data:image/jpeg;base64,' + res.data.message
        } else if (num == 3) {
          this.logo = 'data:image/jpeg;base64,' + res.data.message
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
        } else if (num == 2) {
          that.qrcode = dataURL
        } else if (num == 3) {
          that.logo = dataURL
        }
      }
    },

    // 保存
    save() {
      window.pageYoffset = 0;
      window.pageXoffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // const canvas = document.createElement('canvas') // 创建一个canvas节点
      const shareContent = this.$refs.grapost.$el // 需要截图的包裹的（原生的）DOM 对象
      var rect = shareContent.getBoundingClientRect()
      var opts={x:rect.left,y:rect.top,scrollX:0,scrollY:0,
      width: shareContent.clientWidth,height: shareContent.clientHeight,
      useCORS:true,allowTaint:true,taintTest: true,
      letterRendering:true}
      // html2canvas(this.$refs.grapost.$el,opts).then(canvas => {
      html2canvas(this.$refs.grapost.$el, opts).then((canvas) => {
        let dataURL = canvas.toDataURL('image/jpeg')
        this.model.link = dataURL
        this.addposter()
        // this.downloadIamge(dataURL, '海报');
      })
    },
    getWindowWidth() {
      this.windowWidthData = window.innerWidth - 500
    },
    addposter() {
      if (!this.model.name) {
        this.$message.warning('请填写海报名称')
        return
      }
      if (!this.model.groupId) {
        this.$message.warning('请选择海报分类')
        return
      }
      if (!this.model.imgUrl) {
        this.$message.warning('请上传背景图片')
        return
      }
      if (this.id) {
        var params = this.model
        params.materialId = this.id
        this.$http.mateUpdatePoster(params).then((res) => {
          if (res.data.code == 20000) {
            this.$message.success('修改成功')
            this.$openNewPageBack()
          }
        })
      } else {
        this.$http.mateAddPoster(this.model).then((res) => {
          if (res.data.code == 20000) {
            this.$message.success('添加成功')
            this.$openNewPageBack()
          }
        })
      }
    },
    downloadIamge(imgsrc, name) {
      //下载图片地址和图片名
      var image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function() {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/jpeg') //得到图片的base64编码数据
        var a = document.createElement('a') // 生成一个a元素
        var event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgsrc
    },

    // 移动文字和二维码---------------------------------------------------start
    // 字符串转json对象
    toJson(str) {
      let _str = eval('(' + str + ')')
      return _str
    },
    //外层div点击选择事件 绑定右上角设置面板
    moveDiv(index, e) {
      let jsonNew = this.toJson(
        '{"' +
          e.target.style.cssText
            .replace(/\; +/g, '","')
            .replace(/\: +/g, '":"')
            .replace(/\;+/g, '')
            .replace(/-\w/g, function($) {
              return $.slice(1).toUpperCase()
            }) +
          '"}'
      )
      //当前选中div的序号
      this.divindex = index
      // 设置div框的 各种属性
      for (let em in jsonNew) {
        this.json[index].style[em] = jsonNew[em]
      }
      this.json[index].text = e.target.innerText
      this.$emit('get-index', index)
    },
    //添加一个div块 默认的
    addDive() {
      let newJson = {
        style: {
          width: '80px',
          height: '50px',
          fontSize: '14px',
          color: '#000',
          backgroundColor: 'transparent'
        },
        text: '客户昵称'
      }
      this.json.push(newJson)
    },
    //删除当前div
    del(i, e) {
      this.json.splice(i, 1)
      if (i == this.json.length) {
        this.divindex = 0
      }
      e.stopPropagation()
    },
    onSave() {
      let data = this.json
      this.$emit('save', data)
    },
    //div上拉伸的阻止冒泡事件
    sacle(e) {
      e.stopPropagation()
    },
    //div上拉伸的 放大 缩小div宽高
    mouseDown(e, type) {
      if (type) {
        let that = this
        let oldX = e.pageX,
          oldY = e.pageY
        that.movejson.moveWidth = that.json[that.divindex].style.width
        that.movejson.moveHeight = that.json[that.divindex].style.height
        document.onmousemove = function(e) {
          let newX = e.pageX - oldX
          let newY = e.pageY - oldY
          that.json[that.divindex].style.width =
            (newX + parseInt(that.movejson.moveWidth) >= 80 ? newX + parseInt(that.movejson.moveWidth) : '80') + 'px'
          that.json[that.divindex].style.height =
            (newY + parseInt(that.movejson.moveHeight) >= 50 ? newY + parseInt(that.movejson.moveHeight) : '50') + 'px'
        }
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null
        }
      }
      e.stopPropagation()
    }
    // 移动文字和二维码-------------------------------------------------------------end
  },
  directives: {
    drag: {
      bind: function(el, binding, vnode) {
        el.onmousedown = function(e) {
          var disx = e.clientX - el.offsetLeft
          var disy = e.clientY - el.offsetTop
          document.onmousemove = function(e) {
            let left = e.clientX - disx
            let top = e.clientY - disy
            if (left < 0) {
              left = 0
            }
            if (top < 0) {
              top = 0
            }
            if (left > binding.value.xx - el.offsetWidth) {
              left = binding.value.xx - el.offsetWidth
            }
            if (top > binding.value.yy - el.offsetHeight) {
              top = binding.value.yy - el.offsetHeight
            }
            el.style.left = left + 'px'
            el.style.top = top + 'px'
          }
          document.onmouseup = function() {
            document.onmousemove = document.onmouseup = null
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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
</style>
