<template>
  <div class="label-div">
    <go-back title="返回"> </go-back>
    <div class="label-container">
      <div class="label-container-form">
        <el-form label-position="left" label-width="100">
          <div class="title">
            <p>选择客户</p>
          </div>
          <el-form-item label="选择客户:" :required="true">
            <div class="label-choose-div">
              <div class="tagname-form">
                <span class="tagName" v-for="(item, index) in selectNameList" :key="index"
                  ><i class="el-icon-user-solid icon-user"></i>{{ item.name || '未知' }}</span
                >
              </div>
              <el-button plain icon="el-icon-plus" size="mini" @click="openCustomer">添加</el-button>
            </div>
          </el-form-item>
          <div class="title">
            <p>选择标签</p>
          </div>
          <el-form-item label="企业标签"> </el-form-item>
          <el-form-item>
            <!-- <el-button icon="el-icon-plus" style="margin-bottom: 10px" size="mini" @click="openEnter">添加</el-button> -->

            <div class="remark_content">
              <div class="remark_content_btns">
                <el-button
                  icon="el-icon-plus"
                  @click=";(BehaviorLabelDialogVisible = true), (behaviorLabelType = true)"
                  plain
                  size="mini"
                  circle
                ></el-button>
              </div>
              <el-form class="none-form" v-if="tagNameList.length == 0">
                <el-form-item class="none-tag">
                  暂无创建的企业标签，<el-button type="text" @click="nextRouter">请先前往创建&nbsp;&gt;</el-button>
                </el-form-item>
              </el-form>
              <div :class="['remark_content_box', remarkContentBoxShowFlag ? 'show' : '']">
                <div ref="remark_content_box">
                  <div v-for="(item, index) in tagNameList" :key="index" class="remark_tag_box">
                    <div class="remark_tagGroupTitle">{{ item.name }}</div>
                    <div class="remark_tagChange">
                      <div class="remark_tagChange_content">
                        <div
                          @click="changeTags(items.tagId, items.id, items.name)"
                          v-for="(items, indexs) in item.tagList"
                          :key="indexs"
                          :class="['item', spanIndex.includes(items.id) ? 'active' : '']"
                        >
                          {{ items.name }}
                        </div>
                      </div>
                    </div>
                    <div class="remark_tag_box_btn">
                      <el-button icon="el-icon-edit" @click="updateBehav(index)" plain size="mini" circle></el-button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="showmore" v-if="remarkContentBoxHeight > 153">
                <el-button type="text" @click="remarkContentBoxShowFlag = !remarkContentBoxShowFlag"
                  >{{ remarkContentBoxShowFlag ? '收起' : '展开'
                  }}<i :class="[remarkContentBoxShowFlag ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i
                ></el-button>
              </div>
            </div>
          </el-form-item>
          <!-- <el-form-item label="个人标签"> </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-plus" style="margin-bottom: 10px" size="mini" @click="openPersonalTag"
              >添加</el-button
            >
            <div class="remark_content">
              <div class="remark_content_btns">
                <el-button icon="el-icon-plus" @click="openPersonalTag" plain size="mini" circle></el-button>
              </div>
              <el-form class="none-form" v-if="personalNameList.length == 0">
                <el-form-item class="none-tag">
                  暂无创建的个人标签，<el-button type="text">请先创建&nbsp;&gt;</el-button>
                </el-form-item>
              </el-form>
              <div :class="['remark_personl_box', personalContentBoxShow ? 'show' : '']">
                <div class="remark_content-personal" v-for="(item, index) in personalNameList" :key="index">
                  <div
                    @click="changePersonlTags(item.id, item.name)"
                    :class="['item', personalSpanIndex.includes(item.id) ? 'active' : '']"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
              <div class="showmore" v-if="remarkContentPersonalBoxHeight > 110">
                <el-button type="text" @click="personalContentBoxShow = !personalContentBoxShow"
                  >{{ personalContentBoxShow ? '收起' : '展开'
                  }}<i :class="[personalContentBoxShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i
                ></el-button>
              </div>
            </div>
          </el-form-item> -->
          <div class="btn-div">
            <el-button @click="cancelSumbit">取消</el-button>
            <el-button type="primary" @click="addSumbit">保存</el-button>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 选择客户列表弹窗 -->
    <com-dialog :config="addDialog.config" @closeDialog="closeAddDialog">
      <div class="add-content">
        <div class="query-table" style="display: flex; justify-content: flex-end">
          <div class="query-table-left">
            <div class="search-input">
              <el-input
                size="mini"
                placeholder="输入客户名称"
                v-model="selectionSearchContent"
                clearable
                @input="getSelectionCustomerList"
              >
              </el-input>
            </div>
          </div>
        </div>
        <div class="selection-table">
          <el-table
            ref="multipleTable"
            :data="selectionData"
            style="width: 100%"
            height="400"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          >
            <el-table-column
              v-for="(item, index) in selectionColumn"
              :key="index"
              v-bind="item"
              :reserve-selection="true"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="selection-pagination">
          <com-pagination
            :page="selectionPage"
            @sizeChange="onSelectionSizeChange"
            @pageChange="onSelectionPageChange"
          ></com-pagination>
        </div>
        <div class="footer_btn" style="display: flex; justify-content: flex-end">
          <el-button @click="closeAddDialog">取消</el-button>
          <el-button type="primary" @click="submitSelectionData">确定</el-button>
        </div>
      </div>
    </com-dialog>
    <!-- 添加个人标签 -->
    <com-dialog :config="addPersonalDialog.config" @closeDialog="closePerTagDialog()" class="dialogSelect">
      <el-form label-position="right" label-width="auto" ref="tagModel">
        <el-form-item label="标签名称" :model="tagModel">
          <el-input placeholder="请输入标签名称" v-model="tagModel.name"></el-input>
        </el-form-item>
      </el-form>
      <div class="submit_btn" style="display: flex; justify-content: flex-end">
        <el-button @click="cancelAddPerTag()">取消</el-button>
        <el-button type="primary" @click="sumbitAddPerTagDialog()">确定</el-button>
      </div>
    </com-dialog>

    <!-- 添加标签组 -->
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
        <el-form-item label="标签组名称">
          <el-input
            placeholder="请输入标签组名称"
            maxlength="15"
            show-word-limit
            v-model="enterpriseModel.groupName"
          ></el-input>
        </el-form-item>
        <div class="addtag-item">
          <div class="addtag-title">标签</div>
          <div class="addtag-input">
            <div class="addtag-input-content" v-for="(item, index) in enterpriseModel.tagList" :key="index">
              <div class="inp">
                <el-input placeholder="请输入标签名" maxlength="15" show-word-limit v-model="item.name"></el-input>
              </div>
              <div class="btn">
                <el-button circle icon="el-icon-minus" @click="deteleEnterpriseRow(index)" size="mini"></el-button>
              </div>
            </div>
          </div>
          <div>
            <el-button @click="addEnterpriseKeyWord" plain icon="el-icon-plus" size="small">添加标签</el-button>
          </div>
        </div>
      </el-form>
      <div></div>
      <div class="Btn-two" style="display: flex; justify-content: flex-end">
        <el-button @click="closeEnterpriseAddDialog()">取消</el-button>
        <el-button type="primary" @click="sumbitEnterpriseAddDialog()">确定</el-button>
      </div>
    </com-dialog>
    <CompanyLabel
      :dialogVisible="BehaviorLabelDialogVisible"
      :fileList="updateBehavList"
      :type="behaviorLabelType"
      @closeDialog="BehaviorLabelDialogVisible = false"
      @reloadData="getEnterTagPage"
    ></CompanyLabel>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack.vue'
