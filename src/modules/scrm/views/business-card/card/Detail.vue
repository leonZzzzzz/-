<template>
  <div class="department-div">
    <GoBack :title="'返回'"></GoBack>
    <div class="department-div-top">
      <div><el-button type="primary" size="small" @click="editOpen">修改信息</el-button></div>
      <div class="test-div">
        <div class="test-img-left">
          <img :src="customerData.avatar" alt="" />
        </div>
        <div class="test-img-right">
          <div class="test-container">
            <div class="test-introduct">
              <div class="introduct-div">
                <!-- <div class="div-first">{{ customerData.name }}</div> -->
                <div :class="customerData.name && customerData.name.length >= 6 ? 'div-first-active' : 'div-first'">
                  {{ customerData.name | isSplice }}
                  <span class="div-second">{{ customerData.position || '--' }}</span>
                </div>
                <!-- <div class="div-second">{{ customerData.position || '--' }}</div> -->
              </div>

              <!-- <div>{{ item.position }}</div> -->
            </div>
            <!-- <div class="test-top">
              {{ customerData.name }}
            </div>
            <div class="test-introduct">
              <div class="test-introContent">{{ customerData.position }}</div>
              <div class="test-introTitle"><i class="el-icon-user"></i></div>
            </div> -->
            <div class="test-address">
              <div class="test-address-content">{{ customerData.address }}</div>
              <div class="test-address-Title"><i class="el-icon-location-outline"></i></div>
            </div>
            <div class="test-tel">
              <div class="test-address-content">{{ customerData.phone }}</div>
              <div class="test-address-Title"><i class="el-icon-phone-outline"></i></div>
            </div>
            <div class="test-email">
              <div class="test-address-content">{{ customerData.email }}</div>
              <div class="test-address-Title"><i class="el-icon-message"></i></div>
            </div>
            <div class="test-zan">
              <span>置顶名片 {{ customerData.topQuantity }}</span>
            </div>
            <div class="test-zan-two">
              <span>浏览记录 {{ customerData.viewPersonQuantity }}</span>
              <span>点赞数量 {{ customerData.phraseQuantity }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TabButton :navList="navList" @change="changeNav"></TabButton>
    <div style="padding: 20px; background-color: #ffffff">
      <div class="class-table">
        <el-table
          :data="listData"
          width="100%"
          id="table"
          class="el-table"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          :height="height"
        >
          <el-table-column label="头像" align="center">
            <template slot-scope="scope">
              <div>
                <img
                  style="width: 50px; height: 50px; border-radius: 5px"
                  :src="scope.row.headImage | isImage"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="名称" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.name | isMobile }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="手机号" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.mobile || scope.row.memberMobile || '暂无' }}</div>
              <!-- <div v-else>{{ scope.row.memberMobile || '暂无' }}</div> -->
            </template>
          </el-table-column>
          <el-table-column label="性别" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.gender | isGender }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="class-pagination">
        <com-pagination :page="categoryPage" @sizeChange="onSizeChange" @pageChange="onPageChange"> </com-pagination>
      </div>
    </div>
    <com-dialog :config="editDialog.config" @closeDialog="closeDialog">
      <el-form label-position="right" label-width="80px">
        <el-form-item label="姓名" :required="true">
          <el-input placeholder="请输入姓名" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="职务" :required="true">
          <el-input placeholder="请输入职务" v-model="model.position"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :required="true">
          <el-input placeholder="请输入邮箱" v-model="model.email"></el-input>
        </el-form-item>
        <!-- <el-form-item label="序号" :required="true">
          <el-input placeholder="请输入序号" v-model="model.sortNumber"></el-input>
        </el-form-item> -->
      </el-form>
      <div class="customer-btn">
        <div>
          <el-button @click="closeNoticeDialog()">取消</el-button>
          <el-button type="primary" @click="sumbitNotice()">保存</el-button>
        </div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack'
