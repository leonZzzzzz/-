<template>
  <div class="code-invitate-form">
    <!-- <go-back :title="form.id ? '修改拉群' : '自动拉群'"></go-back> -->
    <QcNavigationPage class="prodocu-page" :content="form.id ? '修改拉群' : '自动拉群'"  full :footerBlockH="20">
      <div class="container">
        <div class="module">
          <div class="title">拉群方式</div>
          <div class="type-setting">
            <el-form label-width="120px">
              <el-form-item label="拉群方式">
                <el-radio-group v-model="form.type" :disabled="form.id ? true : false">
                  <el-radio label="chat_qrcode">群二维码拉群</el-radio>
                  <el-radio label="dynamic_qrcode">企业活码拉群</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="module">
          <div class="title">基础信息</div>
          <div class="content">
            <div class="base-form">
              <el-form label-width="120px">
                <el-form-item label="二维码名称" :rules="[{ required: true, message: '该字段不能为空' }]">
                  <el-input
                    v-model="form.name"
                    placeholder="名称不会展示给用户,用于企业记录渠道名称或使用场景"
                    maxlength="32"
                    show-word-limit
                    :disabled="form.id ? true : false"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="选择分组" :required="true">
                  <el-select v-model="form.groupId">
                    <div class="add-new" v-if="categoryList.length > 0" @click="showCategoryAddDialog">
                      <i class="el-icon-plus" />&nbsp;&nbsp;添加分组
                    </div>
                    <el-option label="" value="" v-if="categoryList.length <= 0">
                      <div class="add-new" style="padding: 0" @click="showCategoryAddDialog">
                        <i class="el-icon-plus" />&nbsp;&nbsp;添加分组
                      </div>
                    </el-option>
                    <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="使用人员" :required="true">
                  <div class="user-item" v-if="selectedUsers.length != 0">
                    <span class="user-item-content" v-for="(item, index) in selectedUsers" :key="index">
                      <i class="item-icon el-icon-s-custom"></i>
                      {{ item.name }}
                    </span>
                  </div>
                  <el-button icon="el-icon-plus" plain size="small" @click="addUsers">添加</el-button>
                </el-form-item>
                <!-- 外部客户添加时是否无需验证，默认为true -->
                <el-form-item label="好友验证">
                  <div class="verify-switch">
                    <el-switch
                      v-model="form.isSkipVerify"
                      active-color="#294a7b"
                      :active-value="false"
                      :inactive-value="true"
                    >
                    </el-switch>
                    <span>{{ form.isSkipVerify ? '已关闭' : '已开启' }}</span>
                    <el-tooltip
                      effect="light"
                      placement="right"
                      content="开启好友验证后，用户扫码添加好友需要验证后才会添加成功，关闭好友验证后不需要验证，直接添加成功"
                    >
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </div>
                </el-form-item>
                <!-- <el-form-item label="行为标签">
                  <div class="none-tag" v-if="behaviorTagList.length == 0">
                    暂无创建的行为标签，<el-button type="text" @click="goToCreate">请先前往创建&nbsp;&gt;</el-button>
                  </div>
                  <div class="tag-list-wrapper">
                    <div :class="['tag-list', tagShowMoreFlag ? 'show' : '']">
                      <div class="tag-list-box" ref="behaviorTagList">
                        <div class="tag-group" v-for="(item, index) in behaviorTagList" :key="index">
                          <div class="group-title">{{ item.name }}</div>
                          <div class="group-content">
                            <div
                              class="tag-item"
                              v-for="(obj, idx) in item.tagList"
                              :key="idx"
                              :class="checkTagActive(obj) ? 'active' : ''"
                              @click="onTagSelect(obj, item.id)"
                            >
                              {{ obj.name }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="tag-list-more" v-if="behaviorTagBoxHeight > 110">
                        <el-button type="text" @click="tagShowMoreFlag = !tagShowMoreFlag">
                          {{ tagShowMoreFlag ? '收起' : '展开' }}
                          <i :class="[tagShowMoreFlag ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
                        </el-button>
                      </div>
                    </div>
                  </div>
                </el-form-item> -->
                <el-form-item label="行为标签">
                  <div class="behavior-tag-box">
                    <div class="tag-add-btn">
                      <el-button icon="el-icon-plus" plain size="mini" circle @click="addTagGroup"> </el-button>
                    </div>
                    <div class="none-tag" style="text-align: center" v-if="behaviorTagList.length == 0">
                      暂无创建的行为标签，<el-button type="text" @click="goToCreate">请先前往创建&nbsp;&gt;</el-button>
                    </div>
                    <div class="tag-list-wrapper">
                      <div :class="['tag-list', tagShowMoreFlag ? 'show' : '']">
                        <div class="tag-list-box" ref="behaviorTagList">
                          <div class="tag-group" v-for="(item, index) in behaviorTagList" :key="index">
                            <div class="group-title">{{ item.name }}</div>
                            <div class="group-content">
                              <div
                                class="tag-item"
                                v-for="(obj, idx) in item.tagList"
                                :key="idx"
                                :class="checkTagActive(obj) ? 'active' : ''"
                                @click="onTagSelect(obj, item.id)"
                              >
                                {{ obj.name }}
                              </div>
                            </div>
                            <div class="group-edit">
                              <el-button
                                icon="el-icon-edit"
                                plain
                                size="mini"
                                circle
                                @click="updateBehaviorTag(index)"
                              ></el-button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="tag-list-more" v-if="behaviorTagBoxHeight > 153">
                      <el-button type="text" @click="tagShowMoreFlag = !tagShowMoreFlag">
                        {{ tagShowMoreFlag ? '收起' : '展开' }}
                        <i :class="[tagShowMoreFlag ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
                      </el-button>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="module" style="max-width: 1300px">
          <div class="title">设置群信息</div>
          <div class="setting-content">
            <div class="group-setting">
              <!-- 群活码提示信息 -->
              <div class="normal-tips" v-if="form.type == 'dynamic_qrcode'">
                <i class="el-icon-warning"></i>
                <span class="tips-cont"
                  >&nbsp;&nbsp;无需创建群聊即可在企微后台生成群聊活码，拉群二维码将永久有效，快来创建试试吧</span
                >
                <span class="tips-check">&nbsp;&nbsp;查看如何创建</span>
              </div>
              <el-form label-width="120px">
                <el-form-item label="入群引导语" :required="true">
                  <div class="setting-input-box">
                    <el-input
                      placeholder="例：你好！扫码下方二维码进群交流~如有问题，可随时咨询"
                      id="textInput"
                      class="textarea-input"
                      type="textarea"
                      maxlength="1300"
                      size="small"
                      :rows="6"
                      resize="none"
                      show-word-limit
                      style="width: 100%"
                      v-model="form.message"
                    >
                    </el-input>
                  </div>
                  <!-- 群二维码提示信息 -->
                  <div class="setting-tips" v-if="form.type == 'chat_qrcode'">
                    <div class="tips-title">提示：</div>
                    <div class="tips-content">
                      <p>1、可添加多个群聊，当前面的群人数达到上限后，自动发送后面的群二维码</p>
                      <p>2、群人数上限最多为200人</p>
                      <p>3、上传群二维码时请【仔细核对】，群二维码和群聊【对应错误】将导致【拉群任务失败】</p>
                    </div>
                  </div>
                  <!-- 群活码提示信息 -->
                  <div class="c-tips" style="margin-top: 20px" v-if="form.type == 'dynamic-qrcode'">
                    <el-alert
                      title="入群人数统计规则：扫描微伴活码即认为客户入群，扫码人数会与实际扫企业微信活码入群人数有偏差"
                      type="warning"
                      show-icon
                      :closable="false"
                    >
                    </el-alert>
                  </div>
                </el-form-item>
                <!-- 群二维码 -->
                <template v-if="form.type == 'chat_qrcode'">
                  <el-form-item
                    v-for="(item, index) in selectedColony"
                    :key="index"
                    :label="'群聊' + (index + 1)"
                    :required="true"
                  >
                    <div class="group-wrapper">
                      <div class="group-box">
                        <div class="group-content">
                          <div class="g-c-left">
                            <img class="group-img" src="../../../images/group-icon.png" />
                            <div class="group-msg">
                              <div class="msg-name">{{ item.colonyInfo.name }}</div>
                              <div class="msg-numb">{{ item.colonyInfo.quantity }} / 200人</div>
                            </div>
                          </div>
                          <div class="g-c-right">
                            <i class="el-icon-edit right-icon" @click="editSelectedColony(index)"></i>
                            <i class="el-icon-delete right-icon" @click="deleteSelectedColony(index)"></i>
                          </div>
                        </div>
                        <div class="group-qrcode">
                          <upload-image
                            :fileList="item.fileList"
                            :multiple="false"
                            tips="上传群二维码"
                            @success="(val) => uploadImageSuccess(val, index)"
                          ></upload-image>
                        </div>
                        <div class="group-limit">
                          群聊人数上限：<el-input-number
                            size="small"
                            :min="item.colonyInfo.quantity == 200 ? 200 : item.colonyInfo.quantity + 1"
                            :max="200"
                            v-model="item.toplimitQuantity"
                          ></el-input-number>
                        </div>
                      </div>
                      <div class="operate-btns">
                        <div class="top"></div>
                        <div class="bottom">
                          <el-button v-if="index != 0" @click="colonyMoveUp(index)">上移</el-button>
                          <el-button
                            style="margin-left: 0; margin-top: 10px"
                            v-if="index != selectedColony.length - 1"
                            @click="colonyMoveDown(index)"
                            >下移</el-button
                          >
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </template>
                <!-- 企微活码 -->
                <template v-if="form.type == 'dynamic_qrcode'">
                  <el-form-item
                    v-for="(item, index) in liveCodeList"
                    :key="index"
                    :label="'群活码' + (index + 1)"
                    :required="true"
                  >
                    <div class="group-wrapper">
                      <div class="group-box">
                        <div class="normal-tips" style="margin-left: 0">
                          <i class="el-icon-warning"></i>
                          <span class="tips-cont">&nbsp;&nbsp;请上传在企业微信后台创建的活码</span>
                          <span class="tips-check">&nbsp;&nbsp;去创建</span>
                          <span class="tips-check">&nbsp;&nbsp;查看如何创建</span>
                        </div>
                        <div class="group-qrcode">
                          <upload-image
                            :fileList="item.fileList"
                            :multiple="false"
                            tips="上传群活码"
                            @success="(val) => uploadLiveCodeSuccess(val, index)"
                          ></upload-image>
                        </div>
                        <div class="group-limit">
                          群活码人数上限：<el-input-number
                            size="small"
                            :min="1"
                            :max="1000"
                            v-model="item.toplimitQuantity"
                          ></el-input-number>
                        </div>
                      </div>
                      <div class="operate-btns">
                        <div class="top" @click="deleteLiveCode(index)">删除</div>
                        <div class="bottom">
                          <el-button v-if="index != 0" @click="codeMoveUp(index)">上移</el-button>
                          <el-button
                            style="margin-left: 0; margin-top: 10px"
                            v-if="index != liveCodeList.length - 1"
                            @click="codeMoveDown(index)"
                            >下移</el-button
                          >
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </template>
                <el-form-item
                  :label="'群聊' + (selectedColony.length + 1)"
                  :required="true"
                  v-if="form.type == 'chat_qrcode'"
                >
                  <el-button size="mini" icon="el-icon-plus" @click="showColonyDialog">选择群聊</el-button>
                </el-form-item>
                <el-form-item label="群活码" :required="true" v-if="form.type == 'dynamic_qrcode'">
                  <el-button size="mini" icon="el-icon-plus" @click="addLiveCode">添加群活码</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="preview-panel">
              <div class="panel-title">客户收到的消息</div>
              <div class="panel-content">
                <img src="../../../images/groupsendMobile.png" />
                <div class="preview-content">
                  <div class="p-cont-time">
                    <span>{{ newTime }}</span>
                  </div>
                  <div class="p-cont-text" v-if="form.message.length != 0">
                    <i class="el-icon-user-solid icon-user"></i>
                    <div class="text-content">
                      <p v-html="parsingEmoji(form.message)"></p>
                    </div>
                  </div>
                  <template v-if="form.type == 'chat_qrcode'">
                    <div class="p-cont-text" v-if="selectedColony.length > 0 && selectedColony[0].qrCodeUrl != ''">
                      <i class="el-icon-user-solid icon-user"></i>
                      <div>
                        <img class="img-content" :src="imgHost + selectedColony[0].qrCodeUrl" />
                      </div>
                    </div>
                  </template>
                  <template v-if="form.type == 'dynamic_qrcode'">
                    <div class="p-cont-text" v-if="liveCodeList.length > 0 && liveCodeList[0].qrCodeUrl != ''">
                      <i class="el-icon-user-solid icon-user"></i>
                      <div>
                        <img class="img-content" :src="imgHost + liveCodeList[0].qrCodeUrl" />
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="module">
          <div class="title">功能设置</div>
          <div class="other-setting">
            <el-form label-width="120px">
              <el-form-item label="二维码预览">
                <div class="upload-avatar">
                  <img src="#" />
                  <upload-image :multiple="false" tips="更换头像" :width="100" :height="100"></upload-image>
                </div>
                <div>*此二维码只是样式预览效果，请勿直接使用</div>
              </el-form-item>
            </el-form>
          </div>
        </div> -->
        <!-- <div class="f-btn-group">
          <el-button @click="goBack">取消</el-button>
          <el-button type="primary" @click="submitCodeInvitateForm" :loading="isLoading">保存</el-button>
        </div> -->
      </div>
      <div slot="footer">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="submitCodeInvitateForm" :loading="isLoading">保存</el-button>
      </div>
    </QcNavigationPage>
    <!-- 选择客户群 -->
    <com-dialog :config="colonyDialog.config" @closeDialog="closeColonyDialog">
      <div class="colony-dialog">
        <div class="query-table">
          <el-form label-width="80px" label-position="right" size="small" inline>
            <el-form-item label="群名称">
              <el-input placeholder="请输入群名称" v-model="colonyDialog.search.name" @input="searchColony"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="common-table-box">
          <el-table
            :data="colonyDialog.tableData"
            style="width: 100%"
            height="400"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          >
            <el-table-column label="群名称" align="center" prop="name"></el-table-column>
            <el-table-column label="群主" align="center" prop="ownerName"></el-table-column>
            <el-table-column label="群人数" align="center" prop="quantity"></el-table-column>
            <!-- <el-table-column label="今日加群人数" align="center" prop="todayIn"></el-table-column> -->
            <!-- <el-table-column label="今日退群人数" align="center" prop="todayOut"></el-table-column> -->
            <el-table-column label="创建时间" align="center" prop="createAtToTime"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.isSelected">已添加</div>
                <el-checkbox v-else v-model="scope.row.checked" @change="colonyCheckChange(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="common-pagination">
          <com-pagination
            :page="colonyDialog.page"
            @sizeChange="onSizeChange"
            @pageChange="onPageChange"
          ></com-pagination>
        </div>
        <div class="group-btn">
          <el-button @click="closeColonyDialog">取 消</el-button>
          <el-button type="primary" @click="onColonySubmit">确 定</el-button>
        </div>
      </div>
    </com-dialog>
    <!-- 选择成员 -->
    <department-dialog
      :config="departmentDialog.config"
      @closeDialog="departmentDialog.config.visible = false"
      :selectedList="selectedUsers"
      @handleConfirm="handleConfirm"
    >
    </department-dialog>
    <!-- 新增分组 -->
    <com-dialog :config="categoryAddDialog.config" @closeDialog="categoryAddDialog.config.visible = false">
      <div class="category-dialog">
        <el-form :model="categoryAddDialog.form" label-width="120px" :rules="categoryRules" ref="categoryAddForm">
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="categoryAddDialog.form.name" placeholder="请输入分组名称" clearable maxlength="12">
            </el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="seqNum">
            <el-input v-model="categoryAddDialog.form.seqNum" type="number"> </el-input>
          </el-form-item>
        </el-form>
        <div class="footer-btn">
          <el-button @click="categoryAddDialog.config.visible = false">取消</el-button>
          <el-button type="primary" @click="addCategory">确定</el-button>
        </div>
      </div>
    </com-dialog>
    <behavior-label
      :dialogVisible="behaviorDialogVisible"
      :fileList="updateBehaviorList"
      :type="behaviorLabelType"
      @closeDialog="behaviorDialogVisible = false"
      @reloadData="getBehaviorTagList"
    >
    </behavior-label>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack'
import ComDialog from '../../../components/common/ComDialog'
import ComPagination from '../../../components/common/ComPagination'
import UploadImage from '../../../components/components/UploadImage'
import DepartmentDialog from '../../../components/components/MemberTreeLinkageDialog'
import BehaviorLabel from '../../../components/components/BehaviorLabel'
export default {
  components: {
    GoBack,
    ComDialog,
    ComPagination,
    UploadImage,
    DepartmentDialog,
    BehaviorLabel
  },
  data() {
    return {
      form: {
        name: '', // 二维码名称
        message: '您好，扫描下方二维码进群交流 如有问题可随时交流', // 入群引导语
        behaviorTagList: [], // 行为标签
        groupChatList: [], // 群列表
        userList: [], // 成员列表
        type: 'chat_qrcode', // 类型，chat_qrcode：群二维码拉群；dynamic_qrcode：企微活码拉群；
        isSkipVerify: true, // 外部客户添加时是否无需验证
        groupId: '' // 已选择的分组
      },
      newTime: '', // 当前时刻
      departmentDialog: {
        // 选择成员弹窗
        config: {
          width: '800px',
          title: '添加成员',
          visible: false
        }
      },
      selectedUsers: [], // 已选择的成员
      selectedTags: [], // 已选的行为标签
      behaviorTagList: [], // 行为标签列表
      behaviorTagBoxHeight: 0, // 行为标签容器高度
      tagShowMoreFlag: false, // 是否显示展开/收起按钮
      colonyDialog: {
        // 客户群列表
        config: {
          width: '800px',
          title: '选择群聊',
          visible: false
        },
        tableData: [],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0
        },
        search: {
          name: ''
        },
      },
      selectedColony: [], // 已选择的群列表
      selectedRow: {}, // 群聊弹窗中选中的群
      colonySelectedType: 'add', // 添加群聊/修改群聊，add为新增、edit为修改
      colonyEditIndex: -1, // 需要编辑的群聊的索引
      isLoading: false,
      liveCodeList: [], // 企微活码列表
      categoryList: [], // 分组列表
      categoryAddDialog: {
        config: {
          width: '600px',
          title: '添加分组',
          visible: false
        },
        form: {
          name: '',
          seqNum: 0
        }
      },
      categoryRules: {
        name: [{ required: true, message: '请输入分组名称！', trigger: 'blur' }],
        seqNum: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
      },
      behaviorDialogVisible: false, // 行为标签弹窗
      updateBehaviorList: {}, // 需要修改、添加的分组
      behaviorLabelType: true // true创建，false修改
    }
  },
  created() {
    this.getBehaviorTagList()
    this.getNewTime()
    this.getCategoryList()
    if (this.$route.query.id) {
      this.getInvitationDetail(this.$route.query.id)
    }
  },
  methods: {
    getInvitationDetail(id) {
      this.$http.getCodeGroupInvitDetail({ id }).then((res) => {
        this.form = res.data.data
        let userList = []
        this.form.userList.forEach((item) => {
          let obj = {
            id: item.userId,
            name: item.userName
          }
          userList.push(obj)
        })
        this.selectedUsers = userList
        let tagList = []
        this.form.behaviorTagList.forEach((item) => {
          let obj = {
            id: item.tagId,
            name: item.tagName,
            groupId: item.tagGroupId
          }
          tagList.push(obj)
        })
        this.selectedTags = tagList
        if (this.form.type === 'chat_qrcode') {
          let colonyList = []
          this.form.groupChatList.forEach((item) => {
            let obj = {
              colonyInfo: {
                id: item.groupChatId,
                name: item.groupChatName,
                quantity: item.groupChatQuantity
              },
              qrCodeUrl: item.qrcode,
              toplimitQuantity: item.toplimitQuantity,
              fileList: [{ name: 'image', url: this.imgHost + item.qrcode }]
            }
            colonyList.push(obj)
          })
          this.selectedColony = colonyList
        } else {
          let codeList = []
          this.form.groupChatList.forEach((item) => {
            let obj = {
              qrCodeUrl: item.qrcode,
              toplimitQuantity: item.toplimitQuantity,
              fileList: [{ name: 'image', url: this.imgHost + item.qrcode }]
            }
            codeList.push(obj)
          })
          this.liveCodeList = codeList
        }
      })
    },
    getBehaviorTagList() {
      this.$http.getBehaviorPages().then((res) => {
        this.behaviorTagList = res.data.data
        this.$nextTick(() => {
          this.getBehaviorTagBoxHeight()
        })
      })
    },
    // 获取行为标签容器高度
    getBehaviorTagBoxHeight() {
      let height = this.$refs.behaviorTagList.offsetHeight
      this.behaviorTagBoxHeight = height
    },
    // 获取当前时间
    getNewTime() {
      this.newTime = ''
      const hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
      const mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      this.newTime = hh + ':' + mm
    },
    // 获取分组列表
    getCategoryList() {
      this.$http.getGroupInvitCategoryList().then((res) => {
        this.categoryList = res.data.data
        let obj = sessionStorage.getItem('CodeInvitateCategory')
        if (obj && obj != '{}') {
          this.form.groupId = JSON.parse(obj).id
        } else {
          if (this.categoryList.length > 0) {
            // 默认选中第一项
            this.form.groupId = this.categoryList[0].id
          }
        }
      })
    },
    // 新增分组
    showCategoryAddDialog() {
      this.categoryAddDialog.form.name = ''
      this.categoryAddDialog.form.seqNum = 0
      this.categoryAddDialog.config.visible = true
    },
    addCategory() {
      this.$refs.categoryAddForm.validate((valid) => {
        console.log('校验', valid)
        if (valid) {
          this.$http.addGroupInvitCategory(this.categoryAddDialog.form).then((res) => {
            this.$message.success('新建成功')
            this.categoryAddDialog.config.visible = false
            this.getCategoryList()
          })
        }
      })
    },
    // 获取选择的成员列表
    handleConfirm(list) {
      this.selectedUsers = list
      console.log('已选择的成员', list)
      this.departmentDialog.config.visible = false
    },
    // 添加成员
    addUsers() {
      this.departmentDialog.config.visible = true
    },
    // 判断当前标签是否被选中
    checkTagActive(obj) {
      let flag = this.selectedTags.some((item) => item.id === obj.id)
      if (flag) {
        return true
      } else {
        return false
      }
    },
    // 选择行为标签
    onTagSelect(obj, groupId) {
      // 当前已经选中则取消选择，否则选中当前项
      let flag = this.selectedTags.some((item) => item.id === obj.id)
      if (flag) {
        this.selectedTags.splice(
          this.selectedTags.findIndex((item) => item.id === obj.id),
          1
        )
      } else {
        let tag = {
          id: obj.id,
          name: obj.name,
          groupId: groupId
        }
        this.selectedTags.push(tag)
      }
    },
    // 添加标签组
    addTagGroup() {
      this.behaviorDialogVisible = true
      this.behaviorLabelType = true
    },
    // 编辑标签组
    updateBehaviorTag(idx) {
      this.behaviorDialogVisible = true
      this.behaviorLabelType = false
      this.updateBehaviorList = Object.assign({}, this.behaviorTagList[idx])
    },
    // 打开群聊弹窗
    showColonyDialog() {
      this.selectedRow = {}
      this.colonySelectedType = 'add'
      this.colonyEditIndex = -1
      this.colonyDialog.config.visible = true
      this.getColonyList()
    },
    // 关闭群聊弹窗
    closeColonyDialog() {
      this.colonyDialog.config.visible = false
    },
    // 获取当前选中的群聊
    onColonySubmit() {
      this.selectedRow.isSelected = true
      // 新增的群聊
      if (this.colonySelectedType === 'add') {
        let obj = {
          colonyInfo: this.selectedRow, // 群id
          qrCodeUrl: '', // 群二维码
          toplimitQuantity: 200 // 入群设置的上限人数
        }
        this.selectedColony.push(obj)
      } else {
        // 编辑的群聊
        let idx = this.colonyEditIndex
        this.selectedColony[idx].colonyInfo = this.selectedRow
      }
      this.colonyDialog.config.visible = false
      console.log('已选的群聊', this.selectedColony)
    },
    // 获取客户群列表
    getColonyList() {
      let params = {
        pageNum: this.colonyDialog.page.pageNum,
        pageSize: this.colonyDialog.page.pageSize,
        name: this.colonyDialog.search.name
      }
      this.$http.getCustomerColonyPage(params).then((res) => {
        this.colonyDialog.page.total = res.data.data.total
        let newList = res.data.data.list
        newList.forEach((item) => {
          item.checked = false
          item.isSelected = false
        })
        newList.forEach((obj) => {
          let flag = this.selectedColony.some((row) => row.colonyInfo.id === obj.id)
          if (flag) {
            obj.isSelected = true
          }
        })
        this.colonyDialog.tableData = newList
        console.log('已选', this.selectedColony, this.colonyDialog.tableData)
      })
    },
    // 选择群聊的项改变
    colonyCheckChange(row) {
      let checked = row.checked
      let list = [].concat(this.colonyDialog.tableData)
      list.forEach((item) => {
        item.checked = false
      })
      list.forEach((obj) => {
        if (obj.id === row.id) {
          obj.checked = checked
        }
      })
      this.colonyDialog.tableData = list
      this.selectedRow = row
      console.log('选择的群聊', row)
    },
    // 上传图片成功
    uploadImageSuccess(val, idx) {
      console.log('返回数据', val, idx)
      this.selectedColony[idx].qrCodeUrl = val.length == 0 ? '' : val[0].url
    },
    // 编辑已经选择的群聊
    editSelectedColony(idx) {
      this.selectedRow = {}
      this.colonySelectedType = 'edit'
      this.colonyEditIndex = idx
      this.colonyDialog.config.visible = true
      this.getColonyList()
    },
    // 删除已选择的群聊
    deleteSelectedColony(idx) {
      this.selectedColony.splice(idx, 1)
    },
    onSizeChange(val) {
      this.colonyDialog.page.pageSize = val
      this.colonyDialog.page.pageNum = 1
      this.getColonyList()
    },
    onPageChange(val) {
      this.colonyDialog.page.pageNum = val
      this.getColonyList()
    },
    searchColony() {
      this.colonyDialog.page.pageNum = 1
      this.getColonyList()
    },
    goBack() {
      this.$openNewPageBack()
    },
    // 提交自动建群表单
    submitCodeInvitateForm() {
      if (this.form.name === '') {
        this.$message.warning('请输入二维码名称')
        return
      }
      if (this.form.groupId === '') {
        this.$message.warning('请选择分组')
        return
      }
      if (this.selectedUsers.length <= 0) {
        this.$message.warning('请添加使用人员')
        return
      } else if (this.selectedUsers.length > 100) {
        this.$message.warning('最多只能添加100个使用人员')
        return
      } else {
        let users = []
        this.selectedUsers.forEach((item) => {
          let obj = {
            userId: item.id
          }
          users.push(obj)
        })
        this.form.userList = users
      }
      if (this.form.message === '') {
        this.$message.warning('请输入引导语')
        return
      }
      // 标签
      let tagList = []
      this.selectedTags.forEach((item) => {
        let obj = {
          tagId: item.id,
          tagGroupId: item.groupId
        }
        tagList.push(obj)
      })
      this.form.behaviorTagList = tagList
      // 群二维码拉群/企业活码拉群
      if (this.form.type === 'chat_qrcode') {
        if (this.selectedColony.length <= 0) {
          this.$message.warning('请选择群聊')
          return
        } else {
          // 校验添加的群聊是否上传了群二维码
          let isPass = false
          for (let i = 0; i < this.selectedColony.length; i++) {
            let item = this.selectedColony[i]
            if (item.qrCodeUrl === '') {
              this.$message.warning('请上传群聊二维码')
              isPass = false
              break
            } else {
              isPass = true
            }
          }
          if (!isPass) {
            return
          } else {
            let chatList = []
            this.selectedColony.forEach((item) => {
              let obj = {
                groupChatId: item.colonyInfo.id,
                qrcode: item.qrCodeUrl,
                toplimitQuantity: item.toplimitQuantity
              }
              chatList.push(obj)
            })
            this.form.groupChatList = chatList
          }
        }
      } else if (this.form.type === 'dynamic_qrcode') {
        if (this.liveCodeList.length <= 0) {
          this.$message.warning('请添加活码')
          return
        } else {
          // 校验添加的群活码是否上传了二维码
          let isPass = false
          for (let i = 0; i < this.liveCodeList.length; i++) {
            let item = this.liveCodeList[i]
            if (item.qrCodeUrl === '') {
              this.$message.warning('请上传群活码')
              isPass = false
              break
            } else {
              isPass = true
            }
          }
          if (!isPass) {
            return
          } else {
            let chatList = []
            this.liveCodeList.forEach((item) => {
              let obj = {
                groupChatId: '',
                qrcode: item.qrCodeUrl,
                toplimitQuantity: item.toplimitQuantity
              }
              chatList.push(obj)
            })
            this.form.groupChatList = chatList
          }
        }
      }
      console.log('提交的数据》》', this.form)
      this.isLoading = true
      if (this.form.id) {
        this.$http
          .updateCodeGroupInvit(this.form)
          .then(() => {
            this.isLoading = false
            this.$message.success('修改成功')
            this.$openNewPageBack()
          })
          .catch(() => {
            this.isLoading = false
          })
      } else {
        this.$http
          .addCodeGroupInvit(this.form)
          .then(() => {
            this.isLoading = false
            this.$message.success('新增成功')
            this.$openNewPageBack()
          })
          .catch(() => {
            this.isLoading = false
          })
      }
    },
    // 跳转到标签管理页
    goToCreate() {
      this.$router.push('/main/scrm/tag-library/enterprise/list')
    },
    // 添加群活码
    addLiveCode() {
      let obj = {
        qrCodeUrl: '', // 企微群活码
        toplimitQuantity: 1000 // 入群设置的上限人数
      }
      this.liveCodeList.push(obj)
    },
    // 上传企微活码
    uploadLiveCodeSuccess(val, idx) {
      this.liveCodeList[idx].qrCodeUrl = val.length == 0 ? '' : val[0].url
      console.log('上传图片返回', val, idx)
    },
    // 群聊-上移
    colonyMoveUp(idx) {
      // 在前一项插入该项
      this.selectedColony.splice(idx - 1, 0, this.selectedColony[idx])
      // 删除前一项
      this.selectedColony.splice(idx + 1, 1)
    },
    // 群聊-下移
    colonyMoveDown(idx) {
      // 在后一项插入该项
      this.selectedColony.splice(idx + 2, 0, this.selectedColony[idx])
      // 删除前一项
      this.selectedColony.splice(idx, 1)
    },
    codeMoveUp(idx) {
      this.liveCodeList.splice(idx - 1, 0, this.liveCodeList[idx])
      this.liveCodeList.splice(idx + 1, 1)
    },
    codeMoveDown(idx) {
      this.liveCodeList.splice(idx + 2, 0, this.liveCodeList[idx])
      this.liveCodeList.splice(idx, 1)
    },
    // 删除已添加的活码
    deleteLiveCode(idx) {
      this.liveCodeList.splice(idx, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.code-invitate-form {
  height: 100%;
}

.code-invitate-form ::v-deep .naviagetion-page {
  background: transparent !important;
  &__header {
    padding: 0;
  }
  &__body {
    padding: 20px 0;
  }
}

.container {
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  .module {
    max-width: 900px;
    .title {
      position: relative;
      padding: 10px 0;
      color: #606266;
      &::before {
        content: '';
        width: 6px;
        height: 20px;
        background-color: #294a7b;
        position: absolute;
        top: 0;
        bottom: 0;
        left: -20px;
        top: 8px;
      }
    }
    .type-setting {
      margin-top: 20px;
    }
    .content {
      margin: 20px 0;
      .base-form {
        margin-top: 20px;
        .verify-switch {
          display: flex;
          align-items: center;
          span {
            margin: 0 10px;
          }
        }
        .behavior-tag-box {
          padding: 50px 18px 30px 20px;
          background-color: #fbfbfb;
          position: relative;
          .tag-add-btn {
            position: absolute;
            top: 4px;
            right: 18px;
          }
        }
        .tag-list-wrapper {
          .tag-list {
            position: relative;
            height: 153px;
            overflow: hidden;
            &.show {
              height: auto;
              overflow: none;
            }
            .tag-list-box {
              .tag-group {
                display: flex;
                color: #606266;
                position: relative;
                margin-bottom: 10px;
                .group-title {
                  width: 72px;
                  margin-right: 20px;
                  text-align: left;
                  line-height: 30px;
                }
                .group-content {
                  flex: 1;
                  display: flex;
                  flex-wrap: wrap;
                  padding-right: 46px;
                  border-bottom: 1px solid #dcdfe6;
                  .tag-item {
                    cursor: pointer;
                    padding: 5px;
                    background-color: #fff;
                    border-radius: 4px;
                    height: 20px;
                    line-height: 20px;
                    margin: 0 10px 10px 0;
                  }
                  .active {
                    background-color: #294a7b;
                    color: #ffffff;
                  }
                }
                .group-edit {
                  position: absolute;
                  top: 0;
                  right: 0;
                }
              }
            }
          }
        }
        .tag-list-more {
          position: absolute;
          right: 10px;
          bottom: 0;
        }
      }
    }
    .setting-content {
      margin: 20px 0;
      display: flex;
      .group-setting {
        flex: 1;
        .normal-tips {
          font-size: 14px;
          margin-left: 120px;
          background-color: #effaff;
          color: #294a7b;
          padding: 8px 16px;
          border-radius: 4px;
          margin-bottom: 20px;
          line-height: 24px;
          .tips-cont {
            color: #606266;
          }
          .tips-check {
            cursor: pointer;
          }
        }
        .setting-tips {
          display: flex;
          background-color: #fdf6ec;
          color: #e6a23c;
          padding: 8px 16px;
          border-radius: 4px;
          margin-top: 20px;
          line-height: 24px;
          .tips-title {
            width: 50px;
          }
          .tips-content {
            flex: 1;
          }
        }
        .group-wrapper {
          display: flex;
          justify-content: space-between;
          .group-box {
            padding: 20px;
            background: #fbfbfb;
            border-radius: 2px;
            border: 1px solid #eee;
            font-size: 14px;
            flex: 1;
            .group-content {
              display: flex;
              line-height: 20px;
              align-items: center;
              .g-c-left {
                display: flex;
                padding: 10px;
                width: 250px;
                background: #ffffff;
                border: 1px solid #eee;
                .group-img {
                  width: 40px;
                  height: 40px;
                }
                .group-msg {
                  width: 200px;
                  margin-left: 10px;
                  .msg-name {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                  .msg-numb {
                    color: #999;
                  }
                }
              }
              .g-c-right {
                .right-icon {
                  background: #f0f0f0;
                  padding: 4px;
                  cursor: pointer;
                  margin-left: 10px;
                }
              }
            }
            .group-qrcode {
              margin-top: 20px;
            }
            .group-limit {
              margin-top: 20px;
            }
          }
          .operate-btns {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 10px;
            .top {
              cursor: pointer;
            }
            .bottom {
              display: flex;
              flex-direction: column;
            }
          }
        }
      }
      .preview-panel {
        width: 400px;
        text-align: center;
        .panel-title {
          font-size: 14px;
          color: #606266;
          margin-bottom: 20px;
          text-align: center;
        }
        .panel-content {
          position: relative;
          img {
            width: 270px;
            height: 535px;
          }
          .preview-content {
            height: 350px;
            width: 255px;
            top: 90px;
            left: 70px;
            position: absolute;
            overflow-y: auto;
            .p-cont-time {
              span {
                font-size: 12px;
                color: #606266;
              }
            }
            .p-cont-text {
              text-align: left;
              display: flex;
              .icon-user {
                text-align: center;
                background-color: #294a7b;
                width: 30px;
                height: 30px;
                color: #fff;
                border-radius: 5px;
                line-height: 30px;
                margin: 20px 0 0 20px;
              }
              .text-content {
                position: relative;
                margin: 20px 10px 0 10px;
                p {
                  user-select: none;
                  line-height: 15px;
                  letter-spacing: 1px;
                  width: 150px;
                  word-wrap: break-word;
                  border-radius: 5px;
                  padding: 10px;
                  background-color: #fff;
                  font-size: 12px;
                  color: #595959;
                }
              }
              .text-content::before {
                content: '';
                display: block;
                width: 0;
                height: 0;
                border: 8px solid #fff;
                border-top-color: transparent;
                border-left-color: transparent;
                border-bottom-color: transparent;
                position: absolute;
                top: 8px;
                left: -15px;
              }
              .img-content {
                width: 100px;
                height: 100px;
                margin: 20px 0 0 10px;
              }
            }
          }
        }
      }
    }
  }
}
.add-new {
  font-size: 14px;
  padding: 0 20px;
  height: 34px;
  line-height: 34px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  color: #294a7b;
}
.user-item {
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
.colony-dialog {
  .group-btn {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
  }
}
.f-btn-group {
  margin-left: 100px;
  margin-top: 50px;
}
.category-dialog {
  .footer-btn {
    display: flex;
    justify-content: flex-end;
  }
}
::v-deep .el-form-item .el-form-item {
  margin-bottom: 22px;
}
.preview-content::-webkit-scrollbar {
  width: 2px;
  height: 20px;
}
</style>