import ComDialog from '../../../components/common/ComDialog.vue'
import ComPagination from '../../../components/common/ComPagination'
import CompanyLabel from '../../../components/components/CompanyLabel'
export default {
  components: { GoBack, ComDialog, ComPagination, CompanyLabel },
  data() {
    return {
      addDialog: {
        config: {
          width: '1100px',
          title: '选择客户',
          visible: false
        }
      },
      selectionData: [],
      getRowKeys(row) {
        return row.id
      },
      selectNameList: [], //选择的客户的名称列表，
      selectIdList: '',
      customerData: [],
      selectionSearchContent: '', //搜索的名称
      selectionPage: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      selectionColumn: [
        {
          type: 'selection',
          align: 'center',
          width: '55px'
        },
        {
          label: '姓名',
          align: 'center',
          minWidth: '120px',
          prop: 'name'
        },
        {
          label: '头像',
          align: 'center',
          minWidth: '120px',
          prop: 'avatar',
          formatter: (row) => {
            return <img src={row.avatar} alt="" width="44" height="44" />
          }
        },
        {
          label: '性别',
          align: 'center',
          minWidth: '120px',
          prop: 'genderName'
        },
        {
          label: '创建时间',
          align: 'center',
          minWidth: '120px',
          prop: 'createTime'
        },
        {
          label: '更新时间',
          align: 'center',
          minWidth: '120px',
          prop: 'updateTime'
        }
      ],
      remarkContentBoxShowFlag: false,
      tagNameList: [], //获取编辑企业标签的信息
      remarkContentBoxHeight: 0,
      spanIndex: [], //点击标签颜色会变得数组
      spanName: [],
      personalNameList: [], //个人标签
      remarkContentPersonalBoxHeight: 0,
      personalSpanIndex: [],
      personalSpanName: [],
      personalContentBoxShow: false,
      /*添加个人标签*/
      addPersonalDialog: {
        config: {
          width: '600px',
          title: '添加个人客户标签',
          visible: false
        }
      },
      tagModel: {
        name: '', //名称
        sequence: 0, //排序号
        describe: '' //备注
      },
      //标签组
      enterpriseModel: {
        groupName: '',
        tagList: [
          {
            id: '',
            name: ''
          }
        ]
      },
      // 企业标签弹窗
      addEnterpriseTagDialog: {
        config: {
          width: '600px',
          title: '新增标签组',
          visible: false
        }
      },
      updateBehavList: {},
      BehaviorLabelDialogVisible: false,
      behaviorLabelType: true
    }
  },
  methods: {
    updateBehav(index) {
      this.BehaviorLabelDialogVisible = true
      this.behaviorLabelType = false
      this.updateBehavList = this.tagNameList[index]
      console.log(this.tagNameList[index])
    },
    //删除标签
    deteleEnterpriseRow(index) {
      if (this.enterpriseModel.tagList.length === 1) {
        this.$message.warning('至少含有一个标签')
        return
      }
      this.enterpriseModel.tagList.splice(index, 1)
      console.log(this.enterpriseModel.tagList)
    },
    closeEnterpriseAddDialog() {
      this.enterpriseModel.groupName = ''
      this.enterpriseModel.tagList = [{}]
      this.addEnterpriseTagDialog.config.visible = false
    },
    //提交标签组弹窗
    sumbitEnterpriseAddDialog() {
      // let arr = this.enterpriseModel.tagList
      let flag = false
      let flags = false
      if (this.enterpriseModel.groupName == '') {
        this.$message.warning('请输入标签分组名称')
      } else if (this.enterpriseModel.tagList[0].name == '') {
        this.$message.warning('请输入标签名')
      } else {
        let newArr = []
        this.enterpriseModel.tagList.forEach((item) => {
          newArr.push(item.name)
          flags = item.name == ''
        })
        var s = newArr.join(',') + ','
        for (var i = 0; i < newArr.length; i++) {
          flag = s.replace(newArr[i] + ',', '').indexOf(newArr[i] + ',') > -1
        }
        if (flags == true) {
          this.$message.warning('请输入标签名')
        } else if (flag == true) {
          this.$message.warning('标签名字不能重复')
        } else {
          this.$http.addEnterpriseGroup(this.enterpriseModel).then(() => {
            this.$message.success('添加成功')
            this.addEnterpriseTagDialog.config.visible = false
            this.enterpriseModel.groupName = ''
            this.enterpriseModel.tagList = [{}]
            this.getEnterTagPage()
          })
        }
      }
    },
    //打开添加企业标签
    openEnter() {
      this.addEnterpriseTagDialog.config.visible = true
    },
    //添加标签名
    addEnterpriseKeyWord() {
      if (this.flag) {
        this.$message.warning('请输入标签名')
      }
      if (this.enterpriseModel.tagList.some((item) => !item.name)) {
        this.$message.warning('请输入标签名')
        return
      }
      this.enterpriseModel.tagList.push({ name: '' })
      return
    },
    //打开添加客户
    openCustomer() {
      this.addDialog.config.visible = true
    },

    //选择改变的
    handleSelectionChange(val) {
      this.customerData = val
    },
    //改变页数
    onSelectionSizeChange(val) {
      this.selectionPage.pageSize = val
      this.selectionPage.pageNum = 1
      this.getSelectionCustomerList()
    },
    onSelectionPageChange(val) {
      this.selectionPage.pageNum = val
      this.getSelectionCustomerList()
    },
    //关闭添加客户弹窗
    closeAddDialog() {
      this.addDialog.config.visible = false
    },

    // 提交选项，添加客户到分组
    submitSelectionData() {
      this.selectIdList = ''
      this.selectNameList = []
      let selectId = []
      this.customerData.forEach((item) => {
        this.selectNameList.push(item)
        selectId.push(item.id)
      })
      this.selectIdList = selectId.join('_')
      console.log(this.selectIdList)
      this.addDialog.config.visible = false
    },
    //获取box得高度
    getRemarkContentBoxHeight() {
      let height = this.$refs.remark_content_box.offsetHeight
      this.remarkContentBoxHeight = height
    },
    getTagContentBoxHeight() {
      let height = this.$refs.remark_personl_box.offsetHeight
      this.remarkContentPersonalBoxHeight = height
    },
    //点击前往创建行为标签页面
    nextRouter() {
      this.$router.push('/main/scrm/tag-library/enterprise/list')
    },
    changeTags(tagId, id, name) {
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
    changePersonlTags(id, name) {
      let arrIndex = this.personalSpanIndex.indexOf(id)
      let newName = this.personalSpanIndex.indexOf(name)
      if (arrIndex > -1) {
        this.personalSpanIndex.splice(arrIndex, 1)
        this.personalSpanName.splice(newName, 1)
      } else {
        this.personalSpanIndex.push(id)
        this.personalSpanName.push(name)
      }
      // console.log(this.spanIndex)
    },
    //关闭个人标签
    closePerTagDialog() {
      this.addPersonalDialog.config.visible = false
    },
    //取消保存
    cancelSumbit() {
      this.spanIndex = []
      this.personalSpanIndex = []
      this.selectIdList = ''
      this.selectNameList = []
    },
    //确认保存
    addSumbit() {
      let cropTagId = ''
      let personalTagId = ''
      if (this.selectIdList == '') {
        this.$message.warning('请选择至少一个客户')
        return
      }
      if (this.personalSpanIndex.length == 0) {
        if (this.spanIndex.length == 0) {
          this.$message.warning('请选择至少一个标签')
          return
        }
      } else {
        personalTagId = this.personalSpanIndex.join('_')
      }
      if (this.spanIndex.length == 0) {
        if (this.personalSpanIndex.length == 0) {
          this.$message.warning('请选择至少一个标签')
          return
        }
      } else {
        cropTagId = this.spanIndex.join('_')
      }

      let params = {
        customerId: this.selectIdList,
        cropTagId: cropTagId,
        personalTagId: personalTagId
      }
      this.$http.addTagBatch(params).then(() => {
        this.$message.success('保存成功')
        this.$openNewPageBack()
      })
    },
    //点击个人标签新增取消按钮
    cancelAddPerTag() {
      this.tagModel.name = ''
      this.addPersonalDialog.config.visible = false
    },
    //点击个人标签确认按钮
    sumbitAddPerTagDialog() {
      let that = this
      if (that.tagModel.name == '') {
        that.$message.warning('请填写标签名称')
      } else {
        that.$http.personalTagAdd(that.tagModel).then(() => {
          that.$message.success('添加标签成功')
          that.addPersonalDialog.config.visible = false
          that.tagModel.name = ''
          that.getPersonalTagPage()
        })
      }
    },
    //打开新增个人标签敞口
    openPersonalTag() {
      this.addPersonalDialog.config.visible = true
    },
    //接口部分开始
    //获取客户选择列表
    getSelectionCustomerList() {
      let params = {
        pageNum: this.selectionPage.pageNum,
        pageSize: this.selectionPage.pageSize,
        name: this.selectionSearchContent
      }
      this.$http.getCustomerSelectPage(params).then((res) => {
        this.selectionData = res.data.data.list
        this.selectionPage.total = res.data.data.total
      })
    },
    getEnterTagPage() {
      let params = {
        pageNum: 1,
        pageSize: 999
      }
      this.$http.getEnterpriseTagPage(params).then((res) => {
        this.tagNameList = res.data.data.list
        console.log(this.tagNameList)
      })
    },
    getPersonalTagPage() {
      let params = {
        pageNum: 1,
        pageSize: 999
      }
      this.$http.getPersonalTagPage(params).then((res) => {
        this.personalNameList = res.data.data.list
      })
    }

    //接口部分结束
  },
  created() {
    this.getSelectionCustomerList()
    this.getEnterTagPage()
    this.getPersonalTagPage()
  },
  updated() {
    this.$nextTick(() => {
      this.getRemarkContentBoxHeight()
    })
  }
}
</script>

<style lang="scss" scoped>
.label-div {
  width: 100%;
  height: 100%;
  .label-container {
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    .label-container-form {
      // border: 1px solid red;
      padding: 20px;
      .label-choose-div {
        width: 90%;
        // border: 1px solid red;
        display: inline-block;
        .tagname-form {
          .tagName {
            display: inline-block;
            border: 1px solid #546e95;
            padding: 0 5px;
            margin: 0px 8px 7px 0;
            border-radius: 3px;
            height: 28px;
            line-height: 28px;
            color: #546e95;
            i {
              color: #546e95;
            }
          }
        }
      }
    }
  }
}
.remark_content {
  padding: 50px 18px 30px 20px;
  width: 800px;
  box-sizing: border-box;
  background-color: #f4f4f4;
  position: relative;
  .remark_content_btns {
    position: absolute;
    top: 4px;
    right: 18px;
  }
  .remark_tag_box {
    display: flex;
    // margin-bottom: 10px;
    color: #606266;
    position: relative;
    .remark_tagGroupTitle {
      width: 72px;
      margin-right: 20px;
      text-align: right;
      line-height: 30px;
    }
    .remark_tagChange {
      border-bottom: 1px solid #dcdfe6;
      margin-bottom: 10px;
      flex: 1;
      .remark_tagChange_content {
        display: flex;
        flex-wrap: wrap;
        padding-right: 46px;
        .item {
          margin-bottom: 10px;
          cursor: pointer;
          padding: 5px;
          background-color: #fff;
          border-radius: 4px;
          height: 20px;
          line-height: 20px;
          margin-right: 10px;
        }
      }
    }
    .remark_tag_box_btn {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .showmore {
    position: absolute;
    right: 10px;
    bottom: 0px;
  }
}

.query-table {
  margin: 0 10px 20px 0;
}
.active {
  // font-size: 20px !important;
  background-color: #294a7b !important;
  color: #fff !important;
}
.remark_content_box {
  height: 153px;
  overflow: hidden;
  &.show {
    height: auto;
    overflow: none;
  }
}
.remark_content-personal {
  // border: 1px solid red;
  display: inline-block;
  .item {
    color: #606266;
    margin-bottom: 10px;
    cursor: pointer;
    padding: 5px;
    background-color: #fff;
    border-radius: 4px;
    height: 20px;
    line-height: 20px;
    margin-right: 10px;
  }
}
.btn-div {
  margin-left: 100px;
  // border: 1px solid red;
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
.title {
  color: #606266;
  font-size: 16px;
  padding-bottom: 20px;
  p {
    padding: 10px 0;
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 6px;
      height: 20px;
      background-color: #294a7b;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      left: -20px;
    }
  }
}
</style>
