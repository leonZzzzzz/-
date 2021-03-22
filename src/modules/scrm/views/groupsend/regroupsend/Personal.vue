<template>
  <div>
    <!-- 顶部导航 -->
    <div class="top_nav_tabe">
      <ul>
        <li
          v-for="(item, index) in catrgrouList"
          :key="index"
          :class="{
            active: item.isActive,
            borderRight: index == 0 && catrgrouList[1].isActive,
            borderLeft: index == catrgrouList.length - 1 && catrgrouList[catrgrouList.length - 2].isActive
          }"
          @click="relationClick(index)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="addlivecode">
      <div class="container">
        <div class="top_nav">
          <div class="query-table-box-button">
            <el-button type="primary" @click="openAddGroup" size="small">新建群发</el-button>
          </div>
          <div class="query-table-box" v-if="nowIndex == 0">
            <el-form inline :model="searchForm" label-width="100px" label-position="right" size="small">
              <el-form-item label="群发标题">
                <el-input
                  placeholder="请输入群发标题"
                  v-model="searchForm.name"
                  @input="searchLiveCodeList"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="发送完成时间">
                <el-date-picker
                  v-model="sendTime"
                  format="yyyy-MM-dd HH:mm"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="searchLiveCodeList"
                >
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item>
              <el-button size="small" type="primary" @click="searchLiveCodeList">查询</el-button>
              <el-button size="small" type="info" @click="reLiveCodeSearch">重置</el-button>
            </el-form-item> -->
            </el-form>
          </div>
          <div class="query-table-box" v-if="nowIndex == 1">
            <el-form inline :model="searchDraftForm" label-width="100px" label-position="right" size="small">
              <el-form-item label="群发标题">
                <el-input
                  placeholder="请输入群发标题"
                  v-model="searchDraftForm.name"
                  @input="searchLiveCodeListDraft"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <!-- <el-button size="small" type="primary" @click="searchLiveCodeListDraft">查询</el-button>
                <el-button size="small" type="info" @click="reLiveCodeSearchDraft">重置</el-button> -->
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- <div class="title-div">
          <span
            v-for="(item, index) in catrgrouList"
            :key="index"
            :class="{ checked: index == nowIndex }"
            @click="relationClick(index)"
            >{{ item.name }}</span
          >
        </div> -->
        <div class="common-table-box" v-if="nowIndex == 0">
          <el-table
            :data="tableData"
            width="100%"
            id="table"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
            :height="height"
          >
            <el-table-column label="群发标题" prop="name" align="center"> </el-table-column>
            <!-- <el-table-column label="群发类型" prop="chatTypeName" align="center"> </el-table-column> -->

            <el-table-column label="定时发送时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.scheduledSendTime | timeSubString }}</span>
              </template>
            </el-table-column>
            <el-table-column label="预约发送时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.prepareSendTime | timeSubString }}</span>
              </template>
            </el-table-column>
            <el-table-column label="成员确认发送时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.sendTime | timeSubString }}</span>
              </template>
            </el-table-column>
            <el-table-column label="客户总数" prop="sendQuantity" align="center"></el-table-column>
            <el-table-column label="已送达客户" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.sendSuccessQuantity || '0' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="未送达客户" prop="leftSendQuantity" align="center"> </el-table-column>
            <el-table-column label="送达率" align="center">
              <template slot-scope="scope">
                <span>{{ (scope.row.sendSuccessRate * 100).toFixed(2) + '%' }} </span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="状态" prop="statusName" align="center"> </el-table-column> -->
            <el-table-column label="创建时间" prop="createTime" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | timeSubString }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class="caozuo-column" :formatter="formatterColumn">
            </el-table-column>
          </el-table>
        </div>
        <div class="common-pagination" v-if="nowIndex == 0">
          <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>

        <div class="common-table-box" v-if="nowIndex == 1">
          <el-table
            :data="tableDraftData"
            width="100%"
            id="table"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
            :height="height"
          >
            <el-table-column label="群发标题" prop="name" align="center"> </el-table-column>
            <!-- <el-table-column label="群发类型" prop="chatTypeName" align="center"> </el-table-column> -->

            <!-- <el-table-column label="发送时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.sendTime | timeSubString }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | timeSubString }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class="caozuo-column" :formatter="formatterDraftColumn">
            </el-table-column>
          </el-table>
        </div>
        <div class="common-pagination" v-if="nowIndex == 1">
          <com-pagination
            :page="pageDraft"
            @sizeChange="onSizeDraftChange"
            @pageChange="onPageDraftChange"
          ></com-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="查看消息" :visible.sync="openMessageDialog" :close-on-click-modal="false" :append-to-body="true">
      <el-table
        :data="MessageItem"
        style="width: 100%"
        height="300"
        :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
      >
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
        <!-- <el-table-column v-for="(item, index) in columns" :key="index" v-bind="item"> </el-table-column> -->
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="CloseDialog()" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="群发详情" :visible.sync="openGroupDialog" :close-on-click-modal="false" :append-to-body="true">
      <span slot="footer" class="dialog-footer">
        <el-button @click="CloseGroupDialog()" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="内容详情"
      :visible.sync="dialogFormVisible"
      class="taskDialog"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-table
        :data="messageDraftItemList"
        style="width: 95%; margin: 0 auto"
        height="300"
        :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
      >
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
      nowIndex: 0,
      catrgrouList: [
        {
          name: '群发记录',
          id: 0,
          isActive: true
        },
        { name: '草稿箱', id: 1, isActive: false }
      ],
      MessageItem: [],
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
      sendTime: '',
      tableData: [],

      searchDraftForm: {
        name: ''
      },
      pageDraft: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      tableDraftData: [],
      messageDraftItemList: [],
      dialogFormVisible: false
    }
  },
  methods: {
    showEditDialog(row) {
      let MessageItem = []
      this.MessageItem = []
      let textContent = ''
      this.openMessageDialog = true
      api.groupGet({ id: row.id }).then(res => {
        MessageItem = res.data.data.messageItemList
        if (res.data.data.message != '') {
          textContent = res.data.data.message
          this.MessageItem.push({ content: textContent, type: 'text' })
        }
        MessageItem.forEach(item => {
          this.MessageItem.push(item)
        })
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
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.sendTime = ''
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
        PADDING_TOP_HEIGHT -
        44
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
    formatterColumn(row) {
      return (
        <div>
          {row.status == 'new' && (
            <el-button type="text" onClick={this.openEditMessage.bind(this, row)}>
              修改
            </el-button>
          )}
          <el-button type="text" onClick={this.openForm.bind(this, row)}>
            再次群发
          </el-button>
          <el-button type="text" onClick={this.openDetali.bind(this, row)}>
            详情
          </el-button>
        </div>
      )
    },
    // <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
    //   消息
    // </el-button>
    openForm(row) {
      this.$openNewPage({path: `/main/scrm/groupsend/operation/details?id=${row.id}&type=copy`})
    },
    openDetali(row) {
      this.$openNewPage({path: `/main/scrm/groupsend/regroupsend/detail?id=${row.id}`})
    },
    getPage() {
      let textContent = ''
      let date = this.sendTime
      let startSendTime = ''
      let endSendTime = ''
      if (date) {
        startSendTime = date[0]
        endSendTime = date[1]
      }
      if (startSendTime != '') {
        startSendTime += ':00'
      }
      if (endSendTime != '') {
        endSendTime += ':00'
      }
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        name: this.searchForm.name,
        chatType: 'single',
        startSendTime: startSendTime,
        endSendTime: endSendTime
      }
      api.groupChatSendPage(params).then(res => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    time(datetime) {
      let startAt = (new Date(this.date) * 1000) / 1000
      if (startAt < Date.now()) {
        datetime = new Date()
      }
      this.sendTime = datetime
      this.sendTime += ':00'
      // console.log(this.sendTime)
    },
    openAddGroup() {
      // this.$router.push('/main/scrm/groupsend/personalsend/form')
      this.$openNewPage({path: '/main/scrm/groupsend/operation/details'})
    },
    //
    relationClick(index) {
      if (this.catrgrouList[index].isActive) {
        return
      }
      for (var i = 0; i < this.catrgrouList.length; i++) {
        this.catrgrouList[i].isActive = false
      }
      this.catrgrouList[index].isActive = true
      this.nowIndex = index
      // if (this.nowIndex === 1) {
      // }
    },
    getDraftsPage() {
      let params = {
        pageNum: this.pageDraft.pageNum,
        pageSize: this.pageDraft.pageSize,
        chatType: 'single',
        status: 'draft',
        name: this.searchDraftForm.name
      }

      api.groupChatSendPage(params).then(res => {
        this.tableDraftData = res.data.data.list
        this.pageDraft.total = res.data.data.total
      })
    },
    searchLiveCodeListDraft() {
      this.searchDraftForm.pageNum = 1
      this.pageDraft.pageSize = 15
      this.pageDraft.total = 0
      this.getDraftsPage()
    },
    reLiveCodeSearchDraft() {
      this.searchDraftForm.name = ''
      this.pageDraft.pageNum = 1
      this.pageDraft.pageSize = 15
      this.pageDraft.total = 0
      this.getDraftsPage()
    },
    onSizeDraftChange(val) {
      this.pageDraft.pageSize = val
      this.pageDraft.pageNum = 1
      this.getDraftsPage()
    },
    onPageDraftChange(val) {
      this.pageDraft.pageNum = val
      this.getDraftsPage()
    },
    formatterDraftColumn(row) {
      return (
        <div>
          <el-button type="text" onClick={this.openDraftForm.bind(this, row)}>
            修改
          </el-button>
          <el-button type="text" onClick={this.deteleRow.bind(this, row)}>
            删除
          </el-button>
        </div>
      )
    },
    // <el-button type="text" onClick={this.showContentDialog.bind(this, row)}>
    //         内容
    //       </el-button>
    openDraftForm(row) {
      this.$openNewPage({path: `/main/scrm/groupsend/operation/details?id=${row.id}&type=update`})
    },
    showContentDialog(row) {
      this.dialogFormVisible = true
      let textContent = ''
      let messageDraftItemList = []
      this.messageDraftItemList = []
      api.groupGet({ id: row.id }).then(res => {
        messageDraftItemList = res.data.data.messageItemList
        if (res.data.data.message != '') {
          textContent = res.data.data.message
          this.messageDraftItemList.push({ content: textContent, type: 'text' })
        }
        messageDraftItemList.forEach(item => {
          this.messageDraftItemList.push(item)
        })
      })
    },
    deteleRow(row) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.groupChatSendDelete({ id: row.id }).then(() => {
          this.$message.success('删除成功')
          this.getDraftsPage()
          // this.$refs.table.onSearchKeep()
        })
      })
    },
    openEditMessage(row) {
      this.$openNewPage({path: `/main/scrm/groupsend/operation/details?id=${row.id}&type=update`})
    }
  },
  created() {
    this.getPage()
    this.getDraftsPage()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  },
  filters: {
    timeSubString(time) {
      if (!time) {
        return
      }
      return time.substring(0, time.length - 3)
    }
  }
}
</script>

