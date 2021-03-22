<template>
  <QcNavigationPage content="弹幕列表">
    <QcTable
      ref="table"
      style="margin: -20px;"
      :option="option"
      :search-form="searchForm"
      :menu="menu"
      :column="column"
    ></QcTable>
    <el-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      title="变更状态"
      append-to-body
      :before-close="onClose"
      width="380px"
    >
      <el-form ref="model" :model="model" size="small" label-width="80px" label-position="right">
        <el-form-item label="选择状态" prop="teamId" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-select v-model="model.teamId">
            <el-option :value="item.id" :label="item.name" :key="item.id" v-for="item in teamList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit()">保存</el-button>
          <el-button @click="onClose(false)">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/dialog/checkLotteryList'
        // showPagination: false,
        // response: { list: 'data.data' }
      },
      menu: [
        // {
        //   label: "详情",
        //   disabled: ({ selectionRow }) => selectionRow.length == 0,
        //   on: (currentRow, search, selectionRow) => {
        //     console.log(selectionRow);
        //     let ids = selectionRow.map(item => {
        //       return item.id;
        //     });
        //     this.jumpDetail(ids.join("_"), true);
        //   }
        // },
        {
          label: '通过',
          disabled: ({ selectionRow }) => selectionRow.length == 0,
          on: (currentRow, search, selectionRow) => {
            console.log(selectionRow)
            let ids = selectionRow.map((item) => {
              return item.id
            })
            this.auditRefund(ids, '2')
          }
        },
        {
          label: '拒绝',
          disabled: ({ selectionRow }) => selectionRow.length == 0,
          on: (currentRow, search, selectionRow) => {
            console.log(selectionRow)
            let ids = selectionRow.map((item) => {
              return item.id
            })
            this.auditRefund(ids, '3')
          }
        }
        // {
        //   label: "删除",
        //   disabled: ({ selectionRow }) => selectionRow.length == 0,
        //   on: this.deleteConfirm
        // }
      ],
      searchForm: [
        { value: this.$route.query.id, formName: 'lotteryId' },
        // { label: "弹幕时间", formName: "lastTime", type: "date-picker", el: {type: 'datetime', 'value-format': 'yyyy-MM-dd HH:mm:ss'}},
        {
          label: '状态',
          type: 'select',
          formName: 'checkStatus',
          option: [
            { value: '', label: '全部' },
            { value: 1, label: '待审核' },
            { value: 2, label: '已通过' },
            { value: 3, label: '未通过' }
          ],
          value: ''
        }
      ],
      column: [
        {
          type: 'selection'
        },
        {
          label: '头像',
          prop: 'headImage',
          align: 'left',
          width: 120,
          formatter: (row) => {
            return <img src={row.headImage} alt="" width="60" height="60" style="border-radius: 50%;" />
          }
        },
        // {
        //   label: "昵称",
        //   prop: "appellation",
        //   align: "left",
        // },
        {
          label: '姓名',
          prop: 'name',
          align: 'left',
          width: 120
        },
        {
          label: '手机',
          prop: 'mobile',
          align: 'left',
          width: 120
        },
        {
          label: '内容',
          prop: 'content',
          align: 'left'
        },
        {
          label: '状态',
          prop: 'checkStatus',
          align: 'center',
          formatter: (row) => {
            switch (row.checkStatus) {
              case 1:
                return '待审核'
              // return <el-tag type="info" effect="plain">待审核</el-tag>
              case 2:
                // return '已通过'
                return <span style="color: #67c23a;">已通过</span>
              case 3:
                return <span style="color: #f56c6c;">未通过</span>
              default:
                return row.checkStatus
            }
          },
          width: 120
        },
        {
          label: '发送时间',
          prop: 'createTime',
          align: 'left',
          width: 150
        }
        // {
        //   label: '操作',
        //   formatter: row => {
        //     return (
        //       <el-button
        //         type="text"
        //         onClick={() => {
        //           this.$router.push(`/main/journey/order/group/message/detail?id=${row.id}`)
        //         }}
        //       >
        //         查看发送详情
        //       </el-button>
        //     )
        //   }
        // }
      ],
      dialogVisible: false,
      teamList: [],
      model: {}
    }
  },
  methods: {
    auditRefund(idList, type) {
      let text = type == '2' ? '是否同意通过审核？' : '是否拒绝通过审核？'
      this.$confirm(text, '操作提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let parame = {
            idList: idList,
            lotteryId: this.$route.query.id,
            checkStatus: type
          }
          this.$http.barrageCheck(parame).then(() => {
            this.$message.success(type == '2' ? '成功通过' : '成功拒绝')
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    },
    productSell(ids, isSell) {
      this.$http.productSell({ ids, isSell }).then(() => {
        this.selectProduct = []
        this.$refs.table.onSearchKeep()
      })
    },
    deleteConfirm(row, search, selectionRow) {
      // let ids = selectionRow.map(item => {
      //   return item.id;
      // });
      // this.$confirm("是否删除该数据?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     this.$http.({ ids: ids.join("_") }).then(() => {
      //       this.$message({
      //         message: "删除成功",
      //         type: "success"
      //       });
      //       this.$refs.table.onSearchKeep();
      //     });
      //   })
      //   .catch(() => {});
    },
    jumpDetail(id) {
      this.$router.push(`main/activity/plugin/barrage/detail?id=${id}`)
    },
    onClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scope>
.product-item {
  display: flex;
  align-items: flex-start;
  .cover {
    margin-right: 10px;
  }
  .name {
    height: 32px;
    line-height: 15px;
    margin-bottom: 10px;
  }
  .price {
    font-size: 14px;
    line-height: 1;
  }
}
</style>
