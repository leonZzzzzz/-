<template>
  <div class="grouplive-form">
    <div class="topNav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">创建活码</el-button>
    </div>
    <div class="groupname-form">
      <el-form label-position="left" label-width="100px">
        <div class="modular">
          <div class="title">
            <p>基础信息</p>
          </div>
          <el-form-item label="活码名称" :required="true">
            <el-input
              type="text"
              maxlength="32"
              show-word-limit
              size="small"
              placeholder="最多可输入32字"
              style="width: 800px"
              v-model="model.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="活码类型" :required="true">
            <el-radio-group v-model="model.type" @change="onRadioChange">
              <el-radio :label="1">单人</el-radio>
              <el-radio :label="2">多人</el-radio>
              <el-radio :label="3">批量单人</el-radio>
            </el-radio-group>
            <div>
              <el-alert
                title="添加后类型不可修改"
                type="warning"
                show-icon
                :closable="false"
                style="line-height: 20px; width: 350px"
              >
              </el-alert>
            </div>
          </el-form-item>
          <!-- <el-form-item label="类型" :required="true">
            <el-radio-group>
              <el-radio>一人一码</el-radio>
              <el-radio>多人多码</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="关联人员" :required="true">
            <div class="tag-item" v-if="form.momentsUsers.length != 0">
              <!-- <span class="tag-item-content" v-for="(item, index) in form.momentsUsers" :key="index">
                <i class="item-icon el-icon-s-custom"></i>
                {{ item.name }}
              </span> -->
              <Tag v-for="(item, index) in form.momentsUsers" :key="index">{{ item.name }}</Tag>
            </div>
            <div class="add-title">
              <el-button icon="el-icon-plus" @click="addPeople" plain size="small">添加</el-button>
              (即该活码可以添加的人员，多人随机分配)
            </div>
          </el-form-item>
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
              <!-- <el-form class="none-form" v-if="tagNameList.length == 0">
                <el-form-item class="none-tag">
                  暂无创建的行为标签，<el-button type="text" @click="nextRouter">请先前往创建&nbsp;&gt;</el-button>
                </el-form-item>
              </el-form> -->
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
                          :class="['item', spanIndex.includes(items.id) ? 'active' : '']"
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
          <el-form-item label="添加时是否无需验证" label-width="200" :required="true">
            <el-switch v-model="model.isVerify" active-color="#294A7B" inactive-color="#DCDFE6"> </el-switch>
          </el-form-item>
        </div>
        <div class="modular">
          <div class="title">
            <p>设置欢迎语</p>
          </div>
          <div class="tips" style="margin-bottom: 20px; width: 900px">
            <el-alert
              title="因企业微信限制，若使用成员已在「企业微信后台」配置了欢迎语，这里的欢迎语将不会生效"
              type="warning"
              show-icon
              :closable="false"
              style="line-height: 30px"
            >
            </el-alert>
          </div>
          <el-form-item label="设置欢迎语">
            <el-radio-group v-model="model.sendWelcomeType">
              <el-radio :label="1">渠道欢迎语</el-radio>
              <el-radio :label="0">默认欢迎语</el-radio>
              <el-radio :label="-1">不发送欢迎语</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="欢迎语" v-show="model.sendWelcomeType == 1">
            <el-input
              id="textInput"
              class="record_input"
              type="textarea"
              style="width: 800px"
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
              <div>
                <emotion @selectedEmotion="_selectedEmotion"></emotion>
              </div>
              <div>
                <span class="welcome-firstname">插入昵称</span>
                <el-button type="primary" @click="insert('<客户昵称>')" size="mini" plain>客户昵称</el-button>
                <el-button type="primary" @click="insert('<成员昵称>')" size="mini" plain>成员昵称</el-button>
                <!-- <span class="welcome-customername" >客户昵称</span>
                <span class="welcome-salename" >客户昵称</span> -->
              </div>
            </div>
          </el-form-item>
          <el-form-item label="附加内容" :required="true" v-show="model.sendWelcomeType == 1">
            <el-radio-group v-model="model.materialList[0].type">
              <el-radio label="text" @change="changeNone">无</el-radio>
              <el-radio label="image" @change="changeImage">图片</el-radio>
              <el-radio label="image_text" @change="changeWeb">网页</el-radio>
              <el-radio label="program" @change="changeApp">小程序</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="image-div" v-if="model.materialList[0].type === 'image'" v-show="model.sendWelcomeType == 1">
            <!-- <QcImageUpload width="100px" height="100px" class="image-upload" v-model="imageUrl"> </QcImageUpload>
            <div class="tips_words">上传图片</div> -->
            <div class="tips_words">
              <UploadImage @success="imageSuccess"></UploadImage>
            </div>
          </div>
          <div class="web-div" v-if="model.materialList[0].type === 'image_text'" v-show="model.sendWelcomeType == 1">
            <el-form-item :required="true" label="链接标题">
              <el-input placeholder="最多可输入32个字" v-model="model.materialList[0].name"></el-input>
            </el-form-item>
            <el-form-item :required="true" label="链接简介">
              <el-input placeholder="最多可输入32个字" v-model="model.materialList[0].content"></el-input>
            </el-form-item>
            <el-form-item :required="true" label="链接地址">
              <el-input placeholder="请输入链接地址" v-model="model.materialList[0].link"></el-input>
            </el-form-item>
            <el-form-item :required="true" label="封面图">
              <!-- <QcImageUpload width="100px" height="100px" v-model="linkImageUrl"> </QcImageUpload>
              <div class="tips_words">上传图片</div> -->
              <UploadImage @success="imageTextSuccess"></UploadImage>
            </el-form-item>
          </div>
          <div class="app-div" v-if="model.materialList[0].type === 'program'" v-show="model.sendWelcomeType == 1">
            <!-- <SelectProgramItem ref="SelectProgramItem" :programIdProps="model.programAppId"></SelectProgramItem> -->
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
            <!-- <SelectProgramItem ref="SelectProgramItem"></SelectProgramItem> -->
            <!-- <SelectProgramItem ref="SelectProgramItem" :programProps="programIdProps"></SelectProgramItem> -->
          </div>
          <el-form-item>
            <div style="margin-top: 50px">
              <el-button @click="cancelLiveCode">取消</el-button>
              <el-button type="primary" @click="sumbitLivecode" :disabled="isSuccess">保存</el-button>
            </div>
          </el-form-item>
          <!-- <el-form-item label="扫码行为标签">
            <div class="info-itemtag-div">
              <span class="edit-tag" @click="openBehavior()" v-if="listSpanName.length != 0">编辑</span>
              <span class="info-itemtag" v-for="(item, EnertTag) in listSpanName" :key="EnertTag">
                {{ item.name || '--' }}
              </span>
            </div>
            <div>
              <el-button type="text" @click="openBehavior()" v-if="listSpanName.length == 0">添加</el-button>
              <div class="add-title">(即该活码可以添加的客户打上对应的标签)</div>
            </div>
          </el-form-item> -->
        </div>
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
    <!-- 多人或批量单人的树形选择组件 -->
    <department-dialog
      :config="departmentDialog.config"
      @closeDialog="departmentDialog.config.visible = false"
      :selectedList="form.momentsUsers"
      ref="department"
      @handleConfirm="handleConfirm"
    >
    </department-dialog>
    <!-- <behavior-dialog
      :config="behaviorDialog.config"
      @closeDialog="behaviorDialog.config.visible = false"
      @handleConfirm="handleBehavior"
    >
    </behavior-dialog> -->
    <BehaviorLabel
      :dialogVisible="BehaviorLabelDialogVisible"
      :fileList="updateBehavList"
      :type="behaviorLabelType"
      @closeDialog="BehaviorLabelDialogVisible = false"
      @reloadData="getEnterList"
    ></BehaviorLabel>
    <!-- 单人的树形选择组件 -->
    <department-single-dialog
      :config="departmentSingleDialog.config"
      @closeDialog="departmentSingleDialog.config.visible = false"
      :selectedList="form.momentsUsers"
      ref="department"
      @handleConfirm="handleConfirm"
    >
    </department-single-dialog>
  </div>
