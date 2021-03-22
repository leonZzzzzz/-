<template>
  <div class="grouplive-form">
    <QcNavigationPage content="标签建群" full>
      <div class="groupname-form">
        <el-form label-position="right" label-width="auto">
          <div class="groupname-title">
            注意：每位客户每月最多收到来自企业群发管理员的4条群发消息，如果选择推送的客户本月已收到过群发消息满4条，将不会收到推送。
          </div>
          <el-form-item label="任务名称" :required="true">
            <el-input
              maxlength="32"
              show-word-limit
              placeholder="最多可输入32字"
              class="input-width"
              v-model="model.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="发送邀请成员" :required="true">
            <el-button type="text">添加</el-button>
          </el-form-item>
          <el-form-item label="选择邀请客户">
            <el-radio-group>
              <el-radio label="bufen">部分用户</el-radio>
              <el-radio label="quanbu">全部用户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="入群欢迎语">
            <el-input
              id="textInput"
              class="record_input"
              type="textarea"
              width="600px"
              maxlength="100"
              show-word-limit
              size="small"
              placeholder="最多可输入100字"
              height="400px"
              :rows="6"
              resize="none"
              v-model="model.message"
            >
            </el-input>
            <div class="welcome-buttom">
              <div class="welcome-emjoi">
                <emotion @selectedEmotion="_selectedEmotion"></emotion>
              </div>
              <div class="welcome-div">
                <span class="welcome-firstname">插入昵称</span>
                <span class="welcome-customername" @click="insert('<客户昵称>')">客户昵称</span>
                <span class="welcome-salename" @click="insert('<成员昵称>')">成员昵称</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="附加内容" :required="true">
            <el-radio-group v-model="model.materialList[0].type">
              <el-radio label="text" @change="changeNone">无</el-radio>
              <el-radio label="image" @change="changeImage">图片</el-radio>
              <el-radio label="image_text" @change="changeWeb">网页</el-radio>
              <el-radio label="program" @change="changeApp">小程序</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="image-div" v-if="model.materialList[0].type === 'image'">
            <QcImageUpload width="100px" height="100px" class="image-upload" v-model="imageUrl"> </QcImageUpload>
            <span>上传图片</span>
          </div>
          <div class="web-div" v-if="model.materialList[0].type === 'image_text'">
            <el-form-item :required="true" label="链接标题"
              ><el-input
                placeholder="最多可输入32个字"
                v-model="model.materialList[0].name"
                class="input-width"
              ></el-input
            ></el-form-item>
            <el-form-item :required="true" label="链接简介"
              ><el-input
                placeholder="最多可输入32个字"
                v-model="model.materialList[0].content"
                class="input-width"
              ></el-input
            ></el-form-item>
            <el-form-item :required="true" label="链接地址"
              ><el-input
                placeholder="请输入链接地址"
                v-model="model.materialList[0].link"
                class="input-width"
              ></el-input
            ></el-form-item>
            <el-form-item :required="true" label="封面图">
              <QcImageUpload width="100px" height="100px" v-model="linkImageUrl"> </QcImageUpload>
              <span>上传图片</span>
            </el-form-item>
          </div>
          <div class="app-div" v-if="model.materialList[0].type === 'program'">
            <el-form-item label="配置小程序" :required="true">
              <el-select placeholder="请选择" v-model="model.materialList[0].programId" @change="changeSelect()">
                <el-option
                  class="app-select"
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="group-add-title">
            <p>提示：</p>
            <p>
              1、群人数上限为200人，超过200人时请添加多个客户群进行拉人，否则会导致部分客户无法进群，添加多个客户群时，客户只会收到一条入群邀请；
            </p>
            <p>2、如果客户添加了多个企业成员，只会收到一位成员的入群邀请。</p>
          </div>
          <el-form-item label="选择客户群" :required="true">
            <el-button type="text" @click="addGroupBtn">添加</el-button>
          </el-form-item>
          <div v-if="GroupData.length != 0" class="groupdata-div">
            <el-form-item>
              <el-table
                :data="GroupData"
                style="width:100%"
                height="201"
                :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
              >
                <el-table-column v-for="(item, index) in GroupColumn" :key="index" v-bind="item"> </el-table-column>
              </el-table>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="sumbitLabelGroup">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </QcNavigationPage>

    <com-dialog :config="changeGroupDialog.config" @closeDialog="closeGroupDialog">
      <div class="add-content">
        <div class="query-table">
          <div class="query-table-left">
            <div class="search-input">
              <el-input size="small" placeholder="输入群名称" v-model="selectionGroupSearchContent">
                <el-button slot="append" icon="el-icon-search" @click="selectionGroupSearch"></el-button>
              </el-input>
            </div>
            <el-button size="small" type="info" @click="refreshGroupSelectionList"
              >&nbsp;&nbsp;重置&nbsp;&nbsp;</el-button
            >
          </div>
        </div>
        <div class="selection-table">
          <el-table
            ref="mulGrouptipleTable"
            :data="selectionGroupData"
            style="width: 100%"
            height="400"
            :row-key="getGroupRowKey"
            @selection-change="handleGroupSelectionChange"
          >
            <el-table-column
              v-for="(item, index) in selectionGroupColumn"
              :key="index"
              v-bind="item"
              :reserve-selection="true"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="selection-pagination">
          <com-pagination
            :page="selectionGroupPage"
            @sizeChange="onGroupSelectionSizeChange"
            @pageChange="onGroupSelectionPageChange"
          ></com-pagination>
        </div>
        <el-row :gutter="24">
          <el-col :span="8">&nbsp;</el-col>
          <el-col :span="4"><div class="close-btn" @click="closeGroupDialog">取消</div></el-col>
          <el-col :span="4"><div class=" submit-btn-add" @click="sumbitGroupSelectionData">确定</div></el-col>
          <el-col :span="8">&nbsp;</el-col>
        </el-row>
      </div>
    </com-dialog>
  </div>
