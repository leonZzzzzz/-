<template>
  <div class="ranking-div">
    <div class="common-table-search">
      <el-select size="small" v-model="value" placeholder="请选择" @change="handleChange">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
      <span style="line-height:32px;font-size:14px; color:#606266;margin-left:20px;margin-right:12px">成员</span>
      <el-input
        size="small"
        placeholder="请输入成员名称"
        v-model="name"
        style="width:200px"
        @input="changeInput"
        clearable
      ></el-input>
    </div>
    <div class="common-table-box">
      <el-table
        :data="tableData"
        width="100%"
        id="table"
        class="el-table"
        :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
        :height="height"
      >
        <el-table-column align="center" prop="name" label="姓名"> </el-table-column>
        <el-table-column align="center" label="头像">
          <template slot-scope="scope">
            <div>
              <img :src="scope.row.avatar" style="width:50px;height:50px;border-radius:10px" />
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="rank" label="排名"></el-table-column>
        <el-table-column align="center" label="拉新数" prop="quantity"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import ComPagination from '../../components/common/ComPagination'
export default {
  components: {
    ComPagination
  },
  data() {
    return {
      tableData: [],
      height: 400,
      value: 'nowWeek',
      name: '',
      nowDate: '', //本周周一
      lastData: '', //上周周一
      nowMonth: '',
      lastMonth: '',
      options: [
        {
          value: 'nowWeek',
          label: '本周'
        },
        {
          value: 'lastWeek',
          label: '上周'
        },
        {
          value: 'nowMonth',
          label: '本月'
        },
        {
          value: 'lastMonth',
          label: '上月'
        }
      ]
    }
  },
  methods: {
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.height =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT
    },
    //改变选项之后的钩子函数
    handleChange(val) {
      if (val == 'nowWeek') {
        this.getNewRankWeek(this.nowDate)
        return
      }
      if (val == 'lastWeek') {
        this.getNewRankWeek(this.lastData)
        return
      }
      if (val == 'nowMonth') {
        this.getNewRankMonth(this.nowMonth)
        return
      }
      if (val == 'lastMonth') {
        this.getNewRankMonth(this.lastMonth)
        return
      }
    },
    //输入框改变时候
    changeInput() {
      if (this.value == 'nowWeek') {
        this.getNewRankWeek(this.nowDate)
        return
      }
      if (this.value == 'lastWeek') {
        this.getNewRankWeek(this.lastData)
        return
      }
      if (this.value == 'nowMonth') {
        this.getNewRankMonth(this.nowMonth)
        return
      }
      if (this.value == 'lastMonth') {
        this.getNewRankMonth(this.lastMonth)
        return
      }
    },
    //接口部分
    //按周查询接口
    getNewRankWeek(day) {
      let params = {
        day: day,
        scope: 'crop',
        name: this.name
      }
      this.$http.getNewRankWeek(params).then((res) => {
        this.tableData = res.data.data
      })
    },
    getNewRankMonth(day) {
      let params = {
        day: day,
        scope: 'crop',
        name: this.name
      }
      this.$http.getNewRankMonth(params).then((res) => {
        this.tableData = res.data.data
      })
    },
    //获取本周一上周一
    setNowTimes() {
      var now = new Date()
      var nowTime = now.getTime()
      var day = now.getDay()
      var oneDayTime = 24 * 60 * 60 * 1000
      //显示周一
      var MondayTime = nowTime - (day - 1) * oneDayTime
      //显示周日
      var SundayTime = nowTime + (day - 10) * oneDayTime

      //初始化日期时间
      var monday = new Date(MondayTime)
      let yy = monday.getFullYear() + '-'
      let mm = (monday.getMonth() + 1 < 10 ? '0' + (monday.getMonth() + 1) : monday.getMonth() + 1) + '-'
      let dd = monday.getDate() < 10 ? '0' + monday.getDate() : monday.getDate()
      var sunday = new Date(SundayTime)
      let lyy = sunday.getFullYear() + '-'
      let lmm = (sunday.getMonth() + 1 < 10 ? '0' + (sunday.getMonth() + 1) : sunday.getMonth() + 1) + '-'
      let ldd = sunday.getDate() < 10 ? '0' + sunday.getDate() : sunday.getDate()
      this.nowDate = yy + mm + dd
      this.lastData = lyy + lmm + ldd
      //打印查看结果
    },
    //获取当前月的第一天
    CurrentMonthFirst() {
      var date = new Date()
      date.setDate(1)
      let lyy = date.getFullYear() + '-'
      let lmm = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let ldd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      this.nowMonth = lyy + lmm + ldd
    },
    //获取上个月的第一天
    CurrenLastFrist() {
      var enddate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      let lyy = enddate.getFullYear() + '-'
      let lmm = (enddate.getMonth() + 1 < 10 ? '0' + (enddate.getMonth() + 1) : enddate.getMonth() + 1) + '-'
      let ldd = enddate.getDate() < 10 ? '0' + enddate.getDate() : enddate.getDate()
      this.lastMonth = lyy + lmm + ldd
    }
  },
  created() {
    this.setNowTimes()
    this.CurrentMonthFirst()
    this.CurrenLastFrist()
    this.getNewRankWeek(this.nowDate)
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.ranking-div {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #fff;
  .common-table-search {
    padding: 20px;
    background-color: #fff;
    display: flex;
  }
  .common-table-box {
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>
