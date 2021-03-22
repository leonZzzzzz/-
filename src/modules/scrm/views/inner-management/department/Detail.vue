<template>
  <div class="department-div">
    <GoBack :title="'返回'"></GoBack>
    <div class="department-div-top">
      <div class="department-thmub-text">
        <div class="thmub">
          <img :src="customerData.avatar" />
        </div>
        <div class="text">
          <div>{{ customerData.name }}</div>
        </div>
      </div>
      <div class="title-bar">基础信息</div>
      <div class="department-div-container">
        <ul>
          <li>
            <span class="name">手机号：</span>
            <span class="value">{{ customerData.mobile || '--' }}</span>
          </li>
          <li>
            <span class="name">职务：</span>
            <span class="value">{{ customerData.position || '--' }}</span>
          </li>
          <li>
            <span class="name">邮箱：</span>
            <span class="value">{{ customerData.email || '--' }}</span>
          </li>
          <li>
            <span class="name">性别：</span>
            <span class="value">{{ customerData.gender | isGender }}</span>
          </li>
        </ul>
      </div>
      <div class="title-bar">对外信息</div>
      <div class="department-exter-container">
        <ul v-if="total != 0">
          <li v-for="(item, index) in customerData.userExternalAttrList" :key="index">
            <span class="name">{{ item.name }}：</span>
            <span class="value">
              <span style="color: black" v-if="item.type == 0">{{ item.textValue || '未设置' }}</span>
              <span style="color: black" v-if="item.type == 1">{{ item.webTitle || '未设置' }}</span>
              <span style="color: black" v-if="item.type == 2">{{ item.programTitle || '未设置' }}</span>
              <el-tag type="primary" v-if="item.type == 0" size="small" style="margin-left: 5px">文本</el-tag>
              <el-tag type="info" v-if="item.type == 1" style="color: rgb(53, 51, 51); margin-left: 5px" size="small"
                >网页</el-tag
              >
              <el-tag type="warning" v-if="item.type == 2" size="small" style="margin-left: 5px">小程序</el-tag>
            </span>
            <!-- <el-button type="text" @click="editDetail(item)">修改</el-button>
            <el-button type="text" v-if="item.id" @click="deleteRow(item)">解除关联</el-button> -->
            <el-button type="text" v-if="item.editable" @click="editDetail(item)">修改</el-button>
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.editTip"
              placement="top-start"
              v-if="!item.editable"
            >
              <el-button type="text" style="color: #ccc">修改</el-button>
            </el-tooltip>
            <el-button type="text" v-if="item.id && item.editable" @click="deleteRow(item)">解除关联</el-button>
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.editTip"
              placement="top-start"
              v-if="!item.editable"
            >
              <el-button type="text" v-if="item.id && !item.editable" style="color: #ccc">解除关联</el-button>
            </el-tooltip>
          </li>
        </ul>
        <ul v-if="total == 0">
          <span style="color: #909399; font-size: 14px">暂无数据</span>
        </ul>
      </div>
      <div class="title-bar">客户列表</div>
      <div class="department-cust-container">
        <div class="common-table-box">
          <el-table
            :data="customer.tableData"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          >
            <el-table-column align="center" prop="avatar" label="头像">
              <template slot-scope="scope">
                <img :src="scope.row.avatar || defaultHearderImage" alt="" width="44" height="44" />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="remarkList" label="备注名">
              <template slot-scope="scope">
                {{ scope.row.remarkList | remarkListFilters }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="微信昵称"></el-table-column>
            <el-table-column align="center" prop="lifeCycleNameList" label="生命周期"></el-table-column>
            <el-table-column align="center" prop="userNameList" label="所属成员">
              <template slot-scope="scope">
                <span class="tagName" v-for="(item, index) in scope.row.userNameList" :key="index">
                  <i class="el-icon-user-solid icon-user"></i>
                  {{ item }}
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="statusName" label="客户状态"></el-table-column>
            <el-table-column align="center" prop="receiveMessageTime" label="上次对话时间" v-if="customer.sessionOpenStauts">
              <template slot-scope="scope">{{ scope.row.receiveMessageTime | allTableTimefilters }}</template>
            </el-table-column>
            <el-table-column align="center" prop="createAtToTime" label="添加时间">
              <template slot-scope="scope">{{ scope.row.createAtToTime | allTableTimefilters }}</template>
            </el-table-column>
            <el-table-column align="center" prop="" label="操作">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="text"
                    @click="
                      $router.push(
                        `/main/scrm/customer-management/customer/detail?id=${scope.row.id}&wxid=${scope.row.wxCustomerId}`
                      )
                    "
                  >
                    详情
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="common-pagination-box">
          <com-pagination :page="customer.page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>
      </div>
    </div>
    <!-- <div class="table-container">
      <TabButton :navList="navList" @change="changeNav"></TabButton>
      <div class="table-box">
        <div class="customer-list" v-if="activeTab === 0">
          <div class="common-table-box">
            <el-table
              :data="customer.tableData"
              :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
            >
              <el-table-column align="center" prop="avatar" label="头像">
                <template slot-scope="scope">
                  <img :src="scope.row.avatar || defaultHearderImage" alt="" width="44" height="44" />
                </template>
              </el-table-column>
              <el-table-column align="center" prop="remarkList" label="备注名">
                <template slot-scope="scope">
                  {{ scope.row.remarkList | remarkListFilters }}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="name" label="微信昵称"></el-table-column>
              <el-table-column align="center" prop="lifeCycleNameList" label="生命周期"></el-table-column>
              <el-table-column align="center" prop="userNameList" label="所属成员">
                <template slot-scope="scope">
                  <span class="tagName" v-for="(item, index) in scope.row.userNameList" :key="index">
                    <i class="el-icon-user-solid icon-user"></i>
                    {{ item }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="statusName" label="客户状态"></el-table-column>
              <el-table-column align="center" prop="receiveMessageTime" label="上次对话时间" v-if="customer.sessionOpenStauts">
                <template slot-scope="scope">{{ scope.row.receiveMessageTime | allTableTimefilters }}</template>
              </el-table-column>
              <el-table-column align="center" prop="createAtToTime" label="添加时间">
                <template slot-scope="scope">{{ scope.row.createAtToTime | allTableTimefilters }}</template>
              </el-table-column>
              <el-table-column align="center" prop="" label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      type="text"
                      @click="
                        $router.push(
                          `/main/scrm/customer-management/customer/detail?id=${scope.row.id}&wxid=${scope.row.wxCustomerId}`
                        )
                      "
                    >
                      详情
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="common-pagination-box">
            <com-pagination :page="customer.page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
          </div>
        </div>
        <div class="colony-list" v-else-if="activeTab === 1">
          <div class="common-table-box">
            <el-table
              :data="colony.tableData"
              :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
            >
              <el-table-column align="center" prop="name" label="群名"></el-table-column>
              <el-table-column align="center" prop="ownerName" label="群主"></el-table-column>
              <el-table-column align="center" prop="quantity" label="群人数"></el-table-column>
              <el-table-column align="center" prop="todayIn" label="今日加群人数">
                <template slot-scope="scope">
                  {{ scope.row.todayIn || 0 }}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="todayOut" label="今日退群人数">
                <template slot-scope="scope">
                  {{ scope.row.todayOut || 0 }}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="createAtToTime" label="创建时间">
                <template slot-scope="scope">
                  {{ scope.row.createAtToTime | allTableTimefilters }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作"></el-table-column>
            </el-table>
          </div>
          <div class="common-pagination-box">
            <com-pagination :page="colony.page"></com-pagination>
          </div>
        </div>
      </div>
    </div> -->
    <com-dialog :config="customerDialog.config" @closeDialog="closeCustomerDialog">
      <div class="customer-container">
        <el-form v-if="model.type == 0" label-position="right" label-width="100px">
          <el-form-item label="类型名称：" :required="true">
            <el-input
              v-model="model.name"
              placeholder="请输入类型名称"
              maxlength="32"
              show-word-limit
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="文本内容：" :required="true">
            <el-input v-model="model.textValue" placeholder="请输入文本内容" maxlength="32" show-word-limit></el-input>
          </el-form-item>
        </el-form>
        <el-form v-if="model.type == 1" label-position="right" label-width="100px">
          <el-form-item label="类型名称：" :required="true">
            <el-input
              v-model="model.name"
              placeholder="请输入类型名称"
              maxlength="32"
              show-word-limit
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="网页标题：" :required="true">
            <el-input v-model="model.webTitle" placeholder="请输入网页标题" maxlength="32" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="网页链接：" :required="true">
            <el-input
              type="textarea"
              v-model="model.webUrl"
              placeholder="请输入网页链接"
              maxlength="255"
              show-word-limit
              size="small"
              :rows="4"
              resize="none"
              class="textarea-input"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form v-if="model.type == 2" label-position="right" label-width="100px">
          <el-form-item label="类型名称：" :required="true">
            <el-input
              v-model="model.name"
              placeholder="请输入类型名称"
              maxlength="32"
              show-word-limit
              disabled
            ></el-input>
          </el-form-item>
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

          <!-- <SelectProgramAppId
            ref="SelectProgramItem"
            :programIdProps="programIdProps"
            class="selectProgram"
          ></SelectProgramAppId> -->
        </el-form>
      </div>
      <div class="customer-btn">
        <div>
          <el-button @click="closeNoticeDialog()">取消</el-button>
          <el-button type="primary" @click="sumbitNotice()">保存</el-button>
        </div>
      </div>
    </com-dialog>
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
import GoBack from '../../../components/components/GoBack'
import ComDialog from '../../../components/common/ComDialog'
import SelectProgramItem from '../../../components/components/SelectProgramItem'
import SelectProgramAppId from '../../../components/components/SelectProgramAppId'
import UploadImage from '../../../components/components/UploadImage.vue'
import ComPagination from '../../../components/common/ComPagination'
import TabButton from '../../../components/components/TabButton.vue'

export default {
  components: {
    GoBack,
    ComDialog,
    SelectProgramItem,
    SelectProgramAppId,
    UploadImage,
    ComPagination,
    TabButton,
  },
  data() {
    return {
      programId: '',
      options: [], //小程序列表
      queryId: '',
      customerData: {},
      programDialog: false, //添加小程序弹窗
      //弹窗
      customerDialog: {
        config: {
          width: '800px',
          title: '修改对外信息',
          visible: false
        }
      },
      programForm: {
        name: '',
        wxAppId: '',
        page: '',
        logo: ''
      },
      fileList: [],
      type: 'create',
      title: '新建小程序',
      updateImage: '',
      model: {},
      updateModels: {
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
      editForm: {
        name: '',
        textValue: '',
        webTitle: '',
        programTitle: ''
      },
      programInfoOption: {
        logo: '',
        name: ''
      },
      programIdProps: {
        wxAppId: '',
        name: '',
        logo: ''
      },
      total: 0,
      customer: {
        tableData: [],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0
        },
        sessionOpenStauts: true, // 会话设置状态
      },
      navList: [
        { name: '客户列表', isActive: true },
        { name: '客户群列表', isActive: false },
      ],
      activeTab: 0,
      colony: {
        tableData: [],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0
        }
      }
    }
  },
  methods: {
    //方法开始
    //删除方法
    deleteRow(item) {
      let model = {
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
      model.userIdList.push(this.customerData.id)
      model.name = item.name
      model.type = item.type
      // console.log(model)
      this.$confirm('是否解除联系?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deteleExternal(model).then(() => {
            this.$message.success('成功解除联系')
            this.getMemberDetail()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解除联系'
          })
        })
    },
    uploadImageSuccess(val) {
      this.updateImage = val.length == 0 ? '' : val[0].url
    },
    close() {
      this.fileList = []
      this.programForm = {
        name: '',
        wxAppId: '',
        page: '',
        logo: ''
      }
    },
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
    createButton() {
      this.programDialog = true
      this.type = 'create'
      this.title = '新建小程序'
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
    //修改开始
    editDetail(item) {
      this.model = Object.assign({}, item)
      this.customerDialog.config.visible = true
      if (this.model.type == 2) {
        this.programIdProps.wxAppId = this.model.programAppId
        this.programIdProps.name = this.model.programTitle
        this.programIdProps.programPagePath = this.model.programPagePath
        this.getProgarm()
      }
    },
    //取消按钮
    closeNoticeDialog() {
      this.customerDialog.config.visible = false
    },
    //提交按钮
    sumbitNotice() {
      this.updateModels.userIdList = []
      this.updateModels.userIdList.push(this.customerData.id)
      this.updateModels.name = this.model.name
      if (this.model.type == 0) {
        if (this.model.name == '') {
          this.$message.warning('类型名称不能为空')
          return
        }
        if (this.model.textValue == '') {
          this.$messasge.warning('文本内容不能为空')
          return
        }
        // this.updateModels.name = this.model.name
        this.updateModels.textValue = this.model.textValue
        this.updateModels.type = this.model.type
        this.updateModels.webTitle = ''
        this.updateModels.webUrl = ''
        this.updateModels.programTitle = ''
        this.updateModels.programPagePath = ''
        this.updateModels.programAppId = ''
        this.updateExternal(this.updateModels)
      }
      if (this.model.type == 1) {
        if (this.model.name == '') {
          this.$message.warning('类型名称不能为空')
          return
        }
        if (this.model.webTitle == '') {
          this.$message.warning('网页标题不能为空')
          return
        }
        if (this.model.webUrl == '') {
          this.$message.warning('网页链接不能为空')
          return
        }
        // this.updateModels.name = this.model.name

        this.updateModels.webUrl = this.model.webUrl
        this.updateModels.webTitle = this.model.webTitle
        this.updateModels.type = this.model.type
        this.updateModels.programTitle = ''
        this.updateModels.programPagePath = ''
        this.updateModels.programAppId = ''
        this.updateModels.textValue = ''
        this.updateExternal(this.updateModels)
      }
      if (this.model.type == 2) {
        console.log(this.programInfoOption)
        if (this.programInfoOption.logo == '' && this.programInfoOption.name == '') {
          this.updateModels.programTitle = this.model.programTitle
          this.updateModels.programAppId = this.model.programAppId
          this.updateModels.programPagePath = this.model.programPagePath
          this.updateModels.type = this.model.type
          this.updateModels.textValue = ''
          this.updateModels.webTitle = ''
          this.updateModels.webUrl = ''
          this.updateExternal(this.updateModels)
        } else {
          this.updateModels.programTitle = this.programInfoOption.name
          this.updateModels.programAppId = this.programInfoOption.wxAppId
          this.updateModels.programPagePath = this.programInfoOption.page
          this.updateModels.type = this.model.type
          this.updateModels.textValue = ''
          this.updateModels.webTitle = ''
          this.updateModels.webUrl = ''
          this.updateExternal(this.updateModels)
        }
      }
    },

    //弹窗关闭按钮
    closeCustomerDialog() {
      this.customerDialog.config.visible = false
    },
    clearModel() {
      this.updateModels = {
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
    },
    //方法结束
    //接口部分
    getMemberDetail() {
      this.$http.getMemberDetail({ id: this.queryId }).then(res => {
        this.customerData = res.data.data
        this.total = this.customerData.userExternalAttrList.length
        // console.log(this.customerData)
        this.getSessionOpenStatus()
      })
    },
    updateExternal(params) {
      this.$http.updateUserOnly(params).then(res => {
        if (res.data.code == 20000) {
          this.$message.success('修改成功')
          this.getMemberDetail()
          this.clearModel()
          this.customerDialog.config.visible = false
        } else {
          this.$message.error(res.data.messasge)
        }
      })
    },
    // 获取客户会话开启状态
    getSessionOpenStatus() {
      this.$http.getOpenStatus().then(res => {
        this.customer.sessionOpenStauts = res.data.data
        this.getCustomerPage()
      })
    },
    getCustomerPage() {
      let page = this.customer.page
      let params = {
        pageNum: page.pageNum,
        pageSize: page.pageSize,
        followUserId: this.customerData.userId
      }
      this.$http.getCustomerPage(params).then(res => {
        this.customer.tableData = res.data.data.list
        this.customer.page.total = res.data.data.total
      })
    },
    onSizeChange(val) {
      this.customer.page.pageSize = val
      this.customer.page.pageNum = 1
      this.getCustomerPage()
    },
    onPageChange(val) {
      this.customer.page.pageNum = val
      this.getCustomerPage()
    },
    changeNav(val) {
      this.activeTab = val
      if (this.activeTab === 0) {
        this.getCustomerPage()
      } else if (this.activeTab === 1) {
        //
      }
    }
    //接口结束
  },
  created() {
    if (this.$route.query.id) {
      this.queryId = this.$route.query.id
      this.getMemberDetail()
    }
  },
  filters: {
    isGender(option) {
      if (option == 0) {
        return '未知'
      }
      if (option == 1) {
        return '男'
      }
      if (option == 2) {
        return '女'
      }
    },
    isType(option) {
      if (option == 0) {
        return '文本'
      }
      if (option == 1) {
        return '网页'
      }
      if (option == 2) {
        return '小程序'
      }
    },
    isHttp(option) {
      if (option == 'http://athena-1255600302.cosgz.myqcloud.com/') {
        return ''
      }
    },
    remarkListFilters(option) {
      if (!option) {
        return ''
      }
      let remarksArr = []
      remarksArr = option.reduce((total, now) => {
        total.includes(now) ? '' : total.push(now)
        return total
      }, [])
      return remarksArr.join('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.department-div {
  width: 100%;
  height: 100%;

  .department-div-top {
    width: 100%;
    // height: 100%;
    background-color: #ffffff;
    .department-thmub-text {
      padding: 20px 0;
      margin-left: 20px;
      display: flex;
      .thmub {
        img {
          width: 60px;
          height: 60px;
          border-radius: 5px;
        }
      }
      .text {
        font-size: 18px;
        margin: 5px 0 0 15px;
        color: #909399;
        font-weight: 400;
      }
      .icon {
        font-size: 18px;
        margin: 3px 0 0 5px;
        color: #294a7b;
      }
    }
  }
  .title-bar {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    color: #303133;
    position: relative;
    display: flex;
    align-items: center;
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
      left: 0px;
    }
  }
  .department-div-container {
    width: 70%;
    padding: 20px 20px 0;
    box-sizing: border-box;
    ul {
      // max-width: 1000px;
      // display: flex;
      // flex-wrap: wrap;
      li {
        // width: 30%;
        // min-width: 300px;
        font-size: 14px;
        color: #909399;
        margin: 0 20px 30px 0;
        .value {
          .el-tag {
            padding: 0;
            margin: 0;
            padding: 0px 5px;
            cursor: pointer;
            // background-color: black;
          }
          .el-button {
            margin-left: 10px;
          }
        }
      }
    }
  }
  .department-exter-container {
    width: 70%;
    padding: 20px 20px 0;
    box-sizing: border-box;
    ul {
      // max-width: 1000px;
      // display: flex;
      // flex-wrap: wrap;
      li {
        // border: 1px solid red;
        // width: 30%;
        // min-width: 300px;
        font-size: 14px;
        color: #909399;
        margin: 0 20px 10px 0;
        .value {
          .el-tag {
            padding: 0;
            margin: 0;
            padding: 0px 5px;
            cursor: pointer;
            margin-right: 5px;
          }
          .el-button {
            margin-left: 10px;
          }
        }
      }
    }
  }
  .department-cust-container {
    padding: 20px;
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
  }
}
// .customer-container {
//   .el-form {
//     // padding: 10px 0;
//   }
// }
.customer-btn {
  display: flex;
  justify-content: flex-start;
  div {
    margin-left: auto;
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
.selectProgram {
  margin-left: 18px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
.programInfoBox {
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
.table-container {
  padding: 20px 0;
  .table-box {
    padding: 20px;
    background: #ffffff;
  }
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
}
</style>