</template>
<script>
import ComDialog from '../../../components/common/ComDialog'
import ComPagination from '../../../components/common/ComPagination'
import Emotion from '../../../components/common/Emotion'
// import api from '../../../api/operation-management'
export default {
  components: { ComDialog, ComPagination, Emotion },
  data() {
    return {
      model: {
        message: '',
        sender: '',
        name: '',
        materialList: [
          {
            id: '',
            appId: '',
            isDeleted: true,
            createTime: '',
            type: 'text',
            name: '',
            content: '',
            imageUrl: '',
            videoUrl: '',
            link: '',
            programId: '',
            file: '',
            createBy: ''
          }
        ],
        messageUserList: []
      },
      addTagDialog: {
        config: {
          width: '600px',
          title: '关联行为标签',
          visible: false
        }
      },
      /*群发 */
      selectionGroupSearchContent: '',
      changeGroupDialog: {
        config: {
          width: '900px',
          title: '选择群发群',
          visible: false
        }
      },
      selectionGroupData: [],
      getGroupRowKey(row) {
        return row.id
      },
      selectionGroupColumn: [
        {
          type: 'selection',
          align: 'center',
          width: '55px'
        },
        { type: 'index', label: '序号', align: 'center' },
        { prop: 'name', label: '群名称', align: 'center' },
        {
          label: '微信群ID',
          align: 'center',
          prop: 'cropAppId'
        },
        { prop: 'ownerName', label: '创建人', labelWidth: '200', align: 'center' },
        { prop: 'createTime', label: '创建时间', labelWidth: '200', align: 'center' }
      ],
      GroupData: [],
      GroupColumn: [
        { type: 'index', label: '序号', align: 'center' },
        { prop: 'name', label: '群名称', align: 'center' },
        {
          label: '微信群ID',
          align: 'center',
          prop: 'cropAppId'
        },
        { prop: 'ownerName', label: '创建人', labelWidth: '200', align: 'center' },
        { prop: 'createAtToTime', label: '创建时间', labelWidth: '200', align: 'center' },
        {
          label: '操作',
          align: 'center',
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                <el-button type="text" onClick={this.deleteGroupList.bind(this, row, index)}>
                  取消添加
                </el-button>
              </div>
            )
          }
        }
      ],
      selectionGroupPage: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      imageUrl: '',
      linkImageUrl: '',
      options: [], //小程序选项
      deteleGroupList: [],
      messageUserList: []
    }
  },
  methods: {
    //删除群发客户列表的数据
    deleteGroupList(row, index) {
      this.GroupData.splice(index, 1)
      this.model.messageUserList.splice(index, 1)
      this.messageUserList.splice(index, 1)
      this.deteleGroupList.push(row.id)
      this.getGroupSelectionCustomerList()
    },
    handleGroupSelectionChange(val) {
      this.messageUserList = []
      this.GroupData = val
      val.forEach((item) => {
        this.messageUserList.push({ userId: item.id })
        this.model.sender = item.owner
      })
      this.model.messageUserList = this.messageUserList
    },
    getGroupSelectionCustomerList() {
      let that = this
      let params = {
        pageNum: that.selectionGroupPage.pageNum,
        pageSize: that.selectionGroupPage.pageSize,
        name: that.selectionGroupSearchContent
      }
      this.$http.groupList(params).then((res) => {
        that.selectionGroupData = res.data.data.list
        that.selectionGroupPage.total = res.data.data.total
        this.$nextTick(() => {
          this.selectionGroupData.forEach((item) => {
            let flag = this.deteleGroupList.some((label) => item.id === label)
            if (flag) {
              this.$refs.mulGrouptipleTable.toggleRowSelection(item, false)
              let i = this.deteleGroupList.findIndex((label) => label === item.id)
              this.deteleGroupList.splice(i, 1)
            }
          })
        })
      })
    },
    async insert(myValue) {
      let myField = document.getElementById('textInput')
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.model.message =
          myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)
        await this.$nextTick()
        myField.focus()
        myField.setSelectionRange(endPos + myValue.length, endPos + myValue.length)
      } else {
        this.model.message += myValue
      }
    },
    _selectedEmotion(val) {
      let message = document.getElementById('textInput')
      let insert = message.selectionStart
      this.model.message = message.value.substr(0, insert) + val + message.value.substr(insert)
    },
    changeSelect(val) {
      this.options.forEach((item) => {
        if (item.id === val) {
          this.model.materialList[0].programId = item.id
        }
      })
    },
    getProgarm() {
      this.$http.getProgarm().then((res) => {
        this.options = res.data.data
      })
    },
    //改变无
    changeNone(val) {
      this.model.materialList[0].type = val
    },
    //改变图片
    changeImage(val) {
      this.model.materialList[0].type = val
    },
    //改变网址
    changeWeb(val) {
      this.model.materialList[0].type = val
    },
    //改变小程序
    changeApp(val) {
      this.model.materialList[0].type = val
    },
    sumbitLabelGroup() {
      if (this.model.name == '') {
        this.$message.warning('请输入任务名称')
      } else if (this.model.message.length > 100) {
        this.$message.warning('入群欢迎语不能超过100个字')
      } else if (this.GroupData.length == 0) {
        this.$message.warning('请选择客户群')
      } else if (this.model.materialList[0].type == 'text') {
        this.model.materialList[0].programId = ''
        this.model.materialList[0].link = ''
        this.model.materialList[0].content = ''
        this.model.materialList[0].name = ''
        this.model.materialList[0].videoUrl = ''
        this.model.materialList[0].file = ''
        this.model.materialList[0].imageUrl = ''
        this.model.materialList[0].fileId = ''
        this.imageUrl = ''
        this.linkImageUrl = ''
        console.log(this.model)
        //添加方法
      } else if (this.model.materialList[0].type == 'image') {
        if (this.imageUrl == '') {
          this.$message.warning('请上传图片')
        } else {
          this.model.materialList[0].imageUrl = this.imageUrl
          this.model.materialList[0].programId = ''
          this.model.materialList[0].link = ''
          this.model.materialList[0].content = ''
          this.model.materialList[0].name = ''
          this.model.materialList[0].videoUrl = ''
          this.model.materialList[0].file = ''
          this.model.materialList[0].fileId = ''
          this.linkImageUrl = ''
          //添加方法
          console.log(this.model)
        }
      } else if (this.model.materialList[0].type == 'image_text') {
        if (this.model.materialList[0].name == '') {
          this.$message.warning('请输入标题链接')
        } else if (this.model.materialList[0].content == '') {
          this.$message.warning('请输入链接简介')
        } else if (this.model.materialList[0].link == '') {
          this.$message.warning('请输入链接地址')
        } else if (this.linkImageUrl == '') {
          this.$message.warning('请上传图片')
        } else {
          this.model.materialList[0].imageUrl = this.linkImageUrl
          this.model.materialList[0].programId = ''
          this.model.materialList[0].link = ''
          this.model.materialList[0].content = ''
          this.model.materialList[0].name = ''
          this.model.materialList[0].videoUrl = ''
          this.model.materialList[0].file = ''
          this.model.materialList[0].fileId = ''
          this.imageUrl = ''
          console.log(this.model)
          //添加方法
        }
      } else if (this.model.materialList[0].type == 'program') {
        if (this.model.materialList[0].programId == '') {
          this.$message.warning('请选择小程序')
        } else {
          this.model.materialList[0].link = ''
          this.model.materialList[0].content = ''
          this.model.materialList[0].name = ''
          this.model.materialList[0].videoUrl = ''
          this.model.materialList[0].file = ''
          this.model.materialList[0].imageUrl = ''
          this.model.materialList[0].fileId = ''
          this.imageUrl = ''
          this.linkImageUrl = ''
          console.log(this.model)
          //添加方法
        }
      }
    },
    //点击编辑打开弹窗
    /*这是群发的开始*/
    closeGroupDialog() {
      this.changeGroupDialog.config.visible = false
      this.selectionGroupPage.pageSize = 15
      this.selectionGroupPage.pageNum = 1
      this.selectionGroupPage.total = 0
      this.selectionGroupSearchContent = ''
    },
    selectionGroupSearch() {
      this.selectionGroupPage.pageNum = 1
      this.selectionGroupPage.pageSize = 15
      this.selectionGroupPage.total = 0
      this.getGroupSelectionCustomerList()
    },
    refreshGroupSelectionList() {
      this.selectionGroupPage.pageNum = 1
      this.selectionGroupPage.pageSize = 15
      this.selectionGroupPage.total = 0
      this.selectionGroupSearchContent = ''
      this.getGroupSelectionCustomerList()
    },

    onGroupSelectionPageChange(val) {
      this.selectionGroupPage.pageNum = val
      this.getGroupSelectionCustomerList()
    },
    onGroupSelectionSizeChange(val) {
      this.selectionGroupPage.pageSize = val
      this.selectionGroupPage.pageNum = 1
      this.getGroupSelectionCustomerList()
    },
    sumbitGroupSelectionData() {
      this.changeGroupDialog.config.visible = false
      console.log(this.model)
    },

    addGroupBtn() {
      this.changeGroupDialog.config.visible = true
    }
  },
  created() {
    this.getProgarm()
    this.getGroupSelectionCustomerList()
  }
}
</script>

