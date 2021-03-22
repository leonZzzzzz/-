<template>
  <div class="newlyaddedDiv">
    <el-form :model="models" ref="models" label-width="100px">
      <el-form-item label="群发标题" :required="true">
        <el-input
          style="width:500px"
          v-model="name"
          maxlength="30"
          placeholder="请输入群发标题,最多可输入30个字"
        ></el-input
      ></el-form-item>

      <!--选择群发对象开始-->
      <el-form-item label="群发对象" :required="true">
        <el-radio-group v-model="chatType">
          <!-- <el-radio label="tag">客户标签</el-radio>
          <el-radio label="lifeCycle">客户生命周期</el-radio> -->
          <el-radio label="single" @change="changeSendVisible">指定客户</el-radio>
          <el-radio label="group" @change="changeSend">指定客户群</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" v-if="chatType == 'tag' && forms.momentsUsers.length == 0" @click="showEnterList()"
          >选择客户标签</el-button
        > -->
        <el-button type="primary" v-if="chatType == 'single'" @click="showSelectionCustomerList()"
          >选择指定客户</el-button
        >
        <el-button type="primary" v-if="chatType == 'group'" @click="showGroupSelectionCustomerList"
          >选择群发的群</el-button
        >
        <div v-if="chatType === 'single'">
          <el-form-item>
            <el-table :data="customerData" style="width:80%" height="201">
              <el-table-column v-for="(item, index) in customerColumn" :key="index" v-bind="item"> </el-table-column>
            </el-table>
          </el-form-item>
        </div>
        <div v-if="chatType === 'group'">
          <el-form-item>
            <el-table :data="GroupData" style="width:80%" height="171">
              <el-table-column v-for="(item, index) in GroupColumn" :key="index" v-bind="item"> </el-table-column>
            </el-table>
          </el-form-item>
        </div>
        <!-- <div v-if="chatType === 'tag'" class="enert-tag">
          <span class="edit-tag" @click="showEditTag" v-if="forms.momentsUsers.length != 0">
            编辑
          </span>
          <span class="info-itemtag" v-for="(item, EnertTag) in forms.momentsUsers" :key="EnertTag">
            {{ item.name || '--' }}
          </span>
        </div> -->
      </el-form-item>
      <!--选择客户生命周期-->
      <!-- <el-form-item label="客户生命周期" v-if="chatType === 'lifeCycle'" placeholder="请选择客户生命周期">
        <el-select v-model="customerLifeCycleId" @change="changeSelect()">
          <el-option
            v-for="(LifeCycleItem, CycleIndex) in customerLifeCycleList"
            :key="CycleIndex"
            :label="LifeCycleItem.cycleName"
            :value="LifeCycleItem.id"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <!--选择群发对象结束-->

      <el-form-item label="群发时间" :required="true">
        <el-radio-group v-model="sendType">
          <el-radio label="now" @change="changefalseVisible">立即群发</el-radio>
          <el-radio label="time" @change="changeVisible">定时群发</el-radio>
        </el-radio-group>

        <div v-if="index == true">
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
      <el-form-item label="群发内容" :required="true">
        <el-button type="info" @click="showSpeechAddDialog">+添加群发内容</el-button>
      </el-form-item>
      <!-- <div>
        <el-form-item>
          <el-table :data="models.messageItemList" style="width:50%" height="300">
            <el-table-column v-for="(item, index) in columnMessage" :key="index" v-bind="item"> </el-table-column>
          </el-table>
        </el-form-item>
      </div> -->
      <!-- <el-form-item label="欢迎语">
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
      <el-form-item label="附加内容" :required="true">
        <el-radio-group v-model="changeTag">
          <el-radio label="text" @change="changeNone">无</el-radio>
          <el-radio label="image" @change="changeImage">图片</el-radio>
          <el-radio label="image_text" @change="changeWeb">网页</el-radio>
          <el-radio label="program" @change="changeApp">小程序</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="image-div" v-if="model.type === 'image'">
        <QcImageUpload width="100px" height="100px" class="image-upload" v-model="imageUrl" prop="imageUrl">
        </QcImageUpload>
        <span>上传图片</span>
      </div>
      <div class="web-div" v-if="model.type === 'image_text'">
        <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接标题" prop="name"
          ><el-input placeholder="最多可输入32个字" v-model="model.name"></el-input
        ></el-form-item>
        <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接简介" prop="content"
          ><el-input placeholder="最多可输入32个字" v-model="model.content"></el-input
        ></el-form-item>
        <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接地址" prop="link"
          ><el-input placeholder="请输入链接地址" v-model="model.link"></el-input
        ></el-form-item>
        <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="封面图" prop="imageUrl">
          <QcImageUpload width="100px" height="100px" v-model="linkImageUrl"> </QcImageUpload>
          <span>上传图片</span>
        </el-form-item>
      </div>
      <div class="app-div" v-if="model.type === 'program'">
        <el-form-item label="配置小程序">
          <el-select placeholder="请选择" v-model="model.programId" @change="changeSelect()">
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
      </div> -->
      <el-form-item>
        <el-button @click="addBtn" type="primary">确认发布</el-button>

        <el-button @click="saveDrafts" type="info">保存到草稿箱</el-button>
      </el-form-item>
    </el-form>

    <!-- <div class="addDialog"></div> -->
    <el-dialog
      title="添加群发素材"
      :visible.sync="addMaterialDialog"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <div class="material">
        <ComMaterial
          :menus="materalMenu"
          ref="materialEditor"
          :materialType="materialEditor.type"
          @typeChange="materialTypeChange"
        >
        </ComMaterial>
        <div class="dialog-input" v-if="materialEditor.type === 'image'">
          <span>素材名称&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <div class="input-content">
            <el-input v-model="speechEditDialog.input.imageName" placeholder="请输入素材名称"> </el-input>
          </div>
        </div>
        <div class="dialog-input" v-if="materialEditor.type === 'video'">
          <span>素材名称&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <div class="input-content">
            <el-input v-model="speechEditDialog.input.videoName" placeholder="请输入素材名称"> </el-input>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="checkAndEditSpeechData()">取 消</el-button>
        <el-button type="primary" @click="checkAndSumbitSpeechData()">确 定</el-button>
      </span>
    </el-dialog>

    <com-dialog :config="addDialog.config" @closeDialog="closeAddDialog">
      <div class="add-content">
        <div class="query-table">
          <div class="query-table-left">
            <div class="search-input">
              <!-- <div class="search-input-span">客户名称：</div> -->
              <el-input size="small" placeholder="输入客户名称" v-model="selectionSearchContent"> </el-input>
            </div>
            <div class="quert-table-title" @click="openTagList()">
              <span class="query-table-choose" v-if="searchForm.tags.length == 0">请选择客户标签</span>
              <template v-if="searchForm.tags.length != 0">
                <!-- <span class="quert-table-select">{{ spanName[0] }}&nbsp;+&nbsp;{{ spanName.length }} </span> -->
                <!-- <span class="quert-table-select">{{ item }} </span> -->
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
            <div class="search-input">
              <span>客户生命周期：</span>
              <el-select v-model="customerLifeCycleId" @change="changeSelect()" class="customer-selection">
                <el-option
                  v-for="(LifeCycleItem, CycleIndex) in customerLifeCycleList"
                  :key="CycleIndex"
                  :label="LifeCycleItem.cycleName"
                  :value="LifeCycleItem.id"
                >
                </el-option>
              </el-select>
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
            ref="mulGrouptipleTable"
            :data="selectionGroupData"
            style="width: 100%"
            height="400"
            :row-key="getGroupRowKey"
            @selection-change="handleGroupSelectionChange"
          >
            <el-table-column
              v-for="(item, index) in selectionGroupColumn"
              :key="index"
              v-bind="item"
              :reserve-selection="true"
              class="selection-group"
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
      <div class="select-div">
        <div v-for="(item, index) in tagNameList" :key="index">
          <div class="tagGroupTitle">{{ item.name }}</div>
          <div class="tagChange">
            <div
              @click="changeTag(items.tagId, items.id, items.name, items.groupId)"
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
    <enter-tag-list
      :config="departmentDialog.config"
      @closeDialog="closeEnterTagDialog"
      :selectedList="forms.momentsUsers"
      ref="department"
      @handleConfirm="handleConfirm"
    >
    </enter-tag-list>
  </div>
