<template>
  <div>
    <QcTable ref="table" :option="optoin" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
    <dig-form :visible="digFormWrap" :id="updateId" @close="digClose" @reload="$refs.table.onSearch()"></dig-form>
    <account-form :visible="accountFormWrap" :id="updateId" @close="digClose"></account-form>
    <Flash :visible="vessel" :id="vesselId" @close="vesClose"></Flash>
    <!-- <Gaikunag-form :visible="gaikunagFormWrap" :id="updateId" @close="digClose"></Gaikunag-form> -->
  </div>
</template>

<script>
import DigForm from './Form'
import Flash from './flash'
import AccountForm from './AccountForm'
// import GaikunagForm from './GaikunagForm'
export default {
  components: { DigForm, AccountForm, Flash },
  data() {
    return {
      optoin: { url: 'api/admin/v1/app/page' },
      searchForm: [
        {
          formName: 'name',
          type: 'input',
          label: '应用名称'
        },
        {
          formName: 'customerName',
          type: 'input',
          label: '所属客户'
        },
        {
          label: '状态',
          formName: 'status',
          type: 'select',
          option: [
            { label: '全部', value: '' },
            { label: '使用中', value: 1 },
            { label: '已过期', value: 7 }
          ]
        }
      ],
      menu: [
        {
          label: '添加应用',
          type: 'primary',
          on: this.insert
        },
        {
          label: '修改应用',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.update
        },
        {
          label: '添加管理账号',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.addAccount
        },
        {
          label: '编辑权限',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.detail
        },
        {
          label: '功能管理',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: (row) => {
            this.$router.push(`app/ability-detail?id=${row.appId}`)
          }
        },
        {
          label: '授权公众号',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.jumpWeChatAuthorize
        },
        {
          label: '查看授权公众号',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.jumpSeeWeChatAuthorize
        },
        {
          label: '搜索设置',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: (row) => {
            this.$router.push(`/main/app/search?appId=${row.appId}`)
          }
        },
        {
          label: '调整企微限定人数',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: (row) => {
            this.vessel = true
            this.vesselId = row.appId
          }
        }
        // {
        //   label: '概况配置',
        //   type: 'primary',
        //   disabled: ({ currentRow }) => currentRow.appId == undefined,
        //   on: row => {
        //     this.updateId = row.appId
        //     this.gaikunagFormWrap = true
        //   }
        // }
      ],
      column: [
        { type: 'index', label: '序号', align: 'center' },
        {
          label: '应用图标',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.logUrl} style="width:50px;height:50px"></el-image>
          }
        },
        { prop: 'name', label: '应用名称' },
        { prop: 'customerName', label: '所属客户' },
        { prop: 'code', label: '项目名（英文）', align: 'center' },
        { prop: 'remark', label: '备注说明', align: 'center' },
        {
          prop: 'remark',
          label: '是否模板',
          align: 'center',
          formatter: (row) => {
            return row.isTemplate ? '是' : '否'
          }
        },
        {
          label: '状态',
          align: 'center',
          formatter: (row) => {
            return {
              0: '待审核',
              1: '使用中',
              6: '审批不通过',
              7: '已过期',
              8: '授权结束',
              9: '已停止'
            }[row.status]
          }
        },
        { prop: 'endDate', label: '到期日', align: 'center' },
        { prop: 'createTime', label: '创建时间', align: 'center' }
      ],
      updateId: '',
      digFormWrap: false,
      accountFormWrap: false,
      gaikunagFormWrap: false,
      vessel: false,
      vesselId: ''
    }
  },
  methods: {
    deleteConfirm() {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delete()
        })
        .catch(() => {
          return
        })
    },
    async delete() {
      await this.$http.deleteApp({ id: this.tableList.id })
      this.$refs.table.onSearchKeep()
      this.$message.success('删除成功')
    },
    insert() {
      this.digFormWrap = true
    },
    update(row) {
      this.updateId = row.id
      this.digFormWrap = true
    },
    detail(row) {
      this.$router.push(`app/detail?id=${row.appId}`)
    },
    digClose(flag) {
      this.updateId = ''
      this.digFormWrap = false
      this.accountFormWrap = false
      this.gaikunagFormWrap = false
      if (typeof flag == 'boolean' && flag) {
        this.$refs.table.onSearchKeep()
      }
    },
    vesClose(flag) {
      this.vesselId = ''
      this.vessel = false
      if (typeof flag == 'boolean' && flag) {
        this.$refs.table.onSearchKeep()
      }
    },
    addAccount(row) {
      this.updateId = row.id
      this.accountFormWrap = true
    },
    jumpSeeWeChatAuthorize(row) {
      this.$router.push(`app/wechatDetail?appId=${row.appId}`)
    },
    jumpWeChatAuthorize(row) {
      window.open(`${this.$projectUrl}/open/wx/login?appId=${row.id}`)
    }
  }
}
</script>
