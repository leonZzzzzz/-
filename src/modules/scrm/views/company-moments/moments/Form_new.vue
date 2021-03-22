<template>
  <div class="moments-form">
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">
        {{ $route.query.id ? '修改' : '新增' }}企业动态圈</el-button
      >
    </div>
    <div class="main_content">
      <div class="form-content">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="动态内容" prop="content">
            <UploadEnclosure :radioList="radioList" :uploadList="uploadList" ref="UploadEnclosure"></UploadEnclosure>
          </el-form-item>
          <el-form-item label="发表成员" :required="true">
            <div class="form-member" style="display: flex; align-items: center">
              <div v-if="form.momentsUsers.length <= 0">
                <el-button plain @click="showMemberDialog" size="small" icon="el-icon-plus">添加</el-button>
              </div>
              <div v-else>
                <div style="display: flex; align-items: center; max-length: 400px; flex-wrap: wrap">
                  <div class="member-item" v-for="(item, index) in form.momentsUsers" :key="index">
                    <i class="el-icon-s-custom member-icon"></i>
                    <span>{{ item.name }}</span>
                  </div>
                </div>
                <el-button plain @click="showMemberDialog" size="small" icon="el-icon-plus">修改</el-button>
              </div>
            </div>
            <div class="form-tips">(即该动态需要同步显示的人员朋友圈)</div>
          </el-form-item>
          <el-form-item>
            <el-button @click="onCancel">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 查看图片大图 -->
    <com-dialog :config="imagePreview.config" @closeDialog="imagePreview.config.visible = false">
      <div class="image-dialog">
        <img :src="`${imgHost}${imagePreview.imgUrl}`" style="height: 450px" />
      </div>
    </com-dialog>
    <!-- 选择同步人员 -->
    <department-dialog
      :config="departmentDialog.config"
      @closeDialog="departmentDialog.config.visible = false"
      :selectedList="form.momentsUsers"
      ref="department"
      @handleConfirm="handleConfirm"
    >
    </department-dialog>
    <!-- 选择同步的人员树形结构 -->
    <com-dialog :config="memberDialog.config" @closeDialog="memberDialog.config.visible = false">
      <div class="member-tree">
        <div class="tree-menu">
          <div class="menu-left">
            <div class="title">
              组织架构
              <el-tooltip effect="light" placement="right" content="对外展示的成员需先前往“动态圈成员”进行设置">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
            <div class="left-tree">
              <el-tree
                v-loading="loading"
                :data="treeMenu"
                show-checkbox
                default-expand-all
                node-key="myId"
                ref="tree"
                highlight-current
                :props="defaultProps"
                @check="getCheckedNodes"
                @check-change="getCurrentNode"
              >
              </el-tree>
            </div>
          </div>
          <div class="menu-right">
            <div class="title">已选择的成员</div>
            <div class="right-menu" v-if="!loading">
              <div class="menu-item" v-for="(item, index) in selectedMenu" :key="index">
                <span>
                  <i class="item-icon el-icon-s-custom"></i>
                  {{ item.name }}
                </span>
                <!-- <i class="el-icon-close close-icon" @click="cancelSelect(item)"></i> -->
              </div>
            </div>
          </div>
        </div>
        <div class="group-btn">
          <el-button @click="selectMemberCancel">取 消</el-button>
          <el-button type="primary" @click="selectMemberSubmit">确 定</el-button>
        </div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import VideoUpload from '../../../components/common/VideoUpload'
