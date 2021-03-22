<template>
  <div class="loss-reminder">
    <div class="container">
      <div class="container-top">
        <el-alert type="warning" show-icon :closable="false" class="alert">
          <template>
            <div class="tixing">
              <div class="tixing-left">
                <p>
                  当企业成员被客户从微信联系人中删除时，会在客户流失列表中产生一条记录，开启[被删除通知]后，被客户删除的成员会收到一条流失提醒
                </p>

                <p>客户流失提醒功能只会记录授权给小数桔成员的客户流失信息，未被授权的成员信息将不会展示在列表中。</p>
              </div>
              <div class="tixing-right">
                <i class="el-icon-circle-check" style="font-size: 16px" v-if="isOpen == true"></i>
                <i class="el-icon-circle-close" style="font-size: 16px" v-if="isOpen == false"></i>
                &nbsp;被删除提醒&nbsp;&nbsp;
                <el-switch v-model="isOpen" @change="handleOpenStatus(isOpen)"></el-switch>
              </div>
            </div>
          </template>
        </el-alert>
        <!-- <div class="quert-tixing">
          <div class="tixing-left">
            <div>
              <p>
                当企业成员被客户从微信联系人中删除时，会在客户流失列表中产生一条记录，开启[被删除通知]后，被客户删除的成员会收到一条流失提醒
              </p>

              <p>客户流失提醒功能只会记录授权给小数桔成员的客户流失信息，未被授权的成员信息将不会展示在列表中。</p>
            </div>

            <div class="tixing-right">
              <i class="el-icon-circle-check" v-if="isOpen == true"></i>
              <i class="el-icon-circle-close" v-if="isOpen == false"></i>
              被删除提醒
              <el-switch v-model="isOpen" @change="handleOpenStatus(isOpen)"></el-switch>
            </div>
          </div>
        </div> -->
        <!-- <div class="violation-notice">
          <el-tooltip
            effect="light"
            placement="right"
            content="开启后,当企业微信被客户删除时,被删除的企业成员将收到一条消息提醒"
            style="margin-left:5px"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div> -->
        <div class="query-table-box">
          <el-form inline :model="searchForm" label-width="100px" label-position="right" size="small">
            <el-form-item label=" 客户">
              <div>
                <el-input
                  placeholder="请输入客户"
                  v-model="form.customerName"
                  @input="getLoseMindePage"
                  clearable
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="所属成员">
              <div>
                <el-input
                  placeholder="请输入所属成员 "
                  v-model="form.userName"
                  @input="getLoseMindePage"
                  clearable
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="流失时间">
              <el-date-picker
                v-model="form.dateTimeRange"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="searchCustomerList"
                clearable
              >
              </el-date-picker>
            </el-form-item>
            <!-- <el-form-item>
            <el-button size="small" type="primary" @click="searchCustomerList">查询</el-button>
            <el-button size="small" type="info" @click="refreshSearch">重置</el-button>
          </el-form-item> -->
          </el-form>
        </div>
      </div>
      <!-- <div class="radio-div">
        <el-checkbox label="isCheck">提醒通知</el-checkbox><span>(点击是否开启提醒通知)</span>
      </div> -->
      <div class="common-table-box">
        <el-table
          :data="tableData"
          width="100%"
          id="table"
          class="el-table"
          :cell-style="changeCellStyle"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          :height="height"
        >
          <el-table-column label="客户">
            <template slot-scope="scope">
              <div class="username-form">
                <el-image class="username-image" :src="scope.row.customerAvatar"></el-image>
                <span class="username-name">{{ scope.row.customerName }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="所属成员" align="center" class="special-column" width="200px">
            <template slot-scope="scope">
              <div class="tagname-form">
                <!-- <span class="tagName"> <i class="el-icon-user-solid icon-user"></i>{{ scope.row.userName }}</span> -->
                <Tag type="light"> {{ scope.row.userName }} </Tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="isConOpen == true" label="上次会话时间" align="center">
            <template slot-scope="scoped">
              <div>
                {{ scoped.row.lastConversationTime | allTableTimefilters }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="流失时间" align="center" prop="deleteTimeToDateTime">
            <template slot-scope="scoped">
              <div>{{ scoped.row.deleteTimeToDateTime | allTableTimefilters }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="conversationId"> </el-table-column> -->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="openChatRecode(scope.row)" v-if="scope.row.conversationId != undefined">
                  聊天记录
                </el-button>
                <el-button type="text" v-else style="color:#cccccc">聊天记录</el-button>
                <el-button type="text" @click="showCustomer(scope.row)">
                  客户详情
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>
    <!-- <com-dialog
      :config="noticeDialog.config"
      @closeDialog="closeNoticeDialog"
      class="dialogSelect"
      @click="isPeopleBlock = false"
    >
      <div class="dialogSelect-title">
        <el-alert
          title="开启通知后，选择的【接收通知管理员】将会在企业微信中收到提醒通知"
          type="warning"
          :closable="false"
          center
          show-icon
        >
        </el-alert>
      </div>
      <div class="dialogSelect-content">
        <el-form label-position="right" label-width="120px">
        
          <el-form-item label="当前状态:">
            <el-switch> </el-switch>
            <span class="right-span">开启</span>
          </el-form-item>
          <el-form-item label="接受通知管理员:">
            <div class="dialogSelect-people-select" @click.stop="openPeopleSelect()">
            
              <div class="dialogSelect-poeple-item">
                <div v-for="(allAdmin, allIndex) in adminList" :key="allIndex">
                  <img :src="allAdmin.thumbAvatar" alt="" />
                  <span>{{ allAdmin.name }}</span>
                </div>
              </div>
          
              <div class="dialogSelect-people-more" v-if="adminList.length > 2">...等{{ adminList.length }}人</div>
              <i class="el-icon-arrow-down" v-if="isPeopleBlock == false"></i>
              <i class="el-icon-arrow-up" v-if="isPeopleBlock == true"></i>
            </div>
            <transition name="el-zoom-in-top">
              <div class="dialogSelect-people-block" v-if="isPeopleBlock == true" id="box">
                <div class="dialog-fixed">
                  <div class="dialogSelect-block-top">
                    <span>全部管理员( {{ searchUserName.total }} )</span>
               
                  </div>
                  <div class="dialogSelect-block-input">
                    <el-input
                      placeholder="请输入管理员名称"
                      size="mini"
                      v-model="searchAdmin.name"
                      @input="getChooseUser"
                      class="input-class"
                    ></el-input>
                  </div>
                </div>
                <div class="dialogSelect-bottom">
                  <div
                    class="dialogSelect-bottom-item"
                    v-for="(adminItem, adminIndex) in adminPageList"
                    :key="adminIndex"
                    @click="chooseItemAdmin(adminItem)"
                  >
                    <el-checkbox v-model="adminItem.ischoose"></el-checkbox>
                    <img :src="adminItem.thumbAvatar" alt="" />
                    <span>{{ adminItem.name }}</span>
                  </div>
             
                </div>
                <div class="bottom-fixed">
                  <el-button type="primary" size="mini" @click="addCustomerBtn">确定</el-button>
                </div>
              </div>
            </transition>
          </el-form-item>
          <el-form-item label="通知频率:">
            <el-radio-group v-model="getConfig.frequency">
              <el-radio :label="'anytime'">每次通知</el-radio>
              <el-radio :label="'everyday'">每天通知一次</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
    
      </div>
      <div class="dialogSelect-btn">
        <el-button @click="closeNoticeDialog()">取消</el-button>
        <el-button type="primary" @click="sumbitNotice()">保存</el-button>
      </div>
    </com-dialog> -->
  </div>
</template>
<script>
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
// import CustomerList from '../../../components/common/CustomerList'
import Tag from '../../../components/components/Tag'
export default {
  components: { ComPagination, Tag, ComDialog },
  data() {
    return {
      model: {},
      searchForm: {
        dateTimeRange: '',
        groups: ''
      },
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      height: 400,
      customerDialog: {
        config: {
          width: '800px',
          title: '选择关联人员',
          visible: false
        }
      },
      form: {
        customerName: '',
        userName: '',
        dateTimeRange: ''
      },
      noticeDialog: {
        config: {
          width: '600px',
          title: '提醒通知',
          visible: false
        }
      },
      isPeopleBlock: false, //管理员下拉
      adminList: [], //后台返回的管理员列表
      //获取提醒设置的数据
      getConfig: {
        // status: 'disabled',
      },
      userId: '',
      searchAdmin: {
        name: '',
        total: 0
      },
      reChooseList: [], //已选中打勾的人的数据
      //搜索内部人员
      searchUserName: {
        name: '',
        total: 0
      },
      userPageList: [], //搜索成员列表
      chooseAdminList: [], //选择的客户列表
      adminPageList: [],
      isOpen: false, //是否打开了被删除提醒
      isConOpen: false
    }
  },
  created() {
    this.getLoseMindePage()
    this.getConfigNotice()
    this.getOpenStatus()
  },
  searchCustomerList() {
    this.page.pageNum = 1
    this.page.pageSize = 15
    this.page.total = 0
    this.getLoseMindePage()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  },
  methods: {
    chooseItemAdmin(adminItem) {
      if (this.userId != '') {
        this.reChooseList = this.userId.split(',')
        this.userId = ''
      }

      adminItem.ischoose = !adminItem.ischoose
      this.adminPageList.forEach(item => {
        if (item.ischoose == true) {
          this.reChooseList.push(item.userId)
        }
        if (item.ischoose == false) {
          for (var i = 0; i < this.reChooseList.length + 1; i++) {
            if (this.reChooseList[i] == item.userId) {
              this.reChooseList.splice(i, 1)
            }
          }
        }
      })
      var hash = []
      for (var i = 0; i < this.reChooseList.length; i++) {
        if (!hash.includes(this.reChooseList[i])) {
          hash.push(this.reChooseList[i])
        }
      }
      this.reChooseList = hash
    },
    addCustomerBtn() {
      if (this.userId == '') {
        this.userId = this.reChooseList.join(',')
      }
      this.adminList = []
      // let chooseList = []
      this.userPageList.forEach(item => {
        for (var i = 0; i < this.reChooseList.length + 1; i++) {
          if (this.reChooseList[i] == item.userId) {
            this.adminList.push(item)
          }
        }
      })
      if (this.userId == '') {
        this.$message.warning('请选择至少一个管理员')
        return
      }
      this.isPeopleBlock = false
    },
    //设置窗口取消按钮

    closeNoticeDialog() {
      this.noticeDialog.config.visible = false
      this.isPeopleBlock = false
    },
    //打开管理员下拉列表事件
    openPeopleSelect() {
      this.isPeopleBlock = !this.isPeopleBlock
      // console.log(this.userId)
      if (this.userId != '') {
        this.chooseAdminList = []
        this.adminPageList = []
        let params = {
          name: this.searchAdmin.name,
          pageSize: 999,
          pageNum: 1
        }
        this.$http.getPermitUserPage(params).then(res => {
          this.chooseAdminList = res.data.data.list
          this.searchUserName.total = res.data.data.total
          let msg = []
          msg = this.userId.split(',')
          for (var i = 0; i < this.chooseAdminList.length; i++) {
            if (msg.includes(this.chooseAdminList[i].userId)) {
              this.adminPageList.push({
                enable: this.chooseAdminList[i].enable,
                id: this.chooseAdminList[i].id,
                mobile: this.chooseAdminList[i].mobile,
                name: this.chooseAdminList[i].name,
                status: this.chooseAdminList[i].status,
                thumbAvatar: this.chooseAdminList[i].thumbAvatar,
                userId: this.chooseAdminList[i].userId,
                ischoose: true
              })
            } else {
              this.adminPageList.push({
                enable: this.chooseAdminList[i].enable,
                id: this.chooseAdminList[i].id,
                mobile: this.chooseAdminList[i].mobile,
                name: this.chooseAdminList[i].name,
                status: this.chooseAdminList[i].status,
                thumbAvatar: this.chooseAdminList[i].thumbAvatar,
                userId: this.chooseAdminList[i].userId,
                ischoose: false
              })
            }
          }
        })
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
    searchCustomerList() {
      this.getLoseMindePage()
    },
    refreshSearch() {
      this.page.pageNum = 1
      this.page.pageSize = 20
      this.form.customerName = ''
      this.form.userName = ''
      this.getLoseMindePage()
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getLoseMindePage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getLoseMindePage()
    },
    changeCellStyle(row) {
      if (row.column.label === '客户名称') {
        return 'overflow:hidden; text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2;  ' // 修改的样式
      } else {
        return ''
      }
    },
    // formatterColumn(row) {
    //   return (
    //     <div>
    //       <el-button type="text" onClick={this.openChatRecode.bind(this, row)}>
    //         聊天记录
    //       </el-button>
    //       <el-button type="text" onClick={this.showCustomer.bind(this, row)}>
    //         客户详情
    //       </el-button>
    //     </div>
    //   )
    // },
    //查看聊天记录
    openChatRecode(row) {
      this.$openNewPage({path: `/main/scrm/control/message/index?conversationId=${row.conversationId}&userId=${row.wxUserId}`})
    },
    //客户详情
    showCustomer(row) {
      console.log(row.id)
      this.$openNewPage({path: `/main/scrm/customer-management/customer/detail?id=${row.customerId}&wxid=${row.wxCustomerId}`})
    },
    //点击选择客户
    handleConfirm() {},
    //打开选择列表
    openTagList() {
      this.customerDialog.config.visible = true
    },
    //点击设置按钮弹窗
    configDialog() {
      this.noticeDialog.config.visible = true
      this.chooseAdminList = []
      this.adminList = []
      // this.adminPageList = []
      let params = {
        pageSize: 999,
        pageNum: 1
      }
      this.$http.getPermitUserPage(params).then(res => {
        this.chooseAdminList = res.data.data.list
        let msg = this.userId.split(',')
        for (var i = 0; i < this.chooseAdminList.length; i++) {
          if (msg.includes(this.chooseAdminList[i].userId)) {
            this.adminList.push(this.chooseAdminList[i])
          }
        }
      })
      // if (this.getConfig.status == 'enabled') {
      //   this.noticeModel.isOpen = true
      // } else {
      //   this.noticeModel.isOpen = false
      // }
      this.getChooseUser()
    },
    getChooseUser() {
      this.chooseAdminList = []
      // this.adminList = []
      this.adminPageList = []
      let params = {
        name: this.searchAdmin.name,
        pageSize: 999,
        pageNum: 1
      }
      this.$http.getPermitUserPage(params).then(res => {
        this.chooseAdminList = res.data.data.list
        let msg = []
        if (this.reChooseList.length == 0) {
          msg = this.userId.split(',')
        } else {
          msg = this.reChooseList
        }
        for (var i = 0; i < this.chooseAdminList.length; i++) {
          if (msg.includes(this.chooseAdminList[i].userId)) {
            // this.adminList.push(this.chooseAdminList[i])
            this.adminPageList.push({
              enable: this.chooseAdminList[i].enable,
              id: this.chooseAdminList[i].id,
              mobile: this.chooseAdminList[i].mobile,
              name: this.chooseAdminList[i].name,
              status: this.chooseAdminList[i].status,
              thumbAvatar: this.chooseAdminList[i].thumbAvatar,
              userId: this.chooseAdminList[i].userId,
              ischoose: true
            })
          } else {
            this.adminPageList.push({
              enable: this.chooseAdminList[i].enable,
              id: this.chooseAdminList[i].id,
              mobile: this.chooseAdminList[i].mobile,
              name: this.chooseAdminList[i].name,
              status: this.chooseAdminList[i].status,
              thumbAvatar: this.chooseAdminList[i].thumbAvatar,
              userId: this.chooseAdminList[i].userId,
              ischoose: false
            })
          }
        }
      })
    },
    //点击开关按钮
    handleOpenStatus(isOpen) {
      //true为关闭状态
      if (isOpen == true) {
        this.$confirm('是否开启被删除提醒？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.model.value = 1
            this.$http.updateConifgMessage(this.model).then(() => {
              this.$message.success('被删除提醒已开启')
              this.getConfigNotice()
            })
          })
          .catch(() => {
            this.model.isShow = !this.model.isShow
          })
      }
      //false为开启状态
      if (isOpen == false) {
        this.$confirm('是否关闭被删除提醒？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.model.value = 0
            this.$http.updateConifgMessage(this.model).then(() => {
              this.$message.success('被删除提醒已关闭')
              this.getConfigNotice()
            })
          })
          .catch(() => {
            this.isOpen = !this.isOpen
          })
      }
    },
    //获取列表
    getLoseMindePage() {
      let date = this.form.dateTimeRange
      let startDeleteTime = ''
      let endDeleteTime = ''
      if (date) {
        startDeleteTime = date[0]
        endDeleteTime = date[1]
      }
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        userName: this.form.userName,
        customerName: this.form.customerName,
        showConversation: true,
        startDeleteTime: startDeleteTime,
        endDeleteTime: endDeleteTime
      }
      this.$http.getLoseMindePage(params).then(res => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    getConfigNotice() {
      this.$http.getConfigNotice().then(res => {
        this.model = res.data.data
        if (this.model.value == 0) {
          this.isOpen = false
        }
        if (this.model.value == 1) {
          this.isOpen = true
        }
        console.log(this.model)
      })
    },
    getOpenStatus() {
      this.$http.getOpenStatus().then(res => {
        this.isConOpen = res.data.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.loss-reminder {
  width: 100%;
  height: 100%;
  position: relative;
  .container {
    background-color: #fff;
    border: 1px solid #fff;
    .container-top {
      width: 100%;
      height: 100%;

      .alert {
        margin-top: 20px;
        width: 97%;
        margin-left: 20px;
        // margin-right: 40px;
        // border: 1px solid green;
        // margin: 20px;
        .tixing {
          // display: flex;

          justify-content: space-between;
          .tixing-left {
            p {
              line-height: 20px;
              left: 20px;
              font-size: 14px;
            }
          }
          .tixing-right {
            right: 10px;
            top: 15px;
            position: absolute;
            margin-top: 5px;
            user-select: none;
            text-align: right;
            color: #606266;
            font-size: 14px;
            display: flex;
            align-items: center;
          }
        }
      }

      // .quert-tixing {
      //   padding-top: 20px;
      //   .tixing-left {
      //     display: flex;
      //     background-color: #fdf6ec;
      //     color: #e6a23c;
      //     margin-left: 20px;
      //     font-size: 14px;
      //     line-height: 20px;
      //     padding: 10px 0px 10px 20px;
      //     margin-right: 20px;
      //     .tixing-right {
      //       line-height: 40px;
      //       user-select: none;
      //       font-size: 14px;
      //       color: #606266;
      //       margin-right: 20px;
      //       margin-left: auto;
      //     }
      //   }
      // }
      // .violation-notice {
      //   font-size: 14px;
      //   margin-top: 25px;
      //   margin-left: 20px;
      //   color: #606266;
      //   user-select: none;
      //   i {
      //     font-size: 16px;
      //     color: $--color-primary;
      //   }
      //   .violation-notice-dispose {
      //     display: inline-block;
      //     cursor: pointer;
      //     margin-left: 20px;
      //     color: $--color-primary;
      //   }
      // }
      .query-table-box {
        // border: 1px solid green;
        padding: 20px 20px 0 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        text-align: right;
        .search-content {
          display: flex;
          .search-input {
            width: 300px;
            margin-right: 10px;
          }
        }
      }
    }

    .radio-div {
      padding-left: 50px;
      padding-bottom: 10px;
      .el-checkbox {
        color: #000;
      }
      span {
        margin-left: 5px;
        color: gray;
        font-size: 14px;
      }
    }
    .common-table-box {
      padding: 0 20px;
      box-sizing: border-box;
    }
    .common-pagination {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
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
  padding: 2px 5px;
  color: #818181;
}
.tagname-form {
  min-height: 71px;

  .tagName {
    display: inline-block;
    border: 1px solid rgb(223, 220, 220);
    padding: 2px 5px;
    cursor: pointer;
    margin: 8px 8px 7px 0;
    margin-right: 8px;
    margin-bottom: 7px;
    .icon-user {
      color: #294a7b;
    }
    // .tagImage {
    //   width: 40px;
    //   height: 40px;
    // }
  }
}
.username-form {
  .username-image {
    width: 40px;
    height: 40px;
    vertical-align: middle;
  }
  .username-name {
    margin-left: 5px;
  }
}
.dialogSelect {
  .dialogSelect-title {
    .el-alert {
      text-align: center;
    }
  }
  .dialogSelect-content {
    padding: 20px 0;
    .right-span {
      margin-left: 5px;
    }
    .dialogSelect-people-select {
      position: relative;
      user-select: none;
      cursor: pointer;
      border-radius: 5px;
      width: 260px;
      height: 35px;
      border: 1px solid #d2d3d4;
      display: flex;
      justify-content: flex-start;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover {
        border-color: $--color-primary;
      }
      .dialogSelect-poeple-item {
        // border: 1px solid red;
        width: 200px;
        height: 33px;
        flex: 1.5;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // display: -webkit-box;
        // -webkit-line-clamp: 1;
        // -webkit-box-orient: vertical;
        display: flex;
        div {
          display: flex;
          border: 1px solid #fff;
          img {
            margin-left: 10px;
            margin-top: 5px;
            width: 25px;
            height: 25px;
          }
          span {
            margin-left: 5px;
          }
        }
      }
      .dialogSelect-people-more {
        margin-left: 10px;
        flex: 0.6;
      }
      i {
        margin-left: auto;
        margin-right: 5px;
        line-height: 35px;
      }
    }
    .dialogSelect-people-block {
      top: 40px;
      z-index: 999;
      position: absolute;
      width: 260px;
      height: 350px;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 5px;
      }
      .dialog-fixed {
        z-index: 999;
        background-color: #fff;
        position: fixed;
        width: 250px;
        .dialogSelect-block-top {
          color: #606266;
          display: flex;
          justify-content: space-between;
          span {
            &:nth-child(1) {
              margin-left: 10px;
            }
          }
          .el-button {
            margin-right: 10px;
          }
        }
        .dialogSelect-block-input {
          padding: 0 10px;
        }
      }
      .dialogSelect-bottom {
        margin-top: 75px;
        margin-bottom: 45px;
        overflow-x: hidden;
        .dialogSelect-bottom-item {
          // border: 1px solid red;
          cursor: pointer;
          width: 250px;
          height: 50px;
          display: flex;
          &:hover {
            background-color: #ccc;
          }
          .el-checkbox {
            // border: 1px solid green;
            flex: 0.5;
            line-height: 50px;
            margin-left: 10px;
          }
          img {
            margin-top: 5px;
            // margin-left: -30px;
            // border: 1px solid black;
            width: 40px;
            height: 40px;
            flex: 0.5;
            border-radius: 5px;
          }
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 4;
            margin-left: 5px;
            line-height: 50px;
          }
        }
      }
      .bottom-fixed {
        border-top: 1px solid rgb(246, 245, 245);
        z-index: 999;
        background-color: #fff;
        position: fixed;
        width: 260px;
        top: 615px;
        text-align: right;
        padding: 5px 0;
        .el-button {
          margin-right: 20px;
        }
      }
    }
  }
  .dialogSelect-btn {
    display: flex;
    justify-content: flex-end;
    // border: 1px solid red;
  }
}
::v-deep .el-alert__icon {
  font-size: 20px;
  width: 20px;
}
::v-deep .el-alert__description {
  margin-top: 0;
}
</style>
