<template>
  <div class="tag-invitate-form">
    <!-- <go-back title="标签建群"></go-back> -->
    <QcNavigationPage class="prodocu-page" content="标签建群"  full :footerBlockH="20">
      <div class="container">
        <div class="c-tips">
          <el-alert
            title="每位客户每周最多收到来自客户群发管理员的1条群发消息，如选择的客户本周已收到过群发消息本条邀请将不会成功发送"
            type="warning"
            show-icon
            :closable="false"
          >
          </el-alert>
        </div>
        <div class="module">
          <div class="title">基础信息</div>
          <div class="content">
            <div class="base-form">
              <el-form label-width="100px" label-position="left">
                <el-form-item label="任务名称" :rules="[{ required: true, message: '该字段不能为空' }]">
                  <el-input placeholder="请填写任务名称" v-model="form.name" maxlength="32" show-word-limit> </el-input>
                </el-form-item>
                <el-form-item label="群发成员" :required="true">
                  <div class="user-item" v-if="selectedUsers.length != 0">
                    <span class="user-item-content" v-for="(item, index) in selectedUsers" :key="index">
                      <i class="item-icon el-icon-s-custom"></i>
                      {{ item.name }}
                    </span>
                  </div>
                  <el-button icon="el-icon-plus" plain size="small" @click="addUsers">添加</el-button>
                </el-form-item>
                <el-form-item label="筛选客户" :required="true">
                  <!-- <el-radio-group>
                    <el-radio>筛选客户</el-radio>
                    <el-radio>全部客户</el-radio>
                  </el-radio-group> -->
                  <div class="switch-box">
                    <el-switch v-model="form.isFiltered" active-color="#294a7b"> </el-switch>
                  </div>
                  <div class="select-customer" v-if="form.isFiltered">
                    <div class="select-box">
                      <el-form label-width="80px">
                        <el-form-item label="性别">
                          <el-radio-group v-model="form.gender">
                            <el-radio :label="10">全部</el-radio>
                            <el-radio :label="1">男性</el-radio>
                            <el-radio :label="2">女性</el-radio>
                            <el-radio :label="0">未知性别</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item label="添加时间">
                          <el-date-picker
                            v-model="dateTimeRange"
                            size="mini"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            clearable
                            @change="dateChange"
                          >
                          </el-date-picker>
                        </el-form-item>
                        <!-- <el-form-item label="行为标签">
                          <div class="none-tag" v-if="behaviorTagList.length == 0">
                            暂无创建的行为标签，<el-button type="text" @click="goToCreate">请先前往创建&nbsp;&gt;</el-button>
                          </div>
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
                        </el-form-item> -->
                        <el-form-item label="行为标签">
                          <div class="behavior-tag-box">
                            <div class="tag-add-btn">
                              <el-button icon="el-icon-plus" plain size="mini" circle @click="addTagGroup"> </el-button>
                            </div>
                            <div class="none-tag" style="text-align: center" v-if="behaviorTagList.length == 0">
                              暂无创建的行为标签，<el-button type="text" @click="goToCreate"
                                >请先前往创建&nbsp;&gt;</el-button
                              >
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
                            <div class="tag-list-more" v-if="behaviorTagBoxHeight > 110">
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
                  <div class="select-total">
                    <el-alert type="warning" :closable="false">
                      <div slot="title">
                        查看该消息预计送达人数： <span class="check" @click="showCustomerDialog">点击查看</span>
                      </div>
                    </el-alert>
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
              <el-form label-width="100px" label-position="left">
                <el-form-item label="入群引导语" :required="true">
                  <div class="setting-input-box">
                    <el-input
                      placeholder="回复内容不能超过1300个字"
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
                  <div class="setting-tips">
                    <div class="tips-title">提示：</div>
                    <div class="tips-content">
                      <p>
                        1、群人数上限为200人，超过200人时请 【添加多个群聊】，否则可能会导致部分用户
                        【无法入群】，添加多个群聊时，客户只会收到一条群发邀请
                      </p>
                      <p>2、上传群二维码时请【仔细核对】，群二维码和群聊【对应错误】将导致【数据异常】</p>
                      <p>3、如果客户添加了多个客服，只会收到一位客服的入群邀请</p>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item
                  v-for="(item, index) in selectedColony"
                  :key="index"
                  :label="'群聊' + (index + 1)"
                  :required="true"
                >
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
                        :multiple="false"
                        tips="上传群二维码"
                        @success="(val) => uploadImageSuccess(val, index)"
                      ></upload-image>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="群聊" :required="true">
                  <el-button size="mini" icon="el-icon-plus" @click="showColonyDialog">选择群聊</el-button>
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
                  <div class="p-cont-text" v-if="defaultCode != ''">
                    <i class="el-icon-user-solid icon-user"></i>
                    <div>
                      <img class="img-content" :src="imgHost + defaultCode" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="module">
          <div class="title">其他设置</div>
          <div class="other-setting">
            <el-form label-width="100px" label-position="left">
              <el-form-item label="过滤客户">
                <div class="switch-box" style="display: flex; align-items: center">
                  <el-switch v-model="form.isExcludeExistingCustomer" active-color="#294a7b"> </el-switch>
                  <el-alert
                    title="开启后已在群聊中的客户将不会收到邀请"
                    type="warning"
                    show-icon
                    :closable="false"
                    style="line-height: 20px; width: 400px; margin-left: 10px"
                  >
                  </el-alert>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- <div class="f-btn-group">
          <el-button @click="goBack">取消</el-button>
          <el-button type="primary" @click="submitTagInvitateForm" :loading="isLoading">保存</el-button>
        </div> -->
      </div>
      <div slot="footer">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="submitTagInvitateForm" :loading="isLoading">保存</el-button>
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
            <el-table-column label="选择" align="center">
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
    <!-- 筛选的客户列表 -->
    <com-dialog :config="customerDialog.config" @closeDialog="closeCustomerDialog">
      <div class="customer-dialog">
        <div class="common-table-box">
          <el-table :data="customerDialog.tableData" :header-cell-style="{ 'text-align': 'center' }" height="400px">
            <el-table-column label="姓名" align="center" prop="name"></el-table-column>
            <el-table-column label="头像" align="center">
              <template slot-scope="scope">
                <el-image style="width: 50px; height: 50px" :src="scope.row.avatar" fit="fill"></el-image>
              </template>
            </el-table-column>
            <el-table-column label="性别" align="center">
              <template slot-scope="scope">
                <div>{{ scope.row.gender | formatGender }}</div>
              </template>
            </el-table-column>
            <el-table-column label="手机" align="center" prop="mobile"></el-table-column>
            <!-- <el-table-column label="创建时间" align="center"></el-table-column> -->
            <!-- <el-table-column label="更新时间" align="center"></el-table-column> -->
          </el-table>
        </div>
        <div class="common-pagination">
          <com-pagination
            :page="customerDialog.page"
            @sizeChange="onCustSizeChange"
            @pageChange="onCustPageChange"
          ></com-pagination>
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
        name: '', // 任务名称
        message: '', // 入群引导语
        isFiltered: true, // 是否需要筛选客户
        isExcludeExistingCustomer: true, // 是否过滤客户（开启后已在群聊中的客户将不会收到邀请）
        gender: 10, // 性别。 0-未知 1-男性 2-女性 10-全部
        customerStartDate: null, // 客户开始添加日期
        customerEndDate: null, // 客户结束添加日期
        behaviorTagList: [], // 行为标签
        groupChatList: [], // 群列表
        userList: [] // 成员列表
      },
      dateTimeRange: '', // 时间范围
      selectedTags: [], // 已选的行为标签
      behaviorTagList: [], // 行为标签列表
      behaviorTagBoxHeight: 0, // 行为标签容器高度
      tagShowMoreFlag: false, // 是否显示展开/收起按钮
      newTime: '', // 当前时刻
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
      departmentDialog: {
        // 选择成员弹窗
        config: {
          width: '800px',
          title: '选择群发成员',
          visible: false
        }
      },
      selectedUsers: [], // 已选择的成员
      isLoading: false,
      customerDialog: {
        config: {
          width: '800px',
          title: '预计发送的客户列表',
          visible: false
        },
        tableData: [],
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0
        }
      },
      defaultCode: '', // 客户收到的消息，默认显示第一条数据的群二维码
      behaviorDialogVisible: false, // 行为标签弹窗
      updateBehaviorList: {}, // 需要修改、添加的分组
      behaviorLabelType: true // true创建，false修改
    }
  },
  filters: {
    formatGender(val) {
      switch (val) {
        case 0:
          return '未知'
        case 1:
          return '男'
        case 2:
          return '女'
      }
    }
  },
  created() {
    this.getBehaviorTagList()
    this.getNewTime()
  },
  methods: {
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
    dateChange() {
      if (this.dateTimeRange) {
        this.form.customerStartDate = this.dateTimeRange[0]
        this.form.customerEndDate = this.dateTimeRange[1]
        console.log('开始日期', this.dateTimeRange[0], this.dateTimeRange[1])
      }
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
    // 打开群聊弹窗-添加群聊
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
          colonyInfo: this.selectedRow,
          qrCodeUrl: ''
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
        // let newList = [].concat(this.colonyDialog.tableData)
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
      console.log('返回值', row.checked)
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
    },
    // 上传图片成功
    uploadImageSuccess(val, idx) {
      this.selectedColony[idx].qrCodeUrl = val.length == 0 ? '' : val[0].url
      if (val.length == 0 && idx == 0) {
        this.defaultCode = ''
      } else {
        this.defaultCode = this.selectedColony[0].qrCodeUrl
      }
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
      if (this.selectedColony.length > 0) {
        this.defaultCode = this.selectedColony[0].qrCodeUrl
        console.log('返回', this.defaultCode)
      } else {
        this.defaultCode = ''
      }
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
    goBack() {
      this.$openNewPageBack()
    },
    // 提交标签建群表单
    submitTagInvitateForm() {
      if (this.form.name === '') {
        this.$message.warning('请输入任务名称')
        return
      }
      if (this.selectedUsers.length <= 0) {
        this.$message.warning('请添加群发成员')
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
      // 开启筛选客户提交筛选条件，否则筛选条件全部设为空值
      if (this.form.isFiltered) {
        console.log('添加的时间', this.dateTimeRange)
        // if (this.dateTimeRange) {
        //   this.form.customerStartDate = this.dateTimeRange[0]
        //   this.form.customerEndDate = this.dateTimeRange[1]
        // }
        if (this.selectedTags.length <= 0) {
          this.form.behaviorTagList = null
        } else {
          let tagList = []
          this.selectedTags.forEach((item) => {
            let obj = {
              tagId: item.id,
              tagGroupId: item.groupId
            }
            tagList.push(obj)
          })
          this.form.behaviorTagList = tagList
        }
        if (this.form.gender === 10) {
          // 当性别的值为10的时候，提交数据改为空值
          this.form.gender = null
        }
      } else {
        this.form.gender = null
        this.form.customerStartDate = null
        this.form.customerEndDate = null
        this.form.behaviorTagList = null
      }
      if (this.form.message === '') {
        this.$message.warning('请输入引导语')
        return
      }
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
              qrcode: item.qrCodeUrl
            }
            chatList.push(obj)
          })
          this.form.groupChatList = chatList
        }
      }
      console.log('提交的数据》》', this.form)
      this.isLoading = true
      this.$http.addGroupInvitation(this.form).then(() => {
        this.$message.success('新增成功')
        this.$openNewPageBack()
      })
    },
    // 跳转到标签管理页
    goToCreate() {
      this.$router.push('/main/scrm/tag-library/enterprise/list')
    },
    // 关闭客户列表弹窗
    closeCustomerDialog() {
      this.customerDialog.config.visible = false
    },
    // 打开客户列表弹窗
    showCustomerDialog() {
      if (this.selectedUsers.length <= 0) {
        this.$message.warning('请选择成员')
        return
      }
      this.customerDialog.page.pageSize = 15
      this.customerDialog.page.pageNum = 1
      this.customerDialog.page.total = 0
      this.getCustomerPage()
      this.customerDialog.config.visible = true
    },
    // 查找成员下的客户列表
    getCustomerPage() {
      let gender = ''
      let startCreateDate = ''
      let endCreateDate = ''
      let userId = ''
      let behaviorTagId = ''
      if (this.form.isFiltered) {
        if (this.form.gender === 10) {
          gender = ''
        } else {
          gender = this.form.gender
        }
        startCreateDate = this.form.customerStartDate
        endCreateDate = this.form.customerEndDate
        let tagList = []
        this.selectedTags.forEach((item) => {
          tagList.push(item.id)
        })
        behaviorTagId = tagList.join('_')
      }
      let userList = []
      this.selectedUsers.forEach((item) => {
        userList.push(item.id)
      })
      userId = userList.join('_')
      let params = {
        pageSize: this.customerDialog.page.pageSize,
        pageNum: this.customerDialog.page.pageNum,
        gender: gender,
        userId: userId,
        behaviorTagId: behaviorTagId
      }
      this.$http.getInvitationCustByUser(params).then((res) => {
        this.customerDialog.tableData = res.data.data.list
        this.customerDialog.page.total = res.data.data.total
      })
    },
    onCustSizeChange(val) {
      this.customerDialog.page.pageSize = val
      this.customerDialog.page.pageNum = 1
      this.getCustomerPage()
    },
    onCustPageChange(val) {
      this.customerDialog.page.pageNum = val
      this.getCustomerPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-invitate-form {
  height: 100%;
}

.tag-invitate-form ::v-deep .naviagetion-page {
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
  .c-tips {
    max-width: 900px;
    line-height: 30px;
    margin-bottom: 20px;
  }
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
    .content {
      margin: 20px 0;
      .base-form {
        margin-top: 20px;
        .select-customer {
          margin-top: 20px;
          .select-box {
            padding: 20px;
            background: #fbfbfb;
            border-radius: 2px;
            border: 1px solid #eee;
            font-size: 14px;
            .behavior-tag-box {
              padding: 50px 0 30px 0;
              position: relative;
              .tag-add-btn {
                position: absolute;
                top: 4px;
                right: 0;
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
              right: 0;
              bottom: 0;
            }
          }
        }
        .select-total {
          margin-top: 20px;
          .check {
            color: #294a7b;
            cursor: pointer;
          }
        }
      }
    }
    .setting-content {
      margin: 20px 0;
      display: flex;
      .group-setting {
        flex: 1;
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
        .group-box {
          padding: 20px;
          background: #fbfbfb;
          border-radius: 2px;
          border: 1px solid #eee;
          font-size: 14px;
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
::v-deep .el-form-item .el-form-item {
  margin-bottom: 22px;
}
.preview-content::-webkit-scrollbar {
  width: 2px;
  height: 20px;
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
</style>
