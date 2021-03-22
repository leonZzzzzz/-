<template>
  <div>
    <go-back title="设置客户"></go-back>
    <div class="main">
      <div class="search">
        <div class="btns">
          <el-button type="primary" @click="setLifeCycleList" size="small">设置客户生命周期</el-button>
        </div>
        <el-form class="form" :inline="true">
          <el-form-item label="客户名称">
            <el-input
              v-model="search.name"
              size="small"
              clearable
              placeholder="请输入客户名称"
              @input="searchInput"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input
              v-model="search.mobile"
              size="small"
              clearable
              placeholder="请输入手机"
              @input="searchInput"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户标签">
            <el-select
              v-model="search.tagId"
              size="small"
              clearable
              multiple
              collapse-tags
              placeholder="请选择客户标签"
              @change="searchInput"
            >
              <el-option-group v-for="group in tagsList" :key="group.id" :label="group.name">
                <el-option v-for="item in group.tagList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="成员">
            <input-tags style="margin-top: 2px" placeholder="请选择成员" @success="inputTagsSuccess"></input-tags>
          </el-form-item>
        </el-form>
      </div>
      <div class="table">
        <table-list
          id="tableList"
          :tableData="tableData"
          :tableColumn="tableColumn"
          :tableHeight="tableHeight"
          v-loading="isLoading"
        ></table-list>
      </div>
      <div class="table-page">
        <table-page :page="pageData" @sizeChange="onSizeChange" @pageChange="onPageChange"></table-page>
      </div>
    </div>
  </div>
</template>

<script>
import GoBack from '../../components/components/GoBack.vue'
import InputTags from '../../components/components/InputTags.vue'
import TableList from '../../components/components/TableList.vue'
import TablePage from '../../components/components/TablePage.vue'
export default {
  components: {
    GoBack,
    InputTags,
    TableList,
    TablePage
  },
  data() {
    return {
      search: {
        name: '',
        mobile: '',
        tagId: [],
        userId: []
      },
      isLoading: false,
      tagsList: [],
      settingList: [],
      lifeCycleList: [],
      tableData: [],
      tableHeight: 400,
      tableColumn: [
        {
          prop: 'avatar',
          title: '头像',
          align: 'center',
          formatter: (row) => {
            return (
              <el-image
                style="width: 44px; height: 44px"
                src={row.avatar || this.defaultHearderImage}
                fit="cover"
              ></el-image>
            )
          }
        },
        {
          prop: 'name',
          title: '客户名称',
          align: 'center'
        },
        {
          prop: 'gender',
          title: '性别',
          align: 'center',
          formatter: (row) => {
            return row.gender == 1 ? '男' : row.gender == 2 ? '女' : '未知'
          }
        },
        {
          prop: 'mobile',
          title: '手机号',
          align: 'center'
        },
        {
          prop: 'createTime',
          title: '添加时间',
          align: 'center',
          formatter: (row) => {
            return row.createTime ? row.createTime.slice(0, row.createTime.length - 3) : ''
          }
        },
        {
          prop: '',
          title: '操作',
          align: 'center',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                <el-select
                  v-model={this.settingList[index].customerLifeCycleId}
                  placeholder="未设置"
                  clearable
                  size="small"
                >
                  {this.lifeCycleList.map((item) => (
                    <el-option label={item.label} value={item.value}></el-option>
                  ))}
                </el-select>
              </div>
            )
          }
          // formatter: function () {
          //   console.log(arguments)
          // }
        }
      ],
      pageData: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      }
    }
  },
  methods: {
    // ---页面渲染函数---
    inputTagsSuccess(val) {
      this.search.userId = val
      this.searchInput()
    },
    getTableHeight() {
      const PADDING = 20,
        NAVBUTTON = 56,
        PAGEBUTTON = 52
      this.tableHeight =
        window.innerHeight - document.getElementById('tableList').offsetTop - PADDING - NAVBUTTON - PAGEBUTTON
    },
    onSizeChange(val) {
      this.pageData.pageSize = val
      this.pageData.pageNum = 1
    },
    onPageChange(val) {
      this.pageData.pageNum = val
    },
    setLifeCycleList() {
      console.log(this.settingList)
      let options = []
      this.settingList.forEach((item) => {
        if (item.customerLifeCycleId == '') {
          return
        }
        options.push(item)
      })
      if (!options.length) {
        return this.$message.warning('请选择需要修改的成员生命周期')
      }
      this.functions('setCustomerLifeCycle', options, (res) => {
        this.$message.success('设置生命周期成功')
        this.getCustomerList({})
      })
    },
    // 搜索
    searchInput() {
      // name: this.listSearch.remarks, // 备注名
      // mobile: this.listSearch.mobile, // 手机号
      // userId: userId, // 成员 _拼接
      // tagId: tagId // 企业标签
      console.log(this.search)
      let options = {
        name: this.search.name,
        mobile: this.search.mobile,
        userId: this.search.userId.join('_'),
        tagId: this.search.tagId.join('_')
      }
      console.log(options)
      this.getCustomerList(options)
    },
    // ---数据获取函数---
    // 获取企业标签
    getEnterTagList() {
      this.functions('getEnterTagList', '', (res) => {
        console.log(res)
        this.tagsList = res.data.data
        console.log(this.tagsList)
      })
    },
    // 获取客户列表
    getCustomerList(options) {
      this.isLoading = true
      this.functions('getNoLifeCycleStatusUsers', options, (res) => {
        this.tableData = res.data.data
        let newList = []
        this.tableData.forEach((item) => {
          let obj = {
            customerId: item.id,
            customerLifeCycleId: ''
          }
          newList.push(obj)
        })
        this.settingList = newList
        this.isLoading = false
      })
    },
    // 获取客户生命周期
    getLifeCycleList() {
      this.functions('getCustomerLifeCycleList', '', (res) => {
        // console.log('生命周期',res)
        let list = res.data.data.list
        let newList = []
        list.forEach((item) => {
          let obj = {
            value: item.id,
            label: item.cycleName
          }
          newList.push(obj)
        })
        this.lifeCycleList = newList
        console.log('生命周期', this.lifeCycleList)
      })
    }
  },
  created() {
    this.getEnterTagList()
    this.getCustomerList({})
    this.getLifeCycleList()
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
    })
  }
}
</script>

<style lang="scss" scoped>
.main {
  background-color: #fff;
  .search {
    padding: 20px;
    display: flex;
    &::v-deep .el-form-item {
      margin-bottom: 0;
    }
    .btns {
      margin-top: 3px;
    }
    .form {
      display: flex;
      justify-content: flex-end;
      margin-left: auto;
    }
  }
  .table {
    padding: 0 20px;
  }
  .table-page {
    padding: 0 10px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
}
</style>
