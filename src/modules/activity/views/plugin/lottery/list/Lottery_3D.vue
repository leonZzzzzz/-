<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="small" @click="insert()">添加</el-button>
        <el-button type="primary" size="small" :disabled="tableList.id == null" @click="update()">修改</el-button>
        <el-button type="danger" size="small" :disabled="tableList.id == null" @click="deleteConfirm()">删除</el-button>
        <el-button type="primary" size="small" :disabled="tableList.id == null" @click="toMember()"
          >查看参与嘉宾</el-button
        >
        <el-button type="primary" size="small" :disabled="tableList.id == null" @click="toWinning()"
          >查看中奖名单</el-button
        >
        <el-button type="primary" size="small" :disabled="tableList.id == null" @click="getVisible()"
          >提取链接</el-button
        >
        <el-button type="primary" size="small" :disabled="tableList.id == null" @click="open()">打开链接</el-button>
      </button-wrap>
    </div>
    <qc-table-old
      ref="table"
      :table-list="showData"
      :search="searchData"
      url="api/admin/v1/lottery/page"
    ></qc-table-old>
    <el-dialog
      title="抽奖链接"
      :visible.sync="simpleVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="closeSimple"
      width="880px"
    >
      <div style="display: flex;">
        <el-input size="small" v-model="shareLink"></el-input>
        <el-button size="mini" type="primary" style="margin: 0 15px;" @click="copy(shareLink)">复制</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeSimple()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tableMixin } from '@/mixins/tableMixin'

export default {
  mixins: [tableMixin],
  data() {
    return {
      simpleVisible: false,
      searchData: {
        showType: 3
      },
      showData: [
        { template: 'index' },
        { prop: 'title', label: '标题' },
        {
          prop: 'sourceType',
          label: '参与嘉宾',
          template: 'filter',
          filter: { 1: '活动报名', 2: '活动签到', 3: '导入编号' }
        },
        { prop: 'password', label: '密码' },
        { prop: 'createTime', label: '创建时间' }
      ],
      shareLink: '',
      shareHost: ''
    }
  },
  created() {
    this.getMobileUrl()
  },
  methods: {
    async getMobileUrl() {
      let res = await this.$http.getMobileUrl()
      this.shareHost = `${res.data.data.url}/plugin/#/lottery/3D?`
    },
    //添加
    insert() {
      this.$router.push(`/main/activity/plugin/lottery/release?showType=3`)
    },
    //修改
    update() {
      this.$router.push(`/main/activity/plugin/lottery/release?id=${this.tableList.id}&showType=3`)
    },
    //参与嘉宾
    toMember() {
      this.$router.push(
        `/main/activity/plugin/lottery/member?id=${this.tableList.id}&sourceId=${this.tableList.sourceId}&sourceType=${this.tableList.sourceType}`
      )
    },
    //中奖名单
    toWinning() {
      this.$router.push('/main/activity/plugin/lottery/winning?id=' + this.tableList.id)
    },
    open() {
      this.shareLink = `${this.shareHost}id=${this.tableList.id}`
      window.open(this.shareLink)
    },
    getVisible() {
      this.shareLink = `${this.shareHost}id=${this.tableList.id}`
      this.simpleVisible = true
    },
    closeSimple() {
      this.simpleVisible = false
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
      await this.$http.deleteLottery({ id: this.tableList.id })
      this.searchKeep()
      this.$message.success('删除成功')
    }
  }
}
</script>
