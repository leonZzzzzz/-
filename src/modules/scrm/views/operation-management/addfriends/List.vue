<template>
  <div class="addlivecode">
    <div class="container">
      <div class="query-table-box">
        <el-form
          inline
          :model="searchForm"
          label-width="70px"
          label-position="left"
          size="small"
        >
          <div class="form_content">
            <div class="left">
              <el-form-item class="import-item">
                <el-button
                  size="small"
                  type="primary"
                  @click="openAddLiveCode"
                  class="import-excel-float"
                >导入Excel</el-button>
              </el-form-item>
            </div>
            <div class="right">
              <el-form-item label="文件名称">
                <el-input
                  placeholder="请输入文件名称"
                  v-model="searchForm.name"
                  clearable
                  @input="searchList"
                ></el-input>
              </el-form-item>
              <el-form-item label="上传时间">
                <el-date-picker
                  v-model="searchForm.time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  clearable
                  @change="searchList"
                >
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item>
                <el-button size="small" type="primary" @click="searchList">查询</el-button>
                <el-button size="small" type="info" @click="reSearch">重置</el-button>
              </el-form-item> -->
            </div>
          </div>
        </el-form>
      </div>
      <!-- <div class="operating-btn"> -->

      <!-- </div> -->
      <div class="common-table-box">
        <!-- <com-table :tableData="tableData" :column="column"></com-table> -->
        <el-table
          :data="tableData"
          width="100%"
          id="table"
          class="el-table"
          :cell-style="changeCellStyle"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          :height="height"
        >
          <!-- <el-table-column type="index" label="序号" align="center"> </el-table-column> -->
          <el-table-column
            label="文件名称"
            prop="name"
            align="center"
          > </el-table-column>

          <el-table-column
            label="分配人员"
            align="center"
            class="special-column"
            width="500px"
          >
            <template slot-scope="scope">
              <div class="tagname-form">
                <!-- <span class="tagNames" v-for="(item, index) in scope.row.userList" :key="index"
                  ><i class="el-icon-user-solid icon-user"></i>{{ item.userName }}</span
                > -->
                <Tag
                  type="light"
                  v-for="(item, index) in scope.row.userList"
                  :key="index"
                > {{ item.userName }} </Tag>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="总人数/已添加人数" prop="quantity" align="right" class=""> </el-table-column>
          <el-table-column prop="friendQuantity"> </el-table-column> -->
          <!-- <el-table-column label="标签" prop="beizhu" align="center">
            <template slot-scope="scope">
              <div class="tagname-form">
                <span class="tagName" v-for="(item, index) in scope.row.tagList" :key="index">{{ item.name }}</span>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column
            label="已添加人数/总人数"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.friendQuantity || '0' }}</span>
                <span>/</span>
                <span>{{ scope.row.quantity }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="上传时间"
            prop="createTime"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime | allTableTimefilters }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            :formatter="formatterColumn"
            width="165px"
          >
            <template slot-scope="scope">
              <div>
                <el-button
                  type="text"
                  @click="readDetails(scope.row.id)"
                >详情</el-button>
                <el-button
                  type="text"
                  @click="remindFriend(scope.row.id)"
                >提醒</el-button>
                <!-- <el-button type="text" @click="detailsFriend(scope.row.id)">详情</el-button> -->
                <el-button
                  type="text"
                  @click="deleteFriend(scope.row.id)"
                >删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="common-pagination">
        <com-pagination
          :page="page"
          @sizeChange="onSizeChange"
          @pageChange="onPageChange"
        ></com-pagination>
      </div>
    </div>
    <com-dialog
      :config="importExcel.config"
      @closeDialog="importExcel.config.visible = false"
    >
      <div class="import-excel">
        <div class="import-title">
          提示:请下载模板填写手机号上传，可批量复制手机号至模板内，出现重复手机号或者空行会自动过滤
        </div>
        <div class="import-click">
          点击下载<el-button
            type="text"
            @click="downloadExcel"
          >Excel批量添加好友模板&gt;</el-button>
        </div>
        <div class="import-form">
          <el-form ref="model">
            <el-form-item
              label="上传表格"
              :required="true"
              prop="excel"
            >
              <!-- <FileUpload @onSuccess="fileUploadSuccess"></FileUpload> -->

              <el-upload
                class="upload-wrap"
                :action="action"
                :show-file-list="false"
                :on-change="onChange"
                :auto-upload="false"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              >
                <div class="tip-text">
                  <p class="icon el-icon-plus"></p>
                </div>
              </el-upload>
              <div
                class="tip-p"
                v-if="excelName != ''"
              >
                <i class="el-icon-folder-opened folder-opened"></i>&nbsp;&nbsp;{{ excelName }}
              </div>
              <!-- <up-load-file url="api/admin/v1/friend/importExcel" size="mini" id="ids" :err-tip="true"></up-load-file> -->
            </el-form-item>
            <el-form-item
              label="关联成员"
              :required="true"
            >
              <div
                class="import-form-person tag-item"
                v-if="form.monentsUsers.length != 0"
              >
                <!-- <span v-for="(item, index) in form.monentsUsers" :key="index">
                  <i class="item-icon el-icon-s-custom"></i>
                  {{ item.name }}
                </span> -->
                <Tag
                  v-for="(item, index) in form.monentsUsers"
                  :key="index"
                >{{ item.name }}</Tag>
              </div>
              <div class="import-form-person">
                <el-button
                  icon="el-icon-plus"
                  plain
                  size="small"
                  @click="openPeople"
                >添加</el-button><br />
                （导入的表格手机号码将平均分配给关联的成员，分配完成后成员将在企业微信收到添加好友的任务，需要手动添加）
              </div>
            </el-form-item>
            <!-- <el-form-item label="行为标签">
              <el-button type="text" @click="openBehaviorTag">添加</el-button>
              <div class="import-form-person">
                （选择标签后，表格里添加成功的客户会被自动打上标签）
              </div>
            </el-form-item> -->
          </el-form>
        </div>
      </div>
      <div class="submit_btn_box">
        <el-button @click="importExcel.config.visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitImportData"
        >确定</el-button>
      </div>
    </com-dialog>

    <department-dialog
      :config="departmentDialog.config"
      @closeDialog="departmentDialog.config.visible = false"
      :selectedList="form.monentsUsers"
      ref="department"
      @handleConfirm="handleConfirm"
    >
    </department-dialog>

    <!-- <com-dialog
      :config="selectEnterDialog.config"
      @closeDialog="selectEnterDialog.config.visible = false"
      class="dialogSelect"
    >
      <div v-if="tagNameList == ''">
        <div class="none-tag-title">
          暂无创建的标签，<el-button type="text" @click="openRouter">请先前往创建&gt;</el-button>
        </div>
      </div>
      <div v-if="tagNameList != ''">
        <div class="selectGroup">
          <div class="leftTitle">
            <span>已选</span>
          </div>
          <div class="rightTags">
            <el-tag
              v-for="(tag, index) in spanName"
              :key="index"
              closable
              type="info"
              :disable-transitions="true"
              @close="closeTagList(tag, index)"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        <div v-for="(item, index) in tagNameList" :key="index">
          <div class="tagGroupTitle">{{ item.name }}</div>
          <div class="tagChange">
            <div
              @click="changeTag(items.tagId, items.id, items.name)"
              v-for="(items, indexs) in item.tagList"
              :key="indexs"
              :class="{ active: spanIndex.includes(items.id) }"
            >
              {{ items.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="Btn-two">
        <el-row :gutter="24">
          <el-col :span="6">&nbsp; </el-col>
          <el-col :span="6">
            <el-button type="info" @click="closeTagDialog()">取消</el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="sumbitTagDialog()">确定</el-button>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>
      </div>
    </com-dialog> -->
  </div>
</template>

<script>
import { BASEURL } from '@/utils/config'
import ComDialog from '../../../components/common/ComDialog'
import ComPagination from '../../../components/common/ComPagination'
// import FileUpload from '../../../components/common/FileUpload'
import DepartmentDialog from '../../../components/components/MemberTreeLinkageDialog'
import api from '../../../api/operation-management'
import FileSaver from 'file-saver'
import Tag from '../../../components/components/Tag'
// import Tag from '@/components/service/Tag.vue'
export default {
  components: { ComPagination, ComDialog, DepartmentDialog, Tag },
  data() {
    return {
      action: '',

      importExcel: {
        config: {
          width: '700px',
          title: '导入Excel',
          visible: false
        }
      },
      departmentDialog: {
        config: {
          width: '700px',
          title: '关联人员',
          visible: false
        }
      },
      selectEnterDialog: {
        config: {
          width: '600px',
          title: '编辑企业客户标签',
          visible: false
        }
      },
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      genderOptions: [
        { label: '全部', value: '' },
        { label: '男', value: '1' },
        { label: '女', value: '2' }
      ],
      tagList: [],
      groupList: [],
      tableData: [],
      form: {
        monentsUsers: []
      },
      file: {
        form: {}
      },
      height: 400,
      tagNameList: [], //获取编辑整个分组的信息
      spanIndex: [], //点击标签颜色会变得数组
      spanName: [],
      userIdList: '',
      fileUrl: '',
      formData: [],
      searchForm: {
        name: '',
        time: ''
      },
      excelName: '',
      isSumbit: true
    }
  },
  methods: {
    getFriendsPage() {
      console.log(this.searchForm.time)
      if (!this.searchForm.time) {
        this.searchForm.time = ['', '']
      }
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        name: this.searchForm.name,
        startCreateTime: this.searchForm.time[0],
        endCreateTime: this.searchForm.time[1]
      }
      api.addFriendPage(params).then(res => {
        this.tableData = res.data.data.list
        // this.page.pageNum = res.data.pageNum
        // this.page.pageSize = res.data.pageSize
        this.page.total = res.data.data.total
      })
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getFriendsPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getFriendsPage()
    },
    //点击查询按钮
    searchList() {
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.getFriendsPage()
    },
    //点击重置按钮
    reSearch() {
      this.searchForm.name = ''
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.searchForm.time = ''
      this.getFriendsPage()
    },
    // 获取客户列表
    // getCustomerPage() {
    // let that = this
    // let tagIds = ''
    // let groupIds = ''
    // that.searchForm.tags.forEach((item, idx) => {
    //   if (idx === 0) {
    //     tagIds += item
    //   } else {
    //     tagIds += '_' + item
    //   }
    // })
    // that.searchForm.groups.forEach((item, idx) => {
    //   if (idx === 0) {
    //     groupIds += item
    //   } else {
    //     groupIds += '_' + item
    //   }
    // })
    // let date = this.searchForm.dateTimeRange
    // let startCreateAt = ''
    // let endCreateAt = ''
    // if (date) {
    //   startCreateAt = date[0]
    //   endCreateAt = date[1]
    // }
    // let params = {
    //   pageNum: that.page.pageNum,
    //   pageSize: that.page.pageSize,
    //   name: that.searchForm.name,
    //   tagIds: tagIds,
    //   groupIds: groupIds,
    //   gender: that.searchForm.gender,
    //   startCreateAt: startCreateAt,
    //   endCreateAt: endCreateAt
    // }
    // that.$http.getCustomerPage(params).then(res => {
    //   that.tableData = res.data.data.list
    //   that.page.total = res.data.data.total
    // })
    // that.$http.getCustomerPage(that.page).then(res => {
    //   that.tableData = res.data.data.list
    //   that.page.total = res.data.data.total
    // })
    // },
    changeCellStyle(row) {
      if (row.column.label === '关联人员') {
        return 'overflow:hidden; text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2;  ' // 修改的样式
      } else {
        return ''
      }
    },
    formatterColumn(row) {
      return (
        <div>
          <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
            下载
          </el-button>
          <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
            停用
          </el-button>
          <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
            编辑
          </el-button>
        </div>
      )
    },
    showEditDialog() {},
    //确认导入excel按钮
    openAddLiveCode() {
      this.importExcel.config.visible = true
    },
    //提醒接口
    remindFriend(rowId) {
      api.remindFriend({ id: rowId }).then(res => {
        if (res.data.code === 20000) {
          this.$message.success('提醒成功')
          this.getFriendsPage()
        } else {
          this.$message.error('提醒失败')
        }
      })
    },
    //详情接口
    // detailsFriend(row) {
    //   api.getFriendMessage({ userId: row }).then(res => {
    //     console.log(res)
    //   })
    // },
    //删除接口
    deleteFriend(row) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteAddFriend({ id: row }).then(() => {
          this.getFriendsPage()
          this.$message.success('删除成功')
        })
      })
    },
    readDetails(id) {
      console.log(id)
      this.$openNewPage({
        path: '/main/scrm/operation-management/addfriends/details',
        query: {
          id
        }
      })
    },
    //确认导入excel
    submitImportData() {
      let formData = new FormData()
      formData.append('file', this.formData.file)
      formData.append('userId', this.userIdList)
      if (this.formData.file == undefined) {
        this.$message.warning('请上传文件')
      } else if (this.userIdList.length == 0) {
        this.$message.warning('请选择人员')
      } else {
        if (this.isSumbit) {
          this.isSumbit = false
          let thisCopy = this
          setTimeout(function () {
            thisCopy.isSumbit = true
          }, 3000)
          api.addFriendImport(formData).then(res => {
            if (res.data.code === 20000) {
              this.$refs.model.resetFields()
              this.$message.success('Excel导入成功')
              this.getFriendsPage()
              this.importExcel.config.visible = false
              this.formData = []
              this.form = {
                monentsUsers: []
              }
              this.excelName = ''
            } else {
              this.$message.error('Excel导入失败')
            }
          })
        } else {
          this.$message.warning('正在上传,请耐心等待')
        }
      }
    },
    //文件上传成功
    fileUploadSuccess(file) {
      this.file.form.name = file.name
      this.file.form.fileName = file.name.split('.')[0]
      this.file.form.file = file.address
      console.log(this.file)
    },
    //打开关联人员
    openPeople() {
      this.departmentDialog.config.visible = true
      this.$nextTick(() => {
        this.$refs.department.setCheckedNodes()
      })
    },
    //点击确认选择的人员
    handleConfirm(list) {
      let userId = []
      this.form.monentsUsers = list
      this.departmentDialog.config.visible = false
      list.forEach(item => {
        userId.push(item.id)
      })
      this.userIdList = userId.join('_')
      // console.log(this.userIdList)
      console.log(this.form.monentsUsers)
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
    //打开行为标签的添加按钮
    openBehaviorTag() {
      this.selectEnterDialog.config.visible = true
    },
    //关闭行为标签确认按钮
    closeTagDialog() {
      this.selectEnterDialog.config.visible = false
    },
    //行为标签确认按钮
    sumbitTagDialog() {
      this.selectEnterDialog.config.visible = false
    },
    //请先前往创建
    openRouter() {},
    //取消已选
    closeTagList(tag, index) {
      let that = this
      that.spanName.splice(index, 1)
      that.spanIndex.splice(index, 1)
    },
    //点击标签变色
    changeTag(tagId, id, name) {
      let arrIndex = this.spanIndex.indexOf(id)
      let newName = this.spanName.indexOf(name)
      if (arrIndex > -1) {
        this.spanIndex.splice(arrIndex, 1)
        this.spanName.splice(newName, 1)
      } else {
        this.spanIndex.push(id)
        this.spanName.push(name)
      }
      // console.log(this.spanIndex)
    },
    getEnterList() {
      // this.$http.getEnterTagList().then(res => {
      //   let list = res.data.data
      //   this.tagNameList = res.data.data
      //   list.forEach(item => {
      //     this.tagList.push(item.tagList)
      //   })
      // })
    },

    onChange(file) {
      if (file.raw !== '') {
        this.$message.success('上传成功')
        this.formData.file = file.raw
        this.excelName = this.formData.file.name
      } else {
        this.$message.error('上传失败')
      }
    },
    downloadExcel() {
      this.$nextTick(() => {
        this.$message.success('正在下载，请稍加等候')
        FileSaver.saveAs(
          this.imgHost + '/attachments/scrm/87ca1bb12d25416992d097d9df6a1dd8.xls',
          'Excel批量导入客户模板.xls'
        )
        // window.open(this.imgHost + '/attachments/scrm/87ca1bb12d25416992d097d9df6a1dd8.xls')
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.action = `${BASEURL}/api/admin/v1/friend/importExcel`
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  },
  created() {
    // keep-alive专属生命周期
    // 开启keep-alive时每次进入页面都会触发，而created只会在第一次进入时触发
    this.getEnterList()
    this.getFriendsPage()
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
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.common-table-box {
  padding: 0 20px;
  box-sizing: border-box;
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
.tagNames {
  display: inline-block;
  border: 1px solid rgb(223, 220, 220);
  padding: 2px 5px;
  cursor: pointer;
  margin: 8px 8px 7px 0;
  margin-right: 8px;
  margin-bottom: 7px;
}
.icon-user {
  color: #294a7b;
}
.special-column {
  max-height: 200px;
  width: 200px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.common-table-image {
  width: 50px;
  height: 50px;
}
.tagname-form {
  min-height: 60px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.operating-btn {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 20px;
  margin-bottom: 5px;
}
.tagname-form {
  min-height: 65px;
}
.tagName {
  display: inline-block;
  color: #333333;
  background-color: #f2f2f2;
  padding: 5px 20px;
  border-radius: 20px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 13px;
  cursor: pointer;
}
::v-deep .special-column {
  width: 200px;
}
// .tag-content {
//   width: 100%;
//   height: 520px;
//   padding: 0 20px;
//   box-sizing: border-box;
// }
.submit_btn_box {
  display: flex;
  justify-content: flex-end;
}
.import-excel {
  .import-title {
    padding: 20px 0;
    font-size: 14px;
    color: gray;
  }
}
.import-form-person {
  margin-left: 80px;
  width: 80%;

  font-size: 14px;
  color: gray;
}
.dialogSelect {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  .selectGroup {
    // border: 1px solid red;
    .leftTitle {
      display: inline;
      span {
        display: inline-block;
        margin-top: 5px;
        // border: 1px solid red;
      }
    }
    .rightTags {
      display: inline;

      .el-tag {
        margin-left: 10px;
        margin-top: 5px;
      }
    }
  }
}
.Btn-two {
  margin: 20px 0;

  .el-button {
    width: 100px;

    font-size: 14px;
  }
}
.none-tag-title {
  width: 40%;
  margin: 0 auto;
}
.active {
  color: #294a7b;
  border-bottom: 2px solid #294a7b;
}
.upload-wrap {
  width: 100px;
  height: 100px;
  position: relative;
  border: 1px dashed #ccc;
  overflow: hidden;
}
.tip-text {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  text-align: center;
  .icon {
    position: absolute;
    font-size: 40px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #b5b5b5;
  }
}

.tag-item {
  max-height: 130px;
  display: flex;
  flex-wrap: wrap;
  .item-icon {
    color: #294a7b;
  }
  span {
    display: block;
    border: 1px solid rgb(211, 209, 209);
    padding: 5px;
    cursor: pointer;
    margin: 8px 8px 7px 0;
    height: 16px;
    line-height: 16px;
  }
}
.tip-p {
  height: 40px;
  line-height: 40px;
  width: 300px;
  top: 20%;
  left: 200px;
  position: absolute;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  border: 1px solid rgb(211, 209, 209);
  padding: 2px 5px;
  cursor: pointer;
  margin: 8px 8px 7px 0;
}
.folder-opened {
  font-size: 16px !important;
  color: #294a7b;
  font-weight: bold !important;
}
.form_content {
  display: flex;
  height: 33px;
  .right {
    margin-left: auto;
    &::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
