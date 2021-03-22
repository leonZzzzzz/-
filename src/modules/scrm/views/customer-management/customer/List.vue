<template>
  <div class="customer-management">
    <div class="container">
      <div class="query-table-box">
        <el-form inline :model="searchForm" label-width="auto" label-position="right" size="small">
          <el-form-item label="微信昵称">
            <el-input
              size="small"
              placeholder="请输入微信昵称"
              v-model="searchForm.name"
              @input="searchCustomerList"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="客户性别">
            <el-select v-model="searchForm.gender" @change="searchCustomerList" clearable>
              <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属成员">
            <el-select
              v-model="searchForm.followUserId"
              filterable
              placeholder="请选择"
              @change="searchCustomerList"
              clearable
            >
              <el-option v-for="item in followUserIdOptions" :key="item.userId" :label="item.name" :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input
              size="small"
              placeholder="请输入手机号"
              v-model="searchForm.mobile"
              @input="searchCustomerList"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="备注名">
            <el-input
              size="small"
              placeholder="请输入备注名"
              v-model="searchForm.remark"
              @input="searchCustomerList"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="企业名称">
            <el-input
              size="small"
              placeholder="请输入企业名称"
              v-model="searchForm.company"
              @input="searchCustomerList"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="客户标签">
            <div class="quert-table-title" @click="openTagList()">
              <span class="query-table-choose" v-if="this.searchForm.tags.length == 0">请选择</span>
              <template v-if="this.searchForm.tags.length != 0">
                <el-tag
                  class="search-tag"
                  v-for="(tag, index) in spanName"
                  :key="index"
                  closable
                  type="info"
                  :disable-transitions="true"
                  @close="closeTagListFun(tag, index)"
                >
                  {{ tag }}
                </el-tag>
              </template>
              <i class="el-icon-arrow-down chosse-i"></i>
            </div>
          </el-form-item>
          <el-form-item label="生命周期">
            <el-select
              style="width: 300px"
              v-model="searchForm.lifeCycleId"
              placeholder="请选择生命周期"
              clearable
              @change="searchCustomerList"
            >
              <el-option-group v-for="group in lifeCycleList" :key="group.id" :label="group.name">
                <el-option v-for="item in group.children" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="添加时间">
            <el-date-picker
              v-model="searchForm.dateTimeRange"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="searchCustomerList"
              clearable
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-info">
        <div class="info-msg">
          客户总数：&nbsp;<span>{{ page.total }}</span>
        </div>
        <div class="table-info-btns">
          <el-button size="small" type="primary" @click="openSettingLabel()">批量设置标签</el-button>
          <el-button size="small" type="primary" @click="refreshCustomer" :loading="syncLoading">客户同步</el-button>
          <!-- <el-button size="small" type="primary" @click="$router.push('/main/scrm/customer-management/extend/list')"
            >扩展字段</el-button
          > -->
        </div>
      </div>
      <div class="common-table-box">
        <el-table
          :data="tableData"
          id="tableList"
          :height="tableHeight"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
        >
          <el-table-column align="center" prop="avatar" label="头像">
            <template slot-scope="scope">
              <img :src="scope.row.avatar || defaultHearderImage" alt="" width="44" height="44" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="remarkList" label="备注名">
            <template slot-scope="scope">
              {{ scope.row.remarkList | remarkListFilters }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="微信昵称"></el-table-column>
          <el-table-column align="center" prop="lifeCycleNameList" label="生命周期"></el-table-column>
          <el-table-column align="center" prop="userNameList" label="所属成员">
            <template slot-scope="scope">
              <span class="tagName" v-for="(item, index) in scope.row.userNameList" :key="index">
                <i class="el-icon-user-solid icon-user"></i>
                {{ item }}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="statusName" label="客户状态"></el-table-column>
          <el-table-column align="center" prop="receiveMessageTime" label="上次对话时间" v-if="getOpenStatusBoolean">
            <template slot-scope="scope">{{ scope.row.receiveMessageTime | allTableTimefilters }}</template>
          </el-table-column>
          <el-table-column align="center" prop="createAtToTime" label="添加时间">
            <template slot-scope="scope">{{ scope.row.createAtToTime | allTableTimefilters }}</template>
          </el-table-column>
          <el-table-column align="center" prop="" label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$openNewPage({path: `/main/scrm/customer-management/customer/detail?id=${scope.row.id}&wxid=${scope.row.wxCustomerId}`})
                "
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>
    <com-dialog :config="selectDialog.config" @closeDialog="selectDialog.config.visible = false" class="dialogSelect">
      <div class="select-div-dispose">
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
      <div class="Btn-two" style="display: flex; justify-content: flex-end">
        <el-button @click="closeTagDialog()">取消</el-button>
        <el-button type="primary" @click="sumbitTagDialog()">确定</el-button>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComDialog from '../../../components/common/ComDialog'
import ComTable from '../../../components/common/ComTable'
import ComPagination from '../../../components/common/ComPagination'
// import ComDialog from '../../../components/common/ComDialog'
export default {
  components: { ComTable, ComPagination, ComDialog },
  data() {
    return {
      tags: [
        { name: '标签一' },
        { name: '标签二' },
        { name: '标签三' },
        { name: '标签四' },
        { name: '标签五' }
        // { name: '标签一' },
        // { name: '标签二' },
        // { name: '标签三' },
        // { name: '标签四' },
        // { name: '标签五' }
      ],
      // search: {},
      // searchForm: [
      //   {
      //     label: '客户性别',
      //     type: 'select',
      //     formName: 'sex',
      //     options: [
      //       { value: '', label: '' }
      //     ],
      //     value: ''
      //   },
      //   {
      //     label: '',
      //     type: 'input',
      //     formName: 'content',
      //     placeholder: '请输入客户姓名、客户公司、客户手机号',
      //     value: ''
      //   }
      // ],
      tableData: [],
      column: [
        {
          label: '头像',
          minWidth: '150px',
          align: 'center',
          prop: 'avatar',
          formatter: row => {
            return
          }
        },
        {
          label: '备注名',
          minWidth: '150px',
          align: 'center',
          prop: 'remarkList'
        },
        {
          // label: '姓名',
          label: '微信昵称',
          minWidth: '150px',
          align: 'center',
          prop: 'name'
        },
        // {
        //   label: '公司名称',
        //   minWidth: '150px',
        //   align: 'center',
        //   prop: 'cropNoName'
        // },

        // {
        //   label: '性别',
        //   minWidth: '150px',
        //   align: 'center',
        //   prop: 'genderName'
        // },
        // {
        //   label: '客户类型',
        //   minWidth: '150px',
        //   align: 'center',
        //   prop: 'typeName'
        // },
        // {
        //   label: '手机号码',
        //   minWidth: '150px',
        //   align: 'center',
        //   prop: 'mobile'
        // },

        {
          label: '生命周期',
          minWidth: '150px',
          align: 'center',
          prop: 'lifeCycleNameList'
        },
        {
          label: '所属成员',
          minWidth: '150px',
          align: 'center',
          prop: 'userNameList',
          formatter: row => {
            if (!row.userNameList) {
              return ''
            }
            return row.userNameList.map(item => (
              <span class="tagName">
                <i class="el-icon-user-solid icon-user"></i>
                {item}
              </span>
            ))
          }
        },
        {
          label: '客户状态',
          minWidth: '150px',
          align: 'center',
          prop: 'statusName'
        },
        // {
        //   label: '上次对话时间',
        //   minWidth: '150px',
        //   align: 'center',
        //   prop: 'receiveMessageTime',
        //   formatter: (row) => {
        //     return row.receiveMessageTime ? row.receiveMessageTime.slice(0, row.receiveMessageTime.length - 3) : ''
        //   }
        // },
        {
          label: '添加时间',
          minWidth: '150px',
          align: 'center',
          prop: 'createAtToTime',
          formatter: row => {
            return row.createAtToTime ? row.createAtToTime.slice(0, row.createAtToTime.length - 3) : ''
          }
        },
        // {
        //   label: '更新时间',
        //   minWidth: '150px',
        //   align: 'center',
        //   prop: 'updateTime'
        // },
        {
          label: '操作',
          align: 'center',
          width: '150px',
          fixed: 'right',
          formatter: row => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$openNewPage({path: `/main/scrm/customer-management/customer/detail?id=${row.id}&wxid=${row.wxCustomerId}`})
                  }}
                >
                  详情
                </el-button>
              </div>
            )
          }
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      lifeCycleList: [],
      searchForm: {
        tags: [],
        groups: [],
        gender: '',
        dateTimeRange: '',
        name: '',
        followUserId: '',
        mobile: '',
        remark: '',
        lifeCycleId: '',
        company: ''
      },
      followUserIdOptions: [],
      genderOptions: [
        { label: '全部', value: '' },
        { label: '男', value: '1' },
        { label: '女', value: '2' },
        { label: '未知', value: '0' }
      ],
      tagList: [],
      groupList: [],
      syncLoading: false,
      // tagsDialog: {
      //   config: {
      //     width: '600px',
      //     title: '筛选标签',
      //     visible: false
      //   }
      // }
      selectDialog: {
        config: {
          width: '600px',
          title: '选择企业客户标签',
          visible: false
        }
      },
      spanIndex: [],
      tagIndex: [],
      tagNameList: [],
      spanName: [],
      tableHeight: 400,
      getOpenStatusBoolean: true
    }
  },
  created() {
    // this.getTagList()
    this.getGroupList()
    this.getEnterList()
    // this.getCustomerPage()
    this.getOpenStatus()
    this.getLifeCycleUsers()
    this.wxCropUserSelectForNameSearch()
  },
  mounted() {
    this.$nextTick(() => {
      this.getHeight()
    })
  },
  methods: {
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getCustomerPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getCustomerPage()
    },
    // // 筛选标签
    // showAndChooseTags() {
    //   this.tagsDialog.config.visible = true
    // },
    // getTagList() {
    //   let that = this
    //   that.$http.getCustomerTagList().then(res => {
    //     console.log(res.data.data)
    //     let list = res.data.data.cropList
    //     let newList = []
    //     list.forEach(item => {
    //       let obj = {
    //         label: item.name,
    //         value: item.id
    //       }
    //       newList.push(obj)
    //     })
    //     that.tagList = newList
    //   })
    // },
    getGroupList() {
      let that = this
      that.$http.getCustomerGroupList().then(res => {
        let list = res.data.data
        let newList = []
        list.forEach(item => {
          let obj = {
            label: item.name,
            value: item.id
          }
          newList.push(obj)
        })
        that.groupList = newList
      })
    },
    // 获取客户列表
    getCustomerPage() {
      let that = this
      let tagIds = ''
      let groupIds = ''
      that.searchForm.tags.forEach((item, idx) => {
        if (idx === 0) {
          tagIds += item
        } else {
          tagIds += '_' + item
        }
      })
      that.searchForm.groups.forEach((item, idx) => {
        if (idx === 0) {
          groupIds += item
        } else {
          groupIds += '_' + item
        }
      })
      let date = this.searchForm.dateTimeRange
      let startCreateAt = ''
      let endCreateAt = ''
      if (date) {
        startCreateAt = date[0]
        endCreateAt = date[1]
      }
      let params = {
        pageNum: that.page.pageNum,
        pageSize: that.page.pageSize,
        name: that.searchForm.name,
        followUserId: that.searchForm.followUserId,
        mobile: that.searchForm.mobile,
        remark: that.searchForm.remark,
        lifeCycleId: that.searchForm.lifeCycleId,
        company: that.searchForm.company,
        tagIds: tagIds,
        groupIds: groupIds,
        gender: that.searchForm.gender,
        startCreateAt: startCreateAt,
        endCreateAt: endCreateAt,
        showCustomerReceiveMessageTime: true
      }
      that.$http.getCustomerPage(params).then(res => {
        that.tableData = res.data.data.list
        that.page.total = res.data.data.total
      })
      // that.$http.getCustomerPage(that.page).then(res => {
      //   that.tableData = res.data.data.list
      //   that.page.total = res.data.data.total
      // })
    },
    // 条件搜索客户
    searchCustomerList() {
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.getCustomerPage()
      console.log(this.searchForm.tags)
    },
    // 重置搜索
    refreshSearch() {
      this.searchForm.tags = []
      this.searchForm.groups = []
      this.searchForm.gender = ''
      this.searchForm.dateTimeRange = ''
      this.searchForm.name = ''
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.spanName = []
      this.spanIndex = []

      this.getCustomerPage()
    },
    // 客户同步
    refreshCustomer() {
      let that = this
      that.syncLoading = true
      that.$http.syncCustomerList().then(() => {
        that.$message.success('同步成功')
        that.syncLoading = false
        that.refreshSearch()
      })
    },

    /*zhw添加*/
    openTagList() {
      // this.$refs.selectTagList.blur()
      this.selectDialog.config.visible = true
    },
    // changeTag(index, id, label) {
    //   let arrIndex = this.spanIndex.indexOf(id)
    //   let arr = this.tagIndex.indexOf(id)
    //   if (arrIndex > -1) {
    //     this.spanIndex.splice(arrIndex, 1)
    //     this.tagIndex.splice(arr, 1)
    //   } else {
    //     this.spanIndex.push(id)
    //     this.tagIndex.push({ id: id, label: label })
    //   }
    //   this.searchForm.tags = this.tagIndex
    // },
    getHeight() {
      this.tableHeight = window.innerHeight - document.getElementById('tableList').offsetTop - 160
    },
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
    // closeTagList(tag, index) {
    //   this.tagIndex.splice(index, 1)
    //   let arrIndex = this.spanIndex.indexOf(tag.id)
    //   if (arrIndex > -1) {
    //     this.spanIndex.splice(arrIndex, 1)
    //   }
    // },
    closeTagList(tag, index) {
      let that = this
      that.spanName.splice(index, 1)
      that.spanIndex.splice(index, 1)
    },
    closeTagListFun(tag, index) {
      let that = this
      that.spanName.splice(index, 1)
      that.spanIndex.splice(index, 1)
      this.searchCustomerList()
    },
    changeTagList() {
      this.selectDialog.config.visible = false
    },
    //取消按钮
    closeTagDialog() {
      this.selectDialog.config.visible = false
      this.spanIndex = []
      this.tagIndex = []
      this.spanName = []
      this.searchForm.tags = []
    },
    //跳转到批量设置标签
    openSettingLabel() {
      this.$router.push('/main/scrm/customer-management/label/form')
    },

    //确认按钮
    sumbitTagDialog() {
      this.selectDialog.config.visible = false
      this.searchForm.tags = this.spanIndex
      this.searchCustomerList()
    },
    getEnterList() {
      let that = this
      that.$http.getEnterTagList().then(res => {
        // let list = res.data.data
        this.tagNameList = res.data.data
        // list.forEach(item => {
        //   this.tagList.push(item.tagList)
        // })
        // console.log(this.tagNameList)
      })
    },
    // 生命周期列表
    getLifeCycleUsers() {
      this.functions('customerLifeCycleTree', '', res => {
        this.lifeCycleList = res.data.data
        console.log('生命周期列表', this.lifeCycleList)
      })
    },
    // 获取客户会话开启状态
    getOpenStatus() {
      this.$http.getOpenStatus().then(res => {
        console.log('会话设置', res.data.data)
        this.getOpenStatusBoolean = res.data.data
        this.getCustomerPage()
      })
    },
    //
    wxCropUserSelectForNameSearch(name) {
      this.$http.wxCropUserSelectForNameSearch({ name }).then(res => {
        this.followUserIdOptions = res.data.data
      })
    }
  },
  filters: {
    remarkListFilters(option) {
      if (!option) {
        return ''
      }
      let remarksArr = []
      remarksArr = option.reduce((total, now) => {
        total.includes(now) ? '' : total.push(now)
        return total
      }, [])
      return remarksArr.join('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-management {
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
  padding: 20px 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .search-content {
    height: 35px;
    display: flex;
    .search-input {
      width: 300px;
      margin-right: 10px;
    }
    .el-button {
      margin-top: 3px;
    }
  }
}
.table-info {
  padding: 0 20px;
  box-sizing: border-box;
  color: #909399;
  font-size: 14px;
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;
  .info-msg {
    margin-right: 40px;
    span {
      color: #1e90ff;
    }
  }
  .table-info-btns {
    margin-left: auto;
  }
}
.common-table-box {
  padding: 0 20px;
  box-sizing: border-box;
}
.common-pagination {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  bottom: 0;
}
.dialog-content {
  width: 100%;
  height: 300px;
  font-size: 14px;
  color: #909399;
  padding: 0 20px;
  box-sizing: border-box;
  .tags-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    .top-title {
      color: #303133;
    }
    .top-clear-btn {
      color: #1e90ff;
      cursor: pointer;
    }
  }
  .tags-content {
    width: 100%;
    height: 200px;
    .tags-module {
      .module-title {
        margin-bottom: 10px;
      }
      .tags-group {
        display: flex;
        flex-flow: wrap;
      }
    }
  }
  .submit-btn {
    width: 200px;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    background-color: #294a7b;
    margin: 20px auto;
    border-radius: 3px;
  }
}
::v-deep .el-checkbox.is-bordered.el-checkbox--small {
  margin: 0 10px 10px 0;
}
// ::v-deep .el-form-item--small.el-form-item {
//   margin-right: 60px;
// }
.selectGroup {
  border: 1px solid #dcdfe6;
  margin-bottom: 10px;
  min-height: 43px;
  line-height: 43px;
  padding: 5px 0;
  border-radius: 5px;
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
.tagGroupTitle {
  padding: 14px 0;
  position: relative;
  padding-left: 16px;
  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 14px;
    background-color: #294a7b;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    left: 0;
  }
}
.tagChange {
  // border: 1px solid #ccc;
  overflow: auto;
  width: 100%;
  max-height: 200px;
  div {
    font-size: 12px;
    margin: 10px 10px 10px 0;
    padding: 8px 20px;
    background-color: #f4f4f5;
    color: #909399;
    border-radius: 5px;
    display: inline-block;
    border-color: #e9e9eb;
    cursor: pointer;
  }
}
.Btn-two {
  margin: 20px 0;

  .el-button {
    width: 100px;

    font-size: 14px;
  }
}
.active {
  // font-size: 20px !important;
  background-color: #294a7b !important;
  color: #fff !important;
}
.dialogSelect {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.quert-table-title:hover {
  border: 1px solid #a2a4a8;
}
.quert-table-title::-webkit-scrollbar {
  display: none;
}
.quert-table-title {
  overflow-y: hidden;
  overflow-x: scroll;
  position: relative;
  cursor: pointer;
  width: 300px;
  border: 1px solid #dcdfe6;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
  .query-table-choose {
    color: #8f919e;
    margin-left: 20px;
  }
  .chosse-i {
    position: absolute;
    right: 10px;
    margin-top: 10px;
    color: #c0c4dd;
    // border: 1px solid red;
  }
}
.quert-table-select {
  background-color: #e4e4e4;
  margin-left: 10px;
  border-radius: 5px;
  padding: 2px 5px;
  color: #818181;
}
.search-tag {
  margin: 0 4px;
}
.select-div-dispose {
  height: 500px;
  overflow-y: auto;
}
.tagName {
  display: inline-block;
  border: 1px solid #dcdfe6;
  padding: 2px 5px;
  cursor: pointer;
  margin: 8px 8px 7px 0;
  margin-right: 8px;
  margin-bottom: 7px;
  border-radius: 3px;
}
</style>
