<template>
  <div>
    <GoBack title="返回"></GoBack>
    <div class="enterprise-div">
      <div class="en-div">
        <div class="enterprise-btn">
          <el-button size="small" type="primary" v-if="!isShow" @click="addMessage">新增</el-button>
          <el-button size="small" type="primary" v-else @click="editMessage">修改</el-button>
          <!-- <el-button size="small" type="primary" @click="uploadPpt">ppt转图片</el-button> -->
        </div>
        <div class="title">
          <p>基础信息</p>
        </div>
        <el-form label-position="left" label-width="100px" v-if="isShow">
          <el-form-item label="名片主题:">
            <span>{{ tableData.name }}</span>
          </el-form-item>
          <el-form-item label="企业logo:">
            <img class="logo" :src="tableData.host + tableData.logo" />
          </el-form-item>
          <el-form-item label="名片封面">
            <img class="logo" :src="tableData.host + tableData.cover" alt="" />
          </el-form-item>
          <el-form-item label="官网简介:">
            <div class="introduct">
              {{ tableData.introduction }}
            </div>
          </el-form-item>

          <el-form-item label="企业地址:">
            {{ tableData.address || '-' }}
          </el-form-item>
          <el-form-item label="企业电话:">
            {{ tableData.tel || '-' }}
          </el-form-item>
          <el-form-item label="企业介绍:" class="image-item-div">
            <div class="image-div" v-for="(item, index) in tableData.images" :key="index">
              <el-image class="el-images-item" :src="item" :preview-src-list="tableData.images"></el-image>
            </div>
          </el-form-item>
          <div class="btn-div">
            <el-button size="small" type="primary" @click="uploadPpt">ppt/pptx/pdf转图片</el-button>
          </div>
        </el-form>
        <div v-if="!isShow" style="text-align:center">暂无信息</div>
        <div class="title">
          <p>企业标签</p>
        </div>
        <div class="tag-div" v-if="isShow">
          <Tag type="light" icon="el-icon-price-tag" v-for="(item, index) in tableData.tags" :key="index"
            >{{ item.name }}
          </Tag>
        </div>
        <div v-if="!isShow" style="text-align:center">暂无信息</div>
      </div>

      <com-dialog :config="addDialog.config" @closeDialog="addDialog.config.visible = false">
        <el-form label-position="right" label-width="80px" class="dialog-div" v-if="addDialog.config.visible">
          <el-form-item label="名片主题" :required="true">
            <el-input placeholder="请输入名片主题" v-model="addTable.name" maxlength="64" show-word-limit> </el-input>
          </el-form-item>
          <el-form-item label="企业logo" :required="true">
            <UploadImage
              :width="100"
              :size="9999"
              :fileList="FristList"
              :height="100"
              @success="addImageSuccess"
            ></UploadImage>
          </el-form-item>
          <el-form-item label="名片封面" :required="true">
            <UploadImage
              :size="9999"
              :fileList="SecondList"
              :width="100"
              :height="100"
              @success="addSuccess"
            ></UploadImage>
          </el-form-item>
          <el-form-item label="官网简介" :required="true">
            <el-input
              v-model="addTable.introduction"
              type="textarea"
              maxlength="128"
              show-word-limit
              :rows="4"
              placeholder="请输入官网简介"
              class="textarea-input"
            ></el-input>
          </el-form-item>

          <el-form-item label="企业地址">
            <el-input placeholder="请输入企业地址" v-model="addTable.address"></el-input>
          </el-form-item>
          <el-form-item label="企业电话">
            <el-input placeholder="请输入企业电话" v-model="addTable.tel"></el-input>
          </el-form-item>
          <el-form-item label="企业介绍" class="imgLoad" :required="true">
            <UploadImage
              :fileList="ThirdList"
              :width="100"
              :height="100"
              :maxLength="9"
              @success="addImageCoverSuccess"
              :size="9999"
            ></UploadImage>
          </el-form-item>
          <el-form-item label="企业标签" :required="true">
            <div class="addtag-input">
              <div class="addtag-input-content" v-for="(item, index) in addTable.tags" :key="index">
                <div class="inp">
                  <el-input placeholder="请输入标签名" maxlength="15" show-word-limit v-model="item.name"></el-input>
                </div>
                <div class="btn">
                  <el-button circle icon="el-icon-minus" @click="deteleAddEnterpriseRow(index)" size="mini"></el-button>
                </div>
              </div>
            </div>
            <div v-if="addTable.tags && addTable.tags.length < 3">
              <el-button @click="addaddEnterpriseKeyWord" plain icon="el-icon-plus" size="small">添加标签</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div class="footer_btns" style="display: flex; justify-content: flex-end">
          <el-button @click="addDialog.config.visible = false">取消</el-button>
          <el-button type="primary" :disabled="sumLoading" :loading="sumLoading" @click="addSumbit">保存</el-button>
        </div>
      </com-dialog>

      <com-dialog :config="editDialog.config" @closeDialog="editDialog.config.visible = false">
        <el-form label-position="right" label-width="80px" class="dialog-div">
          <el-form-item label="名片主题" :required="true">
            <el-input placeholder="请输入名片主题" v-model="editTable.name" maxlength="64" show-word-limit> </el-input>
          </el-form-item>
          <el-form-item label="企业logo" :required="true">
            <UploadImage
              :size="9999"
              :width="100"
              :height="100"
              :fileList="imageFileList"
              @success="imageSuccess"
            ></UploadImage>
          </el-form-item>
          <el-form-item label="名片封面" :required="true">
            <UploadImage
              :size="9999"
              :width="100"
              :height="100"
              :fileList="imgCoverList"
              @success="imgSuccessList"
            ></UploadImage>
          </el-form-item>
          <el-form-item label="官网简介" :required="true">
            <el-input
              v-model="editTable.introduction"
              type="textarea"
              maxlength="128"
              show-word-limit
              :rows="4"
              placeholder="请输入官网简介"
              class="textarea-input"
            ></el-input>
          </el-form-item>

          <el-form-item label="企业地址">
            <el-input placeholder="请输入企业地址" v-model="editTable.address"></el-input>
          </el-form-item>
          <el-form-item label="企业电话">
            <el-input placeholder="请输入企业电话" v-model="editTable.tel"></el-input>
          </el-form-item>
          <el-form-item label="企业介绍" class="imgLoad" :required="true">
            <el-upload
              :action="baseUrl + '/api/v1/attachments/images/tencent_cloud'"
              list-type="picture-card"
              :on-success="success"
              :data="{ imageType: 'scrm' }"
              :limit="9999"
              :multiple="true"
              :file-list="imageCoverFileList"
              :before-upload="beforeUpload"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              accept=".png,.jpg,.jpeg"
            >
              <i class="el-icon-plus myIcon"></i>
              <span class="tips">{{ '上传图片' }}</span>
            </el-upload>
          </el-form-item>
          <el-form-item label="企业标签" :required="true">
            <div class="addtag-input">
              <div class="addtag-input-content" v-for="(item, index) in editTable.tags" :key="index">
                <div class="inp">
                  <el-input placeholder="请输入标签名" maxlength="15" show-word-limit v-model="item.name"></el-input>
                </div>
                <div class="btn">
                  <el-button circle icon="el-icon-minus" @click="deteleEnterpriseRow(index)" size="mini"></el-button>
                </div>
              </div>
            </div>
            <div v-if="editTable.tags && editTable.tags.length < 3">
              <el-button @click="addEnterpriseKeyWord" plain icon="el-icon-plus" size="small">添加标签</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div class="footer_btns" style="display: flex; justify-content: flex-end">
          <el-button @click="editDialog.config.visible = false">取消</el-button>
          <el-button type="primary" @click="editSumbit">保存</el-button>
        </div>
      </com-dialog>
      <com-dialog :config="pptDialog.config" @closeDialog="pptDialog.config.visible = false">
        <el-form label-position="left" label-width="100">
          <el-form-item label="上传文件">
            <el-upload
              :before-upload="beforePptUpload"
              v-if="isPtt"
              :action="baseUrl + `/api/admin/v1/crop-company/upload-ppt`"
              list-type="picture-card"
              :on-success="pptSuccess"
              :file-list="pptList"
              :limit="1"
              accept=".ppt,.pptx,.pdf"
              class="upload-ppt"
              :multiple="false"
            >
              <i class="el-icon-plus addIcon"></i>
            </el-upload>
            <span class="ok-upload" v-if="isPtt == false">文件已上传</span>
            <span class="ok-upload" v-if="isPtt == false" @click="isPtt = true">点击重新上传ppt</span>
            <div class="text-upload">(上传的文件可选择ppt/pptx/pdf)</div>
          </el-form-item>
        </el-form>
        <div class="sumbit-btm" style="display:flex">
          <el-button style="margin-left:auto;margin-right:20px" type="primary" size="small" @click="sumbitPpt"
            >确定</el-button
          >
        </div>
      </com-dialog>
    </div>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack.vue'
