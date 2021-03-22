<template>
  <div>
    <!-- <div class="draftTitle">草稿箱</div> -->
    <div class="addlivecode">
      <div class="container">
        <div class="common-table-box">
          <!-- <com-table :tableData="tableData" :column="column"></com-table> -->
          <el-table
            :data="tableData"
            width="100%"
            id="table"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
            :height="height"
          >
            <!-- <el-table-column type="index"></el-table-column> -->
            <el-table-column label="群发标题" prop="name" align="center"> </el-table-column>
            <el-table-column label="查看内容" class="caozuo-column" align="center" :formatter="showFromatter">
            </el-table-column>
            <el-table-column label="群发类型" prop="chatTypeName" align="center"> </el-table-column>
            <!-- <el-table-column label="群发客户" prop="createPeople" align="center"> </el-table-column> -->
            <el-table-column label="创建时间" prop="createTime" align="center"> </el-table-column>

            <el-table-column label="操作" align="center" class="caozuo-column" :formatter="formatterColumn">
            </el-table-column>
          </el-table>
        </div>
        <div class="common-pagination">
          <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>
      </div>
    </div>
    <!-- <QcTable ref="table" :column="column" :option="option"></QcTable> -->

    <el-dialog
      title="内容详情"
      :visible.sync="dialogFormVisible"
      class="taskDialog"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-table :data="messageItemList" style="width: 100%" height="300">
        <el-table-column v-for="(item, index) in columns" :key="index" v-bind="item"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
      messageItemList: [],
      dialogFormVisible: false,
      tableData: [],
      // option: {
      //   url: 'api/admin/v1/groupChatSendMessage/page?status'
      // },
      // column: [
      //   { type: 'index', label: '序号', align: 'center' },

      //   {
      //     prop: 'name',
      //     label: '群发标题',
      //     align: 'center'
      //   },
      //   {
      //     label: '查看内容',
      //     align: 'center',
      //     formatter: row => {
      //       return (
      //         <div>
      //           <el-button type="text" onClick={this.showContentDialog.bind(this, row)}>
      //             查看内容
      //           </el-button>
      //         </div>
      //       )
      //     }
      //   },
      //   { prop: 'chatTypeName', label: '群发类型', align: 'center' },
      //   // { prop: 'createPeople', label: '群发客户', align: 'center' },
      //   { prop: 'createTime', label: '创建时间', align: 'center' },

      //   {
      //     label: '操作',
      //     align: 'center',
      //     formatter: row => {
      //       return (
      //         <div>
      //           <el-button
      //             type="text"
      //             onClick={() => {
      //               this.$router.push(`/main/scrm/groupsend/drafts/form?id=${row.id}`)
      //             }}
      //           >
      //             编辑群发
      //           </el-button>
      //           <el-button
      //             type="text"
      //             onClick={() => {
      //               this.$confirm('是否删除该数据?', '提示', {
      //                 confirmButtonText: '确定',
      //                 cancelButtonText: '取消',
      //                 type: 'warning'
      //               }).then(() => {
      //                 api.groupChatSendDelete({ id: row.id }).then(() => {
      //                   this.$message.success('删除成功')
      //                   this.$refs.table.onSearchKeep()
      //                 })
      //               })
      //             }}
      //           >
      //             删除
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
          label: '群发内容',
          minWidth: '400px',
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
      ],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      height: 400
    }
  },
  methods: {
    getPage() {
      // let ress = []
      // this.tableData = []

      api.groupChatSendPage(this.page).then((res) => {
        this.tableData = res.data.data.list
        this.page.total = res.data.total
      })
      // console.log(ress)
    },
    showContentDialog(row) {
      this.dialogFormVisible = true
      api.groupGet({ id: row.id }).then((res) => {
        this.messageItemList = res.data.data.messageItemList
      })
    },
    formatterColumn(row) {
      return (
        <div>
          <el-button type="text" onClick={this.openForm.bind(this, row)}>
            编辑群发
          </el-button>

          <el-button type="text" onClick={this.deteleRow.bind(this, row)}>
            删除
          </el-button>
        </div>
      )
    },
    showFromatter(row) {
      return (
        <div>
          <el-button type="text" onClick={this.showContentDialog.bind(this, row)}>
            查看内容
          </el-button>
        </div>
      )
    },
    deteleRow(row) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.groupChatSendDelete({ id: row.id }).then(() => {
          this.$message.success('删除成功')
          this.getPage()
          // this.$refs.table.onSearchKeep()
        })
      })
    },
    openForm(row) {
      this.$router.push(`/main/scrm/groupsend/drafts/form?id=${row.id}`)
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
// .draftTitle {
//   font-size: 14px;
//   color: #4d4d4d;
//   margin: 10px 0;
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
  // padding: 0 20px;
  box-sizing: border-box;
}
// .common-pagination {
//   width: 100%;
//   position: absolute;
//   left: 0;
//   bottom: 0;
// }
// .common-pagination {
//   width: 100%;
//   position: absolute;
//   left: 0;
//   bottom: 0;
// }
</style>
