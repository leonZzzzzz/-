<template>
  <div class="grouplive-form">
    <QcNavigationPage content="修改活码" full>
      <div class="groupname-form">
        <el-form label-position="right" label-width="auto">
          <el-form-item label="活码名称" :required="true">
            <el-input
              type="textarea"
              maxlength="32"
              show-word-limit
              size="small"
              placeholder="最多可输入32字"
              height="500px"
              :rows="2"
              resize="none"
              width="200px"
              v-model="model.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="欢迎语">
            <el-input
              id="textInput"
              class="record_input"
              type="textarea"
              width="600px"
              maxlength="100"
              show-word-limit
              size="small"
              placeholder="最多可输入100字"
              height="400px"
              :rows="6"
              resize="none"
              v-model="model.message"
            >
            </el-input>
            <div class="welcome-buttom">
              <div class="welcome-emjoi">
                <emotion @selectedEmotion="_selectedEmotion"></emotion>
              </div>
              <div class="welcome-div">
                <span class="welcome-firstname">插入昵称</span>
                <span class="welcome-customername" @click="insert('<客户昵称>')">客户昵称</span>
                <span class="welcome-salename" @click="insert('<成员昵称>')">成员昵称</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="附加内容" :required="true">
            <el-radio-group v-model="model.materialList[0].type">
              <el-radio label="text" @change="changeNone">无</el-radio>
              <el-radio label="image" @change="changeImage">图片</el-radio>
              <el-radio label="image_text" @change="changeWeb">网页</el-radio>
              <el-radio label="program" @change="changeApp">小程序</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="image-div" v-if="model.materialList[0].type === 'image'">
            <QcImageUpload width="100px" height="100px" class="image-upload" v-model="imageUrl"> </QcImageUpload>
            <span>上传图片</span>
          </div>
          <div class="web-div" v-if="model.materialList[0].type === 'image_text'">
            <el-form-item :required="true" label="链接标题"
              ><el-input placeholder="最多可输入32个字" v-model="model.materialList[0].name"></el-input
            ></el-form-item>
            <el-form-item :required="true" label="链接简介"
              ><el-input placeholder="最多可输入32个字" v-model="model.materialList[0].content"></el-input
            ></el-form-item>
            <el-form-item :required="true" label="链接地址"
              ><el-input placeholder="请输入链接地址" v-model="model.materialList[0].link"></el-input
            ></el-form-item>
            <el-form-item :required="true" label="封面图">
              <QcImageUpload width="100px" height="100px" v-model="linkImageUrl"> </QcImageUpload>
              <span>上传图片</span>
            </el-form-item>
          </div>
          <div class="app-div" v-if="model.materialList[0].type === 'program'">
            <el-form-item label="配置小程序" :required="true">
              <el-select placeholder="请选择" v-model="model.materialList[0].programId" @change="changeSelect()">
                <el-option
                  class="app-select"
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="关联人员" :required="true">
            <el-button type="text" @click="addPeople">添加</el-button>

            <div class="tag-item" v-if="form.momentsUsers.length != 0">
              <span v-for="(item, index) in form.momentsUsers" :key="index">
                <i class="item-icon el-icon-s-custom"></i>
                {{ item.name }}
              </span>
            </div>
            <div class="add-title">(即该活码可以添加的人员，多人随机分配)</div>
          </el-form-item>

          <el-form-item label="扫码行为标签">
            <div class="info-itemtag-div">
              <span class="edit-tag" @click="editEnterTag()" v-if="spanName.length != 0">编辑</span>
              <span class="info-itemtag" v-for="(item, EnertTag) in spanName" :key="EnertTag">
                {{ item || '--' }}
              </span>
            </div>
            <div>
              <el-button type="text" @click="addScanCode" v-if="spanName.length == 0">添加</el-button>
              <div class="add-title">(即该活码可以添加的客户打上对应的标签)</div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sumbitLivecode">保存</el-button>
            <el-button @click="cancelLiveCode">取消</el-button>
          </el-form-item>
        </el-form>

        <com-dialog :config="addTagDialog.config" @closeDialog="closeAdd" class="editRecordCom">
          <div class="remark-content">
            <el-form class="none-form" v-if="tagNameList.length == 0">
              <el-form-item class="none-tag">
                暂无创建的行为标签，<el-button type="text" @click="nextRouter">请先前往创建&nbsp;&gt;</el-button>
              </el-form-item>
            </el-form>

            <div class="selectGroup" v-if="tagNameList.length != 0">
              <div class="leftTitle">
                <span>已选</span>
              </div>
              <div class="rightTags">
                <el-tag
                  v-for="(tag, index) in spanName"
                  :key="index"
                  closable
                  type="info"
                  :disable-transitions="true"
                  @close="closeTagList(tag, index)"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <div v-for="(item, index) in tagNameList" :key="index">
              <div class="tagGroupTitle">{{ item.name }}</div>
              <div class="tagChange">
                <div
                  @click="changeTags(items.tagId, items.id, items.name)"
                  v-for="(items, indexs) in item.tagList"
                  :key="indexs"
                  :class="{ active: spanIndex.includes(items.id) }"
                >
                  {{ items.name }}
                </div>
              </div>
            </div>
            <div class="Btn-two">
              <el-row :gutter="24">
                <el-col :span="7">&nbsp; </el-col>
                <el-col :span="7">&nbsp;</el-col>
                <el-col :span="5">
                  <el-button type="info" @click="closeTagDialog()">取消</el-button>
                </el-col>
                <el-col :span="5">
                  <el-button type="primary" @click="sumbitTagDialog()">确定</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </com-dialog>
      </div>
    </QcNavigationPage>
    <department-dialog
      :config="departmentDialog.config"
      @closeDialog="departmentDialog.config.visible = false"
      :selectedList="form.momentsUsers"
      ref="department"
      @handleConfirm="handleConfirm"
    >
    </department-dialog>
  </div>