</template>
<script>
import ComDialog from '../../../components/common/ComDialog'
import api from '../../../api/operation-management'
import Emotion from '../../../components/common/Emotion'
import BehaviorLabel from '../../../components/components/BehaviorLabel'
import DepartmentDialog from '../../../components/components/MemberTreeLinkageDialog'
import DepartmentSingleDialog from '../../../components/components/MemberTreeSingleDialog'
import UploadImage from '../../../components/components/UploadImage'
import Tag from '../../../components/components/Tag'
export default {
  components: {
    ComDialog,
    Emotion,
    DepartmentDialog,
    BehaviorLabel,
    DepartmentSingleDialog,
    UploadImage,
    Tag
  },
  data() {
    return {
      // changeTag: 'text',
      // behaviorDialog: {+

      //   config: {
      //     width: '800px',
      //     title: '选择关联人员',
      //     visible: false
      //   }
      // },
      remarkContentBoxHeight: 0,
      remarkContentBoxShowFlag: false,
      textarea: '',
      val: '',
      isSuccess: false,
      addTagDialog: {
        config: {
          width: '600px',
          title: '关联行为标签',
          visible: false
        }
      },
      updateBehavList: {},
      BehaviorLabelDialogVisible: false,
      behaviorLabelType: true,
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
        mode: 1,
        behaviorTagList: [],
        type: 1,
        userList: [],
        name: '',
        message: '',
        state: 'channel',
        sendWelcomeType: 1,
        isVerify: true
      },
      imageUrl: '',
      linkImageUrl: '',
      departmentDialog: {
        // 多人选择树
        config: {
          width: '800px',
          title: '选择关联人员',
          visible: false
        }
      },
      form: {
        momentsUsers: [] // 同步人员列表{cropUserId, userId, name, mobile, position}
      },
      tagList: [],
      spanName: [],
      spanIndex: [], //点击标签颜色会变得数组
      tagNameList: [], //获取编辑整个分组的信息
      newArrsCustomer: [],
      sumbitSpanName: [],
      listSpanName: [],
      departmentSingleDialog: {
        // 单人选择树
        config: {
          width: '800px',
          title: '选择关联人员',
          visible: false
        }
      }
    }
  },
  methods: {
    updateBehav(index) {
      this.BehaviorLabelDialogVisible = true
      this.behaviorLabelType = false
      this.updateBehavList = this.tagNameList[index]
      console.log(this.tagNameList[index])
    },
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
      this.$router.push('/main/scrm/tag-library/enterprise/list')
    },
    closeAdd() {
      this.addTagDialog.config.visible = false
    },
    imageSuccess(val) {
      this.imageUrl = val[0] ? val[0].url : ''
    },
    imageTextSuccess(val) {
      this.linkImageUrl = val[0] ? val[0].url : ''
    },
    //关闭关联标签弹
    closeTagDialog() {
      this.spanName = []
      this.spanIndex = []
      this.sumbitSpanName = []
      this.addTagDialog.config.visible = false
    },
    //提交关联标签按钮
    sumbitTagDialog() {
      this.sumbitSpanName = []
      this.spanName.forEach(item => {
        this.sumbitSpanName.push(item)
      })
      this.addTagDialog.config.visible = false
    },
    //点击编辑打开弹窗
    editTagDialog() {
      this.addTagDialog.config.visible = true
    },
    editEnterTag() {
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
      api.getProgarm().then(res => {
        this.options = res.data.data
      })
    },
    changeSelect() {
      this.options.forEach(item => {
        if (item.id == this.model.materialList[0].programId) {
          this.model.materialList[0].link = item.page
          this.model.materialList[0].name = item.name
          this.model.materialList[0].imageUrl = item.logo
        }
      })
    },
    handleConfirm(list) {
      // this.form.momentsUsers = []
      this.form.momentsUsers = list
      if (this.model.type === 1) {
        // 选择单人
        this.departmentSingleDialog.config.visible = false
      } else {
        // 选择多人或批量单人
        this.departmentDialog.config.visible = false
      }
      console.log(this.form.momentsUsers)
    },
    //关联人员添加按钮
    addPeople() {
      if (this.model.type === 1) {
        // 选择单人
        this.departmentSingleDialog.config.visible = true
      } else {
        // 选择多人或批量单人
        this.departmentDialog.config.visible = true
      }
    },
    //保存按钮
    sumbitLivecode() {
      // let program = this.$refs.SelectProgramItem.success()
      // this.model.materialList[0].programId = program.id
      if (this.model.name == '') {
        this.$message.warning('请填写活码名称')
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
            // this.model.materialList[0].link = ''
            this.model.materialList[0].content = ''
            // this.model.materialList[0].name = ''
            this.model.materialList[0].videoUrl = ''
            this.model.materialList[0].file = ''
            // this.model.materialList[0].imageUrl = ''
            console.log(this.model.materialList[0])
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
          console.log('文本类型')
          this.addCode()
          // console.log(this.model)
        }
      }
    },
    //取消
    cancelLiveCode() {
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
        mode: 1,
        behaviorTagList: [],
        type: 1,
        userList: [],
        name: '',
        message: ''
      }
      this.form.momentsUsers = []
      this.imageUrl = ''
      this.linkImageUrl = ''
      this.spanIndex = []
      this.spanName = []
      this.sumbitSpanName = []
      this.model.userList = []
      this.$openNewPageBack()
    },
    addCode() {
      this.isSuccess = true
      this.model.userList = []
      this.model.behaviorTagList = []
      this.form.momentsUsers.forEach(item => {
        this.model.userList.push({ userId: item.id, wxUserId: item.userId })
      })
      this.spanIndex.forEach(item => {
        this.model.behaviorTagList.push({ id: item })
      })
      // if (this.model.type == 3) {
      // }

      api.addLiveCode(this.model).then(() => {
        this.cancelLiveCode()
        this.$message.success('添加成功')
        this.$router.push('/main/scrm/operation-management/addlivecode/list')
        this.isSuccess = false
      })
    },
    closeTagList(tag, index) {
      this.spanName.splice(index, 1)
      this.spanIndex.splice(index, 1)
      console.log(this.spanIndex)
    },
    getEnterList() {
      api.getBehaviorPages().then(res => {
        let list = res.data.data
        this.tagNameList = res.data.data
        list.forEach(item => {
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
    goBack() {
      this.$openNewPageBack()
    },
    getRemarkContentBoxHeight() {
      let height = this.$refs.remark_content_box.offsetHeight
      // console.log(height)
      this.remarkContentBoxHeight = height
    },
    // 活码类型改变
    onRadioChange(val) {
      this.form.momentsUsers = []
    }
    // openBehavior() {
    //   this.behaviorDialog.config.visible = true
    // },
    // handleBehavior(list) {
    //   this.listSpanName = list
    //   this.behaviorDialog.config.visible = false
    // }
  },
  created() {
    this.getProgarm()
    this.getEnterList()
  },
  updated() {
    this.$nextTick(() => {
      this.getRemarkContentBoxHeight()
    })
  }
}
</script>
<style lang="scss" scoped>
.grouplive-form {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .groupname-form {
    .record_input {
      width: 500px;
    }
    .welcome-buttom {
      width: 800px;
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
  .tips_words {
    margin-left: 120px;
    font-size: 14px;
    color: darkgrey;
    margin-top: 10px;
  }
}
.web-div {
  width: 900px;
  .tips_words {
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
  height: 20px;
  line-height: 20px;
  border-radius: 20px;
  margin-right: 10px;
  // margin-bottom: 10px;
  font-size: 13px;
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
  width: 500px;
  display: flex;
  flex-wrap: wrap;
  line-height: 14px;
  border-radius: 3px;
  .item-icon {
    color: #294a7b;
  }
  span {
    border: 1px solid #dcdfe6;
    padding: 5px;
    cursor: pointer;
    margin: 8px 8px 7px 0;
    border-radius: 3px;
  }
}
.welcome-emjoi {
  margin-top: 10px;
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
.remark_content_box {
  height: 153px;
  overflow: hidden;
  &.show {
    height: auto;
    overflow: none;
  }
}

.tagGroupTitle {
  padding: 20px 0;
}
.tagChange {
  // border: 1px solid #ccc;
  overflow: auto;
  width: 100%;
  max-height: 200px;
  div {
    font-size: 12px;
    margin: 10px 10px 10px 0;
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
.info-itemtag {
  // border: 1px solid red;
  display: inline-block;
  color: #333333;
  background-color: #f2f2f2;
  padding: 5px 20px;
  border-radius: 20px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 13px;
  cursor: pointer;
}
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
::v-deep .naviagetion-page__footer {
  background: none !important;
  border: none !important;
}
// fo
.title {
  color: #606266;
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
.itemtag_content {
  margin-top: 10px;
}
.remark_content {
  padding: 50px 18px 30px 20px;
  width: 800px;
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
.modular {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
}
.topNav {
  margin-bottom: 20px;
}
.welcome-firstname {
  color: #606266;
  margin-right: 10px;
}
.welcome-buttom {
  display: flex;
  align-items: center;
}
</style>
