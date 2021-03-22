<template>
  <div class="container">
    <div class="query-table-box">
      <el-button size="small" type="primary" @click="addLottery">添加抽奖</el-button>
      <div class="search-content">
        <el-form label-width="100px" label-position="right" size="small">
          <el-form-item label="抽奖标题">
            <el-input placeholder="请输入抽奖标题" v-model="search.title" @input="searchLottery"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="common-table-box">
      <el-table
        :data="tableData"
        width="100%"
        id="table"
        :height="tableHeight"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="标题" align="center" prop="title"></el-table-column>
        <el-table-column label="开始时间" align="center" prop="startTime">
          <template slot-scope="scope">
            <div>{{ scope.row.startTime | formatterTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="endTime">
          <template slot-scope="scope">
            <div>{{ scope.row.endTime | formatterTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <div>{{ scope.row.status | statusType }}</div>
          </template>
        </el-table-column>
        <el-table-column label="使用次数" align="center" prop="usedTimes"></el-table-column>
        <el-table-column label="抽奖次数限制类型" align="center" prop="limitType">
          <template slot-scope="scope">
            <div>{{ scope.row.limitType | limitType }}</div>
          </template>
        </el-table-column>
        <el-table-column label="限制次数" align="center" prop="limitTimes"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="scope">
            <div>{{ scope.row.createTime | formatterTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 'not-start'">
              <LotteryQRCode :lotteryId=scope.row.id text :label="'分享'"></LotteryQRCode>
              <el-button type="text" @click="goToDetail(scope.row.id)">详情</el-button>
              <el-popover
                placement="bottom"
                width="50"
                trigger="hover"
                style="margin-left: 10px"
                popper-class="select-popover"
              >
                <div class="popover-btns">
                  <el-button type="text" @click="updateLottery(scope.row.id)">修改</el-button>
                  <el-button type="text" @click="deleteLottery(scope.row.id)">删除</el-button>
                </div>
                <el-button slot="reference" type="text">更多</el-button>
              </el-popover>
            </div>
            <div v-else-if="scope.row.status == 'ongoing'">
              <el-button type="text" @click="lotteryStop(scope.row.id)">中止</el-button>
              <LotteryQRCode :lotteryId=scope.row.id text :label="'分享'"></LotteryQRCode>
              <el-button type="text" @click="goToDetail(scope.row.id)">详情</el-button>
              <el-popover
                placement="bottom"
                width="50"
                trigger="hover"
                style="margin-left: 10px"
                popper-class="select-popover"
              >
                <div class="popover-btns">
                  <el-button type="text" @click="updateLottery(scope.row.id)">修改</el-button>
                  <el-button type="text" @click="deleteLottery(scope.row.id)">删除</el-button>
                </div>
                <el-button slot="reference" type="text">更多</el-button>
              </el-popover>
            </div>
            <div v-else-if="scope.row.status == 'stop'">
              <el-button type="text" @click="lotteryRecovery(scope.row.id)">恢复</el-button>
              <LotteryQRCode :lotteryId=scope.row.id text :label="'分享'"></LotteryQRCode>
              <el-button type="text" @click="goToDetail(scope.row.id)">详情</el-button>
              <el-popover
                placement="bottom"
                width="50"
                trigger="hover"
                style="margin-left: 10px"
                popper-class="select-popover"
              >
                <div class="popover-btns">
                  <el-button type="text" @click="updateLottery(scope.row.id)">修改</el-button>
                  <el-button type="text" @click="deleteLottery(scope.row.id)">删除</el-button>
                </div>
                <el-button slot="reference" type="text">更多</el-button>
              </el-popover>
            </div>
            <div v-else-if="scope.row.status == 'end'">
              <LotteryQRCode :lotteryId=scope.row.id text :label="'分享'"></LotteryQRCode>
              <el-button type="text" @click="goToDetail(scope.row.id)">详情</el-button>
              <el-button type="text" @click="deleteLottery(scope.row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="common-pagination">
      <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
    </div>
  </div>
</template>

<script>
import ComPagination from '../../components/common/ComPagination'
import LotteryQRCode from './LotteryQRCode'
export default {
  components: { ComPagination, LotteryQRCode},
  data() {
    return {
      activeName: 'first',
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      search: {
        title: ''
      },
      tableData: [],
      tableHeight: 400,
      qrcode: {},
    }
  },
  filters: {
    limitType(val) {
      switch (val) {
        case 'total':
          return '每人可抽N次'
        case 'day':
          return '每人每天可抽N次'
      }
    },
    statusType(val) {
      switch (val) {
        case 'not-start':
          return '未开始'
        case 'ongoing':
          return '进行中'
        case 'stop':
          return '已停止'
        case 'end':
          return '已结束'
      }
    },
    formatterTime(time) {
      if (time) {
        return time.slice(0, time.length - 3)
      }
    }
  },
  created() {
    this.getLotteryPage()
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
      const OTHER_HEIGHT = 152
      this.tableHeight = window.innerHeight - document.querySelector('#table').offsetTop - OTHER_HEIGHT
    },
    getLotteryPage() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        title: this.search.title
      }
      this.$http.getRollingLotteryPage(params).then((res) => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getLotteryPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getLotteryPage()
    },
    searchLottery() {
      this.page.pageNum = 1
      this.getLotteryPage()
    },
    lotteryStop(id) {
      this.$confirm('中止后，不可以再抽奖', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.stopRollingLottery({ id }).then(() => {
          this.$message.success('已中止')
          this.getLotteryPage()
        })
      })
    },
    lotteryRecovery(id) {
      this.$confirm('恢复后，可继续抽奖', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.recoveryRollingLottery({ id }).then(() => {
          this.$message.success('已恢复')
          this.getLotteryPage()
        })
      })
    },
    updateLottery(id) {
      this.$router.push(`/main/scrm/lottery/form?id=${id}`)
    },
    deleteLottery(id) {
      this.$confirm('删除该抽奖', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteRollingLottery({ id: id }).then(() => {
          this.$message.success('删除成功')
          this.getLotteryPage()
        })
      })
    },
    addLottery() {
      this.$router.push(`/main/scrm/lottery/form`)
    },
    goToDetail(id) {
      this.$router.push(`/main/scrm/lottery/detail?id=${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
.query-table-box {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
  .search-content {
    display: flex;
    align-items: center;
  }
}
.common-table-box {
  padding: 0 20px;
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
</style>

<style lang="scss">
.select-popover {
  min-width: 70px;
  .popover-btns {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .el-button {
    margin-left: 0;
  }
}
</style>
