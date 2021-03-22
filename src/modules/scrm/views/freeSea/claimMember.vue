<template>
  <el-dialog
    :title="'请选择成员'"
    :visible.sync="visible"
    width="920px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="common-table-box">
      <com-table :tableData="tableData" :column="column"></com-table>
      <!-- <el-table
        :data="tableData"
        width="100%"
        id="table"
        :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
        height="500"
      >
        <el-table-column label="姓名" prop="name" align="center"> </el-table-column>
        <el-table-column label="头像" prop="avatar" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" alt="" width="44" height="44" />
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.gender=='1'?'男':'女'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="职务" prop="position" align="center"> </el-table-column>
        <el-table-column label="手机" prop="mobile" align="center"> </el-table-column>
        <el-table-column label="操作" align="center" class="caozuo-column">
          <template slot-scope="scope">
            <el-button v-if="id" type="primary" size="mini" @click="showEditDialog(scope.row)">认领</el-button>
            <el-button v-else type="text">选择</el-button>
          </template>
        </el-table-column>
      </el-table> -->
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
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
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
                  分配
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
      }
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
      that.$http.getMemberPage(that.page).then((res) => {
        that.tableData = res.data.data.list
        that.page.total = res.data.data.total
      })
    },
    // 客户批量分配
    showEditDialog(row) {
      this.$confirm('是否确认分配该给该成员认领?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.claimClient({ id: this.id, wxUserId: row.userId }).then((res) => {
          this.$message.success('认领成功')
          this.close(false)
        })
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
