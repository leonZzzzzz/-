<template>
  <div class="enterprise-tag">
    <div class="container">
      <div class="table-info">
        <div class="info-left">
          <div class="info-msg">
            目前已有行为标签：&nbsp;<span>{{ page.total }}</span>
            <el-button
              type="text"
              @click="openWhatTag"
            >何为行为标签?</el-button>
          </div>
        </div>
        <div class="info-right">
          <el-button
            size="small"
            type="primary"
            @click="addTagGroup"
          >添加标签组</el-button>
        </div>
      </div>
      <div class="common-table-box">
        <el-table
          :data="tableData"
          width="100%"
          id="table"
          class="el-table"
          :cell-style="changeCellStyle"
          :header-cell-style="{ 'text-align': 'center' }"
          :height="height"
        >
          <!-- <el-table-column type="index" label="序号" align="center"> </el-table-column> -->
          <el-table-column
            label="标签组名称"
            prop="name"
            align="center"
          > </el-table-column>
          <el-table-column
            label="标签内容"
            align="center"
            class="special-column"
            width="700px"
          >
            <template slot-scope="scope">
              <div class="tagname-form">
                <span
                  class="tagName"
                  v-for="(item, index) in scope.row.tagList"
                  :key="index"
                >{{ item.name }}</span>
              </div>
            </template>
          </el-table-column>

          <!-- <el-table-column label="新增时间" prop="groupTime" align="center"> </el-table-column> -->
          <el-table-column
            label="排序号"
            prop="sequence"
            align="center"
          > </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            :formatter="formatterColumn"
          > </el-table-column>
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
      :config="editDialog.config"
      @closeDialog="editDialog.config.visible = false"
      class="dialogSelect"
    >
      <el-form
        label-position="right"
        label-width="auto"
        ref="eidtExtendModel"
        :model="models"
        class="el-form-filter"
      >
        <el-form-item label="标签组名称:">
          <span>{{ models.name }}</span>
        </el-form-item>
        <div class="addtag-item">
          <div class="addtag-title">标签</div>
          <div class="addtag-input">
            <!-- <el-row :gutter="24">
              <el-col :span="22"
                ><el-input placeholder="请输入标签名" maxlength="15" show-word-limit v-model="inputKeyWord"></el-input
              ></el-col>
            </el-row> -->
            <el-row
              :gutter="24"
              v-for="(item, index) in models.tagList"
              :key="index"
            >
              <el-col :span="16">
                <el-input
                  placeholder="请输入标签名"
                  maxlength="15"
                  show-word-limit
                  v-model="models.tagList[index].name"
                ></el-input>
              </el-col>
              <el-col :span="6">
                <el-input
                  placeholder="请输入分值"
                  v-model="models.tagList[index].score"
                ></el-input>
              </el-col>
              <el-col :span="2"> <i
                  class="el-icon-minus iconMinu"
                  @click="deteleEditRow(item.id)"
                ></i></el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <div class="addtag-addBtn">
        <el-button
          type="text"
          @click="addEditKeyWord()"
        > 添加标签</el-button>
      </div>
      <div class="Btn-two">
        <el-row :gutter="24">
          <el-col :span="10">
            <el-button
              type="text"
              style="color:red;"
              @click="deteleTagGroup()"
            >删除标签组</el-button>
          </el-col>
          <el-col :span="6">&nbsp; </el-col>
          <el-col :span="4">
            <el-button
              type="info"
              @click="closeEditDialog()"
            >取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              @click="sumbitEditDialog()"
            >确定</el-button>
          </el-col>
        </el-row>
      </div>
    </com-dialog>
    <com-dialog
      :config="addTagDialog.config"
      @closeDialog="addTagDialog.config.visible = false"
      class="dialogSelect"
    >
      <el-form
        label-position="right"
        label-width="auto"
        ref="addExtendModel"
        :model="model"
        class="el-form-filter"
      >
        <el-form-item label="标签组名称">
          <el-input
            placeholder="请输入标签组名称"
            maxlength="15"
            show-word-limit
            v-model="model.name"
          ></el-input>
        </el-form-item>
        <div class="addtag-item">
          <div class="addtag-title">
            标签<el-button
              class="addtag-tagbtn"
              @click="whatDialog.config.visible = true"
              type="text"
            >分值的作用&gt;</el-button>
          </div>
          <div class="addtag-input">
            <!-- <el-row :gutter="24">
              <el-col :span="22"
                ><el-input placeholder="请输入标签名" maxlength="15" show-word-limit v-model="inputKeyWord"></el-input
              ></el-col>
            </el-row> -->
            <el-row
              :gutter="24"
              v-for="(item, index) in model.tagList"
              :key="index"
            >
              <el-col :span="16">
                <el-input
                  placeholder="请输入标签名"
                  maxlength="15"
                  v-model="item.name"
                ></el-input>
              </el-col>
              <el-col :span="6">
                <el-input
                  placeholder="请输入分值"
                  v-model="item.score"
                ></el-input>
              </el-col>
              <el-col :span="2"> <i
                  class="el-icon-minus iconMinu"
                  @click="deteleRow(index)"
                ></i></el-col>
            </el-row>
          </div>
          <div class="addtag-addBtn">
            <el-button
              type="text"
              @click="addKeyWord()"
            > 添加标签</el-button>
          </div>
        </div>
      </el-form>
      <div>
      </div>
      <div class="Btn-two">
        <el-row :gutter="24">
          <el-col :span="10">&nbsp; </el-col>
          <el-col :span="6">&nbsp; </el-col>
          <el-col :span="4">
            <el-button
              type="info"
              @click="closeAddDialog()"
            >取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              @click="sumbitAddDialog()"
            >确定</el-button>
          </el-col>
        </el-row>
      </div>
    </com-dialog>
    <com-dialog
      :config="whatDialog.config"
      @closeDialog="whatDialog.config.visible = false"
      class="dialogSelect"
    >
      <div
        class="what-message"
        v-for="(whatmessage, whatIndex) in whatMessage"
        :key="whatIndex"
      >
        {{ whatmessage.message }}
      </div>
      <div class="what-btn">
        <el-row :gutter="24">
          <el-col :span="7">&nbsp;</el-col>
          <el-col :span="11">
            <el-button
              class="what-bottom-btn"
              type="primary"
              @click="whatDialog.config.visible = false"
            >知道了</el-button>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComDialog from '../../../components/common/ComDialog'
