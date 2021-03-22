<template>
  <div class="wrap" ref="wrap">
    <!-- <div  @click="clickparent">父元素
      <div style="margin:20px" @click.stop.prevent="clickchild">子元素</div>
    </div> -->
    <QcTable ref="table" :option="option" :menu="menu" :search-form="searchForm" :column="column"></QcTable>
    <AccountDialog :visible="AccountDialogVisible" :id="updateId" @close="digClose"></AccountDialog>
    <RelatedDialog :visible="RelatedDialogVisible" :id="updateId" @close="digClose"></RelatedDialog>
    <el-dialog
      title="修改账号密码"
      :visible.sync="visiblePwd"
      :append-to-body="true"
      :before-close="closePwd"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="400px"
    >
      <el-form v-if="visiblePwd" :model="pwdData" ref="pwdData" label-position="right" label-width="100px">
        <el-form-item label="新密码" prop="newPassword" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input type="text" v-model="pwdData.newPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePwd()">取 消</el-button>
        <el-button type="primary" @click="successPwd()" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AccountDialog from './AccountDialog'
import RelatedDialog from './RelatedDialog'

export default {
  components: { AccountDialog, RelatedDialog },
  data() {
    false
    return {
      option: {
        url: 'api/admin/v1/account/page?type=2'
      },
      searchForm: [
        {
          label: '用户名',
          type: 'input',
          formName: 'name',
          value: ''
        },
        {
          label: '用户账号',
          type: 'input',
          formName: 'username',
          value: ''
        },
        {
          label: '状态',
          type: 'select',
          formName: 'isDeleted',
          option: [
            { label: '全部', value: '' },
            { label: '正常', value: false },
            { label: '作废', value: true }
          ],
          value: ''
        }
      ],
      menu: [
        { type: 'primary', label: '添加', on: this.insert },
        {
          type: 'primary',
          label: '修改帐号',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.updateAccount
        },
        {
          type: 'primary',
          label: '修改密码',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.openPwd
        },
        {
          type: 'primary',
          label: '绑定分组',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.insertAccount
        },
        // {
        //   type: 'primary',
        //   label: '模拟登陆',
        //   disabled: ({ currentRow }) => currentRow.id == undefined,
        //   on: this.login
        // },
        {
          type: 'danger',
          label: '删除',
          on: this.deleteConfirm,
          disabled: ({ currentRow }) => currentRow.id == undefined
        }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '用户名', prop: 'name' },
        { label: '用户账号', prop: 'username', align: 'center' },
        {
          label: '状态',
          formatter: (row) => {
            return row.isDeleted ? '作废' : '正常'
          },
          align: 'center'
        },
        {
          label: '是否冻结',
          formatter: (row) => {
            return row.isFrozen ? '已冻结' : '未冻结'
          },
          align: 'center'
        },
        {
          label: '最后登录时间',
          prop: 'lastLoginTime',
          align: 'center',
          formatter: (row) => {
            return row.lastLoginTime ? row.lastLoginTime.slice(0, row.lastLoginTime.length - 3) : ''
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
          formatter: (row) => {
            return row.createTime ? row.createTime.slice(0, row.createTime.length - 3) : ''
          }
        },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.productSell.bind(this, row.id, row.isFrozen)}>
                  {row.isFrozen ? '解冻' : '冻结'}
                </el-button>
              </div>
            )
          }
        }
      ],
      updateId: '',
      AccountDialogVisible: false,
      RelatedDialogVisible: false,
      pwdData: {
        id: '',
        newPassword: ''
      },
      visiblePwd: false,
      loading: false,
      oldPwd: {}
    }
  },
  methods: {
    clickparent() {
      this.$message.warning('我是父元素')
    },
    clickchild() {
      this.$message.warning('我是子元素')
    },
    onSearch() {
      this.$refs.table.onSearch()
    },
    onCell(row) {
      this.tableList = row
    },
    onGetList(list) {
      this.tableData = list
    },
    productSell(id, isFrozen) {
      this.$confirm(isFrozen ? '确定解冻该账号？' : '确定冻结该账号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.freezeAccount({ accountId: id, isFrozen: !isFrozen }).then((res) => {
            this.$message.success(isFrozen ? '解冻成功' : '冻结成功')
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {
          return
        })
    },
    deleteConfirm(current) {
      this.$confirm('确定删除该账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delete(current)
        })
        .catch(() => {
          return
        })
    },
    async delete(current) {
      await this.$http.deleteAccount({ id: current.id })
      this.$refs.table.onSearchKeep()
      this.$message.success('删除成功')
    },
    insert() {
      this.AccountDialogVisible = true
    },
    insertAccount(row) {
      this.updateId = row.id
      this.RelatedDialogVisible = true
    },
    updateAccount(row) {
      this.updateId = row.id
      this.AccountDialogVisible = true
    },
    login(row) {
      this.$http.imitateLogin({ username: row.username }).then((res) => {
        localStorage.removeItem(`storeId`)
        // localStorage.setItem("username", res.data.data.username);
        localStorage.setItem('user', JSON.stringify(res.data.data))
        if (res.data.data.storeId == '') {
          this.$router.replace('/storeSelect')
        } else {
          this.$router.replace('/main/index')
        }
        location.reload()
      })
    },
    openPwd(row) {
      this.oldPwd = JSON.parse(JSON.stringify(row))
      this.pwdData.id = row.id
      this.visiblePwd = true
    },
    closePwd() {
      this.pwdData = {
        id: '',
        newPassword: ''
      }
      this.updateId = ''
      this.visiblePwd = false
    },
    successPwd() {
      this.$refs.pwdData.validate((valid) => {
        if (valid) {
          this.$confirm('是否确认修改密码?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true
            this.updatePwd()
          })
        } else {
          return false
        }
      })
    },
    async updatePwd() {
      try {
        let data = {
          id: this.pwdData.id || '',
          newPassword: this.pwdData.newPassword
        }
        await this.$http.updatePlatformPwd(data)
        this.loading = false
        this.$message.success('修改成功')
        this.closePwd()
      } catch (err) {
        this.loading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true)
        }
      }
    },
    digClose(flag) {
      this.updateId = ''
      this.AccountDialogVisible = false
      this.RelatedDialogVisible = false
      if (typeof flag == 'boolean' && flag) {
        this.$refs.table.onSearchKeep()
      }
    }
  }
}
</script>
