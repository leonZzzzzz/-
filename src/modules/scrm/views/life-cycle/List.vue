<template>
  <div class="container">
    <div class="navlist-div">
      <TabButton :navList="navList" @change="changeNav"></TabButton>
      <div>
        <el-button type="primary" @click="$router.push('/main/scrm/life-cycle/customerSetting')" size="small"
          >设置客户({{ aNumber }})</el-button
        >
      </div>
    </div>

    <div class="life-cycle-info">
      <div class="top_search">
        <div class="info-top">
          <el-button type="primary" @click="goToDetailPage" size="small">生命周期设置</el-button>
          <el-button type="primary" @click="exportExcel" size="small">导出客户（{{ expordNumber }}位）</el-button>
        </div>
        <div class="info-search">
          <div class="search-item">
            <div class="search-label">备注名</div>
            <div class="search-input">
              <el-input
                size="small"
                v-model="search.remarks"
                placeholder="请输入客户备注名"
                @input="onSearch"
                clearable
              ></el-input>
            </div>
          </div>
          <div class="search-item">
            <div class="search-label">手机号</div>
            <div class="search-input">
              <el-input
                size="small"
                v-model="search.mobile"
                placeholder="请输入手机号"
                @input="onSearch"
                clearable
              ></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="life-cycle-list-none" v-if="lifeCycleUsers.length == 0">
      <div class="life-cycle-none">暂无数据</div>
    </div>
    <div class="life-cycle-list" id="cycleList" :style="{ height: listHeight }">
      <div class="list-group" v-for="(item, index) in lifeCycleUsers" :key="index">
        <div class="group-msg">
          <div class="msg-name">{{ item.cycleName }}</div>
          <div class="msg-desc">共{{ item.size }}位</div>
        </div>
        <div class="group-content">
          <div class="group-content-wrap">
            <div class="user-item" v-for="(obj, idx) in item.users" :key="idx">
              <div class="item-top">
                <div class="top-left">
                  <img :src="obj.avatar" class="left-img" />
                  <div class="left-info">
                    <div>{{ obj.name }}</div>
                    <!-- <div>@微信</div> -->
                  </div>
                </div>
                <div class="top-right">
                  <el-popover placement="bottom" trigger="click" popper-class="myPopover">
                    <div class="right-menu">
                      <div class="menu-item" @click="goToCustomerDetail(obj)">详情</div>
                      <div class="menu-item" @click="showMoveDialog(obj)">移动</div>
                    </div>
                    <el-button type="text" icon="el-icon-more" slot="reference"></el-button>
                  </el-popover>
                </div>
              </div>
              <div class="user-content">
                <div class="user-msg"><span> 备注名:</span>{{ obj.remarks }}</div>
                <div class="user-msg"><span> 上次跟进:</span>{{ obj.lastTime | allTableTimefilters }}</div>
                <div class="user-msg"><span> 跟进成员:</span>{{ obj.lastName }}</div>
              </div>
            </div>
          </div>
          <div class="no-more" v-if="item.users.length > 0">已到底了</div>
          <div class="no-data" v-else>暂无数据</div>
        </div>
      </div>
    </div>

    <simple-dialog
      :config="moveDialog.config"
      :showClose="false"
      @closeDialog="closeMoveDialog"
      @handleConfirm="moveCustomer"
    >
      <div class="move-dialog">
        <div class="select-item">
          <div class="select-label">选择阶段</div>
          <div class="select-content">
            <el-select v-model="selectedCycleId" placeholder="请选择">
              <el-option v-for="item in lifeCycleList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </simple-dialog>
  </div>
</template>

