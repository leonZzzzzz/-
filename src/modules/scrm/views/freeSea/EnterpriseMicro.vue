<template>
  <!-- 客户来源先整体隐藏，包括查询条件 勿删 -->
  <div>
    <div class="addlivecode">
      <div class="container">
        <div class="top_nav">
          <div class="query-table-box">
            <el-form inline :model="searchForm" label-width="70px" label-position="right" size="small">
              <!-- <el-form-item label="认领状态">
                <el-select v-model="activeName" @change="handleClick" placeholder="请选择">
                  <el-option label="已认领" value="first"></el-option>
                  <el-option label="未认领" value="second"> </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="客户昵称">
                <el-input
                  v-model="searchForm.name"
                  clearable
                  @input="searchLiveCodeList"
                  placeholder="请输入客户昵称"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="客户来源">
                <el-select v-model="searchForm.addWay" clearable @change="searchLiveCodeList" placeholder="请选择">
                  <el-option v-for="item in source" :key="item.value" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="认领成员">
                <el-input
                  v-model="searchForm.userName"
                  clearable
                  @input="searchLiveCodeList"
                  placeholder="请输入认领成员"
                ></el-input>
              </el-form-item>
              <br />
              <el-form-item label-width="100px" label="进入回收时间">
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
              <el-form-item> </el-form-item>
            </el-form>
          </div>
          <div class="xfo-tips">
            <el-alert title="企微客户指已添加为外部好友的客户" type="warning" :closable="false" show-icon> </el-alert>
          </div>
        </div>
        <tab-button position="right" :navList="navList" @change="changeNav"></tab-button>
        <div>
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
              <el-table-column label="原归属成员" prop="handoverUser" align="center"> </el-table-column>
              <el-table-column label="进入回收时间" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.recycleTime | timeSubString }}</span>
                </template>
              </el-table-column>
              <el-table-column label="认领人" prop="claimUser" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.claimUser || '' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="认领时间" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.lastClaimTime | timeSubString }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="客户来源" prop="sourceInfo" align="center"> </el-table-column> -->
              <el-table-column label="认领状态" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.claimStatus == 'allocating'">认领中</span>
                  <span v-if="scope.row.claimStatus == 'success'">认领成功</span>
                  <span v-if="scope.row.claimStatus == 'failure'">认领失败</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class="caozuo-column">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.claimStatus == 'allocating'"
                    type="text"
                    @click="sendTransferRemindToHandoverUser(scope.row.id)"
                    >提醒</el-button
                  >
                  <el-button
                    v-if="scope.row.status == 'un_claimed'"
                    type="text"
                    @click=";(innerVisible = true), (updateId = scope.row.id)"
                    >认领</el-button
                  >
                  <el-button type="text" v-if="scope.row.claimStatus == 'failure'" @click="sendBack(scope.row.id)"
                    >退回至未认领</el-button
                  >
                  <el-button
                    type="text"
                    @click="$router.push('../customer-management/customer/Detail?id=' + scope.row.customerId+'&wxid='+scope.row.wxCustomerId)"
                    >详情</el-button
                  >
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
              <el-table-column label="原归属成员" prop="handoverUser" align="center"> </el-table-column>
              <!-- <el-table-column label="客户来源" prop="sourceInfo" align="center"> </el-table-column> -->
              <el-table-column label="进入回收时间" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.recycleTime | timeSubString }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class="caozuo-column">
                <template slot-scope="scope">
                  <!-- <el-button type="text" @click=";(innerVisible = true), (updateId = scope.row.id)">分配</el-button> -->
                  <el-button type="text" @click="openMemberSingleDialog(scope.row.id)">分配</el-button>
                  <el-button
                    type="text"
                    @click="$router.push('../customer-management/customer/Detail?id=' + scope.row.customerId+'&wxid='+scope.row.wxCustomerId)"
                    >详情</el-button
                  >
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
    <!-- 分配客户，选择成员弹窗 -->
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
import FileSaver from 'file-saver'
import claimMember from './claimMember'
import TabButton from '@/modules/scrm/components/components/TabButton.vue'
import MemberTreeSingleDialog from '../../components/components/MemberTreeSingleDialog'
export default {
  components: { TabButton, ComPagination, claimMember, MemberTreeSingleDialog },
  data() {
    return {
      navList: [
        { name: '未认领', isActive: false },
        { name: '已认领', isActive: true }
      ],
      navIndex: 0,
      model: {
        name: '',
        mobile: '',
        userId: ''
      },
      modelname: [],
      activeName: 'first',
      innerVisible: false,
      updateId: '',
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
        type: 'scrm_customer'
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
      memberSingleDialog: { // 分配客户，选择关联人员，只支持选择一人
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
    if (this.nowIndex == 0) {
      this.searchForm.type = 'scrm_customer'
      this.searchForm.status = 'claimed'
    } else if (this.nowIndex == 1) {
      this.searchForm.type = 'un_scrm_customer'
      this.searchForm.status = 'claimed'
    }
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
    // 查询1
    searchLiveCodeList() {
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.BCclient()
    },
    // 企微客户列表
    BCclient() {
      var json3 = JSON.parse((JSON.stringify(this.searchForm) + JSON.stringify(this.page)).replace(/}{/, ','))
      this.$http.BusinessWechatClient(json3).then(res => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
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
    innerclose() {
      this.updateId = ''
      this.innerVisible = false
      this.BCclient()
    },
    // 获取录入客户选择的成员信息
    chooseConfirm(list) {
      this.modelname = []
      this.modelname.push(list)
      this.model.userId = list.userId
    },
    // 提醒认领中的企微成员
    sendTransferRemindToHandoverUser(id) {
      this.$confirm('提示企微客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.sendTransferRemindToHandoverUser({ id }).then(() => {
            this.$message({
              type: 'success',
              message: '提示成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提示'
          })
        })
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
        window.innerHeight - TOP_HEADER_HEIGHT - PAGINATION_HEIGHT - PADDING_BOTTOM_HEIGHT - PADDING_TOP_HEIGHT - 100
      this.height = height
    },
    openMemberSingleDialog(val) {
      this.memberSingleDialog.selectedMembers = []
      this.memberSingleDialog.customerId = val
      this.memberSingleDialog.config.visible = true
    },
    // 分配客户，获取关联人员
    getSelectedMembers(list) {
      let customerId = this.memberSingleDialog.customerId
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
        })
      } else {
        this.$message.warning('请选择分配的成员')
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
  padding: 0 30px;
  box-sizing: border-box;
  color: #909399;
  font-size: 14px;
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
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
      width: calc(100% - 300px);
      position: absolute;
      left: 0;
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
