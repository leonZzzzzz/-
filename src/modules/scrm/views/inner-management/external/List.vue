<template>
  <div class="external-div">
    <GoBack :title="'返回'"></GoBack>
    <div class="container">
      <div class="top_search">
        <div class="operating-btn">
          <el-button size="small" type="primary" @click="addExternal">新增批量设置</el-button>
        </div>
      </div>
      <div class="common-table-box">
        <el-table
          :data="tableData"
          width="100%"
          id="table"
          class="el-table"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          :height="height"
          @cell-mouse-enter="isOverflow"
        >
          <el-table-column label="类型名称" prop="name" align="center"></el-table-column>
          <el-table-column label="类型" align="center">
            <template slot-scope="scope">
              <div>
                <!-- {{ scope.row.type | isType }} -->
                <el-tag type="primary" v-if="scope.row.type == 0">文本</el-tag>
                <el-tag type="info" v-if="scope.row.type == 1" style="color: black">网页</el-tag>
                <el-tag type="warning" v-if="scope.row.type == 2">小程序</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="内容" align="center">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.type == 0">{{ scope.row.textValue }}</span>
                <span v-if="scope.row.type == 1">{{ scope.row.webTitle }}</span>
                <span v-if="scope.row.type == 2">{{ scope.row.programTitle }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="关联人员" class="special-column" align="center">
            <template slot-scope="scope">
              <div class="tagname-form">
                <span class="tagName" v-for="(item, index) in scope.row.userName" :key="index"
                  ><i class="el-icon-user-solid icon-user"></i>{{ item }}</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="text" v-if="scope.row.editable" @click="editExternal(scope.row)">修改</el-button>
                <el-tooltip
                  v-else
                  class="item"
                  effect="dark"
                  :content="`${scope.row.editTip}`"
                  placement="top-start"
                >
                  <el-button type="text" style="color: #ccc">修改</el-button>
                </el-tooltip>
                <el-button type="text" v-if="scope.row.editable" @click="deleteExternal(scope.row)">删除</el-button>
                <el-tooltip
                  v-else
                  class="item"
                  effect="dark"
                  :content="`${scope.row.editTip}`"
                  placement="top-start"
                >
                  <el-button type="text" style="color: #ccc">删除</el-button>
                </el-tooltip>
                <!-- <el-button type="text" @click="editExternal(scope.row)">修改</el-button>
                <el-button type="text" @click="deleteExternal(scope.row)">删除</el-button> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>

    <com-dialog :config="customerDialog.config" @closeDialog="closeCustomerDialog">
      <div class="customer-container">
        <div class="information-div">
          <div class="information-form">
            <el-form label-position="left" label-width="100px">
              <el-form-item label="类型名称:" :required="true">
                <el-input placeholder="请输入类型名称" maxlength="32" show-word-limit v-model="model.name"></el-input>
              </el-form-item>
              <el-form-item label="类型:" :required="true">
                <div class="information-type">
                  <el-radio-group v-model="model.type">
                    <el-radio :label="0">文本</el-radio>
                    <el-radio :label="1">网页</el-radio>
                    <el-radio :label="2">小程序</el-radio>
                  </el-radio-group>
                  <div class="type-text" v-if="model.type == 0">
                    <el-form label-position="left" label-width="80px">
                      <div class="type-text-textarea">
                        <el-form-item label="文本内容" :required="true">
                          <el-input
                            v-model="model.textValue"
                            max="32"
                            maxlength="32"
                            show-word-limit
                            id="textInput"
                            placeholder="请输入文本内容"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-form>
                  </div>
                  <div class="type-web" v-if="model.type == 1">
                    <el-form label-position="left" label-width="80px">
                      <el-form-item label="网页标题" :required="true">
                        <el-input v-model="model.webTitle" placeholder="请输入网页标题" maxlength="32" show-word-limit>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="网页链接" :required="true">
                        <el-input
                          type="textarea"
                          size="small"
                          :rows="4"
                          resize="none"
                          v-model="model.webUrl"
                          placeholder="请输入网页链接"
                          class="textarea-input"
                          maxlength="255"
                          show-word-limit
                        ></el-input>
                        <div>请填写点击后跳转的网页</div>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div class="type-progarm" v-if="model.type == 2">
                    <el-form>
                      <SelectProgramItem
                        ref="SelectProgramItem"
                        :programIdProps="model.programAppId"
                      ></SelectProgramItem>
                    </el-form>
                  </div>
                </div>
              </el-form-item>
              <el-form-item>
                <div class="tree-div">
                  <!-- <Tree></Tree> -->
                  <department-tree ref="department" :selectedList="memberList"> </department-tree>
                  <!-- <DepartmentTree :selectedList="selectedList" ref="department"></DepartmentTree> -->
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="customer-btn">
        <div class="customer-how">
          <el-button type="text" @click="configureWhatToAdd.visible = true">如何添加成员对外信息？</el-button>
        </div>
        <div>
          <el-button @click="closeNoticeDialog()">取消</el-button>
          <el-button type="primary" @click="sumbitNotice()">保存</el-button>
        </div>
      </div>
    </com-dialog>
    <com-dialog :config="editCustomerDialog.config" @closeDialog="closeEditCustomerDialog">
      <div class="customer-container">
        <div class="information-div">
          <div class="information-form">
            <el-form label-position="left" label-width="100px">
              <el-form-item label="类型名称:" :required="true">
                <el-input
                  placeholder="请输入类型名称"
                  maxlength="32"
                  show-word-limit
                  v-model="models.name"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="类型:" :required="true">
                <div class="information-type">
                  <el-radio-group v-model="models.type">
                    <el-radio disabled :label="0">文本</el-radio>
                    <el-radio disabled :label="1">网页</el-radio>
                    <el-radio disabled :label="2">小程序</el-radio>
                  </el-radio-group>
                  <div class="type-text" v-if="models.type == 0">
                    <el-form label-position="left" label-width="80px">
                      <div class="type-text-textarea">
                        <el-form-item label="文本内容" :required="true">
                          <el-input
                            v-model="models.textValue"
                            max="32"
                            maxlength="32"
                            show-word-limit
                            id="textInput"
                            placeholder="请输入文本内容"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-form>
                  </div>
                  <div class="type-web" v-if="models.type == 1">
                    <el-form label-position="left" label-width="80px">
                      <el-form-item label="网页标题" :required="true">
                        <el-input v-model="models.webTitle" placeholder="请输入网页标题" maxlength="32" show-word-limit>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="网页链接" :required="true">
                        <el-input
                          type="textarea"
                          size="small"
                          :rows="4"
                          resize="none"
                          v-model="models.webUrl"
                          placeholder="请输入网页链接"
                          class="textarea-input"
                          maxlength="255"
                          show-word-limit
                        ></el-input>
                        <div>请填写点击后跳转的网页</div>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div class="type-progarm" v-if="models.type == 2">
                    <el-form>
                      <el-form-item label="配置小程序">
                        <el-select placeholder="请选择" v-model="programIdProps.wxAppId" @change="getProgarmId">
                          <el-option
                            class="app-select"
                            v-for="(item, index) in options"
                            :key="index"
                            :label="item.name"
                            :value="item.wxAppId"
                          >
                          </el-option>
                        </el-select>
                        <el-button
                          style="margin-left: 5px"
                          icon="el-icon-plus"
                          @click="createButton"
                          circle
                          size="mini"
                        ></el-button>
                      </el-form-item>
                      <el-form-item label="" v-if="programIdProps.wxAppId">
                        <div class="programInfoBox">
                          <div class="programInfo">
                            <el-card shadow="hover" :body-style="{ padding: '10px' }">
                              <div class="programInfoContent">
                                <div class="logo">
                                  <el-avatar
                                    size="medium"
                                    :src="programInfoOption.logo ? imgHost + programInfoOption.logo : ''"
                                  ></el-avatar>
                                </div>
                                <div class="name">{{ programInfoOption.name }}</div>
                              </div>
                            </el-card>
                          </div>
                          <div class="updateBtn">
                            <el-button
                              style="margin-left: 5px"
                              icon="el-icon-edit"
                              @click="updateButton"
                              circle
                              size="mini"
                            ></el-button>
                          </div>
                        </div>
                      </el-form-item>
                      <!-- <SelectProgramItem
                        ref="editSelectProgramItem"
                        :programIdProps="models.programAppId"
                      ></SelectProgramItem> -->
                    </el-form>
                  </div>
                </div>
              </el-form-item>
              <el-form-item>
                <div class="tree-div">
                  <!-- <Tree></Tree> -->
                  <department-tree ref="editDepartment" :selectedList="editMemberList"> </department-tree>
                  <!-- <DepartmentTree :selectedList="selectedList" ref="department"></DepartmentTree> -->
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="customer-btn">
        <div class="customer-how">
          <el-button type="text" @click="configureWhatToAdd.visible = true">如何添加成员对外信息？</el-button>
        </div>
        <div>
          <el-button @click="closeEditNoticeDialog()">取消</el-button>
          <el-button type="primary" @click="sumbitEditNotice()">保存</el-button>
        </div>
      </div>
    </com-dialog>
    <HowToAdd :configure="configureWhatToAdd" @closeDialog="closeHowToAdd" @success="successHowToAdd"></HowToAdd>

    <!-- 新增小程序 -->
    <el-dialog
      :title="title"
      :visible.sync="programDialog"
      width="600px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :append-to-body="true"
      @close="close"
    >
      <el-form :model="programForm" label-position="right" label-width="auto" ref="programForm">
        <el-form-item
          label="小程序标题"
          :rules="[{ required: true, message: '请输入小程序标题', trigger: 'blur' }]"
          prop="name"
        >
          <el-input v-model="programForm.name" placeholder="请输入小程序标题"></el-input>
        </el-form-item>
        <el-form-item
          label="小程序ID"
          :rules="[{ required: true, message: '请输入小程序ID', trigger: 'blur' }]"
          prop="wxAppId"
        >
          <el-input v-model="programForm.wxAppId" placeholder="请输入小程序ID"></el-input>
        </el-form-item>
        <el-form-item
          label="小程序链接"
          :rules="[{ required: true, message: '请输入小程序链接', trigger: 'blur' }]"
          prop="page"
        >
          <el-input v-model="programForm.page" placeholder="请输入小程序链接"></el-input>
        </el-form-item>
        <el-form-item label="小程序封面" :required="true">
          <UploadImage @success="uploadImageSuccess" :fileList="fileList"></UploadImage>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button @click="programDialog = false">取消</el-button>
        <el-button type="primary" @click="programSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableList from '../../../components/components/TableList'
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
import SelectProgramItem from '../../../components/components/SelectProgramItem'
import GoBack from '../../../components/components/GoBack.vue'
import DepartmentTree from '../../../components/components/MemberTree'
import HowToAdd from '../../../components/components/HowToAdd'
import UploadImage from '../../../components/components/UploadImage.vue'
export default {
  components: { TableList, ComPagination, ComDialog, SelectProgramItem, GoBack, DepartmentTree, HowToAdd, UploadImage },

  data() {
    return {
      //选择后的小程序logo和名称
      //编辑小程序选择的
      programIdProps: {
        wxAppId: '',
        name: '',
        logo: ''
      },
      programForm: {
        name: '',
        wxAppId: '',
        page: '',
        logo: ''
      },
      fileList: [],
      title: '新建小程序',
      programInfoOption: {
        logo: '',
        name: ''
      },
      programDialog: false, //添加小程序弹窗
      tableData: [],
      selectedList: [],
      height: 400, //表格高度
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      //弹窗
      customerDialog: {
        config: {
          width: '800px',
          visible: false,
          title: '新增批量设置'
        }
      },
      editCustomerDialog: {
        config: {
          width: '800px',
          visible: false,
          title: '修改批量设置'
        }
      },
      configureWhatToAdd: {
        // 如何添加新成员
        title: '如何添加成员对外信息',
        visible: false
      },
      addedit: '',
      model: {
        userIdList: [],
        name: '',
        textValue: '',
        webUrl: '',
        webTitle: '',
        programAppId: '',
        programPagePath: '',
        programTitle: '',
        type: 0
      },
      models: {
        userIdList: [],
        name: '',
        textValue: '',
        webUrl: '',
        webTitle: '',
        programAppId: '',
        programPagePath: '',
        programTitle: '',
        type: 0
      },
      selectIdList: [],
      memberList: [],
      allUserList: [], //点击修改赋值包括的全部UserId
      editMemberList: [],
      updateImage: '',
      options: []
    }
  },
  methods: {
    //方法开始
    close() {
      this.fileList = []
      this.programForm = {
        name: '',
        wxAppId: '',
        page: '',
        logo: ''
      }
    },
    uploadImageSuccess(val) {
      this.updateImage = val.length == 0 ? '' : val[0].url
    },
    // 获取小程序列表
    getProgarm() {
      this.$http.getProgarm().then(res => {
        this.options = res.data.data
        this.options.forEach(item => {
          if (item.wxAppId == this.programIdProps.wxAppId) {
            this.programInfoOption = Object.assign({}, item)
          }
        })
      })
    },
    //获取小程序appId
    getProgarmId() {
      this.options.forEach(item => {
        if (item.wxAppId == this.programIdProps.wxAppId) {
          this.programInfoOption.name = item.name
          this.programInfoOption.logo = item.logo
          this.programInfoOption.wxAppId = item.wxAppId
          this.programInfoOption.page = item.page
        }
      })
    },
    //编辑小程序
    updateButton() {
      this.programDialog = true
      this.type = 'update'
      this.title = '修改小程序'
      this.options.forEach(item => {
        if (item.id == this.programId) {
          console.log('===>', item)
          this.programForm = item
          this.fileList = [
            {
              name: item.name,
              url: this.imgHost + item.logo
            }
          ]
        }
      })
    },
    //删除小程序
    deleteProgram() {
      this.$confirm('此操作将永久删除该小程序, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteProgarm({ id: this.programId }).then(res => {
            this.$message.success('删除小程序成功')
            this.programDialog = false
            this.getProgarm()
            this.programId = ''
            this.programForm = {
              name: '',
              wxAppId: '',
              logo: '',
              page: ''
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //点击新建按钮
    createButton() {
      this.programDialog = true
      this.type = 'create'
      this.title = '新建小程序'
    },
    //小程序添加确认按钮
    programSubmit() {
      this.$refs.programForm.validate(valid => {
        if (valid) {
          console.log(this.programForm)
          if (this.type == 'create') {
            this.$http.addProgarm(this.programForm).then(() => {
              this.$message.success('添加小程序成功')
              this.programDialog = false
              this.getProgarm()
              this.programForm = {
                name: '',
                wxAppId: '',
                logo: '',
                page: ''
              }
            })
            return
          }
          if (this.type == 'update') {
            this.$http.updateProgarm(this.programForm).then(() => {
              this.$message.success('修改小程序成功')
              this.programDialog = false
              this.getProgarm()
              this.getProgarmId()
              if (this.updateImage) {
                this.programInfoOption.logo = this.updateImage
              }
              this.programInfoOption.name = this.programForm.name
              this.programForm = {
                name: '',
                wxAppId: '',
                logo: '',
                page: ''
              }
            })
          }
        } else {
          return false
        }
      })
    },
    //关闭如何添加弹窗
    // 如何添加新成
    closeHowToAdd() {
      this.configureWhatToAdd.visible = false
    },
    //成功按钮
    successHowToAdd() {
      this.configureWhatToAdd.visible = false
    },
    //关闭修改弹窗按钮
    closeEditNoticeDialog() {
      this.editCustomerDialog.config.visible = false
    },
    sumbitEditNotice() {
      let flag = this.$refs.editDepartment.checkUserPermission()
      if (!flag) {
        return
      }
      this.editMemberList = this.$refs.editDepartment.selectedMenu
      console.log(this.editMemberList)
      this.models.userIdList = []
      if (this.editMemberList[0].myId == undefined) {
        this.editMemberList.forEach(item => {
          this.models.userIdList.push(item.id)
        })
      }
      if (this.editMemberList[0].myId != undefined) {
        this.editMemberList.forEach(item => {
          this.models.userIdList.push(item.id)
        })
      }
      if (this.models.userIdList.length == 0) {
        this.$message.warning('请选择成员')
        return
      }
      if (this.models.name == '') {
        this.$message.warning('请输入类型名称')
        return
      }
      if (this.models.type == 0) {
        if (this.models.textValue == '') {
          this.$message.warning('文本内容不能为空')
          return
        }
        this.models.webTitle = ''
        this.models.webUrl = ''
        this.models.programAppId = ''
        this.models.programPagePath = ''
        this.models.programTitle = ''
        console.log(this.models)
        this.updateEditUserExternal()
      }
      if (this.models.type == 1) {
        if (this.models.webTitle == '') {
          this.$message.warning('网页名称不能为空')
          return
        }
        if (this.models.webUrl == '') {
          this.$message.warning('网页链接不能为空')
          return
        }
        if (this.models.webUrl != '') {
          // var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
          var reg = /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?$/
          if (!reg.test(this.models.webUrl)) {
            this.$message.warning('请输入正确的网页链接')
            return
          }
        }
        this.models.textValue = ''
        this.models.programAppId = ''
        this.models.programPagePath = ''
        this.models.programTitle = ''
        console.log(this.models)
        this.updateEditUserExternal()
      }
      if (this.models.type == 2) {
        if (
          this.programInfoOption.wxAppId == undefined ||
          this.programInfoOption.logo == undefined ||
          this.programInfoOption.name == undefined
        ) {
          this.updateEditUserExternal()
          return
        } else {
          this.models.programAppId = this.programInfoOption.wxAppId
          this.models.programPagePath = this.programInfoOption.page
          this.models.programTitle = this.programInfoOption.name
          this.models.textValue = ''
          this.models.webTitle = ''
          this.models.webUrl = ''
          this.updateEditUserExternal()
        }
      }
    },
    closeEditCustomerDialog() {
      this.editCustomerDialog.config.visible = false
    },
    getMembers() {
      // if (params) {
      // this.editMemberList = params
      this.$nextTick(() => {
        this.$refs.editDepartment.setCheckedNodes()
      })
      // }
    },
    //方法部分开始
    //弹窗关闭按钮
    closeCustomerDialog() {
      this.customerDialog.config.visible = false
    },
    //取消按钮
    closeNoticeDialog() {
      this.customerDialog.config.visible = false
    },
    //保存按钮
    sumbitNotice() {
      this.memberList = this.$refs.department.selectedMenu
      this.model.userIdList = []
      this.memberList.forEach(item => {
        this.model.userIdList.push(item.id)
      })
      if (this.selectedList.length != 0) {
        this.selectedList.forEach(item => {
          this.model.userIdList.push(item.id)
        })
      }
      if (this.model.userIdList.length == 0) {
        this.$message.warning('请选择成员')
        return
      }
      if (this.model.name == '') {
        this.$message.warning('请输入类型名称')
        return
      }
      if (this.model.type == 0) {
        if (this.model.textValue == '') {
          this.$message.warning('文本内容不能为空')
          return
        }
        this.model.webTitle = ''
        this.model.webUrl = ''
        this.model.programAppId = ''
        this.model.programPagePath = ''
        this.model.programTitle = ''
        this.updateUserExternalAttr()
      }
      if (this.model.type == 1) {
        if (this.model.webTitle == '') {
          this.$message.warning('网页名称不能为空')
          return
        }
        if (this.model.webUrl == '') {
          this.$message.warning('网页链接不能为空')
          return
        }
        if (this.model.webUrl != '') {
          // var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
          var reg = /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?$/
          if (!reg.test(this.model.webUrl)) {
            this.$message.warning('请输入正确的网页链接')
            return
          }
        }
        this.model.textValue = ''
        this.model.programAppId = ''
        this.model.programPagePath = ''
        this.model.programTitle = ''
        this.updateUserExternalAttr()
      }
      if (this.model.type == 2) {
        let program = this.$refs.SelectProgramItem.success()
        if (program.wxAppId == undefined || program.page == undefined || program.name == undefined) {
          this.$message.warning('请选择小程序')
          return
        } else {
          this.model.programAppId = program.wxAppId
          this.model.programPagePath = program.page
          this.model.programTitle = program.name
          this.model.textValue = ''
          this.model.webTitle = ''
          this.model.webUrl = ''
          this.updateUserExternalAttr()
        }
      }
    },

    //点击新建类型按钮
    addExternal() {
      this.customerDialog.config.visible = true
      console.log(this.memberList)
      // setTimeout(() => {
      this.$nextTick(() => {
        this.$refs.department.setCheckedNodes()
        this.$refs.department.clearFilterText()
      })
      // }, 100)
    },
    isOverflow(row, column, cell, event) {
      // console.log(row);
      if (column.label == '成员') {
        // console.log(cell)
      }
    },
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.height =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT
    },
    //如果溢出
    changeCellStyle(row) {
      if (row.column.label === '关联人员') {
        return 'overflow:hidden; text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2;  ' // 修改的样式
      } else {
        return ''
      }
    },
    //分页的方法
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getUserExternalPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getUserExternalPage()
    },
    //修改的方法
    editExternal(row) {
      if (row.type == 2) {
        this.getProgarm()
      }
      this.allUserList = []
      this.editCustomerDialog.config.visible = true
      let model = {}
      model = Object.assign({}, row)
      model.userId = model.userId.split(';')
      for (var i = 0; i < model.userId.length; i++) {
        this.allUserList.push({ id: model.userId[i], name: model.userName[i] })
      }
      setTimeout(() => {
        this.editMemberList = this.allUserList
        this.getMembers()
      }, 200)
      this.models.name = row.name
      this.models.type = row.type
      if (row.type == 0) {
        this.models.textValue = row.textValue
      }
      if (row.type == 1) {
        this.models.webUrl = row.webUrl
        this.models.webTitle = row.webTitle
      }
      if (row.type == 2) {
        this.models.programAppId = row.programAppId
        this.models.programPagePath = row.programPagePath
        this.models.programTitle = row.programTitle
      }
    },
    //删除的方法
    deleteExternal(row) {
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          name: row.name,
          type: row.type,
          userIdList: null,
          textValue: null,
          webUrl: null,
          webTitle: null,
          programAppId: null,
          programPagePath: null,
          programTitle: null
        }
        this.$http.deteleExternal(params).then(() => {
          this.customerDialog.config.visible = false
          this.$message.success('删除成功')
          this.getUserExternalPage()
        })
      })
    },
    //方法部分结束
    //接口部分开始
    updateUserExternalAttr() {
      this.$http.updateUserExternalAttr(this.model).then(() => {
        this.customerDialog.config.visible = false
        this.$message.success('保存成功')
        this.model = {
          userIdList: [],
          name: '',
          textValue: '',
          webUrl: '',
          webTitle: '',
          programAppId: '',
          programPagePath: '',
          programTitle: '',
          type: 0
        }
        this.memberList = []
        // setTimeout(() => {
        //   this.$nextTick(() => {
        //     this.memberList = []
        //     console.log(this.memberList)
        //     this.memberList = this.$refs.department.selectedMenu
        //   })
        // }, 100)
        this.getUserExternalPage()

        // sessionStorage.removeItem('idList')
      }).catch((res) => {

      })
    },
    updateEditUserExternal() {
      this.$http.updateUserExternalAttr(this.models).then(() => {
        this.editCustomerDialog.config.visible = false
        this.$message.success('保存成功')
        this.models = {
          userIdList: [],
          name: '',
          textValue: '',
          webUrl: '',
          webTitle: '',
          programAppId: '',
          programPagePath: '',
          programTitle: '',
          type: 0
        }
        this.getUserExternalPage()
      })
    },
    getUserExternal() {
      // this.model = row
      // console.log(this.model)
      // this.$http.getUserExternal(params).then(res => {
      //   let data = res.data.data
      //   this.models.name = data.name
      //   this.models.type = data.type
      //   if (this.models.type == 0) {
      //     this.models.textValue = data.textValue
      //   }
      //   if (this.models.type == 1) {
      //     this.models.webTitle = data.webTitle
      //     this.models.webUrl = data.webUrl
      //   }
      //   if (this.models.type == 2) {
      //     this.models.programAppId = data.programAppId
      //     this.models.programPagePath = data.programPagePath
      //     this.models.programTitle = data.programTitle
      //   }
      // })
    },
    getUserExternalPage() {
      let params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum
      }
      let userName = []
      this.tableData = []
      this.$http.getUserExternalPage(params).then(res => {
        res.data.data.forEach(item => {
          if (item.userName != '') {
            userName = item.userName.split(';')
          }
          // if (item.textValue == undefined) {
          //   item.textValue = ''
          //   item.webTitle = ''
          //   item.webUrl = ''
          // }

          this.tableData.push({
            name: item.name,
            userName: userName,
            type: item.type,
            created: item.created,
            userId: item.userId,
            programAppId: item.programAppId,
            programPagePath: item.programPagePath,
            programTitle: item.programTitle,
            textValue: item.textValue,
            webTitle: item.webTitle,
            webUrl: item.webUrl,
            editable: item.editable,
            editTip: item.editTip,
          })
        })
        this.page.total = res.data.data.length
        // console.log(this.page.total)
      })
      console.log(this.tableData)
      // this.page.total = this.tableData.length
    }
    //接口部分结束
  },
  created() {
    this.getUserExternalPage()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  },
  filters: {
    isType(type) {
      if (type == 0) {
        return '文本'
      }
      if (type == 1) {
        return '网页'
      }
      if (type == 2) {
        return '小程序'
      }
    },
    isHttp(option) {
      if (option != '') {
        return option
      }
      if (option == '') return this.imgHost + this.programInfoOption.logo
    },
    isHave(option) {
      if (option == undefined) {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.external-div {
  width: 100%;
  height: 100%;
  position: relative;
  .container {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .top_search {
      padding: 20px;
      display: flex;
      .search {
        margin-left: auto;
        &::v-deep .el-form-item {
          margin-bottom: 0;
        }
      }
    }
    .common-table-box {
      padding: 0 20px;
      box-sizing: border-box;
      .tagList {
        span {
          display: inline-block;
          padding: 2px 5px;
          margin: 5px;
          border: 1px solid #f2f2f2;
          border-radius: 3px;
          background-color: #f2f2f2;
        }
      }
    }
    .common-pagination {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
}
.customer-container {
  &::-webkit-scrollbar {
    width: 5px;
  }
  .information-form {
    padding: 0 20px;
    .el-form {
      .el-form-item {
        .information-tag {
          width: 85%;
          // border: 1px solid red;
          display: inline-block;
          .information-tagdiv {
            .tagName {
              display: inline-block;
              border: 1px solid #546e95;
              padding: 0 5px;
              margin: 0px 8px 7px 0;
              border-radius: 3px;
              height: 28px;
              line-height: 28px;
              color: #546e95;
              i {
                color: #546e95;
              }
            }
          }
        }
        .information-type {
          .type-text {
            border: 1px solid #dcdfe6;
            border-radius: 3px;
            background-color: #f5f5f5;
            padding: 10px;
            .el-form {
              .el-form-item {
                margin: 10px 0;
              }
            }
          }
          .type-web {
            border: 1px solid #dcdfe6;
            border-radius: 3px;
            background-color: #f5f5f5;
            padding: 10px;
            // margin-left: 50px;
            .el-form {
              .el-form-item {
                margin: 10px 0;
              }
            }
          }
          .type-progarm {
            border: 1px solid #dcdfe6;
            border-radius: 3px;
            background-color: #f5f5f5;
            padding: 10px;
            // margin-left: 50px;
          }
        }
      }
      .el-button:nth-child(1) {
        margin-left: 50px;
      }
    }
  }
}
.customer-btn {
  display: flex;
  justify-content: space-between;
  .customer-how {
    margin-left: 20px;
  }
}

.tagname-form {
  min-height: 60px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  .tagName {
    display: inline-block;
    border: 1px solid #dcdfe6;
    padding: 2px 5px;
    cursor: pointer;
    margin: 8px 8px 7px 0;
    margin-right: 8px;
    margin-bottom: 7px;
    border-radius: 3px;
  }
  .icon-user {
    color: #294a7b;
  }
}
::v-deep .special-column {
  width: 200px;
}
.tree-div {
  border: 1px solid rgb(231, 231, 231);
  // border-left: 1px solid rgb(231, 231, 231);
  // border-bottom: 1px solid rgb(231, 231, 231);
  padding: 5px;
  // border: 1px solid red;
  // height: 450px;
  // overflow: auto;
  // margin-top: 5px;
  &::-webkit-scrollbar {
    width: 2px;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.programInfoBox {
  margin-top: 10px;
  margin-left: 82px;
  display: flex;
  .updateBtn {
    display: flex;
    align-items: center;
  }
}
.programInfo {
  width: 217px;
  .programInfoContent {
    height: 36px;
    display: flex;
    .name {
      margin-left: 5px;
      line-height: 36px;
      color: #606266;
      font-size: 14px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
    .deleteBtn {
      width: 42px;
      margin-left: auto;
      padding-left: 5px;
      display: none;
    }
    &:hover {
      .deleteBtn {
        display: block;
      }
    }
  }
}
.textarea-input {
  ::v-deep .el-textarea__inner {
    padding-right: 20px;
  }
  ::v-deep .el-input__count {
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
</style>
