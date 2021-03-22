<template>
  <div>
    <div class="addlivecode">
      <div class="container">
        <div class="query-table-box">
          <el-form inline :model="searchForm" label-width="100px" label-position="right" size="small">
            <el-form-item label="草稿名称:">
              <el-input placeholder="请输入草稿名称" v-model="searchForm.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="searchLiveCodeList">查询</el-button>
              <el-button size="small" type="info" @click="reLiveCodeSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="common-table-box">
          <el-table
            :data="tableData"
            width="100%"
            id="table"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
            :height="height"
          >
            <el-table-column type="index" label="序号" align="center"> </el-table-column>
            <el-table-column label="群发标题" prop="name" align="center"> </el-table-column>
            <el-table-column label="群发类型" prop="chatTypeName" align="center"> </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center"> </el-table-column>
            <el-table-column label="发送时间" prop="scheduledSendTime" align="center"> </el-table-column>
            <el-table-column label="操作" align="center" class="caozuo-column" :formatter="formatterColumn">
            </el-table-column>
          </el-table>
        </div>
        <div class="common-pagination">
          <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>
      </div>
    </div>

    <el-dialog
      title="内容详情"
      :visible.sync="dialogFormVisible"
      class="taskDialog"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-table
        :data="messageItemList"
        style="width: 95%;margin: 0 auto"
        height="300"
        :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
      >
        <el-table-column type="index" align="center" label="序号"></el-table-column>
        <el-table-column label="群发内容" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.type == 'program'">
              <el-tag size="mini" style="margin-right: 10px;" type="success">
                小程序
              </el-tag>
            </div>
            <div v-if="scope.row.type == 'image'">
              <img :src="imgHost + scope.row.imageUrl" style="width:80px;height:80px;" />
            </div>
            <div v-if="scope.row.type == 'image_text'">
              <el-tag size="mini" style="margin-right: 10px;">
                图文
              </el-tag>
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
        <!-- <el-table-column v-for="(item, index) in columns" :key="index" v-bind="item"> </el-table-column> -->
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

      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      height: 400,
      searchForm: {
        name: ''
      }
    }
  },
  methods: {
    getPage() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        chatType: 'group',
        status: 'draft',
        name: this.searchForm.name
      }

      api.groupChatSendPage(params).then((res) => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    showContentDialog(row) {
      this.dialogFormVisible = true
      let textContent = ''
      api.groupGet({ id: row.id }).then((res) => {
        this.messageItemList = res.data.data.messageItemList
        textContent = res.data.data.message
        this.messageItemList.push({ content: textContent, type: 'text' })
      })
    },
    formatterColumn(row) {
      return (
        <div>
          <el-button type="text" onClick={this.openForm.bind(this, row)}>
            编辑群发
          </el-button>
          <el-button type="text" onClick={this.showContentDialog.bind(this, row)}>
            查看内容
          </el-button>
          <el-button type="text" onClick={this.deteleRow.bind(this, row)}>
            删除
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
      this.getPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getPage()
    },
    searchLiveCodeList() {
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.getPage()
    },
    reLiveCodeSearch() {
      this.searchForm.name = ''
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.getPage()
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
  padding: 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.common-table-box {
  padding: 0px 20px;
  box-sizing: border-box;
}
.text-content-div {
  max-height: 300;
  display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
  // -webkit-line-clamp: 6; /* 指定几行 */
  overflow: hidden;
}
</style>