import ComDialog from '../../../components/common/ComDialog'
import VideoPreview from '../../../components/common/VideoPreview'
import DepartmentDialog from '../../../components/common/DepartmentDialog'
import Emotion from '../../../components/common/Emotion'
import ImageUpload from '../../../components/common/ImageUpload'
import UploadEnclosure from '../../../components/components/UploadEnclosure'
import { IMGURL } from '../../../../../utils/config'
export default {
  components: {
    VideoUpload,
    ComDialog,
    VideoPreview,
    DepartmentDialog,
    Emotion,
    ImageUpload,
    UploadEnclosure
  },
  data() {
    return {
      form: {
        title: '',
        content: '',
        momentsUploadContentList: [], // 上传内容列表{tpye, url}
        momentsUsers: [] // 同步人员列表{cropUserId, userId, name, mobile, position}
      },
      radioList: [
        {
          title: '无',
          type: 'text'
        },
        {
          title: '图片',
          type: 'image'
        },
        {
          title: '视频',
          type: 'video'
        },
        {
          title: '图文链接',
          type: 'image_text'
        }
      ],
      uploadList: {
        // 类型
        radioValue: 'text',
        // 文本
        textarea: '',
        // 图片
        image: [],
        // 视频
        video: {},
        // 图文链接
        imageText: [
          {
            title: '链接标题',
            type: 'text',
            value: ''
          },
          {
            title: '链接简介',
            type: 'text',
            value: ''
          },
          {
            title: '链接地址',
            type: 'text',
            value: ''
          },
          {
            title: '链接封面',
            type: 'image',
            value: []
          }
        ]
      },
      imageList: [],
      videoList: [],
      radio: '-1', // -1无，1图片，2视频，3图文链接
      imagePreview: {
        config: {
          width: '840px',
          title: '查看图片',
          visible: false
        },
        imgUrl: ''
      },
      departmentDialog: {
        config: {
          width: '800px',
          title: '选择同步人员',
          visible: false
        }
      },
      linkForm: {
        type: 3, // 类型
        url: '', // 封面
        title: '', // 标题
        link: '', // 链接地址
        description: '' // 简介
      },
      selectionData: [], // 拥有朋友圈权限的成员列表
      loading: true,
      treeMenu: [],
      defaultProps: {
        children: 'childs',
        label: 'name'
      },
      selectedMenu: [], // 选中后返回的列表，已去重
      treeList: [], // tree转array返回的列表
      currentSelected: [], // 树形结构里面所有选中的值
      memberDialog: {
        config: {
          width: '800px',
          title: '选择发表成员',
          visible: false
        }
      },
      timer: ''
    }
  },
  created() {
    if (this.$route.query.id) {
      this.form.id = this.$route.query.id
      this.getMomentsDetail(this.$route.query.id)
    }
    this.getMemberList()
    // this.getDepartmentTree()
  },
  methods: {
    getMomentsDetail(id) {
      this.$http.getCompMomentsDetail({ id }).then((res) => {
        console.log(res.data.data)
        let data = res.data.data
        this.uploadList = {
          radioValue: this.typeNameFilters(data.momentsUploadContentList),
          textarea: data.content
        }
        if (this.uploadList.radioValue == 'image') {
          let arr = []
          data.momentsUploadContentList.forEach((item) => {
            arr.push({ url: IMGURL + item.url })
          })
          this.uploadList.image = arr
        }
        if (this.uploadList.radioValue == 'video') {
          this.uploadList.video = {
            imagePreviewUrl: '',
            videoPreviewUrl: data.momentsUploadContentList[0].url
          }
        }
        if (this.uploadList.radioValue == 'image_text') {
          let imageText = [
            {
              title: '链接标题',
              type: 'text',
              value: data.momentsUploadContentList[0].title
            },
            {
              title: '链接简介',
              type: 'text',
              value: data.momentsUploadContentList[0].description
            },
            {
              title: '链接地址',
              type: 'text',
              value: data.momentsUploadContentList[0].link
            },
            {
              title: '链接封面',
              type: 'image',
              value: [{ url: IMGURL + data.momentsUploadContentList[0].url }]
            }
          ]
          this.uploadList.imageText = imageText
        }
        console.log('aaaaa', this.uploadList)
        this.form = res.data.data
        // let newList = []
        // this.form.momentsUsers.forEach((item) => {
        //   let obj = {
        //     avatar: item.avatar,
        //     id: item.cropUserId,
        //     name: item.name,
        //     position: item.position,
        //     userId: item.userId
        //   }
        //   // console.log('名称' + item.name + item.id)
        //   newList.push(obj)
        // })
        // this.form.momentsUsers = newList
        // this.selectedMenu = newList
        // // 判断上传内容的类型
        // let uploadList = res.data.data.momentsUploadContentList
        // if (uploadList.length > 0) {
        //   this.radio = uploadList[0].type
        //   if (this.radio === '1') {
        //     this.imageList = res.data.data.momentsUploadContentList
        //   } else if (this.radio === '2') {
        //     this.videoList = res.data.data.momentsUploadContentList
        //   } else if (this.radio === '3') {
        //     this.linkForm = res.data.data.momentsUploadContentList[0]
        //   }
        // } else {
        //   this.radio = '-1'
        // }
      })
    },
    getUploadImage(val) {
      let obj = {
        type: '1',
        url: val
      }
      this.imageList.push(obj)
      console.log('视频路径' + val)
    },
    getUploadVideo(data) {
      let { video, file } = data
      // console.log('上传成功后返回' + video.videoUrl + '//' + video.fileId)
      let obj = {
        type: '2',
        url: video.videoUrl,
        fileId: video.fileId
      }
      this.videoList.push(obj)
    },
    showImgTips() {
      this.$message.warning('最多只能上传九张图片')
    },
    showVideoTips() {
      this.$message.warning('最多只能上传一个视频')
    },
    showImagePreview(item) {
      this.imagePreview.config.visible = true
      this.imagePreview.imgUrl = item.url
    },
    deleteImage(idx) {
      this.imageList.splice(idx, 1)
    },
    deleteVideo(idx) {
      this.videoList.splice(idx, 1)
    },
    onSubmit() {
      let result = this.$refs.UploadEnclosure.onResult()
      console.log('返回', result)
      if (result.textarea) {
        this.form.content = result.textarea
      } else {
        this.$message.warning('请输入内容')
        return
      }
      if (result.radioValue == 'text') {
        this.form.type = '-1'
        this.form.momentsUploadContentList = []
      }
      if (result.radioValue == 'image') {
        this.form.type = '1'
        this.form.momentsUploadContentList = []
        if (result.image.length != 0) {
          result.image.forEach((item) => {
            this.form.momentsUploadContentList.push({
              type: '1',
              url: item.url
            })
          })
        } else {
          this.$message.warning('请上传图片')
          return
        }
      }
      if (result.radioValue == 'video') {
        this.form.type = '2'
        this.form.momentsUploadContentList = []
        if (result.video.video.fileId) {
          this.form.momentsUploadContentList.push({
            type: '2',
            url: result.video.video.videoUrl,
            fileId: result.video.video.fileId
          })
        } else {
          this.$message.warning('请上传视频')
          return
        }
      }
      if (result.radioValue == 'image_text') {
        this.form.type = '3'
        this.form.momentsUploadContentList = []
        if (
          result.imageText[3].value[0] &&
          result.imageText[0].value &&
          result.imageText[2].value &&
          result.imageText[1].value
        ) {
          this.form.momentsUploadContentList.push({
            type: '3',
            url: result.imageText[3].value[0],
            title: result.imageText[0].value,
            link: result.imageText[2].value,
            description: result.imageText[1].value
          })
        } else {
          this.$message.warning('请输入完整的图文信息')
          return
        }
      }
      if (this.form.momentsUsers.length <= 0) {
        this.$message.warning('请选择同步人员')
        return
      } else {
        let list = this.form.momentsUsers
        let newList = []
        list.forEach((item) => {
          let obj = {
            cropUserId: item.id,
            userId: item.userId,
            name: item.name,
            // mobile: '',
            position: item.position,
            avatar: item.avatar
          }
          newList.push(obj)
        })
        this.form.momentsUsers = newList
      }
      console.log('上传的结果', this.form)
      if (this.form.id) {
        this.$http.updateCompMoments(this.form).then(() => {
          this.$message.success('修改成功')
          this.$openNewPageBack()
        })
      } else {
        this.$http.addCompMoments(this.form).then(() => {
          this.$message.success('新增成功')
          this.$openNewPageBack()
        })
      }
    },
    onCancel() {
      this.$openNewPageBack()
    },
    // 显示部门组织架构，并设置已选中的项
    showDepartmentDialog() {
      this.departmentDialog.config.visible = true
      this.$nextTick(() => {
        this.$refs.department.setCheckedNodes()
      })
    },
    deleteUser(idx) {
      this.form.momentsUsers.splice(idx, 1)
    },
    // 关闭弹窗并获取已选中的列表
    handleConfirm(list) {
      this.form.momentsUsers = list
      this.departmentDialog.config.visible = false
    },
    _selectedEmotion(val) {
      let textInput = document.getElementById('textInput')
      // 插入表情
      let insert = textInput.selectionStart
      this.form.content = textInput.value.substr(0, insert) + val + textInput.value.substr(insert)
    },
    // 获取链接封面
    getLinkCover(val) {
      this.linkForm.url = val
    },
    // 删除链接封面
    deleteLinkCover() {
      this.linkForm.url = ''
    },
    getMemberList() {
      this.$http.getMomentsMembers().then((res) => {
        this.selectionData = res.data.data
        // this.loading = false
        this.getDepartmentTree()
      })
    },
    getDepartmentTree() {
      this.$http.getDepartmentTree().then((res) => {
        let tree = res.data.data
        tree.forEach((item) => {
          if (item.userList) {
            item.childs.unshift({ id: 1, name: '成员', userList: item.userList })
          }
        })
        this.treeMenu = JSON.parse(JSON.stringify(tree).replace(/"userList"/g, '"childs"'))
        this.treeMenu[0].childs.forEach((item, index) => {
          // 第二层
          if (item.childs) {
            item.childs.forEach((value, num) => {
              value.myId = `${index}-${num}`
              this.treeList.push(value) // 将对象加入到列表中
              // 禁用没有权限的项
              let idx = this.selectionData.findIndex((item) => item.id === value.id)
              if (idx == -1) {
                value.disabled = true
              }
              // 第三层
              if (value.childs) {
                value.childs.forEach((obj3, idx3) => {
                  obj3.myId = `${index}-${num}-${idx3}`
                  this.treeList.push(obj3) // 将对象加入到列表中
                  // 禁用没有权限的项
                  let idx = this.selectionData.findIndex((item) => item.id === value.id)
                  if (idx == -1) {
                    value.disabled = true
                  }
                  // 第四层
                  if (obj3.childs) {
                    obj3.childs.forEach((obj4, idx4) => {
                      obj4.myId = `${index}-${num}-${idx3}-${idx4}`
                      this.treeList.push(obj4) // 将对象加入到列表中
                      // 禁用没有权限的项
                      let idx = this.selectionData.findIndex((item) => item.id === value.id)
                      if (idx == -1) {
                        value.disabled = true
                      }
                    })
                  }
                })
              }
            })
          }
        })
        // 设置选中的项
        this.form.momentsUsers.forEach((item) => {
          this.treeList.forEach((obj) => {
            if (item.id === obj.id) {
              this.currentSelected.push(obj)
            }
          })
        })
        this.loading = false
        // console.log('tree列表', this.treeList)
      })
    },
    getCheckedNodes() {
      this.$nextTick(() => {
        let list = this.$refs.tree.getCheckedNodes()
        let arr = []
        list.forEach((item) => {
          if (item.userId) {
            arr.push(item)
          }
        })
        // 去重
        let hash = {}
        let newArr = arr.reduce((item, next) => {
          hash[next.name] ? '' : (hash[next.name] = true && item.push(next))
          return item
        }, [])
        this.selectedMenu = newArr
        // this.form.momentsUsers = newArr
      })
    },
    getCurrentNode(node, isChecked) {
      // console.log('当前选的节点', node, isChecked)
      let list = [].concat(this.currentSelected)
      // 节点是否被选中
      if (isChecked) {
        this.treeList.forEach((obj) => {
          if (node.id === obj.id) {
            this.currentSelected.push(obj)
          }
        })
      } else {
        list.forEach((item, index) => {
          if (item.id === node.id) {
            this.currentSelected.splice(
              this.currentSelected.findIndex((item) => item.id === node.id),
              1
            )
          }
        })
      }
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.currentSelected)
      })
    },
    showMemberDialog() {
      this.memberDialog.config.visible = true
      // 设置选中的项
      // this.form.momentsUsers.forEach(item => {
      //   this.treeList.forEach(obj => {
      //     if (item.id === obj.id) {
      //       this.currentSelected.push(obj)
      //     }
      //   })
      // })
      this.timer = setInterval(() => {
        if (!this.loading) {
          this.$nextTick(() => {
            this.$refs.tree.setCheckedNodes(this.currentSelected)
          })
          clearInterval(this.timer)
        }
      }, 500)
    },
    selectMemberCancel() {
      this.memberDialog.config.visible = false
    },
    selectMemberSubmit() {
      this.memberDialog.config.visible = false
      this.form.momentsUsers = this.selectedMenu
    },
    typeNameFilters(option) {
      if (option.length == 0) {
        return 'text'
      }
      if (option[0].type == '1') {
        return 'image'
      }
      if (option[0].type == '2') {
        return 'video'
      }
      if (option[0].type == '3') {
        return 'image_text'
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.moments-form {
  width: 100%;
  height: 100%;
  margin: auto;
}
.main_content {
  background-color: #ffffff;
  margin-top: 20px;
  padding: 20px;
  min-height: calc(100% - 56px);
  box-sizing: border-box;
}
.form-content {
  max-width: 600px;
  .emotion-box {
    width: 40px;
    margin-top: 10px;
  }
  .form-tips {
    color: #909399;
  }
  .form-img {
    display: flex;
    margin-top: 20px;
    flex-flow: wrap;
    .img-add {
      margin: 0 20px 20px 0;
      .item-tips {
        text-align: center;
      }
    }
    .img-item {
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0 20px 20px 0;
      img {
        width: 100px;
        height: 100px;
      }
      .img-item-wrap {
        display: none;
        width: 100px;
        height: 100px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(#000000, 0.6);
        align-items: center;
        .wrap-icons {
          margin: auto;
          font-size: 20px;
          color: #ffffff;
          .item-icon {
            cursor: pointer;
            padding: 0 5px;
          }
        }
      }
    }
    .img-item:hover {
      .img-item-wrap {
        display: flex;
      }
    }
    .img-tips {
      width: 100%;
      color: #909399;
    }
  }
  .form-video {
    display: flex;
    margin-top: 20px;
    .video-add {
      margin: 0 20px 20px 0;
      .item-tips {
        text-align: center;
      }
    }
    .video-item {
      position: relative;
      margin: 0 20px 20px 0;
      .icon-delete {
        position: absolute;
        font-size: 20px;
        right: -25px;
        top: 0;
        cursor: pointer;
      }
    }
  }
  .form-link {
    margin-top: 20px;
    .img-item {
      position: relative;
      width: 100px;
      height: 100px;
      img {
        width: 100px;
        height: 100px;
      }
      .img-item-wrap {
        display: none;
        width: 100px;
        height: 100px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(#000000, 0.6);
        align-items: center;
        .wrap-icons {
          margin: auto;
          font-size: 20px;
          color: #ffffff;
          .item-icon {
            cursor: pointer;
            padding: 0 5px;
          }
        }
      }
    }
    .img-item:hover {
      .img-item-wrap {
        display: flex;
      }
    }
  }
  .form-member {
    display: flex;
    flex-flow: wrap;
    .member-item {
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
      margin-right: 10px;
      margin-top: 5px;
      .member-icon {
        margin-right: 5px;
        color: #294a7b;
      }
      .el-icon-close {
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
}
.upload-max {
  text-align: center;
  margin: 0 20px 20px 0;
  .max-limit {
    display: flex;
    align-items: center;
    width: 100px;
    height: 100px;
    border: 1px dashed #ccc;
    background-color: #f9f9f9;
    cursor: pointer;
  }
  .el-icon-plus {
    font-size: 40px;
    color: #b5b5b5;
    margin: auto;
  }
}
.image-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 800px;
  }
}
.member-tree {
  .tree-menu {
    display: flex;
    padding: 20px;
    box-sizing: border-box;
    height: 600px;
    overflow-y: auto;
    .menu-left {
      flex: 1;
      border-right: 1px solid #dcdfe6;
      margin-right: 20px;
    }
    .menu-right {
      flex: 1;
      .right-menu {
        .menu-item {
          display: flex;
          justify-content: space-between;
          line-height: 32px;
          color: #222222;
          max-width: 200px;
          align-items: center;
          .close-icon {
            cursor: pointer;
          }
          .item-icon {
            color: #294a7b;
          }
        }
      }
    }
    .title {
      margin-bottom: 20px;
      color: #909399;
    }
  }
  .group-btn {
    display: flex;
    justify-content: flex-end;
  }
}
::v-deep .image-upload-wrap .tip-text {
  background-color: #f9f9f9;
}
::v-deep .el-form-item .el-form-item {
  margin-bottom: 22px;
}
::v-deep .el-popover {
  left: 40px;
}
</style>