import UploadImage from '../../../components/components/UploadImage'
// import UploadMoreImage from '../../../components/components/UploadImage'
import Tag from '../../../components/components/Tag'
import ComDialog from '../../../components/common/ComDialog'
export default {
  components: { Tag, ComDialog, UploadImage, GoBack },
  data() {
    return {
      FristList: [],
      SecondList: [],
      ThirdList: [],
      tableData: [],
      isShow: false,
      editDialog: {
        config: {
          width: '600px',
          title: '完善企业名片信息',
          visible: false
        }
      },
      pptDialog: {
        config: {
          width: '600px',
          title: '上传文件',
          visible: false
        }
      },
      addList: [],
      addTable: {
        name: '',
        logo: '',
        address: '',
        introduction: '',
        tel: '',
        images: '',
        cover: '',
        tags: [{ id: '', name: '' }]
      },
      addDialog: {
        config: {
          width: '600px',
          title: '新增信息',
          visible: false
        }
      },
      addImageCoverFileList: [],
      addImageFileList: [],
      editTable: [],
      imageFileList: [
        {
          name: '',
          url: ''
        }
      ],
      imageCoverFileList: [],
      tags: [],
      val: [],
      cover: [],
      coverImage: [],
      imgCoverList: [
        {
          name: '',
          url: ''
        }
      ],
      imageUpload: [],
      dialogImageUrl: '',
      size: 9999,
      width: 146,
      height: 146,
      deteleList: [],
      pptList: [], //上传之后的pptList回显列表
      isPtt: true,
      sumLoading: false
    }
  },
  methods: {
    sumbitPpt() {
      if (this.isPtt) {
        this.$message.warning('请等待上传成功')
        return
      } else {
        this.pptDialog.config.visible = false
      }
    },
    //上传ppt之前
    beforePptUpload(file) {
      const isPpt =
        file.type === 'application/pdf' ||
        file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
        file.type === 'iapplication/vnd.ms-powerpoint'
      if (!isPpt) {
        this.$message.error('请上传ppt/pptx/pdf文件')
        return
      }
    },
    //点击上传ppt文件
    pptSuccess(val) {
      if (val.code == 20000) {
        this.$message.success('上传成功，请等待1-2分钟后刷新查看')
        this.isPtt = false
        this.getCropCompant()
      }
    },
    //点击上传ppt转图片按钮
    uploadPpt() {
      this.pptDialog.config.visible = true
    },
    //新建的上传图片组件
    success(res, file, fileList) {
      this.deteleList = []
      this.showUploadButton(fileList)
      let result = this.formatImageData(fileList)

      this.deteleList = result
    },
    handleRemove(file, fileList) {
      this.showUploadButton(fileList)
      let result = this.formatImageData(fileList)
      // this.imageCoverFileList = result
      this.deteleList = result
    },
    handlePictureCardPreview(file) {
      if (file.url.includes('http')) {
        this.dialogImageUrl = file.url
      } else {
        this.dialogImageUrl = this.imgHost + file.url
      }
    },
    beforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isSize = file.size / 1024 / 1024 < this.size
      if (!isImage) {
        this.$message.error('请上传正确格式图片')
      }
      if (!isSize) {
        this.$message.error(`请上传小于${this.size}M大小图片`)
      }
      this.$nextTick(() => {
        this.setUpoadImagePicSize(this.width, this.height)
      })
      return isImage && isSize
    },
    formatImageData(option) {
      let arr = []
      let reg = new RegExp(this.imgHost)
      option.forEach((item) => {
        if (!item.response) {
          let url = ''
          if (reg.test(item.url)) {
            url = item.url.split(reg)[1]
          } else {
            url = item.url || ''
          }
          arr.push({
            name: item.name || '',
            fileId: item.uid || '',
            url
          })
          return
        } else {
          arr.push({
            name: item.name || '',
            fileId: item.uid || '',
            url: item.response.data.imageUrl || ''
          })
        }
      })
      return arr
    },
    showUploadButton(option) {
      this.setUpoadImagePicSize(this.width, this.height)
      if (option.length >= this.maxLength) {
        document.querySelector('.el-upload--picture-card').style.display = 'none'
      } else {
        document.querySelector('.el-upload--picture-card').style.display = 'inline-block'
      }
    },
    setUpoadImageBtnSize(w, h) {
      let btns = document.querySelectorAll('.el-upload--picture-card')
      btns.forEach((item) => {
        item.style.width = w + 'px'
        item.style.height = h + 'px'
        item.style.lineHeight = h + 'px'
      })
    },
    setUpoadImagePicSize(w, h) {
      let imgBox = document.querySelectorAll('.el-upload-list__item')
      imgBox.forEach((item) => {
        item.style.width = w + 'px'
        item.style.height = h + 'px'
        item.style.transition = 'none'
      })
    },

    //上传图片组件结束

    imgSuccessList(val) {
      console.log(val)
      this.imgCoverList[0].url = val[0] ? val[0].url : ''
    },
    addSuccess(val) {
      this.addList = val
    },
    addaddEnterpriseKeyWord() {
      if (this.addTable.tags.some((item) => !item.name)) {
        this.$message.warning('请输入标签名')
        return
      }
      if (this.addTable.tags.length >= 3) {
        this.$message.warning('标签个数不能超过三个')
        return
      }
      this.addTable.tags.push({ name: '', id: '' })
      return
    },
    deteleAddEnterpriseRow(index) {
      if (this.addTable.tags.length === 1) {
        this.$message.warning('至少含有一个标签')
        return
      }
      this.addTable.tags.splice(index, 1)
    },
    addMessage() {
      this.addDialog.config.visible = true
    },
    addSumbit() {
      let imageList = []
      let List = []
      if (this.addTable.name == '') {
        this.$message.warning('名称不能为空')
        return
      }
      if (this.addImageFileList.length == 0) {
        this.$message.warning('请上传Logo')
        return
      }
      if (this.addTable.introduction == '') {
        this.$message.warning('简介不能为空')
        return
      }
      if (this.addList.length == 0) {
        this.$message.warning('图片不能为空')
        return
      }
      // if (this.addTable.address == '') {
      //   this.$message.warning('地址不能为空')
      //   return
      // }
      // if (this.addTable.tel == '') {
      //   this.$message.warning('电话不能为空')
      //   return
      // }
      if (this.addImageCoverFileList.length == 0) {
        this.$message.warning('请上传企业介绍图片')
        return
      }
      if (this.addTable.tags.length == 0) {
        this.$message.warning('至少需要一个标签')
        return
      }
      if (this.addTable.tags.length != 0) {
        let flag = false
        let flags = false
        let newArr = []
        this.addTable.tags.forEach((item) => {
          newArr.push(item.name)
          flags = item.name == ''
        })
        var s = newArr.join(',') + ','
        for (var i = 0; i < newArr.length; i++) {
          flag = s.replace(newArr[i] + ',', '').indexOf(newArr[i] + ',') > -1
        }
        if (flags == true) {
          this.$message.warning('请输入标签名')
        } else if (flag == true) {
          this.$message.warning('标签名字不能重复')
        } else {
          this.addTable.logo = this.addImageFileList[0].url
          this.addImageCoverFileList.forEach((item) => {
            imageList.push(item.url)
          })
          let cover = imageList.join(',')
          this.addTable.images = cover
          this.addList.forEach((item) => {
            List.push(item.url)
          })
          let images = List.join(',')
          this.addTable.cover = images
          console.log(this.addTable)
          this.addCropCompant()
        }
      }
    },
    addCropCompant() {
      this.sumLoading = true
      this.$http.addCropCompant(this.addTable).then(() => {
        this.sumLoading = false
        this.$messasge.success('新增成功')
        this.addDialog.config.visible = false
        this.getCropCompant()
        this.addTable = {
          name: '',
          logo: '',
          address: '',
          introduction: '',
          tel: '',
          images: '',
          cover: '',
          tags: [{ id: '', name: '' }]
        }
        this.addList = []
        this.addImageCoverFileList = []
        this.addImageFileList = []
        this.FristList = []
        this.SecondList = []
        this.ThirdList = []
      })
    },
    addImageCoverSuccess(val) {
      this.addImageCoverFileList = val
    },
    addImageSuccess(val) {
      this.addImageFileList = val
    },
    //点击添加标签
    addEnterpriseKeyWord() {
      if (this.editTable.tags.some((item) => !item.name)) {
        this.$message.warning('请输入标签名')
        return
      }
      if (this.editTable.tags.length >= 3) {
        this.$message.warning('标签个数不能超过三个')
        return
      }
      this.editTable.tags.push({ name: '', id: '' })
      return
    },
    //点击删除标签按钮
    deteleEnterpriseRow(index) {
      if (this.editTable.tags.length === 1) {
        this.$message.warning('至少含有一个标签')
        return
      }
      this.editTable.tags.splice(index, 1)
    },
    //点击修改按钮
    imageSuccess(val) {
      this.imageFileList[0].url = val[0] ? val[0].url : ''
    },
    editMessage() {
      this.editTable = JSON.parse(JSON.stringify(this.editTable))
      this.imageCoverFileList = []
      this.imageFileList[0].url = this.editTable.host + this.editTable.logo
      this.imgCoverList[0].url = this.editTable.host + this.editTable.cover
      let images = []
      images = this.editTable.images.split(',')
      images.forEach((item) => {
        this.imageCoverFileList.push({ name: 'image', url: this.imgHost + item })
      })
      this.editDialog.config.visible = true

      // console.log(this.imageCoverFileList)
    },
    imageCoverSuccess(val) {
      this.imageUpload = val

      // let arr = val.concat()
      // arr.forEach(item => {
      //   this.imageCoverFileList.push({ url: item.url })
      //   // console.log(item.url)
      // })
    },
    //点击修改保存按钮
    editSumbit() {
      if (this.deteleList.length != 0) {
        this.imageCoverFileList = this.deteleList
      }
      let coverList = []
      let images = []
      if (this.editTable.name == '') {
        this.$message.warning('名称不能为空')
        return
      }
      if (this.imageFileList[0].url == '') {
        this.$message.warning('请上传Logo')
        return
      }
      if (this.editTable.introduction == '') {
        this.$message.warning('简介不能为空')
        return
      }
      if (this.imgCoverList[0].url == '') {
        this.$message.warning('请上传名片封面')
        return
      }
      // if (this.editTable.address == '') {
      //   this.$message.warning('地址不能为空')
      //   return
      // }
      // if (this.editTable.tel == '') {
      //   this.$message.warning('电话不能为空')
      //   return
      // }
      if (this.imageCoverFileList.length == 0) {
        this.$message.warning('请上传企业介绍图片')
        return
      }
      if (this.editTable.tags.length == 0) {
        this.$message.warning('至少需要一个标签')
        return
      }
      if (this.editTable.tags.length != 0) {
        let flag = false
        let flags = false
        let newArr = []
        this.editTable.tags.forEach((item) => {
          newArr.push(item.name)
          flags = item.name == ''
        })
        var s = newArr.join(',') + ','
        for (var i = 0; i < newArr.length; i++) {
          flag = s.replace(newArr[i] + ',', '').indexOf(newArr[i] + ',') > -1
        }
        if (flags == true) {
          this.$message.warning('请输入标签名')
        } else if (flag == true) {
          this.$message.warning('标签名字不能重复')
        } else {
          this.editTable.logo = this.imageFileList[0].url
          if (this.editTable.logo.indexOf('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com') > -1) {
            this.editTable.logo = this.editTable.logo.replace(
              /https:\/\/athena-1255600302.cos.ap-guangzhou.myqcloud.com/,
              ''
            )
          }
          this.editTable.cover = this.imgCoverList[0].url
          if (this.editTable.cover.indexOf('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com') > -1) {
            this.editTable.cover = this.editTable.cover.replace(
              /https:\/\/athena-1255600302.cos.ap-guangzhou.myqcloud.com/,
              ''
            )
          }

          this.imageCoverFileList.forEach((item) => {
            if (item.raw != undefined) {
              images.push(item.response.data.imageUrl)
            } else {
              let url = item.url.replace(/https:\/\/athena-1255600302.cosgz.myqcloud.com/, '')
              images.push(url)
            }
          })
          this.editTable.images = images.join(',')
          console.log(this.editTable)
          this.updateCropCompant()
        }
      }
    },
    updateCropCompant() {
      this.$http.updateCropCompant(this.editTable).then(() => {
        this.$message.success('保存成功')
        this.editDialog.config.visible = false
        this.getCropCompant()
      })
    },
    //接口部分
    getCropCompant() {
      this.$http.getCropCompant().then((res) => {
        if (!res.data.data) {
          this.isShow = false
          return
        } else {
          this.tableData = res.data.data
          this.isShow = true
          this.editTable = Object.assign({}, res.data.data)
          if (this.tableData.images != '') {
            this.tableData.images = this.tableData.images.split(',').map((s) => {
              return this.tableData.host + s
            })
          }
        }
      })
    }
    //接口部分结束
  },
  created() {
    this.getCropCompant()
  },
  mounted() {
    this.$nextTick(() => {
      this.setUpoadImageBtnSize(this.width, this.height)
    })
  }
}
</script>

