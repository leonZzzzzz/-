<template>
  <div class="platform-management">
    <div class="m-top">
      <div class="m-top-left">
        <span>店铺成员&nbsp;&nbsp;</span>
        <span
          >成员可以通过&nbsp;&nbsp;”企成互动”&nbsp;&nbsp;公众号实时收到店铺状态通知（包括：活动报名提醒/新订单提醒/捐赠成功通知等）</span
        >
      </div>
      <div class="m-top-right">
        <span>最多可添加10个</span>
        <el-button type="primary" @click="addManager">添加</el-button>
      </div>
    </div>
    <div class="m-content" :style="search.total > 15 ? 'padding-bottom: 53px;' : ''">
      <div class="member-list">
        <div class="list-item" v-for="(item, index) in managerList" :key="index">
          <div class="item-left">
            <div class="left-img">
              <el-avatar :size="64" shape="square" :src="item.headImage" @error="errorHandler">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
              </el-avatar>
            </div>
            <div class="left-info">
              <div class="info-name">{{ item.appellation }}</div>
              <div class="info-time">{{ getTime(item.createTime) }}</div>
            </div>
          </div>
          <div class="item-right" @click="deleteManager(item.id, item.appellation)">删除</div>
        </div>
      </div>
    </div>
    <div class="pagination" v-if="search.total > 15">
      <div class="pagination-count">
        <span class="count">共：{{ search.total }}&nbsp;条数据</span>
      </div>
      <el-pagination
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-sizes="[15, 30, 50]"
        :page-size="search.pageSize"
        :current-page="search.pageNum"
        :total="search.total"
        layout="prev, pager, next, sizes"
        background
        style="margin-right: -26px;"
      ></el-pagination>
    </div>
    <el-dialog
      title="添加店铺成员"
      width="560px"
      append-to-body
      :close-on-click-modal="false"
      :visible="dialogVisiable"
      :before-close="closeDialog"
    >
      <div class="dialog-content">
        <qrcode :value="qrCodeForm.href" tag="img" :options="{ size: 180 }"></qrcode>
        <div class="c-status" v-if="scanStatus === 'new'">
          <div class="status-desc">请成员使用微信扫码加入店铺</div>
          <div class="status-tips">此操作在30分钟后过期，请尽快联系成员绑定</div>
        </div>
        <div class="c-status c-status-change" v-if="scanStatus === 'confirmed'">
          <i class="el-icon-success icon-success"></i>
          <span class="status-desc">确认成功</span>
        </div>
        <div class="c-status c-status-change" v-if="scanStatus === 'expired'">
          <i class="el-icon-success icon-success"></i>
          <span class="status-desc">已过期</span>
        </div>
        <div class="c-status" v-if="scanStatus === 'scanned'">
          <div class="c-status-change">
            <i class="el-icon-success icon-success"></i>
            <span class="status-desc">扫描成功</span>
          </div>
          <div class="status-desc sucess-desc">请在微信上进行后续操作</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Qrcode from '@xkeshi/vue-qrcode'