<style lang="scss" scoped>
.grouplive-form {
  width: 100%;
  height: 100%;
  position: relative;
  .groupname-form {
    width: 100%;
    .record_input {
      width: 500px;
    }
    .welcome-buttom {
      width: 500px;
      height: 40px;
      // border: 1px solid red;
      display: flex;
      justify-content: space-between;

      .welcome-div {
        margin-top: 10px;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        .welcome-customername {
          padding: 5px;
          border: 1px solid #294a7b;
          color: #294a7b;
          margin-left: 5px;
          cursor: pointer;
          border-radius: 5px;
        }
        .welcome-salename {
          padding: 5px;
          border: 1px solid #294a7b;
          color: #294a7b;
          margin-left: 5px;
          cursor: pointer;
          border-radius: 5px;
        }
      }
    }
  }
}
.image-div {
  .image-upload {
    margin-left: 100px;
  }
  span {
    margin-left: 120px;
    font-size: 14px;
    color: darkgrey;
  }
}
.web-div {
  span {
    margin-left: 20px;
    font-size: 14px;
    color: darkgrey;
  }
}
// .app-div {
//   .app-select {
//     width: 500px;
//   }
// }

.el-select-dropdown {
  width: 100%;
}

.add-title {
  color: darkgrey;
  font-size: 14px;
}
.Btn-two {
  margin: 20px 0;

  .el-button {
    width: 100px;
    font-size: 14px;
  }
}
.none-tag {
  text-align: center;
}
.info-itemtag {
  // border: 1px solid red;
  display: inline-block;
  color: #333333;
  background-color: #f2f2f2;
  padding: 0 20px;
  border-radius: 20px;
  margin-right: 10px;
  // margin-bottom: 10px;
  font-size: 13px;
  cursor: pointer;
}
.edit-tag {
  display: inline;
  color: #294a7b;
  padding: 5px 20px;
  border: 1px solid #cccccc;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 13px;
  cursor: pointer;
}
.add-content {
  width: 100%;
  height: 556px;
  padding: 0 20px;
  box-sizing: border-box;
}
.query-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  &-left {
    display: flex;
    .search-input {
      margin-right: 20px;
    }
  }
  &-right {
    display: flex;
    align-items: center;
    .customer-total {
      margin-right: 30px;
      span {
        color: #ffa500;
      }
    }
  }
}
.submit-btn {
  width: 100px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
  // margin: 60px auto;
  border-radius: 3px;
  cursor: pointer;
}

.submit-btn-add {
  border-radius: 3px;
  width: 100px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
}
.close-btn {
  border-radius: 3px;
  width: 100px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #5c6064;
  cursor: pointer;
}
.groupname-title {
  color: darkgrey;
  font-size: 14px;
  padding-bottom: 20px;
}
.welcome-emjoi {
  padding-top: 10px;
}
.input-width {
  width: 500px;
}
.group-add-title {
  margin-left: 10px;
  color: darkgrey;
  font-size: 14px;
  p {
    height: 20px;
    line-height: 20px;
  }
}
.groupdata-div {
  width: 60%;
}
// ::v-deep thead {
//   .el-table-column--selection {
//     .cell {
//       display: none;
//     }
//   }
// }
</style>
