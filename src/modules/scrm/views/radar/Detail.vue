<template>
  <div class="radar-detail">
    <div class="top-nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">雷达详情</el-button>
    </div>
    <div class="container">
      <div class="overview">
        <div class="left">
          <div class="left-item">
            <span class="item-label">标题：</span><span>{{ radarModel.title }}</span>
          </div>
          <div class="left-item" v-if="radarModel.type === 'link'" style="display:flex">
            <span class="item-label">链接：</span><div style="width:500px;text-align: justify;text-justify: newspaper;word-break: break-all;">{{ radarModel.link }}</div>
          </div>
          <div class="left-item" v-if="radarModel.type === 'file'">
            <span class="item-label">文件：</span><span>{{ radarModel.fileName }}</span>
          </div>
          <div class="left-item-row">
            <div class="row-col">
              <span class="item-label">创建时间：</span><span>{{ radarModel.createTime }}</span>
            </div>
            <div class="row-col">
              <span class="item-label">行为通知：</span
              ><span>{{ radarModel.isBehaviorNotice ? '已开启' : '已关闭' }}</span>
            </div>
            <div class="row-col">
              <span class="item-label">动态通知：</span
              ><span>{{ radarModel.isActionNotice ? '已开启' : '已关闭' }}</span>
            </div>
          </div>
          <div class="left-item">
            <span class="item-label">客户标签：</span>
            <template v-if="radarModel.behaviorTagList && radarModel.behaviorTagList.length > 0">
              <span class="item-tag" v-for="(item, index) in radarModel.behaviorTagList" :key="index">{{
                item.name
              }}</span>
            </template>
            <template v-else>
              <span>暂无</span>
            </template>
          </div>
        </div>
        <div class="right">
          <div class="right-title">数据详情</div>
          <div class="right-statistics">
            <div class="s-item item-divider">
              <div class="count">{{ radarSta.visitPeopleQuantity }}</div>
              <div class="name">总点击人数</div>
            </div>
            <div class="s-item item-divider">
              <div class="count">{{ radarSta.visitQuantity }}</div>
              <div class="name">总点击次数</div>
            </div>
            <div class="s-item item-divider">
              <div class="count">{{ radarSta.todayVisitPeopleQuantity }}</div>
              <div class="name">今日点击人数</div>
            </div>
            <div class="s-item">
              <div class="count">{{ radarSta.todayVisitQuantity }}</div>
              <div class="name">今日点击次数</div>
            </div>
          </div>
        </div>
      </div>
      <div class="customer-list">
        <div class="query-table-box">
          <el-form inline label-width="80px" label-position="right" size="small">
            <el-form-item label="客户名称">
              <el-input
                placeholder="请输入要搜索的客户"
                v-model="searchForm.customerName"
                @input="searchOpenList"
              ></el-input>
            </el-form-item>
            <el-form-item label="成员名称">
              <el-input
                placeholder="请输入要搜索的成员"
                v-model="searchForm.userName"
                @input="searchOpenList"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="点击渠道">
              <el-select>
                <el-option></el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="时间筛选">
              <el-date-picker
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item> -->
            <!-- <el-form-item label="所属成员">
              <div>选择列表</div>
            </el-form-item> -->
          </el-form>
        </div>
        <div class="common-table-box">
          <el-table :data="tableData" id="table" :header-cell-style="{ 'text-align': 'center' }" :height="tableHeight">
            <el-table-column label="客户" prop="customerName" align="center"></el-table-column>
            <el-table-column label="客户头像" align="center">
              <template slot-scope="scope">
                <el-image style="width: 50px; height: 50px" :src="scope.row.customerAvatar" fit="fill"></el-image>
              </template>
            </el-table-column>
            <el-table-column label="所属成员" prop="userName" align="center"></el-table-column>
            <el-table-column label="最近点击时间" prop="visitTime" align="center">
              <template slot-scope="scope">
                <div>{{ scope.row.visitTime | formatterTime }}</div>
              </template>
            </el-table-column>
            <el-table-column label="最近点击渠道" prop="channel" align="center">
              <template slot-scope="scope">
                <div>{{ scope.row.channel | channelType }}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="客户点击总次数"></el-table-column> -->
            <el-table-column label="操作" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="goToCustomerDetail(scope.row)">客户详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="common-pagination">
          <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComPagination from '../../components/common/ComPagination'
