<template>
  <div>
    <QcTable
      ref="table"
      :option="{ url: 'api/admin/v1/distributer-commission/page' }"
      :search-form="searchForm"
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
        <qrcode
          :value="qrcode"
          tag="img"
          :options="{ size: 300 }"
        ></qrcode>
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
        { label: '昵称', type: 'input', formName: 'appellation' },
        { label: '姓名', type: 'input', formName: 'name' },
        { label: '手机', type: 'input', formName: 'mobile' },
        { label: '订单号', formName: 'fromOrderNumber', type: 'input' },
        { label: '订单标题', formName: 'fromOrderTitle', type: 'input' },
        {
          label: '状态',
          type: 'select',
          formName: 'status',
          value: '',
          option: [
            {
              value: '',
              label: '全部'
            },
            {
              value: 'ongoing',
              label: '待奖励'
            },
            {
              value: 'cancel',
              label: '已失效'
            },
            {
              value: 'finish',
              label: '已奖励'
            }
          ]
        }
      ],
      column: [
        { type: 'index', label: '序号', width: '60px', align: 'center' },
        {
          label: '头像',
          width: '100px',
          align: 'center',
          formatter: row => {
            // return <el-image src={row.headImage} style="width:50px;height:50px"></el-image>
            return <el-avatar shape="square" src={row.headImage} size={50}></el-avatar>
          }
        },
        { prop: 'appellation', label: '昵称', align: 'center' },
        { prop: 'name', label: '姓名', align: 'center' },
        { prop: 'mobile', label: '手机', align: 'center' },
        { prop: 'buyerName', label: '购买人姓名', align: 'center' },
        { prop: 'buyerMobile', label: '购买人手机', align: 'center' },
        // {
        //   label: '客户头像',
        //   width: '100px',
        //   align: 'center',
        //   formatter: row => {
        //     return <el-image src={row.buyerHeadImage} style="width:50px;height:50px"></el-image>
        //   }
        // },
        // { prop: 'buyerAppellation', label: '客户昵称', align: 'center' },
        // { prop: 'buyerMobile', label: '客户手机', align: 'center' },
        // { prop: 'buyerName', label: '客户姓名', align: 'center' },
        {
          prop: 'amount',
          label: '奖励金额',
          align: 'center',
          formatter: row => {
            return parseFloat((row.amount / 100).toPrecision(12))
          }
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          formatter: row => {
            return row.status === 'ongoing'
              ? '待奖励'
              : row.status === 'cancel'
              ? '已失效'
              : row.status === 'finish'
              ? '已奖励'
              : ''
          }
        },
        {
          prop: 'fromOrderType',
          label: '订单类型',
          align: 'center',
          formatter: row => {
            return row.fromOrderType === 'activity-sign' ? '活动' : ''
          }
        },
        { prop: 'fromOrderNumber', label: '订 单 号', align: 'center' },
        { prop: 'fromOrderTitle', label: '订单标题', align: 'center', showOverflowTooltip: true },
        {
          label: '订单封面',
          width: '100px',
          align: 'center',
          formatter: row => {
            return <el-image src={this.imgHost + row.fromOrderUrl} style="width:70px;height:50px"></el-image>
          }
        },
        {
          prop: 'type',
          label: '类型',
          align: 'center',
          formatter: row => {
            return row.type === 'sharer' ? '推广者订单' : row.auditStatus === 'distributer' ? '销售员订单' : ''
          }
        },
        { prop: 'createTime', label: '创建时间', align: 'center', width: '150px' }
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
      this.$http.distributerMaterialGetRegistQrcode().then(res => {
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
