<template>
  <div>
    <QcTable
      ref="table"
      :option="{ url: 'api/admin/v1/sharer/page' }"
      :searchForm="searchForm"
      :column="column"
    ></QcTable>

    <el-dialog
      title="二维码"
      :visible.sync="visible"
      width="400px"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="text-align: center;">
        <qrcode :value="qrcode" tag="img" :options="{ size: 300 }"></qrcode>
      </div>
      <span slot="footer">
        <el-button @click="handleClose()">关 闭</el-button>
      </span>
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
      qrcode: '',
      visible: false,
      searchForm: [
        { label: '姓名', type: 'input', formName: 'name', value: '' },
        { label: '手机', type: 'input', formName: 'mobile', value: '' }
      ],
      column: [
        { type: 'index', label: '序号', width: '60px', align: 'center' },
        {
          label: '头像',
          width: '100px',
          align: 'center',
          formatter: (row) => {
            // return <el-image src={row.headImage} style="width:50px;height:50px"></el-image>
            return <el-avatar shape="square" src={row.headImage} size={50}></el-avatar>
          }
        },
        { prop: 'appellation', label: '昵称', align: 'center' },
        { prop: 'mobile', label: '手机', align: 'center' },
        { prop: 'level', label: '等级', align: 'center' },
        { prop: 'createTime', label: '加入时间', align: 'center' },
        {
          label: '详情',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push(`/main/sharer/detail?id=${row.id}`)
                  }}
                >
                  详情
                </el-button>
              </div>
            )
          }
        }
      ],
      model: {
        name: '',
        mobile: '',
        channelName: '',
        username: '',
        password: ''
      }
    }
  },
  methods: {
    auditConfirm(id) {
      this.$confirm('是否通过审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.distributerAudit({ id }).then(() => {
            this.$refs.table.onSearchKeep()
            this.$message.success('审核成功')
          })
        })
        .catch(() => {})
    },
    distributerMaterialGetRegistQrcode() {
      this.$http.distributerMaterialGetRegistQrcode().then((res) => {
        this.qrcode = res.data.data
        this.visible = true
      })
    },
    handleClose() {
      this.visible = false
    }
  }
}
</script>
