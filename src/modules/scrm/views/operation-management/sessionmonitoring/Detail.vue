<template>
  <div class="sensitive-thesaurus">
    <div class="violation-none" v-if="isOpen == false">
      <div class="none-image">
        <img src="../../../images/none_dispose.png" alt="" />
        <el-button type="primary" @click="changeOpenDispose">点击开通</el-button>
      </div>
    </div>
    <!-- <div class="top_nav">
      <ul>
        <li
          v-for="(item, index) in navList"
          :key="index"
          :class="{
            active: item.isActive,
            borderRight: index == 0 && navList[1].isActive,
            borderLeft: index == navList.length - 1 && navList[navList.length - 2].isActive
          }"
          @click="changeNavBarFun(index)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div> -->
    <div class="middle_content" v-else>
      <div class="container" v-show="navBarFlag == 0">
        <div class="top_search">
          <div class="operating-btn">
            <el-button size="small" type="primary" @click="openAddGroup">新建敏感词</el-button>
          </div>
          <div class="search">
            <!-- <el-form inline :model="searchForm" label-width="100px" label-position="right" size="small">
              <el-form-item label="敏感词组名称">
                <el-input placeholder="请输入敏感词组名称" v-model="searchForm.name"></el-input>
              </el-form-item>
            </el-form> -->
          </div>
        </div>
        <div class="common-table-box">
          <el-table
            :data="tableData"
            width="100%"
            id="table"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
            :height="height"
            @cell-mouse-enter="isOverflow"
          >
            <!-- <el-table-column type="index" align="center" label="序号"> </el-table-column> -->
            <!-- <el-table-column label="敏感词名称" prop="word" align="center"></el-table-column> -->
            <el-table-column label="敏感词" prop="word" align="center"></el-table-column>
            <!-- <el-table-column label="类型" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.type == 'crop-conversation' ? '企微会话存档' : '其他' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sortNumber" align="center" label="排序号"></el-table-column> -->
            <el-table-column label="创建时间" prop="createTime" align="center">
              <template slot-scope="scope">
                {{ scope.row.createTime | allTableTimefilters }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <!-- <el-button type="text" @click="openConfigure(scope.row.id)">设置触发提醒接收人</el-button> -->
                  <el-button type="text" @click="editWord(scope.row)">编辑</el-button>
                  <el-button type="text" @click="closeTagList(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="common-pagination">
          <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>
      </div>
      <div class="container" v-show="navBarFlag == 1">测试</div>
    </div>

    <!-- <div class="sensitive-theasurus-form">
      <el-input placeholder="请输入敏感词" v-model="word"></el-input>
      <el-button type="primary" @click="addSensitive">添加</el-button>
    </div>
    <div class="sensitice-theasurus-span">
      <el-tag
        closable
        type="info"
        :disable-transitions="true"
        v-for="(item, index) in sensitiveList"
        :key="index"
        @close="closeTagList(item)"
        >{{ item.word }}
      </el-tag>
    </div> -->
    <com-dialog
      :config="addEnterpriseTagDialog.config"
      @closeDialog="addEnterpriseTagDialog.config.visible = false"
      class="dialogSelect"
    >
      <el-form
        label-position="right"
        label-width="auto"
        ref="addExtendModel"
        :model="enterpriseModel"
        class="el-form-filter"
      >
        <el-form-item label="敏感词名称">
          <el-input
            placeholder="请输入敏感词名称"
            maxlength="8"
            show-word-limit
            v-model="enterpriseModel.word"
          ></el-input>
        </el-form-item>
        <div class="addtag-item">
          <!-- <div class="addtag-title">敏感词</div>
          <div class="addtag-input">
            <div class="addtag-input-content" v-for="(item, index) in enterpriseModel.tagList" :key="index">
              <div class="inp">
                <el-input placeholder="请输入敏感词" maxlength="15" show-word-limit v-model="item.name"></el-input>
              </div>
              <div class="btn">
                <el-button circle icon="el-icon-minus" @click="deteleEnterpriseRow(index)" size="mini"></el-button>
              </div>
            </div>
          </div> -->
          <!-- <div class="addtag-title">敏感词</div>
          <div class="addtag-input">
            <el-row :gutter="24" v-for="(item, index) in enterpriseModel.tagList" :key="index">
              <el-col :span="22">
                <el-input placeholder="请输入敏感词" maxlength="15" show-word-limit v-model="item.name"></el-input>
              </el-col>
              <el-col :span="2"> <i class="el-icon-minus iconMinu" @click="deteleEnterpriseRow(index)"></i></el-col>
            </el-row>
          </div> -->
          <!-- <div>
            <el-button @click="addEnterpriseKeyWord" plain icon="el-icon-plus" size="small">添加标签</el-button>
          </div> -->
          <!-- <div class="addtag-addBtn"><el-button type="text" @click="addEnterpriseKeyWord"> 添加敏感词</el-button></div> -->
        </div>
      </el-form>
      <div></div>
      <div class="Btn-two" style="display: flex; justify-content: flex-end">
        <el-button @click="closeEnterpriseAddDialog()">取消</el-button>
        <el-button type="primary" @click="sumbitEnterpriseAddDialog()">确定</el-button>
      </div>
    </com-dialog>
    <com-dialog
      :config="editEnterpriseDialog.config"
      @closeDialog="editEnterpriseDialog.config.visible = false"
      class="dialogSelect"
    >
      <el-form
        label-position="right"
        label-width="auto"
        ref="eidtExtendModel"
        :model="enterpriseEditModel"
        class="el-form-filter"
      >
        <el-form-item label="敏感词名称:">
          <!-- <span class="addtag-item-span">{{ enterpriseEditModel.groupName }}</span> -->
          <el-input placeholder="请输入敏感词名称" v-model="enterpriseEditModel.word" maxlength="8" show-word-limit>
          </el-input>
        </el-form-item>
        <div class="addtag-item">
          <!-- <div class="addtag-title">敏感词</div>
          <div class="addtag-input">
            <div class="addtag-input-content" v-for="(item, index) in enterpriseEditModel.tagList" :key="index">
              <div class="inp">
                <el-input
                  placeholder="请输入敏感词"
                  maxlength="15"
                  show-word-limit
                  v-model="enterpriseEditModel.tagList[index].name"
                ></el-input>
              </div>
              <div class="btn">
                <el-button
                  circle
                  icon="el-icon-minus"
                  @click="deteleEnterpriseEditRow(item.tagId, item.id)"
                  size="mini"
                ></el-button>
              </div>
            </div>
          </div> -->
          <!-- <div>
            <el-button @click="addEnterpriseEditKeyWord" plain icon="el-icon-plus" size="small">添加敏感词</el-button>
          </div> -->
        </div>
        <!-- <div class="addtag-item">
          <div class="addtag-title">敏感词</div>
          <div class="addtag-input">
            <el-row :gutter="24" v-for="(item, index) in enterpriseEditModel.tagList" :key="index">
              <el-col :span="22">
                <el-input
                  placeholder="请输入敏感词"
                  maxlength="15"
                  show-word-limit
                  v-model="enterpriseEditModel.tagList[index].name"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <i class="el-icon-minus iconMinu" @click="deteleEnterpriseEditRow(item.tagId, item.id)"></i
              ></el-col>
            </el-row>
          </div>
        </div> -->
      </el-form>

      <div class="footer_btns" style="display: flex; justify-content: flex-end">
        <el-button @click="closeEnterpriseEditDialog()">取消</el-button>
        <el-button type="primary" @click="sumbitEnterpriseEditDialog()">确定</el-button>
      </div>
      <!-- <div class="Btn-two">
        <el-row :gutter="24">
          <el-col :span="10"
            ><el-button type="text" style="color: red" @click="deteleEnterpriseTagGroup()"
              >删除敏感词组</el-button
            ></el-col
          >
          <el-col :span="6">&nbsp; </el-col>
          <el-col :span="4">
            <el-button type="info" @click="closeEnterpriseEditDialog()">取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="sumbitEnterpriseEditDialog()">确定</el-button>
          </el-col>
        </el-row>
      </div> -->
    </com-dialog>
    <com-dialog
      :config="configureDialog.config"
      @closeDialog="configureDialog.config.visible = false"
      class="dialogSelect"
    >
      <div class="Btn-two">
        <el-row :gutter="24">
          <el-col :span="10">&nbsp;</el-col>
          <el-col :span="6">&nbsp; </el-col>
          <el-col :span="4">
            <el-button type="info" @click="closeConfingureDialog()">取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="sumbitConfingureDialog()">确定</el-button>
          </el-col>
        </el-row>
      </div>
    </com-dialog>
  </div>
</template>
<script>
import api from '../../../api/operation-management'
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
export default {
  components: { ComPagination, ComDialog },
  data() {
    return {
      sensitiveList: [],
      word: '',
      tableData: [],
      height: 400,
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      searchForm: {
        name: ''
      },
      addEnterpriseTagDialog: {
        config: {
          width: '600px',
          title: '新增敏感词',
          visible: false
        }
      },
      editEnterpriseDialog: {
        config: {
          width: '600px',
          title: '编辑敏感词',
          visible: false
        }
      },
      configureDialog: {
        config: {
          width: '600px',
          title: '设置触发提醒接收人',
          visible: false
        }
      },
      enterpriseModel: {
        word: '',
        type: 'crop-conversation',
        sortNumber: '0',
        groupId: 'default'
      },
      enterpriseEditModel: {
        word: '',
        type: '',
        sortNumber: '',
        groupId: '',
        id: ''
        // groupId: '',
        // groupName: '',
        // order: 0,
        // tagList: []
      },
      navList: [
        {
          name: '敏感词设置',
          isActive: true
        },
        {
          name: '触发记录',
          isActive: false
        }
      ],
      navBarFlag: 0,
      isOpen: true
    }
  },
  methods: {
    getSensitive() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        type: 'crop-conversation'
      }
      api.getSensitiveWord(params).then((res) => {
        // console.log(res)
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
        console.log(this.tableData)
      })
    },
    addSensitive() {
      if (this.word == '') {
        this.$message.warning('敏感词不能为空')
      } else {
        api.addSensitive({ word: this.word }).then(() => {
          this.word = ''
          this.getSensitive()
          this.$message.success('添加成功')
        })
      }
    },
    //点击删除敏感词库按钮
    closeTagList(row) {
      console.log(row)
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.deleteSensitiveWord({ id: row.id }).then(() => {
            this.getSensitive()
            this.$message.success('删除成功')
          })
        })
        .catch(() => {
          return
        })
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
      this.getSensitive()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getSensitive()
    },
    isOverflow(row, column, cell, event) {
      // console.log(row);
      if (column.label == '成员') {
        console.log(cell)
      }
    },
    editWord(row) {
      this.editEnterpriseDialog.config.visible = true
      // this.$http.getSensitiveWordGet({ id: row.id }).then(res => {
      this.enterpriseEditModel.word = row.word
      this.enterpriseEditModel.groupId = row.groupId
      this.enterpriseEditModel.type = row.type
      this.enterpriseEditModel.id = row.id
      this.enterpriseEditModel.sortNumber = row.sortNumber
      // })
    },
    //删除
    deteleEnterpriseRow(index) {
      if (this.enterpriseModel.tagList.length === 1) {
        this.$message.warning('至少含有一个敏感词')
        return
      }
      this.enterpriseModel.tagList.splice(index, 1)
      console.log(this.enterpriseModel.tagList)
    },
    //添加标签名
    addEnterpriseKeyWord() {
      if (this.flag) {
        this.$message.warning('请输入敏感词')
      }
      if (this.enterpriseModel.tagList.some((item) => !item.name)) {
        this.$message.warning('请输入敏感词')
        return
      }
      this.enterpriseModel.tagList.push({ name: '' })
      return
    },
    closeEnterpriseAddDialog() {
      this.enterpriseModel.groupName = ''
      this.enterpriseModel.tagList = [{}]
      this.addEnterpriseTagDialog.config.visible = false
    },
    //提交标签组弹窗
    sumbitEnterpriseAddDialog() {
      if (this.enterpriseModel.word == '') {
        this.$message.warning('敏感词名称不能为空')
        return
      }
      let params = {
        word: this.enterpriseModel.word,
        type: this.enterpriseModel.type,
        sortNumber: this.enterpriseModel.sortNumber,
        groupId: this.enterpriseModel.groupId
      }
      this.$http.addSensitiveWord(params).then(() => {
        this.$message.success('添加敏感词成功')
        this.enterpriseModel.word = ''
        this.addEnterpriseTagDialog.config.visible = false
        this.getSensitive()
      })
      // let arr = this.enterpriseModel.tagList
      // let flag = false
      // let flags = false
      // if (this.enterpriseModel.groupName == '') {
      //   this.$message.warning('请输入敏感词组名称')
      // } else if (this.enterpriseModel.tagList[0].name == '') {
      //   this.$message.warning('请输入敏感词')
      // } else {
      //   let newArr = []
      //   this.enterpriseModel.tagList.forEach(item => {
      //     newArr.push(item.name)
      //     flags = item.name == ''
      //   })
      //   var s = newArr.join(',') + ','
      //   for (var i = 0; i < newArr.length; i++) {
      //     flag = s.replace(newArr[i] + ',', '').indexOf(newArr[i] + ',') > -1
      //   }
      //   if (flags == true) {
      //     this.$message.warning('请输入敏感词')
      //   } else if (flag == true) {
      //     this.$message.warning('敏感词不能重复')
      //   } else {
      //     console.log(this.enterpriseModel)
      //     // this.$http.addEnterpriseGroup(this.enterpriseModel).then(() => {
      //     //   this.$message.success('添加成功')
      //     //   this.addEnterpriseTagDialog.config.visible = false
      //     //   this.enterpriseModel.groupName = ''
      //     //   this.enterpriseModel.tagList = [{}]
      //     //   this.getSensitive({})
      //     // })
      //   }
      // }
    },
    openAddGroup() {
      this.addEnterpriseTagDialog.config.visible = true
    },
    deteleEnterpriseEditRow(tagId) {
      let wxTagIdList = []
      if (this.enterpriseEditModel.tagList.length === 1) {
        this.$message.warning('至少含有一个敏感词')
        return
      }

      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        wxTagIdList.push(tagId)
        // this.$http.deteleEnterpriseGroup({ wxTagIdList: wxTagIdList }).then(() => {
        //   this.$message.success('删除标签名成功')

        //   this.getEnterpriseTagPage({})
        // })
        this.enterpriseEditModel.tagList.some((item, i) => {
          if (item.tagId == tagId) {
            console.log(item.tagId)
            this.enterpriseEditModel.tagList.splice(i, 1)
            return true
          }
        })
      })

      // console.log(this.model.tagList)
    },
    addEnterpriseEditKeyWord() {
      let keyword = ''
      if (this.flag) {
        this.$message.warning('请输入敏感词组名')
      }
      if (this.enterpriseEditModel.tagList.some((item) => !item.name)) {
        this.$message.warning('请输入敏感词')
        return
      }
      this.enterpriseEditModel.tagList.push({ name: keyword })
      return
    },
    deteleEnterpriseTagGroup() {
      let wxTagGroupIdList = []
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          wxTagGroupIdList.push(this.enterpriseEditModel.groupId)
          // this.$http.deteleEnterpriseGroup({ wxTagGroupIdList: wxTagGroupIdList }).then(() => {
          //   this.$message.success('删除敏感词组成功')
          //   this.editEnterpriseDialog.config.visible = false
          //   this.getSensitive({})
          // })
        })
        .catch(() => {})
    },
    //关闭编辑按钮
    closeEnterpriseEditDialog() {
      this.editEnterpriseDialog.config.visible = false
    },
    //确认编辑按钮
    sumbitEnterpriseEditDialog() {
      if (this.enterpriseEditModel.word == '') {
        this.$message.warning('请输入敏感词')
        return
      }
      this.$http.updateSensitiveWord(this.enterpriseEditModel).then(() => {
        this.$message.success('敏感词修改成功')
        this.getSensitive()
        this.editEnterpriseDialog.config.visible = false
      })
      // let flag = false
      // let flags = false
      // let newTagList = []
      // if (this.enterpriseEditModel.groupName == '') {
      //   this.$message.warning('请输入敏感词组名称')
      // } else if (this.enterpriseEditModel.tagList[0].name == '') {
      //   this.$message.warning('请输入敏感词')
      // } else {
      //   let newArr = []
      //   this.enterpriseEditModel.tagList.forEach(item => {
      //     newArr.push(item.name)
      //     flags = item.name == ''
      //   })
      //   var s = newArr.join(',') + ','
      //   for (var i = 0; i < newArr.length; i++) {
      //     flag = s.replace(newArr[i] + ',', '').indexOf(newArr[i] + ',') > -1
      //   }
      //   if (flags == true) {
      //     this.$message.warning('请输入敏感词组名称')
      //   } else if (flag == true) {
      //     this.$message.warning('敏感词不能重复')
      //   } else {
      //     this.enterpriseEditModel.tagList.forEach(item => {
      //       newTagList.push({ name: item.name, id: item.tagId, order: item.order })
      //     })
      //     this.enterpriseEditModel.tagList = newTagList
      //     console.log(this.enterpriseEditModel)
      //     // this.$http.updateEnterpriseGroup(this.enterpriseEditModel).then(() => {
      //     //   this.$message.success('编辑成功')
      //     //   this.getEnterpriseTagPage({})
      //     //   this.editEnterpriseDialog.config.visible = false
      //     // })
      //   }
      // }
    },
    openConfigure(id) {
      this.configureDialog.config.visible = true
    },
    closeConfingureDialog() {
      this.configureDialog.config.visible = false
    },
    sumbitConfingureDialog() {
      this.configureDialog.config.visible = false
    },
    changeNavBarFun(index) {
      if (this.navList[index].isActive) {
        return
      }
      for (var i = 0; i < this.navList.length; i++) {
        this.navList[i].isActive = false
      }
      this.navList[index].isActive = true
      this.navBarFlag = index
      if (index == 1) {
      }
    },
    //获取是否开通了
    getOpenStatus() {
      this.$http.getOpenStatus().then((res) => {
        this.isOpen = res.data.data
        if (this.isOpen == true) {
          this.getSensitive()
        }
        // console.log(this.isOpen)
      })
    },
    //未开通按钮
    changeOpenDispose() {
      this.$router.push('/main/scrm/operation-management/chatsessionconfig/list')
    }
  },
  created() {
    this.getOpenStatus()
    // console.log(this.isOpen)
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  }
}
</script>
<style lang="scss" scoped>
// .sensitive-thesaurus {
//   width: 100%;
//   height: 100%;
//   background-color: #fff;
//   .sensitive-theasurus-form {
//     padding: 50px 50px 50px 55px;
//     display: flex;
//     .el-input {
//       width: 20%;
//     }
//     .el-button {
//       width: 70px;
//       margin-left: 5px;
//     }
//   }
//   .sensitice-theasurus-span {
//     margin: 0 auto;
//     width: 93%;
//     height: 300px;
//     border: 1px solid rgb(235, 233, 233);
//     .el-tag {
//       font-size: 14px;
//       margin: 20px 10px;
//       overflow-y: auto;
//       color: rgb(47, 47, 47);
//     }
//   }
// }
.top_nav {
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
.sensitive-thesaurus {
  width: 100%;
  height: 100%;
  position: relative;
}
.middle_content {
  width: 100%;
  height: calc(100% - 40px);
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
.query-table-box {
  // padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.common-table-box {
  // padding: 0 20px;
  box-sizing: border-box;
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
// fo
.top_search {
  // padding: 20px 20px 0 20px;
  display: flex;
  .search {
    margin-left: auto;
  }
  .operating-btn {
    margin-bottom: 20px;
  }
}
.el-form-filter {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
.iconMinu {
  margin-top: 5px;
  font-size: 17px;
  color: #d36b5d;
  background-color: #cdcdcd;
  border-radius: 50%;
  cursor: pointer;
  padding: 2px;
}
.addtag-item {
  .addtag-title {
    padding: 5px 0;
  }
  .addtag-input {
    padding-top: 10px;
    .addtag-input-content {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .inp {
        flex: 1;
      }
      .score {
        padding-left: 10px;
        width: 110px;
      }
      .btn {
        width: 28px;
        padding-left: 10px;
      }
    }
  }
  .addtag-addBtn {
    margin-bottom: 20px;
    .el-button {
      color: #1e90ff;
    }
  }
}
.violation-none {
  position: relative;
  width: 100%;
  height: 100%;
  .none-image {
    text-align: center;
    img {
      width: 1400px;
      position: relative;
    }
    .el-button {
      position: absolute;
      bottom: 5%;
      left: 46%;
    }
  }
}
.none-dispose {
  // border: 1px solid red;
  margin: 0 auto;
  width: 70%;
  height: 100%;
  background-image: url(../../../images/none_dispose.png);
  background-repeat: no-repeat;
  div {
    padding-top: 600px;
    .el-button {
      display: block;
      margin-left: 43%;
    }
  }
}
</style>
