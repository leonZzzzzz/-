<template>
  <div>
    <QcTable
      ref="table"
      :option="{ url: 'api/admin/v1/course/page' }"
      :menu="menu"
      :column="column"
    > </QcTable>
    <el-dialog
      title="课程链接"
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
          <el-input
            size="small"
            style="width: 400px;"
            v-model="shareLink"
          ></el-input>
          <el-button
            size="small"
            type="primary"
            style="margin: 0 15px;"
            @click="copy(shareLink)"
          >复制</el-button>
          <el-popover
            placement="right"
            width="160"
            trigger="click"
          >
            <qrcode
              :value="shareLink"
              v-if="shareLink"
              tag="img"
              :options="{ size: 160 }"
            > </qrcode>
            <el-button
              slot="reference"
              type="primary"
              size="small"
              ref="test"
            >二维码</el-button>
          </el-popover>
        </div>
        <WxQRCode
          v-if="simpleVisible && $store.state.appTypeList.some((item) => item === 3)"
          :options="wxQRCodeOptions"
        ></WxQRCode>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="closeSimple()"
          size="small"
        >关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      digFromWrap: false,
      actVisible: false,
      updateId: '',
      searchData: {},
      typeList: [],
      wxQRCodeOptions: {
        name: 'courseShare',
        scene: ''
      },
      menu: [
        { label: '添加', type: 'primary', on: this.insert },
        {
          label: '修改',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: row => {
            this.update(1, row.id)
          }
        },
        {
          label: '复制',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: row => {
            this.update(2, row.id)
          }
        },
        {
          label: '详情',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.detail
        },
        {
          label: '留言列表',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.jumpComment
        },
        {
          label: '提取链接',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: row => {
            this.getVisible(row.id)
          }
        },
        {
          label: '发布',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined || currentRow.isRelease,
          on: row => {
            this.deleteConfirm(2, row.id)
          }
        },
        {
          label: '取消发布',
          type: 'danger',
          disabled: ({ currentRow }) => currentRow.id == undefined || !currentRow.isRelease,
          on: row => {
            this.deleteConfirm(3, row.id)
          }
        },
        {
          label: '删除',
          type: 'danger',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: row => {
            this.deleteConfirm(1, row.id)
          }
        }
      ],
      column: [
        { type: 'index', label: '序号', align: 'center', width: '60px' },
        {
          label: '封面',
          formatter: row => {
            return (
              <el-image src={this.imgHost + row.iconUrl} mode="widthFix" style="width:60px;height:50px;"></el-image>
            )
          }
        },
        { prop: 'title', label: '课程' },
        { prop: 'educationalSystem', label: '学制' },
        {
          prop: 'advanceCharge',
          label: '预付款金额',
          formatter: row => {
            return row.advanceCharge / 100
          }
        },
        { prop: 'city', label: '城市' },
        {
          prop: 'isRelease',
          label: '发布',
          formatter: row => {
            return row.isRelease ? '是' : '否'
          }
        },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'seqNum', label: '排序号' }
      ],
      shareBase: `/mobile/POUND/curriculum/detail?wo=1&wot=2&woacm=1&mpl=1&`,
      shareLink: '',
      simpleVisible: false,
      channel: []
    }
  },
  created() {
    // this.getMobileUrl()
  },
  methods: {
    insert() {
      this.$router.push('/main/lesson/form')
    },
    update(count, id) {
      if (count === 1) {
        this.$router.push(`/main/lesson/form?id=${id}`)
      } else {
        this.$router.push(`/main/lesson/form?id=${id}&copy=true`)
      }
    },
    jumpComment(row) {
      this.$router.push(`/main/info/leaveMsg?id=${row.id}`)
    },
    detail(row) {
      this.$router.push(`/main/lesson/detail?id=${row.id}`)
    },
    deleteConfirm(count, id) {
      let text = count === 1 ? '是否删除该数据?' : count === 2 ? '是否发布?' : '是否取消发布?'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (count === 1) this.delete(id)
          else this.release(count, id)
        })
        .catch(() => {
          return
        })
    },
    delete(id) {
      this.$http
        .deleteLesson({ id })
        .then(res => {
          console.log(res)
          this.$refs.table.onSearchKeep()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
        .catch(err => {
          this.$message({
            message: err.data.errMsg,
            type: 'error'
          })
        })
    },
    release(count, id) {
      let params = {
        id,
        isRelease: count === 2 ? true : false
      }
      this.$http.releaseLesson(params).then(res => {
        console.log('updateRelease == ', res.data || 0)
        this.$refs.table.onSearchKeep()
        this.$message({
          message: count === 2 ? '发布成功' : '取消成功',
          type: 'success'
        })
      })
    },
    close(flag) {
      this.updateId = ''
      this.digFromWrap = false
      if (typeof flag == 'boolean' && flag) {
        this.$refs.table.onSearchKeep()
      }
    },
    closeSimple() {
      this.simpleVisible = false
    },
    getMobileUrl() {
      this.$http.getMobileUrl().then(res => {
        console.log(res.data)
        this.shareBase = res.data.data.url + this.shareBase
      })
    },
    getVisible(id) {
      this.simpleVisible = true
      this.wxQRCodeOptions = {
        name: 'courseShare',
        scene: id || ''
      }
      // 小蜘蛛H5没有课程，小程序才有
      // this.shareLink = `${this.shareBase}id=${id}`
      // this.simpleVisible = true;
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
    }
  }
}
</script>
