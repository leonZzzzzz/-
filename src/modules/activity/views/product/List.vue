<template>
  <div class="wrap" ref="wrap">
    <QcTable
      ref="table"
      :option="option"
      :search-form="searchForm"
      :showSearchButtons="false"
      :menu="menu"
      :column="column"
      @row-click="rowClick"
    ></QcTable>
    <LinkDialog :id="tableRow.id" :channel="channel" :visible="actVisible" @close="closeLink"></LinkDialog>
    <el-dialog
      title="活动链接"
      :visible.sync="simpleVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="closeSimple"
      width="880px"
    >
      <p
        v-if="$store.state.appTypeList.some((item) => item === 3)"
        style="font-size: 14px;color: #888;padding: 10px 0;"
      >
        注: 如果您的应用对接的是小程序，请使用小程序码分享
      </p>
      <div style="display: flex;">
        <div style="display: flex;">
          <el-input size="small" style="width: 400px;" v-model="shareLink"></el-input>
          <el-button size="small" type="primary" style="margin: 0 15px;" @click="copy(shareLink)">复制</el-button>
          <el-popover placement="right" width="300" trigger="click">
            <qrcode :value="shareLink" v-if="shareLink" tag="img" :options="{ size: 300 }"></qrcode>
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
import LinkDialog from './LinkDialog'
import Qrcode from '@xkeshi/vue-qrcode'

export default {
  components: { LinkDialog, Qrcode },
  data() {
    return {
      digFromWrap: false,
      actVisible: false,
      checkVisible: false,
      simpleVisible: false,
      showMiniQRcode: false,
      updateId: '',
      wxQRCodeOptions: {
        name: '',
        scene: ''
      },
      option: {
        url: 'api/admin/v1/activity/page',
        size: 'small'
      },
      searchForm: [
        {
          label: '活动名称',
          formName: 'title',
          type: 'input',
          value: ''
        }
      ],
      column: [
        { type: 'index', label: '序号', align: 'center', width: 50 },
        {
          prop: 'iconUrl',
          label: '图标',
          align: 'center',
          width: 70,
          formatter: (row) => {
            return <img src={this.imgHost + row.iconUrl} alt="" width="60" height="60" />
          }
        },
        { prop: 'title', label: '活动名称' },
        {
          prop: 'isEnableFee',
          label: '付费活动',
          align: 'center',
          formatter: (row) => {
            return row.isEnableFee ? '是' : '否'
          }
        },
        {
          prop: 'isRelease',
          label: '发布',
          align: 'center',
          formatter: (row) => {
            if (row.isRelease) return '是'
            else return '否'
          }
        },
        // { prop: 'place', label: '地点', },
        // { prop: 'address', label: '详细地址', },
        { prop: 'startTime', label: '开始时间', align: 'center' },
        { prop: 'endTime', label: '结束时间', align: 'center' },
        { prop: 'createTime', label: '创建时间', align: 'center' }
      ],
      menu: [
        { label: '添加', type: 'primary', on: this.insert },
        {
          label: '修改',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: () => {
            this.update(1)
          }
        },
        {
          label: '复制',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: () => {
            this.update(2)
          }
        },
        {
          label: '报名详情',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.detail
        },
        {
          label: '分享',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: () => {
            this.getVisible(2)
          }
        },
        {
          label: '首页链接',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.getHomeUrl
        },
        {
          label: '发布',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined || currentRow.isRelease,
          on: () => {
            this.deleteConfirm(2)
          }
        },
        {
          label: '取消发布',
          type: 'danger',
          disabled: ({ currentRow }) => currentRow.id == undefined || !currentRow.isRelease,
          on: () => {
            this.deleteConfirm(3)
          }
        },
        {
          label: '删除',
          type: 'danger',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: () => {
            this.deleteConfirm(1)
          }
        }
      ],
      channel: [],
      shareHost: '',
      homeUrl: '',
      shareLink: '',
      tableRow: {}
    }
  },
  created() {
    this.getMobileUrl()
    console.log(this.$store.state.appTypeList)
    // this.activityOrderTypeGet()
  },
  methods: {
    // 获取排序规则
    activityOrderTypeGet() {
      this.$http.activityOrderTypeGet().then((res) => {
        if (res.data.data.value == 1) {
          this.showData.unshift({
            prop: 'seqNum',
            label: '序号',
            template: 'seqNum'
          })
        } else {
          this.showData.unshift({
            template: 'index'
          })
        }
      })
    },
    getMobileUrl() {
      this.$http.getMobileUrl().then((res) => {
        this.shareHost = res.data.data.url + '/mobile/POUND/activity/detail?wo=1&wot=2&woacm=1&mpl=1&'
        this.homeUrl = res.data.data.url + '/mobile/POUND/activity?wo=1&wot=2&woacm=1&mpl=1'
      })
    },
    getUrl() {
      this.$router.push('/main/activity/schedule')
    },
    rowClick(row) {
      this.tableRow = row
    },
    listChannel() {
      this.$http.listChannel({ pageSize: 20, pageNum: 1, name: '', mobile: '' }).then((res) => {
        console.log('listChannel === ', res.data)
        this.channel = res.data.data.list
      })
    },
    insert() {
      this.$router.push('/main/activity/product/form-next')
    },
    update(count) {
      this.updateId = this.tableRow.id
      if (count === 1) {
        if (this.tableRow.isRelease) {
          this.$router.push(`/main/activity/product/form-next?id=${this.tableRow.id}&isRelease=true`)
        } else {
          this.$router.push(`/main/activity/product/form-next?id=${this.tableRow.id}`)
        }
      } else {
        this.$router.push(`/main/activity/product/form-next?id=${this.tableRow.id}&copy=true`)
      }
    },
    detail() {
      this.$router.push(`/main/activity/product/detail?id=${this.tableRow.id}`)
    },
    release(count) {
      let params = {
        id: this.tableRow.id,
        isRelease: count === 2 ? true : false
      }
      this.$http.releaseActivity(params).then((res) => {
        console.log('updateRelease == ', res.data || 0)
        this.$refs.table.onSearchKeep()
        this.$message({
          message: count === 2 ? '发布成功' : '取消成功',
          type: 'success'
        })
      })
    },
    deleteConfirm(count) {
      let text = { 1: '是否删除该数据?', 2: '是否发布?发布后不可修改付费状态', 3: '是否取消发布?' }[count]
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (count === 1) {
            this.$http.deleteActivity({ id: this.tableRow.id }).then(() => {
              this.$refs.table.onSearchKeep()
              this.$message.success('删除成功')
            })
          } else {
            this.release(count)
          }
        })
        .catch(() => {
          return
        })
    },
    close(flag) {
      this.updateId = ''
      this.digFromWrap = false
      if (typeof flag == 'boolean' && flag) {
        this.$refs.table.onSearchKeep()
      }
    },
    getVisible(count) {
      if (count === 1) this.actVisible = true
      if (count === 2) {
        this.shareLink = `${this.shareHost}id=${this.tableRow.id}`
        this.wxQRCodeOptions = {
          name: this.tableRow.showStyle === 2 ? 'activityDetailCommission' : 'activityDetail',
          scene: this.tableRow.id || ''
        }
        this.simpleVisible = true
      }
    },
    getHomeUrl() {
      this.shareLink = `${this.homeUrl}`
      this.wxQRCodeOptions = {
        name: 'activityHome',
        scene: ''
      }
      this.simpleVisible = true
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import url(https://at.alicdn.com/t/font_651752_ipp18k2gxo.css);
.icon {
  position: absolute;
  right: 16px;
  top: 10px;
  font-size: 24px;
  cursor: pointer;
}
</style>
