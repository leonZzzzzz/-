<template>
  <div>
    <QcTable
      ref="table"
      :option="{ url: 'api/admin/v1/withdraw/page' }"
      :search-form="searchForm"
      :menu="menu"
      :column="column"
    ></QcTable>

    <el-dialog
      title="人工转账"
      :visible.sync="visible"
      width="450px"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div>
        <el-form size="small" label-position="left" label-width="100px" :model="model" ref="model">
          <el-form-item
            label="转账单号"
            prop="transactionNumber"
            :rules="[{ required: true, message: '该字段不能为空' }]"
          >
            <el-input v-model="model.transactionNumber"></el-input>
          </el-form-item>
          <el-form-item label="转账凭证" prop="transferTicket" :rules="[{ required: true, message: '该字段不能为空' }]">
            <QcImageUpload v-model="model.transferTicket"></QcImageUpload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="handleClose()">关 闭</el-button>
        <el-button @click="transfer()" type="primary">转 账</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qrcode: '',
      visible: false,
      menu: [
        {
          label: '人工转账',
          type: 'primary',
          on: (currentRow, selectionRow, tableData) => {
            this.model.id = currentRow.id
            this.visible = true
          },
          disabled: ({ currentRow, selectionRow, tableData }) => {
            return currentRow.status === 'finish' ||
              currentRow.auditStatus !== 'audited' ||
              currentRow.transferStatus === 'finish' ||
              currentRow.transferStatus === 'ongoing'
              ? true
              : false
          }
        }
      ],
      searchForm: [
        { label: '姓名', type: 'input', formName: 'name', value: '' },
        { label: '手机', type: 'input', formName: 'mobile', value: '' },
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
              label: '处理中'
            },
            {
              value: 'fail',
              label: '失败'
            },
            {
              value: 'finish',
              label: '提现完成'
            }
          ]
        },
        {
          label: '审核状态',
          type: 'select',
          formName: 'auditStatus',
          value: '',
          option: [
            {
              value: '',
              label: '全部'
            },
            {
              value: 'new',
              label: '待审核'
            },
            {
              value: 'ongoing',
              label: '审核中'
            },
            {
              value: 'refused',
              label: '审核不通过'
            },
            {
              value: 'audited',
              label: '已审核'
            }
          ]
        },
        {
          label: '转账状态',
          type: 'select',
          formName: 'transferStatus',
          value: '',
          option: [
            {
              value: '',
              label: '全部'
            },
            {
              value: 'waiting',
              label: '等待打款'
            },
            {
              value: 'ongoing',
              label: '打款中'
            },
            {
              value: 'fail',
              label: '失败'
            },
            {
              value: 'finish',
              label: '已到账'
            }
          ]
        }
      ],
      column: [
        { type: 'index', label: '序号', width: '60px', align: 'center' },
        { prop: 'name', label: '收款姓名', align: 'center' },
        { prop: 'mobile', label: '手机', align: 'center' },
        { prop: 'account', label: '提现账号', align: 'center' },
        { prop: 'number', label: '提现单号', align: 'center' },
        {
          prop: 'amount',
          label: '提现金额',
          align: 'center',
          formatter: (row) => {
            return parseFloat((row.amount / 100).toPrecision(12))
          }
        },
        {
          prop: 'poundage',
          label: '手续费',
          align: 'center',
          formatter: (row) => {
            return parseFloat((row.poundage / 100).toPrecision(12))
          }
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          formatter: (row) => {
            return row.status === 'ongoing'
              ? '处理中'
              : row.status === 'fail'
              ? '失败'
              : row.status === 'finish'
              ? '提现完成'
              : ''
          }
        },
        {
          prop: 'auditStatus',
          label: '审核状态',
          align: 'center',
          formatter: (row) => {
            return row.auditStatus === 'new'
              ? '待审核'
              : row.auditStatus === 'ongoing'
              ? '审核中'
              : row.auditStatus === 'refused'
              ? '审核不通过'
              : row.auditStatus === 'audited'
              ? '已审核'
              : ''
          }
        },
        {
          prop: 'transferStatus',
          label: '转账状态',
          align: 'center',
          formatter: (row) => {
            return row.transferStatus === 'waiting'
              ? '等待打款'
              : row.transferStatus === 'ongoing'
              ? '打款中'
              : row.transferStatus === 'fail'
              ? '失败'
              : row.transferStatus === 'finish'
              ? '已到账'
              : ''
          }
        },
        { prop: 'transferFailMessage', label: '转账失败信息', align: 'center', showOverflowTooltip: true },
        {
          label: '打款方式',
          align: 'center',
          formatter: (row) => {
            return { manual: '人工转账', auto: '自动转账' }[row.transferWay]
          }
        },
        {
          label: '打款类型',
          align: 'center',
          formatter: (row) => {
            return { manual: '人工转账', join: '汇聚' }[row.transferType]
          }
        },
        {
          label: '转账凭证',
          align: 'center',
          formatter: (row) => {
            return (
              row.transferTicket && (
                <el-image
                  previewSrcList={[this.imgHost + row.transferTicket]}
                  src={this.imgHost + row.transferTicket}
                  style="width:30px"
                  mode="cover"
                />
              )
            )
          }
        },
        { prop: 'createTime', label: '创建时间', align: 'center', width: '100px' }
        // {
        //   label: '操作',
        //   align: 'center',
        //   formatter: row => {
        //     return (
        //       <div>
        //         <el-button
        //           disabled={row.status !== 'waiting-audit'}
        //           type="text"
        //           onClick={() => {
        //             this.auditConfirm(row.id)
        //           }}>
        //           审核
        //         </el-button>
        //       </div>
        //     )
        //   }
        // }
      ],
      model: {
        id: '',
        transactionNumber: '',
        transferTicket: ''
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
    transfer() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.$http.withdrawManualTransfer(this.model).then((res) => {
            this.$message.success(res.data.message || '打款成功')
            this.visible = false
            this.$refs.table.onSearchKeep()
          })
        }
      })
    },
    handleClose() {
      this.model.transactionNumber = ''
      this.visible = false
    }
  }
}
</script>
