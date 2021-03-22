<template>
  <div>
    <QcTable
      :option="option"
      :search-form="searchForm"
      :showSearchButtons="false"
      :menu="menu"
      :column="column"
      @row-click="rowClick"
    ></QcTable>

    <el-dialog
      title="提取链接"
      :visible.sync="simpleVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="closeSimple"
      width="880px"
    >
      <div style="display: flex;">
        <el-input size="small" v-model="shareLink">
          <template slot="prepend">抽奖：</template>
        </el-input>
        <el-button size="mini" type="primary" style="margin: 0 15px;" @click="copy(shareLink)">复制</el-button>
      </div>
      <div style="display: flex;margin-top: 20px;">
        <el-input size="small" v-model="barrageLink">
          <template slot="prepend">弹幕：</template>
        </el-input>
        <el-button size="mini" type="primary" style="margin: 0 15px;" @click="copy(barrageLink)">复制</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeSimple()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      simpleVisible: false,
      option: {
        url: 'api/admin/v1/lottery/page',
        size: 'small',
        showSearchAndReset: false
      },
      searchForm: [
        {
          formName: 'showType',
          value: 3
        }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center', width: 50 },
        { prop: 'title', label: '标题' },
        // { prop: "sourceType", label: "参与嘉宾",
        //   formatter: row => {
        //     if (row.sourceType === "") return "";
        //     switch (row.sourceType) {
        //       case 1:
        //         return "活动报名";
        //       case 2:
        //         return "活动签到";
        //       case 3:
        //         return "导入编号";
        //     }
        //   }
        // },
        { prop: 'password', label: '密码' },
        { prop: 'createTime', label: '创建时间' }
      ],
      menu: [
        { label: '添加', type: 'primary', on: this.insert },
        { label: '修改', type: 'primary', disabled: ({ currentRow }) => currentRow.id == undefined, on: this.update },
        {
          label: '复制',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: () => {
            this.update(2)
          }
        },
        {
          label: '删除',
          type: 'danger',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.deleteConfirm
        },
        // { label: '查看参与嘉宾', type: 'primary', disabled: ({ currentRow }) => currentRow.id == undefined, on: () => this.jumpPage(1) },
        {
          label: '查看中奖名单',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: () => this.jumpPage(2)
        },
        {
          label: '查看弹幕',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: () => this.jumpPage(3)
        },
        {
          label: '提取链接',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.getVisible
        },
        { label: '打开链接', type: 'primary', disabled: ({ currentRow }) => currentRow.id == undefined, on: this.open }
      ],
      shareLink: '',
      // 弹幕链接
      barrageLink: '',
      shareHost: '',
      tableRow: {}
    }
  },
  created() {
    this.getMobileUrl()
  },
  methods: {
    async getMobileUrl() {
      let res = await this.$http.getMobileUrl()
      this.shareHost = `${res.data.data.url}/plugin`
    },
    //添加
    insert() {
      this.$router.push(`/main/activity/plugin/egg/release?showType=3`)
    },
    //修改
    update(count) {
      if (count === 2) {
        this.$router.push(`/main/activity/plugin/egg/release?id=${this.tableRow.id}&showType=3&copy=true`)
      } else {
        this.$router.push(`/main/activity/plugin/egg/release?id=${this.tableRow.id}&showType=3`)
      }
    },
    jumpPage(type) {
      switch (type) {
        case 1:
          // 参与嘉宾
          this.$router.push(
            `/main/activity/plugin/lottery/member?id=${this.tableRow.id}&sourceId=${this.tableRow.sourceId}&sourceType=${this.tableRow.sourceType}`
          )
          break
        case 2:
          // 中奖名单
          this.$router.push(
            `/main/activity/plugin/lottery/winning?id=${this.tableRow.id}&showType=${this.tableRow.showType}`
          )
          break
        case 3:
          // 查看弹幕
          this.$router.push(`/main/activity/plugin/barrage?id=${this.tableRow.id}`)
          break
      }
    },
    open() {
      let path = '/lottery/egg_nobody?'
      this.shareLink = `${this.shareHost}/#${path}id=${this.tableRow.id}`
      window.open(this.shareLink)
    },
    getVisible() {
      let path = '/lottery/egg_nobody?'
      this.shareLink = `${this.shareHost}/#${path}id=${this.tableRow.id}`
      this.barrageLink = `${this.shareHost}/POUND/lottery/sendBarrage?wo=1&wot=2&woacm=1&mpl=1&id=${this.tableRow.id}`
      this.simpleVisible = true
    },
    closeSimple() {
      this.simpleVisible = false
    },
    rowClick(row) {
      this.tableRow = row
    },
    copy(shareLink) {
      let oInput = document.createElement('input')
      oInput.value = shareLink
      document.body.appendChild(oInput)
      oInput.select()
      document.execCommand('copy')
      oInput.style.display = 'none'
      document.body.removeChild(oInput)
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    //删除提示框
    deleteConfirm() {
      this.$confirm('是否删除该数据？', '提示', {
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
      await this.$http.deleteLottery({ id: this.tableRow.id })
      this.$message.success('删除成功')
      this.$refs.table.onSearchKeep()
    }
  }
}
</script>
