<template>
  <div style="height: 100%">
    <!-- <div class="dialogue-top">
      <div class="top-title">聊天记录</div>
      <el-button size="mini" type="info" @click="goBack">返回</el-button>
    </div> -->
    <GoBack :title="'聊天记录'"></GoBack>
    <div class="container">
      <div class="cont-top">
        <div class="customer-info">
          {{ conversationName }}
          <el-tag
            style="margin-left: 10px"
            size="mini"
            :type="
              toUserType == 'internal'
                ? 'success'
                : toUserType == 'external'
                ? 'warning'
                : toUserType == 'group'
                ? ''
                : 'info'
            "
          >
            {{
              toUserType == 'internal'
                ? '内部'
                : toUserType == 'external'
                ? '外部'
                : toUserType == 'group'
                ? '群聊'
                : ''
            }}
          </el-tag>
        </div>
        <div class="info-tips">对方已同意存档会话内容</div>
      </div>
      <div class="dialogue-content" id="scroll-top" ref="loadMoreMsg">
        <div class="dialogue-more">
          <span @click="getMoreMessage" v-if="getMessagePageSizeNum.pageSize == conversationList.length"
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
              <el-avatar class="avatar" v-if="item.sender.id != userId" :src="item.sender.avatar | isHttp"></el-avatar>
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
                <div class="msg-text" v-if="item.messageType == 'text'">
                  <p v-html="parsingEmoji(item.content)"></p>
                </div>
                <div class="msg-emotions" v-if="item.messageType == 'emotion'">
                  <el-image :src="(item.host + item.fileUrl) | isImage" :preview-src-list="[item.host + item.fileUrl]">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
                <div class="msg-image" v-if="item.messageType == 'image'">
                  <el-image :src="(item.host + item.fileUrl) | isImage" :preview-src-list="[item.host + item.fileUrl]">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
                <div class="msg-text" v-if="item.messageType == 'weapp'">
                  <p v-html="parsingEmoji(item.content)"></p>
                </div>
                <div class="msg-text" v-if="item.messageType == 'link'">
                  <p v-html="parsingEmoji(item.content)"></p>
                </div>
                <div class="msg-text" v-if="item.messageType == 'voice'">
                  <p v-html="parsingEmoji(item.content)"></p>
                </div>
                <div class="msg-text" v-if="item.messageType == 'chatrecord'">
                  <p v-html="parsingEmoji(item.content)"></p>
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
          <div class="item-left-box">
            <div class="left-content">
              <img class="avatar" src="#" alt="" />
              <div class="message">
                <div class="msg-text">你好，欢迎你！</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialogue-item">
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
</template>

<script>
import GoBack from '../../../components/components/GoBack.vue'
export default {
  components: {
    GoBack
  },
  data() {
    return {
      conversationId: '',
      sequence: '',
      userId: '',
      conversationList: [],
      conversationName: '',
      toUserType: '',
      sensitiveWordArray: [],
      getMessagePageSizeNum: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      scrollTop: ''
    }
  },

  methods: {
    goBack() {
      this.$openNewPageBack()
    },
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
    getMoreMessage() {
      this.loadMore()
    },
    loadMore() {
      this.getMessagePageSizeNum.pageSize += 20
      this.getSequence()
      // this.conversationList = []
      // let params = {
      //   pageNum: this.getMessagePageSizeNum.pageNum,
      //   pageSize: this.getMessagePageSizeNum.pageSize,
      //   conversationId: this.conversationId,
      //   sequence: this.sequence
      // }
      // this.$http.getSequence(params).then(res => {
      //   let arr = this.sensitiveWordArray.split(',')
      //   res.data.data.list.forEach(item => {
      //     let msg = arr
      //     let str = ''
      //     msg.forEach(item => {
      //       str = str + item + '|'
      //     })
      //     str.substring(0, str.length - 1)
      //     let re = new RegExp('\\' + str, 'ig')
      //     let content = ''
      //     if (item.content != '') {
      //       content = item.content.replace(re, "<span style='color:red;'>$&</span>")
      //     }
      //     if (item.sender != null) {
      //       // this.conversationList.push(item)
      //       this.conversationList.push({
      //         action: item.action,
      //         content: content,
      //         conversationType: item.conversationType,
      //         fileUrl: item.fileUrl,
      //         host: item.host,
      //         id: item.id,
      //         messageTime: item.messageTime,
      //         messageType: item.messageType,
      //         sender: item.sender
      //       })
      //     }
      //   })
      //   this.conversationList.concat(this.conversationList)
      //   this.conversationList.reverse()
      //   this.$nextTick(() => {
      //     let middle = document.getElementById('scroll-top')
      //     // middle.scrollTop = this.scrollTop
      //     console.log(middle.scrollHeight)
      //   })
      // })
    },
    showloadmore() {
      this.$nextTick(() => {
        let middle = document.getElementById('scroll-top')
        console.log('首次加载' + middle.scrollHeight)
        this.scrollTop = middle.scrollHeight
      })
    },
    //接口开始
    getSequence() {
      this.conversationList = []
      let params = {
        pageNum: this.getMessagePageSizeNum.pageNum,
        pageSize: this.getMessagePageSizeNum.pageSize,
        conversationId: this.conversationId,
        sequence: this.sequence
      }
      this.$http.getSequence(params).then((res) => {
        let arr = this.sensitiveWordArray.split(',')
        res.data.data.list.forEach((item) => {
          let msg = arr
          let str = ''
          msg.forEach((item) => {
            str = str + item + '|'
          })
          str.substring(0, str.length - 1)
          let re = new RegExp('\\' + str, 'ig')
          let content = ''
          if (item.content != '') {
            content = item.content.replace(re, "<span style='color:red;'>$&</span>")
          }
          if (item.sender != null) {
            // this.conversationList.push(item)
            this.conversationList.push({
              action: item.action,
              content: content,
              conversationType: item.conversationType,
              fileUrl: item.fileUrl,
              host: item.host,
              id: item.id,
              messageTime: item.messageTime,
              messageType: item.messageType,
              sender: item.sender
            })
          }
        })
        this.conversationList.concat(this.conversationList)
        this.conversationList.reverse()
        // this.showloadmore()
      })
    }
    //接口结束
  },
  created() {
    if (this.$route.query) {
      this.conversationId = this.$route.query.conversationId
      this.sequence = this.$route.query.sequence
      this.userId = this.$route.query.userId
      this.conversationName = this.$route.query.conversationName
      this.toUserType = this.$route.query.toUserType
      this.sensitiveWordArray = this.$route.query.sensitiveWordArray
    }
    this.getSequence()
    this.getScrollY()
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
  height: calc(100% - 52px);
  font-size: 14px;
  padding: 0 20px;
  background-color: #ffffff;
  // margin: auto;
  box-sizing: border-box;
}
.dialogue-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;
  .top-title {
    font-weight: bold;
  }
}
#scroll-top {
  padding: 0 10px;
}
.dialogue-content {
  height: calc(100% - 100px);
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
    padding-top: 10px;
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
            background-color: #409eff;
            border-radius: 5px;
            color: #ffffff;
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
.dialogue-content::-webkit-scrollbar {
  width: 5px;
}
.cont-top {
  padding: 20px 0;
  .customer-info {
    font-size: 14px;
    color: #000000;
    font-weight: bold;
  }
  .info-tips {
    font-size: 12px;
    color: #909399;
    margin-top: 10px;
  }
}
</style>