export default {
  components: {
    Qrcode
  },
  data() {
    return {
      managerList: [],
      dialogVisiable: false,
      scanStatus: 'new', // 扫描状态：new=新建，scanned=已扫描，cancel=已取消，confirmed=已确认，expired=已过期
      qrCodeForm: {},
      timer: '',
      // 分页查询
      search: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      maxQuantity: 0
    }
  },
  created() {
    this.getManagerList()
    this.getMaxQuantity()
  },
  methods: {
    // 获取成员列表
    getManagerList() {
      let pageNum = this.search.pageNum
      let pageSize = this.search.pageSize
      this.$http.getManagerList({ pageNum, pageSize }).then((res) => {
        this.managerList = res.data.data.list
        this.search.total = res.data.data.total
      })
    },
    // 获取最大数量
    getMaxQuantity() {
      this.$http.getMaxQuantity().then((res) => {
        this.maxQuantity = res.data.data
      })
    },
    // 添加成员，生成注册码
    addManager() {
      if (this.search.total < this.maxQuantity) {
        this.dialogVisiable = true
        // 生成注册码
        let pagePath = '/app-manager-h5/POUND/codeComfirm' // 页面路径
        this.$http.createQrCode({ pagePath }).then((res) => {
          this.qrCodeForm = res.data.data
          // 获取注册码成功每两秒轮询一次获取状态码的接口并显示当前状态码的状态
          this.timer = setInterval(() => {
            this.getQrCodeStatus()
          }, 2000)
        })
      } else {
        // 限制最大数量
        this.$message({
          showClose: true,
          message: '成员已达最大数量！',
          type: 'warning'
        })
      }
    },
    // 删除成员
    deleteManager(id, appellation) {
      // 提示弹窗
      this.$confirm('是否删除店铺成员“' + appellation + '”', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteManager({ id, appellation }).then((res) => {
          this.$message.success('删除成功')
          // 刷新列表
          this.search.pageNum = 1
          this.getManagerList()
        })
      })
    },
    // 获取注册码扫描状态
    getQrCodeStatus() {
      let id = this.qrCodeForm.id // 二维码地址
      this.$http.getQrCodeStatus({ id }).then((res) => {
        let scanStatus = res.data.data.scanStatus
        this.scanStatus = scanStatus
        // 扫码状态确认成功刷新数据
        if (scanStatus === 'confirmed') {
          this.search.pageNum = 1
          this.getManagerList()
        }
      })
    },
    // 关闭弹窗清除二维码表单,扫码状态，轮询
    closeDialog() {
      this.dialogVisiable = false
      this.scanStatus = 'new'
      this.qrCodeForm = {}
      clearInterval(this.timer)
    },
    errorHandler() {
      return true
    },
    getTime(createTime) {
      return createTime.split(' ')[0] || createTime
    },
    onSizeChange(val) {
      this.search.pageSize = val
      this.onSearch()
    },
    onPageChange(val) {
      this.search.pageNum = val
      this.onSearchKeep()
    },
    onSearch() {
      this.search.pageNum = 1
      this.getManagerList()
    },
    onSearchKeep() {
      this.getManagerList()
    }
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.platform-management {
  width: calc(100% + 10px);
  height: 100%;
  overflow-x: auto;
  background: #fff;
  box-sizing: border-box;
  .m-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    margin-bottom: 20px;
    .m-top-left {
      flex-shrink: 1;
      margin-right: 10px;
      line-height: 20px;
      span {
        &:first-child {
          font-size: 16px;
        }
      }
    }
    .m-top-right {
      min-width: 220px;
      span {
        margin-right: 10px;
      }
    }
  }
  .m-content {
    .member-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .list-item {
        width: calc(20% - 20px);
        min-width: 280px;
        padding: 12px;
        box-sizing: border-box;
        border-radius: 6px;
        background-color: #f4f4f4;
        margin-right: 20px;
        font-size: 14px;
        display: flex;
        margin-bottom: 20px;
        .item-left {
          flex: 1;
          margin-right: 20px;
          display: flex;
          .left-img {
            margin-right: 8px;
          }
          .left-info {
            display: flex;
            flex-direction: column;
            .info-name {
              line-height: 32px;
              font-size: 16px;
            }
            .info-time {
              color: #bbbbbb;
            }
          }
        }
        .item-right {
          font-size: 16px;
          color: #294a7b;
          align-self: flex-end;
          cursor: pointer;
        }
      }
    }
  }
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 10px 15px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    border-top: 1px solid #eee;
    &-count {
      height: 28px;
      line-height: 28px;
      font-size: 14px;
      color: #7b7b7b;
      .count {
        margin-right: 20px;
      }
    }
  }
}
.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0 80px 0;
  text-align: center;
  .c-status {
    margin-top: 30px;
    .status-desc {
      font-size: 16px;
      color: #000000;
    }
    .icon-success {
      font-size: 22px;
      color: #4ac836;
      margin-right: 8px;
    }
    .status-tips {
      font-size: 14px;
      color: #bbbbbb;
      margin-top: 16px;
    }
    .sucess-desc {
      margin-top: 10px;
    }
  }
  .c-status-change {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
::v-deep .el-button--primary {
  width: 114px;
}
</style>
