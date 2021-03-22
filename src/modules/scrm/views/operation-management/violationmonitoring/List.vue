<template>
  <div class="violation-div">
    <div class="violation-container">
      <div class="violation-container-top">
        <!-- <div>违规监测</div> -->
        <div class="violation-container-pass">
          <div class="violation-password">账号</div>
          <div class="violation-password-select" @click="changeIsBlock()">
            <img
              :src="chooseUser.thumbAvatar || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'"
              alt=""
            />
            <div>{{ chooseUser.name || '全部账户' }}</div>
            <i class="el-icon-arrow-down" v-if="isBlock == false"></i>
            <i class="el-icon-arrow-up" v-else></i>
          </div>
          <transition name="el-zoom-in-top">
            <div class="violation-select-block" v-if="isBlock == true">
              <div class="violation-select-top">
                <div class="violation-block-title">全部账户({{ searchUserName.total }})</div>
                <div class="violation-block-input">
                  <el-input
                    placeholder="请输入账号"
                    size="mini"
                    @input="getPermitUserPage"
                    v-model="searchUserName.name"
                  ></el-input>
                </div>
              </div>
              <div class="violation-select-bottom">
                <div class="violation-select-item" @click="chooseAllCustomer()">
                  <img src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" alt="" />
                  <div class="violation-item-name">全部账户</div>
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
          <!-- <div class="violation-notice">
            <i class="el-icon-check"></i> 提醒通知：已开启
            <span class="violation-notice-dispose" @click="noticeDialog.config.visible = true">设置</span>
          </div> -->
          <!-- <div class="violation-notice-block">
            隐藏的第二个div
          </div> -->
          <div class="violation-search">
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
      <div class="violation-contain-center">
        <div class="violation-contain-all">
          全部敏感词
        </div>
        <div class="violation-contain-key">
          <span class="add-key" @click="addWord()"><i class="el-icon-plus"></i>添加敏感词</span>
          <span class="all-key" @click="chooseAll()">全部</span>
          <div
            v-for="(wordItem, wordIndex) in wordList"
            :key="wordIndex"
            class="wordItem-span"
            @click="chooseWord(wordItem)"
          >
            {{ wordItem.word }}
          </div>
        </div>
      </div>
      <div class="violation-contain-bottom">
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
      </div>
      <div class="violation-contain-none" v-if="messageItem.length == 0">
        <span>暂无数据</span>
      </div>
    </div>
    <com-dialog :config="noticeDialog.config" @closeDialog="noticeDialog.config.visible = false" class="dialogSelect">
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
            <span class="right-span">是否开启</span>
          </el-form-item>
          <el-form-item label="接受通知管理员:">
            <div class="dialogSelect-people-select" @click="openPeopleSelect()">
              <div class="dialogSelect-poeple-item">
                <img src="../../../images/default-cover.png" alt="" />
                <span>成员</span>
              </div>
              <i class="el-icon-arrow-down" v-if="isPeopleBlock == false"></i>
              <i class="el-icon-arrow-up" v-if="isPeopleBlock == true"></i>
            </div>
            <transition name="el-zoom-in-top">
              <div class="dialogSelect-people-block" v-if="isPeopleBlock == true">
                <div class="dialog-fixed">
                  <div class="dialogSelect-block-top">
                    <span>全部管理员( 18 )</span>
                    <span>添加管理员</span>
                  </div>
                  <div class="dialogSelect-block-input">
                    <el-input placeholder="请输入管理员名称" size="mini"></el-input>
                  </div>
                </div>
                <div class="dialogSelect-bottom">
                  <div class="dialogSelect-bottom-item">
                    <el-radio></el-radio>
                    <img src="../../../images/default-cover.png" alt="" />
                    <span>成员名称</span>
                  </div>
                  <div class="dialogSelect-bottom-item">
                    <el-radio></el-radio>
                    <img src="../../../images/default-cover.png" alt="" />
                    <span>成员名称</span>
                  </div>
                  <div class="dialogSelect-bottom-item">
                    <el-radio></el-radio>
                    <img src="../../../images/default-cover.png" alt="" />
                    <span>成员名称</span>
                  </div>
                </div>
              </div>
            </transition>
          </el-form-item>
          <el-form-item label="通知频率:">
            <el-radio-group v-model="noticeModel.radio">
              <el-radio :label="0">每次通知</el-radio>
              <el-radio :label="1">每天通知一次</el-radio>
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
        isOpen: true,
        radio: '0'
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
        userId: ''
      },
      sendTime: '',
      wordList: [],
      enterpriseModel: {
        word: '',
        type: 'crop-conversation',
        sortNumber: '0',
        groupId: 'default'
      },
      redMessage: []
    }
  },
  methods: {
    //点击全部账号下拉隐藏列表
    changeIsBlock() {
      this.isBlock = !this.isBlock
    },
    //选择下拉列表的成员
    chooseItem(item) {
      this.isBlock = false
      this.chooseUser.thumbAvatar = item.thumbAvatar
      this.chooseUser.name = item.name
      this.getMessageList.userId = item.userId
      this.sendTime = ''
      this.getMessageList.keyword = ''
      this.getSessionSensitive()
    },
    //设置窗口取消按钮
    closeNoticeDialog() {
      this.noticeDialog.config.visible = false
    },
    //设置窗口保存按钮
    sumbitNotice() {
      this.noticeDialog.config.visible = false
    },
    //打开管理员下拉列表事件
    openPeopleSelect() {
      this.isPeopleBlock = !this.isPeopleBlock
    },
    //点击全部账户之后
    chooseAllCustomer() {
      this.isBlock = false
      this.chooseUser.thumbAvatar = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
      this.chooseUser.name = '全部账户'
      this.getMessageList.userId = ''
      this.sendTime = ''
      this.getMessageList.keyword = ''
      // this.searchUserName.name = ''
      this.getSessionSensitive()
    },
    //点击全部敏感词
    chooseAll() {
      this.getMessageList.keyword = ''
      this.getSessionSensitive()
    },
    //点击敏感词事件
    chooseWord(item) {
      this.getMessageList.keyword = item.word
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
      // console.log(item)
      this.$router.push(
        `/main/scrm/control/supervision/dialogue?conversationId=${item.conversationId}&sequence=${item.sequence}&userId=${item.fromUserId}&conversationName=${item.conversationName}&toUserType=${item.toUserType}`
      )
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
        keyword: this.getMessageList.keyword,
        userId: this.getMessageList.userId,
        startTime: startTime,
        endTime: endTime
      }
      this.$http.getSessionSensitive(params).then((res) => {
        res.data.data.list.forEach((item) => {
          let msg = item.sensitiveWordArray.toString()
          let re = new RegExp('\\' + msg, 'ig')
          let content = ''
          if (item.content != '') {
            content = item.content.replace(re, "<span style='color:#1e90ff;'>$&</span>")
          }
          // console.log(content)
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
        })
      })
    },
    //获取成员数据
    getPermitUserPage() {
      let params = {
        name: this.searchUserName.name
      }
      this.$http.getPermitUserPage(params).then((res) => {
        this.userPageList = res.data.data.list
        this.searchUserName.total = res.data.data.total
      })
    },
    //获取全部敏感词
    getSensitiveWord() {
      let params = {
        type: 'crop-conversation'
      }
      this.$http.getSensitiveWord(params).then((res) => {
        this.wordList = res.data.data.list
        // this.redMessage = res.data.data.list.sensitiveWordArray
      })
    }
    //接口部分结束
  },
  created() {
    this.getSessionSensitive()
    this.getPermitUserPage()
    this.getSensitiveWord()
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
.violation-div {
  width: 100%;
  height: 100%;
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
          background-color: #eeeded;
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
          height: 300px;
          position: absolute;
          // z-index: 999;
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
            .violation-block-title {
              flex: 1.2;
              margin: 5px;
              height: 48px;
              line-height: 48px;
              color: #606266;
            }
            .violation-block-input {
              flex: 1.8;
              padding-right: 5px;
              // height: 40px;
            }
          }
          .violation-select-bottom {
            margin-top: 55px;
            // padding-top: 48px;
            // height: 400px;
            .violation-select-item {
              cursor: pointer;
              display: flex;
              align-items: center;
              height: 40px;
              padding: 10px 10px 10px 20px;
              // border: 1px solid red;
              &:hover {
                background-color: #ccc;
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
          // position: relative;
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
          margin-left: auto;
          margin-right: 20px;
          span {
            margin-right: 10px;
            color: #606266;
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
          border: 1px solid rgb(240, 237, 237);
          background-color: rgb(236, 235, 235);
          color: #606266;
          padding: 5px 10px;
        }
        .wordItem-span {
          line-height: 15px;
          height: 15px;
          display: inline-block;
          cursor: pointer;
          user-select: none;
          border-radius: 5px;
          border: 1px solid rgb(240, 237, 237);
          background-color: rgb(236, 235, 235);
          color: #606266;
          padding: 5px 10px;
          margin-right: 8px;
          &:nth-child(1) {
            margin-left: 2px;
          }
        }
      }
    }
    .violation-contain-bottom {
      .violation-bottom-item {
        cursor: pointer;
        margin: 20px 0;
        background-color: #fff;
        .violation-item-top {
          display: flex;
          margin: 0 auto;
          width: 95%;
          border-bottom: 1px solid #ccc;
          padding: 10px 10px 5px 10px;
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
          }
        }
        .violation-item-bottom {
          margin: 0 auto;
          width: 95%;
          display: flex;
          justify-content: flex-start;
          padding: 10px 0;
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
              color: #1e90ff;
            }
          }
        }
      }
    }
    .violation-contain-none {
      text-align: center;
      width: 100%;
      height: 80%;
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
      width: 250px;
      height: 35px;
      border: 1px solid #d2d3d4;
      display: flex;
      justify-content: flex-start;
      &:hover {
        border-color: $--color-primary;
      }
      .dialogSelect-poeple-item {
        // border: 1px solid red;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 230px;
        display: flex;
        height: 33px;
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
      width: 250px;
      height: 350px;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 5px;
      }
      .dialog-fixed {
        // border: 1px solid red;
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
            &:nth-child(2) {
              margin-right: 10px;
              color: $--color-primary;
            }
          }
        }
        .dialogSelect-block-input {
          padding: 0 10px;
        }
      }
      .dialogSelect-bottom {
        margin-top: 75px;

        .dialogSelect-bottom-item {
          cursor: pointer;
          width: 250px;
          height: 50px;
          display: flex;
          &:hover {
            background-color: #ccc;
          }
          .el-radio {
            // border: 1px solid green;
            flex: 0.5;
            line-height: 50px;
            margin-left: 10px;
          }
          img {
            margin-top: 5px;
            margin-left: -30px;
            // border: 1px solid black;
            width: 40px;
            height: 40px;
            flex: 0.5;
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
    }
  }
  .dialogSelect-btn {
    display: flex;
    justify-content: flex-end;
    // border: 1px solid red;
  }
}
.name-class {
  color: #1e90ff;
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
      color: #1e90ff;
    }
  }
}
</style>
