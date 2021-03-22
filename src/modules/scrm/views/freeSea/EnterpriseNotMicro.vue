<template>
  <div>
    <div class="addlivecode">
      <div class="container">
        <div class="top_nav">
          <div class="query-table-box">
            <el-form inline :model="searchForm" label-width="70px" label-position="right" size="small">
              <el-form-item label="客户姓名">
                <el-input
                  v-model="searchForm.name"
                  clearable
                  @input="searchLiveCodeList"
                  placeholder="请输入客户姓名"
                ></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input
                  v-model="searchForm.mobile"
                  clearable
                  @input="searchLiveCodeList"
                  placeholder="请输入手机号"
                ></el-input>
              </el-form-item>
              <el-form-item label="认领成员">
                <el-input
                  v-model="searchForm.userName"
                  clearable
                  @input="searchLiveCodeList"
                  placeholder="请输入认领成员"
                ></el-input>
              </el-form-item>
              <br />
              <el-form-item label="录入时间">
                <el-date-picker
                  v-model="searchTime"
                  type="daterange"
                  unlink-panels
                  @change="dateChange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="认领时间">
                <el-date-picker
                  v-model="claimTime"
                  type="daterange"
                  unlink-panels
                  @change="dateClaimChange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="xfo-tips">
            <el-alert
              title="非企微客户指未添加为外部好友的客户，主要有管理员导入的客户，需要企业成员领取并手动添加为好友"
              type="warning"
              :closable="false"
              show-icon
            >
            </el-alert>
          </div>
        </div>
        <tab-button position="right" :navList="navList" @change="changeNav"></tab-button>
        <div style="position: relative">
          <div class="table-info">
            <!-- <el-button type="primary" size="small" @click="goRecycle">客户回收规则</el-button> -->
            
            <!-- <el-button size="small" plain @click="isclient.config.visible = true">录入客户</el-button> -->
            <el-button size="small" plain @click="showCustomerAddDialog">录入客户</el-button>
            <el-button size="small" plain @click="importExcel.config.visible = true">批量导入客户</el-button>
          </div>
          <div class="common-table-box">
            <el-table
              :data="tableData"
              width="100%"
              id="table"
              :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
              :height="height"
              v-if="activeName == 'first'"
            >
              <el-table-column label="客户信息" prop="name" align="center"> </el-table-column>
              <el-table-column label="手机" prop="mobile" align="center">
              </el-table-column>
              <el-table-column label="是否认领" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.status == 'un_claimed' ? '未认领' : '已认领' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="录入时间" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.createTime | timeSubString }}</span>
                </template>
              </el-table-column>
              <el-table-column label="认领成员" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 'claimed'">{{ scope.row.claimUser }}</span>
                </template>
              </el-table-column>
              <el-table-column label="认领时间" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 'claimed'">{{ scope.row.lastClaimTime | timeSubString }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class="caozuo-column">
                <template slot-scope="scope">
                  <el-button type="text" @click="admonish(scope.row.id)">提醒</el-button>
                  <el-button type="text" @click="addelete(scope.row.id)">删除</el-button>
                  <el-button type="text" @click="$router.push('../customer-management/customer/Detail?id='+scope.row.id+'&isworkwechat=not')">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="tableData"
              width="100%"
              id="table"
              :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
              :height="height"
              v-if="activeName == 'second'"
            >
              <el-table-column label="客户信息" prop="name" align="center"> </el-table-column>
              <el-table-column label="手机" prop="mobile" align="center"> </el-table-column>
              <el-table-column label="是否认领" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.status == 'un_claimed' ? '未认领' : '已认领' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="录入时间" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.createTime | timeSubString }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class="caozuo-column">
                <template slot-scope="scope">
                  <!-- <el-button type="text" @click=";(innerVisible = true), (updateId = scope.row.id)">分配</el-button> -->
                  <el-button type="text" @click="openMemberSingleDialog(scope.row.id)">分配</el-button>
                  <el-button type="text" @click="addelete(scope.row.id)">删除</el-button>
                  <el-button type="text" @click="$router.push('../customer-management/customer/Detail?id='+scope.row.id+'&isworkwechat=not')">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="common-pagination">
            <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
          </div>
        </div>
      </div>
    </div>
    <claimMember
      :visible="innerVisible"
      :id="updateId"
      @innerclose="innerclose"
      @chooseConfirm="chooseConfirm"
    ></claimMember>
    <!-- <com-dialog :config="isclient.config" @closeDialog="onClose">
      <el-form :model="model" ref="model" label-width="80px" label-position="left">
        <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input v-model="model.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input v-model="model.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="关联成员">
          <div class="import-form-person tag-item" v-if="modelname.length != 0">
            <Tag v-for="(item, index) in modelname" :key="index">{{ item.name }}</Tag>
          </div>
          <div>
            <el-button icon="el-icon-plus" plain size="small" @click=";(innerVisible = true), (updateId = '')"
              >添加</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <div class="submit_btn_box" style="text-align: right">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="addClientsuccess">确 定</el-button>
      </div>
    </com-dialog> -->

    <com-dialog :config="isclient.config" @closeDialog="closeInputDialog">
      <div class="customer-dialog">
        <el-form :model="model" ref="model" label-width="80px" label-position="left">
          <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
            <el-input v-model="model.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile" :rules="[{ required: true, message: '该字段不能为空' }]">
            <el-input v-model="model.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <!-- <el-form-item label="关联成员">
            <div class="import-form-person tag-item" v-if="modelname.length != 0">
              <Tag v-for="(item, index) in modelname" :key="index">{{ item.name }}</Tag>
            </div>
            <div>
              <el-button icon="el-icon-plus" plain size="small" @click=";(innerVisible = true), (updateId = '')"
                >添加</el-button
              >
            </div>
          </el-form-item> -->
          <el-form-item label="关联成员">
            <div class="import-form-person tag-item" v-if="memberSingleDialog.selectedMembers.length > 0">
              <Tag v-for="(item, index) in memberSingleDialog.selectedMembers" :key="index">{{ item.name }}</Tag>
            </div>
            <div>
              <el-button icon="el-icon-plus" plain size="small" @click="openMemberSingleDialog('')"
                >添加</el-button
              >
            </div>
          </el-form-item>
          <el-form-item label="企业标签">
            <div v-if="tagsDialog.selectedList.length > 0">
              <span
                class="enterprise-tag"
                v-for="(tag, idx) in tagsDialog.selectedList"
                :key="idx"
              >
                {{ tag.name }}
              </span>
            </div>
            <div>
              <el-button icon="el-icon-plus" plain size="small" @click="showTagsDialog">添加</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div class="external-content">
          <div class="label">其它信息</div>
          <div class="external-list">
            <el-form label-width="80px" label-position="left">
              <!-- 基础字段信息 -->
              <el-form-item label="备注">
                <el-input
                  v-model="model.remarks"
                  placeholder="备注"
                  maxlength="20"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
              <el-form-item label="企业">
                <el-input
                  v-model="model.corpFullName"
                  placeholder="企业"
                  maxlength="20"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="model.email"
                  placeholder="邮箱"
                  maxlength="40"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input
                  v-model="model.description"
                  placeholder="描述"
                  maxlength="150"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
              <!-- 自定义字段信息 -->
              <el-form-item
                v-for="(item, index) in externalList"
                :key="index"
                :label="item.name"
              >
                <div class="item-content" v-if="item.type == 'text'">
                  <el-input
                    v-model="item.value"
                    :placeholder="item.name"
                    maxlength="40"
                    show-word-limit
                  >
                  </el-input>
                </div>
                <div class="item-content" v-if="item.type == 'radio'">
                  <el-radio-group v-model="item.value">
                    <el-radio
                      v-for="(rdItem, rdIndex) in item.optionName"
                      :key="rdIndex"
                      :label="rdItem"
                    >
                      {{ rdItem }}
                    </el-radio>
                  </el-radio-group>
                </div>
                <div class="item-content" v-if="item.type == 'checkbox'">
                  <el-checkbox-group v-model="item.value">
                    <el-checkbox
                      v-for="(cbItem, cbIndex) in item.optionName"
                      :key="cbIndex"
                      :label="cbItem"
                    >
                      {{ cbItem }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="item-content" v-if="item.type == 'image'">
                  <div class="image-list-box">
                    <UploadImage
                      :width="90"
                      :height="90"
                      :fileList="item.imageList"
                      :maxLength="9"
                      :size="5"
                      @success="e => imageSuccess(e, index)"
                    >
                    </UploadImage>
                    <span style="color: #909399">可上传9张，单张图片像素不可大于5MB</span>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="submit_btn_box" style="text-align: right">
        <el-button @click="closeInputDialog">取 消</el-button>
        <el-button type="primary" @click="addCustomerData">确 定</el-button>
      </div>
    </com-dialog>

    <com-dialog :config="importExcel.config" @closeDialog="closeExcel">
      <div class="import-excel">
        <div class="import-title" style="margin: 5px 0 15px 0">
          提示:请下载模板填写手机号上传，可批量复制手机号至模板内，出现重复手机号或者空行会自动过滤
        </div>
        <div class="import-click">
          点击下载<el-button type="text" @click="downloadExcel">Excel批量添加好友模板&gt;</el-button>
        </div>
        <div class="import-form">
          <el-form ref="model">
            <el-form-item label="上传表格" :required="true" prop="excel">
              <!-- <FileUpload @onSuccess="fileUploadSuccess"></FileUpload> -->
              <el-upload
                class="upload-wrap"
                :action="action"
                :show-file-list="false"
                :on-change="onChange"
                :auto-upload="false"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              >
                <div class="tip-text">
                  <p class="icon el-icon-plus"></p>
                </div>
              </el-upload>
              <div class="tip-p" v-if="excelName != ''">
                <i class="el-icon-folder-opened folder-opened"></i>&nbsp;&nbsp;{{ excelName }}
              </div>
              <!-- <up-load-file url="api/admin/v1/friend/importExcel" size="mini" id="ids" :err-tip="true"></up-load-file> -->
            </el-form-item>
            <el-form-item label="关联成员" :required="true">
              <div class="import-form-person tag-item" v-if="form.monentsUsers.length != 0">
                <Tag v-for="(item, index) in form.monentsUsers" :key="index">{{ item.name }}</Tag>
              </div>
              <div style="margin-left: 80px; width: 80%">
                <el-button icon="el-icon-plus" plain size="small" @click="openPeople">添加</el-button><br />
                （导入的表格客户将平均分配给关联的成员，分配完成后成员将在企业微信收到添加好友的任务，需要手动添加）
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="submit_btn_box" style="text-align: right">
        <el-button @click="closeExcel">取消</el-button>
        <el-button type="primary" @click="submitImportData">确定</el-button>
      </div>
    </com-dialog>
    <department-dialog
      :config="departmentDialog.config"
      @closeDialog="departmentDialog.config.visible = false"
      ref="department"
      :selectedList="form.monentsUsers"
      @handleConfirm="handleConfirm"
    >
    </department-dialog>
    <!-- 企业标签 -->
    <tags-dialog
      ref="tagsDialog"
      :configure="tagsDialog.configure"
      :type="tagsDialog.type"
      :selectedList="tagsDialog.selectedList"
      @closeDialog="tagsDialog.configure.visible = false"
      @success="onSelectTags"
    >
    </tags-dialog>
    <!-- 录入客户、分配客户选择成员弹窗 -->
    <member-tree-single-dialog
      :config="memberSingleDialog.config"
      @closeDialog="memberSingleDialog.config.visible = false"
      :selectedList="memberSingleDialog.selectedMembers"
      @handleConfirm="getSelectedMembers"
    >
    </member-tree-single-dialog>
  </div>
</template>
<script>
import api from '../../api/freeSea'
import ComPagination from '../../components/common/ComPagination'
import ComDialog from '../../components/common/ComDialog'
import claimMember from './claimMember'
import FileSaver from 'file-saver'
import DepartmentDialog from '../../components/components/MemberTreeLinkageDialog'
import Tag from '../../components/components/Tag'
import TabButton from '@/modules/scrm/components/components/TabButton.vue'
import UploadImage from '../../components/components/UploadImage'
import TagsDialog from '../../components/components/TagsDialog'
import MemberTreeSingleDialog from '../../components/components/MemberTreeSingleDialog'
export default {
  components: { TabButton, ComPagination, ComDialog, claimMember, DepartmentDialog, Tag, UploadImage, TagsDialog, MemberTreeSingleDialog },
  data() {
    return {
      model: {
        name: '',
        mobile: '',
        userId: '',
        remarks: '',
        description: '',
        email: '',
        corpFullName: '',
        list: [],
        tagId: '',
      },
      modelname: [],
      isclient: {
        config: {
          width: '600px',
          visible: false,
          title: '录入客户'
        }
      },
      form: { monentsUsers: [] },
      departmentDialog: {
        config: {
          width: '700px',
          title: '关联人员',
          visible: false
        }
      },
      userIdList: '',
      activeName: 'first',
      unactiveName: 'first',
      importExcel: {
        config: {
          width: '700px',
          title: '导入Excel',
          visible: false
        }
      },
      action: '',
      excelName: '',
      formData: [],
      innerVisible: false,
      updateId: '',
      navList: [
        { name: '未认领', isActive: false },
        { name: '已认领', isActive: true }
      ],
      navIndex: 0,
      nowIndex: 0,
      source: [
        { name: '全部', value: '' },
        { name: '未知', value: '0' },
        { name: '扫描二维码', value: '1' },
        { name: '搜索手机号', value: '2' },
        { name: '名片分享', value: '3' },
        { name: '群聊', value: '4' },
        { name: '手机通讯录', value: '5' },
        { name: '微信联系人', value: '6' },
        { name: '来自微信的添加好友申请', value: '7' },
        { name: '安装第三方应用时自动添加的客服人员', value: '8' },
        { name: '搜索邮箱', value: '9' },
        { name: '后台录入', value: '10' },
        { name: '批量导入', value: '11' },
        { name: '内部成员共享', value: '201' },
        { name: '管理员/负责人分配', value: '202' }
      ],

      searchForm: {
        name: '',
        addWay: '',
        startDate: '',
        endDate: '',
        status: 'claimed',
        type: 'un_scrm_customer'
      },
      searchTime: '',
      claimTime: '',
      height: 400,
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      tableData: [],
      externalList: [],
      tagsDialog: {
        configure: {
          title: '企业标签',
          visible: false,
          width: '600px',
          top: '15vh'
        },
        selectedList: [],
        type: 'company'
      },
      memberSingleDialog: { // 录入分配客户，选择关联人员，只支持选择一人
        config: {
          width: '800px',
          title: '请选择成员',
          visible: false
        },
        selectedMembers: [],
        customerId: ''
      }
    }
  },
  created() {
    if (this.$route.query.nowIndex) {
      this.nowIndex = this.$route.query.nowIndex
    }
    // if (this.nowIndex == 0) {
    //   this.searchForm.type = 'scrm_customer'
    //   this.searchForm.status = 'claimed'
    // } else if (this.nowIndex == 1) {
    //   this.searchForm.type = 'un_scrm_customer'
    //   this.searchForm.status = 'claimed'
    // }
    this.BCclient()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  },
  methods: {
    changeNav(index) {
      this.navIndex = index
      if (index == 0) {
        this.activeName = 'second'
      }
      if (index == 1) {
        this.activeName = 'first'
      }
      this.handleClick()
    },
    // 企微客户列表
    BCclient() {
      var json3 = JSON.parse((JSON.stringify(this.searchForm) + JSON.stringify(this.page)).replace(/}{/, ','))
      this.$http.BusinessWechatClient(json3).then(res => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    // 切换头部
    relationClick(index) {
      this.nowIndex = index
      this.activeName = 'first'
      if (index == 0) {
        this.searchForm.type = 'scrm_customer'
        this.searchForm.status = 'claimed'
      } else if (index == 1) {
        this.searchForm.type = 'un_scrm_customer'
        this.searchForm.status = 'claimed'
      }
      this.searchForm.mobile = ''
      this.searchForm.name = ''
      this.searchForm.startDate = ''
      this.searchForm.endDate = ''
      this.searchForm.addWay = ''
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.searchTime = ''
      this.claimTime = ''
      this.searchForm.startClaimTime = ''
      this.searchForm.endClaimTime = ''
      this.BCclient()
    },
    // 认领
    claim(row) {
      this.innerVisible = true
    },
    // 获取录入客户选择的成员信息
    chooseConfirm(list) {
      this.modelname = []
      this.modelname.push(list)
      this.model.userId = list.userId
    },
    // 下载模板
    // downloadExcel() {
    //   this.$nextTick(() => {
    //     this.$message.success('正在下载，请稍加等候')
    //     FileSaver.saveAs(
    //       this.imgHost + '/attachments/scrm/87ca1bb12d25416992d097d9df6a1dd8.xls',
    //       'Excel批量添加好友模板.xls'
    //     )
    //     // window.open(this.imgHost + '/attachments/scrm/87ca1bb12d25416992d097d9df6a1dd8.xls')
    //   })
    // },
    downloadExcel() {
      // 新模板
      this.$nextTick(() => {
        this.$message.success('正在下载，请稍加等候')
        FileSaver.saveAs(
          this.imgHost + '/attachments/scrm/2571a81701234a2fa620fab19dc6b7df.xls',
          'Excel批量添加好友模板.xls'
        )
      })
    },
    // 上传文件
    onChange(file) {
      if (file.raw !== '') {
        this.$message.success('上传成功')
        this.formData.file = file.raw
        this.excelName = file.name
      } else {
        this.$message.error('上传失败')
      }
    },
    // 切换已认领和未认领
    handleClick() {
      if (this.activeName == 'first') {
        this.searchForm.status = 'claimed'
      } else if (this.activeName == 'second') {
        this.searchForm.status = 'un_claimed'
      }
      this.searchForm.mobile = ''
      this.searchForm.name = ''
      this.searchForm.startDate = ''
      this.searchForm.endDate = ''
      this.searchForm.addWay = ''
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.searchTime = ''
      this.claimTime = ''
      this.searchForm.startClaimTime = ''
      this.searchForm.endClaimTime = ''
      this.BCclient()
    },
    // 录入客户
    addClientsuccess() {
      this.$http.enterUnclient(this.model).then(res => {
        if(res.data.code==20000){
          this.$message.success('录入成功')
          this.onClose()
        }else{
          this.$message.warning(res.data.message)
        }
      })
    },

    //点击确认选择的人员
    handleConfirm(list) {
      let userId = []
      this.form.monentsUsers = list
      this.departmentDialog.config.visible = false
      list.forEach(item => {
        userId.push(item.userId)
      })
      this.userIdList = userId.join('_')
    },
    //打开关联人员
    openPeople() {
      this.departmentDialog.config.visible = true
      this.$nextTick(() => {
        this.$refs.department.setCheckedNodes()
      })
    },
    // 提醒
    admonish(poolCustomerId) {
      this.$confirm('确定发送提醒消息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.admonishRecyclingRules({ poolCustomerId }).then(res => {
          this.$message.success('提醒发送成功')
        })
      })
    },
    // 退回
    sendBack(poolCustomerId) {
      this.$confirm('确定退回到未认领列表吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.sendYetClaimed({ poolCustomerId }).then(res => {
          this.$message.success('退回成功')
        })
      })
    },
    // 删除非企微客户
    addelete(id) {
      this.$confirm('确定删除该客户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteUnHinghPool({ id }).then(res => {
          this.$message.success('删除成功')
          this.BCclient()
        })
      })
    },

    //确认导入excel
    submitImportData() {
      let formData = new FormData()
      formData.append('file', this.formData.file)
      formData.append('userId', this.userIdList)
      if (this.formData.file == undefined) {
        this.$message.warning('请上传文件')
      } else if (this.userIdList.length == 0) {
        this.$message.warning('请选择人员')
      } else {
        this.$http.exportUnclient(formData).then(res => {
          if (res.data.code === 20000) {
            this.$refs.model.resetFields()
            this.$message.success('Excel导入成功')
            this.BCclient()
            this.formData = []
            this.form = {
              monentsUsers: []
            }
            this.excelName = ''
            this.closeExcel()
          } else {
            this.$message.error('Excel导入失败')
          }
        })
      }
    },

    dateChange(e) {
      if (e && e.length > 0) {
        this.searchForm.startDate = e[0]
        this.searchForm.endDate = e[1]
      } else {
        this.searchForm.startDate = ''
        this.searchForm.endDate = ''
      }
      this.searchLiveCodeList()
    },
    dateClaimChange(e) {
      if (e && e.length > 0) {
        this.searchForm.startClaimTime = e[0]
        this.searchForm.endClaimTime = e[1]
      } else {
        this.searchForm.startClaimTime = ''
        this.searchForm.endClaimTime = ''
      }
      this.searchLiveCodeList()
    },
    onClose(flag) {
      this.isclient.config.visible = false
      this.modelname = []
      this.model = { name: '', mobile: '', userId: '' }
      this.BCclient()
    },
    closeExcel() {
      this.importExcel.config.visible = false
      this.form.monentsUsers = []
      this.userIdList = []
      this.excelName = ''
      this.formData = []
    },
    innerclose() {
      this.updateId = ''
      this.innerVisible = false
      this.BCclient()
    },
    // 跳转客户回收
    goRecycle() {
      this.$router.push('./recycle?nowIndex=' + this.nowIndex)
    },

    // 查询1
    searchLiveCodeList() {
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.BCclient()
    },
    // 重置1
    reLiveCodeSearch() {
      this.searchForm.name = ''
      this.searchForm.startDate = ''
      this.searchForm.endDate = ''
      this.searchForm.addWay = ''
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.searchTime = ''
      this.claimTime = ''
      this.searchForm.startClaimTime = ''
      this.searchForm.endClaimTime = ''
      this.searchForm.mobile = ''
      this.BCclient()
    },

    // 翻页1
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.BCclient()
    },
    // 翻页1
    onPageChange(val) {
      this.page.pageNum = val
      this.BCclient()
    },

    time(datetime) {
      let startAt = (new Date(this.date) * 1000) / 1000
      if (startAt < Date.now()) {
        datetime = new Date()
      }
      this.sendTime = datetime
      this.sendTime += ':00'
    },
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 40,
        PAGINATION_HEIGHT = 44,
        PADDING_BOTTOM_HEIGHT = 165,
        PADDING_TOP_HEIGHT = 56
      var height =
        window.innerHeight -
        // document.querySelector('#table').offsetTop -
        // document.querySelector('#top_nav_tabe').clientHeight-
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT -
        100
      this.height = height
    },
    // 打开录入客户弹窗并获取自定义信息列表
    showCustomerAddDialog() {
      this.isclient.config.visible = true
      this.$http.getlistDefault().then(res => {
        let data = res.data.data
        let defaultList = data.defaultList
        let list = data.list
        let newList = []
        defaultList.forEach(item => {
          if (item.isChecked) {
            if (item.type == 'radio') {
              item.optionName = item.optionName.split('_')
              item.value = ''
            } else if (item.type == 'checkbox') {
              item.optionName = item.optionName.split('_')
              item.value = []
            } else if (item.type == 'image') {
              item.imageList = []
              item.value = []
            } else if (item.type == 'text') {
              item.value = ''
            }
            newList.push(item)
          }
        })
        list.forEach(item => {
          if (item.type == 'radio') {
            item.optionName = item.optionName.split('_')
            item.value = ''
          } else if (item.type == 'checkbox') {
            item.optionName = item.optionName.split('_')
            item.value = []
          } else if (item.type == 'image') {
            item.imageList = []
            item.value = []
          } else if (item.type == 'text') {
            item.value = ''
          }
          newList.push(item)
        })
        this.externalList = newList
      })
    },
    closeInputDialog() {
      this.isclient.config.visible = false
      this.modelname = []
      this.tagsDialog.selectedList = []
      this.model = { name: '', mobile: '', userId: '', remarks: '', description: '', email: '', corpFullName: '', list: [], tagId: '' }
      this.BCclient()
      this.memberSingleDialog.selectedMembers = []
    },
    // 上传图片
    imageSuccess(val, idx) {
      this.externalList[idx].value = []
      val.forEach(item => {
        this.externalList[idx].value.push(item.url)
      })
      console.log('上传图片返回值', this.externalList[idx])
    },
    // 录入客户信息
    addCustomerData() {
      if (this.model.name == '') {
        this.$message.warning('请输入姓名')
        return
      }
      if (this.model.mobile == '') {
        this.$message.warning('请输入手机号')
        return
      }
      let extList = []
      let cloneList = JSON.parse(JSON.stringify(this.externalList))
      cloneList.forEach(item => {
        if (item.type == 'checkbox' || item.type == 'image') {
          if (item.value.length > 0) {
            item.value = item.value.join('_')
          } else {
            item.value = ''
          }
        }
        let obj = {
          externalProfileId: item.id,
          name: item.name,
          value: item.value
        }
        extList.push(obj)
      })
      this.model.list = extList
      let tagList = this.tagsDialog.selectedList
      if (tagList.length > 0) {
        let tags = []
        tagList.forEach(item => {
          tags.push(item.id)
        })
        this.model.tagId = tags.join('_')
      }
      console.log('录入非企微客户提交参数', this.model)
      this.$http.enterUnclient(this.model).then(res => {
        this.$message.success('录入成功')
        this.closeInputDialog()
      })
    },
    // 打开企业标签弹窗
    showTagsDialog() {
      this.$refs.tagsDialog.getData()
      this.tagsDialog.configure.visible = true
    },
    // 选择企业标签
    onSelectTags(tags) {
      this.tagsDialog.configure.visible = false
      console.log('已选择的企业标签', tags)
      this.tagsDialog.selectedList = tags
    },
    openMemberSingleDialog(val) {
      this.memberSingleDialog.selectedMembers = []
      this.memberSingleDialog.customerId = val
      this.memberSingleDialog.config.visible = true
    },
    // 录入分配客户，获取关联的人员
    getSelectedMembers(list) {
      this.memberSingleDialog.selectedMembers = list
      let customerId = this.memberSingleDialog.customerId
      if (customerId) {
        // 分配成员
        if (list.length > 0) {
          this.memberSingleDialog.config.visible = false
          this.$confirm('是否确认分配给该成员认领?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.claimClient({ id: customerId, wxUserId: list[0].userId }).then(res => {
              this.$message.success('认领成功')
              this.BCclient()
            })
          }).catch(() => {
            this.memberSingleDialog.selectedMembers = []
          })
        } else {
          this.$message.warning('请选择分配的成员')
        }
      } else {
        // 录入客户
        if (list.length > 0) {
          this.model.userId = list[0].userId
          console.log('关联人员的userId', list[0].userId)
        } else {
          this.model.userId = ''
        }
        this.memberSingleDialog.config.visible = false
      }
    }
  },

  filters: {
    timeSubString(time) {
      if (!time) {
        return
      }
      return time.substring(0, time.length - 3)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-wrap {
  width: 100px;
  height: 100px;
  position: relative;
  border: 1px dashed #ccc;
  overflow: hidden;
}
.tip-text {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  text-align: center;
  .icon {
    position: absolute;
    font-size: 40px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #b5b5b5;
  }
}
.tip-p {
  height: 40px;
  line-height: 40px;
  width: 300px;
  top: 20%;
  left: 200px;
  position: absolute;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  border: 1px solid #d3d1d1;
  padding: 2px 5px;
  cursor: pointer;
  margin: 8px 8px 7px 0;
}
.table-info {
  padding: 15px 20px 10px;
  box-sizing: border-box;
  background-color: #fff;
  color: #909399;
  font-size: 14px;
  position: absolute;
  top: -45px;
  left: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  .info-msg {
    margin-right: 40px;
    span {
      color: #1e90ff;
    }
  }
  .table-info-btns {
    margin-left: auto;
  }
}
.top_nav_tabe {
  width: 100%;
  height: 44px;
  // background-color: #F5F5F5;
  display: flex;
  ul {
    display: flex;
    background-color: #ffffff;
    background-image: linear-gradient(to bottom, #ebeef5, #ffffff);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
    li {
      width: 120px;
      height: 44px;
      text-align: center;
      line-height: 44px;
      background-color: #ebeef5;
      font-size: 14px;
      user-select: none;
      // border-radius: 20px;
      cursor: pointer;
      &.active {
        border-radius: 0px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: #ffffff !important;
      }
      &.borderLeft {
        border-bottom-left-radius: 10px;
      }
      &.borderRight {
        border-bottom-right-radius: 10px;
      }
    }
  }
}
.addlivecode {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
  .top_nav {
    display: flex;
    padding: 20px 20px 0;
    margin-bottom: 20px;
    background-color: #fff;
    position: relative;
    .xfo-tips {
      width: calc(100% - 550px);
      position: absolute;
      left: 250px;
      bottom: -55px;
    }
  }
}
.query-table-box {
  // box-sizing: border-box;
  display: flex;
  flex-direction: column;
  // margin-left: auto;
}
.common-table-box {
  padding: 0 20px;
  box-sizing: border-box;
  background-color: #fff;
  padding-top: 20px;
}

.title-div {
  // border: 1px solid red;
  margin: 20px;
  span {
    cursor: pointer;
    background-color: #f5f5f5;
    color: #000;
    padding: 10px 20px;
    user-select: none;
    font-size: 14px;
  }
}
.checked {
  background-color: #ffffff !important;
  // color: #fff !important;
}

.customer-dialog {
  max-height: 500px;
  overflow: auto;
  margin-bottom: 20px;
  padding-right: 20px;
  .enterprise-tag {
    display: inline-block;
    height: 28px;
    line-height: 28px;
    color: #546e95;
    padding: 0 5px;
    margin: 8px 8px 7px 0;
    border: 1px solid #546e95;
    border-radius: 3px;
  }
  .external-content {
    .external-list {
      margin-top: 20px;
    }
  }
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
</style>
