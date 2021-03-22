<template>
  <div class="groupSend">
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">群发详情</el-button>
    </div>
    <div class="main_content">
      <!-- <QcNavigationMenu :path="path"></QcNavigationMenu> -->
      <div class="content">
        <!-- <div class="groupTitle"></div> -->
        <div class="groupMessage">
          <div class="MessageTitle">基础信息</div>
          <div class="MessageRow">
            <el-row :gutter="24">
              <el-col :span="6" class="groupCol">
                <div class="groupName1">群发标题:</div>
                <div class="groupName2">{{ messageList.name }}</div>
              </el-col>

              <el-col :span="6"
                >群发状态:<span>{{ messageList.statusName }}</span></el-col
              >
              <el-col :span="6"
                >群发类型:<span>{{ messageList.chatTypeName }}</span></el-col
              >
              <el-col :span="6"
                >群发时间:<span>{{ messageList.sendTime }}</span></el-col
              >
              <el-col :span="6"
                >创建时间:<span>{{ messageList.createTime }}</span></el-col
              >
            </el-row>
          </div>
          <div class="MessageBiao">
            <div class="BiaoTitle">群发内容:</div>
            <div class="Biao">
              <el-table
                :data="messageItemList"
                style="width: 50%"
                height="300"
                :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
              >
                <!-- <el-table-column v-for="(item, index) in column" :key="index" v-bind="item"> </el-table-column> -->
                <el-table-column type="index" align="center" label="序号"></el-table-column>
                <el-table-column label="群发内容" align="left">
                  <template slot-scope="scope">
                    <div v-if="scope.row.type == 'program'">
                      <el-tag size="mini" style="margin-right: 10px" type="success"> 小程序 </el-tag>
                    </div>
                    <div v-if="scope.row.type == 'image'">
                      <img :src="imgHost + scope.row.imageUrl" style="width: 80px; height: 80px" />
                    </div>
                    <div v-if="scope.row.type == 'image_text'">
                      <el-tag size="mini" style="margin-right: 10px"> 图文 </el-tag>
                    </div>
                    <div
                      class="text-content-div"
                      v-if="scope.row.type == 'text'"
                      v-html="parsingEmoji(scope.row.content)"
                    ></div>
                  </template>
                </el-table-column>
                <el-table-column label="群发类型" align="center" width="150">
                  <template slot-scope="scope">
                    <div>
                      <span v-if="scope.row.type == 'program'">小程序</span>
                      <span v-if="scope.row.type == 'image'">图片</span>
                      <span v-if="scope.row.type == 'image_text'">图文</span>
                      <span v-if="scope.row.type == 'text'">文字</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="ZongHeBox">
          <div class="ZongHeTitle">综合数据</div>
          <div class="ZongHeRow" v-if="messageList.chatType == 'group'">
            <el-row :gutter="24">
              <el-col :span="6">
                <div class="Col-Top">送达客户</div>
                <div class="Col-Bot">{{ messageList.sendSuccessQuantity || 0 }}</div>
              </el-col>
              <el-col :span="6">
                <div class="Col-Top">未送达客户</div>
                <div class="Col-Bot">{{ messageList.leftSendQuantity }}</div>
              </el-col>
              <el-col :span="6">
                <div class="Col-Top">送达率</div>
                <div class="Col-Bot">{{ messageList.sendSuccessRate * 100 }}%</div>
              </el-col>
            </el-row>
          </div>
          <div class="ZongHeRow" v-if="messageList.chatType == 'single'">
            <el-row :gutter="24">
              <el-col :span="6">
                <div class="Col-Top">送达客户</div>
                <div class="Col-Bot">{{ messageList.sendSuccessQuantity || 0 }}</div>
              </el-col>
              <el-col :span="6">
                <div class="Col-Top">未送达客户</div>
                <div class="Col-Bot">{{ messageList.leftSendQuantity }}</div>
              </el-col>
              <el-col :span="6">
                <div class="Col-Top">送达率</div>
                <div class="Col-Bot">{{ messageList.sendSuccessRate * 100 }}%</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- <div class="NumBox">

      </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../../api/groupsend'