export default {
  components: { ComPagination },
  data() {
    return {
      interactRadarId: '',
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      tableHeight: 400,
      radarModel: {},
      radarSta: {},
      searchForm: {
        channel: '', // 点击渠道
        customerName: '', // 客户名称
        userName: '' // 所属成员名称
      }
    }
  },
  filters: {
    channelType(val) {
      switch (val) {
        case 'speechcraft':
          return '话术库'
        case 'material':
          return '素材库'
      }
    },
    formatterTime(time) {
      return time.slice(0, time.length - 3)
    }
  },
  created() {
    if (this.$route.query.id) {
      this.interactRadarId = this.$route.query.id
      this.getRadarDetail()
      this.getStatVisitByRadarId()
      this.getOpenList()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  },
  destroyed() {
    window.onresize = ''
  },
  methods: {
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_TOP_HEIGHT = 20
      this.tableHeight =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_TOP_HEIGHT
    },
    // 雷达详情
    getRadarDetail() {
      this.$http.getInteractRadarDetail({ id: this.interactRadarId }).then((res) => {
        this.radarModel = res.data.data
      })
    },
    // 雷达访问数据
    getStatVisitByRadarId() {
      this.$http.getStatVisitByRadarId({ radarId: this.interactRadarId }).then((res) => {
        this.radarSta = res.data.data
      })
    },
    // 获取打开链接的客户列表
    getOpenList() {
      let params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum,
        interactRadarId: this.interactRadarId,
        channel: this.searchForm.channel,
        customerName: this.searchForm.customerName,
        userName: this.searchForm.userName
      }
      this.$http.getInteractRadarOpenList(params).then((res) => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getOpenList()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getOpenList()
    },
    // 搜索打开链接的客户列表
    searchOpenList() {
      this.page.pageNum = 1
      this.getOpenList()
    },
    goToCustomerDetail(row) {
      this.$router.push(`/main/scrm/customer-management/customer/detail?id=${row.customerId}&wxid=${row.wxCustomerId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.top-nav {
  margin-bottom: 20px;
}
.container {
  font-size: 14px;
  .overview {
    display: flex;
    line-height: 20px;
    margin-bottom: 20px;
    .left {
      padding: 20px;
      background: #ffffff;
      flex-basis: 55%;
      margin-right: 20px;
      .left-item {
        margin-bottom: 20px;
        .item-label {
          color: #909399;
        }
        .item-tag {
          display: inline-block;
          padding: 5px;
          margin: 0 5px 5px;
          background-color: #f2f2f2;
          border-radius: 3px;
        }
      }
      .left-item:last-child {
        margin-bottom: 0;
      }
      .left-item-row {
        display: flex;
        flex-flow: wrap;
        .row-col {
          flex-basis: calc(50% - 10px);
          margin-bottom: 20px;
          .item-label {
            color: #909399;
          }
        }
      }
    }
    .right {
      padding: 20px;
      background: #ffffff;
      flex-basis: 45%;
      .right-title {
        padding-bottom: 20px;
        border-bottom: 1px solid #f2f2f2;
      }
      .right-statistics {
        display: flex;
        background: #fbfdff;
        border: 1px solid #cfe8ff;
        .s-item {
          position: relative;
          flex: 1;
          padding: 30px 0;
          text-align: center;
          .count {
            margin-bottom: 10px;
          }
        }
        .item-divider {
          &::after {
            content: '';
            width: 1px;
            height: 38px;
            background: #e9e9e9;
            position: absolute;
            top: 50%;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
            right: 0;
          }
        }
      }
    }
  }
  .customer-list {
    background: #ffffff;
    .query-table-box {
      padding: 20px 20px 0 20px;
    }
    .common-table-box {
      padding: 0 20px;
    }
  }
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
</style>
