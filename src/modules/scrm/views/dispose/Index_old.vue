<template>
  <!-- 勿删 -->
  <div class="enterprise">
    <!-- <el-button class="addQyBtn" type="primary" @click="addQyNumeber()" size="small">添加企业号</el-button>
    <QcTable ref="table" :option="option" :column="column" v-if="Refresh"></QcTable> -->

    <!-- 顶部导航 -->
    <div class="top_nav">
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
    </div>
    <div class="middle_content">
      <div class="enterconfigure_list" v-show="navBarFlag == 0">
        <div>
          <el-button class="addQyBtn" type="primary" @click="addQyNumeber()" size="small">添加企业号</el-button>
        </div>
        <div class="table">
          <template>
            <el-table
              :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
              :data="enterpriseTableData"
              style="width: 100%"
              :height="height"
              id="table"
              v-loading="isEnterpriseLoading"
            >
              <el-table-column type="index" label="序号" align="center"> </el-table-column>
              <el-table-column label="企业名称" prop="name" align="center"></el-table-column>
              <el-table-column label="企业号ID" prop="cropId" align="center"></el-table-column>
              <el-table-column label="企业号应用ID" prop="agentId" align="center"> </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" @click="showEditDialog(scope.row)">修改</el-button>
                    <el-button type="text" @click="deleteEnter(scope.row)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <div class="page">
          <div class="pagination-count">
            <span class="count">共：{{ enterpriseSearch.total }}&nbsp;条数据</span>
          </div>
          <el-pagination
            @size-change="enterpriseSearchOnSizeChange"
            @current-change="enterpriseSearchOnPageChange"
            :page-sizes="[15, 30, 50]"
            :page-size="enterpriseSearch.pageSize"
            :current-page="enterpriseSearch.pageNum"
            :total="enterpriseSearch.total"
            layout="prev, pager, next, sizes"
            background
            style="margin-right: -26px"
          ></el-pagination>
        </div>
      </div>
      <div class="application_list" v-show="navBarFlag == 1">
        <div>
          <el-button class="addQyBtn" type="primary" @click="applitionAdd()" size="small">添加应用授权</el-button>
        </div>
        <div class="table">
          <template>
            <el-table
              :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
              :data="applicationTableData"
              style="width: 100%"
              :height="height"
              id="table"
              v-loading="isEnterpriseLoading"
            >
              <el-table-column type="index" label="序号" align="center"> </el-table-column>
              <el-table-column label="应用名称" prop="name" align="center"></el-table-column>
              <el-table-column label="应用ID" prop="cropId" align="center"></el-table-column>
              <el-table-column label="应用secret" prop="agentId" align="center"> </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" @click="showEditAppDialog(scope.row)">修改</el-button>
                    <el-button type="text" @click="deleteAppEnter(scope.row)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <div class="page">
          <div class="pagination-count">
            <span class="count">共：{{ enterpriseSearch.total }}&nbsp;条数据</span>
          </div>
          <el-pagination
            @size-change="enterpriseSearchOnSizeChange"
            @current-change="enterpriseSearchOnPageChange"
            :page-sizes="[15, 30, 50]"
            :page-size="enterpriseSearch.pageSize"
            :current-page="enterpriseSearch.pageNum"
            :total="enterpriseSearch.total"
            layout="prev, pager, next, sizes"
            background
            style="margin-right: -26px"
          ></el-pagination>
        </div>
      </div>
    </div>

    <com-dialog
      :config="addEnterDialog.config"
      @closeDialog="addEnterDialog.config.visible = false"
      class="dialogSelect"
    >
      <el-form ref="model" :model="model" label-position="right" label-width="150px">
        <el-form-item label="企业号名称" :rules="[{ required: true, message: '请填写该字段' }]" prop="name">
          <el-input v-model="model.name">{{ model.name }}</el-input>
        </el-form-item>
        <el-form-item label="企业号ID" :rules="[{ required: true, message: '请填写该字段' }]" prop="cropId">
          <el-input v-model="model.cropId"></el-input>
        </el-form-item>
        <el-form-item label="企业号应用ID" :rules="[{ required: true, message: '请填写该字段' }]" prop="agentId">
          <el-input v-model="model.agentId"></el-input>
        </el-form-item>
        <el-form-item label="企业号应用密钥" :rules="[{ required: true, message: '请填写该字段' }]" prop="secret">
          <el-input v-model="model.secret"></el-input>
        </el-form-item>
        <el-form-item label="企业号客户联系密钥" prop="customerSecret">
          <el-input v-model="model.customerSecret"></el-input>
        </el-form-item>
      </el-form>
      <div class="Btn-two">
        <el-row :gutter="24">
          <el-col :span="10">&nbsp; </el-col>
          <el-col :span="6">&nbsp; </el-col>
          <el-col :span="4">
            <el-button type="info" @click="onAddClose()">取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="onAddSave()">确定</el-button>
          </el-col>
        </el-row>
      </div>
    </com-dialog>
    <com-dialog
      :config="EditEnterDialog.config"
      @closeDialog="EditEnterDialog.config.visible = false"
      class="dialogSelect"
    >
      <el-form ref="model" :model="model" label-position="right" label-width="150px">
        <el-form-item label="企业号名称" :rules="[{ required: true, message: '请填写该字段' }]" prop="name">
          <el-input v-model="model.name">{{ model.name }}</el-input>
        </el-form-item>
        <el-form-item label="企业号ID" :rules="[{ required: true, message: '请填写该字段' }]" prop="cropId">
          <el-input v-model="model.cropId"></el-input>
        </el-form-item>
        <el-form-item label="企业号应用ID" :rules="[{ required: true, message: '请填写该字段' }]" prop="agentId">
          <el-input v-model="model.agentId"></el-input>
        </el-form-item>
        <el-form-item label="企业号应用密钥" :rules="[{ required: true, message: '请填写该字段' }]" prop="secret">
          <el-input v-model="model.secret"></el-input>
        </el-form-item>
        <el-form-item label="企业号客户联系密钥" prop="customerSecret">
          <el-input v-model="model.customerSecret"></el-input>
        </el-form-item>
      </el-form>
      <div class="Btn-two">
        <el-row :gutter="24">
          <el-col :span="10">&nbsp; </el-col>
          <el-col :span="6">&nbsp; </el-col>
          <el-col :span="4">
            <el-button type="info" @click="onClose()">取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="onSave()">确定</el-button>
          </el-col>
        </el-row>
      </div>
    </com-dialog>
    <!-- <el-dialog
      class="QwAppMessage"
      title="修改信息"
      :visible.sync="changeDialog"
      :modal-append-to-body="false"
      width="30%"
      height="50%"
      :append-to-body="false"
      :close-on-click-modal="false"
    >
      <div class="editDiv">
        <el-form ref="model" :model="model"  label-position="right" label-width="120px">
          <el-form-item label="企业号名称" :rules="[{ required: true, message: '请填写该字段' }]" prop="name">
            <el-input v-model="model.name">{{ model.name }}</el-input>
          </el-form-item>
          <el-form-item label="企业号ID" :rules="[{ required: true, message: '请填写该字段' }]" prop="cropId">
            <el-input v-model="model.cropId"></el-input>
          </el-form-item>
          <el-form-item label="企业号应用ID" :rules="[{ required: true, message: '请填写该字段' }]" prop="agentId">
            <el-input v-model="model.agentId"></el-input>
          </el-form-item>
          <el-form-item label="企业号应用密钥" :rules="[{ required: true, message: '请填写该字段' }]" prop="secret">
            <el-input v-model="model.secret"></el-input>
          </el-form-item>
          <el-form-item label="企业号客户联系密钥" prop="customerSecret">
            <el-input v-model="model.customerSecret"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="QwFooter">
        <el-button @click="onClose()">取 消</el-button>
        <el-button type="primary" @click="onSave()">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- <el-dialog
      class="QwAppMessage"
      title="添加信息"
      :visible.sync="openDialog"
      :modal-append-to-body="false"
      width="30%"
      height="50%"
      :append-to-body="false"
      :close-on-click-modal="false"
    >
      <div class="editDiv">
        <el-form ref="model" :model="model" label-position="right" label-width="120px">
          <el-form-item label="企业号名称" :rules="[{ required: true, message: '请填写该字段' }]" prop="name">
            <el-input v-model="model.name">{{ model.name }}</el-input>
          </el-form-item>
          <el-form-item label="企业号ID" :rules="[{ required: true, message: '请填写该字段' }]" prop="cropId">
            <el-input v-model="model.cropId"></el-input>
          </el-form-item>
          <el-form-item label="企业号应用ID" :rules="[{ required: true, message: '请填写该字段' }]" prop="agentId">
            <el-input v-model="model.agentId"></el-input>
          </el-form-item>
          <el-form-item label="企业号应用密钥" :rules="[{ required: true, message: '请填写该字段' }]" prop="secret">
            <el-input v-model="model.secret"></el-input>
          </el-form-item>
          <el-form-item label="企业号客户联系密钥" prop="customerSecret">
            <el-input v-model="model.customerSecret"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="QwFooter">
        <el-button @click="onAddClose()">取 消</el-button>
        <el-button type="primary" @click="onAddSave()">确 定</el-button>
      </span>
    </el-dialog> -->
    <com-dialog
      :config="addApplicationDialog.config"
      @closeDialog="addApplicationDialog.config.visible = false"
      class="dialogSelect"
    >
      <el-form ref="applicationModel" :model="applicationModel" label-position="right" label-width="100px">
        <el-form-item label="应用名称:" :rules="[{ required: true, message: '请填写该字段' }]" prop="name">
          <el-input placeholder="请输入应用名称" v-model="applicationModel.name"></el-input>
        </el-form-item>
        <el-form-item label="应用ID:" :rules="[{ required: true, message: '请填写该字段' }]" prop="appId">
          <el-input placeholder="请输入应用ID" v-model="applicationModel.appId"></el-input>
        </el-form-item>
        <el-form-item label="应用Secret:" :rules="[{ required: true, message: '请填写该字段' }]" prop="secret">
          <el-input placeholder="请输入应用Secret" v-model="applicationModel.secret"></el-input>
        </el-form-item>
      </el-form>
      <div class="Btn-two">
        <el-row :gutter="24">
          <el-col :span="10">&nbsp; </el-col>
          <el-col :span="6">&nbsp; </el-col>
          <el-col :span="4">
            <el-button type="info" @click="closeApplicationAddDialog()">取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="sumbitApplicationAddDialog()">确定</el-button>
          </el-col>
        </el-row>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import api from '../../api/dispose'