</template>
<script>
import ComDialog from '../../../components/common/ComDialog'
import api from '../../../api/operation-management'
import Emotion from '../../../components/common/Emotion'
import DepartmentDialog from '../../../components/common/DepartmentDialog'
export default {
  components: { ComDialog, Emotion, DepartmentDialog },
  data() {
    return {
      changeTag: 'text',
      textarea: '',
      val: '',
      addTagDialog: {
        config: {
          width: '600px',
          title: '关联行为标签',
          visible: false
        }
      },
      options: [], //小程序选项
      model: {
        materialList: [
          {
            id: '',
            appId: '',
            isDeleted: true,
            createTime: '',
            type: 'text',
            name: '',
            content: '',
            imageUrl: '',
            videoUrl: '',
            link: '',
            programId: '',
            file: '',
            createBy: ''
          }
        ],
        behaviorTagList: [],
        type: 1,
        userList: [],
        name: '',
        message: ' '
      },
      imageUrl: '',
      linkImageUrl: '',
      departmentDialog: {
        config: {
          width: '800px',
          title: '选择关联人员',
          visible: false
        }
      },
      form: {
        momentsUsers: [] // 同步人员列表{cropUserId, userId, name, mobile, position}
      },
      routeId: '',
      tagList: [],
      spanName: [],
      spanIndex: [], //点击标签颜色会变得数组
      tagNameList: [], //获取编辑整个分组的信息
      newArrsCustomer: [],
      sumbitSpanName: [],
      behaviorTagList: []
    }
  },
  methods: {
    //改变无
    changeNone(val) {
      this.model.materialList[0].type = val
    },
    //改变图片
    changeImage(val) {
      this.model.materialList[0].type = val
    },
    //改变网址
    changeWeb(val) {
      this.model.materialList[0].type = val
    },
    //改变小程序
    changeApp(val) {
      this.model.materialList[0].type = val
    },
    //点击扫码行为添加按钮
    addScanCode() {
      this.addTagDialog.config.visible = true
    },
    //点击前往创建行为标签页面
    nextRouter() {
      this.$router.push('')
    },
    //关闭关联标签弹
    closeTagDialog() {
      this.sumbitTagDialog()
    },
    //提交关联标签按钮
    sumbitTagDialog() {
      this.addTagDialog.config.visible = false
      this.model.behaviorTagList = []
      this.spanIndex.forEach((item) => {
        this.model.behaviorTagList.push({ id: item })
      })
    },
    //点击编辑打开弹窗
    editTagDialog() {
      this.addTagDialog.config.visible = true
    },
    async insert(myValue) {
      let myField = document.getElementById('textInput')
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.model.message =
          myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)
        await this.$nextTick()
        myField.focus()
        myField.setSelectionRange(endPos + myValue.length, endPos + myValue.length)
      } else {
        this.model.message += myValue
      }
    },
    _selectedEmotion(val) {
      let message = document.getElementById('textInput')
      let insert = message.selectionStart
      this.model.message = message.value.substr(0, insert) + val + message.value.substr(insert)
    },
    //获取小程序
    getProgarm() {
      api.getProgarm().then((res) => {
        this.options = res.data.data
      })
    },
    changeSelect(val) {
      this.options.forEach((item) => {
        if (item.id === val) {
          this.model.materialList[0].programId = item.id
        }
      })
    },
    handleConfirm(list) {
      this.model.userList = []
      this.form.momentsUsers = list
      this.departmentDialog.config.visible = false
      console.log(this.form.momentsUsers)
    },
    //关联人员添加按钮
    addPeople() {
      this.departmentDialog.config.visible = true
      this.$nextTick(() => {
        this.$refs.department.setCheckedNodes()
      })
    },
    //保存按钮
    sumbitLivecode() {
      if (this.model.name == '') {
        this.$message.warning('请填写活码名称')
      } else if (this.model.message == '') {
        this.$message.warning('请输入欢迎语')
      } else if (this.model.message.length > 100) {
        this.$message.warning('欢迎语不能超过100个字')
      } else if (this.form.momentsUsers.length == 0) {
        this.$message.warning('请选择关联人员')
      } else {
        if (this.model.materialList[0].type == 'image') {
          if (this.imageUrl == '') {
            this.$message.warning('请上传图片')
          } else {
            this.model.materialList[0].imageUrl = this.imageUrl
            this.model.materialList[0].programId = ''
            this.model.materialList[0].link = ''
            this.model.materialList[0].content = ''
            this.model.materialList[0].name = ''
            this.model.materialList[0].videoUrl = ''
            this.model.materialList[0].file = ''
            //填写增加语句
            this.addCode()
          }
        } else if (this.model.materialList[0].type == 'image_text') {
          if (this.model.name == '') {
            this.$message.warning('请填写链接标题')
          } else if (this.model.materialList[0].link == '') {
            this.$message.warning('请填写链接地址')
          } else if (this.model.materialList[0].content == '') {
            this.$message.warning('请填写链接简介')
          } else if (this.linkImageUrl == '') {
            this.$message.warning('请上传图片')
          } else {
            // 填写增加语句
            this.model.materialList[0].videoUrl = ''
            this.model.materialList[0].file = ''
            this.model.materialList[0].imageUrl = this.linkImageUrl

            this.addCode()
          }
        } else if (this.model.materialList[0].type == 'program') {
          if (this.model.materialList[0].programId == '') {
            this.$message.warning('请选择小程序')
          } else {
            //填写增加语句
            // this.model.materialList[0].programId = ''
            this.model.materialList[0].link = ''
            this.model.materialList[0].content = ''
            this.model.materialList[0].name = ''
            this.model.materialList[0].videoUrl = ''
            this.model.materialList[0].file = ''
            this.model.materialList[0].imageUrl = ''
            this.addCode()
          }
        } else {
          //如果是文字类型的话
          //填写增加语句
          this.model.materialList[0].programId = ''
          this.model.materialList[0].link = ''
          this.model.materialList[0].content = ''
          this.model.materialList[0].name = ''
          this.model.materialList[0].videoUrl = ''
          this.model.materialList[0].file = ''
          this.model.materialList[0].imageUrl = ''
          this.addCode()
          // console.log(this.model)
        }
      }
    },
    //取消
    cancelLiveCode() {
      this.getLiveCode()
    },
    addCode() {
      this.form.momentsUsers.forEach((item) => {
        if (item.avatar == undefined) {
          this.model.userList.push({ userId: item.id, wxUserId: item.wxUserId })
        } else if (item.avatar != undefined) {
          this.model.userList.push({ userId: item.id, wxUserId: item.userId })
        }
      })
      // this.spanIndex.forEach(item => {
      //   this.model.behaviorTagList.push({ id: item })
      // })
      api.updateLiveCode(this.model).then(() => {
        this.getLiveCode()
        this.$message.success('更新成功')
      })
    },
    getLiveCode() {
      let userList = []
      // let tagList = []
      // let behaviorTagList = []
      this.form.momentsUsers = []
      this.spanName = []
      this.spanIndex = []
      this.model = {
        materialList: [
          {
            id: '',
            appId: '',
            isDeleted: true,
            createTime: '',
            type: 'text',
            name: '',
            content: '',
            imageUrl: '',
            videoUrl: '',
            link: '',
            programId: '',
            file: '',
            createBy: ''
          }
        ],
        tagList: [],
        behaviorTagList: [],
        type: 1,
        userList: [],
        name: '',
        message: ''
      }
      api.getLiveCode({ id: this.routeId }).then((res) => {
        this.model = res.data.data
        if (this.model.materialList[0].type == 'image') {
          this.imageUrl = this.model.materialList[0].imageUrl
          this.linkImageUrl = ''
          this.model.materialList[0].programId = ''
        } else if (this.model.materialList[0].type == 'image_text') {
          this.linkImageUrl = this.model.materialList[0].imageUrl
          this.imageUrl = ''
          this.model.materialList[0].programId = ''
        } else if (this.model.materialList[0].type == 'program') {
          this.linkImageUrl = ''
          this.imageUrl = ''
        } else if (this.model.materialList[0].type == 'text') {
          this.model.materialList[0].programId = ''
          this.linkImageUrl = ''
          this.imageUrl = ''
        }

        userList = res.data.data.userList
        userList.forEach((item) => {
          this.form.momentsUsers.push({ id: item.userId, name: item.userName, wxUserId: item.wxUserId })
        })
        this.model.userList = []
        this.$set(this.model, 'behaviorTagList', res.data.data.behaviorTagList)
        // tagList = res.data.data.tagList
        // behaviorTagList = res.data.data.behaviorTagList
        this.model.behaviorTagList.forEach((item) => {
          this.spanIndex.push(item.id)
          this.spanName.push(item.name)
        })
        console.log(this.model)
      })
    },
    closeAdd() {
      this.addTagDialog.config.visible = false
    },
    closeTagList(tag, index) {
      this.spanName.splice(index, 1)
      this.spanIndex.splice(index, 1)
      console.log(this.spanIndex)
    },
    getEnterList() {
      api.getBehaviorPages().then((res) => {
        let list = res.data.data
        this.tagNameList = res.data.data
        list.forEach((item) => {
          this.tagList.push(item.tagList)
        })
      })
    },
    changeTags(tagId, id, name) {
      let arrIndex = this.spanIndex.indexOf(id)
      let newName = this.spanName.indexOf(name)
      if (arrIndex > -1) {
        this.spanIndex.splice(arrIndex, 1)
        this.spanName.splice(newName, 1)
      } else {
        this.spanIndex.push(id)
        this.spanName.push(name)
      }
      // console.log(this.spanIndex)
    },

    editEnterTag() {
      this.addTagDialog.config.visible = true
    }
  },
  created() {
    this.getProgarm()
    this.routeId = this.$route.query.id
    if (this.routeId) {
      this.getEnterList()
      this.getLiveCode()
    }
  }
}
</script>
<style lang="scss" scoped>
.grouplive-form {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0;
  .groupname-form {
    width: 500px;
    .record_input {
      width: 500px;
    }
    .welcome-buttom {
      width: 500px;
      height: 40px;
      // border: 1px solid red;
      display: flex;
      justify-content: space-between;

      .welcome-div {
        margin-top: 10px;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        .welcome-customername {
          padding: 5px;
          border: 1px solid #294a7b;
          color: #294a7b;
          margin-left: 5px;
          cursor: pointer;
          border-radius: 5px;
        }
        .welcome-salename {
          padding: 5px;
          border: 1px solid #294a7b;
          color: #294a7b;
          margin-left: 5px;
          cursor: pointer;
          border-radius: 5px;
        }
      }
    }
  }
}
.image-div {
  .image-upload {
    margin-left: 100px;
  }
  span {
    margin-left: 120px;
    font-size: 14px;
    color: darkgrey;
  }
}
.web-div {
  span {
    margin-left: 20px;
    font-size: 14px;
    color: darkgrey;
  }
}
// .app-div {
//   .app-select {
//     width: 500px;
//   }
// }

