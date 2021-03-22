<template>
  <div style="height: 100%">
    <go-back title="拉新活动"></go-back>
    <div class="main-content" style="display: flex">
      <div>
        <vue-drag-infinite
          ref="grapost"
          :json="model.subs"
          :img="backPhoto"
          :qrcode="qrcode"
          :logo="logo"
          :size="posterSize"
          :id="id"
          @get-index="onGetIndex"
          @get-list="onGetList"
        ></vue-drag-infinite>
      </div>
      <el-form :model="model" ref="model" label-position="left" label-width="90px" style="margin-left: 20px">
        <el-form-item label="活动名称" prop="title" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input
            v-model.trim="model.title"
            :maxlength="24"
            placeholder="名称不超过24个字符"
            style="width: 400px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="活动时间" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-radio v-model="timetype" label="1">长期有效</el-radio>
          <el-radio v-model="timetype" label="2">自定义</el-radio>
          <div v-if="timetype==2">
            <el-date-picker
              v-model="activityTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="searchCustomerList"
              clearable
              style="width: 400px;"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="活动话术" prop="activityWords" :rules="[{ required: true, message: '该字段不能为空' }]">
          <!-- <el-button @click="trick = true" v-if="!speechContent">选择话术</el-button>
          <div v-else style="display:flex">
            <div style="color:#606266;margin-right:15px;">{{ speechContent }}</div>
            <el-button size="mini" @click="trick = true" style="height:30px;margin-top:10px;">重新选择</el-button>
          </div> -->
          <el-input type="textarea" show-word-limit placeholder="活动话术最长为2000个字符" maxlength="2000" :id="inputId" v-model="model.activityWords"/>
        </el-form-item>
        <div class="option-content" style="margin-left:85px">
          <emotion @selectedEmotion="insertTextMsg"></emotion>
          <div class="option-content--box">
            <div class="option-left">
              插入替换文案
              <el-tooltip
                effect="dark"
                placement="top-end"
                content="非自定义替换即前端自动根据字段信息替换，自定义替换文案即前端人员可自行修改字段文案"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
            <div class="option-right">
              <div class="right-group">
                <div
                  class="group-item"
                  @click="insertTextMsg('<客户昵称>')"
                >客户昵称</div>
                <div
                  class="group-item"
                  @click="insertTextMsg('<成员昵称>')"
                >成员昵称</div>
                <!-- <div class="group-item" @click="insertTextMsg('<编辑关键词>')">编辑关键词</div> -->
              </div>
            </div>
          </div>
        </div>
        <el-form-item label="行为标签">
          <div class="remark_content">
            <div class="remark_content_btns">
              <el-button
                icon="el-icon-plus"
                @click=";(BehaviorLabelDialogVisible = true), (behaviorLabelType = true)"
                plain
                size="mini"
                circle
              ></el-button>
            </div>
            <el-form class="none-form" v-if="tagNameList.length == 0">
              <el-form-item class="none-tag">
                暂无创建的行为标签，<el-button type="text" @click="nextRouter">请先前往创建&nbsp;&gt;</el-button>
              </el-form-item>
            </el-form>
            <div :class="['remark_content_box', remarkContentBoxShowFlag ? 'show' : '']">
              <div ref="remark_content_box">
                <div v-for="(item, index) in tagNameList" :key="index" class="remark_tag_box">
                  <div class="remark_tagGroupTitle">{{ item.name }}</div>
                  <div class="remark_tagChange">
                    <div class="remark_tagChange_content">
                      <div
                        @click="changeTags(items.tagId, items.id, items.name)"
                        v-for="(items, indexs) in item.tagList"
                        :key="indexs"
                        :class="['item', spanIndex.indexOf(items.id) > -1 ? 'active' : '']"
                      >
                        {{ items.name }}
                      </div>
                    </div>
                  </div>
                  <div class="remark_tag_box_btn">
                    <el-button icon="el-icon-edit" @click="updateBehav(index)" plain size="mini" circle></el-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="showmore" v-if="remarkContentBoxHeight > 153">
              <el-button type="text" @click="remarkContentBoxShowFlag = !remarkContentBoxShowFlag"
                >{{ remarkContentBoxShowFlag ? '收起' : '展开'
                }}<i :class="[remarkContentBoxShowFlag ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i
              ></el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="背景图片" prop="imgUrl" :rules="[{ required: true, message: '该字段不能为空' }]">
          <upload-image :fileList="fileList" @success="backsuccess" :size="4"></upload-image>
          <div class="el-upload__tip">
            <div>背景图片建议尺寸330*550</div>
            <div>图片大小不超过4M，支持JPG / png格式文件</div>
          </div>
        </el-form-item>
        <el-form-item label="添加元素">
          <el-checkbox v-model="showclient" @change="addclient">昵称</el-checkbox>
          <el-checkbox v-model="showlogo" @change="addlogo">头像</el-checkbox>
          <!-- <el-checkbox v-model="showmember" @change="addmember">成员昵称</el-checkbox> -->
          <el-checkbox v-model="showadd" @change="addCode">二维码</el-checkbox>
        </el-form-item>
        <div v-if="showclient || showmember">
          <div v-for="(item, index) in model.subs" :key="index" v-if="item.type == 'text'">
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
                  >大小<el-input v-model="item.style.fontSize" type="number" :min="0" class="setting"></el-input
                  >px</span
                >
                <span class="span"
                  >行高<el-input v-model="item.style.lineHeight" type="number" :min="0" class="setting"></el-input
                  >px</span
                >
                <span class="span"
                  >字距<el-input v-model="item.style.letterSpacing" type="number" :min="0" class="setting"></el-input
                  >px</span
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
          <div v-for="(item, index) in model.subs" :key="index" v-if="item.type == 'img'">
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
                    <!-- <el-button size="small" type="primary">上传logo</el-button> -->
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
    <BehaviorLabel
      :dialogVisible="BehaviorLabelDialogVisible"
      :fileList="updateBehavList"
      :type="behaviorLabelType"
      @closeDialog="BehaviorLabelDialogVisible = false"
      @reloadData="getEnterList"
    ></BehaviorLabel>
    <Form :visible="trick" @innerclose="trick = false"></Form>
  </div>
