<template>
  <div class="enterprise-tag">
    <div class="container">
      <div class="message-top">
        <span>会话存档配置</span>
        <div>
          <span>开启状态:</span>
          <el-switch v-model="isOpen" @change="handleOpenStatus(isOpen)"></el-switch>
        </div>
      </div>
      <div class="message-container">
        <div class="message-ip">
          <div class="message-ip-left">ip:</div>
          <div class="message-ip-right">
            <div class="ip-item" v-for="(item, index) in sessionList" :key="index">
              <div v-if="sessionList.length != 0">
                <span>{{ item }}</span>
              </div>
            </div>
            <div class="ip-item" v-if="sessionList.length == 0">暂无IP</div>
            <el-button type="text" @click="clickIpCopy" v-if="sessionList.length != 0">点击复制</el-button>
          </div>
        </div>
        <div class="message-gongyao">
          <div class="message-gongyao-div">
            <div class="message-gongyao-left">公钥:</div>
            <div class="message-gongyao-right">
              <div class="right-content">
                <span id="copytext">{{ sessionData.publicKey }}</span>
              </div>

              <el-button type="text" v-if="sessionData.publicKey != ''" @click="handleCopy">点击复制</el-button>
              <span v-if="sessionData.publicKey == ''">暂无公钥</span>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>

    <!-- <div
      :class="['meun-switch animated flex-row', uploadflag ? 'active rubberBand off' : 'leave jello']"
      @mouseleave="uploadleave"
      @mouseenter="uploadenter"
      v-if="uploadShow"
    >
      <img :src="require('@/modules/scrm/images/group-icon.png')" />
    </div> -->
    <!-- <div class="test-div">
      <div class="test-img-left">
        <img src="../../../images/none_dispose.png" alt="" />
      </div>
      <div class="test-img-right">
        <div>真真确确</div>
      </div>
    </div> -->

    <!-- <div class="container">
      <div class="table-info">
        <div class="info-left">
          <el-button size="small" type="primary" @click="addTagGroup">添加聊天会话配置</el-button>
        </div>
  
      </div>
      <div class="common-table-box">
        <el-table
          :data="tableData"
          width="100%"
          id="table"
          class="el-table"
          :header-cell-style="{ 'text-align': 'center' }"
          :height="height"
        >

          <el-table-column label="企业微信ID" prop="cropId" align="center"> </el-table-column>
          <el-table-column label="私钥文件" :formatter="formatterPrivate" align="center"> </el-table-column>
          <el-table-column label="公钥文件" :formatter="formatterPublic" align="center"> </el-table-column>
          <el-table-column label="操作" align="center" :formatter="formatterColumn"> </el-table-column>
        </el-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>

    <com-dialog :config="editDialog.config" @closeDialog="editDialog.config.visible = false" class="dialogSelect">
      <div>
        <el-form label-position="right" label-width="auto" ref="addExtendModel" :model="models">
          <el-form-item label="企业微信ID" :required="true">
            <el-input v-model="models.cropId" placeholder="请输入企业微信ID"></el-input>
          </el-form-item>
          <el-form-item label="上传私钥文件" :required="true">
            <el-upload
              :on-error="onPrivateEditError"
              :on-success="onPrivateEditSuccess"
              :action="privateEditAction"
              :show-file-list="false"
              :on-change="onEditPrivateChange"
              :auto-upload="false"
              class="upload-wrap"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
              <div class="tip-text">
                <p class="icon el-icon-plus"></p>
              </div>
            </el-upload>
            <div class="tip-p" v-if="priviteEditName == ''">
              <i class="el-icon-folder-opened folder-opened"></i>&nbsp;&nbsp;pkcs8.pem
            </div>
            <div class="tip-p" v-if="priviteEditName != ''">
              <i class="el-icon-folder-opened folder-opened"></i>&nbsp;&nbsp;{{ priviteEditName }}
            </div>
          </el-form-item>
          <el-form-item label="上传公钥文件" :required="true">
            <el-upload
              :on-error="onPublicEditError"
              :on-success="onPublicEditSuccess"
              :action="publicEditAction"
              :show-file-list="false"
              :on-change="onEditPublicChange"
              :auto-upload="false"
              class="upload-wrap"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
              <div class="tip-text">
                <p class="icon el-icon-plus"></p>
              </div>
            </el-upload>
            <div class="tip-p" v-if="publicEditName == ''">
              <i class="el-icon-folder-opened folder-opened"></i>&nbsp;&nbsp;app_public_key.pem
            </div>
            <div class="tip-p" v-if="publicEditName != ''">
              <i class="el-icon-folder-opened folder-opened"></i>&nbsp;&nbsp;{{ publicEditName }}
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="Btn-two" style="display: flex; justify-content: flex-end">
        <el-button @click="closeEditDialog()">取消</el-button>
        <el-button type="primary" @click="sumbitEditDialog()">确定</el-button>
      </div>
    </com-dialog>
    <com-dialog :config="addTagDialog.config" @closeDialog="addTagDialog.config.visible = false" class="dialogSelect">
      <div>
        <el-form label-position="right" label-width="auto" ref="addExtendModel" :model="model">
          <el-form-item label="企业微信ID" :required="true">
            <el-input v-model="model.cropId" placeholder="请输入企业微信ID"></el-input>
          </el-form-item>
          <el-form-item label="上传私钥文件" :required="true">
            <el-upload
              :action="privateAction"
              :show-file-list="false"
              :on-error="onPrivateError"
              :on-success="onPrivateSuccess"
              :on-change="onPrivateChange"
              :auto-upload="false"
              class="upload-wrap"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
              <div class="tip-text">
                <p class="icon el-icon-plus"></p>
              </div>
            </el-upload>
            <div class="tip-p" v-if="priviteName != ''">
              <i class="el-icon-folder-opened folder-opened"></i>&nbsp;&nbsp;{{ priviteName }}
            </div>
          </el-form-item>
          <el-form-item label="上传公钥文件" :required="true">
            <el-upload
              :on-error="onPublicError"
              :on-success="onPublicSuccess"
              :action="publicAction"
              :show-file-list="false"
              :on-change="onPublicChange"
              :auto-upload="false"
              class="upload-wrap"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
              <div class="tip-text">
                <p class="icon el-icon-plus"></p>
              </div>
            </el-upload>
            <div class="tip-p" v-if="publicName != ''">
              <i class="el-icon-folder-opened folder-opened"></i>&nbsp;&nbsp;{{ publicName }}
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="Btn-two" style="display: flex; justify-content: flex-end">
        <el-button @click="closeAddDialog()">取消</el-button>
        <el-button type="primary" @click="sumbitAddDialog()">确定</el-button>
      </div>
    </com-dialog> -->
  </div>
