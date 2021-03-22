<template>
  <el-dialog
    :title="'请选择话术'"
    :visible.sync="visible"
    width="1020px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <Talk :introPage="introPage" @getSpeechId="getSpeechId"></Talk>
    <!-- <div class="common-table-box">
      <com-table :tableData="tableData" :column="column" :isFull="isfull" :height="height"></com-table>
    </div>
    <div class="common-pagination">
      <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
    </div> -->
  </el-dialog>
</template>

<script>
import ComTable from '../../../components/common/ComTable'
import ComPagination from '../../../components/common/ComPagination'
import Talk from '../../talking/talking/List'
export default {
  components: { ComTable, ComPagination, Talk },
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      introPage: 'drainage',
      height: 500,
      isfull: false,
      searchForm: {
        content: ''
      },
      tableData: [],
      column: [
        {
          label: '姓名',
          align: 'center',
          width: '130px',
          prop: 'name'
        },
        {
          label: '头像',
          align: 'center',
          width: '130px',
          prop: 'avatar',
          formatter: (row) => {
            return <img src={row.avatar} alt="" width="44" height="44" />
          }
        },
        {
          label: '性别',
          align: 'center',
          width: '70px',
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
          width: '150px',
          prop: 'position'
        },
        {
          label: '手机',
          align: 'center',
          width: '150px',
          prop: 'mobile'
        },

        {
          label: '操作',
          align: 'center',
          // width: '150px',
          fixed: 'right',
          formatter: (row) => {
            return this.id ? (
              <div>
                <el-button type="primary" size="small" onClick={this.showEditDialog.bind(this, row)}>
                  认领
                </el-button>
              </div>
            ) : (
              <el-button type="text" size="small" onClick={this.chooseId.bind(this, row)}>
                选择
              </el-button>
            )
          }
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      speechcraft: {}
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.getMemberPage()
      }
    }
  },
  created() {},
  methods: {
    getSpeechId(list) {
      sessionStorage.setItem('speechcraft', list)
      this.close(false)
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getMemberPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getMemberPage()
    },
    // 选择成员
    chooseId(row) {
      this.$emit('chooseConfirm', row)
      this.close(false)
    },
    getMemberPage() {
      let that = this
      that.$http.getSpeechcraftPage(that.page).then((res) => {
        that.tableData = res.data.data.list
        that.page.total = res.data.data.total
      })
    },
    // 客户批量分配
    showEditDialog(row) {
      this.$http.claimClient({ id: this.id, wxUserId: row.userId }).then((res) => {
        this.$message.success('认领成功')
        this.close(false)
      })
    },

    close(flag) {
      this.model = this.$options.data().model
      this.$emit('innerclose', flag)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  margin-top: 1vh !important;
}
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
