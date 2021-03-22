<template>
  <div class="container">
    <div>
      <GoBack
        :title="'聊天详情'"
        v-if="$route.query.conversationId != undefined && $route.query.userId != undefined"
      ></GoBack>
    </div>

    <div class="violation-none" v-if="isOpen == false">
      <div class="none-image">
        <img src="../../../images/none_dispose.png" alt="" />
        <el-button type="primary" @click="changeOpenDispose">点击开通</el-button>
      </div>
    </div>
    <div class="container-middle" v-else>
      <!-- <div class="message-top">
        <span>消息存档</span><span>会话数据更新时间为每小时的零五分，如01:05、02:05以此类推</span>
      </div> -->
      <div class="message-content">
        <div class="cont-left">
          <div class="member-msg-div">
            <div class="member-msg" @click.stop="chooseDispose()">
              <el-image
                style="width: 44px; height: 44px; border: 1px solid #ebeef5; border-radius: 4px"
                :src="customerNameListFirst.thumbAvatar"
                fit="cover"
              ></el-image>
              <div class="member-name" style="margin-left: 10px">{{ customerNameListFirst.name }}</div>
              <i class="el-icon-arrow-down member-icon" v-if="chooseDiv == false"></i>
              <i class="el-icon-arrow-up member-icon" v-if="chooseDiv == true"></i>
            </div>

            <transition name="el-zoom-in-top">
              <div class="member-msg-block-box" v-if="chooseDiv == true">
                <div class="member-msg-block">
                  <div class="member-search">
                    <span class="all-text">成员({{ customerAllList.length || 0 }})</span>
                    <el-input
                      v-model="searchCustomer.name"
                      placeholder="请输入成员名称"
                      @input="getparams"
                      class="el-input-search"
                      size="mini"
                      prefix-icon="el-icon-search"
                      clearable
                    ></el-input>
                  </div>
                  <div class="member-all-div">
                    <div
                      class="member-all-msg"
                      v-for="(item, index) in customerAllList"
                      :key="index"
                      @click="changeCustomer(item)"
                    >
                      <img class="member-avatar" :src="item.thumbAvatar" alt="" />
                      <div class="member-name">{{ item.name }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <div v-if="warningTitle == true" class="warning-div">
            <el-alert type="warning" show-icon :closable="false">
              <template>
                <div style="font-size: 14px;line-height: 20px">
                  会话内容存档接口现已到期或停止使用，请<el-button
                    type="text"
                    @click="goMoney"
                    style="font-size:14px;margin:0 2px;padding: 0;"
                  >
                    登录</el-button
                  >企业微信“管理工具”查看
                </div>
              </template>
            </el-alert>
          </div>
          <div class="left-menus">
            <div
              class="menu-item"
              v-for="(item, index) in menus"
              :key="index"
              :class="item.type === activeMenu ? 'active' : ''"
              @click="menuChange(item)"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="message-total">
            <i class="el-icon-menu"></i>
            <span>会话({{ ByUserPage.total }})</span>
            <el-input
              placeholder="请输入成员名称"
              v-model="searchByUser.name"
              size="mini"
              prefix-icon="el-icon-search"
              @input="getFristCustomer"
              clearable
            ></el-input>
          </div>
          <div :class="warningTitle == true ? 'customer-list' : 'customer-none-list'">
            <div class="customer-list-none" v-if="customerList.length == 0">暂无会话</div>
            <div v-if="customerList.length != 0">
              <div
                class="list-item"
                v-for="(item, index) in customerList"
                :key="index"
                :class="activeIndex === index ? 'active' : ''"
                @click="selectCustomer(item, index)"
              >
                <div class="item-right">
                  <el-image
                    style="width: 44px; height: 44px; margin-right: 10px"
                    :src="item.cover | isHttp"
                    fit="cover"
                  ></el-image>
                  <div class="customer-msg">
                    <div class="msg-info">
                      <div class="msg-name" style="margin-right: 10px">{{ item.name || '未知' }}</div>
                      <el-tag
                        size="mini"
                        :type="
                          item.otherUserType == 'internal'
                            ? 'success'
                            : item.otherUserType == 'external'
                            ? 'warning'
                            : item.otherUserType == 'group'
                            ? ''
                            : 'info'
                        "
                      >
                        {{
                          item.otherUserType == 'internal'
                            ? '内部'
                            : item.otherUserType == 'external'
                            ? '外部'
                            : item.otherUserType == 'group'
                            ? '群聊'
                            : ''
                        }}
                      </el-tag>
                      <!-- <div class="msg-tag">
                        {{
                          item.otherUserType == 'internal'
                            ? '内部'
                            : item.otherUserType == 'external'
                            ? '外部'
                            : item.otherUserType == 'group'
                            ? '群聊'
                            : ''
                        }}
                      </div> -->
                    </div>
                    <div class="msg-cont">{{ item.lastMessage }}</div>
                  </div>
                </div>
                <div class="item-left">{{ formatterDate(item.lastMessageTime) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="cont-right" v-if="ByUserPage.total == 0">
          <div class="dialogue-top">
            <div class="top-left" v-if="rightContent.name == '' || conversationId == ''">
              <span class="none-title">暂无数据</span>
            </div>
            <div class="top-left" v-else>
              <div class="customer-info-none">暂无数据</div>
              <div class="info-tips"></div>
            </div>
            <div class="top-right">
              <div class="search-input">
                <span>消息内容</span>
                <el-input
                  size="mini"
                  class="message"
                  placeholder="搜索消息"
                  v-model="searchMessage.keyword"
                  @input="getNoneMessage"
                  clearable
                >
                </el-input>
              </div>
              <div class="date-picker">
                <span>发送时间</span>
                <el-date-picker
                  v-model="sendTime"
                  size="mini"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  @change="getNoneMessage"
                >
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="dialogue-content">
            <div class="none-content">暂无数据</div>
          </div>
        </div>
        <div class="cont-right" v-if="ByUserPage.total != 0">
          <!-- <div class="cont-right" v-if="ByUserPage.total != 0"> -->
          <div class="dialogue-top">
            <div class="top-left" v-if="rightContent.name == '' || conversationId == ''">
              <span class="none-title">暂无数据</span>
            </div>
            <div class="top-left" v-else>
              <div class="customer-info">
                {{ rightContent.name || '未知' }}
                <el-tag
                  style="margin-left: 10px"
                  size="mini"
                  :type="
                    rightContent.otherUserType == 'internal'
                      ? 'success'
                      : rightContent.otherUserType == 'external'
                      ? 'warning'
                      : rightContent.otherUserType == 'group'
                      ? ''
                      : 'info'
                  "
                >
                  {{
                    rightContent.otherUserType == 'internal'
                      ? '内部'
                      : rightContent.otherUserType == 'external'
                      ? '外部'
                      : rightContent.otherUserType == 'group'
                      ? '群聊'
                      : ''
                  }}
                </el-tag>
              </div>
              <div class="info-tips">对方已同意存档会话内容</div>
            </div>
            <div class="top-right">
              <div class="search-input">
                <span>消息内容</span>
                <el-input
                  size="mini"
                  placeholder="搜索消息"
                  v-model="searchMessage.keyword"
                  @input="getpageMessage"
                  clearable
                >
                </el-input>
              </div>
              <div class="date-picker">
                <span>发送时间</span>
                <el-date-picker
                  v-model="sendTime"
                  size="mini"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  @change="getpageMessage"
                >
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="dialogue-content-box">
            <div class="dialogue-content" id="scroll-top">
              <div class="dialogue-more">
                <span @click="getMoreMessage()" v-if="getMessagePageSizeNum.pageSize == conversationList.length"
                  >点击加载更多</span
                >
                <span v-if="getMessagePageSizeNum.pageSize != conversationList.length">暂无更多消息</span>
              </div>
              <!-- <div class="dialogue-item" v-for="(item, index) in conversationList.list" :key="index"> -->
              <div class="dialogue-item" v-for="(item, index) in conversationList" :key="index">
                <div class="dialogut-item-time">{{ item.messageTime | timeSubString }}</div>
                <div :class="item.sender.id == userId ? 'item-right-box' : 'item-left-box'">
                  <div :class="item.sender.id == userId ? 'right-content' : 'left-content'">
                    <img v-if="item.sender.id == userId" class="avatar" :src="item.sender.avatar | isHttp" alt="" />
                    <el-avatar
                      class="avatar"
                      v-if="item.sender.id != userId"
                      :src="item.sender.avatar | isHttp"
                    ></el-avatar>
                    <div class="message">
                      <el-tag
                        type="primary"
                        size="mini"
                        v-if="item.sender.id == userId && item.action == 'recall'"
                        class="send-message-right"
                      >
                        此消息已撤回
                        <!-- {{
                    item.action == 'send' ? '发送消息' : item.action == 'recall' ? '此消息已撤回' : ''
                  }} -->
                      </el-tag>

                      <div class="msg-text" v-if="item.messageType != 'emotion' && item.messageType != 'image'">
                        <p v-html="parsingEmoji(item.content)"></p>
                      </div>

                      <div class="msg-emotions" v-if="item.messageType == 'emotion'">
                        <el-image
                          :src="(item.host + item.fileUrl) | isImage"
                          :preview-src-list="[item.host + item.fileUrl]"
                        >
                          <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                          </div>
                        </el-image>
                      </div>
                      <div class="msg-image" v-if="item.messageType == 'image'">
                        <el-image
                          :src="(item.host + item.fileUrl) | isImage"
                          :preview-src-list="[item.host + item.fileUrl]"
                        >
                          <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                          </div>
                        </el-image>
                      </div>
                      <!-- <div class="msg-link" v-if="item.messageType == 'link'">
                    <div class="msg-link-box">
                      <div class="msg-link-top">
                        开通企业微信的好处有哪些？这十大好处将带来可观效益开通企业微信的好处有哪些？这十大好处将带来可观效益
                      </div>
                      <div class="msg-link-bottom">
                        <div class="msg-link-content">
                          企业微信相较于个人微信的10大好处。企业微信相较于个人微信的10大好处
                        </div>
                        <div class="msg-link-img">
                          <img src="../../../images/default-cover.png" alt="" />
                        </div>
                      </div>
                    </div>
                  </div> -->
                      <!-- <div class="msg-app" v-if="item.messageType == 'weapp'">
                    <div class="msg-app-div">
                      <div class="msg-app-top">
                        <div class="msg-app-serve">服务需知</div>
                        <div class="msg-app-title">开始聊天前请仔细阅读服务须知事项萨达萨达是</div>
                        <div class="msg-app-content">客户需统一存档聊天记录</div>
                      </div>
                      <div class="msg-app-bottom"><i class="el-icon-share"></i>小程序</div>
                    </div>
                  </div> -->
                      <el-tag
                        type="primary"
                        size="mini"
                        v-if="item.sender.id != userId && item.action == 'recall'"
                        class="send-message-tag"
                      >
                        此消息已撤回
                        <!-- {{
                    item.action == 'send' ? '发送消息' : item.action == 'recall' ? '此消息已撤回' : ''
                  }} -->
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>

              <!-- <div class="dialogue-item">
            <div class="item-right-box">
              <div class="right-content">
                <img class="avatar" src="#" alt="" />
                <div class="message">
                  <div class="msg-text">你好，欢迎你！</div>
                </div>
              </div>
            </div>
          </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack'
export default {
  components: { GoBack },
  data() {
    return {
      menus: [
        { name: '全部', type: '' },
        { name: '单聊', type: 'single' },
        { name: '群聊', type: 'group' }
      ],
      activeMenu: '',
      customerList: [
        // { avatar: '#', name: '客户名称', tag: '外部', time: '2020-09-11 9:39:10', content: '即时消息' },
        // { avatar: '#', name: '理想华谊', tag: '外部', time: '2020-09-8 15:20:30', content: '咨询消息' }
      ],
      activeIndex: 0,
      customerNameList: {},
      PremitUserPage: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      ByUserPage: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      getMessagePageSizeNum: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      userId: '',
      conversationId: '',
      conversationList: [
        // userType: '',
        // sender: {
        //   id: '',
        //   name: ''
        //   // avatar:''
        // },
        // list: []
      ],
      customerNameListFirst: {},
      chooseDiv: false,
      customerAllList: {},
      searchCustomer: {
        name: ''
      },
      rightContent: {
        name: '',
        cover: '',
        otherUserType: ''
      },
      searchMessage: {
        keyword: ''
      },
      sendTime: '',
      searchByUser: {
        name: ''
      },
      FirstCustomer: {},
      isOpen: true,
      queryConId: '',
      queryUsId: '',
      warningTitle: false
    }
  },
  methods: {
    //页面滚动到底部的方法
    getScrollY() {
      this.$nextTick(function() {
        setTimeout(() => {
          let middle = document.getElementById('scroll-top')
          if (middle) {
            middle.scrollTop = middle.scrollHeight
          }
        }, 500)
      })
    },
    getNoneMessage() {
      this.$message.warning('暂无数据')
    },
    menuChange(item) {
      this.customerList = []
      this.activeMenu = item.type
      this.sendTime = ''
      this.searchMessage.keyword = ''
      this.searchByUser.name = ''
      // this.activeIndex = 0
      // console.log(item)
      let params = {
        userId: this.userId,
        conversationType: this.activeMenu,
        name: ''
      }
      this.$http.getPageByUser(params).then((res) => {
        this.customerList = res.data.data.list
        this.ByUserPage.total = res.data.data.total
        if (this.customerList.length != 0) {
          this.getpageMessage()
          this.getScrollY()
        }
      })
    },
    getFristCustomer() {
      this.FirstCustomer = {}
      let params = {
        userId: this.userId,
        conversationType: '',
        name: this.searchByUser.name
      }
      this.$http.getPageByUser(params).then((res) => {
        if (res.data.data.list[0] != undefined) {
          this.FirstCustomer = res.data.data.list[0]
          this.customerList = res.data.data.list
          this.ByUserPage.total = res.data.data.total
          this.conversationId = this.FirstCustomer.conversationId
          this.rightContent.name = this.FirstCustomer.name
          this.rightContent.cover = this.FirstCustomer.cover
          this.rightContent.otherUserType = this.FirstCustomer.otherUserType
          if (this.customerList.length != 0) {
            this.getpageMessage()
            this.getScrollY()
          }
        } else {
          this.customerList = res.data.data.list
          this.ByUserPage.total = res.data.data.total
        }
      })
    },
    // 选择客户
    selectCustomer(item, idx) {
      this.activeIndex = idx
      this.rightContent.name = item.name
      this.rightContent.cover = item.cover
      this.rightContent.otherUserType = item.otherUserType
      this.conversationId = item.conversationId
      this.sendTime = ''
      this.searchMessage.keyword = ''
      this.getMessagePageSizeNum.pageSize = 20
      // this.searchByUser.name = ''
      this.getpageMessage()
      this.getScrollY()
    },
    getMoreMessage() {
      this.loadMore()
    },
    loadMore() {
      this.getMessagePageSizeNum.pageSize += 20
      this.getpageMessage()
    },
    getpageMessage() {
      this.conversationList = []
      let date = this.sendTime
      let startTime = ''
      let endTime = ''
      if (date) {
        startTime = date[0]
        endTime = date[1]
      }
      let params = {
        conversationId: this.conversationId,
        keyword: this.searchMessage.keyword,
        startTime: startTime,
        endTime: endTime,
        pageSize: this.getMessagePageSizeNum.pageSize,
        pageNum: this.getMessagePageSizeNum.pageNum
      }
      this.$http.getConverSationMessage(params).then((res) => {
        res.data.data.list.forEach((item) => {
          if (item.sender != null) {
            this.conversationList.push(item)
          }
        })
        this.conversationList.concat(this.conversationList)
        this.conversationList.reverse()
      })
    },
    clearSearchForm() {
      this.searchMessage = {
        keyword: ''
      }
      this.sendTime = ''
      this.getpageMessage()
    },
    // 格式化时间，刚刚，几分钟前，今天12:30，昨天12:24，9月8日
    formatterDate(time) {
      let result = ''
      let date = new Date(time)
      let now = new Date()
      let pubilshTime = parseInt(date.getTime() / 1000)
      let nowTime = parseInt(now.getTime() / 1000)
      let d = nowTime - pubilshTime
      let d_days = parseInt(d / 86400)
      let d_hours = parseInt(d / 3600)
      let d_minutes = parseInt(d / 60)
      let d_seconds = parseInt(d)
      if (d_days <= 0) {
        if (d_seconds < 60) {
          result = '刚刚'
        } else if (d_hours <= 0 && d_minutes > 0) {
          result = d_minutes + '分钟前'
        } else if (d_hours >= 0 <= 24) {
          result = d_hours + '小时前'
        } else {
          result = '今天' + date.getHours() + '点'
        }
      } else if (d_days > 0 && d_days < 2) {
        result = d_days + '天前'
      } else {
        result = date.getMonth() + 1 + '月' + date.getDate() + '日'
      }
      return result
    },
    chooseDispose() {
      this.chooseDiv = !this.chooseDiv
    },
    changeCustomer(item) {
      this.chooseDiv = false
      this.customerNameListFirst = item
      this.userId = this.customerNameListFirst.userId
      this.activeMenu = ''
      this.sendTime = ''
      this.searchMessage.keyword = ''
      this.activeIndex = 0
      this.searchByUser.name = ''
      this.getMessagePageSizeNum.pageSize = 20
      this.getFristCustomer()
      this.getScrollY()
    },
    getparams() {
      let params = {
        name: this.searchCustomer.name,
        pageSize: 999,
        pageNum: 1
      }
      this.$http.getPermitUserPage(params).then((res) => {
        if (res.data.code == 32001) {
          let getParams = {
            pageSize: 999,
            pageNum: 1,
            name: this.searchCustomer.name
          }
          this.$http.getLocalGetPageByUser(getParams).then((res) => {
            this.customerAllList = res.data.data.list
          })
          return
        }
        if (res.data.code == 20000) {
          this.customerAllList = res.data.data.list
        }
      })
    },

    //页面处理
    chooseUserItem() {
      this.customerList = []
      this.FirstCustomer = {}
      let params = {
        userId: this.userId,
        conversationType: '',
        name: ''
      }
      this.$http.getPageByUser(params).then((res) => {
        this.customerList = res.data.data.list
        this.ByUserPage.total = res.data.data.total
        if (res.data.data.list[0] != undefined) {
          this.FirstCustomer = res.data.data.list[0]
          this.customerList = res.data.data.list
          this.ByUserPage.total = res.data.data.total
          this.conversationId = this.FirstCustomer.conversationId
          this.rightContent.name = this.FirstCustomer.name
          this.rightContent.cover = this.FirstCustomer.cover
          this.rightContent.otherUserType = this.FirstCustomer.otherUserType
          if (this.customerList.length != 0) {
            this.getpageMessage()
            this.getScrollY()
          }
        } else {
          this.customerList = res.data.data.list
          this.ByUserPage.total = res.data.data.total
        }
      })
    },
    //接口部分
    getPremitUser() {
      let params = {
        pageSize: 999,
        pageNum: 1
      }
      this.$http.getPermitUserPage(params).then((res) => {
        if (res.data.code == 32001) {
          let getParams = {
            pageSize: 999,
            pageNum: 1
          }
          this.$http.getLocalGetPageByUser(getParams).then((res) => {
            this.warningTitle = true
            this.customerNameList = res.data.data.list
            this.customerAllList = res.data.data.list
            this.customerNameListFirst = this.customerNameList[0]
            this.userId = this.customerNameListFirst.userId
            this.chooseUserItem()
          })
          return
        }
        if (res.data.code == 20000) {
          this.warningTitle = false
          this.customerNameList = res.data.data.list
          this.customerAllList = res.data.data.list
          this.customerNameListFirst = this.customerNameList[0]
          this.userId = this.customerNameListFirst.userId
          this.chooseUserItem()
        }
      })
    },

    //从流失提醒跳转过来的接口
    //获取从流失提醒跳转过来的人员名单
    getChatPremitUser() {
      let params = {
        pageSize: 999,
        pageNum: 1
      }
      this.$http.getPermitUserPage(params).then((res) => {
        if (res.data.code == 32001) {
          let getParams = {
            pageSize: 999,
            pageNum: 1
          }
          this.$http.getLocalGetPageByUser(getParams).then((res) => {
            this.warningTitle = true
            this.customerNameList = res.data.data.list
            this.customerAllList = res.data.data.list
            this.customerNameList.forEach((item) => {
              if (this.queryUsId.includes(item.userId)) {
                this.customerNameListFirst = item
                this.userId = this.customerNameListFirst.userId
              }
            })
            this.getChatChoose()
          })
          return
        }
        if (res.data.code == 20000) {
          this.warningTitle = false
          this.customerNameList = res.data.data.list
          this.customerAllList = res.data.data.list
          this.customerNameList.forEach((item) => {
            if (this.queryUsId.includes(item.userId)) {
              this.customerNameListFirst = item
              this.userId = this.customerNameListFirst.userId
            }
          })
          this.getChatChoose()
        }
      })
    },
    //获取从流失提醒跳转过来的聊天记录
    getChatChoose() {
      this.customerList = []
      this.FirstCustomer = {}
      let params = {
        userId: this.userId,
        conversationType: '',
        name: ''
      }
      this.$http.getPageByUser(params).then((res) => {
        this.customerList = res.data.data.list
        this.ByUserPage.total = res.data.data.total
        if (res.data.data.list[0] != undefined) {
          // this.FirstCustomer = res.data.data.list[0]
          this.customerList = res.data.data.list
          this.customerList.forEach((item, index) => {
            if (this.queryConId.includes(item.conversationId)) {
              this.FirstCustomer = item
              this.activeIndex = index
            }
          })
          this.ByUserPage.total = res.data.data.total
          this.conversationId = this.FirstCustomer.conversationId
          this.rightContent.name = this.FirstCustomer.name
          this.rightContent.cover = this.FirstCustomer.cover
          this.rightContent.otherUserType = this.FirstCustomer.otherUserType
          if (this.customerList.length != 0) {
            this.getpageMessage()
            this.getScrollY()
          }
        } else {
          this.customerList = res.data.data.list
          this.ByUserPage.total = res.data.data.total
        }
      })
    },
    //点击去充值按钮
    goMoney() {
      window.open('https://work.weixin.qq.com/wework_admin/frame#financial/corpEncryptData', '_blank')
    },
    //接口部分

    //获取是否开通了
    getOpenStatus() {
      this.$http.getOpenStatus().then((res) => {
        this.isOpen = res.data.data
        if (this.isOpen == true) {
          if (this.$route.query.conversationId != undefined && this.$route.query.userId != undefined) {
            this.queryConId = this.$route.query.conversationId
            this.queryUsId = this.$route.query.userId
            this.getChatPremitUser()
          } else {
            this.getPremitUser()
          }
        }
      })
    },
    //未开通按钮
    changeOpenDispose() {
      this.$router.push('/main/scrm/operation-management/chatsessionconfig/list')
    }
  },
  created() {
    this.getOpenStatus()

    document.addEventListener('click', (e) => {
      let className = e.target.className
      // console.log(className)
      if (
        className == 'message-top' ||
        className == '' ||
        className == 'customer-info' ||
        className == 'info-tips' ||
        className == 'el-range-input' ||
        className == 'dialogue-item' ||
        className == 'dialogut-item-time' ||
        className == 'customer-list' ||
        className == 'list-item active' ||
        className == 'avatar' ||
        className == 'item-right-box' ||
        className == 'dialogue-content' ||
        className == 'dialogue-item' ||
        className == 'left-content' ||
        className == 'item-left-box' ||
        className == 'el-image__inner el-image__preview' ||
        className == 'dialogue-top' ||
        className == 'info-tag' ||
        className == 'el-main'
      ) {
        this.chooseDiv = false //点击其他区域关闭
      }
    })
    // this.getparams()
  },
  filters: {
    timeSubString(time) {
      if (!time) {
        return
      }
      return time.substring(0, time.length - 3)
    },
    isHttp(url) {
      let isTrue = /(http|https):\/\/([\w.]+\/?)\S*/
      // isTrue.compile(/(http|https):\/\/([\w.]+\/?)\S*/)
      // if (!isTrue.test(url)) {
      //   return false
      // }
      if (!url) {
        return (url = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png')
      } else {
        // return url
        if (!isTrue.test(url)) {
          return (url = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png')
        } else {
          return url
        }
      }
    },
    isImage(url) {
      if (url != '') {
        return url
      } else {
        return (url = '')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
.container-middle {
  width: 100%;
  height: 100%;
  font-size: 14px;
  box-sizing: border-box;
}
.message-top {
  font-weight: bold;
  padding: 15px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  span:nth-child(2) {
    color: #606266;
  }
}
.message-content {
  display: flex;
  width: 100%;
  height: 100%;
  .cont-left {
    width: 300px;
    min-width: 250px;
    border-right: 1px solid #ebeef5;
    box-sizing: border-box;
    padding: 20px;
    margin-right: 10px;
    background-color: #ffffff;
    .member-msg {
      cursor: pointer;
      display: flex;
      align-items: center;
      // overflow-y: auto;
      position: relative;
      .member-name {
        color: #606266;
      }
      .member-avatar {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        border-radius: 3px;
        overflow: hidden;
      }
      .member-icon {
        margin-left: 5px;
      }
    }
    .left-menus {
      display: flex;
      margin-top: 10px;
      // border-bottom: 1px solid #ebeef5;
      padding-top: 10px;
      background-color: #ebeef5;

      .menu-item {
        padding: 0 10px 10px 10px;
        width: 33.33%;
        text-align: center;
        color: #606266;
        cursor: pointer;
        margin-bottom: -1px;
      }
      .active {
        color: #294a7b;
        font-weight: bold;
        // border-bottom: 2px solid #294a7b;
      }
    }
    .message-total {
      border-bottom: 1px solid #ebeef5;
      display: flex;
      line-height: 30px;
      padding: 10px 0;
      box-sizing: border-box;
      .el-icon-menu {
        line-height: 30px;
        flex: 0.1;
        color: #294a7b;
        margin-right: 5px;
      }
      span {
        flex: 1.5;
        font-size: 14px;
      }
      .el-input {
        z-index: 1;
        flex: 2.5;
      }
    }
    .customer-none-list {
      // border: 1px solid red;
      width: 100%;
      height: calc(100% - 50px);
      // overflow: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 1px;
      }
      padding-right: 4px;
      .list-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        box-sizing: border-box;
        border-bottom: 1px solid #ebeef5;
        font-size: 12px;
        .item-right {
          display: flex;
          .customer-avatar {
            width: 36px;
            height: 36px;
            margin-right: 5px;
            border-radius: 3px;
            overflow: hidden;
          }
          .customer-msg {
            .msg-info {
              display: flex;
              align-items: center;
              height: 22px;
              line-height: 22px;
              .msg-name {
                color: #606266;
                font-weight: bold;
                max-width: 90px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .msg-tag {
                padding: 0px 5px;
                border: 1px solid #294a7b;
                border-radius: 3px;
                margin-left: 5px;
              }
            }
            .msg-cont {
              color: #606266;
              max-width: 120px;
              height: 22px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              line-height: 22px;
            }
          }
        }
        .item-left {
          width: 52px;
          color: #606266;
          line-height: 22px;
          text-align: right;
        }
      }
      .list-item:hover {
        background-color: #f5f7fa;
      }
      .active {
        background-color: #f5f7fa;
      }
    }
    .customer-list {
      // border: 1px solid red;
      width: 100%;
      height: calc(100% - 220px);
      // overflow: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 1px;
      }
      padding-right: 4px;
      .list-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        box-sizing: border-box;
        border-bottom: 1px solid #ebeef5;
        font-size: 12px;
        .item-right {
          display: flex;
          .customer-avatar {
            width: 36px;
            height: 36px;
            margin-right: 5px;
            border-radius: 3px;
            overflow: hidden;
          }
          .customer-msg {
            .msg-info {
              display: flex;
              align-items: center;
              height: 22px;
              line-height: 22px;
              .msg-name {
                color: #606266;
                font-weight: bold;
                max-width: 90px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .msg-tag {
                padding: 0px 5px;
                border: 1px solid #294a7b;
                border-radius: 3px;
                margin-left: 5px;
              }
            }
            .msg-cont {
              color: #606266;
              max-width: 120px;
              height: 22px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              line-height: 22px;
            }
          }
        }
        .item-left {
          width: 52px;
          color: #606266;
          line-height: 22px;
          text-align: right;
        }
      }
      .list-item:hover {
        background-color: #f5f7fa;
      }
      .active {
        background-color: #f5f7fa;
      }
    }
  }
  .cont-right {
    flex: 1;
    background-color: #ffffff;
    padding: 20px;
    .dialogue-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px 20px;
      .top-left {
        .customer-info {
          font-weight: bold;
          margin-bottom: 8px;
          .info-tag {
            padding: 2px 0;
            font-size: 12px;
            font-weight: normal;
            color: #294a7b;
            border-radius: 3px;
            padding: 0 5px;
            border: 1px solid #294a7b;
            margin-left: 5px;
          }
        }
        .info-tips {
          font-size: 12px;
          color: #909399;
        }
      }
      .top-right {
        display: flex;
        .search-input {
          display: flex;
          margin-right: 10px;
          // border: 1px solid red;
          span {
            height: 28px;
            line-height: 28px;
            flex: 0.5;
            margin-right: 5px;
            color: #606266;
          }
          .el-input {
            flex: 1.5;
          }
          // .el-icon-search {
          //   cursor: pointer;
          // }
        }
        .date-picker {
          span {
            color: #606266;
            margin-right: 5px;
          }
        }
      }
    }
    .dialogue-content-box {
      height: calc(100% - 87px);
      padding: 0 20px;
      background-color: #fff;
    }
    .dialogue-content {
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      overflow-y: auto;
      background-color: #f5f5f5;
      .none-content {
        user-select: none;
        text-align: center;
        line-height: 600px;
        color: #606266;
      }
      .dialogue-more {
        text-align: center;
        span {
          color: #409eff;
          user-select: none;
          cursor: pointer;
          font-size: 12px;
        }
      }
      .dialogue-item {
        padding: 20px 0;
        .dialogut-item-time {
          margin: 5px 0;
          font-size: 12px;
          color: #606266;
          text-align: center;
        }
        .item-left-box {
          margin-top: 5px;
          display: flex;
          .left-content {
            display: flex;
            width: 50%;
            .avatar {
              width: 36px;
              height: 36px;
              border-radius: 3px;
              overflow: hidden;
            }
            .message {
              margin-left: 10px;
              display: flex;

              .msg-text {
                p {
                  padding: 5px 10px;
                  max-width: 400px;
                  line-height: 20px;
                  background-color: #ffffff;
                  border-radius: 5px;
                  color: #606266;
                  word-break: break-all;
                  word-wrap: break-word;
                }
              }
              .msg-emotions,
              .msg-image {
                cursor: pointer;
                background-color: #ffffff;
                padding: 5px;
                border-radius: 5px;
                color: #606266;
                .el-image {
                  max-width: 300px;
                  // border: 1px solid red;
                  /deep/.image-slot {
                    font-size: 20px;
                    text-align: center;
                    line-height: 40px;
                    width: 40px;
                    height: 40px;
                  }
                }
              }
              .msg-app-before {
                padding: 5px 10px;
                max-width: 400px;
                line-height: 20px;
                background-color: #ffffff;
                border-radius: 5px;
                color: #606266;
                word-break: break-all;
                word-wrap: break-word;
              }
              .msg-app {
                width: 240px;
                height: 100px;
                .msg-app-div {
                  cursor: pointer;
                  width: 100%;
                  height: 100%;
                  border: 1px solid #ccc;
                  background-color: rgba(243, 240, 240, 0.2);
                  border-radius: 5px;
                  .msg-app-top {
                    width: 100%;
                    height: 75%;
                    border-bottom: 1px solid #ccc;
                    display: flex;
                    flex-flow: column;
                    .msg-app-serve {
                      padding-left: 10px;
                      padding-top: 5px;
                      line-height: 20px;
                      flex: 1;
                      width: 90%;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                      font-size: 12px;
                      color: #1d211a;
                    }
                    .msg-app-title {
                      padding-left: 10px;
                      line-height: 20px;
                      flex: 1;
                      width: 90%;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                      font-size: 14px;
                      color: #222832;
                    }
                    .msg-app-content {
                      padding-left: 10px;
                      line-height: 20px;
                      flex: 1;
                      width: 90%;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                      font-size: 12px;
                      color: #949492;
                    }
                  }
                  .msg-app-bottom {
                    height: 25%;
                    width: 100%;
                    line-height: 25px;
                    color: #a8a3a5;
                    font-size: 12px;
                    margin-left: 5px;
                    i {
                      margin-right: 5px;
                    }
                  }
                }
              }

              .send-message-tag {
                cursor: pointer;
                margin-top: 7px;
                margin-left: 5px;
              }
            }
          }
        }
        .item-right-box {
          margin-top: 5px;
          display: flex;
          flex-direction: row-reverse;
          .right-content {
            display: flex;
            flex-direction: row-reverse;
            .avatar {
              width: 36px;
              height: 36px;
              border-radius: 3px;
              overflow: hidden;
            }
            .message {
              margin-right: 10px;
              display: flex;
              .msg-text {
                p {
                  padding: 5px 10px;
                  max-width: 400px;
                  line-height: 20px;
                  background-color: #ffffff;
                  border-radius: 5px;
                  color: #606266;
                  word-break: break-all;
                  word-wrap: break-word;
                }
              }

              .msg-emotions,
              .msg-image {
                cursor: pointer;
                background-color: #ffffff;
                padding: 5px;
                border-radius: 5px;
                color: #606266;
                .el-image {
                  max-width: 300px;
                  /deep/.image-slot {
                    font-size: 20px;
                    text-align: center;
                    line-height: 40px;
                    width: 40px;
                    height: 40px;
                  }
                }
              }
              .msg-app-before {
                padding: 5px 10px;
                max-width: 400px;
                line-height: 20px;
                background-color: #ffffff;
                border-radius: 5px;
                color: #606266;
                word-break: break-all;
                word-wrap: break-word;
              }
              .msg-app {
                // border: 1px solid red;
                width: 240px;
                height: 100px;
                .msg-app-div {
                  cursor: pointer;
                  width: 100%;
                  height: 100%;
                  // box-shadow: 1px 1px 1px 1px rgba($color: #000000, $alpha: 0.3);
                  border: 1px solid #ccc;
                  background-color: rgba(243, 240, 240, 0.2);
                  border-radius: 5px;
                  .msg-app-top {
                    width: 100%;
                    height: 75%;
                    border-bottom: 1px solid #ccc;
                    display: flex;
                    flex-flow: column;
                    .msg-app-serve {
                      padding-left: 10px;
                      padding-top: 5px;
                      line-height: 20px;
                      flex: 1;
                      width: 90%;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                      font-size: 12px;
                      color: #1d211a;
                    }
                    .msg-app-title {
                      padding-left: 10px;
                      line-height: 20px;
                      flex: 1;
                      width: 90%;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                      font-size: 14px;
                      color: #222832;
                    }
                    .msg-app-content {
                      padding-left: 10px;
                      line-height: 20px;
                      flex: 1;
                      width: 90%;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      word-break: break-all;
                      font-size: 12px;
                      color: #949492;
                    }
                  }
                  .msg-app-bottom {
                    height: 25%;
                    width: 100%;
                    line-height: 25px;
                    color: #a8a3a5;
                    font-size: 12px;
                    margin-left: 5px;
                    i {
                      margin-right: 5px;
                    }
                    // border: 1px solid green;
                  }
                }
              }
              .msg-link {
                width: 240px;
                height: 100px;
                .msg-link-box {
                  cursor: pointer;
                  width: 100%;
                  height: 100%;
                  border: 1px solid #ccc;
                  background-color: rgba(243, 240, 240, 0.2);
                  border-radius: 5px;
                  display: flex;
                  flex-flow: column;
                  .msg-link-top {
                    // height: 80px;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    margin-top: 10px;
                    padding: 0 10px;
                    flex: 1;
                    line-height: 15px;
                  }
                  .msg-link-bottom {
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    // padding-top: 10px;
                    flex: 1.5;
                    display: flex;
                    .msg-link-content {
                      // height: 80px;
                      line-height: 15px;
                      color: #949492;
                      padding: 5px 10px;
                      font-size: 12px;

                      flex: 4.5;
                    }
                    .msg-link-img {
                      flex: 1.5;
                      text-align: center;

                      img {
                        width: 40px;
                        height: 40px;
                      }
                    }
                  }
                }
              }
              .send-message-right {
                cursor: pointer;
                margin-top: 7px;
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }
}
.member-msg-div {
  // border: 1px solid red;
  height: 60px;
  overflow-y: auto;
}
.member-msg-block-box {
  background-color: #fff;
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 280px;
  height: 400px;
  box-sizing: border-box;
  position: absolute;
  z-index: 999;
}
.member-msg-block {
  cursor: pointer;
  user-select: none;
  overflow: auto;
  height: 380px;
  box-sizing: border-box;
  .customer-all-none {
    text-align: center;
    color: #606266;
    line-height: 300px;
    user-select: none;
  }
  .member-search {
    width: 260px;
    position: fixed;
    background-color: #fff;
    z-index: 999;
    overflow: hidden;
    display: flex;
    span {
      color: #606266;
      margin-left: 5px;
      height: 40px;
      line-height: 40px;
      flex: 1.5;
    }
    .el-input {
      flex: 2.5;
      margin: 5px 10px 0 0;
      ::v-deep i {
        height: 25px;
      }
    }
  }
}
.member-msg-block::-webkit-scrollbar {
  width: 5px;
}
.member-all-msg {
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 10px 0;
  position: relative;
  .member-avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 3px;
    overflow: hidden;
  }
  .member-name {
    color: #606266;
  }
  .member-icon {
    margin-left: 5px;
  }
}
.member-all-msg:hover {
  background-color: #f5f7fa;
}
.member-all-div {
  margin-top: 50px;
}
.cont-right-none {
  width: calc(100% - 300px);
  // border: 1px solid red;
  text-align: center;
  line-height: 700px;
  color: #606266;
}
.none-title,
.customer-info-none {
  color: #606266;
  user-select: none;
}
.customer-list-none {
  color: #606266;
  text-align: center;
  line-height: 500px;
  user-select: none;
}
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
.none-dispose {
  // border: 1px solid red;
  margin: 0 auto;
  width: 70%;
  height: 100%;
  background-image: url(../../../images/none_dispose.png);
  background-repeat: no-repeat;
  div {
    padding-top: 600px;
    .el-button {
      display: block;
      margin-left: 43%;
    }
  }
}
::v-deep .el-alert__icon {
  font-size: 20px;
  width: 20px;
}
</style>
