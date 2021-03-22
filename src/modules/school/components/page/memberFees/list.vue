<template>
  <div class="wrap" ref="wrap">
    <QcTable
      ref="table"
      :option="option"
      :search-form="searchForm"
      :menu="menu"
      :column="column"
    ></QcTable>
    <FormDialog
      v-if="digFormWrap"
      :visible="digFormWrap"
      :type="type"
      :id="updateId"
      @close="onClose"
    ></FormDialog>
    
    <el-dialog
      title="会员缴费分享"
      :visible.sync="simpleVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="closeSimple"
      width="550px"
    >
      <!-- <p v-if="$store.state.appTypeList.some(item => item === 3)" 
        style="font-size: 14px;color: #888;padding: 10px 0;">注: 如果您的应用对接的是小程序，请使用小程序码分享</p> -->
      <div style="display: flex;">
        <WxQRCode v-if="simpleVisible && $store.state.appTypeList.some(item => item === 3)" :options="wxQRCodeOptions"></WxQRCode>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeSimple()" size="small">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormDialog from './form';
export default {
  props: {
    type: [Number]
  },
  components: { FormDialog },
  data() {
    return {
      updateId: '',
      simpleVisible: false,
      digFormWrap: false,
      wxQRCodeOptions: {
        name: 'member_fee', 
        scene: ''
      },
      option: {
        url: 'api/admin/v1/memberLevelFee/page',
        size: 'small',
        showSearchAndReset: false
      },
      searchForm: [],
      column: [
        { prop: 'name', label: '名称', align: 'center' },
        { prop: 'type', label: '类型', width: 100, align: 'center',
          formatter: row => {
            switch(row.type) {
              case 'calendarYear':
                return '自然年'
              case 'postponeYear':
                return '顺延年'
              case 'day':
                return '指定天数'
              default: 
                return row.type
            }
          }
        },
        { prop: 'amount', label: '费用', align: 'center', 
          formatter: row => {
            return (row.amount / 100).toFixed(2)
          }
         },
        { prop: 'createTime', label: '创建时间', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: row => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.digFormWrap = true
                    this.updateId = row.id
                  }}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteConfirm.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      menu: [
        {
          label: '添加',
          type: 'primary',
          on: () => {
            this.digFormWrap = true
          }
        }, 
        {
          label: '会费配置',
          type: 'primary',
          on: () => {
            this.$router.push('memberFees/config')
          }
        }, 
        {
          label: '会费订单',
          type: 'primary',
          on: () => {
            this.$router.push('memberFees/order')
          }
        }, 
        {
          label: '提取分享码',
          type: 'primary',
          on: row => {
            this.getVisible(row.id)
          }
        },
      ]
    }
  },
  methods: {
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delete(id)
        })
        .catch(() => {
          return
        })
    },
    async delete(id) {
      await this.$http.delMemberFees({ id })
      this.$refs.table.onSearchKeep()
      this.$message.success('删除成功')
    },
    onClose(isRefresh) {
      if (isRefresh) {
        this.$refs.table.onSearch()
      }
      this.digFormWrap = false
      this.updateId = ''
    },
    getVisible(id) {
      this.simpleVisible = true
    },
    closeSimple() {
      this.simpleVisible = false
    },
  }
}
</script>
