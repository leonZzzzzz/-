<template>
  <div>
    <!-- <div class="QfTitle">群发记录</div> -->
    <div class="addlivecode">
      <div class="container">
        <div class="query-table-box">
          <el-form inline :model="searchForm" label-width="100px" label-position="right" size="small">
            <el-form-item label="群发标题">
              <el-input placeholder="请输入群发标题" v-model="searchForm.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="searchLiveCodeList">查询</el-button>
              <el-button size="small" type="info" @click="reLiveCodeSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="common-table-box">
          <!-- <com-table :tableData="tableData" :column="column"></com-table> -->
          <el-table
            :data="tableData"
            width="100%"
            id="table"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
            :height="height"
          >
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="群发标题" prop="name" align="center"> </el-table-column>
            <el-table-column label="群发类型" prop="chatTypeName" align="center"> </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center"> </el-table-column>
            <el-table-column label="群发时间" prop="sendTime" align="center"> </el-table-column>
            <el-table-column label="已发送数量" prop="sendQuantity" align="center"> </el-table-column>
            <el-table-column label="发送成功数" prop="sendSuccessRate" align="center"> </el-table-column>
            <el-table-column label="剩余未发数" prop="leftSendQuantity" align="center"> </el-table-column>
            <el-table-column label="群发成功率" prop="sendSuccessRate" align="center"> </el-table-column>
            <el-table-column label="状态" prop="statusName" align="center"> </el-table-column>
            <el-table-column label="操作" align="center" class="caozuo-column" :formatter="formatterColumn">
            </el-table-column>
          </el-table>
        </div>
        <div class="common-pagination">
          <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>
      </div>
    </div>
    <!-- <QcTable :column="column" :search-form="searchForm" :option="option"> </QcTable> -->
    <el-dialog title="查看消息" :visible.sync="openMessageDialog" :close-on-click-modal="false" :append-to-body="true">
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
import api from '../../../api/groupsend'
import ComPagination from '../../../components/common/ComPagination'
export default {
  components: { ComPagination },
  data() {
    return {
      // models:{
      MessageItem: [],
      // },
      openMessageDialog: false,
      openGroupDialog: false,
      searchForm: {
        name: ''
      },
      height: 400,
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      tableData: [],
      // searchForm: [
      //   {
      //     label: '群发标题',
      //     type: 'input',
      //     formName: 'name'
      //   }
      // ],

      // option: {
      //   url: 'api/admin/v1/groupChatSendMessage/page?status=to_be_send'
      // },
      // model: {
      //   name: '',
      //   senderName: '',
      //   sendTime: '',
      //   userQuantity: '',
      //   sendQuantity: '',
      //   sendSuccessQuantity: '',
      //   leftSendQuantity: '',
      //   sendSuccessRate: ''
      // },
      // column: [
      //   { type: 'index', label: '序号', align: 'center' },
      //   { prop: 'name', label: '群发标题', align: 'center' },
      //   { prop: 'chatTypeName', label: '群发类型', align: 'center' },

      //   // { prop: 'sender', label: '群发人', align: 'center' },
      //   { prop: 'createTime', label: '创建时间', align: 'center' },
      //   { prop: 'sendTime', label: '群发时间', align: 'center' },
      //   // { prop: 'sendQuantity', label: '已发送数量', align: 'center' },
      //   { prop: 'sendSuccessRate', label: '发送成功数', align: 'center' },
      //   { prop: 'leftSendQuantity', label: '剩余未发数', align: 'center' },
      //   { prop: 'sendSuccessRate', label: '群发成功率', align: 'center' },
      //   // { prop: 'statusName', label: '状态', align: 'center' },
      //   {
      //     label: '操作',
      //     align: 'center',
      //     formatter: row => {
      //       return (
      //         <div>
      //           <el-button
      //             type="text"
      //             onClick={() => {
      //               this.$router.push(`/main/scrm/groupsend/regroupsend/form?id=${row.id}`)
      //             }}
      //           >
      //             新增群发
      //           </el-button>
      //           <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
      //             查看消息
      //           </el-button>
      //           <el-button
      //             type="text"
      //             onClick={() => {
      //               this.$router.push(`/main/scrm/groupsend/regroupsend/detail?id=${row.id}`)
      //             }}
      //           >
      //             群发明细
      //           </el-button>
      //         </div>
      //       )
      //     }
      //   }
      // ],
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

    CloseDialog() {
      this.openMessageDialog = false
    },
    searchLiveCodeList() {
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.getPage()
    },
    reLiveCodeSearch() {
      this.searchForm.name = ''
      this.searchForm.userName = ''
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.getPage()
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
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
    },
    onPageChange(val) {
      this.page.pageNum = val
    },
    formatterColumn(row) {
      return (
        <div>
          <el-button type="text" onClick={this.openForm.bind(this, row)}>
            新增群发
          </el-button>
          <el-button type="text" onClick={this.openDetali.bind(this, row)}>
            群发明细
          </el-button>
          <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
            查看消息
          </el-button>
        </div>
      )
    },
    openForm(row) {
      this.$router.push(`/main/scrm/groupsend/regroupsend/form?id=${row.id}`)
    },
    openDetali(row) {
      this.$router.push(`/main/scrm/groupsend/regroupsend/detail?id=${row.id}`)
    },
    getPage() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        name: this.searchForm.name
      }
      let ress = []
      this.tableData = []
      api.groupChatSendPage(params).then((res) => {
        ress = res.data.data.list
        ress.forEach((item) => {
          if (item.status == 'to_be_send') {
            this.tableData.push(item)
          }
        })
      })
      // console.log(ress)
    }
  },
  created() {
    this.getPage()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  }
}
</script>

<style lang="scss" scoped>
// .QfTitle {
//   font-size: 14px;
//   color: #4d4d4d;
//   margin: 10px 0;
// }
// .el-table {
//   border: 0;
//   th,
//   tr,
//   td {
//     border: 0;
//     background-color: #fff;
//   }
//   &::before {
//     height: 0px;
//   }
//   &::after {
//     width: 0;
//   }

//   .el-table__fixed:before {
//     height: 0;
//   }
// }
// .RowPadding {
//   padding: 10px 0;
//   border-bottom: 1px solid rgba($color: #b1afaf, $alpha: 0.2s);
// }
.addlivecode {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
.query-table-box {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.common-table-box {
  padding: 0 20px;
  box-sizing: border-box;
}
// .common-pagination {
//   width: 100%;
//   position: absolute;
//   left: 0;
//   bottom: 0;
// }
</style>
