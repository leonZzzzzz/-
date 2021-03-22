<template>
  <div class="container">
    <!-- 顶部导航 -->
    <div class="top_nav">
      <ul>
        <li
          v-for="(item, index) in menus"
          :key="index"
          :class="{
            active: item.isActive,
            borderRight: index == 0 && menus[1].isActive,
            borderLeft: index == menus.length - 1 && menus[menus.length - 2].isActive
          }"
          @click="tabChange(item, index)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
    <div class="main_content">
      <!-- <div class="tab-menus">
        <div
          class="tab-item"
          v-for="(item, index) in menus"
          :key="index"
          :class="item.value === activeTab ? 'tab-active' : ''"
          @click="tabChange(item)"
        >
          {{ item.label }}
        </div>
      </div> -->
      <div class="tab-pane" v-if="activeTab === 'store'">
        <div class="top-operation" style="height: 32px">
          <el-button type="primary" size="small" @click="showAddDialog">添加店铺</el-button>
          <div class="operation-left">
            <div class="span-l">
              侧边栏开关
              <div class="tips">
                <el-tooltip
                  class="item"
                  effect="light"
                  content="可在客户端侧边栏客户详情查看订单记录"
                  placement="top-end"
                >
                  <el-button type="text" icon="el-icon-warning-outline"></el-button>
                </el-tooltip>
              </div>
            </div>
            <el-switch
              v-model="sidebarConfig.value"
              active-color="#294a7b"
              active-value="1"
              inactive-value="0"
              @change="onSwitchChange"
            >
            </el-switch>
          </div>
        </div>
        <div class="common-table-box">
          <com-table :tableData="storeTableData" :column="storeColumn"></com-table>
        </div>
        <div class="common-pagination">
          <com-pagination
            :page="storePage"
            @sizeChange="onStoreSizeChange"
            @pageChange="onStorePageChange"
          ></com-pagination>
        </div>
      </div>
      <div class="tab-pane" v-if="activeTab === 'order'">
        <div class="order-top" style="height: 32px">
          <el-button type="primary" size="small" @click="showImportDialog" style="height: 32px">导入订单</el-button>
          <div class="tips">
            <el-tooltip
              class="item"
              effect="light"
              content="登录淘宝千牛卖家中心，导出淘宝订单再导入"
              placement="top-start"
            >
              <el-button type="text" icon="el-icon-warning-outline"></el-button>
            </el-tooltip>
          </div>
        </div>
        <div class="common-table-box">
          <com-table :tableData="orderTableData" :column="orderColumn"></com-table>
        </div>
        <div class="common-pagination">
          <com-pagination
            :page="orderPage"
            @sizeChange="onOrderSizeChange"
            @pageChange="onOrderPageChange"
          ></com-pagination>
        </div>
      </div>
      <!-- 添加店铺弹窗 -->
      <simple-dialog
        :config="addDialog.config"
        :showClose="false"
        @closeDialog="closeAddDialog"
        @handleConfirm="confirmAddModel"
      >
        <div class="store-dialog">
          <div class="form">
            <el-form :model="addDialog.model" :rules="rules" ref="addModel" label-position="left" label-width="100px">
              <el-form-item label="添加店铺" prop="name">
                <el-input maxlength="32" show-word-limit v-model="addDialog.model.name" placeholder="店铺名称">
                </el-input>
              </el-form-item>
              <el-form-item label="店铺类型" prop="type">
                <el-select v-model="addDialog.model.type" placeholder="选择店铺类型" style="width: 100%">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </simple-dialog>
      <!-- 编辑店铺弹窗 -->
      <simple-dialog
        :config="editDialog.config"
        :showClose="false"
        @closeDialog="closeEditDialog"
        @handleConfirm="confirmEditModel"
      >
        <div class="store-dialog">
          <div class="form">
            <el-form :model="editDialog.model" :rules="rules" ref="editModel" label-position="right" label-width="auto">
              <el-form-item label="添加店铺" prop="name">
                <el-input maxlength="32" show-word-limit v-model="editDialog.model.name" placeholder="店铺名称">
                </el-input>
              </el-form-item>
              <el-form-item label="店铺类型" prop="type">
                <el-select v-model="editDialog.model.type" placeholder="选中店铺类型" style="width: 100%">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </simple-dialog>
      <!-- 删除店铺时提示弹窗 -->
      <com-dialog :config="tipsDialog.config" @closeDialog="closeDelTipsDialog">
        <div class="delete-dialog">
          <div class="dialog-content">
            <div class="cont-title">删除该店铺，店铺的所有订单将一并删除，可选择将订单移动到其他店铺</div>
            <div class="cont-select">
              <div class="select-label">选择店铺</div>
              <el-select v-model="tipsDialog.model.moveId" filterable clearable placeholder="选择店铺">
                <el-option v-for="item in storeOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </div>
            <div class="select-tips">可不做选择，即店铺和订单一并删除</div>
          </div>
          <div class="footer_btns" style="display: flex; justify-content: flex-end; margin-top: 20px">
            <el-button @click="closeDelTipsDialog">取消</el-button>
            <el-button type="primary" @click="deleteStore">确定</el-button>
          </div>
          <!-- <div class="submit-btn" @click="deleteStore">确定删除</div> -->
        </div>
      </com-dialog>
      <!-- 导入订单弹窗 -->
      <com-dialog :config="importDialog.config" @closeDialog="closeImportDialog">
        <div class="import-dialog">
          <div class="import-tips">提示：请下载模板填写订单信息上传。</div>
          <div class="template-download">
            点击下载<el-button type="text" @click="downloadExcel">Excel模板&gt;</el-button>
          </div>
          <div class="form">
            <el-form>
              <el-form-item label="选择店铺" required>
                <el-select v-model="importDialog.model.shopId" filterable clearable placeholder="选择订单所属店铺">
                  <el-option v-for="item in storeOptions" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上传表格" required>
                <div class="upload-box" v-if="importDialog.model.file === ''">
                  <el-upload
                    class="upload-wrap"
                    :action="importDialog.model.action"
                    :show-file-list="false"
                    :on-change="onUploadChange"
                    :auto-upload="false"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  >
                    <div class="tip-text">
                      <p class="icon el-icon-plus"></p>
                    </div>
                  </el-upload>
                  <div class="box-label">上传文件</div>
                </div>
                <div class="file-content" v-else>
                  <i class="el-icon-document"></i>
                  <div class="file-name">{{ importDialog.model.file.name }}</div>
                  <i class="el-icon-close" @click="cancelUploadFile"></i>
                </div>
                <div class="upload-tips">仅支持xls/xlsx格式，文件大小20MB以内</div>
              </el-form-item>
            </el-form>
          </div>
          <div class="footer_btns" style="display: flex; justify-content: flex-end; margin-top: 20px">
            <el-button @click="closeImportDialog">取消</el-button>
            <el-button type="primary" @click="confirmImportData">确定</el-button>
          </div>
          <!-- <div class="submit-btn" @click="confirmImportData">{{ loadingMsg }}</div> -->
        </div>
      </com-dialog>
    </div>
  </div>