import ComDialog from '../../../components/common/ComDialog'
import TabButton from '../../../components/components/TabButton.vue'
import ComPagination from '../../../components/common/ComPagination.vue'
export default {
  components: { GoBack, ComDialog, TabButton, ComPagination },
  data() {
    return {
      customerData: [],
      editDialog: {
        config: {
          width: '600px',
          title: '修改信息',
          visible: false
        }
      },
      model: {
        id: '',
        name: '',
        position: '',
        email: '',
        sortNumber: 0
      },
      navList: [
        { name: '浏览记录', isActive: true },
        { name: '置顶名片', isActive: false },
        { name: '屏蔽名片', isActive: false }
      ],
      height: 400,
      listData: [],
      categoryPage: {
        pageSize: 15,
        pageNum: 1,
        total: 0
      },
      index: 0
    }
  },
  methods: {
    //分页的方法
    onSizeChange(val) {
      this.categoryPage.pageSize = val
      this.categoryPage.pageNum = 1
      if (this.index == 0) {
        this.getViewPage()
        console.log('1111')
        return
      }
      if (this.index == 1) {
        console.log('2222')
        this.getTopPage()
        return
      }
      if (this.index == 2) {
        console.log('333')
        this.hidePage()
        return
      }
    },
    onPageChange(val) {
      this.categoryPage.pageNum = val
      if (this.index == 0) {
        this.getViewPage()
        console.log('1111')
        return
      }
      if (this.index == 1) {
        console.log('2222')
        this.getTopPage()
        return
      }
      if (this.index == 2) {
        console.log('333')
        this.hidePage()
        return
      }
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
    changeNav(val) {
      this.index = val
      this.categoryPage = {
        pageSize: 15,
        pageNum: 1,
        total: 0
      }
      if (val == 0) {
        this.getViewPage()
        return
      }
      if (val == 1) {
        this.getTopPage()
        return
      }
      if (val == 2) {
        this.hidePage()
        return
      }
    },
    sumbitNotice() {
      if (this.model.name == '') {
        this.$message.warning('姓名不能为空')
        return
      }
      if (this.model.position == '') {
        this.$message.warning('职务不能为空')
        return
      }
      if (this.model.email == '') {
        this.$message.warning('邮箱不能为空')
        return
      }
      this.updateCropBussiness()
    },

    closeNoticeDialog() {
      this.editDialog.config.visible = false
    },
    updateCropBussiness() {
      this.$http.updateCropBussiness(this.model).then(() => {
        this.$message.success('保存成功')
        this.editDialog.config.visible = false
        this.model = {
          id: '',
          name: '',
          position: '',
          email: '',
          sortNumber: 0
        }
        this.getCropBussinessDetail()
      })
    },
    editOpen() {
      this.model.id = this.customerData.id
      this.model.name = this.customerData.name
      this.model.position = this.customerData.position
      this.model.email = this.customerData.email
      // this.model.sortNumber = this.customerData.sortNumber
      this.editDialog.config.visible = true
    },
    closeDialog() {
      this.editDialog.config.visible = false
    },
    getCropBussinessDetail() {
      this.$http.getCropBussinessDetail({ id: this.$route.query.id }).then(res => {
        this.customerData = res.data.data
      })
    },
    getTopPage() {
      this.listData = []
      let params = {
        pageSize: this.categoryPage.pageSize,
        pageNum: this.categoryPage.pageNum,
        id: this.$route.query.id
      }
      this.$http.getTopPage(params).then(res => {
        this.listData = res.data.data.list
        this.categoryPage.total = res.data.data.total
      })
    },
    hidePage() {
      this.listData = []
      let params = {
        pageSize: this.categoryPage.pageSize,
        pageNum: this.categoryPage.pageNum,
        id: this.$route.query.id
      }
      this.$http.hidePage(params).then(res => {
        this.listData = res.data.data.list
        this.categoryPage.total = res.data.data.total
      })
    },
    getViewPage() {
      this.listData = []
      let params = {
        pageSize: this.categoryPage.pageSize,
        pageNum: this.categoryPage.pageNum,
        id: this.$route.query.id
      }
      this.$http.getViewPage(params).then(res => {
        this.listData = res.data.data.list
        this.categoryPage.total = res.data.data.total
      })
    }
  },
  created() {
    this.getCropBussinessDetail()
    this.getViewPage()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  },
  filters: {
    isImage(option) {
      if (option == null) {
        return (option = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png')
      }
      if (option != null) {
        return option
      }
    },
    isGender(option) {
      if (option == null) {
        return (option = '暂无')
      }
      if (option == 0) {
        return (option = '未知')
      }
      if (option == 1) {
        return (option = '男')
      }
      if (option == 2) {
        return (option = '女')
      }
    },
    isMobile(option) {
      if (option == null) {
        return (option = '暂无')
      } else {
        return option
      }
    },

    isSplice(options) {
      if (options.length > 14) {
        return options.substring(0, 14) + '...'
      } else {
        return options
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.department-div {
  width: 100%;
  height: 100%;
  position: relative;
  .department-div-top {
    .test-div {
      margin: 20px 0;
      float: left;
      width: 30%;
      // margin: 0 auto;
      display: flex;
      .test-img-left {
        clip-path: polygon(0 0, 100% 0, 70% 100%, 0% 100%);

        img {
          box-shadow: -4px 3px 5px 2px rgba($color: #333, $alpha: 0.2);
          border-top-left-radius: 15px;
          border-bottom-left-radius: 15px;
          width: 200px;
          height: 200px;
        }
      }
      .test-img-right {
        margin-left: -50px;
        clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);
        .test-container {
          background-color: #fff;
          box-shadow: 4px 3px 5px 2px rgba($color: #333, $alpha: 0.2);
          width: 200px;
          height: 200px;
          border-top-right-radius: 15px;
          border-bottom-right-radius: 15px;
          .test-top {
            text-align: right;
            padding: 10px 20px;
            font-size: 16px;
            color: #616161;
          }
          .test-introduct {
            margin-top: -1px;
            width: 220px;
            height: 50px;
            background-image: url(../../../images/card-bg.png);
            display: flex;
            .introduct-div {
              margin-left: auto;
              width: 140px;
              overflow: hidden;
              .div-first {
                margin-top: 10px;
                color: #353535;
                font-weight: bold;
                line-height: 20px;
              }
              .div-first-active {
                width: 115px;
                margin-top: 10px;
                color: #353535;
                font-weight: bold;
                line-height: 20px;
                font-size: 12px;
              }
              .div-second {
                color: #737373;
                font-size: 12px;
                // white-space: nowrap;
                // overflow: hidden;
                // text-overflow: ellipsis;
              }
            }
          }
          // .test-introduct {
          //   display: flex;
          //   color: #8d8e97;
          //   font-size: 1px;
          //   padding: 0 20px 0 60px;
          //   .test-introContent {
          //     flex: 1;
          //     text-align: right;
          //     padding-right: 5px;
          //     // margin-right: 10px;
          //     overflow: hidden;
          //     text-overflow: ellipsis;
          //     display: -webkit-box;
          //     -webkit-line-clamp: 1;
          //     -webkit-box-orient: vertical;
          //   }
          //   .test-introTitle {
          //     margin-left: auto;
          //     font-size: 14px;
          //   }
          // }
          .test-address {
            margin-top: 10px;
            display: flex;
            color: #8d8e97;
            font-size: 12px;
            text-align: left;
            padding: 0 20px 0 60px;

            .test-address-content {
              flex: 1;
              text-align: right;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .test-address-Title {
              margin-left: auto;
              font-size: 14px;
              margin-left: 5px;
            }
          }
          .test-tel {
            margin-top: 10px;
            display: flex;
            color: #8d8e97;
            font-size: 12px;
            text-align: right;
            padding: 0 20px 0 50px;
            .test-address-content {
              margin-left: auto;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .test-address-Title {
              font-size: 14px;
              margin-left: 5px;
            }
          }
          .test-email {
            margin: 10px 0;
            display: flex;
            color: #8d8e97;
            font-size: 12px;
            text-align: right;
            padding: 0 20px 0 30px;
            .test-address-content {
              line-height: 12px;
              height: 25px;
              margin-left: auto;
              white-space: normal;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
            }
            .test-address-Title {
              font-size: 14px;
              margin-left: 5px;
            }
          }
          .test-zan {
            color: #8d8e97;
            margin-left: 20px;
            font-size: 12px;
            padding: 5px 20px 5px 0;
            text-align: right;
            span {
              border: 1px solid #8d8e97;
              padding: 2px;
            }
          }
          .test-zan-two {
            color: #8d8e97;
            padding: 5px 0;
            font-size: 12px;
            margin-left: 20px;
            margin-right: 20px;
            text-align: right;
            span {
              padding: 2px;
              border: 1px solid #8d8e97;
              margin-left: 5px;
              i {
                margin-right: 2px;
                color: #294a7b;
              }
            }
          }
        }
      }
    }
  }
  .title-bar {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    color: #303133;
    position: relative;
    display: flex;
    align-items: center;
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
      left: 0px;
    }
  }
  .department-div-container {
    width: 70%;
    padding: 20px 20px 0;
    box-sizing: border-box;
    ul {
      // max-width: 1000px;
      // display: flex;
      // flex-wrap: wrap;
      li {
        // width: 30%;
        // min-width: 300px;
        font-size: 14px;
        color: #909399;
        margin: 0 20px 30px 0;
        .value {
          .el-tag {
            padding: 0;
            margin: 0;
            padding: 0px 5px;
            cursor: pointer;
            // background-color: black;
          }
          .el-button {
            margin-left: 10px;
          }
        }
      }
    }
  }
  .department-exter-container {
    width: 70%;
    padding: 20px 20px 0;
    box-sizing: border-box;
    ul {
      // max-width: 1000px;
      // display: flex;
      // flex-wrap: wrap;
      li {
        // border: 1px solid red;
        // width: 30%;
        // min-width: 300px;
        font-size: 14px;
        color: #909399;
        margin: 0 20px 10px 0;
        .value {
          .el-tag {
            padding: 0;
            margin: 0;
            padding: 0px 5px;
            cursor: pointer;
            margin-right: 5px;
          }
          .el-button {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
// .customer-container {
//   .el-form {
//     // padding: 10px 0;
//   }
// }
.customer-btn {
  display: flex;
  justify-content: flex-start;
  div {
    margin-left: auto;
  }
}
.textarea-input {
  ::v-deep .el-textarea__inner {
    padding-right: 20px;
  }
  ::v-deep .el-input__count {
    bottom: 1px;
    height: 20px;
    line-height: 20px;
    text-align: right;
    left: 1px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    padding-right: 10px;
    box-sizing: border-box;
  }
}
.selectProgram {
  margin-left: 18px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
.programInfoBox {
  display: flex;
  .updateBtn {
    display: flex;
    align-items: center;
  }
}
.programInfo {
  width: 217px;
  .programInfoContent {
    height: 36px;
    display: flex;
    .name {
      margin-left: 5px;
      line-height: 36px;
      color: #606266;
      font-size: 14px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
    .deleteBtn {
      width: 42px;
      margin-left: auto;
      padding-left: 5px;
      display: none;
    }
    &:hover {
      .deleteBtn {
        display: block;
      }
    }
  }
}
.class-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
</style>
