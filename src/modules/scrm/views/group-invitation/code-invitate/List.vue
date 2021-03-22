<template>
  <div class="code-invitate-list">
    <div class="query-table-box">
      <div class="btn-groups">
        <el-button size="small" type="primary" @click="addCodeInvitation">新建拉群</el-button>
        <!-- <el-button size="small" type="primary" @click="batchCategory">批量分组</el-button> -->
      </div>
      <!-- <div class="search-content">
        <el-form label-width="120px" label-position="right" size="small">
          <el-form-item label="名称">
            <el-input placeholder="请输入名称"></el-input>
          </el-form-item>
        </el-form>
      </div> -->
    </div>
    <div class="common-table-box" id="table-box">
      <div class="table-box-left">
        <div class="select-table" :style="{ height: tableHeight + 52 + 'px' }">
          <div class="add-btn" @click="showCategoryAddDialog"><i class="el-icon-plus" />&nbsp;&nbsp;添加分组</div>
          <div
            class="select-box"
            v-for="(item, index) in categoryList"
            :key="index"
            @click="selectCategoryChange(item)"
          >
            <div class="select-item" :class="selectedCategory.id == item.id ? 'active' : ''">
              <div class="item-content">{{ item.name }}</div>
              <div class="item-btn" v-if="item.id">
                <el-popover placement="bottom" trigger="click" popper-class="select-popover">
                  <div class="popover-btns">
                    <el-button type="text" @click="showEditCategory(item)">编辑分组</el-button>
                    <el-button type="text" @click="deleteCategory(item)">删除分组</el-button>
                  </div>
                  <i slot="reference" class="el-icon-more" />
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-box-right">
        <el-table
          ref="multipleTable"
          :data="tableData"
          width="100%"
          id="table"
          :height="tableHeight"
          :header-cell-style="{ 'text-align': 'center' }"
          @selection-change="handleSelectionChange"
          :row-key="getRowKey"
        >
          <!-- <el-table-column type="selection" width="55" align="center" :reserve-selection="true"></el-table-column> -->
          <el-table-column label="二维码" align="center">
            <template slot-scope="scope">
              <el-image
                style="width: 50px; height: 50px"
                :src="scope.row.contactQrcode"
                :preview-src-list="[scope.row.contactQrcode]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="名称" align="center" prop="name"></el-table-column>
          <el-table-column label="使用成员" align="center">
            <template slot-scope="scope">
              <Tag type="light" v-for="(item, index) in scope.row.userList" :key="index">{{ item.userName }}</Tag>
            </template>
          </el-table-column>
          <el-table-column label="添加好友数" align="center"></el-table-column>
          <el-table-column label="标签" align="center"></el-table-column>
          <el-table-column label="拉群方式" align="center" prop="typeName"></el-table-column>
          <el-table-column label="群聊" align="center">
            <!-- <template>
              <div>群聊一</div>
            </template> -->
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.createTime | allTableTimefilters }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="getInvitationDetail(scope.row)">详情</el-button>
                <el-button type="text" @click="downloadCode(scope.row.contactQrcode, scope.row.name)">下载</el-button>
                <el-popover
                  placement="bottom"
                  width="50"
                  trigger="hover"
                  style="margin-left: 10px"
                  popper-class="select-popover"
                >
                  <div class="popover-btns">
                    <el-button type="text" @click="editInvitation(scope.row.id)">修改</el-button>
                    <el-button type="text" @click="deleteInvitation(scope.row.id)">删除</el-button>
                  </div>
                  <el-button slot="reference" type="text">更多</el-button>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="common-pagination">
      <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
    </div>
    <!-- 拉群详情 -->
    <com-dialog :config="detailDialog.config" @closeDialog="closeDetailDialog">
      <div class="detail-dialog">
        <div class="detail-left">
          <img class="qrcode" :src="invitationDetail.contactQrcode" />
          <div class="code-name">{{ invitationDetail.name }}</div>
          <div class="left-btn">
            <el-button
              type="primary"
              style="width: 120px"
              @click="downloadCode(invitationDetail.contactQrcode, invitationDetail.name)"
              >下载活码</el-button
            >
          </div>
          <div class="left-btn">
            <el-button style="width: 120px" @click="editInvitation(invitationDetail.id)">修改</el-button>
          </div>
        </div>
        <div class="detail-right">
          <el-form label-width="120px" label-position="right">
            <el-form-item label="创建时间：">
              <div>{{ invitationDetail.createTime | allTableTimefilters }}</div>
            </el-form-item>
            <el-form-item label="使用成员：">
              <Tag type="light" v-for="(item, index) in invitationDetail.userList" :key="index">{{
                item.userName
              }}</Tag>
            </el-form-item>
            <el-form-item label="客户标签：">
              <div>
                <Tag
                  type="light"
                  icon="el-icon-price-tag"
                  v-for="(item, index) in invitationDetail.behaviorTagList"
                  :key="index"
                >
                  {{ item.tagName }}
                </Tag>
              </div>
            </el-form-item>
            <el-form-item label="拉群方式：">
              <div>{{ invitationDetail.typeName }}</div>
            </el-form-item>
            <el-form-item label="入群引导语：">
              <div>{{ invitationDetail.message }}</div>
            </el-form-item>
            <el-form-item label="群聊详情：" v-if="invitationDetail.groupChatList">
              <template v-if="invitationDetail.type === 'chat_qrcode'">
                <div>共{{ invitationDetail.groupChatList.length }}个群聊</div>
                <div class="group-list">
                  <div class="group-box" v-for="(item, index) in invitationDetail.groupChatList" :key="index">
                    <img class="group-img" src="../../../images/group-icon.png" />
                    <div class="group-msg">
                      <div class="msg-name">{{ item.groupChatName }}</div>
                      <div class="msg-numb">{{ item.groupChatQuantity }} / {{ item.toplimitQuantity }}人</div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div>共{{ invitationDetail.groupChatList.length }}个群活码</div>
                <div class="group-list">
                  <div class="group-box" v-for="(item, index) in invitationDetail.groupChatList" :key="index">
                    <img class="group-img" :src="imgHost + item.qrcode" />
                    <div class="code-msg">群活码{{ index + 1 }}</div>
                  </div>
                </div>
              </template>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </com-dialog>
    <!-- 新增分组弹窗 -->
    <com-dialog :config="categoryAddDialog.config" @closeDialog="categoryAddDialog.config.visible = false">
      <div class="common-dialog">
        <el-form :model="categoryAddDialog.form" label-width="120px" :rules="categoryRules" ref="categoryAddForm">
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="categoryAddDialog.form.name" placeholder="请输入分组名称" clearable maxlength="12">
            </el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="seqNum">
            <el-input v-model="categoryAddDialog.form.seqNum" type="number"> </el-input>
          </el-form-item>
        </el-form>
        <div class="footer-btn">
          <el-button @click="categoryAddDialog.config.visible = false">取消</el-button>
          <el-button type="primary" @click="addCategory">确定</el-button>
        </div>
      </div>
    </com-dialog>
    <!-- 编辑分组弹窗 -->
    <com-dialog :config="categoryEditDialog.config" @closeDialog="categoryEditDialog.config.visible = false">
      <div class="common-dialog">
        <el-form :model="categoryEditDialog.form" label-width="120px" :rules="categoryRules" ref="categoryEditForm">
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="categoryEditDialog.form.name" placeholder="请输入分组名称" clearable maxlength="12">
            </el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="seqNum">
            <el-input v-model="categoryEditDialog.form.seqNum" type="number"> </el-input>
          </el-form-item>
        </el-form>
        <div class="footer-btn">
          <el-button @click="categoryEditDialog.config.visible = false">取消</el-button>
          <el-button type="primary" @click="editCategory">确定</el-button>
        </div>
      </div>
    </com-dialog>
    <com-dialog :config="batchCategoryDialog.config" @closeDialog="batchCategoryDialog.config.visible = false">
      <div class="common-dialog">
        <el-form label-width="120px">
          <el-form-item label="选择分组">
            <el-select v-model="batchCategoryDialog.selectedOption">
              <div class="add-new" v-if="categoryList.length > 0" @click="showCategoryAddDialog">
                <i class="el-icon-plus" />&nbsp;&nbsp;添加分组
              </div>
              <el-option label="" value="" v-if="categoryList.length <= 0">
                <div class="add-new" style="padding: 0" @click="showCategoryAddDialog">
                  <i class="el-icon-plus" />&nbsp;&nbsp;添加分组
                </div>
              </el-option>
              <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="footer-btn">
          <el-button @click="batchCategoryDialog.config.visible = false">取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
