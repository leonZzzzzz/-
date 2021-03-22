<template>
  <div>
    <QcTable
      ref="table"
      :search-form="searchForm"
      :menu="menu"
      :option="option"
      :column="column"
    ></QcTable>
    <el-dialog
      :show-close="false"
      title="证书详情"
      :visible="certificate.visible"
      width="665px"
      append-to-body
    >
      <el-form
        label-position="right"
        label-width="120px"
        :model="certificate.model"
        ref="model"
      >
        <el-form-item
          label="名称："
          prop="title"
          :rules="[{ required: true, message: '名称不能为空' }]"
        >
          <el-input v-model="certificate.model.title"></el-input>
        </el-form-item>
        <el-form-item
          label="上传证书模板："
          prop="iconUrl"
          :rules="[{ required: true, message: '证书模板不能为空' }]"
        >
          <QcImageUpload
            v-model="certificate.model.iconUrl"
            width="350px"
            height="248px"
          ></QcImageUpload>
          <p>尺寸建议：3508 x 2480 大小2M</p>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            @click="onClose"
          >关闭</el-button>
          <el-button
            size="small"
            type="primary"
            @click="onSave"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Qrcode from '@xkeshi/vue-qrcode'
export default {
  components: {
    Qrcode
  },
  data() {
    return {
      searchForm: [
        { label: '名称', type: 'input', formName: 'title' },
        {
          label: '状态',
          type: 'select',
          formName: 'isCheck',
          option: [
            { label: '全部', value: '' },
            { label: '开启', value: true },
            { label: '关闭', value: false }
          ],
          value: ''
        }
      ],
      option: {
        url: 'api/admin/v1/courseCertificate/page'
      },
      menu: [
        {
          label: '添加',
          type: 'primary',
          on: () => {
            this.certificate.visible = true
          }
        },
        {
          label: '下载模板',
          type: 'primary',
          on: this.onDownload
        }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '姓名', prop: 'title', align: 'center' },
        {
          label: '证书',
          prop: 'iconUrl',
          align: 'center',
          formatter: row => {
            return (
              <el-popover placement="right" width="400" trigger="click">
                <img slot="reference" src={`${this.imgHost + row.iconUrl}`} width="80px" />
                <img src={`${this.imgHost + row.iconUrl}`} width="100%" />
              </el-popover>
            )
          }
        },
        {
          label: '状态',
          prop: 'isCheck',
          align: 'center',
          formatter: row => {
            return row.isCheck ? '已开启' : '未开启'
          }
        },
        { label: '创建时间', prop: 'createTime', align: 'center' },
        {
          label: '操作',
          prop: '',
          align: 'center',
          formatter: row => {
            let copyRow = JSON.parse(JSON.stringify(row))
            copyRow.showTabName = this.$store.state.appTypeList.some(item => item === 3) ? 'weapp' : 'h5'
            return (
              <div>
                <el-popover placement="bottom" width="300" trigger="click">
                  <el-tabs v-model={copyRow.showTabName}>
                    {this.$store.state.appTypeList.some(item => item === 2) && (
                      <el-tab-pane label="H5" name="h5">
                        <Qrcode
                          value={`${this.shareHost}/mobile/POUND/certificate?wo=1&wot=2&woacm=1&mpl=1`}
                          tag="img"
                          options={{ size: 150 }}
                        ></Qrcode>
                        <div style="display: flex;">
                          <el-input
                            ref="input"
                            size="small"
                            value={`${this.shareHost}/mobile/POUND/certificate?wo=1&wot=2&woacm=1&mpl=1`}
                          ></el-input>
                          <el-button size="mini" type="primary" style="margin: 0 15px;" onclick={this.onCopy.bind()}>
                            复制
                          </el-button>
                        </div>
                      </el-tab-pane>
                    )}
                    {this.$store.state.appTypeList.some(item => item === 3) && (
                      <el-tab-pane label="小程序" name="weapp">
                        <WxQRCode text label="查看小程序码" options={{ name: 'certificate' }}></WxQRCode>
                      </el-tab-pane>
                    )}
                  </el-tabs>
                  <el-button type="primary" type="text" slot="reference" style="margin-right: 12px;">
                    分享
                  </el-button>
                </el-popover>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push('/main/activity/plugin/certificate/detail?id=' + row.id)
                  }}
                >
                  详情
                </el-button>
                <el-button type="text" onClick={this.certificateGet.bind(this, row.id)}>
                  修改
                </el-button>
                {row.isCheck ? (
                  <el-button type="text" onClick={this.certificateStatusUpdate.bind(this, row.id, false)}>
                    关闭
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.certificateStatusUpdate.bind(this, row.id, true)}>
                    开启
                  </el-button>
                )}
                <el-button type="text" onClick={this.certificateDelete.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      certificate: {
        visible: false,
        model: {
          title: '',
          iconUrl: ''
        }
      },
      shareHost: ''
    }
  },
  created() {
    this.getMobileUrl()
  },
  methods: {
    getMobileUrl() {
      this.$http.getMobileUrl().then(res => {
        this.shareHost = res.data.data.url
      })
    },
    onDownload() {
      location.href =
        'http://athena-1255600302.cosgz.myqcloud.com/attachments/test/4d75c18e315c4e9683eae865c4ecfe9e.jpg'
    },
    certificateGet(id) {
      this.$http.certificateGet({ id }).then(res => {
        this.certificate.model = res.data.data
        this.certificate.visible = true
      })
    },
    certificateInsert() {
      this.$http.certificateInsert(this.certificate.model).then(() => {
        this.onClose()
        this.$message.success('保存成功')
        this.$refs.table.onSearchKeep()
      })
    },
    certificateUpdate() {
      this.$http.certificateUpdate(this.certificate.model).then(res => {
        this.onClose()
        this.$message.success('修改成功')
        this.$refs.table.onSearchKeep()
      })
    },
    certificateStatusUpdate(id, isCheck) {
      this.$http.certificateStatusUpdate({ id, isCheck }).then(res => {
        this.$message.success('操作成功!')
        this.$refs.table.onSearchKeep()
      })
    },
    certificateDelete(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.certificateDelete(id).then(res => {
            this.$message.success('删除成功!')
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除!')
        })
    },
    onSave() {
      this.$refs.model.validate(val => {
        if (val) {
          if (this.certificate.model.id) {
            this.certificateUpdate()
          } else {
            this.certificateInsert()
          }
        }
      })
    },
    onClose() {
      this.certificate.visible = false
      this.$refs.model.resetFields()
      this.certificate.model = { title: '', iconUrl: '' }
    },
    onCopy() {
      this.$refs.input.select()
      document.execCommand('Copy')
      this.$message.success('链接已复制到黏贴板')
    }
  }
}
</script>

<style></style>