<script>
import TabButton from '../../components/components/TabButton.vue'
import SimpleDialog from '../../components/common/SimpleDialog'
import ComTable from '../../components/common/ComTable'
export default {
  components: {
    SimpleDialog,
    ComTable,
    TabButton
  },
  data() {
    return {
      lifeCycleUsers: [],
      count: 0,
      search: {
        remarks: '', // 备注名
        mobile: ''
      },
      moveDialog: {
        config: {
          width: '500px',
          title: '移动客户',
          position: 'center',
          visible: false
        }
      },
      lifeCycleList: [],
      selectedCycleId: '',
      selectedCustomerId: '',
      listHeight: '400px', // 列表高度
      navList: [],
      navCategoryList: [],
      FirstCategoryId: '',
      listAll: [],
      FirstCategoryName: '',
      navTabIndex: 0,
      aNumber: 0,
      expordNumber: 0,
      expordId: ''
    }
  },
  created() {
    this.getCustomerCategoryPage()
    this.getLifeCycleUsers()
    this.getLifeCycleList()
    this.getCustomerCount()
    this.getCustomerList()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullListHeight()
      window.onresize = () => {
        this.fullListHeight()
      }
    })
  },
  destroyed() {
    window.onresize = ''
  },
  methods: {
    changeNav(val) {
      console.log(this.navList)
      this.FirstCategoryId = this.navList[val].categoryId
      this.FirstCategoryName = this.navList[val].name
      this.navTabIndex = val
      this.getCycleList()
    },
    fullListHeight() {
      const PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.listHeight =
        window.innerHeight -
        document.querySelector('#cycleList').offsetTop -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT +
        'px'
    },
    // 获取生命周期客户列表
    getLifeCycleUsers() {
      if (this.listAll == '') {
        this.listAll = this.listAll.join(',')
      }

      this.lifeCycleUsers = []
      let list = []
      this.expordNumber = 0
      this.$http.getCustomerLifeCycleUsers(this.search).then((res) => {
        let list = res.data.data
        list.forEach((item, index) => {
          if (this.listAll.includes(item.cycleId)) {
            this.expordNumber = this.expordNumber + item.size
            this.lifeCycleUsers.push(item)
          }
        })
      })
    },
    getCustomerCount() {
      this.$http.getLifeCycleCustomerCount().then((res) => {
        this.count = res.data.data.count
      })
    },
    getCustomerCategoryPage() {
      this.navList = []
      this.navCategoryList = []
      let data = []
      let params = {
        pageSize: 20,
        pageNum: 1
      }
      this.$http.getCustomerCategoryPage(params).then((res) => {
        data = res.data.data.list
        console.log('不知道是啥', data)
        data.forEach((item) => {
          this.navList.push({ name: item.name, isActive: false, categoryId: item.id })
        })
        let index = sessionStorage.getItem('navTabIndex')
        console.log(index, typeof index)
        if (index) {
          index = Number(index)
        } else {
          index = 0
        }
        this.navList[index].isActive = true
        this.FirstCategoryId = this.navList[index].categoryId
        this.FirstCategoryName = this.navList[index].name
        this.getCycleList()
      })
    },
    getCycleList() {
      let list = []
      this.listAll = []
      let joinList = ''
      let params = {
        pageSize: 999,
        pageNum: 1,
        categoryId: this.FirstCategoryId
      }
      this.$http.getCustomerLifeCycleList(params).then((res) => {
        list = res.data.data.list
        list.forEach((item) => {
          this.listAll.push(item.id)
        })
        // this.listAll = this.listAll.join(',')
        this.getLifeCycleUsers()
      })
    },
    // 获取生命周期阶段列表
    getLifeCycleList() {
      this.$http.getCustomerLifeCycleList().then((res) => {
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
      })
    },
    onSearch() {
      this.getLifeCycleUsers()
    },
    goToCustomerDetail(obj) {
      this.$openNewPage({path: `/main/scrm/customer-management/customer/detail?id=${obj.customerId}`})
    },
    showMoveDialog(obj) {
      this.selectedCycleId = ''
      this.selectedCustomerId = obj.id
      this.moveDialog.config.visible = true
    },
    // 移动客户
    moveCustomer() {
      if (this.selectedCycleId === '') {
        this.$message.warning('请选择阶段')
      } else {
        let params = {
          id: this.selectedCustomerId,
          customerLifeCycleId: this.selectedCycleId
        }
        this.$http.moveUserToLifeCycle(params).then(() => {
          this.$message.success('移动成功')
          this.moveDialog.config.visible = false
          this.getLifeCycleUsers()
        })
      }
    },
    // 关闭移动客户弹窗
    closeMoveDialog() {
      this.moveDialog.config.visible = false
    },
    exportExcel() {
      console.log('导出id', this.FirstCategoryId)
      location.href = `${this.baseUrl}/api/admin/v1/customer_life_cycle/export?categoryId=${this.FirstCategoryId}`
    },
    goToDetailPage() {
      this.$openNewPage({path:
        `/main/scrm/life-cycle/detail?categoryId=${this.FirstCategoryId}&catergoryName=${this.FirstCategoryName}`
      })
      sessionStorage.setItem('navTabIndex', this.navTabIndex)
    },
    getCustomerList() {
      this.functions('getNoLifeCycleStatusUsers', '', (res) => {
        this.aNumber = res.data.data.length
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-size: 14px;
  .life-cycle-info {
    padding: 20px;
    box-sizing: border-box;
    background-color: #ffffff;
    .info-steps {
      max-width: 1000px;
      margin: 20px auto 40px;
      .icon-cycle {
        color: #294a7b;
        background: #294a7b;
        border-radius: 50%;
      }
    }
    .top_search {
      display: flex;
      .info-top {
        height: 32px;
        display: flex;
        align-items: center;
        .top-left {
          display: flex;
          align-items: center;
          .edit-icon {
            font-size: 18px;
            color: #1296db;
            margin-left: 10px;
            cursor: pointer;
          }
          .left-info {
            span {
              color: #1296db;
              cursor: pointer;
            }
          }
        }
        .top-right {
          display: flex;
          align-items: center;
          .right-msg {
            color: #ff0000;
            margin-right: 20px;
          }
        }
        .el-button--small {
          height: 32px;
        }
      }
      .info-search {
        display: flex;
        flex-flow: wrap;
        margin-left: auto;
        .search-item {
          display: flex;
          align-items: center;
          margin-left: 20px;
          .search-label {
            margin-right: 10px;
            color: #606266;
          }
          .search-input {
            width: 250px;
          }
        }
      }
    }
  }
  .life-cycle-list {
    display: flex;
    margin-top: 20px;
    overflow: auto;

    // background-color: #ffffff;
    .list-group {
      width: 300px;
      min-width: 300px;
      padding: 20px 0;
      box-sizing: border-box;
      margin-right: 10px;
      background-color: #ebeef5;
      .group-msg {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 0 20px;
        .msg-name {
          font-size: 16px;
          color: #294a7b;
        }
        .msg-desc {
          font-size: 12px;
          color: #7f7f7f;
        }
      }
      .group-content {
        background-color: #ebeef5;
        padding-bottom: 20px;
        .group-content-wrap {
          background-color: #ebeef5;
          padding: 0 20px;
          .user-item {
            padding: 14px;
            box-sizing: border-box;
            background-color: #ffffff;
            margin-bottom: 20px;
            border-radius: 10px;
            .item-top {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 10px;
              .top-left {
                display: flex;
                align-items: center;
                .left-img {
                  width: 30px;
                  height: 30px;
                  margin-right: 10px;
                }
              }
            }
            .user-content {
              font-size: 14px;
              color: #7f7f7f;
              .user-msg {
                padding: 5px 0;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                span {
                  padding-right: 4px;
                  display: inline-block;
                  width: 60px;
                  text-align: justify;
                }
              }
            }
          }
        }
        .no-more {
          margin-top: 20px;
          text-align: center;
          color: #7f7f7f;
          font-size: 12px;
        }
        .no-data {
          margin-top: 20px;
          text-align: center;
          color: #7f7f7f;
          font-size: 12px;
        }
      }
    }
  }
}
.right-menu {
  display: flex;
  flex-direction: column;
  text-align: center;
  .menu-item {
    color: #294a7b;
    cursor: pointer;
    line-height: 24px;
  }
}
.move-dialog {
  padding: 20px;
  .select-item {
    display: flex;
    align-items: center;
    justify-content: center;
    .select-label {
      margin-right: 10px;
    }
    .select-content {
      width: 300px;
    }
  }
}
.setting-dialog {
  .search-content {
    display: flex;
    flex-flow: wrap;
    .search-item {
      display: flex;
      align-items: center;
      margin-right: 20px;
      margin-bottom: 20px;
      .search-label {
        margin-right: 10px;
      }
      .search-input {
        width: 250px;
      }
    }
  }
}
.query-table-title:hover {
  border: 1px solid #a2a4a8;
}
.query-table-title::-webkit-scrollbar {
  display: none;
}
.query-table-title {
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
    color: #c0c4cc;
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
.query-table-select {
  background-color: #e4e4e4;
  margin-left: 10px;
  border-radius: 5px;
  padding: 2px 5px;
  color: #818181;
}
.search-tag {
  margin: 0 4px;
}
.tag-dialog {
  width: 100%;
  max-height: 450px;
  overflow: auto;
  .selected-content {
    display: flex;
    margin-bottom: 20px;
    .content-left {
      margin-right: 20px;
      line-height: 34px;
    }
    .content-right {
      display: flex;
      flex-wrap: wrap;
      .selected-tag {
        display: flex;
        align-items: center;
        height: 34px;
        border-radius: 17px;
        padding: 0 10px;
        background-color: #f2f2f2;
        margin-right: 10px;
        margin-bottom: 10px;
        .el-icon-close {
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
  }
  .tag-list {
    .tag-group {
      margin-bottom: 20px;
      .group-title {
        margin-bottom: 10px;
      }
      .group-content {
        width: 100%;
        border: 1px solid #d7d7d7;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        .tag-item {
          height: 34px;
          border-radius: 17px;
          padding: 0 10px;
          background-color: #f2f2f2;
          margin-right: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 30px;
          cursor: pointer;
        }
        .active {
          background-color: #294a7b;
          color: #ffffff;
        }
      }
    }
  }
}
::v-deep .icon-cycle {
  font-size: 20px !important;
  color: #294a7b;
  background: #294a7b;
  border-radius: 50%;
}
::v-deep .el-step__title {
  color: #7f7f7f;
  font-size: 14px;
}
::v-deep .el-button--small {
  height: 30px;
}
::v-deep .el-select {
  width: 100%;
}
</style>
<style lang="scss">
.myPopover {
  width: 70px;
  min-width: 70px;
  max-width: 70px;
}
.life-cycle-list-none {
  display: flex;
  margin-top: 20px;
  width: 100%;
  .life-cycle-none {
    margin: 0 auto;
    color: #606266;
  }
}
.navlist-div {
  display: flex;
  justify-content: space-between;
}
</style>
