<template>
  <div class="tag-invitate-detail">
    <go-back title="详情"></go-back>
    <div class="container">
      <div class="overview">
        <div class="left">
          <div class="overview-title">基本信息</div>
          <el-form label-width="85" label-position="left">
            <el-form-item label="任务名称：">
              <div class="left-item">{{ invitationDetail.name }}</div>
            </el-form-item>
            <el-form-item label="入群引导语：">
              <div class="left-item">{{ invitationDetail.message }}</div>
            </el-form-item>
            <el-form-item label="入群人数：">
              <div class="left-item">{{ invitationDetail.joinChatQuantity }}人</div>
            </el-form-item>
            <el-form-item label="过滤客户：">
              <div class="left-item">
                {{ invitationDetail.isExcludeExistingCustomer ? '已开启' : '已关闭' }}
                <el-tooltip effect="light" placement="right" content="开启后已在群聊中的客户将不会收到邀请">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item label="创建时间：">
              <div class="left-item">{{ invitationDetail.createTime | formatterTime }}</div>
            </el-form-item>
            <!-- <el-form-item label="群聊：">
              <div class="group-content">
                <img class="group-img" src="../../../images/group-icon.png"/>
                <div class="group-msg">
                  <div class="msg-name">{{ groupChat.groupChatName }}</div>
                  <div class="msg-numb">{{ groupChat.groupChatQuantity }} / 200人 <span>本次入群：{{ groupChat.thisGroupChatQuantity }}人</span></div>
                </div>
                <el-popover
                  placement="bottom"
                  trigger="hover">
                  <img class="qrcode-big" style="width: 200px; height: 200px;" :src="imgHost + groupChat.qrcode"/>
                  <img slot="reference" class="qrcode-small" :src="imgHost + groupChat.qrcode"/>
                </el-popover>
              </div>
            </el-form-item> -->
          </el-form>
        </div>
        <div class="right">
          <div class="overview-title">客户统计</div>
          <div class="right-box">
            <div class="right-statistics">
              <div class="s-item item-divider">
                <div class="count">{{ invitationStat.joinQuantity }}</div>
                <div class="name">已入群客户</div>
              </div>
              <div class="s-item">
                <div class="count">{{ invitationStat.unJoinQuantity }}</div>
                <div class="name">未入群客户</div>
              </div>
            </div>
            <div class="right-statistics">
              <div class="s-item item-divider">
                <div class="count">{{ invitationStat.inviteQuantity }}</div>
                <div class="name">
                  已邀请客户
                  <el-tooltip effect="light" placement="top" content="邀请客户列表中，已收到成员推送的入群邀请的客户数">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
              </div>
              <div class="s-item">
                <div class="count">{{ invitationStat.unInviteQuantity }}</div>
                <div class="name">
                  未邀请客户
                  <el-tooltip effect="light" placement="top" content="邀请客户列表中，未收到成员推送的入群邀请的客户数">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="right-statistics">
              <div class="s-item item-divider">
                <div class="count">{{ invitationStat.finishSendQuantity }}</div>
                <div class="name">
                  完成发送成员
                  <el-tooltip
                    effect="light"
                    placement="top"
                    content="已将邀请客户入群的群发任务，群发给客户的员工数，若成员收到了多条邀请群发的任务，需将全部推送都发送，则视为已发送"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
              </div>
              <div class="s-item">
                <div class="count">{{ invitationStat.unFinishSendQuantity }}</div>
                <div class="name">
                  未完成发送成员
                  <el-tooltip
                    effect="light"
                    placement="top"
                    content="收到群发任务的成员，未发送群发邀请的成员数。若成员收到了多条邀请群发的任务，有一条未发送的任务，则视为未完成"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
          <div class="overview-group">
            <div class="overview-title">群聊</div>
            <div class="group-list">
              <div class="group-content" v-for="(item, index) in groupChatList" :key="index">
                <img class="group-img" src="../../../images/group-icon.png" />
                <div class="group-msg">
                  <div class="msg-name">{{ item.groupChatName }}</div>
                  <div class="msg-numb">
                    {{ item.groupChatQuantity }} / 200人 <span>本次入群：{{ item.thisGroupChatQuantity || 0 }}人</span>
                  </div>
                </div>
                <el-popover placement="bottom" trigger="hover">
                  <img class="qrcode-big" style="width: 200px; height: 200px;" :src="imgHost + item.qrcode" />
                  <img slot="reference" class="qrcode-small" :src="imgHost + item.qrcode" />
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-list" id="table">
        <tab-button :navList="navList" @change="changeNav"></tab-button>
        <div class="list-box" v-if="activeTab === 0">
          <!-- <div class="query-table-box">
            <el-form inline label-width="80px" label-position="right" size="small">
              <el-form-item label="客户名称">
                <el-input placeholder="请输入要搜索的客户"></el-input>
              </el-form-item>
              <el-form-item label="送达状态">
                <el-select v-model="customerSearch.form.status" placeholder="请选择">
                  <el-option
                    v-for="item in customerSearch.statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否入群">
                <el-select v-model="customerSearch.form.join" placeholder="请选择">
                  <el-option
                    v-for="item in customerSearch.joinOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div> -->
          <div class="common-table-box">
            <el-table
              :data="customerSearch.tableData"
              id="customerTable"
              :header-cell-style="{ 'text-align': 'center' }"
              :height="tableHeight"
            >
              <el-table-column label="客户" align="center" prop="customerName">
                <template slot-scope="scope">
                  <div>{{ scope.row.customerName }}</div>
                </template>
              </el-table-column>
              <el-table-column label="客户头像" align="center">
                <template slot-scope="scope">
                  <el-image style="width: 50px; height: 50px" :src="scope.row.customerAvatar" fit="fill"></el-image>
                </template>
              </el-table-column>
              <el-table-column label="所属成员" align="center">
                <template slot-scope="scope">
                  <span class="member-item">
                    <i class="el-icon-user-solid icon-user">{{ scope.row.userName }}</i>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="发送状态" align="center" prop="statusName">
                <template slot-scope="scope">
                  <div>{{ scope.row.statusName }}</div>
                </template>
              </el-table-column>
              <el-table-column label="邀请群聊" align="center" prop="groupChatName">
                <template slot-scope="scope">
                  <div>{{ scope.row.groupChatName }}</div>
                </template>
              </el-table-column>
              <el-table-column label="是否入群" align="center">
                <template slot-scope="scope">
                  <div>
                    <span v-if="scope.row.isJoin">已入群</span>
                    <span v-else style="color: #ff0000;">未入群</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="goToCustomerDetail(scope.row)">客户详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="common-pagination">
            <com-pagination
              :page="customerSearch.page"
              @sizeChange="onCustSizeChange"
              @pageChange="onCustPageChange"
            ></com-pagination>
          </div>
        </div>
        <div class="list-box" v-if="activeTab === 1">
          <div class="query-table-box">
            <!-- <el-form inline label-width="100px" label-position="right" size="small">
              <el-form-item label="成员名称">
                <el-input placeholder="请输入要搜索的成员"></el-input>
              </el-form-item>
              <el-form-item label="收到任务条数">
                <el-select v-model="userSearch.form.task" placeholder="请选择">
                  <el-option
                    v-for="item in userSearch.taskOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="送达状态">
                <el-select v-model="userSearch.form.status" placeholder="请选择">
                  <el-option
                    v-for="item in userSearch.statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form> -->
            <el-button size="small" type="primary" @click="remindUserToSend">提醒成员发送</el-button>
          </div>
          <div class="common-table-box">
            <el-table
              :data="userSearch.tableData"
              id="userTable"
              :header-cell-style="{ 'text-align': 'center' }"
              :height="tableHeight"
            >
              <el-table-column label="成员" align="center" prop="userName">
                <template slot-scope="scope">
                  <div>{{ scope.row.userName }}</div>
                </template>
              </el-table-column>
              <el-table-column label="成员头像" align="center" prop="userAvatar">
                <template slot-scope="scope">
                  <el-image style="width: 50px; height: 50px" :src="scope.row.userAvatar" fit="fill"></el-image>
                </template>
              </el-table-column>
              <el-table-column label="客户数" align="center">
                <template slot-scope="scope">
                  <div>{{ scope.row.customerQuantity }}</div>
                </template>
              </el-table-column>
              <el-table-column label="已邀请" align="center">
                <template slot-scope="scope">
                  <div>{{ scope.row.inviteQuantity }}</div>
                </template>
              </el-table-column>
              <el-table-column label="收到任务条数" align="center">
                <template slot-scope="scope">
                  <div>{{ scope.row.taskQuantity }}</div>
                </template>
              </el-table-column>
              <el-table-column label="发送状态" align="center">
                <template slot-scope="scope">
                  <div>{{ scope.row.sendStatusName }}</div>
                </template>
              </el-table-column>
              <!-- <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" v-if="scope.row.sendStatus === 0" @click="remindUserToSend(scope.row)">提醒发送</el-button>
                  <el-tooltip
                    v-else
                    content="该员工已发送该消息，无法提醒发送"
                    placement="top"
                    effect="light"
                  >
                    <span class="action-disabled">提醒发送</span>
                  </el-tooltip>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
          <div class="common-pagination">
            <com-pagination
              :page="userSearch.page"
              @sizeChange="onUserSizeChange"
              @pageChange="onUserPageChange"
            ></com-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack'
