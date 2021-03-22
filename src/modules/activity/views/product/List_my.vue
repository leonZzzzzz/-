<template>
  <div class="qc-table">
    <!-- 数据列表 -->
    <div class="operation_btns">
      <ul>
        <li>
          <el-button type="primary" @click="insert">新建</el-button>
        </li>
      </ul>
    </div>
    <div class="table" id="table" :style="`height:${height}px`">
      <div class="card_item" v-for="(item, index) in tableData" :key="index">
        <div class="card_content">
          <div class="image">
            <el-image :src="imgHost + item.iconUrl" fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <div class="content">
            <p class="title">
              {{ item.title }}&nbsp;&nbsp;&nbsp;<el-tag
                :type="item.isRelease ? 'success' : 'danger'"
                effect="plain"
                size="mini"
                >{{ item.isRelease ? '公开' : '隐藏' }}</el-tag
              >
            </p>
            <p>
              报名费用：<span :class="[item.isEnableFee ? 'green' : 'red']">{{
                item.isEnableFee ? '免费' : '付费'
              }}</span>
            </p>
            <!-- <p>报名人数：{{ (index * Math.random() * 10).toFixed() }}人</p> -->
            <p>活动时间：{{ item.startTime }} 至 {{ item.endTime }}</p>
          </div>
          <div class="share">
            <ul>
              <li><i class="el-icon-share" title="分享" @click="getVisible(2, index)"></i></li>
            </ul>
          </div>
        </div>
        <div class="card_operation">
          <ul>
            <li>
              <el-button icon="el-icon-link" type="text" @click="getHomeUrl()">首页链接</el-button>
            </li>
            <li>
              <el-button icon="el-icon-document" type="text" @click="detail(index)">报名详情</el-button>
            </li>
            <li>
              <el-button icon="el-icon-edit-outline" type="text" @click="update(1, index)">修改</el-button>
            </li>
            <li>
              <el-button icon="el-icon-document-copy" type="text" @click="update(2, index)">复制</el-button>
            </li>
            <li>
              <el-button icon="el-icon-document-checked" type="text" @click="deleteConfirm(2, index)">发布</el-button>
            </li>
            <li>
              <el-button icon="el-icon-document-delete" type="text" @click="deleteConfirm(3, index)"
                >取消发布</el-button
              >
            </li>
            <li>
              <el-button icon="el-icon-delete" type="text" @click="deleteConfirm(1, index)">删除</el-button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="pagination">
      <div class="pagination-count">
        <span class="count">共：{{ pageData.total }}&nbsp;条数据</span>
      </div>
      <el-pagination
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-sizes="[15, 30, 50]"
        :page-size="pageData.pageSize"
        :current-page="pageData.pageNum"
        :total="pageData.total"
        layout="prev, pager, next, sizes"
        background
        style="margin-right: -26px"
      ></el-pagination>
    </div>
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
        style="font-size: 14px; color: #888; padding: 10px 0"
      >
        注: 如果您的应用对接的是小程序，请使用小程序码分享
      </p>
      <div style="display: flex">
        <div style="display: flex">
          <el-input size="small" style="width: 400px" v-model="shareLink"></el-input>
          <el-button size="small" type="primary" style="margin: 0 15px" @click="copy(shareLink)">复制</el-button>
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
const tableConfig = {
  // 接口地址
  url: '',
  // 组件的尺寸
  size: 'mini',
  // 查询/重置按钮
  showSearchAndReset: true,
  // 是否需要显示分页
  showPagination: true,
  // table 是否充满屏幕
  isFull: true,
  // table 的高度，isFull 为false 才生效
  height: 400,
  response: {
    list: 'data.data.list',
    total: 'data.data.total'
  }
}
import qs from 'qs'
import Qrcode from '@xkeshi/vue-qrcode'
export default {
  data() {
    return {
      isLoading: false,
      // 查询
      pageData: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      height: 400,
      // 表单列表
      tableData: [],
      // 对话框
      simpleVisible: false,
      shareLink: '',
      shareHost: '',
      // 首页链接
      wxQRCodeOptions: {
        name: '',
        scene: ''
      }
    }
  },
  components: { Qrcode },
  created() {
    this.pageActivity({})
    this.getMobileUrl()
    console.log(this.$store.state.appTypeList)
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  },
  destroyed() {
    window.onresize = ''
  },
  methods: {
    //  ---数据渲染函数---
    // 分页
    onSizeChange(val) {
      this.pageData.pageSize = val
      this.pageActivity({})
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.pageActivity({})
    },
    // 表格高度
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20
      this.height =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        10
    },
    // 对话框
    closeSimple() {
      this.simpleVisible = false
    },
    // 首页链接
    getHomeUrl() {
      this.shareLink = `${this.homeUrl}`
      this.wxQRCodeOptions = {
        name: 'activityHome',
        scene: ''
      }
      this.simpleVisible = true
    },
    // 添加
    insert() {
      this.$router.push('/main/activity/product/form-next')
    },
    // 详情
    detail(index) {
      this.$router.push(`/main/activity/product/detail?id=${this.tableData[index].id}`)
    },
    // 修改 1 复制 2
    update(count, index) {
      this.updateId = this.tableData[index].id
      if (count === 1) {
        if (this.tableData[index].isRelease) {
          this.$router.push(`/main/activity/product/form-next?id=${this.tableData[index].id}&isRelease=true`)
        } else {
          this.$router.push(`/main/activity/product/form-next?id=${this.tableData[index].id}`)
        }
      } else {
        this.$router.push(`/main/activity/product/form-next?id=${this.tableData[index].id}&copy=true`)
      }
    },
    // 删除1 发布2 取消发布3
    deleteConfirm(count, index) {
      let text = { 1: '是否删除该数据?', 2: '是否发布?发布后不可修改付费状态', 3: '是否取消发布?' }[count]
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (count === 1) {
            this.$http.deleteActivity({ id: this.tableData[index].id }).then(() => {
              // this.$refs.table.onSearchKeep()
              this.pageActivity({})
              this.$message.success('删除成功')
            })
          } else {
            this.release(count, index)
          }
        })
        .catch(() => {
          return
        })
    },
    // 发布 取消发布
    release(count, index) {
      let params = {
        id: this.tableData[index].id,
        isRelease: count === 2 ? true : false
      }
      this.$http.releaseActivity(params).then((res) => {
        console.log('updateRelease == ', res.data || 0)
        this.pageActivity({})
        this.$message({
          message: count === 2 ? '发布成功' : '取消成功',
          type: 'success'
        })
      })
    },
    // 分享
    getVisible(count, index) {
      if (count === 1) this.actVisible = true
      if (count === 2) {
        this.shareLink = `${this.shareHost}id=${this.tableData[index].id}`
        this.wxQRCodeOptions = {
          name: this.tableData[index].showStyle === 2 ? 'activityDetailCommission' : 'activityDetail',
          scene: this.tableData[index].id || ''
        }
        this.simpleVisible = true
      }
    },
    // 对话框
    // 复制
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
    // ---获取数据函数---
    pageActivity(options) {
      this.isLoading = true
      options.pageSize = this.pageData.pageSize
      options.pageNum = this.pageData.pageNum
      this.$http.pageActivity(options).then((res) => {
        this.tableData = res.data.data.list
        this.pageData.total = res.data.data.total
        this.isLoading = false
      })
    },
    getMobileUrl() {
      this.$http.getMobileUrl().then((res) => {
        this.shareHost = res.data.data.url + '/mobile/POUND/activity/detail?wo=1&wot=2&woacm=1&mpl=1&'
        this.homeUrl = res.data.data.url + '/mobile/POUND/activity?wo=1&wot=2&woacm=1&mpl=1'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card_item {
  padding: 10px 20px 0;
  margin-bottom: 10px;
  border-radius: 3px;
  background-color: #fff;
  .card_content {
    display: flex;
    position: relative;
    .image {
      .el-image {
        width: 200px;
        height: 100px;
      }
    }
    .content {
      margin-left: 20px;
      p {
        line-height: 22px;
        font-size: 14px;
        color: #606266;
        .red {
          color: #f56c6c;
        }
        .green {
          color: #67c23a;
        }
      }
      .title {
        font-size: 16px;
        margin-bottom: 10px;
      }
    }
    .share {
      position: absolute;
      top: 0;
      right: 0;
      ul {
        display: flex;
        li {
          padding: 5px;
          i {
            color: #94a5bd;
            cursor: pointer;
            font-size: 18px;
            &:hover {
              color: #294a7b;
            }
          }
        }
      }
    }
  }
  .card_operation {
    height: 40px;
    border-top: 1px solid #ebeef5;
    margin-top: 10px;
    ul {
      width: 100%;
      height: 40px;
      display: flex;
      li {
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        margin-right: 20px;
      }
    }
  }
}
.operation_btns {
  margin-bottom: 10px;
  background-color: #fff;
  padding: 10px 20px;
  ul {
    display: flex;
    li {
      margin-right: 10px;
    }
  }
}
.table {
  overflow-y: auto;
}
.qc-table {
  // background-color: #fff;
  // padding: 0 10px;
  .pagination {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 10px 15px;
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
</style>