</template>

<script>
import api from '../../api/groupsend'
import ComDialog from '../../components/common/ComDialog'
import ComMaterial from '../../components/common/MaterialEditor'
import ComPagination from '../../components/common/ComPagination'
import EnterTagList from '../../components/common/EnterTagList'
// import Emotion from '../../components/common/Emotion'
export default {
  components: { ComMaterial, ComPagination, ComDialog, EnterTagList },
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
      customerLifeCycleId: '',
      customerLifeCycleList: [],
      departmentDialog: {
        config: {
          width: '800px',
          title: '选择企业标签',
          visible: false
        }
      },
      forms: {
        momentsUsers: []
      },
      getall: [],
      msgItem: [],
      name: '',
      // sendType: '',
      // chatType: '',
      models: {
        id: '',
        createTime: '',
        name: '',
        chatType: '',
        sender: '',
        sendType: '',
        status: '',
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
      materalMenu: [
        { type: 'text', title: '文字', icon: 'el-icon-edit' },
        { type: 'image', title: '图片', icon: 'el-icon-picture-outline' },
        { type: 'image_text', title: '图文', icon: 'el-icon-link' }
      ],
      saveID: {},
      value: '',
      index: false,
      choose: false,
      sendType: 'now',
      chatType: 'single',
      groupDialog: false,
      addMaterialDialog: false,
      PeopleDialog: false,
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
      peopleOptions: {
        url: 'api/admin/v1/wxCropUser/page'
      },
      tableData: [],

      addDialog: {
        config: {
          width: '1500px',
          title: '选择指定客户',
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
      columnMessage: [
        {
          type: 'index',
          label: '序号',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '内容',
          minWidth: '150px',
          align: 'center',
          prop: 'content',
          formatter: (row) => {
            return {
              text: <div>{row.content}</div>,
              image: <img src={this.imgHost + row.imageUrl} style="width:80px;height:80px;" alt="" />,
              image_text: (
                <div>
                  <el-tag size="mini" style="margin-right: 10px;">
                    图文
                  </el-tag>
                  {row.name}
                </div>
              ),
              video: <video style="width: 150px; height: 100px;" src="#" controls="controls" />,
              program: (
                <div>
                  <el-tag size="mini" style="margin-right: 10px;" type="success">
                    小程序
                  </el-tag>
                  {row.name}
                </div>
              ),
              file: (
                <div>
                  <el-tag size="mini" style="margin-right: 10px;" type="warning">
                    文件
                  </el-tag>
                  {row.name}
                </div>
              )
            }[row.type]
          }
        },
        {
          label: '类型',
          minWidth: '150px',
          align: 'center',
          prop: 'type',
          formatter: (row) => {
            return {
              text: '文字',
              image: '图片',
              image_text: '图文',
              video: '视频',
              program: '小程序',
              file: '文件'
            }[row.type]
          }
        },
        {
          label: '操作',
          align: 'center',
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                <el-button type="text" onClick={this.deleteMaterial.bind(this, row, index)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      //选择客户后的页面客户列表
      customerData: [],
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
          prop: 'name'
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
          label: '客户状态',
          align: 'center',
          minWidth: '120px',
          prop: 'statusName'
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
      GroupData: [],
      GroupColumn: [
        { type: 'index', label: '序号', align: 'center' },
        { prop: 'name', label: '群名称', align: 'center' },
        {
          label: '微信群ID',
          align: 'center',
          prop: 'cropAppId'
        },
        { prop: 'ownerName', label: '创建人', labelWidth: '200', align: 'center' },
        { prop: 'createAtToTime', label: '创建时间', labelWidth: '200', align: 'center' },
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
      selected: [],
      multipleTable: [],
      deteleList: [],
      deteleGroupList: [],
      mulGrouptipleTable: [],
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
      searchForm: {
        tags: []
      },
      singleUserId: [], //存放指定客户数组
      lifeCycleUserId: [], //存放客户生命周期数组
      groupUserId: [], //存放指定群数组
      tagUserId: [], //存放客户标签数组

      groupId: []
    }
  },

  methods: {
    addBtn() {
      this.models.name = this.name
      this.models.chatType = this.chatType
      this.models.sendType = this.sendType
      if (this.models.name === '') {
        this.$message.warning('群发标题不能为空')
      } else if (this.models.chatType === '') {
        this.$message.warning('群发对象不能为空')
      } else if (this.models.messageUserList == '') {
        this.$message.warning('请选择想要群发的客户或群')
      } else if (this.models.sendType === '') {
        this.$message.warning('群发时间不能为空')
      } else if (this.models.messageItemList == '') {
        this.$message.warning('请填写群发内容')
      } else {
        if (this.models.sendType == 'now') {
          this.models.scheduledSendTime = ''
        }
        if (this.models.chatType == 'single') {
          this.models.messageUserList = this.singleUserId
          this.models.sender = ''
          if (this.models.messageUserList.length == 0) {
            this.$message.warning('请选择需要发送的客户')
          } else {
            this.saveAddIf()
          }
        } else if (this.models.chatType == 'group') {
          this.models.messageUserList = this.groupUserId
          if (this.models.messageUserList.length == 0) {
            this.$message.warning('请选择需要发送的群')
          } else {
            this.saveAddIf()
          }
        } else if (this.models.chatType == 'tag') {
          this.models.sender = ''
          this.models.messageUserList = this.tagUserId
          if (this.models.messageUserList.length == 0) {
            this.$message.warning('请选择客户标签')
          } else {
            this.saveAddIf()
          }
        } else if (this.models.chatType == 'lifeCycle') {
          this.models.sender = ''
          this.models.messageUserList = this.lifeCycleUserId
          if (this.models.messageUserList.length == 0) {
            this.$message.warning('请选择客户生命周期')
          } else {
            this.saveAddIf()
          }
        }
      }
    },
    saveAddIf() {
      api.groupChatAdd(this.models).then((res) => {
        this.$message.success('添加成功，等待客户所属同事确认发送')
        let sendMessageId = res.data.message
        api.groupSend({ sendMessageId: sendMessageId }).then(() => {
          this.$message.success('发布成功')
          this.reload()
        })
      })
    },
    //立即群发
    changefalseVisible() {
      this.models.sendType = 'now'
      // this.model.status = 'success'
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
      this.models.name = this.name
      this.models.chatType = this.chatType
      this.models.sendType = this.sendType
      if (this.models.name === '') {
        this.$message.warning('群发标题不能为空')
      } else if (this.models.chatType === '') {
        this.$message.warning('群发对象不能为空')
      } else if (this.models.sendType === '') {
        this.$message.warning('群发时间不能为空')
      } else if (this.models.messageItemList == '') {
        this.$message.warning('请填写群发内容')
      } else {
        if (this.models.sendType == 'now') {
          this.models.scheduledSendTime = ''
        }
        if (this.models.chatType == 'single') {
          this.models.messageUserList = this.singleUserId
          this.models.sender = ''
          if (this.models.messageUserList.length == 0) {
            this.$message.warning('请选择需要发送的客户')
          } else {
            this.addDrafts()
          }
        } else if (this.models.chatType == 'group') {
          this.models.messageUserList = this.groupUserId
          if (this.models.messageUserList.length == 0) {
            this.$message.warning('请选择需要发送的群')
          } else {
            this.addDrafts()
          }
        } else if (this.models.chatType == 'tag') {
          this.models.sender = ''
          this.models.messageUserList = this.tagUserId
          if (this.models.messageUserList.length == 0) {
            this.$message.warning('请选择客户标签')
          } else {
            this.addDrafts()
          }
        } else if (this.models.chatType == 'lifeCycle') {
          this.models.sender = ''
          this.models.messageUserList = this.lifeCycleUserId
          if (this.models.messageUserList.length == 0) {
            this.$message.warning('请选择客户生命周期')
          } else {
            this.addDrafts()
          }
        }
      }
      //
      // }
    },
    addDrafts() {
      this.models.status = 'draft'
      api.groupChatAdd(this.models).then(() => {
        this.$message.success('成功添加到草稿箱')
        this.reload()
      })
    },
    closeSpeechEditDialog() {
      this.speechEditDialog.config.visible = false
      this.materialEditor.type = 'text'
    },
    materialTypeChange(val) {
      this.materialEditor.type = val
    },

    showSpeechAddDialog() {
      this.addMaterialDialog = true
    },
    checkAndSumbitSpeechData() {
      let that = this
      let type = that.materialEditor.type
      if (type === 'text') {
        let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          this.sumbitSpeechData(type, params)
        } else {
          this.$message.warning('请输入内容')
        }
      } else if (type === 'image') {
        let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (this.speechEditDialog.input.imageName == '') {
            this.$message.warning('请输入图片名称')
          } else {
            params.name = this.speechEditDialog.input.imageName
            this.sumbitSpeechData(type, params)
          }
        } else {
          this.$message.warning('请添加图片')
        }
      } else if (type === 'image_text') {
        let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          this.sumbitSpeechData(type, params)
        } else {
          this.$message.warning('请添加图文')
        }
      } else if (type === 'video') {
        let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (this.speechEditDialog.input.videoName === '') {
            this.$message.warning('请输入视频名称')
          } else {
            let that = this
            let fileId = params.fileId
            params.name = that.speechEditDialog.input.videoName
            api.getVideoSignatureDetail({ fileId }).then((res) => {
              params.videoUrl = res.data.data.file.url + res.data.data.playSignature.queryString
              that.sumbitSpeechData(type, params)
            })
          }
        } else {
          this.$message.warning('请添加视频')
        }
      } else if (type === 'program') {
        let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          this.sumbitSpeechData(type, params)
        } else {
          this.$message.warning('请添加小程序')
        }
      } else if (type === 'file') {
        let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          this.sumbitSpeechData(type, params)
        } else {
          this.$message.warning('请添加文件')
        }
      }
    },
    checkAndEditSpeechData() {
      this.addMaterialDialog = false
      // 类型
      this.materialEditor.type = 'text'
      // 素材编辑器
      this.$refs.materialEditor.clearFormData()
      // 弹窗输入信息
      this.speechEditDialog.input.imageName = ''
      this.speechEditDialog.input.videoName = ''
    },
    sumbitSpeechData(type, params) {
      let that = this
      params.type = type
      that.form = params
      this.messageItemList.push(that.form)
      this.models.messageItemList = this.messageItemList
      that.addMaterialDialog = false
      that.$refs.materialEditor.clearFormData()
      this.speechEditDialog.input.imageName = ''
      this.speechEditDialog.input.videoName = ''
    },

    //群发类型
    //群发客户
    changeSendVisible() {
      // this.singleDiv = true
      // this.groupDiv = false
    },
    //群发群
    changeSend() {
      // this.singleDiv = false
      // this.groupDiv = true
    },

    getPage() {
      api.groupList(this.page).then((res) => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    PeopleSave() {
      if (this.models.sender === '') {
        this.$message.warning('请选择发送者')
      } else {
        this.PeopleDialog = false
      }
    },
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
    handleGroupSelectionChange(val) {
      this.messageUserList = []
      this.groupUserId = []
      this.GroupData = val
      val.forEach((item) => {
        this.messageUserList.push({ userId: item.id })
        this.models.sender = item.owner
      })
      // this.models.messageUserList = this.messageUserList
      this.groupUserId = this.messageUserList
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
    sumbitGroupSelectionData() {
      this.changeGroupDialog.config.visible = false
    },
    showGroupSelectionCustomerList() {
      this.changeGroupDialog.config.visible = true
      this.getGroupSelectionCustomerList()
    },
    //获取群选择列表

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
          this.selectionGroupData.forEach((item) => {
            let flag = this.deteleGroupList.some((label) => item.id === label)
            if (flag) {
              this.$refs.mulGrouptipleTable.toggleRowSelection(item, false)
              let i = this.deteleGroupList.findIndex((label) => label === item.id)
              this.deteleGroupList.splice(i, 1)
            }
          })
        })
      })
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
      this.customerLifeCycleId = ''
      this.getSelectionCustomerList()
    },
    //选择改变的
    handleSelectionChange(val) {
      this.messageUserList = []
      this.customerData = val
      val.forEach((item) => {
        this.messageUserList.push({ userId: item.id })
      })
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
      this.customerLifeCycleId = ''
    },
    // 提交选项，添加客户到分组
    submitSelectionData() {
      // this.models.messageUserList = []
      // if (this.messageUserList.length === 0) {
      //   this.$message.warning('请选择需要发送的客户')
      // } else {
      //   this.models.messageUserList = this.messageUserList
      //   this.addDialog.config.visible = false
      // }
      this.singleUserId = []
      if (this.singleUserId === 0) {
        this.$message.warning('请选择需要发送的客户')
      } else {
        this.singleUserId = this.messageUserList
        this.addDialog.config.visible = false
      }
    },
    //显示弹窗
    showSelectionCustomerList() {
      this.addDialog.config.visible = true
      this.getSelectionCustomerList()
    },
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
          this.selectionData.forEach((item) => {
            let flag = this.deteleList.some((label) => item.id === label)
            if (flag) {
              this.$refs.multipleTable.toggleRowSelection(item, false)
              let i = this.deteleList.findIndex((label) => label === item.id)
              this.deteleList.splice(i, 1)
            }
          })
        })
      })
    },

    /*这是群发客户的结束*/

    // 删除素材
    deleteMaterial(row, index) {
      this.models.messageItemList.splice(index, 1)
    },

    //删除客户列表的客户
    deleteUserList(row, index) {
      this.customerData.splice(index, 1)
      this.models.messageUserList.splice(index, 1)
      // this.messageUserList.splice(index, 1)
      this.deteleList.push(row.id)
    },
    //删除群发客户列表的数据
    deleteGroupList(row, index) {
      this.GroupData.splice(index, 1)
      this.models.messageUserList.splice(index, 1)
      this.messageUserList.splice(index, 1)
      this.deteleGroupList.push(row.id)
    },
    closeTagList(tag, index) {
      let that = this
      that.spanName.splice(index, 1)
      that.spanIndex.splice(index, 1)
    },
    changeTag(tagId, id, name, groupId) {
      this.groupId = []
      let arrIndex = this.spanIndex.indexOf(id)
      let newName = this.spanName.indexOf(name)
      let newGroup = this.groupId.indexOf(groupId)
      if (arrIndex > -1) {
        this.spanIndex.splice(arrIndex, 1)
        this.spanName.splice(newName, 1)
        this.groupId.splice(newGroup, 1)
      } else {
        this.spanIndex.push(id)
        this.spanName.push(name)
        this.groupId.push({ groupId: groupId, id: id })
      }
    },
    //关闭编辑企业标签
    closeTagDialog() {
      this.selectEnterDialog.config.visible = false
      this.spanIndex = []
      this.spanName = []
      this.searchForm.tags = []
    },
    sumbitTagDialog() {
      // for (var i = 0; i < this.groupId.length; i++) {
      //   for (var j = 0; j < this.groupId.length; j++) {
      //     // console.log(1)
      //     if (this.groupId[i].groupId == this.groupId[j].groupId) {
      //       console.log(this.groupId[i].id)
      //     }
      //   }
      // }

      this.searchForm.tags = this.spanIndex
      this.selectEnterDialog.config.visible = false
    },
    getEnterList() {
      api.getEnterTagList().then((res) => {
        let list = res.data.data
        this.tagNameList = res.data.data
        list.forEach((item) => {
          this.tagList.push(item.tagList)
        })
      })
    },
    openTagList() {
      this.selectEnterDialog.config.visible = true
    },

    //最新添加的
    handleConfirm(list) {
      this.forms.momentsUsers = []
      let listId = []
      this.departmentDialog.config.visible = false
      list.forEach((item) => {
        this.forms.momentsUsers.push({ name: item.name, id: item.id })
        listId.push({ userId: item.id })
      })
      this.tagUserId = listId
    },
    showEnterList() {
      this.departmentDialog.config.visible = true
    },
    closeEnterTagDialog() {
      this.forms.momentsUsers = []
      this.departmentDialog.config.visible = false
    },
    getCustomerLifeCyle() {
      this.$http.getCustomerLifeCyle().then((res) => {
        let list = res.data.data.list
        list.forEach((item) => {
          this.customerLifeCycleList.push({ id: item.id, cycleName: item.cycleName })
        })
      })
    },
    changeSelect(val) {
      // this.models.messageUserList = []
      // let lifeCycle = []
      this.customerLifeCycleList.forEach((item) => {
        if (item.id === val) {
          this.customerLifeCycleId = item.id
        }
      })
      this.lifeCycleUserId.push({ userId: this.customerLifeCycleId })
    },
    showEditTag() {
      this.departmentDialog.config.visible = true
    }
  },
  created() {
    this.getEnterList()
    this.getCustomerLifeCyle()
  }
}
</script>

<style lang="scss" scoped>
.newlyaddedDiv {
  width: 100%;
  // height: 100%;
  padding: 20px 0 20px 20px;
  background-color: #ffffff;

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
  margin-top: 20px;
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
      // width: 400px;
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
.submit-btn {
  width: 100px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
  // margin: 60px auto;
  border-radius: 3px;
  cursor: pointer;
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
.quert-table-select {
  background-color: #e4e4e4;
  margin-left: 10px;
  border-radius: 5px;
  // padding: 2px 5px;
  color: #818181;
}
.dialogSelect {
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
.Btn-two {
  margin: 20px 0;

  .el-button {
    width: 100px;

    font-size: 14px;
  }
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
.tagGroupTitle {
  padding: 10px 0;
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
.enert-tag {
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
.select-div {
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
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
</style>