import TabButton from '../../../components/components/TabButton'
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
export default {
  components: { GoBack, TabButton, ComPagination, ComDialog },
  data() {
    return {
      invitationDetail: {}, // 详情表单
      invitationStat: {}, // 统计
      groupChatList: [], // 群聊
      invitationId: '', // 标签建群id
      navList: [
        { name: '客户详情', isActive: true },
        { name: '成员详情', isActive: false }
      ],
      activeTab: 0, // 默认选中的标签项
      tableHeight: 400,
      customerSearch: {
        // 客户列表搜索表单
        form: {
          status: '1', // 送达状态
          join: '1' // 是否入群
        },
        statusOptions: [
          // 送达状态
          { value: '1', label: '未收到邀请' },
          { value: '2', label: '已收到邀请' },
          { value: '3', label: '客户已不是好友' },
          { value: '4', label: '客户接受已达上限' }
        ],
        joinOptions: [
          // 是否入群
          { value: '1', label: '已入群' },
          { value: '2', label: '未入群' }
        ],
        tableData: [], // 表单链接
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0
        }
      },
      userSearch: {
        // 成员列表搜索表单
        form: {
          task: '1', // 收到任务条数
          status: '1' // 发送状态
        },
        taskOptions: [
          // 收到任务条数
          { value: '1', label: '1条' },
          { value: '2', label: '多条' }
        ],
        statusOptions: [
          // 发送状态
          { value: '1', label: '未完成发送' },
          { value: '2', label: '已完成发送' }
        ],
        tableData: [], // 表单链接
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0
        }
      }
    }
  },
  filters: {
    statusType(val) {
      switch (val) {
        case 0:
          return '未收到，成员未确认发送'
        case 1:
          return '已收到邀请'
        case 2:
          return '已加入群'
      }
    },
    formatterTime(time) {
      if (time) {
        return time.slice(0, time.length - 3)
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.invitationId = this.$route.query.id
      this.getGroupInvitationDetail()
      this.getInvitCustomerPage()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  },
  methods: {
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_TOP_HEIGHT = 20
      this.tableHeight =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_TOP_HEIGHT
      // console.log('返回高度', this.tableHeight)
    },
    getGroupInvitationDetail() {
      this.$http.getGroupInvitationDetail({ id: this.invitationId }).then((res) => {
        this.invitationDetail = res.data.data
        this.invitationStat = res.data.data.stat
        this.groupChatList = res.data.data.groupChatList
      })
    },
    // 获取客户列表
    getInvitCustomerPage() {
      let params = {
        pageNum: this.customerSearch.page.pageNum,
        pageSize: this.customerSearch.page.pageSize,
        groupInvitationId: this.invitationId
      }
      this.$http.getGroupInvitationCustomerPage(params).then((res) => {
        this.customerSearch.tableData = res.data.data.list
        this.customerSearch.page.total = res.data.data.total
      })
    },
    // 获取成员列表
    getInvitUserPage() {
      let params = {
        pageNum: this.userSearch.page.pageNum,
        pageSize: this.userSearch.page.pageSize,
        groupInvitationId: this.invitationId
      }
      this.$http.getGroupInvitionUserPage(params).then((res) => {
        this.userSearch.tableData = res.data.data.list
        this.userSearch.page.total = res.data.data.total
      })
    },
    changeNav(val) {
      console.log('返回', val)
      this.activeTab = val
      if (this.activeTab === 0) {
        this.getInvitCustomerPage()
      } else if (this.activeTab === 1) {
        this.getInvitUserPage()
      }
    },
    onCustSizeChange(val) {
      this.customerSearch.page.pageSize = val
      this.customerSearch.page.pageNum = 1
      this.getInvitCustomerPage()
    },
    onCustPageChange(val) {
      this.customerSearch.page.pageNum = val
      this.getInvitCustomerPage()
    },
    onUserSizeChange(val) {
      this.userSearch.page.pageSize = val
      this.userSearch.page.pageNum = 1
      this.getInvitUserPage()
    },
    onUserPageChange(val) {
      this.userSearch.page.pageNum = val
      this.getInvitUserPage()
    },
    // 客户详情
    goToCustomerDetail(row) {
      this.$router.push(`/main/scrm/customer-management/customer/detail?id=${row.customerId}&wxid=${row.wxCustomerId}`)
    },
    // 提醒成员发送
    remindUserToSend() {
      // this.$message.success('提醒成功')
      this.$http.remindUserToSendTagInvit({ id: this.invitationId }).then((res) => {
        this.$message.success('提醒成功')
        this.getInvitUserPage()
      })
    }
  },
  destroyed() {
    window.onresize = ''
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-size: 14px;
  .overview {
    display: flex;
    line-height: 20px;
    margin-bottom: 20px;
    .overview-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .left {
      padding: 20px;
      background: #ffffff;
      flex-basis: 30%;
      margin-right: 20px;
      max-width: 400px;
      .left-item {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .right {
      padding: 20px;
      background: #ffffff;
      flex-basis: 70%;
      .right-box {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        .right-statistics {
          display: flex;
          background: #fbfdff;
          border: 1px solid #cfe8ff;
          flex-basis: 32%;
          .s-item {
            position: relative;
            flex: 1;
            padding: 30px 0;
            text-align: center;
            .count {
              margin-bottom: 10px;
            }
          }
          .item-divider {
            &::after {
              content: '';
              width: 1px;
              height: 38px;
              background: #e9e9e9;
              position: absolute;
              top: 50%;
              -webkit-transform: translateY(-50%);
              transform: translateY(-50%);
              right: 0;
            }
          }
        }
      }
      .group-list {
        display: flex;
        flex-wrap: wrap;
        .group-content {
          display: flex;
          padding: 10px;
          background: #ffffff;
          border: 1px solid #eee;
          line-height: 20px;
          width: 260px;
          margin: 0 10px 10px 0;
          .group-img {
            width: 40px;
            height: 40px;
          }
          .group-msg {
            width: 170px;
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
          .qrcode-small {
            width: 40px;
            height: 40px;
          }
          .qrcode-big {
            width: 100px;
            height: 100px;
          }
        }
      }
    }
  }
}
.table-list {
  .list-box {
    background: #ffffff;
    .query-table-box {
      padding: 20px 20px 0 20px;
    }
    .common-table-box {
      padding: 20px 20px 0 20px;
      .member-item {
        display: inline-block;
        border: 1px solid #dcdfe6;
        padding: 2px 5px;
        margin: 0 8px 7px 0;
        border-radius: 3px;
        .icon-user {
          color: #294a7b;
        }
      }
      .action-disabled {
        color: #c0c4cc;
      }
    }
  }
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
::v-deep .el-form-item {
  margin-bottom: 10px;
}
</style>