import ComDialog from '../../components/common/ComDialog'
export default {
  components: { ComDialog },
  data() {
    return {
      disposeLength: '',
      model: {
        name: '',
        cropId: '',
        agentId: '',
        secret: '',
        customerSecret: '',
        mark: '',
        signatureToken: '',
        signatureKey: ''
      },
      option: {
        url: 'api/admin/v1/cropApp/page'
      },
      column: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '企业名称', align: 'center', prop: 'name' },
        { label: '企业号ID', align: 'center', prop: 'cropId' },
        { label: '企业号应用ID', align: 'center', prop: 'agentId' },
        // { label: '企业号应用密钥', align: 'center', prop: 'secret', width: '200' },

        // {
        //   label: '企业号客户联系密钥',
        //   align: 'center',
        //   prop: 'customerSecret',
        //   width: '400'
        // },
        {
          label: '操作',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
                  修改
                </el-button>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$confirm('是否删除该数据?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    })
                      .then(() => {
                        api.disposeDelete({ id: row.id }).then(() => {
                          this.$refs.table.onSearchKeep()
                          // this.Refresh = false
                          // this.$nextTick(() => {
                          //   this.Refresh = true
                          // })
                          this.disposePage({})
                        })
                      })
                      .catch(() => {})
                  }}
                >
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      changeDialog: false,
      openDialog: false,
      // Refresh: true,
      navList: [
        {
          name: '企业授权',
          isActive: true
        },
        {
          name: '应用授权',
          isActive: false
        }
      ],
      navBarFlag: 0,
      enterpriseTableData: [],
      height: 400,
      isEnterpriseLoading: true,
      enterpriseSearch: {
        pageSize: 15,
        pageNum: 1,
        total: 0
      },
      addApplicationDialog: {
        config: {
          width: '600px',
          title: '新增应用授权',
          visible: false
        }
      },
      addEnterDialog: {
        config: {
          width: '600px',
          title: '添加企业号',
          visible: false
        }
      },
      EditEnterDialog: {
        config: {
          width: '600px',
          title: '编辑企业号',
          visible: false
        }
      },
      applicationTableData: [],
      applicationModel: {
        name: '',
        appId: '',
        secret: ''
      }
    }
  },
  methods: {
    //保存按钮

    onClose() {
      this.EditEnterDialog.config.visible = false
      // this.Refresh = false
      // this.$nextTick(() => {
      //   this.Refresh = true
      // })
      this.disposePage({})
    },
    onAddClose() {
      this.addEnterDialog.config.visible = false
      console.log(this.model)
      // this.Refresh = false
      // this.$nextTick(() => {
      //   this.Refresh = true
      // })
    },
    showEditDialog(row) {
      this.model = Object.assign({}, row)
      // this.changeDialog = true
      this.EditEnterDialog.config.visible = true
    },

    onSave() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          api.disposeUpdate(this.model).then(() => {
            this.$message.success('更新成功')
            this.EditEnterDialog.config.visible = false
            this.disposePage({})
          })
        }
      })
    },
    addQyNumeber() {
      this.addEnterDialog.config.visible = true
      this.clearForm('model')
      // this.openDialog = true
    },

    onAddSave() {
      let that = this
      that.$refs.model.validate((valid) => {
        if (valid) {
          if (this.disposeLength == 2) {
            this.$message.warning('企业号个数超过限制')
            console.log(this.model)
          } else {
            api.disposeAdd(this.model).then(() => {
              this.addEnterDialog.config.visible = false
              that.$message.success('添加成功')
              this.disposePage({})
            })
          }
        }
      })
      // that.openDialog = false
    },
    disposePage(options) {
      options.pageNum = this.enterpriseSearch.pageNum
      options.pageSize = this.enterpriseSearch.pageSize
      this.isEnterpriseLoading = true
      api.disposePage(options).then((res) => {
        this.disposeLength = res.data.data.list.length
        this.enterpriseTableData = res.data.data.list
        this.enterpriseSearch.total = res.data.data.total
        this.isEnterpriseLoading = false
      })
    },
    // 切换导航
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
    deleteEnter(row) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.disposeDelete({ id: row.id }).then(() => {
            this.$refs.table.onSearchKeep()
            this.disposePage({})
            // this.Refresh = false
            // this.$nextTick(() => {
            //   this.Refresh = true
            // })
          })
        })
        .catch(() => {})
    },
    getTableHeight() {
      const OTHER_HEIGHT = 40 + 50 + 52
      this.height = window.innerHeight - document.querySelector('#table').offsetTop - OTHER_HEIGHT
    },
    // 分页
    enterpriseSearchOnSizeChange(val) {
      this.enterpriseSearch.pageSize = val
      this.disposePage({})
    },
    enterpriseSearchOnPageChange(val) {
      this.enterpriseSearch.pageNum = val
      this.disposePage({})
    },
    applitionAdd() {
      this.addApplicationDialog.config.visible = true
    },
    closeApplicationAddDialog() {
      this.addApplicationDialog.config.visible = false
    },
    sumbitApplicationAddDialog() {
      if (this.applicationModel.name == '') {
        this.$message.warning('请输入应用名称')
        return
      }
      if (this.applicationModel.appId == '') {
        this.$message.warning('请输入应用ID')
        return
      }
      if (this.applicationModel.secret == '') {
        this.$message.warning('请输入应用Secret')
        return
      }
      this.applicationModel.name = ''
      this.applicationModel.appId = ''
      this.applicationModel.secret = ''
      this.addApplicationDialog.config.visible = false
    },
    showEditAppDialog(row) {},
    deleteAppEnter(row) {}
  },
  created() {
    this.disposePage({})
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
    })
  }
}
</script>
<style lang="scss" scoped>
.addQyBtn {
  margin-bottom: 20px;
}
.enterprise {
  width: 100%;
  height: 100%;
  .top_nav {
    width: 100%;
    height: 44px;
    display: flex;
    ul {
      display: flex;
      background-color: #fff;
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
        cursor: pointer;
        &.active {
          border-radius: 0px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          background-color: #fff;
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
}
.middle_content {
  width: 100%;
  height: calc(100% - 40px);
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  .table {
    .tagList {
      span {
        display: inline-block;
        padding: 5px 5px;
        margin: 5px;
        // border: 1px solid #dfdcdc;
        background-color: #f2f2f2;
        border-radius: 3px;
      }
    }
  }
  .page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 10px 15px;
    .pagination-count {
      height: 28px;
      line-height: 28px;
      font-size: 14px;
      color: #7b7b7b;
      .count {
        margin-right: 20px;
      }
    }
  }
}
// .Btn-two {
//   border: 1px solid red;
// }
.top_btns {
  padding: 20px;
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
</style>
