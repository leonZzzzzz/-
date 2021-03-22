<template>
  <div class="violation-div">
    <div class="violation-none" v-if="isOpen == false">
      <div class="none-image">
        <img src="../../../images/none_dispose.png" alt="" />
        <el-button type="primary" @click="changeOpenDispose">点击开通</el-button>
      </div>
    </div>
    <div class="violation-container" v-else>
      <div class="violation-container-top">
        <!-- <div>违规监测</div> -->
        <div class="violation-container-pass">
          <div class="violation-password">成员</div>
          <div class="violation-password-select" @click.stop="changeIsBlock($event)">
            <img
              :src="chooseUser.thumbAvatar || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'"
              alt=""
            />
            <div>{{ chooseUser.name || '全部成员' }}</div>
            <i class="el-icon-arrow-down" v-if="isBlock == false"></i>
            <i class="el-icon-arrow-up" v-else></i>
          </div>
          <transition name="el-zoom-in-top">
            <div class="violation-select-block" v-if="isBlock == true">
              <div class="violation-select-top">
                <div class="violation-block-title">成员({{ searchUserName.total }})</div>
                <div class="violation-block-input">
                  <el-input
                    placeholder="请输入成员名称"
                    size="mini"
                    @input="getPermitUserPage"
                    v-model="searchUserName.name"
                    prefix-icon="el-icon-search"
                  ></el-input>
                </div>
              </div>
              <div class="violation-select-bottom">
                <div class="violation-select-item" @click="chooseAllCustomer()">
                  <img src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" alt="" />
                  <div class="violation-item-name">全部成员</div>
                </div>
                <div
                  class="violation-select-item"
                  v-for="(item, index) in userPageList"
                  :key="index"
                  @click="chooseItem(item)"
                >
                  <img :src="item.thumbAvatar" alt="" />
                  <div class="violation-item-name">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </transition>
          <div class="violation-notice">
            <i class="el-icon-circle-check" v-if="getConfig.status == 'enabled'"></i>
            <i class="el-icon-circle-close" v-if="getConfig.status == 'disabled'"></i>

            提醒通知：{{ getConfig.status == 'enabled' ? '已开启' : getConfig.status == 'disabled' ? '已关闭' : '' }}
            <span class="violation-notice-dispose" @click="configDialog">设置</span>
          </div>
          <div class="violation-search">
            <div class="violation-search-left">
              <span>客户名称</span>
              <el-input
                size="mini"
                style="width: 150px"
                placeholder="请输入客户名称"
                v-model="getMessageList.conversationName"
                @input="getSessionSensitive"
                clearable
              ></el-input>
            </div>
            <div class="violation-search-right">
              <span>发送时间</span>
              <el-date-picker
                size="mini"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                v-model="sendTime"
                @change="getSessionSensitive"
              >
              </el-date-picker>
            </div>
          </div>
        </div>
      </div>
      <div class="violation-contain-center">
        <div class="violation-contain-all">全部敏感词</div>
        <div class="violation-contain-key">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addWord()">添加敏感词</el-button>
          <el-button :type="wordIndexFlag == -1 ? 'primary' : ''" size="mini" @click="chooseAll()" plain
            >全部</el-button
          >
          <el-button
            :type="wordIndexFlag == wordIndex ? 'primary' : ''"
            size="mini"
            @click="chooseWord(wordItem, wordIndex)"
            v-for="(wordItem, wordIndex) in wordList"
            :key="wordIndex"
            plain
            >{{ wordItem.word }}</el-button
          >
          <!-- <span class="add-key" @click="addWord()"><i class="el-icon-plus"></i>添加敏感词</span> -->
          <!-- <span :class="['all-key', wordIndexFlag == -1 ? 'wordIndexFlag' : '']" @click="chooseAll()">全部</span> -->
          <!-- <div
            v-for="(wordItem, wordIndex) in wordList"
            :key="wordIndex"
            :class="['wordItem-span', wordIndexFlag == wordIndex ? 'wordIndexFlag' : '']"
            @click="chooseWord(wordItem, wordIndex)"
          >
            {{ wordItem.word }}
          </div> -->
        </div>
      </div>
      <div v-if="warningTitle == true" class="warning-div">
        <el-alert type="warning" show-icon :closable="false">
          <template>
            <div style="font-size: 14px; line-height: 20px;">
              会话内容存档接口现已到期或停止使用，请<el-button
                type="text"
                @click="goMoney"
                style="font-size:14px;margin:0 2px"
              >
                登录</el-button
              >企业微信“管理工具”查看
            </div>
          </template>
        </el-alert>
      </div>
      <div class="violation-contain-bottom">
        <div id="disbox" class="violatin-contain-box" v-if="messageItem.length != 0" ref="Box">
          <div class="violation-bottom-item" v-for="(messageItem, messageIndex) in messageItem" :key="messageIndex">
            <div class="violation-item-top">
              <img class="item-top-img" :src="messageItem.fromUserAvatar" />
              <div class="item-top-div">
                <span class="name-class">{{ messageItem.fromUserName || '未知' }}</span> 与
                <span class="name-class">{{ messageItem.conversationName || '未知' }} </span>的聊天
              </div>
              <span class="item-top-span">{{ messageItem.createTime | timeSubString }}</span>
            </div>
            <div class="violation-item-bottom">
              <div class="item-left"><img :src="messageItem.fromUserAvatar" alt="" /></div>
              <div class="item-right">
                <div>{{ messageItem.fromUserName || '未知' }}</div>
                <div class="item-right-overflow" v-html="messageItem.content || '--'"></div>
              </div>
              <div class="item-button">
                <el-button type="text" @click="moreMessage(messageItem)">查看</el-button>
              </div>
            </div>
          </div>
          <div class="violation-bottom-more">
            <el-button type="text" @click="handleMore()" v-if="getSession.pageSize == messageItem.length"
              >点击查看更多</el-button
            >
          </div>
        </div>
        <div class="violation-contain-none" v-if="messageItem.length == 0">
          <span>暂无数据</span>
        </div>
      </div>
    </div>
    <com-dialog
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
            <el-switch v-model="noticeModel.isOpen"> </el-switch>
            <span class="right-span">{{ noticeModel.isOpen == 'true' ? '关闭' : '开启' }}</span>
          </el-form-item>
          <el-form-item label="接受通知管理员:">
            <div class="dialogSelect-people-select" @click.stop="openPeopleSelect()">
              <!-- <div class="dialogSelect-poeple-item" v-if="adminList.length == 0">正在选择管理员</div> -->
              <div class="dialogSelect-poeple-item">
                <div v-for="(allAdmin, allIndex) in adminList" :key="allIndex">
                  <img :src="allAdmin.thumbAvatar" alt="" />
                  <span>{{ allAdmin.name }}</span>
                </div>
              </div>
              <!-- <div class="dialogSelect-people-more-all" v-if="adminList.length > 2"></div> -->
              <div class="dialogSelect-people-more" v-if="adminList.length > 2">...等{{ adminList.length }}人</div>
              <i class="el-icon-arrow-down" v-if="isPeopleBlock == false"></i>
              <i class="el-icon-arrow-up" v-if="isPeopleBlock == true"></i>
            </div>
            <transition name="el-zoom-in-top">
              <div class="dialogSelect-people-block" v-if="isPeopleBlock == true" id="box">
                <div class="dialog-fixed">
                  <div class="dialogSelect-block-top">
                    <span>全部管理员( {{ searchUserName.total }} )</span>
                    <!-- <el-button type="text" @click="addCustomerBtn">添加管理员</el-button> -->
                  </div>
                  <div class="dialogSelect-block-input">
                    <el-input
                      placeholder="请输入管理员名称"
                      size="mini"
                      v-model="searchAdmin.name"
                      @input="getChooseUser"
                      class="input-class"
                      clearable
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
                  <!-- <div class="dialogSelect-bottom-item">
                    <el-radio></el-radio>
                    <img src="../../../images/default-cover.png" alt="" />
                    <span>成员名称</span>
                  </div>
                  <div class="dialogSelect-bottom-item">
                    <el-radio></el-radio>
                    <img src="../../../images/default-cover.png" alt="" />
                    <span>成员名称</span>
                  </div> -->
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
        <!-- <div class="dialogSelect-status">
          <span class="left-span">当前状态:</span>
          <el-switch v-model="noticeModel.isOpen"> </el-switch>
          <span class="right-span">是否开启</span>
        </div>
        <div class="dialogSelect-people">
          <span class="people-left">接收通知管理员:</span>
          <div class="dialogSelect-people-select"></div>
        </div> -->
      </div>
      <div class="dialogSelect-btn">
        <el-button @click="closeNoticeDialog()">取消</el-button>
        <el-button type="primary" @click="sumbitNotice()">保存</el-button>
      </div>
    </com-dialog>
    <com-dialog :config="addWordDialog.config" @closeDialog="addWordDialog.config.visible = false" class="dialogSelect">
      <el-form
        label-position="right"
        label-width="auto"
        ref="addExtendModel"
        :model="enterpriseModel"
        class="el-form-filter"
      >
        <el-form-item label="敏感词名称">
          <el-input
            placeholder="请输入敏感词名称"
            maxlength="8"
            show-word-limit
            v-model="enterpriseModel.word"
          ></el-input>
        </el-form-item>
        <div class="addtag-item"></div>
      </el-form>
      <div></div>
      <div class="Btn-two" style="display: flex; justify-content: flex-end">
        <el-button @click="closeEnterpriseAddDialog()">取消</el-button>
        <el-button type="primary" @click="sumbitEnterpriseAddDialog()">确定</el-button>
      </div>
    </com-dialog>
  </div>
