<template>
  <QcNavigationPage content="中奖名单">
    <QcTable
      ref="table"
      style="margin: -20px;"
      :option="option"
      :search-form="searchForm"
      :menu="menu"
      :column="column"
    ></QcTable>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url:
          this.$route.query.showType == 3
            ? 'api/admin/v1/lottery-abstract-result/page'
            : 'api/admin/v1/lotteryResult/getWinner'
      },
      menu: [
        {
          label: '兑奖',
          type: 'primary',
          disabled: ({ currentRow }) =>
            this.$route.query.showType == 3 || currentRow.id == undefined || currentRow.checkStatus != 'new',
          on: (currentRow) => {
            this.exchangeAward(currentRow.id)
          }
        }
      ],
      searchForm: [
        { value: this.$route.query.id, formName: this.$route.query.showType == 3 ? 'id' : 'lotteryId' },
        {
          label: '奖项',
          type: 'select',
          formName: 'lotteryItemId',
          option: [],
          value: ''
        }
        // {
        //   label: "状态",
        //   type: "select",
        //   formName: "checkStatus",
        //   option: [
        //     { value: "", label: "全部" },
        //     { value: 'lose', label: "未中奖" },
        //     { value: 'new', label: "未兑换" },
        //     { value: 'checked', label: "已兑换" }
        //   ],
        //   value: ""
        // }
      ],
      column: [
        {
          type: 'index',
          align: 'center'
        },
        {
          label: '头像',
          prop: 'headImage',
          align: 'left',
          width: 150,
          formatter: (row) => {
            return <img src={row.headImage} alt="" width="60" height="60" />
          }
        },
        {
          label: '昵称',
          prop: 'nickName',
          align: 'left'
        },
        {
          label: '手机',
          prop: 'mobile',
          align: 'left'
        },
        {
          label: '奖项',
          prop: 'lotteryItemTitle',
          align: 'left'
        },
        {
          label: '状态',
          prop: 'checkStatus',
          align: 'center',
          formatter: (row) => {
            switch (row.checkStatus) {
              case 'lose':
                return '未中奖'
              case 'new':
                return '未兑换'
              // return <span style="color: #67c23a;">未兑换</span>
              case 'checked':
                return '已兑换'
              // return <span style="color: #f56c6c;">未通过</span
              default:
                return row.checkStatus
            }
          },
          width: '150px'
        }
      ]
    }
  },
  created() {
    if (this.$route.query.sourceType == 3) {
      this.column = [
        { type: 'index' },
        { prop: 'memberNo', label: '编号' },
        { prop: 'nickName', label: '昵称' },
        { prop: 'lotteryItemTitle', label: '奖项' }
      ]
    }
    if (this.$route.query.showType == 3) {
      this.column = [
        {
          label: '序号',
          prop: 'number',
          align: 'center',
          width: 100
        },
        {
          label: '奖品',
          prop: 'lotteryItemTitle',
          align: 'left'
        },
        {
          label: '奖品图',
          prop: 'lotteryItemImgUrl',
          align: 'left',
          width: 150,
          formatter: (row) => {
            return <img src={this.imgHost + row.lotteryItemImgUrl} alt="" width="80" height="80" />
          }
        },
        {
          label: '是否中奖',
          prop: 'awardType',
          align: 'left',
          width: 150
        }
      ]
    }
    this.getLotteryItemList()
  },
  methods: {
    // 兑奖
    exchangeAward(id) {
      this.$confirm('是否确认兑奖', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.lotteryExchangeAward({ id: id }).then(() => {
            this.$message.success('兑奖成功')
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {
          return
        })
    },
    getLotteryItemList() {
      this.$http.getLotteryItemList({ lotteryId: this.$route.query.id }).then((res) => {
        res.data.data.map((item) => {
          this.searchForm[1].option.push({
            label: item.title,
            value: item.id
          })
        })
      })
    }
  }
}
</script>