.el-select-dropdown {
  width: 100%;
}

.add-title {
  color: darkgrey;
  font-size: 14px;
}
.Btn-two {
  margin: 20px 0;

  .el-button {
    width: 100px;
    font-size: 14px;
  }
}
.none-tag {
  text-align: center;
}
.info-itemtag {
  // border: 1px solid red;
  display: inline-block;
  color: #333333;
  background-color: #f2f2f2;
  padding: 0 20px;
  border-radius: 20px;
  margin-right: 10px;
  // margin-bottom: 10px;
  font-size: 12px;
  cursor: pointer;
}
.edit-tag {
  display: inline;
  color: #294a7b;
  padding: 5px 20px;
  border: 1px solid #cccccc;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 13px;
  cursor: pointer;
}
.tag-item {
  // border: 1px solid red;
  max-height: 130px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 0 auto;
  max-width: 100%;
  // border: 1px solid red;
  .item-icon {
    color: #294a7b;
  }
  span {
    border: 1px solid rgb(211, 209, 209);
    padding: 5px;
    cursor: pointer;
    margin: 8px 8px 7px 0;
  }
}
.welcome-emjoi {
  margin-top: 10px;
}
.tagGroupTitle {
  padding: 10px 0;
}
.tagChange {
  border: 1px solid #ccc;
  overflow: auto;
  width: 100%;
  max-height: 200px;
  div {
    font-size: 12px;
    margin: 10px;
    padding: 8px 20px;
    background-color: #f4f4f5;
    color: #909399;
    border-radius: 5px;
    display: inline-block;
    border-color: #e9e9eb;
    cursor: pointer;
  }
}
.active {
  // font-size: 20px !important;
  background-color: #294a7b !important;
  color: #fff !important;
}
// .info-itemtag {
//   // border: 1px solid red;
//   display: inline-block;
//   color: #333333;
//   background-color: #f2f2f2;
//   padding: 5px 20px;
//   border-radius: 20px;
//   margin-right: 10px;
//   margin-bottom: 10px;
//   font-size: 13px;
//   cursor: pointer;
// }
.info-itemtag-div {
  width: 500px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.remark-content {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  .selectGroup {
    // border: 1px solid red;
    .leftTitle {
      display: inline;
      span {
        display: inline-block;
        margin-top: 5px;
        // border: 1px solid red;
      }
    }
    .rightTags {
      display: inline;

      .el-tag {
        margin-left: 10px;
        margin-top: 5px;
      }
    }
  }
}

.tagGroupTitle {
  padding: 10px 0;
}
::v-deep .naviagetion-page__footer {
  background: none !important;
  border: none !important;
}
</style>