</template>

<script>
import { BASEURL } from '@/utils/config'
import ComDialog from '../../../components/common/ComDialog'
import ComPagination from '../../../components/common/ComPagination'
export default {
  components: { ComPagination, ComDialog },
  data() {
    return {
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      editDialog: {
        config: {
          width: '600px',
          title: '编辑聊天会话设置',
          visible: false
        }
      },
      addTagDialog: {
        config: {
          width: '600px',
          title: '添加聊天会话设置',
          visible: false
        }
      },
      model: {
        cropId: '',
        privateKeyFile: '',
        publicKeyFile: ''
      },
      models: {},
      height: 400,
      privateAction: '',
      publicAction: '',
      praviteFormData: [],
      publicFormData: [],
      priviteName: '',
      publicName: '',

      privateEditAction: '',
      priviteEditName: '',
      privateEditFormData: [],
      publicEditAction: '',
      publicEditFormData: [],
      publicEditName: '',
      editId: '',
      isOpen: false, //是否开启会话配置,
      sessionData: {
        ip: '',
        publicKey: ''
      },
      sessionList: [],
      uploadShow: true,
      uploadflag: true
    }
  },
  created() {
    this.getOpenStatus()
    // this.getTagPage()
  },
  // mounted() {
  //   this.privateAction = `${BASEURL}/api/admin/v1/wxCropWechatConfig/add`
  //   this.publicAction = `${BASEURL}/api/admin/v1/wxCropWechatConfig/add`
  //   this.privateEditAction = `${BASEURL}/api/admin/v1/wxCropWechatConfig/update`
  //   this.publicEditAction = `${BASEURL}/api/admin/v1/wxCropWechatConfig/update`
  //   this.$nextTick(() => {
  //     this.fullTableHeight()
  //     window.onresize = () => {
  //       this.fullTableHeight()
  //     }
  //   })
  // },
  destroyed() {
    window.onresize = ''
  },
  methods: {
    uploadenter() {
      this.uploadflag = true
    },
    uploadleave() {
      this.uploadflag = false
    },
    uploadanimated() {
      setTimeout(() => {
        this.uploadShow = true
        setTimeout(() => {
          this.uploadleave()
        }, 1000)
      }, 1000)
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
      this.getTagPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getTagPage()
    },

    getTagPage() {
      let that = this
      that.$http.getChatSessionPage(that.page).then((res) => {
        that.tableData = res.data.data.list
        that.page.total = res.data.data.total
        // console.log(that.tableData)
      })
    },

    //显示编辑弹窗
    showEditDialog(row) {
      this.editDialog.config.visible = true
      this.editId = row.id
      this.getEditMsg()
    },
    getEditMsg() {
      this.$http.getChatSession({ id: this.editId }).then((res) => {
        this.models = res.data.data
      })
    },
    //关闭编辑按钮
    closeEditDialog() {
      this.editDialog.config.visible = false
      this.privateEditFormData = []
      this.publicEditFormData = []
      this.priviteEditName = ''
      this.publicEditName = ''
      this.getTagPage()
      this.getEditMsg()
    },
    //确认编辑按钮
    sumbitEditDialog() {
      let formData = new FormData()
      formData.append('cropId', this.models.cropId)
      formData.append('id', this.models.id)
      formData.append('appId', this.models.appId)
      formData.append('isDeleted', this.models.isDeleted)
      formData.append('createTime', this.models.createTime)
      if (this.privateEditFormData.file != undefined) {
        formData.append('privateKeyFile', this.privateEditFormData.file)
      } else if (this.privateEditFormData.file == undefined) {
        let content = this.models.privateKey
        let blob = new Blob([content])
        formData.append('privateKeyFile', blob)
      }
      if (this.publicEditFormData.file != undefined) {
        formData.append('publicKeyFile', this.publicEditFormData.file)
      } else if (this.publicEditFormData.file == undefined) {
        let content = this.models.publicKey
        let blob = new Blob([content])
        formData.append('publicKeyFile', blob)
      }
      this.$http.updateChatSession(formData).then(() => {
        this.$message.success('更新成功')
        this.closeEditDialog()
      })
    },

    //添加标签组开始
    addTagGroup() {
      this.model.name = ''
      this.model.tagList = [{}]
      this.addTagDialog.config.visible = true
    },
    //关闭添加标签组弹窗
    closeAddDialog() {
      this.praviteFormData = []
      this.publicFormData = []
      this.priviteName = ''
      this.publicName = ''

      this.addTagDialog.config.visible = false
    },
    //提交标签组弹窗
    sumbitAddDialog() {
      let formData = new FormData()
      formData.append('privateKeyFile', this.praviteFormData.file)
      formData.append('publicKeyFile', this.publicFormData.file)
      formData.append('cropId', this.model.cropId)
      if (this.model.cropId == '') {
        this.$message.warning('请输入企业微信ID')
      } else if (this.praviteFormData.file == undefined) {
        this.$message.warning('请上传私钥文件')
      } else if (this.publicFormData.file == undefined) {
        this.$message.warning('请上传公钥文件')
      } else {
        this.$http.addChatSession(formData).then(() => {
          // this.$refs.model.resetFields()
          this.getTagPage()
          this.$message.success('聊天会话配置成功')
          this.praviteFormData = []
          this.publicFormData = []
          this.model.cropId = ''
          this.priviteName = ''
          this.publicName = ''
          this.addTagDialog.config.visible = false
        })
      }
    },

    formatterColumn(row) {
      return (
        <div>
          <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
            编辑
          </el-button>
          <el-button type="text" onClick={this.deleteRow.bind(this, row)}>
            删除
          </el-button>
        </div>
      )
    },
    formatterPrivate(row) {
      return (
        <div>
          {row.privateKey == '' && <el-button type="text">无上传文件</el-button>}
          {row.privateKey != '' && (
            <el-button type="text" onClick={this.downloadPrivatekey.bind(this, row)}>
              下载
            </el-button>
          )}
        </div>
      )
    },
    formatterPublic(row) {
      return (
        <div>
          {row.publicKey == '' && <el-button type="text">无上传文件</el-button>}
          {row.publicKey != '' && (
            <el-button type="text" onClick={this.downloadPublickey.bind(this, row)}>
              下载
            </el-button>
          )}
        </div>
      )
    },
    //下载私钥
    downloadPrivatekey(row) {
      window.open(`${this.baseUrl}/api/admin/v1/wxCropWechatConfig/download?id=${row.id}&type=0`)
      // let url = `${this.baseUrl}/api/admin/v1/wxCropWechatConfig/download?id=${row.id}&type=0`
      // this.download(url,'私钥文件')
    },
    // download(data,name) {
    //   const blob = new Blob([data]) //处理文档流
    //   const fileName = name
    //   const elink = document.createElement('a')
    //   elink.download = fileName
    //   elink.style.display = 'none'
    //   elink.href = URL.createObjectURL(blob)
    //   document.body.appendChild(elink)
    //   elink.click()
    //   URL.revokeObjectURL(elink.href) // 释放URL 对象
    //   document.body.removeChild(elink)
    // },
    //下载公钥
    downloadPublickey(row) {
      window.open(`${this.baseUrl}/api/admin/v1/wxCropWechatConfig/download?id=${row.id}&type=1`)
    },
    onPrivateChange(file, fileList) {
      this.praviteFormData.file = file.raw
      this.priviteName = this.praviteFormData.file.name
      this.$message.success('上传成功')
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
    },
    onPublicChange(file, fileList) {
      this.publicFormData.file = file.raw
      this.publicName = this.publicFormData.file.name
      this.$message.success('上传成功')
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      console.log(fileList)
    },
    onEditPrivateChange(file, fileList) {
      this.privateEditFormData.file = file.raw
      this.priviteEditName = this.privateEditFormData.file.name
      this.$message.success('上传成功')
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      console.log(fileList)
    },
    onEditPublicChange(file, fileList) {
      this.publicEditFormData.file = file.raw
      this.publicEditName = this.publicEditFormData.file.name
      this.$message.success('上传成功')
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      console.log(fileList)
    },
    deleteRow(row) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteChatSession({ id: row.id }).then((res) => {
            if (res.data.code === 20000) {
              this.$message.success('删除成功')
              this.getTagPage()
            } else {
              this.$message.error('删除失败')
              this.getTagPage()
            }
          })
        })
        .catch(() => {})
    },
    onPrivateSuccess() {
      this.$message.success('上传成功')
    },
    onPrivateError() {
      this.$message.error('上传失败')
    },

    onPublicError() {
      this.$message.error('上传失败')
    },
    onPublicSuccess() {
      this.$message.success('上传成功')
    },
    onPrivateEditError() {
      this.$message.error('上传失败')
    },
    onPrivateEditSuccess() {
      this.$message.success('上传成功')
    },
    onPublicEditError() {
      this.$message.error('上传失败')
    },
    onPublicEditSuccess() {
      this.$message.success('上传成功')
    },

    //添加变迁组结束

    //点击开关按钮
    handleOpenStatus(isOpen) {
      //true为关闭状态
      if (isOpen == true) {
        this.$confirm('是否开启聊天会话配置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$http.closeChatSession().then(() => {
              this.$message.success('聊天会话配置已开启')
              this.getOpenStatus()
            })
          })
          .catch(() => {
            this.isOpen = !this.isOpen
          })
      }
      //false为开启状态
      if (isOpen == false) {
        this.$confirm('关闭后，系统将不再保存成员会话和违规记录，确定要关闭吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$http.openChatSession().then(() => {
              this.$message.success('聊天会话配置已关闭')
              this.getOpenStatus()
            })
          })
          .catch(() => {
            this.isOpen = !this.isOpen
          })
      }
    },
    //获取会话配置是否开启
    getOpenStatus() {
      this.sessionList = []
      this.$http.getOpenStatus().then((res) => {
        this.isOpen = res.data.data
        if (this.isOpen == true) {
          this.$http.getSessionConversation().then((res) => {
            this.sessionData.ip = res.data.data.ip
            if (this.sessionData.ip != '') {
              this.sessionList = this.sessionData.ip.split(',')
              console.log(this.sessionList)
            }
            this.sessionData.publicKey = res.data.data.publicKey
          })
        } else {
          this.sessionData.ip = ''
          this.sessionList = []
          this.sessionData.publicKey = ''
        }
      })
    },
    //点击复制按钮
    handleCopy() {
      // console.log(this.sessionData.publicKey)
      let oInput = document.createElement('textarea')
      oInput.value = this.sessionData.publicKey
      document.body.appendChild(oInput)
      oInput.select()
      document.execCommand('copy')
      oInput.style.display = 'none'
      document.body.removeChild(oInput)
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    clickIpCopy() {
      let oInput = document.createElement('input')
      oInput.value = this.sessionData.ip
      document.body.appendChild(oInput)
      oInput.select()
      document.execCommand('copy')
      oInput.style.display = 'none'
      document.body.removeChild(oInput)
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    }
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
  // border: 1px solid red;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
}
.message-top {
  font-weight: bold;
  padding: 0 0 15px 0px;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  div {
    span {
      margin-right: 5px;
      color: #606266;
    }
  }
}
.message-container {
  // color: #1f1f1f;
  // border: 1px solid red;
  color: #303133;
  margin: 20px 0;
  .message-ip {
    margin: 0 0 10px 0;
    display: flex;
    .message-ip-left {
      // border: 1px solid red;
      flex: 0.5;
      margin: 5px;
      text-align: right;
    }
    .message-ip-right {
      font-size: 14px;
      // border: 1px solid green;
      flex: 12;
      display: flex;
      .ip-item {
        margin: 5px 0;
      }
      .el-button {
        padding: 0;
        margin-left: 5px;
        // font-size: 14px;
      }
    }
  }
  .message-gongyao {
    .message-gongyao-div {
      margin: 0 0 10px 0;
      display: flex;
      .message-gongyao-left {
        font-size: 14px;
        flex: 0.5;
        margin: 5px;
        text-align: right;
      }
      .message-gongyao-right {
        margin-top: 5px;
        height: 100%;
        font-size: 14px;
        flex: 12;
        word-wrap: break-word;
        .el-button {
          // font-size: 16px;
          margin: 0;
          padding: 0;
        }
      }
    }
  }
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
  margin-bottom: 20px;
  .info-left {
    display: flex;
    .info-msg {
      margin-right: 40px;
      span {
        color: #1e90ff;
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

::v-deep .special-column {
  width: 700px;
}
.el-form-filter {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
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
.tip-p {
  height: 40px;
  line-height: 40px;
  width: 300px;
  top: 20%;
  left: 110px;
  position: absolute;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  border: 1px solid rgb(211, 209, 209);
  padding: 2px 5px;
  cursor: pointer;
  margin: 8px 8px 7px 0;
}
.folder-opened {
  font-size: 16px !important;
  color: #294a7b;
  font-weight: bold !important;
}
.right-content {
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.test-div {
  border: 1px solid red;
  display: flex;
  .test-img-left {
    // display: inline-block;
    // border: 1px solid red;
    clip-path: polygon(0 0, 100% 0, 70% 100%, 0% 100%);
    img {
      border-top-left-radius: 50px;
      border-bottom-left-radius: 50px;
      width: 500px;
      height: 500px;
    }
  }
  .test-img-right {
    margin-left: -135px;
    // border: 1px solid red;
    clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);

    div {
      width: 500px;
      height: 500px;
      border-top-right-radius: 50px;
      border-bottom-right-radius: 50px;
      background-color: #ffffff;
    }
  }
}

.off {
  -webkit-animation: 1s seconddiv;
  background: transparent;
}

@keyframes seconddiv {
  0% {
    transform: scale(1.4, 1.4);
  }
  10% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1.2, 1.2);
  }
  50% {
    transform: scale(1, 1);
  }
  70% {
    transform: scale(1.2, 1.2);
  }
  100% {
    transform: scale(1, 1);
  }
}
.meun-switch {
  position: fixed;
  top: 90px;
  left: 0px;
  z-index: 2001;
  cursor: pointer;
  width: 150px;
  height: 150px;
  padding: 5px;
  transition: all 0.25s;

  &.leave {
    left: -65px;
  }

  &.active {
    left: 0;
  }

  &:hover {
    transform: scale(1.02);
  }

  img {
    width: 120px;
    height: 120px;
  }
}
</style>
