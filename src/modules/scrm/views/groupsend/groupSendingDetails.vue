<template>
  <div class="groupSend">
    <QcNavigationPage content="查看明细">
      <!-- <QcNavigationMenu :path="path"></QcNavigationMenu> -->
      <div class="content">
        <!-- <div class="groupTitle"></div> -->
        <div class="groupMessage">
          <div class="MessageTitle">
            平台信息
          </div>
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
              <el-table :data="messageList.messageItemList" style="width:50%" height="300">
                <el-table-column v-for="(item, index) in column" :key="index" v-bind="item"> </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="ZongHeBox">
          <div class="ZongHeTitle">
            综合数据
          </div>
          <div class="ZongHeRow">
            <el-row :gutter="24">
              <el-col :span="6">
                <div class="Col-Top">群发群数</div>
                <div class="Col-Bot">{{ messageList.sendQuantity }}</div>
              </el-col>
              <el-col :span="6">
                <div class="Col-Top">剩余未发群数</div>
                <div class="Col-Bot">{{ messageList.leftSendQuantity }}</div>
              </el-col>
              <el-col :span="6">
                <div class="Col-Top">群发进度</div>
                <div class="Col-Bot">{{ messageList.sendProgressRate * 100 }}%</div>
              </el-col>
              <el-col :span="6">
                <div class="Col-Top">群发成功率</div>
                <div class="Col-Bot">{{ messageList.sendSuccessRate * 100 }}%</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- <div class="NumBox">

      </div> -->
      </div>
    </QcNavigationPage>
  </div>
</template>

<script>
import api from '../../api/groupsend'
export default {
  data() {
    return {
      messageList: {},
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
      api.groupGet({ id: this.$route.query.id }).then((res) => {
        this.messageList = res.data.data
        this.ContentList = res.data.data.messageItemList
        console.log(this.messageList)
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
      margin: 20px 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
      .MessageTitle {
        // border: 1px solid red;
        padding: 20px;
        font-size: 18px;
        color: rgba(21, 38, 52, 1);
        font-weight: bold;
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
        padding: 20px;
        font-size: 18px;
        color: rgba(21, 38, 52, 1);
        font-weight: bold;
      }
      .ZongHeRow {
        .el-col {
          height: 149px;
          margin: 5px 20px;
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
</style>
