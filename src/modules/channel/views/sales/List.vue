<template>
  <div>
    <QcTable
      ref="table"
      :option="{ url: 'api/admin/v1/distributer/page' }"
      :search-form="searchForm"
      :menu="menu"
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
      menu: [
        {
          label: '获取销售员注册二维码',
          type: 'primary',
          on: () => {
            this.distributerMaterialGetRegistQrcode()
            // this.visible = true
          }
        }
      ],
      searchForm: [
        { label: '姓名', type: 'input', formName: 'name', value: '' },
        { label: '手机', type: 'input', formName: 'mobile', value: '' }
      ],
      column: [
        { type: 'index', label: '序号', width: '60px', align: 'center' },
        { prop: 'name', label: '姓名', align: 'center' },
        { prop: 'mobile', label: '手机', align: 'center' },
        { prop: 'createTime', label: '创建时间', align: 'center' },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          formatter: (row) => {
            return row.status === 'waiting-audit'
              ? '待审核'
              : row.status === 'audited'
              ? '已审核'
              : row.status === 'refused'
              ? '已拒绝'
              : row.status === 'forbidden'
              ? '禁用'
              : ''
          }
        },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  disabled={row.status !== 'waiting-audit'}
                  type="text"
                  onClick={() => {
                    this.auditConfirm(row.id)
                  }}
                >
                  审核
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