import ComPagination from '../../../components/common/ComPagination'
export default {
  components: { ComPagination, ComDialog },
  data() {
    return {
      whatMessage: [
        { message: '1.行为标签与其他类型标签不同在于带有分值属性，行为标签用以设置特定行为事件产生地自动打标签。' },
        {
          message:
            '2.标签分值用于标签被使用的次数情况，即客户带有该标签的深度表现，例如客户浏览商品的次数越多，对应标签的分值越高，说明越感兴趣。'
        },
        {
          message:
            '3.分值可以设置为0，即该标签无需分值，无需表现深度，例如通过扫码渠道参加了活动，则该渠道标签无需分值即深度的表现。'
        }
      ],
      tableTagList: [],
      searchForm: {
        content: ''
      },
      tableData: [],
      column: [
        {
          type: 'index',
          label: '序号',
          align: 'center',
          width: '150px'
        },
        {
          label: '标签组名称',
          minWidth: '150px',
          align: 'center',
          prop: 'name'
        },
        {
          label: '标签内容',
          align: 'center',
          minWidth: '150px'
          // formatter: row => {}
        },
        {
          label: '新增时间',
          align: 'center',
          minWidth: '150px',
          prop: 'groupTime'
        },
        {
          label: '排序号',
          align: 'center',
          prop: 'order'
        },
        {
          label: '操作',
          align: 'center',
          formatter: row => {
            return (
              <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
                编辑
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
      editDialog: {
        config: {
          width: '600px',
          title: '编辑标签组',
          visible: false
        }
      },
      addTagDialog: {
        config: {
          width: '600px',
          title: '新增标签组',
          visible: false
        }
      },
      whatDialog: {
        config: {
          width: '500px',
          title: '行为标签',
          visible: false
        }
      },
      model: {
        // groupId: '',
        name: '',
        tagList: [
          {
            id: '',
            name: ''
          }
        ]
      },
      models: {
        id: '',
        name: '',
        tagList: [
          // {
          //   tagId: '',
          //   id: '',
          //   name: ''
          // }
        ]
      },
      tagList: [],
      inputKeyWord: '',
      height: 400
    }
  },
  created() {
    this.getTagPage()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  },
  destroyed() {
    window.onresize = ''
  },
  methods: {
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
      this.getTagPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getTagPage()
    },
    onSearch() {
      console.log('搜索的内容' + this.searchForm.content)
    },
    onReset() {
      //
    },
    // 获取企业标签列表
    getTagPage() {
      let that = this
      that.$http.getBehaviorPage(that.page).then(res => {
        let list = res.data.data.list
        let newList = []
        list.forEach(item => {
          if (item.name != undefined) {
            newList.push(item)
            this.tableTagList.push(item.tagList)
          }
        })

        that.tableData = newList
        that.page.total = newList.length
        console.log(that.tableData)
      })
    },

    //显示编辑弹窗
    showEditDialog(row) {
      this.models = {
        id: '',
        name: '',
        appId: '',
        createTime: '',
        updateTime: '',
        isDeleted: true,
        tagList: []
      }
      this.models.name = row.name
      this.models.id = row.id
      this.models.appId = row.appId
      this.models.createTime = row.createTime
      this.models.sequence = row.sequence
      row.tagList.forEach(item => {
        this.models.tagList.push({ name: item.name, score: item.score, id: item.id })
      })
      this.editDialog.config.visible = true
    },
    //关闭编辑按钮
    closeEditDialog() {
      this.editDialog.config.visible = false
    },
    //确认编辑按钮
    sumbitEditDialog() {
      let flag = false
      let flags = false
      let newTagList = []
      if (this.models.name == '') {
        this.$message.warning('请输入标签分组名称')
      } else if (this.models.tagList[0].name == undefined) {
        this.$message.warning('请输入标签名')
      } else {
        let newArr = []
        this.models.tagList.forEach(item => {
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
          this.models.tagList.forEach(item => {
            newTagList.push({ name: item.name, id: item.id, score: item.score })
          })
          this.models.tagList = newTagList
          console.log(this.models)
          this.$http.updateBehavior(this.models).then(() => {
            this.$message.success('编辑成功')
            this.getTagPage()
            this.editDialog.config.visible = false
          })
        }
      }
    },
    addEditKeyWord() {
      let keyword = ''
      if (this.flag) {
        this.$message.warning('请输入标签名')
      }
      if (this.models.tagList.some(item => !item.name)) {
        this.$message.warning('请输入标签名')
        return
      }
      this.models.tagList.push({ name: keyword })
      return
      // keyword = this.inputKeyWord
      // if (keyword == '') {
      // } else {
      //   let obj = {
      //     name: keyword
      //   }
      //   this.models.tagList.push(obj)
      //   this.inputKeyWord = ''
      // }
    },
    deteleTagGroup() {
      let wxTagGroupIdList = ''
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          wxTagGroupIdList = this.models.id
          this.$http.deleteBehavior({ id: wxTagGroupIdList }).then(() => {
            this.$message.success('删除标签组成功')
            this.editDialog.config.visible = false
            this.getTagPage()
          })
        })
        .catch(() => {})
    },
    //删除添加标签
    deteleEditRow(id) {
      // let wxTagIdList = []
      if (this.models.tagList.length === 1) {
        this.$message.warning('至少含有一个标签')
        return
      }
      // this.$confirm('是否删除该数据?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   wxTagIdList.push(id)
      //   this.$http.deteleEnterpriseGroup({ id: wxTagIdList }).then(() => {
      //     this.$message.success('删除成功,请按确认进行保存')
      //     this.getTagPage()
      //   })
      this.models.tagList.some((item, i) => {
        if (item.id == id) {
          this.models.tagList.splice(i, 1)
          return true
        }
      })
      // })
      // console.log(this.model.tagList)
    },
    //添加标签组开始
    addTagGroup() {
      this.model.name = ''
      this.model.tagList = [{}]
      this.addTagDialog.config.visible = true
    },
    //关闭添加标签组弹窗
    closeAddDialog() {
      this.model.name = ''
      this.model.tagList = [{}]
      this.addTagDialog.config.visible = false
    },
    //提交标签组弹窗
    sumbitAddDialog() {
      // let arr = this.model.tagList
      let flag = false
      let flags = false
      if (this.model.name == '') {
        this.$message.warning('请输入标签分组名称')
      } else if (this.model.tagList[0].name == undefined) {
        this.$message.warning('请输入标签名')
      } else {
        let newArr = []
        this.model.tagList.forEach(item => {
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
          this.$http.addBehavior(this.model).then(() => {
            this.$message.success('添加成功')
            this.addTagDialog.config.visible = false
            this.model.name = ''
            this.model.tagList = [{}]
            this.getTagPage()
          })
        }

        // console.log(flag)
      }

      // if (this.model.groupId == '') {
      //   this.$message.warning('请输入标签分组名称')
      //   console.log(this.model.tagList.sort())
      // } else if (this.model.tagList.sort()) {
      // } else {
      //   console.log(this.model)
      //   // this.$http.addEnterpriseGroup(this.model).then(() => {
      //   //   this.$message.success('添加成功')
      //   //   this.addTagDialog.config.visible = false
      //   // })
      // }
    },
    //删除
    deteleRow(index) {
      if (this.model.tagList.length === 1) {
        this.$message.warning('至少含有一个标签')
        return
      }
      this.model.tagList.splice(index, 1)
      console.log(this.model.tagList)
    },
    //添加标签名
    addKeyWord() {
      if (this.flag) {
        this.$message.warning('请输入标签名')
      }
      if (this.model.tagList.some(item => !item.name)) {
        this.$message.warning('请输入标签名')
        return
      }
      this.model.tagList.push({ name: '', score: '' })
      return
    },
    inputBlur(currentIndex) {
      console.log('inputBlur', currentIndex)
      let currentItem = this.model.tagList[currentIndex]
      for (var i = 0; i < this.model.tagList.length; i++) {
        if (currentIndex != i && this.model.tagList[i].name === currentItem.name) {
          this.$message.warning('标签名重复,请重新输入')
          break
        }
      }
      // this.model.tagList.forEach((item, index) => {
      //   if (currentIndex != index && item.name === currentItem.name) {
      //     this.$message.warning('标签名重复,请重新输入')
      //     // break;
      //   }
      // })
    },
    formatterColumn(row) {
      return (
        <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
          编辑
        </el-button>
      )
    },
    changeCellStyle(row) {
      if (row.column.label === '标签内容') {
        return 'max-width:"700px";overflow:hidden; text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2; min-height:"200px" ' // 修改的样式
      } else {
        return ''
      }
    },
    //何为行为标签
    openWhatTag() {
      this.whatDialog.config.visible = true
    }

    //添加变迁组结束
  }
}
</script>

<style lang="scss" scoped>
.enterprise-tag {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
}
.query-table-box {
  margin-bottom: 20px;
  .search-content {
    display: flex;
    .search-input {
      width: 300px;
      margin-right: 10px;
    }
  }
}
.table-info {
  color: #303133;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .info-left {
    display: flex;
    .info-msg {
      margin-right: 40px;
      span {
        color: #1e90ff;
      }
      .el-button {
        margin-left: 10px;
      }
    }
  }
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
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
    padding-bottom: 20px;
    .el-row {
      margin: 10px 0;
    }
  }
  .addtag-addBtn {
    margin-bottom: 20px;
    .el-button {
      color: #1e90ff;
    }
  }
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
.common-table-box {
  // padding: 0 20px;
  box-sizing: border-box;
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
  width: 700px;
}
.el-form-filter {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
.tagname-form {
  min-height: 65px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.what-message {
  margin: 5px;
  color: rgb(112, 111, 111);
  line-height: 20px;
}
.what-btn {
  padding: 10px 0;
  .what-bottom-btn {
    width: 200px;
  }
}
.addtag-tagbtn {
  margin-left: 450px;
}
</style>
