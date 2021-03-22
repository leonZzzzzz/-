<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div ref="header" style="min-width: 850px;">
      <qc-header title="捐赠记录"></qc-header>
    </div>
    <div class="area-box" ref="areaBox" :style="{ height: `${areaHeight}px`, 'overflow-y': 'auto' }">
      <div class="top">
        <p class="title">{{ detail.title }}</p>
      </div>
      <div class="table-box">
        <el-table :data="list" v-loading="loading">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            v-for="(item, i) in propData"
            :key="i"
            v-if="!item.template"
            :align="item.align || 'center'"
          ></el-table-column>
          <el-table-column
            :align="item.align || 'center'"
            v-else-if="item.template == 'isAnonymity'"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="scope">{{ scope.row.isAnonymity ? '***' : scope.row[item.prop] }}</template>
          </el-table-column>
          <el-table-column
            :align="item.align || 'center'"
            v-else-if="item.template == 'price'"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="scope">{{ scope.row[item.prop] || 0 | price }}</template>
          </el-table-column>
          <el-table-column
            :align="item.align || 'center'"
            v-else-if="item.template == 'Boolean'"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="scope">{{ scope.row[item.prop] ? '是' : '否' }}</template>
          </el-table-column>
          <el-table-column align="center" v-else-if="item.template == 'img'" :label="item.label" :width="140">
            <template slot-scope="scope">
              <img
                style="display:block;margin:10px auto"
                :src="`${imgHost}/attachments/images/default-head-img.png`"
                width="60"
                height="60"
                v-if="scope.row.isAnonymity"
              />
              <img
                style="display:block;margin:10px auto"
                :src="`${scope.row[item.prop]}`"
                width="60"
                height="60"
                v-else
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center; padding: 10px; 0"
          @current-change="handleCurrentChange"
          :current-page="1"
          layout="total, prev, pager, next"
          :total="page.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import QcHeader from 'commonSchool/QcHeader'
import api from 'apiSchool/common'

export default {
  components: {
    QcHeader
  },
  data() {
    return {
      fixedTab: false,
      dataLoading: false,
      loading: false,
      detail: {},
      areaHeight: 0,
      page: {
        total: 0,
        pageSize: 20,
        pageNum: 1,
        sourceId: this.$route.query.id
      },
      propData: [
        { prop: 'headImage', label: '头像', template: 'img' },
        { prop: 'donator', label: '捐赠人', template: 'isAnonymity' },
        { prop: 'amount', label: '捐赠金额', template: 'price' },
        { prop: 'phone', label: '手机', template: 'isAnonymity' },
        { prop: 'mailbox', label: '邮箱', template: 'isAnonymity' },
        { prop: 'isContacts', label: '校友', template: 'Boolean' },
        { prop: 'isAnonymity', label: '匿名', template: 'Boolean' },
        { prop: 'isNeedReceipt', label: '收据', template: 'Boolean' },
        { prop: 'content', label: '祝语' },
        { prop: 'createTime', label: '捐赠时间' }
      ],
      list: []
    }
  },
  created() {
    this.getDonate(this.$route.query.id)
    this.donateRecordPage()
  },
  mounted() {
    this.getHeight()
    window.onresize = () => {
      this.getHeight()
    }
  },
  methods: {
    getHeight() {
      this.areaHeight = window.innerHeight - 170
    },
    getDonate(id) {
      api.getDonate({ id: id }).then(res => {
        this.detail = res.data.data
        this.dataLoading = false
      })
    },
    donateRecordPage() {
      this.loading = true
      api.donateRecordPage(this.page).then(res => {
        console.log(res.data)
        this.list = res.data.data.list
        this.page.total = res.data.data.total
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.donateRecordPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.area-box {
  min-width: 850px;
  .top {
    height: 90px;
    display: flex;
    align-items: center;
    width: 100%;
    .title {
      font-size: 22px;
      padding: 0 30px;
    }
    .desc {
      color: #686868;
      margin-top: 10px;
      padding-left: 30px;
      span {
        margin-right: 30px;
      }
    }
  }
  .fixed-tab {
    position: absolute;
    top: 70px;
    z-index: 1;
    right: 37px;
    left: 238px;
    z-index: 1;
    min-width: calc(850px - 17px);
  }
  .content {
    padding: 20px;
    .active-title {
      background-color: rgb(252, 252, 252);
      padding: 10px;
      border: 1px solid #f3f3f3;
    }
    .time {
      background-color: rgb(252, 252, 252);
      padding: 10px;
      font-size: 15px;
    }
    .padding {
      padding: 10px 0;
    }
    .search-box {
      .el-form-item {
        margin-bottom: 0 !important;
      }
    }
    .select-btn {
      display: flex;
      justify-content: space-between;
      .left {
        display: inline-flex;
        align-items: center;
        p {
          margin-right: 20px;
          span {
            color: rgb(66, 149, 251);
            padding: 0 5px;
          }
        }
      }
    }
    .detail {
      .item {
        margin-bottom: 20px;
        .title {
          margin-bottom: 10px;
          padding-left: 10px;
          line-height: 1;
          position: relative;
          &:before {
            position: absolute;
            content: '';
            border-left: 3px solid #3091f2;
            left: 0;
            top: 0;
            bottom: 0;
          }
        }
        .context {
          p {
            line-height: 2;
            display: flex;
            span {
              margin-left: 10px;
              &:first-child {
                margin-left: 0;
                color: rgb(129, 129, 129);
                width: 90px;
                flex-shrink: 0;
                text-align: right;
              }
              img {
                width: 200px;
              }
            }
            .info {
              max-width: 630px;
            }
          }
        }
      }
      .content-box {
        .title {
          margin-left: 0;
          color: #818181;
          width: 90px;
          text-align: right;
          line-height: 2;
        }
        .detail-content {
          width: 700px;
          max-height: 700px;
          overflow: auto;
          border: 1px solid #ececec;
          padding: 10px;
        }
      }
    }
  }
}
.table-box {
  margin: 20px;
  border: 1px solid #f3f3f3;
}
.table-box .el-table thead tr th {
  background-color: #f5f7fa;
}
</style>
