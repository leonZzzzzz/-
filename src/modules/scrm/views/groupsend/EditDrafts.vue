<template>
  <div class="newlyaddedDiv">
    <QcNavigationPage content="编辑草稿箱">
      <!-- <div class="addQunFa"></div> -->
      <el-form :model="models" ref="model" label-width="100px">
        <el-form-item label="群发标题" :required="true">
          <el-input
            style="width:500px"
            v-model="models.name"
            maxlength="30"
            placeholder="请输入群发标题,最多可输入30个字"
          ></el-input
        ></el-form-item>

        <!--选择群发对象开始-->
        <el-form-item label="群发对象" :required="true">
          <el-radio-group v-model="models.chatType">
            <el-radio label="single" v-if="models.chatType == 'single'">指定客户</el-radio>
            <el-radio label="group" v-if="models.chatType == 'group'">指定客户群</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="sendBtn"
            v-if="models.chatType === 'single'"
            @click="showSelectionCustomerList"
            >选择群发客户</el-button
          >
          <el-button
            type="primary"
            class="sendBtn"
            v-if="models.chatType === 'group'"
            @click="showGroupSelectionCustomerList"
            >选择群发的群</el-button
          >
          <div v-if="models.chatType === 'single'">
            <el-form-item>
              <el-table :data="singleMessageUserList" style="width:80%" height="201">
                <el-table-column v-for="(item, index) in customerColumn" :key="index" v-bind="item"> </el-table-column>
              </el-table>
            </el-form-item>
          </div>
          <div v-if="models.chatType === 'group'">
            <el-form-item>
              <el-table :data="groupMessageList" style="width:80%" height="171">
                <el-table-column v-for="(item, index) in GroupColumn" :key="index" v-bind="item"> </el-table-column>
              </el-table>
            </el-form-item>
          </div>
        </el-form-item>

        <!--选择群发对象结束-->
        <el-form-item label="群发时间" :required="true">
          <el-radio-group v-model="models.sendType">
            <el-radio label="now" @change="changefalseVisible">立即群发</el-radio>
            <el-radio label="time" @change="changeVisible">定时群发</el-radio>
          </el-radio-group>

          <div v-if="this.index == true || this.models.sendType == 'time'">
            <span style="margin-right:10px;color:rgb(118, 121, 133)">发送时间</span>
            <el-date-picker
              v-model="models.scheduledSendTime"
              @change="time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="欢迎语" :required="true">
          <el-input
            id="textInput"
            class="textarea-input"
            placeholder="请输入欢迎语"
            type="textarea"
            maxlength="200"
            show-word-limit
            size="small"
            :rows="6"
            resize="none"
            v-model="models.message"
          ></el-input>
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

        <el-form-item label="群发内容" :required="true">
          <!-- <el-button type="info" @click="showSpeechAddDialog">+添加群发内容</el-button> -->
          <el-radio-group v-model="contentType">
            <!-- <el-radio label="">无</el-radio> -->
            <el-radio label="text">文字</el-radio>
            <el-radio label="image">图片</el-radio>
            <el-radio label="image_text">网页</el-radio>
            <el-radio label="program">小程序</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="background-form">
          <div class="form-item-width" v-if="contentType === 'text'">
            <div>
              <el-form-item label="文本内容" :required="true">
                <el-input
                  type="textarea"
                  maxlength="200"
                  show-word-limit
                  size="small"
                  :rows="6"
                  resize="none"
                  v-model="textContent"
                ></el-input
              ></el-form-item>
            </div>
          </div>
          <div class="form-item-width" v-if="contentType === 'image'">
            <div>
              <el-form-item label="图片名称" :required="true">
                <el-input placeholder="请输入图片名称" v-model="imageName"></el-input>
              </el-form-item>
              <el-form-item label="请上传图片" :required="true">
                <QcImageUpload
                  :data="{ imageType: 'scrm' }"
                  width="100px"
                  height="100px"
                  class="image-upload"
                  v-model="imageUrl"
                >
                </QcImageUpload>
              </el-form-item>
            </div>
          </div>
          <div class="form-item-width" v-else-if="contentType === 'image_text'" :required="true">
            <div>
              <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接标题"
                ><el-input placeholder="请输入链接标题" v-model="programName"></el-input
              ></el-form-item>
              <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接简介"
                ><el-input placeholder="请输入链接简介" v-model="programContent"></el-input
              ></el-form-item>
              <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接地址"
                ><el-input placeholder="请输入链接地址" v-model="programLink"></el-input
              ></el-form-item>
              <el-form-item :rules="[{ required: true, message: '请上传图片' }]" label="上传图片">
                <QcImageUpload :data="{ imageType: 'scrm' }" width="100px" height="100px" v-model="programImage">
                </QcImageUpload>
              </el-form-item>
            </div>
          </div>
          <div class="form-item-width" v-else-if="contentType === 'program'">
            <div>
              <el-form-item label="配置小程序" :required="true">
                <el-select placeholder="请选择" v-model="appProgramId" @change="changeSendSelect()">
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
          </div>
        </div>
        <el-form-item class="btn-primary-padding">
          <el-button @click="addBtn" type="primary">确认发布</el-button>
          <el-button @click="saveDrafts" type="info">保存到草稿箱</el-button>
        </el-form-item>
      </el-form>

      <com-dialog :config="addDialog.config" @closeDialog="closeAddDialog">
        <div class="add-content">
          <div class="query-table">
            <div class="query-table-left">
              <div class="search-input">
                <el-input size="small" placeholder="输入客户名称" v-model="selectionSearchContent"> </el-input>
              </div>
              <div class="quert-table-title" @click="openTagList()">
                <span class="query-table-choose" v-if="searchForm.tags.length == 0">请选择</span>
                <template v-if="searchForm.tags.length != 0">
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
                </template>
                <i class="el-icon-arrow-down chosse-i"></i>
              </div>
              <el-button type="primary" @click="selectionSearch">搜索</el-button>
              <el-button size="small" type="info" @click="refreshSelectionList">&nbsp;&nbsp;重置&nbsp;&nbsp;</el-button>
            </div>
          </div>
          <div class="selection-table">
            <el-table
              ref="multipleTable"
              :data="selectionData"
              style="width: 100%"
              height="400"
              :row-key="getRowKeys"
              @selection-change="handleSelectionChange"
              class="select-div"
            >
              <el-table-column
                v-for="(item, index) in selectionColumn"
                :key="index"
                v-bind="item"
                :reserve-selection="true"
              >
              </el-table-column>
            </el-table>
          </div>
          <div class="selection-pagination">
            <com-pagination
              :page="selectionPage"
              @sizeChange="onSelectionSizeChange"
              @pageChange="onSelectionPageChange"
            ></com-pagination>
          </div>
          <el-row :gutter="24">
            <el-col :span="8">&nbsp;</el-col>
            <el-col :span="4"><div class="close-btn" @click="closeAddDialog">取消</div></el-col>
            <el-col :span="4"> <div class=" submit-btn-add" @click="submitSelectionData">确定</div></el-col>
            <el-col :span="8">&nbsp;</el-col>
          </el-row>
        </div>
      </com-dialog>
      <com-dialog
        :config="selectEnterDialog.config"
        @closeDialog="selectEnterDialog.config.visible = false"
        class="dialogSelect"
      >
        <div class="selectGroup">
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
        <div class="select-div-dispose">
          <div v-for="(item, index) in tagNameList" :key="index">
            <div class="tagGroupTitle">{{ item.name }}</div>
            <div class="tagChange">
              <div
                @click="changeTag(items.tagId, items.id, items.name)"
                v-for="(items, indexs) in item.tagList"
                :key="indexs"
                :class="{ active: spanIndex.includes(items.id) }"
              >
                {{ items.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="Btn-two">
          <el-row :gutter="24">
            <el-col :span="6">&nbsp; </el-col>
            <el-col :span="6">
              <el-button type="info" @click="closeTagDialog()">取消</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="sumbitTagDialog()">确定</el-button>
            </el-col>
            <el-col :span="6"></el-col>
          </el-row>
        </div>
      </com-dialog>
      <com-dialog :config="changeGroupDialog.config" @closeDialog="closeGroupDialog">
        <div class="add-content">
          <div class="query-table">
            <div class="query-table-left">
              <div class="search-input">
                <el-input size="small" placeholder="输入群名称" v-model="selectionGroupSearchContent">
                  <el-button slot="append" icon="el-icon-search" @click="selectionGroupSearch"></el-button>
                </el-input>
              </div>
              <el-button size="small" type="info" @click="refreshGroupSelectionList"
                >&nbsp;&nbsp;重置&nbsp;&nbsp;</el-button
              >
            </div>
          </div>
          <div class="selection-table">
            <el-table
              ref="multipleGroupTable"
              :data="selectionGroupData"
              style="width: 100%"
              height="400"
              :row-key="getGroupRowKey"
              @selection-change="handleGroupSelectionChange"
              class="disabledCheck"
            >
              <el-table-column
                v-for="(item, index) in selectionGroupColumn"
                :key="index"
                v-bind="item"
                :reserve-selection="true"
              >
              </el-table-column>
            </el-table>
          </div>
          <div class="selection-pagination">
            <com-pagination
              :page="selectionGroupPage"
              @sizeChange="onGroupSelectionSizeChange"
              @pageChange="onGroupSelectionPageChange"
            ></com-pagination>
          </div>
          <el-row :gutter="24">
            <el-col :span="8">&nbsp;</el-col>
            <el-col :span="4"><div class="close-btn" @click="closeGroupDialog">取消</div></el-col>
            <el-col :span="4"><div class=" submit-btn-add" @click="sumbitGroupSelectionData">确定</div></el-col>
            <el-col :span="8">&nbsp;</el-col>
          </el-row>
        </div>
      </com-dialog>

      <com-dialog
        :config="selectEditEnterDialog.config"
        @closeDialog="selectEditEnterDialog.config.visible = false"
        class="dialogSelect"
      >
        <div class="selectGroup">
          <div class="leftTitle">
            <span>已选</span>
          </div>
          <div class="rightTags">
            <el-tag
              v-for="(tag, index) in spanEditName"
              :key="index"
              closable
              type="info"
              :disable-transitions="true"
              @close="closeEditTagList(tag, index)"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        <div class="select-div-dispose">
          <div v-for="(item, index) in tagEditNameList" :key="index">
            <div class="tagGroupTitle">{{ item.name }}</div>
            <div class="tagChange">
              <div
                @click="changeEditTag(items.tagId, items.id, items.name)"
                v-for="(items, indexs) in item.tagList"
                :key="indexs"
                :class="{ active: spanEditIndex.includes(items.id) }"
              >
                {{ items.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="Btn-two">
          <el-row :gutter="24">
            <el-col :span="6">&nbsp; </el-col>
            <el-col :span="6">
              <el-button type="info" @click="closeEditTagDialog()">取消</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="sumbitEditTagDialog()">确定</el-button>
            </el-col>
            <el-col :span="6"></el-col>
          </el-row>
        </div>
      </com-dialog>
    </QcNavigationPage>
  </div>
</template>

<script>
import api from '../../api/groupsend'
import ComDialog from '../../components/common/ComDialog'
import ComMaterial from '../../components/common/MaterialEditor'
import ComPagination from '../../components/common/ComPagination'
import Emotion from '../../components/common/Emotion'
export default {
  components: { ComMaterial, ComPagination, ComDialog, Emotion },
  inject: ['reload'],
  data() {
    let nameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入分组名称'))
      } else {
        callback()
      }
    }
    return {
      options: [],
      contentType: 'text',
      textContent: '',
      imageName: '', //第一个图片名称
      imageUrl: '', //都一个图片链接
      programName: '', //第一个链接的名称
      programContent: '', //第一个链接的简介
      programLink: '', //第一个链接
      programImage: '', //第一个链接的图片链接
      appProgramId: '',
      name: '',
      sendType: '',
      singleMessageUserList: [],
      models: {
        id: '',
        createTime: '',
        name: '',
        chatType: '',
        sender: '',
        sendType: '',
        status: '',
        message: '',
        sendSuccessRate: 0,
        leftSendQuantity: 0,
        statusName: '',
        messageItemList: [],
        messageUserList: []
      },
      page: {
        pageNun: 1,
        pageSize: 15,
        total: 0
      },
      groupEditDialog: {
        config: {
          width: '600px',
          title: '编辑分组',
          visible: false
        }
      },
      groupForm: {},
      groupRules: {
        name: [{ required: true, validator: nameValidator, trigger: 'blur' }]
      },
      materialEditor: {
        type: 'text'
      },
      speechEditDialog: {
        input: {
          imageName: '',
          videoName: ''
        },
        editForm: {} // 话术详情表单
      },
      value: '',
      index: false,
      fresh: true, //刷新整个组件
      timePicker: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      form: {
        type: '',
        name: '',
        content: '',
        imageUrl: '',
        videoUrl: '',
        link: '',
        programId: '',
        file: '',
        fileId: '',
        appId: '',
        createBy: '',
        createTime: '',
        id: '',
        isDeleted: false,
        source: ''
      },

      messageItemList: [],
      messageUserList: [],
      newAddmessageItemList: [],
      tableData: [],
      addDialog: {
        config: {
          width: '900px',
          title: '选择群发客户',
          visible: false
        }
      },
      changeGroupDialog: {
        config: {
          width: '900px',
          title: '选择群发群',
          visible: false
        }
      },
      selectionSearchContent: '',
      selectionGroupSearchContent: '',
      selectionData: [],
      selectionGroupData: [],
      getRowKeys(row) {
        return row.id
      },
      getGroupRowKey(row) {
        return row.id
      },
      selectionGroupColumn: [
        {
          type: 'selection',
          align: 'center',
          width: '55px'
        },
        { type: 'index', label: '序号', align: 'center' },
        { prop: 'name', label: '群名称', align: 'center' },
        {
          label: '微信群ID',
          align: 'center',
          prop: 'cropAppId'
        },
        { prop: 'ownerName', label: '创建人', labelWidth: '200', align: 'center' },
        { prop: 'createTime', label: '创建时间', labelWidth: '200', align: 'center' }
      ],

      selectionColumn: [
        {
          type: 'selection',
          align: 'center',
          width: '55px'
        },
        {
          label: '姓名',
          align: 'center',
          minWidth: '120px',
          prop: 'name'
        },
        {
          label: '头像',
          align: 'center',
          minWidth: '120px',
          prop: 'avatar',
          formatter: (row) => {
            return <img src={row.avatar} alt="" width="44" height="44" />
          }
        },
        {
          label: '性别',
          align: 'center',
          minWidth: '120px',
          prop: 'genderName'
        },
        {
          label: '创建时间',
          align: 'center',
          minWidth: '120px',
          prop: 'createTime'
        },
        {
          label: '更新时间',
          align: 'center',
          minWidth: '120px',
          prop: 'updateTime'
        }
      ],
      selectionPage: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      selectionGroupPage: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },

      //选择客户后的页面客户列表
      customerColumn: [
        {
          label: '序号',
          align: 'center',
          type: 'index'
        },
        {
          label: '客户姓名',
          align: 'center',
          minWidth: '120px',
          prop: 'userName'
        },
        {
          label: '手机号',
          align: 'center',
          minWidth: '120px',
          prop: 'mobile'
        },
        {
          label: '头像',
          align: 'center',
          minWidth: '120px',
          prop: 'headImage',
          formatter: (row) => {
            return <img src={row.headImage} alt="" width="44" height="44" />
          }
        },
        {
          label: '性别',
          align: 'center',
          minWidth: '120px',
          formatter: (row) => {
            return row.gender === 0 ? '未知' : row.gender === 1 ? '男' : '女'
          }
        },
        {
          label: '操作',
          align: 'center',
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                <el-button type="text" onClick={this.deleteUserList.bind(this, row, index)}>
                  取消添加
                </el-button>
              </div>
            )
          }
        }
      ],
      GroupColumn: [
        { type: 'index', label: '序号', align: 'center' },
        { prop: 'groupChatName', label: '群名称', align: 'center' },
        { prop: 'groupChatOwner', label: '创建人', align: 'center' },
        { prop: 'groupChatQuantity', label: '群人数', align: 'center' },
        {
          label: '操作',
          align: 'center',
          fixed: 'right',

          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                <el-button type="text" onClick={this.deleteGroupList.bind(this, row, index)}>
                  取消添加
                </el-button>
              </div>
            )
          }
        }
      ],

      deteleList: [],
      deteleGroupList: [],
      groupMessageList: [],
      searchForm: {
        tags: []
      },
      selectEnterDialog: {
        config: {
          width: '600px',
          title: '选择企业客户标签',
          visible: false
        }
      },

      spanName: [],
      tagNameList: [], //获取编辑整个分组的信息
      tagList: [], //获取到的企业列表存放的地方
      spanIndex: [], //获取到的企业列表存放的地方

      tagEditNameList: [],
      forms: {
        momentsUsers: []
      },
      customerLifeCycleList: [],
      customerLifeCycleId: '',
      lifeCycleUserId: [],
      selectEditEnterDialog: {
        config: {
          width: '600px',
          title: '选择企业客户标签',
          visible: false
        }
      },
      spanEditName: [],
      spanEditIndex: [],
      newGroupList: [],
      GroupData: []
    }
  },

  methods: {
    addBtn() {
      this.sumbitModels()
      this.addSave()
    },
    addSave() {
      api.reSaveSend(this.models).then(() => {
        this.$message.success('添加成功，等待客户所属同事确认发送')
        this.$openNewPageBack()
      })
    },
    //立即群发
    changefalseVisible() {
      this.models.sendType = 'now'
      var _this = this
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1
      let dd = new Date().getDate()
      let hh = new Date().getHours()
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      _this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      this.models.sendTime = _this.gettime
      this.index = false
      this.models.scheduledSendTime = ''
    },
    //选择群发时间
    changeVisible() {
      this.models.sendType = 'time'
      this.models.sendTime = ''
      this.index = true
    },
    time(datetime) {
      this.models.sendTime = datetime
    },
    saveDrafts() {
      this.sumbitModels()
      this.addDraftsFun()
    },
    addDraftsFun() {
      api.groupChatUpdate(this.models).then(() => {
        this.$message.success('保存到草稿箱成功')
        this.$openNewPageBack()
      })
    },

    // showSpeechAddDialog() {
    //   this.addMaterialDialog = true
    // },

    //群发类型
    //群发客户

    //打开群发群的弹窗

    //打开群发人的弹窗
    // PeopleSelectionChange(val) {
    //   if (val.length > 1) {
    //     this.$refs.materialTable.clearSelection()
    //     this.$refs.materialTable.toggleRowSelection(val[val.length - 1])
    //     this.models.sender = val[val.length - 1].owner
    //   } else if (val.length === 1) {
    //     this.models.sender = val[0].owner
    //   } else {
    //     this.models.sender = ''
    //   }
    //   console.log(this.models.sender)
    // },
    getPage() {
      api.groupList(this.page).then((res) => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    // PeopleSave() {
    //   if (this.models.sender === '') {
    //     this.$message.warning('请选择发送者')
    //   } else {
    //     this.PeopleDialog = false
    //   }
    // },

    /*这是群发的开始*/
    closeGroupDialog() {
      this.changeGroupDialog.config.visible = false
      this.selectionGroupPage.pageSize = 15
      this.selectionGroupPage.pageNum = 1
      this.selectionGroupPage.total = 0
      this.selectionGroupSearchContent = ''
    },
    selectionGroupSearch() {
      this.selectionGroupPage.pageNum = 1
      this.selectionGroupPage.pageSize = 15
      this.selectionGroupPage.total = 0
      this.getGroupSelectionCustomerList()
    },
    refreshGroupSelectionList() {
      this.selectionGroupPage.pageNum = 1
      this.selectionGroupPage.pageSize = 15
      this.selectionGroupPage.total = 0
      this.selectionGroupSearchContent = ''
      this.getGroupSelectionCustomerList()
    },

    //判断当前表格是选中还是未选中
    //选择客户
    handleSelectionChange(val) {
      this.messageUserList = []
      val.forEach((item) => {
        this.messageUserList.push({
          userId: item.id,
          headImage: item.avatar,
          mobile: item.mobile,
          gender: item.gender,
          userName: item.name
        })
      })
      this.singleMessageUserList = this.messageUserList
      this.models.messageUserList = this.messageUserList
    },

    onGroupSelectionPageChange(val) {
      this.selectionGroupPage.pageNum = val
      this.getGroupSelectionCustomerList()
    },
    onGroupSelectionSizeChange(val) {
      this.selectionGroupPage.pageSize = val
      this.selectionGroupPage.pageNum = 1
      this.getGroupSelectionCustomerList()
    },
    //选择群
    handleGroupSelectionChange(val) {
      this.newGroupList = []
      if (val.length > 1) {
        this.$refs.multipleGroupTable.clearSelection()
        this.$refs.multipleGroupTable.toggleRowSelection(val[val.length - 1])
        return
      }
      this.newGroupList = val[val.length - 1]
      console.log(this.newGroupList)
    },
    sumbitGroupSelectionData() {
      this.groupMessageList = []
      this.GroupData = []
      this.GroupData.push(this.newGroupList)
      this.changeGroupDialog.config.visible = false
      this.GroupData.forEach((item) => {
        this.groupMessageList.push({
          userId: item.id,
          groupChatName: item.name,
          groupChatOwner: item.ownerName,
          groupChatQuantity: item.quantity,
          sender: item.owner
        })
        this.models.sender = item.owner
      })
      this.models.messageUserList = this.groupMessageList
    },
    showGroupSelectionCustomerList() {
      this.changeGroupDialog.config.visible = true
      this.getGroupSelectionCustomerList()
    },

    /*这是群发的结束 */

    /*这是群发客户的开始*/
    selectionSearch() {
      this.selectionPage.pageNum = 1
      this.selectionPage.pageSize = 15
      this.selectionPage.total = 0
      this.getSelectionCustomerList()
    },
    refreshSelectionList() {
      this.selectionPage.pageNum = 1
      this.selectionPage.pageSize = 15
      this.selectionPage.total = 0
      this.selectionSearchContent = ''
      this.searchForm.tags = []
      this.spanName = []
      this.spanIndex = []
      this.getSelectionCustomerList()
    },

    onSelectionSizeChange(val) {
      this.selectionPage.pageSize = val
      this.selectionPage.pageNum = 1
      this.getSelectionCustomerList()
    },
    onSelectionPageChange(val) {
      this.selectionPage.pageNum = val
      this.getSelectionCustomerList()
    },

    //关闭添加客户弹窗
    closeAddDialog() {
      this.addDialog.config.visible = false
      this.selectionPage.pageSize = 15
      this.selectionPage.pageNum = 1
      this.selectionPage.total = 0
      this.selectionSearchContent = ''
    },
    // 提交选项，添加客户到分组
    submitSelectionData() {
      if (this.messageUserList.length === 0) {
        this.$message.warning('请选择需要发送的客户')
      } else {
        this.addDialog.config.visible = false
      }
    },
    //显示弹窗
    showSelectionCustomerList() {
      this.addDialog.config.visible = true
      this.getSelectionCustomerList()
    },

    //群发的获取表格
    getGroupSelectionCustomerList() {
      let that = this
      let params = {
        pageNum: that.selectionGroupPage.pageNum,
        pageSize: that.selectionGroupPage.pageSize,
        name: that.selectionGroupSearchContent
      }
      api.groupList(params).then((res) => {
        that.selectionGroupData = res.data.data.list
        that.selectionGroupPage.total = res.data.data.total
        this.$nextTick(() => {
          let length = this.models.messageUserList
          this.selectionGroupData.forEach((item) => {
            let modelFlag = length.some((label) => item.id === label.userId)
            if (modelFlag) {
              this.$refs.multipleGroupTable.toggleRowSelection(item, true)
            }
            let flag = this.deteleGroupList.some((label) => item.id === label)
            if (flag) {
              this.$refs.multipleGroupTable.toggleRowSelection(item, false)
              let i = this.deteleGroupList.findIndex((label) => label === item.userId)
              this.deteleList.splice(i, 1)
            }
          })
        })
      })
    },
    //客户的获取表格
    getSelectionCustomerList() {
      let that = this
      let tagIds = ''
      that.searchForm.tags.forEach((item, idx) => {
        if (idx === 0) {
          tagIds += item
        } else {
          tagIds += '_' + item
        }
      })
      let params = {
        pageNum: that.selectionPage.pageNum,
        pageSize: that.selectionPage.pageSize,
        name: that.selectionSearchContent,
        tagId: tagIds
      }
      api.getCustomerSelectPage(params).then((res) => {
        that.selectionData = res.data.data.list
        that.selectionPage.total = res.data.data.total
        this.$nextTick(() => {
          let length = this.models.messageUserList
          this.selectionData.forEach((item) => {
            let modelFlag = length.some((label) => item.id === label.userId)
            if (modelFlag) {
              this.$refs.multipleTable.toggleRowSelection(item, true)
            }
            let flag = this.deteleList.some((label) => item.id === label)
            if (flag) {
              this.$refs.multipleTable.toggleRowSelection(item, false)
              let i = this.deteleList.findIndex((label) => label === item.userId)
              this.deteleList.splice(i, 1)
            }
          })
        })
      })
    },
    /*这是群发客户的结束*/

    //删除客户列表的客户
    deleteUserList(row, index) {
      this.singleMessageUserList.splice(index, 1)
      this.deteleList.push(row.userId)
    },
    //删除群发客户列表的数据
    deleteGroupList(row, index) {
      this.deteleGroupList = []
      this.GroupData.splice(index, 1)
      this.groupMessageList.splice(index, 1)
      this.deteleGroupList.push(row.userId)
      this.singleMessageUserList.splice(index, 1)
    },
    //根据id获取群发列表内容
    NewAddgetPage() {
      this.models.messageItemList = []
      api.getCordGroup({ id: this.$route.query.id }).then((res) => {
        this.models.chatType = res.data.data.chatType
        if (this.models.chatType === 'single') {
          this.models = res.data.data
          this.singleMessageUserList = res.data.data.messageUserList
          this.models.messageItemList.forEach((item) => {
            this.contentType = item.type
            if (this.contentType == 'text') {
              this.textContent = item.content
            } else if (this.contentType == 'image') {
              this.imageName = item.name
              this.imageUrl = item.imageUrl
            } else if (this.contentType == 'image_text') {
              this.programName = item.name
              this.programImage = item.imageUrl
              this.programLink = item.link
              this.programContent = item.content
            } else if (this.contentType == 'program') {
              this.appProgramId = item.programId
            }
          })
        } else if (this.models.chatType === 'group') {
          this.models = res.data.data
          this.groupMessageList = res.data.data.messageUserList
          this.models.messageItemList.forEach((item) => {
            this.contentType = item.type
            if (this.contentType == 'text') {
              this.textContent = item.content
            } else if (this.contentType == 'image') {
              this.imageName = item.name
              this.imageUrl = item.imageUrl
            } else if (this.contentType == 'image_text') {
              this.programName = item.name
              this.programImage = item.imageUrl
              this.programLink = item.link
              this.programContent = item.content
            } else if (this.contentType == 'program') {
              this.appProgramId = item.programId
            }
          })
        }
      })
    },
    openTagList() {
      this.selectEnterDialog.config.visible = true
    },
    closeTagList(tag, index) {
      let that = this
      that.spanName.splice(index, 1)
      that.spanIndex.splice(index, 1)
    },

    getEnterList() {
      api.getEnterTagList().then((res) => {
        // let list = res.data.data
        this.tagNameList = res.data.data
        this.tagEditNameList = res.data.data
        // list.forEach(item => {
        //   this.tagList.push(item.tagList)
        //   this.tagEditList.push(item.tagList)
        // })
      })
    },
    changeTag(tagId, id, name) {
      let arrIndex = this.spanIndex.indexOf(id)
      let newName = this.spanName.indexOf(name)
      if (arrIndex > -1) {
        this.spanIndex.splice(arrIndex, 1)
        this.spanName.splice(newName, 1)
      } else {
        this.spanIndex.push(id)
        this.spanName.push(name)
      }
    },

    closeTagDialog() {
      this.selectEnterDialog.config.visible = false
      this.spanIndex = []
      this.spanName = []
      this.searchForm.tags = []
    },
    sumbitTagDialog() {
      this.searchForm.tags = this.spanIndex
      this.selectEnterDialog.config.visible = false
    },
    showEditTag() {
      this.selectEditEnterDialog.config.visible = true
    },

    closeEditTagList(tag, index) {
      let that = this
      that.spanEditName.splice(index, 1)
      that.spanEditIndex.splice(index, 1)
    },
    changeEditTag(tagId, id, name) {
      let arrIndex = this.spanEditIndex.indexOf(id)
      let newName = this.spanEditName.indexOf(name)
      if (arrIndex > -1) {
        this.spanEditIndex.splice(arrIndex, 1)
        this.spanEditName.splice(newName, 1)
      } else {
        this.spanEditIndex.push(id)
        this.spanEditName.push(name)
      }
    },
    closeEditTagDialog() {
      this.selectEditEnterDialog.config.visible = false
      this.spanEditIndex = []
      this.spanEditName = []
    },
    sumbitEditTagDialog() {
      this.forms.momentsUsers = []
      this.spanEditName.forEach((item) => {
        this.forms.momentsUsers.push({ name: item })
      })
      this.selectEditEnterDialog.config.visible = false
    },
    showEnterList() {
      // this.forms.momentsUsers.forEach(item => {
      //   this.spanEditIndex.push(item.userId)
      //   this.spanEditName.push(item.name)
      // })
      this.selectEditEnterDialog.config.visible = true
    },
    async insert(myValue) {
      let myField = document.getElementById('textInput')
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.models.message =
          myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)
        await this.$nextTick()
        myField.focus()
        myField.setSelectionRange(endPos + myValue.length, endPos + myValue.length)
      } else {
        this.models.message += myValue
      }
    },
    _selectedEmotion(val) {
      let message = document.getElementById('textInput')
      let insert = message.selectionStart
      this.models.message = message.value.substr(0, insert) + val + message.value.substr(insert)
    },
    changeSendSelect(val) {
      this.options.forEach((item) => {
        if (item.id === val) {
          this.appProgramId = item.id
        }
      })
    },
    getProgarm() {
      api.getProgarm().then((res) => {
        this.options = res.data.data
      })
    },
    sumbitModels() {
      this.models.messageItemList = []
      if (this.models.name === '') {
        this.$message.warning('群发标题不能为空')
        return
      } else if (this.models.chatType === '') {
        this.$message.warning('群发对象不能为空')
        return
      } else if (this.models.messageUserList.length == 0) {
        this.$message.warning('请选择想要群发的客户')
        return
      } else if (this.models.sendType === '') {
        this.$message.warning('群发时间不能为空')
        return
      } else if (this.models.message === '') {
        this.$message.warning('请输入欢迎语')
        return
      } else {
        if (this.contentType == 'text') {
          if (this.textContent == '') {
            this.$message.warning('请输入文本内容')
            return
          }
          this.models.messageItemList.push({ type: 'text', content: this.textContent })
        }
        if (this.contentType == 'image') {
          if (this.imageName == '') {
            this.$message.warning('请输入图片名称')
            return
          }
          if (this.imageUrl == '') {
            this.$message.warning('请上传图片')
            return
          }
          this.models.messageItemList.push({ type: 'image', imageUrl: this.imageUrl, name: this.imageName })
        }
        if (this.contentType == 'image_text') {
          if (this.programName == '') {
            this.$message.warning('请输入链接标题')
            return
          }
          if (this.programContent == '') {
            this.$message.warning('请输入链接简介')
            return
          }
          if (this.programLink == '') {
            this.$message.warning('请输入链接地址')
            return
          }
          if (this.programImage == '') {
            this.$message.warning('请上传链接图片')
            return
          }
          this.models.messageItemList.push({
            name: this.programName,
            content: this.programContent,
            link: this.programLink,
            imageUrl: this.programImage,
            type: 'image_text'
          })
        }
        if (this.contentType == 'program') {
          if (this.appProgramId == '') {
            this.$message.warning('请选择小程序')
            return
          }
          this.models.messageItemList.push({ type: 'program', programId: this.appProgramId })
        }

        if (this.models.messageItemList.length == 0) {
          this.$message.warning('群发内容不能为空')
          return
        }
        console.log(this.models)
      }
    }
  },
  created() {
    this.NewAddgetPage()
    this.getEnterList()
    this.getProgarm()
  }
}
</script>

