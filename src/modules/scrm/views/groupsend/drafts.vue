<template>
  <div>
    <!-- <div class="draftTitle">草稿箱</div> -->
    <QcTable ref="table" :column="column" :option="option"></QcTable>

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
import api from '../../api/groupsend'
export default {
  data() {
    return {
      messageItemList: [],
      dialogFormVisible: false,
      option: {
        url: 'api/admin/v1/groupChatSendMessage/page?status=draft'
      },
      column: [
        { type: 'index', label: '序号', align: 'center' },

        {
          prop: 'name',
          label: '群发标题',
          align: 'center'
        },
        {
          label: '查看内容',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.showContentDialog.bind(this, row)}>
                  查看内容
                </el-button>
              </div>
            )
          }
        },
        { prop: 'chatTypeName', label: '群发类型', align: 'center' },
        // { prop: 'createPeople', label: '群发客户', align: 'center' },
        { prop: 'createTime', label: '创建时间', align: 'center' },

        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push(`/main/scrm/groupsend/drafts/editDrafts?id=${row.id}`)
                  }}
                >
                  编辑群发
                </el-button>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$confirm('是否删除该数据?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      api.groupChatSendDelete({ id: row.id }).then(() => {
                        this.$message.success('删除成功')
                        this.$refs.table.onSearchKeep()
                      })
                    })
                  }}
                >
                  删除
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
      page: [
        {
          pageNum: 1,
          pageSize: 15,
          total: 0
        }
      ]
    }
  },
  methods: {
    getPage() {
      api.groupChatSendPage(this.page).then((res) => {
        console.log(res.data.data.list)
      })
    },
    showContentDialog(row) {
      this.dialogFormVisible = true
      api.groupGet({ id: row.id }).then((res) => {
        this.messageItemList = res.data.data.messageItemList
      })
    }
  },
  created() {
    // this.getPage()
  }
}
</script>

<style lang="scss" scoped>
.draftTitle {
  font-size: 14px;
  color: #4d4d4d;
  margin: 10px 0;
}
</style>
