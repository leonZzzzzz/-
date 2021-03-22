<template>
  <!-- 选择小程序 参考欢迎语-->
  <!-- 
    <SelectProgramItem ref="SelectProgramItem" :programProps="programIdProps"></SelectProgramItem>

    programIdProps 需要进行修改的id
    programIdProps: {
        id: '',
        name: '',
        logo: ''
      },

    获取返回数据  let program = this.$refs.SelectProgramItem.success()
   -->
  <div>
    <el-form label-width="auto">
      <el-form-item label="配置小程序">
        <el-select placeholder="请选择" v-model="programId" @change="getProgarmId">
          <el-option
            class="app-select"
            v-for="(item, index) in options"
            :key="index"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <!-- 新增 -->
        <el-button style="margin-left: 5px" icon="el-icon-plus" @click="createButton" circle size="mini"></el-button>
      </el-form-item>
      <el-form-item label="" v-if="programId">
        <div class="programInfoBox">
          <div class="programInfo">
            <el-card shadow="hover" :body-style="{ padding: '10px' }">
              <div class="programInfoContent">
                <div class="logo">
                  <el-avatar
                    size="medium"
                    :src="programInfoOption.logo ? imgHost + programInfoOption.logo : ''"
                  ></el-avatar>
                </div>
                <div class="name">{{ programInfoOption.name }}</div>
                <!-- <div class="deleteBtn">
                修改
                <el-button icon="el-icon-edit" type="text" @click="updateButton"></el-button>
                删除
                <el-button icon="el-icon-delete" type="text" @click="deleteProgram" style="margin-left: 5px"></el-button>
              </div> -->
              </div>
            </el-card>
          </div>
          <div class="updateBtn">
            <el-button
              style="margin-left: 5px"
              icon="el-icon-edit"
              @click="updateButton"
              circle
              size="mini"
            ></el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 新增小程序 -->
    <el-dialog
      :title="title"
      :visible.sync="programDialog"
      width="600px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :append-to-body="true"
      @close="close"
    >
      <el-form :model="programForm" label-position="right" label-width="auto" ref="programForm">
        <el-form-item
          label="小程序标题"
          :rules="[{ required: true, message: '请输入小程序标题', trigger: 'blur' }]"
          prop="name"
        >
          <el-input v-model="programForm.name" placeholder="请输入小程序标题"></el-input>
        </el-form-item>
        <el-form-item
          label="小程序ID"
          :rules="[{ required: true, message: '请输入小程序ID', trigger: 'blur' }]"
          prop="wxAppId"
        >
          <el-input v-model="programForm.wxAppId" placeholder="请输入小程序ID"></el-input>
        </el-form-item>
        <el-form-item
          label="小程序链接"
          :rules="[{ required: true, message: '请输入小程序链接', trigger: 'blur' }]"
          prop="page"
        >
          <el-input v-model="programForm.page" placeholder="请输入小程序链接"></el-input>
        </el-form-item>
        <el-form-item label="小程序封面" :required="true">
          <UploadImage @success="uploadImageSuccess" :fileList="fileList"></UploadImage>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button @click="programDialog = false">取消</el-button>
        <el-button type="primary" @click="programSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UploadImage from './UploadImage.vue'
import api from '../../api/groupsend'
export default {
  props: {
    programProps: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    UploadImage
  },
  data() {
    return {
      programId: '',
      options: [],
      programInfoOption: {
        logo: '',
        name: ''
      },
      programDialog: false,
      ruleForm: {
        name: ''
      },
      programForm: {
        name: '',
        wxAppId: '',
        page: '',
        logo: ''
      },
      fileList: [],
      type: 'create',
      title: '新建小程序',
      updateImage: ''
    }
  },
  methods: {
    close() {
      this.fileList = []
      this.programForm = {
        name: '',
        wxAppId: '',
        page: '',
        logo: ''
      }
    },
    // 获取小程序列表
    getProgarm(callback) {
      this.$http.getProgarm().then((res) => {
        this.options = res.data.data
        console.log('接口数据', this.options)
        if (callback) {
          callback(this.options)
        }
      })
    },
    getProgarmId() {
      this.options.forEach((item) => {
        if (item.id == this.programId) {
          console.log(item)
          this.programInfoOption = item
        }
      })
    },
    uploadImageSuccess(val) {
      this.updateImage = val.length == 0 ? '' : val[0].url
      this.programForm.logo = val.length == 0 ? '' : val[0].url
    },
    programSubmit() {
      this.$refs.programForm.validate((valid) => {
        if (valid) {
          console.log('提交的小程序', this.programForm)
          if (this.type == 'create') {
            api.addProgarm(this.programForm).then((res) => {
              console.log('成功返回值', res)
              this.$message.success('添加小程序成功')
              this.programDialog = false
              this.getProgarm()
              this.programForm = {
                name: '',
                wxAppId: '',
                logo: '',
                page: ''
              }
            })
            return
          }
          if (this.type == 'update') {
            api.updateProgarm(this.programForm).then(() => {
              this.$message.success('修改小程序成功')
              this.programDialog = false
              this.getProgarm()
              this.getProgarmId()
              if (this.updateImage) {
                this.programInfoOption.logo = this.updateImage
              }
              this.programInfoOption.name = this.programForm.name
              this.programForm = {
                name: '',
                wxAppId: '',
                logo: '',
                page: ''
              }
            })
          }
        } else {
          return false
        }
      })
    },
    updateButton() {
      this.programDialog = true
      this.type = 'update'
      this.title = '修改小程序'
      this.options.forEach((item) => {
        if (item.id == this.programId) {
          console.log('===>', item)
          this.programForm = item
          this.fileList = [
            {
              name: item.name,
              url: this.imgHost + item.logo
            }
          ]
        }
      })
    },
    createButton() {
      this.programDialog = true
      this.type = 'create'
      this.title = '新建小程序'
    },
    deleteProgram() {
      this.$confirm('此操作将永久删除该小程序, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.deleteProgarm({ id: this.programId }).then((res) => {
            this.$message.success('删除小程序成功')
            this.programDialog = false
            this.getProgarm()
            this.programId = ''
            this.programForm = {
              name: '',
              wxAppId: '',
              logo: '',
              page: ''
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    success() {
      return this.programInfoOption
    }
  },
  watch: {
    programIdProps: {
      handler: function() {
        let _this = this
        _this.programId = _this.programProps.wxAppId
        if (!_this.programId) {
          return
        }
        _this.programInfoOption.name = _this.programProps.name
        _this.programInfoOption.logo = _this.programProps.logo
        _this.$http.getProgarm().then((res) => {
          _this.options = res.data.data
          _this.options.forEach((item) => {
            if (item.wxAppId == _this.programId) {
              _this.programInfoOption = item
            }
          })
        })
      },
      immediate: true
    }
  },
  created() {
    if (this.programProps.id) {
      return
    }
    this.getProgarm()
  }
  // updated() {
  //   console.log('组件内接受', this.programIdProps)
  // }
}
</script>

<style lang="scss" scoped>
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
</style>