</template>
<script>
import ComDialog from '../../../components/common/ComDialog'
export default {
  components: {
    ComDialog
  },
  data() {
    return {
      isBlock: false, //全部账号block事件
      isPeopleBlock: false, //管理员下拉
      noticeDialog: {
        config: {
          width: '600px',
          title: '提醒通知',
          visible: false
        }
      },
      addWordDialog: {
        config: {
          width: '600px',
          title: '新增敏感词',
          visible: false
        }
      },
      noticeModel: {
        isOpen: false,
        radio: 'every'
      },
      //搜索内部人员
      searchUserName: {
        name: '',
        total: 0
      },
      userPageList: [], //搜索成员列表
      chooseUser: {
        thumbAvatar: '',
        name: ''
      },
      messageItem: [],
      getMessageList: {
        keyword: '',
        userId: '',
        conversationName: ''
      },
      sendTime: '',
      wordList: [],
      enterpriseModel: {
        word: '',
        type: 'crop-conversation',
        sortNumber: '0',
        groupId: 'default'
      },
      redMessage: [],
      isOpen: true,
      getSession: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      adminPageList: [], //管理员数据
      searchAdmin: {
        name: '',
        total: 0
      },
      //获取提醒设置的数据
      getConfig: {
        // status: 'disabled',
      },
      chooseAdminList: [], //选择的客户列表
      adminList: [], //后台返回的管理员列表
      userId: '', //后台返回的已选的管理员数据
      chooseUserId: '',
      reChooseList: [], //已选中打勾的人的数据
      falseList: [],
      wordIndexFlag: -1,
      warningTitle: false
    }
  },
  methods: {
    // settingEvent(event){
    //   event.stopPropagation()
    // },
    //页面滚动到底部的方法
    getScrollY() {
      this.$nextTick(function() {
        setTimeout(() => {
          let middle = document.getElementById('disbox')
          if (middle) {
            middle.scrollTop = middle.scrollHeight
          }
        }, 500)
      })
    },
    //点击全部账号下拉隐藏列表
    changeIsBlock() {
      this.isBlock = !this.isBlock
    },
    waiBox() {
      this.isBlock = false
      // this.isPeopleBlock = false
    },
    //选择下拉列表的成员
    chooseItem(item) {
      this.isBlock = false
      this.chooseUser.thumbAvatar = item.thumbAvatar
      this.chooseUser.name = item.name
      this.getMessageList.userId = item.userId
      this.sendTime = ''
      this.getMessageList.keyword = ''
      this.getMessageList.conversationName = ''
      this.getSessionSensitive()
    },
    //设置窗口取消按钮
    closeNoticeDialog() {
      this.noticeDialog.config.visible = false
      this.isPeopleBlock = false
    },
    //设置窗口保存按钮
    sumbitNotice() {
      if (this.noticeModel.isOpen == true) {
        this.getConfig.status = 'enabled'
      } else {
        this.getConfig.status = 'disabled'
      }
      if (this.chooseUserId != '') {
        this.userId = this.chooseUserId
      }
      if (this.userId == '') {
        let list = []
        this.adminList.forEach((item) => {
          list.push(item.userId)
        })
        this.userId = list.join(',')
        if (this.userId == '') {
          this.$message.warning('请选择至少一个管理员')
          return
        }
      }
      let params = {
        userId: this.userId,
        status: this.getConfig.status,
        frequency: this.getConfig.frequency
      }
      this.$http.updateMessageConfig(params).then(() => {
        this.$message.success('设置成功')
        this.noticeDialog.config.visible = false
        this.isPeopleBlock = false
        // this.getChooseUser()
      })
    },
    //打开管理员下拉列表事件
    openPeopleSelect() {
      this.isPeopleBlock = !this.isPeopleBlock
      if (this.userId != '') {
        this.chooseAdminList = []
        this.adminPageList = []
        let params = {
          name: this.searchAdmin.name,
          pageSize: 999,
          pageNum: 1
        }
        this.$http.getPermitUserPage(params).then((res) => {
          if (res.data.code == 32001) {
            this.warningTitle = true
            let getParams = {
              pageSize: 999,
              pageNum: 1,
              name: this.searchAdmin.name
            }
            this.$http.getLocalGetPageByUser(getParams).then((res) => {
              this.chooseAdminList = res.data.data.list
              let msg = []
              msg = this.userId.split(',')
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
            return
          }
          if (res.data.code == 20000) {
            this.chooseAdminList = res.data.data.list
            let msg = []
            msg = this.userId.split(',')
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
          }
        })
      }
    },
    //点击全部账户之后
    chooseAllCustomer() {
      this.isBlock = false
      this.chooseUser.thumbAvatar = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
      this.chooseUser.name = '全部成员'
      this.getMessageList.userId = ''
      this.sendTime = ''
      this.getMessageList.keyword = ''
      this.getMessageList.conversationName = ''
      // this.searchUserName.name = ''
      this.getSessionSensitive()
    },
    //点击全部敏感词
    chooseAll() {
      this.wordIndexFlag = -1
      this.getMessageList.keyword = ''
      this.getSessionSensitive()
    },
    //点击敏感词事件
    chooseWord(item, index) {
      this.getMessageList.keyword = item.word
      this.wordIndexFlag = index
      this.getSessionSensitive()
    },
    //点击添加敏感词按钮
    addWord() {
      this.addWordDialog.config.visible = true
    },
    //敏感词弹窗取消按钮
    closeEnterpriseAddDialog() {
      this.enterpriseModel.groupName = ''
      this.enterpriseModel.tagList = [{}]
      this.addWordDialog.config.visible = false
    },
    //敏感词弹窗确定按钮
    sumbitEnterpriseAddDialog() {
      if (this.enterpriseModel.word == '') {
        this.$message.warning('敏感词名称不能为空')
        return
      }
      let params = {
        word: this.enterpriseModel.word,
        type: this.enterpriseModel.type,
        sortNumber: this.enterpriseModel.sortNumber,
        groupId: this.enterpriseModel.groupId
      }
      this.$http.addSensitiveWord(params).then(() => {
        this.$message.success('添加敏感词成功')
        this.enterpriseModel.word = ''
        this.addWordDialog.config.visible = false
        this.getSensitiveWord()
      })
    },
    //点击查看按钮
    moreMessage(item) {
      this.$openNewPage({path: 
        `/main/scrm/control/supervision/dialogue?conversationId=${item.conversationId}&sequence=${item.sequence}&userId=${item.fromUserId}&conversationName=${item.conversationName}&toUserType=${item.toUserType}&sensitiveWordArray=${item.sensitiveWordArray}`
      })
    },
    //未开通按钮
    changeOpenDispose() {
      this.$router.push('/main/scrm/operation-management/chatsessionconfig/list')
    },
    //点击查看更多按钮
    handleMore() {
      this.getSession.pageSize += 20
      this.getSessionSensitive()
      this.getScrollY()
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
      this.$http.getPermitUserPage(params).then((res) => {
        if (res.data.code == 32001) {
          this.warningTitle = true
          let getParams = {
            pageSize: 999,
            pageNum: 1
          }
          this.$http.getLocalGetPageByUser(getParams).then((res) => {
            this.chooseAdminList = res.data.data.list
            let msg = this.userId.split(',')
            for (var i = 0; i < this.chooseAdminList.length; i++) {
              if (msg.includes(this.chooseAdminList[i].userId)) {
                this.adminList.push(this.chooseAdminList[i])
              }
            }
          })
          return
        }
        if (res.data.code == 20000) {
          this.chooseAdminList = res.data.data.list
          let msg = this.userId.split(',')
          for (var i = 0; i < this.chooseAdminList.length; i++) {
            if (msg.includes(this.chooseAdminList[i].userId)) {
              this.adminList.push(this.chooseAdminList[i])
            }
          }
        }
      })
      if (this.getConfig.status == 'enabled') {
        this.noticeModel.isOpen = true
      } else {
        this.noticeModel.isOpen = false
      }
      this.getChooseUser()
    },
    //添加管理员按钮
    addCustomerBtn() {
      if (this.userId == '') {
        this.userId = this.reChooseList.join(',')
      }
      this.adminList = []
      // let chooseList = []
      this.userPageList.forEach((item) => {
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
    chooseItemAdmin(adminItem) {
      if (this.userId != '') {
        this.reChooseList = this.userId.split(',')
        this.userId = ''
      }
      // let msg = []
      // // this.reChooseList.concat(this.userId.slice(','))
      adminItem.ischoose = !adminItem.ischoose
      this.adminPageList.forEach((item) => {
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
    goMoney() {
      window.open('https://work.weixin.qq.com/wework_admin/frame#financial/corpEncryptData', '_blank')
    },
    //接口部分开始
    //获取聊天数据
    getSessionSensitive() {
      this.messageItem = []
      let date = this.sendTime
      let startTime = ''
      let endTime = ''
      if (date) {
        startTime = date[0]
        endTime = date[1]
      }
      let params = {
        pageNum: this.getSession.pageNum,
        pageSize: this.getSession.pageSize,
        keyword: this.getMessageList.keyword,
        userId: this.getMessageList.userId,
        startTime: startTime,
        endTime: endTime,
        conversationName: this.getMessageList.conversationName
      }
      this.$http.getSessionSensitive(params).then((res) => {
        res.data.data.list.forEach((item) => {
          let msg = item.sensitiveWordArray
          let str = ''
          msg.forEach((item) => {
            str = str + item + '|'
          })
          str.substring(0, str.length - 1)
          let re = new RegExp('\\' + str, 'ig')
          let content = ''
          if (item.content != '') {
            content = item.content.replace(re, "<span style='color:#F56C6C;'>$&</span>")
          }
          this.messageItem.push({
            content: content,
            conversationId: item.conversationId,
            conversationName: item.conversationName,
            createTime: item.createTime,
            fromUserAvatar: item.fromUserAvatar,
            fromUserId: item.fromUserId,
            fromUserName: item.fromUserName,
            messageId: item.messageId,
            sensitiveWordArray: item.sensitiveWordArray,
            sequence: item.sequence,
            toUserAvatar: item.toUserAvatar,
            toUserId: item.toUserId,
            toUserType: item.toUserType,
            msg: msg
          })
          this.messageItem.concat(this.messageItem)
          this.getSession.total = this.messageItem.length
        })
      })
    },
    //获取成员数据
    getPermitUserPage() {
      let params = {
        name: this.searchUserName.name,
        pageSize: 999,
        pageNum: 1
      }
      this.$http.getPermitUserPage(params).then((res) => {
        if (res.data.code == 32001) {
          this.warningTitle = true
          let getParams = {
            pageSize: 999,
            pageNum: 1,
            name: this.searchUserName.name
          }
          this.$http.getLocalGetPageByUser(getParams).then((res) => {
            this.userPageList = res.data.data.list
            this.searchUserName.total = res.data.data.total
          })
          return
        }
        if (res.data.code == 20000) {
          this.warningTitle = false
          this.userPageList = res.data.data.list
          this.searchUserName.total = res.data.data.total
        }
      })
    },
    // getAdminPage() {
    //   let params = {
    //     name: this.searchAdmin.name
    //   }
    //   this.$http.getPermitUserPage(params).then(res => {
    //     // this.adminPageList = res.data.data.list
    //     this.searchAdmin.total = res.data.data.total
    //   })
    // },
    //获取全部敏感词
    getSensitiveWord() {
      let params = {
        type: 'crop-conversation'
      }
      this.$http.getSensitiveWord(params).then((res) => {
        this.wordList = res.data.data.list
        // this.redMessage = res.data.data.list.sensitiveWordArray
      })
    },
    //获取是否开通了
    getOpenStatus() {
      this.$http.getOpenStatus().then((res) => {
        this.isOpen = res.data.data
        if (this.isOpen == true) {
          this.getMessageConfig()
          this.getSessionSensitive()
          this.getPermitUserPage()
          this.getSensitiveWord()
        }
      })
    },
    //获取提醒设置信息
    getMessageConfig() {
      this.userId = ''
      this.chooseAdminList = []
      this.adminList = []
      this.$http.getMessageConfig().then((res) => {
        this.getConfig = res.data.data
        this.userId = this.getConfig.userId

        // this.getChooseUser()
      })
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
      this.$http.getPermitUserPage(params).then((res) => {
        if (res.data.code == 32001) {
          let getParams = {
            pageSize: 999,
            pageNum: 1,
            name: this.searchAdmin.name
          }
          this.$http.getLocalGetPageByUser(getParams).then((res) => {
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
          return
        }
        if (res.data.code == 20000) {
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
        }
      })
    }
    //接口部分结束
  },
  created() {
    this.getOpenStatus()
    document.addEventListener('click', (e) => {
      let className = e.target.className
      if (
        className == 'violation-item-top' ||
        className == 'violation-contain-none' ||
        className == 'violation-notice' ||
        className == 'violation-item-bottom' ||
        className == 'violation-contain-key' ||
        className == 'violation-container' ||
        className == 'violation-container-pass' ||
        className == 'el-range-input' ||
        className == 'name-class' ||
        className == 'violation-notice-dispose' ||
        className == 'el-main' ||
        className == 'wordItem-span' ||
        className == 'item-top-span' ||
        className == 'violation-contain-bottom' ||
        className == 'el-header' ||
        className == ''
      ) {
        this.isBlock = false //点击其他区域关闭
      }
      if (
        className == 'el-dialog__header' ||
        className == 'el-dialog__body' ||
        className == 'dialogSelect' ||
        className == 'dialogSelect-content' ||
        className == 'el-form el-form--label-right' ||
        className == 'el-form-item__label' ||
        className == 'el-form-item__content' ||
        className == 'el-alert__title' ||
        className == 'el-dialog__wrapper dialogSelect' ||
        className == 'dialogSelect-btn' ||
        className == 'el-alert el-alert--warning is-center is-light'
      ) {
        this.isPeopleBlock = false
      }
    })
  },
  mounted() {},
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
.violation-div {
  width: 100%;
  height: 100%;
  .violation-none {
    position: relative;
    width: 100%;
    height: 100%;
    .none-image {
      text-align: center;
      img {
        width: 1400px;
        position: relative;
      }
      .el-button {
        position: absolute;
        bottom: 5%;
        left: 46%;
      }
    }
  }
  .violation-container {
    width: 100%;
    height: 100%;
    // padding: 20px;
    .violation-container-top {
      width: 100%;
      height: 60px;
      background-color: #fff;
      line-height: 60px;
      font-size: 14px;
      .violation-container-pass {
        display: flex;
        justify-content: flex-start;
        .violation-password {
          margin-left: 10px;
        }
        .violation-password-select {
          user-select: none;
          cursor: pointer;
          position: relative;
          margin-top: 13px;
          width: 200px;
          height: 40px;
          background-color: #eaedf2;
          // border: 1px solid red;
          margin-left: 10px;
          display: flex;
          flex-direction: space-between;
          flex-direction: row;
          justify-content: space-between;

          img {
            border-radius: 2px;
            flex: 0.5;
            margin: 8px 5px 0px 10px;
            width: 25px;
            height: 25px;
          }
          div {
            color: #606266;
            flex: 3;
            margin: 1.5px;
            height: 35px;
            line-height: 35px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          i {
            margin: 1.5px;
            flex: 0.5;
            line-height: 35px;
            height: 35px;
          }
        }
        .violation-select-block {
          background-color: #fff;
          top: 80px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          width: 250px;
          height: 400px;
          position: absolute;
          z-index: 999;
          overflow-y: auto;
          &::-webkit-scrollbar {
            width: 5px;
          }
          .violation-select-top {
            height: 50px;
            // border: 1px solid red;
            width: 250px;
            position: fixed;
            z-index: 1000;
            background-color: #fff;
            display: flex;
            padding: 0 10px;
            box-sizing: border-box;
            .violation-block-title {
              flex: 1.2;
              margin: 5px;
              height: 48px;
              line-height: 48px;
              color: #606266;
            }
            .violation-block-input {
              flex: 3;
              padding-right: 5px;
              // height: 40px;
            }
          }
          .violation-select-bottom {
            margin-top: 55px;
            // padding-top: 48px;
            // height: 400px;
            padding: 10px;
            .violation-select-item {
              cursor: pointer;
              display: flex;
              align-items: center;
              height: 40px;
              padding: 10px;
              // border: 1px solid red;
              &:hover {
                background-color: #f5f7fa;
              }
              img {
                width: 40px;
                height: 40px;
                margin-right: 10px;
                border-radius: 3px;
                overflow: hidden;
              }
              .violation-select-name {
                color: #606266;
              }
            }
          }
        }
        .violation-notice {
          margin-left: 10px;
          color: #606266;
          user-select: none;
          i {
            font-size: 16px;
            color: $--color-primary;
          }
          .violation-notice-dispose {
            cursor: pointer;
            margin-left: 20px;
            color: $--color-primary;
          }
        }
        .violation-notice-block {
          left: 650px;
          position: absolute;
          top: 60px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          background-color: #fff;
          width: 300px;
          height: 300px;
        }

        .violation-search {
          // border: 1px solid red;
          margin-left: auto;
          margin-right: 20px;
          display: flex;
          .violation-search-left {
            margin-right: 10px;
            span {
              margin-right: 10px;
              color: #606266;
            }
          }
          .violation-search-right {
            span {
              margin-right: 10px;
              color: #606266;
            }
          }
        }
      }
    }
    .violation-contain-center {
      margin: 10px 0;
      width: 100%;
      // height: 50px;
      background: #fff;
      display: flex;
      .violation-contain-all {
        font-size: 14px;
        color: #606266;
        line-height: 50px;
        margin-left: 10px;
        // border: 1px solid red;
        flex: 0.8;
      }
      .violation-contain-key {
        line-height: 50px;
        // border: 1px solid green;
        flex: 11.2;
        font-size: 14px;

        .add-key,
        .all-key {
          cursor: pointer;
          user-select: none;
          border-radius: 5px;
          margin: 0 5px;
          background-color: #eaedf2;
          color: #606266;
          padding: 5px 10px;
          height: 28px;
          line-height: 28px;
          box-sizing: border-box;
          &.wordIndexFlag {
            background-color: #294a7b;
            color: #fff;
          }
        }
        .wordItem-span {
          height: 28px;
          line-height: 28px;
          height: 15px;
          display: inline-block;
          cursor: pointer;
          user-select: none;
          border-radius: 5px;
          background-color: #eaedf2;
          color: #606266;
          padding: 5px 10px;
          margin-right: 8px;
          box-sizing: border-box;
          &:nth-child(1) {
            margin-left: 2px;
          }
          &.wordIndexFlag {
            background-color: #294a7b;
            color: #fff;
          }
        }
      }
    }
    .violation-contain-bottom {
      // border: 1px solid red;
      .violatin-contain-box {
        height: 700px;
        overflow-y: auto;
        padding-right: 10px;
        .violation-bottom-item {
          cursor: pointer;
          margin-bottom: 10px;
          background-color: #fff;
          .violation-item-top {
            display: flex;
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            justify-content: flex-start;
            .item-top-img {
              border-radius: 2px;
              width: 20px;
              height: 20px;
            }
            .item-top-div {
              margin-left: 10px;
              height: 20px;
              line-height: 20px;
              color: #606266;
              font-size: 14px;
            }
            .item-top-span {
              margin-left: auto;
              color: #606266;
              font-size: 12px;
              line-height: 20px;
            }
          }
          .violation-item-bottom {
            display: flex;
            justify-content: flex-start;
            padding: 20px;
            .item-left {
              img {
                width: 50px;
                height: 50px;
                border-radius: 5px;
              }
            }
            .item-right {
              font-size: 14px;
              margin-left: 10px;
              height: 50px;
              line-height: 25px;
              color: #606266;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .item-button {
              margin-left: auto;
              .el-button {
                color: #294a7b;
              }
            }
          }
        }
        .violation-bottom-more {
          background-color: #fff;
          text-align: center;
        }
      }
    }
    .violation-contain-none {
      text-align: center;
      width: 100%;
      height: 700px;
      background-color: #fff;
      span {
        padding-top: 350px;
        display: block;
        // border: 1px solid #ccc;
        color: #606266;
        font-size: 14px;
      }
    }
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
.name-class {
  color: #294a7b;
  font-weight: bold;
}
.el-form-filter {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
.iconMinu {
  margin-top: 5px;
  font-size: 17px;
  color: #d36b5d;
  background-color: #cdcdcd;
  border-radius: 50%;
  cursor: pointer;
  padding: 2px;
}
.addtag-item {
  .addtag-title {
    padding: 5px 0;
  }
  .addtag-input {
    padding-top: 10px;
    .addtag-input-content {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .inp {
        flex: 1;
      }
      .score {
        padding-left: 10px;
        width: 110px;
      }
      .btn {
        width: 28px;
        padding-left: 10px;
      }
    }
  }
  .addtag-addBtn {
    margin-bottom: 20px;
    .el-button {
      color: #294a7b;
    }
  }
}
.warning-div {
  margin: 0 0 10px 0;
  padding: 0;
  .el-alert {
    margin: 0;
    .el-button {
      margin: 0;
      padding: 0;
    }
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