</template>

<script>
import VueDragInfinite from '../../../components/common/VueDragInfinite'
import html2canvas from 'html2canvas'
import GoBack from '../../../components/components/GoBack.vue'
import UploadImage from '../../../components/components/UploadImage.vue'
import BehaviorLabel from '../../../components/components/BehaviorLabel'
import Emotion from '../../../components/common/Emotion'
import Form from './form'
export default {
  components: {
    VueDragInfinite,
    GoBack,
    UploadImage,
    BehaviorLabel,
    Form,
    Emotion
  },
  data() {
    return {
      timetype:'1',
      trick: false,
      activityTime: [],
      model: {
        title: '',
        startTime: '',
        endTime: '',
        // speechcraftId: '',
        activityWords:'',
        imgUrl: '',
        link: '',
        subs: [
          // {
          //   type:'text',
          //   mark:'memberName',
          //   imgUrl:'',
          //   content:'',
          //   style:{
          //   }
          // }
        ]
      },
      BehaviorLabelDialogVisible: false,
      behaviorLabelType: true,
      remarkContentBoxShowFlag: false,
      tagNameList: [],
      tagList: [],
      spanName: [],
      spanIndex: [],
      remarkContentBoxHeight: 0,
      updateBehavList: {},
      speechContent: '',

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
      windowWidthData: 900,
      inputId: Math.random().toString(36).substr(2) // 文本输入id设为随机字符串，以免在编辑或者添加文本时插入文本的id相同
    }
  },
  destroyed() {
    sessionStorage.removeItem('speechcraft')
  },
  created() {
    this.getWindowWidth()
    this.getEnterList()
    if (this.$route.query.tagId) {
      this.model.groupId = this.$route.query.tagId
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getDetail()
    }
  },
  mounted() {},
  updated() {
    this.$nextTick(() => {
      if (sessionStorage.getItem('speechcraft')) {
        var speechcraft = JSON.parse(sessionStorage.getItem('speechcraft'))
        console.log(speechcraft)
        this.model.speechcraftId = speechcraft.id
        this.speechContent = speechcraft.content
      }
      this.getRemarkContentBoxHeight()
    })
  },
  methods: {
    // 选择时间
    searchCustomerList(e) {
      this.model.startTime = e[0]
      this.model.endTime = e[1]
    },
    // 获取行为标签
    getEnterList() {
      this.$http.getBehaviorPages().then((res) => {
        let list = res.data.data
        this.tagNameList = res.data.data
        list.forEach((item) => {
          this.tagList.push(item.tagList)
        })
      })
    },
    // 点击选中、取消标签
    changeTags(tagId, id, name) {
      let arrIndex = this.spanIndex.indexOf(id)
      let newName = this.spanName.indexOf(name)
      if (arrIndex > -1) {
        this.spanIndex.splice(arrIndex, 1)
        this.spanName.splice(newName, 1)
      } else {
        this.spanIndex.push(id)
        this.spanName.push(name)
        console.log(this.spanIndex)
      }
    },
    // 编辑标签
    updateBehav(index) {
      this.BehaviorLabelDialogVisible = true
      this.behaviorLabelType = false
      this.updateBehavList = this.tagNameList[index]
      console.log(this.tagNameList[index])
    },
    // 展开，下拉
    getRemarkContentBoxHeight() {
      let height = this.$refs.remark_content_box.offsetHeight
      this.remarkContentBoxHeight = height
    },
    //点击前往创建行为标签页面
    nextRouter() {
      this.$router.push('/main/scrm/tag-library/enterprise/list')
    },
    // 插入替换文案或表情
    insertTextMsg(val) {
      let textInput = document.getElementById(this.inputId)
      // 插入表情
      let insert = textInput.selectionStart
      this.model.activityWords = textInput.value.substr(0, insert) + val + textInput.value.substr(insert)
    },

    // 获取详情
    getDetail() {
      this.$http.getPullnewCouponDetail({ id: this.id }).then((res) => {
        var data = res.data.data
        this.model=data
        if(this.model.type&&this.model.type=='effective'){
          this.timetype='1'
        }else{
           this.timetype='2'
        }
        if(data.tagList&&data.tagList.length>0){
          data.tagList.forEach((item) => {
            this.spanIndex.push(item.id)
            this.spanName.push(item.name)
          })
        }
        this.activityTime.push(data.startTime)
        this.activityTime.push(data.endTime)
        this.fileList = [{ name: this.model.title, url: this.model.imgUrl }]
        data.subs.forEach((val) => {
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
        oImg.src = data.imgUrl
        oImg.style.width = '330px'
        this.imageUrlToBase64(data.imgUrl, 1)
      })
    },

    // 背景海报上传成功回调
    backsuccess(val) {
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
      this.model.subs = e
    },
    // 昵称
    addclient(e) {
      if (e) {
        var json = {
          type: 'text',
          content: '昵称', //文本内容
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
        this.model.subs.push(json)
      } else {
        var newabc = []
        if (this.model.subs.length > 1) {
          this.model.subs.forEach((item) => {
            if (item.mark != 'clientName') {
              newabc.push(item)
            }
          })
          this.model.subs = newabc
        } else {
          this.model.subs = []
        }
      }
    },

    // 添加二维码
    addCode(e) {
      var url = 'http://athena-1255600302.cosgz.myqcloud.com/attachments/null/d8ba2e2ab95c4050ab67e19bd4ecba83.jpg'
      if (e) {
        var json = {
          type: 'img',
          content: '二维码', //文本内容
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
        this.model.subs.push(json)
        this.imgToBase64(url, 2)
      } else {
        this.qrcode = ''
        var newabc = []
        if (this.model.subs.length > 1) {
          this.model.subs.forEach((item) => {
            if (item.mark != 'code') {
              newabc.push(item)
            }
          })
          this.model.subs = newabc
        } else {
          this.model.subs = []
        }
      }
    },

    // 添加logo
    addlogo(e) {
      var url = 'https://athena-1255600302.cosgz.myqcloud.com/attachments/scrm/3f78fbab83cc45f7aebd299f8d2cdca4.png'
      if (e) {
        var json = {
          type: 'img',
          content: '头像', //文本内容
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
        this.model.subs.push(json)
        this.imgToBase64(url, 3)
      } else {
        this.logo = ''
        var newabc = []
        if (this.model.subs.length > 1) {
          this.model.subs.forEach((item) => {
            if (item.mark != 'logo') {
              newabc.push(item)
            }
          })
          this.model.subs = newabc
        } else {
          this.model.subs = []
        }
      }
    },
    // 上传logo
    updatelogosuccess(e) {
      var url = this.iamgeurl + e.data.imageUrl
      this.model.subs.forEach((item) => {
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
    getWindowWidth() {
      this.windowWidthData = window.innerWidth - 500
    },
    //将base64转换为文件
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 保存
    save() {
      window.pageYoffset = 0;
      window.pageXoffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      const shareContent = this.$refs.grapost.$el // 需要截图的包裹的（原生的）DOM 对象
      var rect = shareContent.getBoundingClientRect()
      var params={x:rect.left,y:rect.top,scrollX:0,scrollY:0,
      width: shareContent.clientWidth,height: shareContent.clientHeight,
      useCORS:true,allowTaint:true,taintTest: true ,letterRendering:true}
      html2canvas(this.$refs.grapost.$el,params).then((canvas) => {
        let dataURL = canvas.toDataURL('image/jpeg')
        var link = dataURL
        this.imagecodejpg(link)
        // this.addposter()
        // this.downloadIamge(dataURL, '海报');
      })
    },
    // 绘制的图片link转jpg格式
    imagecodejpg(link) {
      let file = this.dataURLtoFile(link, 'xx.jpg')
      let params = new FormData()
      params.append('imageType', 'scrm')
      params.append('file', file)
      console.log(params)
      this.$http.upLoadImg(params).then((res) => {
        this.model.link = res.data.data.imageUrl
        this.addposter()
        // this.onSuccess(res.data)
        // this.loading = false
        // this.close()
      })
    },
    addposter() {
      if (!this.model.title) {
        this.$message.warning('请填写海报名称')
        return
      }
      if(this.timetype==1){
        this.activityTime=[]
        this.model.startTime=''
        this.model.endTime=''
        this.model.type='effective'
      }else if(this.timetype==2){
        this.model.type='customize'
        if (this.activityTime.length == 0) {
          this.$message.warning('请选择活动时间')
          return
        }
      }
      
      if (!this.model.imgUrl) {
        this.$message.warning('请上传背景图片')
        return
      }
      // if (this.spanIndex.length == 0) {
      //   this.$message.warning('请选择行为标签')
      //   return
      // }
      this.model.tags = []
      if(this.spanIndex.length>0){
        this.spanIndex.forEach((item) => {
          var list = {}
          list.tagId = item
          this.model.tags.push(list)
        })
      }
      
      if (this.id) {
        var params = this.model
        params.id = this.id
        this.$http.PullUpdateNewCoupon(params).then((res) => {
          if (res.data.code == 20000) {
            this.$message.success('修改成功')
            sessionStorage.removeItem('speechcraftId')
            this.$openNewPageBack()
          }
        })
      } else {
        this.$http.PullAddNewCoupon(this.model).then((res) => {
          if (res.data.code == 20000) {
            this.$message.success('添加成功')
            sessionStorage.removeItem('speechcraftId')
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

.remark_content {
  padding: 50px 18px 30px 20px;
  width: 600px;
  box-sizing: border-box;
  background-color: #f4f4f4;
  position: relative;
  .remark_content_btns {
    position: absolute;
    top: 4px;
    right: 18px;
  }
  .remark_tag_box {
    display: flex;
    // margin-bottom: 10px;
    color: #606266;
    position: relative;
    .remark_tagGroupTitle {
      width: 72px;
      margin-right: 20px;
      text-align: left;
      line-height: 30px;
    }
    .remark_tagChange {
      border-bottom: 1px solid #dcdfe6;
      margin-bottom: 10px;
      flex: 1;
      .remark_tagChange_content {
        display: flex;
        flex-wrap: wrap;
        padding-right: 46px;
        .item {
          margin-bottom: 10px;
          cursor: pointer;
          padding: 5px;
          background-color: #fff;
          border-radius: 4px;
          height: 20px;
          line-height: 20px;
          margin-right: 10px;
        }
      }
    }
    .remark_tag_box_btn {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .showmore {
    position: absolute;
    right: 10px;
    bottom: 0px;
  }
}
.remark_content_box {
  height: 153px;
  overflow: hidden;
  &.show {
    height: auto;
    overflow: none;
  }
}
.active {
  // font-size: 20px !important;
  background-color: #294a7b !important;
  color: #fff !important;
}
::v-deep .el-textarea__inner {
  height: 100px;
}
.option-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  .option-content--box {
    display: flex;
    align-items: center;
    // margin-bottom: 15px;
  }
  .option-left {
    width: 120px;
    padding-right: 12px;
    box-sizing: border-box;
    text-align: left;
  }
  .option-right {
    .right-group {
      display: flex;
      .group-item {
        padding: 5px 10px;
        border: 1px solid #294a7b;
        border-radius: 3px;
        color: #294a7b;
        cursor: pointer;
        margin-right: 10px;
      }
    }
  }
}
.option-tips {
  margin-left: 120px;
  color: #b5b5b5;
}
</style>