import Tag from '../../../components/components/Tag'
import FileSaver from 'file-saver'
export default {
  components: { ComPagination, ComDialog, Tag },
  data() {
    return {
      tableData: [],
      tableHeight: 400,
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      searchForm: {
        title: ''
      },
      detailDialog: {
        // 拉群详情
        config: {
          width: '800px',
          title: '拉群详情',
          visible: false
        }
      },
      categoryList: [], // 分组列表
      selectedCategory: {}, // 当前选中的分组
      categoryAddDialog: {
        // 新增分组
        config: {
          width: '600px',
          title: '添加分组',
          visible: false
        },
        form: {
          name: '',
          seqNum: 0
        }
      },
      categoryEditDialog: {
        // 编辑分组
        config: {
          width: '600px',
          title: '编辑分组',
          visible: false
        },
        form: {}
      },
      categoryRules: {
        name: [{ required: true, message: '请输入分组名称！', trigger: 'blur' }],
        seqNum: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
      },
      invitationDetail: {},
      selectionList: [],
      batchCategoryDialog: {
        config: {
          width: '600px',
          title: '批量分组',
          visible: false
        },
        selectedOption: ''
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  },
  created() {
    this.getCategoryList()
  },
  destroyed() {
    window.onresize = ''
  },
  methods: {
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 36,
        PADDING_BOTTOM_HEIGHT = 52,
        PADDING_TOP_HEIGHT = 0
      this.tableHeight =
        window.innerHeight -
        document.querySelector('#table-box').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getGroupInvitationPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getGroupInvitationPage()
    },
    // 关闭详情弹窗
    closeDetailDialog() {
      this.detailDialog.config.visible = false
    },
    // 新建拉群
    addCodeInvitation() {
      sessionStorage.setItem('CodeInvitateCategory', JSON.stringify(this.selectedCategory))
      this.$router.push(`/main/scrm/group-invitation/code/form`)
    },
    // 获取分组列表
    getCategoryList() {
      this.$http.getGroupInvitCategoryList().then((res) => {
        this.categoryList = res.data.data
        this.categoryList.unshift({
          id: '',
          appId: '',
          isDeleted: false,
          createTime: '',
          updateTime: '',
          name: '全部',
          seqNum: 999
        })
        let obj = sessionStorage.getItem('CodeInvitateCategory')
        if (obj && obj != '{}') {
          this.selectedCategory = JSON.parse(obj)
          this.getGroupInvitationPage()
          sessionStorage.removeItem('CodeInvitateCategory')
          console.log('返回分组对象', this.selectedCategory.name)
        } else {
          if (this.categoryList.length > 0) {
            // 默认选中第一个分组
            this.selectedCategory = this.categoryList[0]
            this.getGroupInvitationPage()
          } else {
            this.selectedCategory = {}
          }
        }
      })
    },
    // 选择分组
    selectCategoryChange(item) {
      this.selectedCategory = item
      this.$refs.multipleTable.clearSelection()
      this.getGroupInvitationPage()
    },
    showCategoryAddDialog() {
      this.categoryAddDialog.form.name = ''
      this.categoryAddDialog.form.seqNum = 0
      this.categoryAddDialog.config.visible = true
    },
    addCategory() {
      this.$refs.categoryAddForm.validate((valid) => {
        console.log('校验', valid)
        if (valid) {
          this.$http.addGroupInvitCategory(this.categoryAddDialog.form).then((res) => {
            this.$message.success('新增成功')
            this.categoryAddDialog.config.visible = false
            this.getCategoryList()
          })
        }
      })
    },
    deleteCategory(item) {
      this.$confirm('是否删除该分组？一经删除，分组所有群也会被删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteGroupInvitCategory({ id: item.id }).then(() => {
          this.$message.success('删除成功')
          this.getCategoryList()
        })
      })
    },
    showEditCategory(item) {
      this.categoryEditDialog.form = Object.assign({}, item)
      this.categoryEditDialog.config.visible = true
    },
    editCategory() {
      this.$refs.categoryEditForm.validate((valid) => {
        if (valid) {
          this.$http.updateGroupInvitCategory(this.categoryEditDialog.form).then((res) => {
            this.categoryEditDialog.config.visible = false
            this.$message.success('编辑成功')
            this.getCategoryList()
          })
        }
      })
    },
    getGroupInvitationPage() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        groupId: this.selectedCategory.id
      }
      this.$http.getCodeGroupInvitPage(params).then((res) => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
        this.tableData.forEach((item) => {
          // 多条群聊数据，显示展开、收起按钮，或者不显示任何按钮
        })
      })
    },
    editInvitation(id) {
      sessionStorage.setItem('CodeInvitateCategory', JSON.stringify(this.selectedCategory))
      // 注意这里需要在跳转前存储数据，因为这里的跳转是打开新窗口
      this.$openNewPage({path: `/main/scrm/group-invitation/code/form?id=${id}`})
    },
    deleteInvitation(id) {
      this.$confirm('删除后不可恢复，确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteCodeGroupInvit({ id: id }).then(() => {
          this.$message.success('删除成功')
          this.getGroupInvitationPage()
        })
      })
    },
    getInvitationDetail(row) {
      this.$http.getCodeGroupInvitDetail({ id: row.id }).then((res) => {
        this.invitationDetail = res.data.data
        this.detailDialog.config.visible = true
      })
    },
    downloadCode(file, name) {
      this.$nextTick(() => {
        this.$message.success('正在下载，请稍加等候')
        FileSaver.saveAs(file, name)
      })
    },
    getRowKey(row) {
      return row.id
    },
    handleSelectionChange(val) {
      console.log('选择列表', val)
      this.selectionList = val
    },
    batchCategory() {
      if (this.selectionList.length <= 0) {
        this.$message.warning('请选择需要分组的群')
      } else {
        // 批量分组
        this.batchCategoryDialog.config.visible = true
        // 默认选中第一项
        if (this.categoryList.length > 0) {
          this.batchCategoryDialog.selectedOption = this.categoryList[0].id
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.code-invitate-list {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.query-table-box {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
  background-color: #ffffff;
  .search-content {
    display: flex;
    align-items: center;
  }
}
.common-table-box {
  display: flex;
  margin-top: 15px;
  .table-box-left {
    width: 220px;
    margin-right: 15px;
    border-right: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    box-sizing: border-box;
    .select-table {
      background: #ffffff;
      color: #303133;
      font-size: 14px;
      text-align: left;
      .add-btn {
        padding: 15px 20px;
        border-bottom: 1px solid #ebeef5;
        cursor: pointer;
        box-sizing: border-box;
      }
      .select-item {
        display: flex;
        padding: 20px 0;
        border-bottom: 1px solid #ebeef5;
        cursor: pointer;
        &.active {
          background: #294a7b;
          color: #ffffff;
        }
        .item-content {
          width: 180px;
          padding: 0 0 0 20px;
          box-sizing: border-box;
        }
        .item-btn {
          display: none;
          width: 38px;
          text-align: center;
          .el-icon-more {
            transform: rotate(90deg);
          }
        }
      }
      .select-item:hover {
        .item-btn {
          display: block;
        }
      }
    }
  }
  .table-box-right {
    width: calc(100% - 235px);
    border-right: 1px solid #ebeef5;
    box-sizing: border-box;
  }
}
.common-pagination {
  width: calc(100% - 235px);
  position: absolute;
  right: 0;
  bottom: 0;
}
.detail-dialog {
  display: flex;
  height: 400px;
  .detail-left {
    flex: 0 0 200px;
    border-right: 1px solid #e8e8e8;
    padding: 0 20px 0 0;
    text-align: center;
    .qrcode {
      width: 120px;
      height: 120px;
      margin-top: 20px;
    }
    .code-name {
      margin-top: 20px;
      line-height: 24px;
    }
    .left-btn {
      margin-top: 20px;
    }
  }
  .detail-right {
    padding: 0 0 0 20px;
    flex: 1;
    overflow-y: auto;
    .group-list {
      .group-box {
        display: flex;
        padding: 10px;
        width: 250px;
        background: #ffffff;
        border: 1px solid #eee;
        line-height: 20px;
        margin-bottom: 20px;
        .group-img {
          width: 40px;
          height: 40px;
        }
        .group-msg {
          width: 200px;
          margin-left: 10px;
          .msg-name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .msg-numb {
            color: #999;
          }
        }
        .code-msg {
          line-height: 40px;
          font-weight: bold;
          color: #222222;
          margin-left: 10px;
        }
      }
    }
  }
}
.common-dialog {
  .footer-btn {
    display: flex;
    justify-content: flex-end;
  }
}
.add-new {
  font-size: 14px;
  padding: 0 20px;
  height: 34px;
  line-height: 34px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  color: #294a7b;
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
</style>

<style lang="scss">
.select-popover {
  min-width: 70px;
  .popover-btns {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .el-button {
    margin-left: 0;
  }
}
</style>