export default {
  data() {
    return {
      messageList: {},
      messageItemList: [],
      column: [
        {
          type: 'index',
          label: '序号',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '内容',
          minWidth: '150px',
          align: 'center',
          prop: 'content',
          formatter: (row) => {
            return {
              text: <div>{row.content}</div>,
              image: <img src={this.imgHost + row.imageUrl} style="width:80px;height:80px;" alt="" />,
              image_text: (
                <div>
                  <el-tag size="mini" style="margin-right: 10px;">
                    图文
                  </el-tag>
                  {row.name}
                </div>
              ),
              video: <video style="width: 150px; height: 100px;" src="#" controls="controls" />,
              program: (
                <div>
                  <el-tag size="mini" style="margin-right: 10px;" type="success">
                    小程序
                  </el-tag>
                  {row.name}
                </div>
              ),
              file: (
                <div>
                  <el-tag size="mini" style="margin-right: 10px;" type="warning">
                    文件
                  </el-tag>
                  {row.name}
                </div>
              )
            }[row.type]
          }
        },
        {
          label: '类型',
          minWidth: '150px',
          align: 'center',
          prop: 'type',
          formatter: (row) => {
            return {
              text: '文字',
              image: '图片',
              image_text: '图文',
              video: '视频',
              program: '小程序',
              file: '文件'
            }[row.type]
          }
        }
      ]
    }
  },
  methods: {
    getMessage() {
      this.messageItemList = []
      api.groupGet({ id: this.$route.query.id }).then((res) => {
        // let ContentList = res.data.data.messageItemList
        this.messageList = res.data.data
        let message = res.data.data.message
        if (message != '') {
          this.messageItemList.push({ type: 'text', content: message })
        }
        let messageItemList = res.data.data.messageItemList
        messageItemList.forEach((item) => {
          this.messageItemList.push(item)
        })
      })
    }
  },
  created() {
    // console.log(this.$route.query.id)
    this.getMessage()
  }
}
</script>

<style lang="scss" scoped>
.groupSend {
  .content {
    .groupTitle {
      width: 100%;
      height: 100px;
      background-color: #fff;
    }
    .groupMessage {
      // margin: 20px 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
      .MessageTitle {
        // border: 1px solid red;
        padding: 20px 0;
        font-size: 16px;
        color: #262626;
        position: relative;
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
          left: -20px;
        }
      }
      .MessageRow {
        // border: 1px solid red;
        .el-row {
          padding: 20px;
          .el-col {
            // border: 1px solid green;
            padding: 10px 0;
            width: 390px;
            color: #7b8190;
            font-size: 14px;
            span {
              // border: 1px solid red;
              // display: inline-block;
              padding-left: 5px;
            }
          }
        }
      }
      .MessageBiao {
        // border: 1px solid green;
        .BiaoTitle {
          // border: 1px solid green;
          display: block;
          margin: 0px 20px;
          color: #7b8190;
          font-size: 14px;
        }
        .Biao {
          // width: 70%;
          // border: 1px solid black;
          margin: 0px 100px;
        }
      }
    }
    .ZongHeBox {
      padding-bottom: 50px;
      margin: 20px 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
      .ZongHeTitle {
        padding: 20px 0;
        font-size: 16px;
        color: #262626;
        position: relative;
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
          left: -20px;
        }
      }
      .ZongHeRow {
        .el-col {
          height: 149px;
          margin: 5px 15px;
          width: 361px;
          border: 1px solid #cccccc;
          .Col-Top {
            margin: 19px 0 25px 37px;
            color: #152634;
            font-size: 15px;
          }
          .Col-Bot {
            color: rgb(139, 139, 151);
            font-size: 34px;
            margin: 19px 0 25px 37px;
          }
        }
      }
    }
  }
}
.groupCol {
  // border: 1px solid red;
  display: flex;
}
.groupName1 {
  // border: 1px solid red;
  width: 18%;
}
.groupName2 {
  width: 82%;
  // border: 1px solid red;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
}
/deep/ .el-table {
  border: 0;
  &::before {
    height: 0px;
  }
  &::after {
    width: 0;
  }

  .el-table__fixed:before {
    height: 0;
  }
}
.text-content-div {
  max-height: 300;
  display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
  // -webkit-line-clamp: 4; /* 指定几行 */
  overflow: hidden;
}
.main_content {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
}
</style>