<style lang="scss" scoped>
.enterprise-div {
  background-color: #fff;

  width: 100%;
  color: #606266;
  .en-div {
    padding: 20px;
    height: 100%;
    .enterprise-btn {
      padding-bottom: 20px;
      border-bottom: 1px solid #ccc;
    }
    .title {
      font-size: 16px;
      padding-bottom: 20px;
      p {
        padding: 10px 0;
        position: relative;
        &::before {
          content: '';
          display: block;
          width: 6px;
          height: 20px;
          background-color: #294a7b;
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto 0;
          left: -20px;
        }
      }
    }

    .logo {
      width: 100px;
      height: 100px;
    }
    .introduct {
      margin-top: 6px;
      width: 500px;
      line-height: 20px;
    }
    .tag-div {
      width: 550px;
      font-size: 14px;
      span {
        margin-left: 5px;
      }
    }
  }
}
.textarea-input {
  // width: 500px;
  ::v-deep .el-textarea__inner {
    padding-bottom: 20px;
  }
  ::v-deep .el-input__count {
    width: calc(100% - 2px);
    bottom: 1px;
    height: 20px;
    line-height: 20px;
    text-align: right;
    left: 1px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    padding-right: 10px;
    box-sizing: border-box;
  }
}
.image-item-div {
  width: 600px;
  .image-div {
    // border: 1px solid red;
    float: left;
    margin-right: 10px;
    // width: 150px;
    .el-images-item {
      width: 150px;
      height: 150px;
    }
  }
}
.btn-div {
  margin-left: 100px;
}

.dialog-div {
  // margin: 0 20px;
  padding-right: 20px;
  height: 700px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 2px;
  }
}
.addtag-input {
  padding-top: 10px;
  .addtag-input-content {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .inp {
      flex: 1;
    }
    .score {
      padding-left: 10px;
      width: 110px;
    }
    .btn {
      width: 28px;
      padding-left: 10px;
    }
  }
}
.addtag-addBtn {
  margin-bottom: 20px;
  .el-button {
    color: #1e90ff;
  }
}
::v-deep .el-upload--picture-card i {
  font-size: 14px;
}
.tips {
  width: 100%;
  height: 16px;
  font-size: 14px;
  line-height: 16px;
  color: #8c939d;
}
/deep/.el-upload-list__item {
  width: 100px !important;
  height: 100px !important;
}
.ok-upload {
  margin-right: 10px;
  user-select: none;
  cursor: pointer;
  border: 1px dashed green;
  padding: 5px;
  border-radius: 5px;
}
/deep/.el-upload--picture-card {
  width: 100px;
  height: 100px;
}
.addIcon {
  font-size: 16px;
  line-height: 100px;
  display: block;
}
.text-upload {
  margin-left: 70px;
}
</style>