</template>

<script>
import ComTable from '../../components/common/ComTable'
import ComPagination from '../../components/common/ComPagination'
import SimpleDialog from '../../components/common/SimpleDialog'
import ComDialog from '../../components/common/ComDialog'
export default {
  components: { ComTable, ComPagination, SimpleDialog, ComDialog },
  data() {
    let nameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入店铺名称'))
      } else {
        callback()
      }
    }
    let typeValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择店铺类型'))
      } else {
        callback()
      }
    }
    return {
      menus: [
        { label: '店铺管理', value: 'store', isActive: true },
        { label: '订单管理', value: 'order', isActive: false }
      ],
      activeTab: 'store',
      sidebarConfig: {},
      storeTableData: [],
      storeColumn: [
        {
          label: '店铺名称',
          minWidth: '150px',
          align: 'center',
          prop: 'name'
        },
        {
          label: '店铺类型',
          minWidth: '150px',
          align: 'center',
          prop: 'type'
        },
        {
          label: '订单量',
          minWidth: '150px',
          align: 'center',
          prop: 'totalOrders'
        },
        {
          label: '操作',
          minWidth: '150px',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
                  编辑
                </el-button>
                <el-button type="text" onClick={this.showDelTipsDialog.bind(this, row)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      storePage: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      orderTableData: [],
      orderColumn: [
        {
          label: '店铺名称',
          minWidth: '150px',
          align: 'center',
          prop: 'shopName'
        },
        {
          label: '导入订单数',
          minWidth: '150px',
          align: 'center',
          prop: 'totalOrder'
        },
        {
          label: '导入时间',
          minWidth: '150px',
          align: 'center',
          prop: 'createTime',
          formatter: (row) => {
            return row.createTime ? row.createTime.slice(0, row.createTime.length - 3) : ''
          }
        },
        {
          label: '导入状态',
          minWidth: '150px',
          align: 'center',
          prop: 'status',
          formatter: (row) => {
            return <div>{row.status === 1 ? '已完成' : '已删除'}</div>
          }
        },
        {
          label: '操作',
          minWidth: '150px',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.deleteOrder.bind(this, row)}>
                  删除订单
                </el-button>
              </div>
            )
          }
        }
      ],
      orderPage: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      addDialog: {
        config: {
          width: '520px',
          title: '添加店铺',
          position: 'center',
          visible: false
        },
        model: {
          name: '',
          type: ''
        }
      },
      editDialog: {
        config: {
          width: '520px',
          title: '编辑店铺',
          position: 'center',
          visible: false
        },
        model: {}
      },
      tipsDialog: {
        config: {
          width: '520px',
          title: '提示',
          position: 'center',
          visible: false
        },
        model: {
          id: '', // 原来店铺的id
          moveId: '' // 转移订单到某个店铺的id
        }
      },
      rules: {
        name: [{ required: true, validator: nameValidator, trigger: 'blur' }],
        type: [{ required: true, validator: typeValidator, trigger: 'blur' }]
      },
      options: [
        { value: '淘宝', label: '淘宝' },
        { value: '天猫', label: '天猫' }
      ],
      importDialog: {
        config: {
          width: '600px',
          title: '导入订单',
          position: 'center',
          visible: false
        },
        model: {
          action: '',
          file: '',
          shopId: '' // 店铺id
        }
      },
      loadingMsg: '确定',
      storeOptions: [] // 店铺列表
    }
  },
  created() {
    this.getStorePage()
    this.getSidebarOrderConfig()
  },
  methods: {
    getStorePage() {
      this.$http.getScrmStorePage(this.storePage).then((res) => {
        this.storeTableData = res.data.data.list
        this.storePage.total = res.data.data.total
      })
    },
    getSidebarOrderConfig() {
      // 开启侧边栏订单记录(is_open_sidebar_order)
      this.$http.getConfigByKey('is_open_sidebar_order').then((res) => {
        this.sidebarConfig = res.data.data || {}
      })
    },
    onSwitchChange() {
      let model = JSON.parse(JSON.stringify(this.sidebarConfig))
      this.$http.updateConifgMessage(model).then(() => {
        this.$message.success('修改成功')
      })
    },
    onStoreSizeChange(val) {
      this.storePage.pageSize = val
      this.storePage.pageNum = 1
      this.getStorePage()
    },
    onStorePageChange(val) {
      this.storePage.pageNum = val
      this.getStorePage()
    },
    tabChange(item, index) {
      // console.log('顶部菜单' + item.value)
      if (this.menus[index].isActive) {
        return
      }
      for (var i = 0; i < this.menus.length; i++) {
        this.menus[i].isActive = false
      }
      this.menus[index].isActive = true
      this.activeTab = item.value
      if (item.value === 'store') {
        this.getStorePage()
      } else if (item.value === 'order') {
        this.getOrderPage()
      }
    },
    showAddDialog() {
      this.addDialog.config.visible = true
    },
    closeAddDialog() {
      this.addDialog.config.visible = false
    },
    confirmAddModel() {
      this.$refs.addModel.validate((valid) => {
        if (valid) {
          this.$http.addScrmStore(this.addDialog.model).then(() => {
            this.$message.success('添加成功')
            this.storePage.pageNum = 1
            this.getStorePage()
            this.addDialog.config.visible = false
            this.$refs.addModel.resetFields()
          })
        }
      })
    },
    showEditDialog(row) {
      this.editDialog.model = Object.assign({}, row)
      this.editDialog.config.visible = true
    },
    closeEditDialog() {
      this.editDialog.config.visible = false
    },
    confirmEditModel() {
      this.$refs.editModel.validate((valid) => {
        if (valid) {
          this.$http.updateScrmStore(this.editDialog.model).then(() => {
            this.$message.success('编辑成功')
            this.getStorePage()
            this.editDialog.config.visible = false
          })
        }
      })
    },
    showDelTipsDialog(row) {
      this.tipsDialog.model.id = row.id
      this.tipsDialog.model.moveId = ''
      this.getStoreList()
      this.tipsDialog.config.visible = true
    },
    deleteStore() {
      this.$http.deleteScrmStore(this.tipsDialog.model).then(() => {
        this.$message.success('删除成功')
        this.getStorePage()
        this.tipsDialog.config.visible = false
      })
    },
    closeDelTipsDialog() {
      this.tipsDialog.config.visible = false
    },
    getStoreList() {
      this.$http.getScrmStoreList().then((res) => {
        let list = res.data.data
        this.storeOptions = list
      })
    },
    getOrderPage() {
      this.$http.getScrmOrderPage(this.orderPage).then((res) => {
        this.orderTableData = res.data.data.list
        this.orderPage.total = res.data.data.total
      })
    },
    onOrderSizeChange(val) {
      this.orderPage.pageSize = val
      this.orderPage.pageNum = 1
      this.getOrderPage()
    },
    onOrderPageChange(val) {
      this.orderPage.pageNum = val
      this.getOrderPage()
    },
    deleteOrder(row) {
      this.$confirm('是否删除该订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteScrmOrder({ id: row.id }).then(() => {
          this.$message.success('删除成功')
          this.getOrderPage()
        })
      })
    },
    showImportDialog() {
      this.getStoreList()
      this.importDialog.model.file = ''
      this.importDialog.model.shopId = ''
      this.loadingMsg = '确定'
      this.importDialog.config.visible = true
    },
    onUploadChange(file) {
      // console.log('文件名称' + file.name)
      const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension1 = fileSuffix === 'xlsx'
      const extension2 = fileSuffix === 'xls'
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!extension1 && !extension2) {
        this.$message.error('文件只能是 xls/xlsx 格式!')
      } else {
        if (!isLt20M) {
          this.$message.error('文件大小不能超过 20MB!')
        } else {
          this.$message.success('上传成功')
          this.importDialog.model.file = file.raw
        }
      }
    },
    cancelUploadFile() {
      this.importDialog.model.file = ''
    },
    downloadExcel() {
      location.href = `${this.imgHost}/attachments/scrm/5f1ee67904214323ad39da3a7717f72b.xls`
    },
    closeImportDialog() {
      this.importDialog.config.visible = false
    },
    confirmImportData() {
      if (this.importDialog.model.file === '') {
        this.$message.error('请上传文件')
      } else if (this.importDialog.model.shopId === '') {
        this.$message.error('请选择店铺')
      } else {
        this.loadingMsg = '订单导入中...'
        let formData = new FormData()
        formData.append('file', this.importDialog.model.file)
        formData.append('shopId', this.importDialog.model.shopId)
        this.$http.importScrmOrder(formData).then((res) => {
          // this.$message.success('导入订单：成功' + res.data.data.successSize + '条，' + '失败' + res.data.data.failureSize + '条')
          this.orderPage.pageNum = 1
          this.getOrderPage()
          this.loadingMsg = '确定'
          this.importDialog.config.visible = false
          let importMsg =
            '导入订单：成功' + res.data.data.successSize + '条，' + '失败' + res.data.data.failureSize + '条'
          this.$confirm(importMsg, '提示', {
            showCancelButton: false,
            confirmButtonText: '确定',
            type: 'success'
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
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
.main_content {
  background-color: #ffffff;
  padding: 20px;
}
.tab-menus {
  display: flex;
  margin-top: 20px;
  .tab-item {
    padding: 0 10px 20px 10px;
    margin-right: 40px;
    border-bottom: 2px solid #ffffff;
    color: #aaaaaa;
    cursor: pointer;
  }
  .tab-active {
    color: #294a7b;
    border-bottom: 2px solid #294a7b;
  }
}
.top-operation {
  display: flex;
  align-items: center;
  .operation-left {
    margin-left: 20px;
    font-size: 14px;
    color: #606266;
    margin-left: auto;
    display: flex;
    align-items: center;
    .span-l {
      display: flex;
      align-items: center;
      margin-right: 10px;
      .tips {
        margin-left: 5px;
      }
    }
    .span-r {
      margin-left: 10px;
    }
  }
}
.order-top {
  display: flex;
  color: #7f7f7f;
  // height: 32px;
  .tips {
    margin-left: 10px;
  }
}
.common-table-box {
  margin-top: 20px;
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
.store-dialog {
}
.delete-dialog {
  .dialog-content {
    .cont-title {
      margin-top: 10px;
      // text-align: center;
    }
    .cont-select {
      display: flex;
      align-items: center;
      // justify-content: center;
      margin-top: 30px;
      .select-label {
        margin-right: 20px;
      }
    }
    .select-tips {
      font-size: 12px;
      color: #aaaaaa;
      margin-top: 10px;
      margin-left: 76px;
    }
  }
}
.import-dialog {
  // padding: 0 20px;
  box-sizing: border-box;
  .import-tips {
    color: #aaaaaa;
  }
  .form {
    // width: 400px;
    // margin: 20px auto;
    .upload-box {
      width: 100px;
      display: flex;
      flex-direction: column;
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
      .box-label {
        text-align: center;
      }
    }
    .file-content {
      display: flex;
      align-items: center;
      .el-icon-document {
        font-size: 20px;
        color: #294a7b;
        margin-right: 5px;
      }
      .file-name {
        max-width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .el-icon-close {
        font-size: 16px;
        margin-left: 10px;
        cursor: pointer;
        color: #294a7b;
      }
    }
    .upload-tips {
      margin-left: 80px;
      color: #aaaaaa;
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
  margin: 30px auto 20px auto;
  border-radius: 3px;
  cursor: pointer;
}
::v-deep .el-select--medium {
  width: 300px;
}
</style>
