<template>
  <div class="detail">
    <go-back title="详情"></go-back>
    <div class="detail-content">
      <div class="query-table">
        <el-form label-width="80px" label-position="right" size="small" inline>
          <el-form-item label="微信昵称">
            <el-input placeholder="请输入会员昵称" v-model="searchForm.appellation" @input="searchRecordList" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="会员姓名">
            <el-input placeholder="请输入姓名" v-model="searchForm.name" @input="searchRecordList" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="中奖时间">
            <el-date-picker
              v-model="searchForm.dateTimeRange"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="searchRecordList"
              clearable
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="tabs-box">
        <el-tabs v-model="activeId" type="card" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in awardData" :key="index" :label="item.title" :name="item.id">
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="common-table-box">
        <com-table id="table" :tableData="tableData" :isFull="false" :height="tableHeight" :column="column"></com-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import GoBack from '../../components/components/GoBack'
import ComTable from '../../components/common/ComTable'
import ComPagination from '../../components/common/ComPagination'
export default {
  components: { GoBack, ComTable, ComPagination },
  data() {
    return {
      activeId: '',
      awardData: [],
      tableHeight: 400,
      tableData: [],
      column: [
        {
          label: '微信头像',
          align: 'center',
          formatter: (row) => {
            return <img src={row.headImage} alt="" width="60" height="60" />
          }
        },
        {
          label: '微信昵称',
          align: 'center',
          prop: 'appellation'
        },
        {
          label: '会员姓名',
          align: 'center',
          prop: 'name'
        },
        {
          label: '会员手机',
          align: 'center',
          prop: 'mobilePhoneNumber'
        },
        {
          label: '奖品标题',
          align: 'center',
          prop: 'awardTitle'
        },
        // {
        //   label: '图标',
        //   align: 'center',
        //   formatter: (row) => {
        //     return (
        //       <div>{row.awardIcon ? <img src={row.host + row.awardIcon} alt="" width="60" height="60" /> : ''}</div>
        //     )
        //   }
        // },
        {
          label: '中奖时间',
          align: 'center',
          prop: 'createTime',
          formatter: (row) => {
            return row.createTime ? row.createTime.slice(0, row.createTime.length - 3) : ''
          }
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      searchForm: {
        name: '',
        appellation: '',
        dateTimeRange: ''
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getAwardsList(this.$route.query.id)
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
      const OTHER_HEIGHT = 172
      this.tableHeight = window.innerHeight - document.querySelector('#table').offsetTop - OTHER_HEIGHT
    },
    getAwardsList(id) {
      this.$http.getLotteryAward({ id }).then((res) => {
        this.awardData = res.data.data
        if (this.awardData.length > 0) {
          this.activeId = this.awardData[0].id
          this.getRecordList()
        }
      })
    },
    handleClick(tab) {
      this.activeId = tab.name
      this.getRecordList()
    },
    getRecordList() {
      let date = this.searchForm.dateTimeRange
      let startTime = ''
      let endTime = ''
      if (date) {
        startTime = date[0]
        endTime = date[1]
      }
      let params = {
        id: this.activeId,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        startTime: startTime,
        endTime: endTime,
        name: this.searchForm.name,
        appellation: this.searchForm.appellation
      }
      this.$http.getLotteryResult(params).then((res) => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getRecordList()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getRecordList()
    },
    searchRecordList() {
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.getRecordList()
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-content {
  background: #ffffff;
  padding: 20px 20px 0 20px;
}
</style>