<style lang="scss" scoped>
.newlyaddedDiv {
  width: 100%;
  // height: 100%;
  padding: 20px 0 20px;
  background-color: #ffffff;
  .addQunFa {
    font-weight: bold;
    font-size: 16px;
    color: #4d4d4d;
    margin: 10px 0;
  }
  .second {
    display: block;
  }
  .secondSpan {
    padding-left: 10px;
  }
  .inputBox {
    text-align: center;
  }
  .zhuTitle {
    display: inline-block;
    color: rgba(213, 215, 222, 1);
    font-size: 14px;
    margin-left: 60px;
  }
}
.MessageDiv {
  margin-top: 10px;
}

.submit-btn {
  width: 200px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
  margin: 60px auto auto auto;
  border-radius: 3px;
  cursor: pointer;
}

.dialog-input {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  .input-content {
    width: 217px;
  }
}
.Table-text {
  margin-bottom: 30px;
  width: 50%;
  color: #6e6c6c;
}
.el-table__body-wrapper {
  z-index: -1 !important;
}

.el-table {
  border: 0;
  th,
  tr,
  td {
    border: 0;
    background-color: #fff;
  }
  &::before {
    height: 0px;
  }
  &::after {
    width: 0;
  }

  .el-table__fixed:before {
    height: 0;
  }
}
// .sendBtn {
//   // margin-left: 10px;
// }
.add-content {
  width: 100%;
  height: 556px;
  padding: 0 20px;
  box-sizing: border-box;
}
.query-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  &-left {
    display: flex;
    .search-input {
      margin-right: 20px;
    }
  }
  &-right {
    display: flex;
    align-items: center;
    .customer-total {
      margin-right: 30px;
      span {
        color: #ffa500;
      }
    }
  }
}
.submit-btn-add {
  border-radius: 3px;
  width: 100px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
}
.close-btn {
  border-radius: 3px;
  width: 100px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #5c6064;
  cursor: pointer;
}
.quert-table-title:hover {
  border: 1px solid #a2a4a8;
}
.quert-table-title::-webkit-scrollbar {
  display: none;
}
.quert-table-title {
  overflow-y: hidden;
  overflow-x: scroll;
  position: relative;
  cursor: pointer;
  width: 300px;
  border: 1px solid #dcdfe6;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
  margin-right: 10px;
  .query-table-choose {
    color: #8f919e;
    margin-left: 20px;
  }
  .chosse-i {
    position: absolute;
    right: 10px;
    margin-top: 10px;
    color: #c0c4dd;
    // border: 1px solid red;
  }
}
.tagGroupTitle {
  padding: 20px 0;
}
.active {
  // font-size: 20px !important;
  background-color: #294a7b !important;
  color: #fff !important;
}
.tagIndex {
  border: 1px solid #e9e9eb;
  color: #294a7b !important;
  background-color: #ffffff !important;
}
.el-tag {
  margin: 0 4px;
}
.dialogSelect {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  .selectGroup {
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
.Btn-two {
  margin: 20px 0;

  .el-button {
    width: 100px;

    font-size: 14px;
  }
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
.enert-tag {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  // border: 1px solid red;
  max-height: 60px;
  padding: 10px 0;
  width: 50%;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
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
.info-itemtag {
  // border: 1px solid red;
  display: inline-block;
  color: #333333;
  background-color: #f2f2f2;
  height: 20px;
  line-height: 20px;
  border-radius: 20px;
  margin-right: 10px;
  padding: 5px 10px;
  // margin-bottom: 10px;
  font-size: 13px;
  cursor: pointer;
}

.remark-content {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;

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
  padding: 20px 0;
}
.tagChange {
  padding-right: 10px;
  // border: 1px solid #ccc;
  width: 95%;
  border-radius: 5px;
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
.none-tag {
  text-align: center;
}
.colse-icon:hover {
  color: #294a7b;
}
.colse-icon {
  cursor: pointer;
  margin-top: 10px;
  margin-right: 15px;
  right: 0;
  top: 0;
  position: absolute;
}
.select-div-dispose {
  height: 400px;
  overflow-y: auto;
}
.textarea-input {
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
.welcome-emjoi {
  margin-top: 10px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.background-form {
  margin-left: 10px;
  width: 700px;
  background-color: rgb(248, 247, 247);
}
.form-item-width {
  position: relative;
  padding: 20px 0;
  width: 600px;
}
.btn-primary-padding {
  padding: 10px 0;
}

/deep/ thead {
  .select-div .el-table-column--selection {
    .cell {
      display: none;
    }
  }
}
</style>