<style lang="scss" scoped>
.top_nav_tabe {
  width: 100%;
  height: 44px;
  // background-color: #F5F5F5;
  display: flex;
  ul {
    display: flex;
    background-color: #ffffff;
    background-image: linear-gradient(to bottom, #ebeef5, #ffffff);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
    li {
      width: 120px;
      height: 44px;
      text-align: center;
      line-height: 44px;
      background-color: #ebeef5;
      font-size: 14px;
      user-select: none;
      // border-radius: 20px;
      cursor: pointer;
      &.active {
        border-radius: 0px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: #ffffff;
      }
      &.borderLeft {
        border-bottom-left-radius: 10px;
      }
      &.borderRight {
        border-bottom-right-radius: 10px;
      }
    }
  }
}
.addlivecode {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  .top_nav {
    display: flex;
    padding: 20px;
    &::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
}
.query-table-box {
  box-sizing: border-box;
  margin-left: auto;
}
.common-table-box {
  padding: 0 20px;
  box-sizing: border-box;
}
.text-content-div {
  max-height: 300;
  display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
  // -webkit-line-clamp: 6; /* 指定几行 */
  overflow: hidden;
}
.query-table-box-button {
}

.title-div {
  // border: 1px solid red;
  margin: 0 20px 20px;
  span {
    cursor: pointer;
    background-color: #f5f5f5;
    color: #000;
    padding: 10px 20px;
    user-select: none;
    font-size: 14px;
  }
}
.checked {
  background-color: #ffffff !important;
  // color: #fff !important;
}
</style>
