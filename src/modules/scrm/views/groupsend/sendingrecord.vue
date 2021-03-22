<template>
  <div v-if="fresh">
    <!-- <div class="QfTitle">群发记录</div> -->
    <QcTable :column="column" :search-form="searchForm" :option="option"> </QcTable>
    <el-dialog
      title="查看消息"
      :visible.sync="openMessageDialog"
      :close-on-click-modal="false"
      :append-to-body="true"
      v-if="fresh"
    >
      <el-table :data="MessageItem" style="width: 100%" height="300">
        <el-table-column v-for="(item, index) in columns" :key="index" v-bind="item"> </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="CloseDialog()" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="群发明细" :visible.sync="openGroupDialog" :close-on-click-modal="false" :append-to-body="true">
      <span slot="footer" class="dialog-footer">
        <el-button @click="CloseGroupDialog()" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '../../api/groupsend'
export default {
  data() {
    return {
      // models:{
      MessageItem: [],
      // },

      List: {},
      Imagetype: {
        type: '',
        imageUrl: ''
      },
      Texttype: {
        type: '',
        content: ''
      },
      Filetype: {
        type: '',
        content: ''
      },
      Videotype: {
        type: '',
        videoUrl: ''
      },
      Apptype: {
        type: '',
        content: ''
      },
      ImageTexttype: {
        type: '',
        content: ''
      },
      openMessageDialog: false,
      fresh: true,
      openGroupDialog: false,
      searchForm: [
        {
          label: '群发标题',
          type: 'input',
          formName: 'name'
        }
      ],

      option: {
        url: 'api/admin/v1/groupChatSendMessage/page?status=success'
      },
      model: {
        name: '',
        senderName: '',
        sendTime: '',
        userQuantity: '',
        sendQuantity: '',
        sendSuccessQuantity: '',
        leftSendQuantity: '',
        sendSuccessRate: ''
      },
      column: [
        { type: 'index', label: '序号', align: 'center' },
        { prop: 'name', label: '群发标题', align: 'center' },
        { prop: 'chatTypeName', label: '群发类型', align: 'center' },

        // { prop: 'sender', label: '群发人', align: 'center' },
        { prop: 'createTime', label: '创建时间', align: 'center' },
        { prop: 'sendTime', label: '群发时间', align: 'center' },
        // { prop: 'sendQuantity', label: '已发送数量', align: 'center' },
        { prop: 'sendSuccessRate', label: '发送成功数', align: 'center' },
        { prop: 'leftSendQuantity', label: '剩余未发数', align: 'center' },
        { prop: 'sendSuccessRate', label: '群发成功率', align: 'center' },
        // { prop: 'statusName', label: '状态', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push(`/main/scrm/groupsend/sendingrecord/recordgroup?id=${row.id}`)
                  }}
                >
                  新增群发
                </el-button>
                <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
                  查看消息
                </el-button>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push(`/main/scrm/groupsend/newlyadded/groupSendingDetail?id=${row.id}`)
                  }}
                >
                  群发明细
                </el-button>
              </div>
            )
          }
        }
      ],
      columns: [
        {
          type: 'index',
          label: '序号',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '素材内容',
          minWidth: '300px',
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
    showEditDialog(row) {
      console.log(row.id)
      this.openMessageDialog = true
      api.chatListItem({ id: row.id }).then((res) => {
        this.MessageItem = res.data.data
        console.log(res.data.data)
      })
    },
    //新增群发按钮
    newAddGroup() {},

    CloseDialog() {
      this.openMessageDialog = false
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.QfTitle {
  font-size: 14px;
  color: #4d4d4d;
  margin: 10px 0;
}
.el-table {
  border: 0;
  th,
  tr,
  td {
    border: 0;
    background-color: #fff;
  }
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
.RowPadding {
  padding: 10px 0;
  // border-bottom: 1px solid rgba($color: #b1afaf, $alpha: 0.2s);
}
</style>
