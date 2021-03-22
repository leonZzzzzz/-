<template>
  <QcNavigationPage content="课程报名详情">
    <QcTable
      :option="{ url: `api/admin/v1/courseSign/page?sourceId=${$route.query.id}` }"
      :menu="menu"
      :search-form="searchForm"
      :column="column"
      @get-list="onGetList"
    ></QcTable>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        {
          label: '取消报名',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: (row) => {
            this.cancelConfirm(1, row)
          }
        },
        {
          label: '退款',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: (row) => {
            this.cancelConfirm(2, row)
          }
        },
        {
          label: '导出',
          on: (row) => {
            window.open(this.exportUrl)
          }
        }
      ],
      searchForm: [
        { label: '手机号或姓名', type: 'input', formName: 'param', labelWidth: '100px' },
        {
          label: '状态',
          formName: 'status',
          type: 'select',
          labelWidth: '40px',
          option: [
            { value: 0, label: '全部' },
            { value: 4, label: '待支付' },
            { value: 6, label: '已报名' }
          ]
        }
      ],
      column: [
        { type: 'index', label: '序号', width: '60px', align: 'center' },
        {
          label: '状态',
          width: '100px',
          align: 'center',
          formatter: (row) => {
            return {
              1: '待审核',
              2: '审核通过',
              3: '审核不通过',
              4: '待支付',
              5: '已支付',
              6: '已报名',
              7: '已退款',
              8: '已取消',
              10: '报名失败'
            }[row.status]
          }
        },
        { prop: 'signTime', label: '报名时间', width: '100px', align: 'center' }
      ]
    }
  },
  created() {
    this.getMobileUrl()
  },
  methods: {
    getMobileUrl() {
      this.$http.getMobileUrl().then((res) => {
        this.exportUrl = res.data.data.url + `/api/admin/v1/courseSign/exportData?sourceId=${this.$route.query.id}`
      })
    },
    onGetList(row) {
      this.column = this.$options.data().column
      row.map((item, index) => {
        if (item.signDataList) {
          item.signDataList.map((sign) => {
            let { id, settingId, name, value } = sign
            item[settingId] = value
            index == 0 && this.column.push({ prop: settingId, label: name, align: 'center' })
          })
        }
      })
    },
    cancelConfirm(count, row) {
      let text = { 1: '是否取消报名？如果用户已支付，将会同时执行退款操作。', 2: '确认退款?' }[count]
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (count === 1) this.courseSignCancel(row)
          else this.courseSignRefund(row)
        })
        .catch(() => {
          return
        })
    },
    courseSignCancel(row) {
      if (row.status === 8) {
        this.$message.error('状态为已取消不可选择')
      } else {
        this.$http.courseSignCancel({ id: row.id }).then((res) => {
          this.$message.success('取消成功')
          this.$refs.table.onSearchKeep()
          window.reload()
        })
      }
    },
    courseSignRefund(row) {
      if (row.status !== 8) {
        this.$message.error('只能选择状态为已取消')
      } else {
        this.$http.courseSignRefund({ id: row.id }).then((res) => {
          this.$message.success('退款成功')
          this.$refs.table.onSearchKeep()
          window.reload()
        })
      }
    }
  }
}
</script>
