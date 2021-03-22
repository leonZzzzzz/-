<template>
  <div>
    <QcTable ref="table" :menu="menu" :search-form="searchForm" :option="option" :column="column"></QcTable>
    <!-- 复制链接弹窗 -->
    <el-dialog
      title="问卷链接"
      :visible.sync="simpleVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="closeSimple"
      width="880px"
    >
      <p
        v-if="$store.state.appTypeList.some((item) => item === 3)"
        style="font-size: 14px;color: #888; padding: 10px 0;"
      >
        注: 如果您的应用对接的是小程序，请使用小程序码分享
      </p>
      <div style="display: flex;">
        <div
          v-if="!$store.state.appTypeList.length || $store.state.appTypeList.some((item) => item === 2)"
          style="display: flex;"
        >
          <el-input size="small" style="width: 400px;" v-model="shareLink"></el-input>
          <el-button size="small" type="primary" style="margin: 0 15px;" @click="copy(shareLink)">复制</el-button>
          <el-popover placement="right" width="160" trigger="click">
            <qrcode :value="shareLink" v-if="shareLink" tag="img" :options="{ size: 160 }"></qrcode>
            <el-button slot="reference" type="primary" size="small" ref="test">二维码</el-button>
          </el-popover>
        </div>
        <WxQRCode
          v-if="simpleVisible && $store.state.appTypeList.some((item) => item === 3)"
          :options="wxQRCodeOptions"
        ></WxQRCode>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeSimple()" size="small">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Qrcode from '@xkeshi/vue-qrcode'

export default {
  components: { Qrcode },
  data() {
    return {
      digFromWrap: false,
      simpleVisible: false,
      actVisible: false,
      dialogTable: false,
      updateId: '',
      updateTitle: '',
      categoryList: [],
      wxQRCodeOptions: {
        name: '',
        scene: ''
      },
      menu: [
        { label: '添加', type: 'primary', on: this.insert },
        {
          label: '修改',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == null,
          on: (currentRow) => {
            this.update(1, currentRow)
          }
        },
        {
          label: '删除',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == null,
          on: (currentRow) => {
            this.deleteConfirm(1, currentRow.id)
          }
        },
        {
          label: '查看结果',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == null,
          on: (currentRow) => {
            this.jumpPage(`/main/activity/plugin/survey/reslut?id=${currentRow.id}&active=2`)
          }
        },
        {
          label: '提取问卷链接',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == null,
          on: (currentRow) => {
            this.getVisible(currentRow.id)
          }
        }
      ],
      searchForm: [{ formName: 'title', type: 'input', value: '', label: '标题' }],
      option: {
        url: 'api/admin/v1/survey/page'
      },
      column: [
        { type: 'index', label: '序号', align: 'center' },
        { prop: 'title', label: '标题', align: 'center' },
        { prop: 'startTime', label: '开始时间', align: 'center' },
        { prop: 'endTime', label: '结束时间', align: 'center' }
      ],
      shareLink: ''
    }
  },
  methods: {
    insert() {
      this.$router.push('/main/activity/plugin/survey/form')
    },
    update(count, row) {
      this.updateId = row.id
      // this.$router.push(`lessonRelease?id=${this.tableList.id}`);
      if (count === 1) {
        this.$router.push(`/main/activity/plugin/survey/form?id=${row.id}`)
      } else {
        this.$router.push(`/main/activity/plugin/survey/form?id=${row.id}&copy=true`)
      }
    },
    getVisible(id) {
      this.$http.getMobileUrl().then((res) => {
        this.shareLink = `${res.data.data.url}/survey/POUND/survey?wo=1&wot=2&woacm=1&mpl=1&id=${id}`
        this.wxQRCodeOptions = {
          name: 'survey',
          scene: id || ''
        }
        this.simpleVisible = true
      })
    },
    closeSimple() {
      this.simpleVisible = false
    },
    closeLink() {
      this.actVisible = false
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
    jumpPage(url) {
      this.$router.push(url)
    },
    deleteConfirm(count, id) {
      let text = count === 1 ? '是否删除该数据?' : count == 2 ? '是否发布?' : '是否下架?'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (count === 1) this.delete(id)
          else this.release(count)
        })
        .catch(() => {})
    },
    delete(id) {
      this.$http.deleteSurvey({ id }).then((res) => {
        console.log(res)
        this.$refs.table.onSearchKeep()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    },
    release(count) {
      let model = {
        id: this.tableList.id,
        isRelease: count == 2 ? true : false
      }
      this.$http
        .releaseLesson(model)
        .then((res) => {
          this.loading = false
          console.log(res)
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.searchKeep()
          // setTimeout(() => {
          //   this.$router.go(-1);
          // }, 500);
        })
        .catch(() => {
          this.loading = false
        })
    },
    close(flag) {
      this.updateId = ''
      this.digFromWrap = false
      if (typeof flag == 'boolean' && flag) {
        this.searchKeep()
      }
    },
    openDialogTable() {
      this.dialogTable = true
      this.updateId = this.tableList.id
      this.updateTitle = this.tableList.title
    },
    closeDialogTable() {
      this.dialogTable = false
    }
  }
}
</script>
