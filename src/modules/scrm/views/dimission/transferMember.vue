<template>
  <el-dialog
    :title="index == 0 ? '待分配客户（' + total + '）' : '待分配客户群（' + total + '）'"
    :visible.sync="visible"
    width="920px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="common-table-box">
      <com-table :tableData="tableData" :column="column"></com-table>
    </div>
    <div class="common-pagination">
      <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
    </div>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()">确 定</el-button>
    </span> -->
  </el-dialog>
</template>

<script>
import ComTable from '../../components/common/ComTable'
import ComPagination from '../../components/common/ComPagination'
export default {
  components: { ComTable, ComPagination },
  props: {
    visible: Boolean,
    chatRequest: {
      type: Object,
      default: () => {
        return {}
      }
    },
    customerRequests: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: Number
    },
    total: {
      type: Number
    }
  },
  data() {
    return {
      searchForm: {
        content: ''
      },
      tableData: [],
      column: [
        // {
        //   type: 'index',
        //   label: '序号',
        //   align: 'center',
        //   width: '100px'
        // },
        {
          label: '姓名',
          align: 'center',
          minWidth: '50px',
          prop: 'name'
        },
        {
          label: '头像',
          align: 'center',
          minWidth: '60px',
          prop: 'avatar',
          formatter: (row) => {
            return <img src={row.avatar} alt="" width="44" height="44" />
          }
        },
        {
          label: '性别',
          align: 'center',
          minWidth: '30px',
          prop: 'gender',
          formatter: (row) => {
            return {
              1: '男',
              2: '女'
            }[row.gender]
          }
        },
        {
          label: '职务',
          align: 'center',
          minWidth: '60px',
          prop: 'position'
        },
        // {
        //   label: '部门',
        //   align: 'center',
        //   minWidth: '80px',
        //   prop: ''
        // },
        {
          label: '手机',
          align: 'center',
          minWidth: '60px',
          prop: 'mobile'
        },
        // {
        //   label: '邮箱',
        //   align: 'center',
        //   minWidth: '80px',
        //   prop: 'email'
        // },
        // {
        //   label: '添加时间',
        //   align: 'center',
        //   minWidth: '80px',
        //   prop: 'createTime'
        // }
        {
          label: '操作',
          align: 'center',
          width: '150px',
          fixed: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button type="primary" size="small" onClick={this.showEditDialog.bind(this, row)}>
                  分配给该成员
                </el-button>
              </div>
            )
          }
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      customerRequests: [
        {
          externalUserid: '',
          handoverUserid: '',
          takeoverUserid: ''
        }
      ]
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.getMemberPage()
        console.log(this.customerRequests, this.chatRequest, this.index)
      }
    }
  },
  created() {},
  methods: {
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getMemberPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getMemberPage()
    },
    getMemberPage() {
      let that = this
      that.$http.getMemberPage(that.page).then((res) => {
        that.tableData = res.data.data.list
        that.page.total = res.data.data.total
      })
    },
    // 客户批量分配
    showEditDialog(row) {
      if (this.index == 0) {
        this.customerRequests.forEach((item) => {
          item.takeoverUserid = row.userId
        })
        this.$http.getGoalsMembers(this.customerRequests).then((res) => {
          this.$message.success('分配成功')
          this.close(false)
        })
      } else if (this.index == 1) {
        this.chatRequest.newOwner = row.userId
        this.$http.getGoalsFlock(this.chatRequest).then((res) => {
          this.$message.success('分配成功')
          this.close(false)
        })
      }
    },

    close(flag) {
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      this.$emit('onClose', flag)
    }
  }
}
</script>
<style lang="scss" scoped>
.botbor {
  border: 1px dashed #999;
  padding: 15px 15px 0 15px;
}
.affix {
  margin-left: 120px;
  margin-bottom: 20px;
}
.gapsel {
  display: inline-block;
  width: 150px;
  margin: 0 5px;
}
.blank {
  display: inline-block;
  width: 75px;
  margin: 0 5px;
}
.tips1 {
  color: red;
  margin-bottom: 10px;
}
::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
</style>
