<template>
  <div>
    <div class="xfo-chart-main">
      <div class="xfo-search">
        <el-form ref="form" label-width="auto" :inline="true">
          <el-form-item label-width="0">
            <el-select
              v-model="searchData.selectValue"
              placeholder="请选择"
              size="small"
              style="width: 90px"
              @change="selectChange"
            >
              <el-option label="昨天" value="昨天"></el-option>
              <el-option label="本周" value="本周"></el-option>
              <el-option label="本月" value="本月"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="按时间">
            <el-date-picker
              v-model="searchData.selectTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              @change="datePickerChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="按员工">
            <el-select
              v-model="searchData.wxUserId"
              clearable
              placeholder="请选择"
              size="small"
              style="width: 120px"
              @change="wxUserIdChange"
            >
              <el-option
                v-for="(item, index) in department"
                :key="index"
                :label="item.name"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="xfo-btn"><el-button type="text" @click="generateImages">保存为图片</el-button></div>
      </div>
      <div class="xfo-chart">
        <div id="xfo-chart" ref="chart" style="width: 100%; height: 500px"></div>
      </div>
    </div>
    <div class="xfo-table">
      <div class="xfo-table-header">
        <sta-title class="xfo-title">详细数据</sta-title>
        <el-button class="xfo-btn" type="text" @click="exportData">下载数据</el-button>
      </div>
      <table-list :tableData="tableData" :tableColumn="tableColumn"></table-list>
    </div>
  </div>
</template>

<script>
// 引入 ECharts 主模块
import echarts, { dataTool } from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import html2canvas from 'html2canvas'
import debounce from 'lodash/debounce';
import qs from 'qs'
import StaTitle from '../components/StaTitle.vue'
import TableList from '@/modules/scrm/components/components/TableList.vue'
let myChart;
export default {
  components: { StaTitle, TableList },
  created() {},
  mounted() {
    this.getMemberPage()
    this.selectChange()
    window.addEventListener("resize", this.myChartResize)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.myChartResize)
  },
  data() {
    return {
      searchData: {
        selectValue: '本月',
        selectTime: '',
        wxUserId: ''
      },
      dataTime: {
        startDay: '',
        endDay: ''
      },
      total: [], //客户总数
      add: [], //增长数
      request: [], //申请数
      deleted: [], //被客户删除数
      netGrowth: [], //净增长数
      dateTime: [],
      department: [], // 部门数据
      pickerMinDate: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        disabledDate: time => {
          if (this.pickerMinDate !== '') {
            let day30 = 24 * 60 * 60 * 1000 * 30
            return (
              time.getTime() > this.pickerMinDate + day30 ||
              time.getTime() < this.pickerMinDate - day30 ||
              time.getTime() > new Date().getTime() ||
              time.getTime() < new Date(2021, 0, 1).getTime()
            )
          }
          return time.getTime() > new Date().getTime() || time.getTime() < new Date(2021, 0, 1).getTime()
        }
      },
      tableData: [],
      tableColumn: [
        {
          prop: 'day',
          title: '时间',
          align: 'center'
        },
        {
          prop: 'total',
          title: '客户总数',
          align: 'center'
        },
        {
          prop: 'add',
          title: '新增客户数',
          align: 'center'
        },
        {
          prop: 'request',
          title: '申请客户数',
          align: 'center'
        },
        {
          prop: 'deleted',
          title: '被客户删除/拉黑数',
          align: 'center'
        },
        {
          prop: 'netGrowth',
          title: '净增长数',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    myChartResize: debounce(function () {
      console.log('resize窗口大小发生变化 对 scrm statistics下的图表 进行重新布局')
      myChart && myChart.resize()
    }, 500),
    /*页面渲染*/
    drawChart() {
      myChart = echarts.init(document.getElementById('xfo-chart'))
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['客户总数', '新增客户数', '申请客户数', '被客户删除/拉黑数', '净增长数'],
          icon: 'circle'
          // selected: {
          //   客户总数: true,
          //   新增客户数: false,
          //   申请客户数: false,
          //   '被客户删除/拉黑数': false,
          //   员工删除客户数: false,
          //   净增长数: false
          // }
        },

        grid: {
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          name: '（日期）',
          boundaryGap: false,
          data: this.dateTime,
          interval: 1
        },
        yAxis: {
          type: 'value',
          name: '（人数）',
          minInterval: 1
        },
        series: [
          {
            name: '客户总数',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#F47378'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'RGB(244,115,120,.1)'
                },
                {
                  offset: 1,
                  color: 'RGB(244,115,120,0)'
                }
              ])
            },
            stack: '客户总数',
            data: this.total,
            symbolSize: 10
          },
          {
            name: '新增客户数',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#55E1DF'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(85,225,223,.1)'
                },
                {
                  offset: 1,
                  color: 'rgba(85,225,223,0)'
                }
              ])
            },
            stack: '新增客户数',
            data: this.add,
            symbolSize: 10
          },
          {
            name: '申请客户数',
            type: 'line',
            smooth: true,

            itemStyle: {
              color: '#E36F96'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(227,111,150,.1)'
                },
                {
                  offset: 1,
                  color: 'rgba(227,111,150,0)'
                }
              ])
            },
            stack: '申请客户数',
            data: this.request,
            symbolSize: 10
          },
          {
            name: '被客户删除/拉黑数',
            type: 'line',
            smooth: true,

            itemStyle: {
              color: '#FBA848'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'RGB(251,168,72,.1)'
                },
                {
                  offset: 1,
                  color: 'RGB(251,168,72,0)'
                }
              ])
            },
            stack: '被客户删除/拉黑数',
            data: this.deleted,
            symbolSize: 10
          },
          {
            name: '净增长数',
            type: 'line',
            smooth: true,

            itemStyle: {
              color: '#519CFB'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'RGB(81,156,251,.1)'
                },
                {
                  offset: 1,
                  color: 'RGB(81,156,251,0)'
                }
              ])
            },
            stack: '净增长数',
            data: this.netGrowth,
            symbolSize: 10
          }
        ]
      })
    },
    // 生成图片
    generateImages() {
      html2canvas(this.$refs.chart).then(canvas => {
        let urlBase64 = canvas.toDataURL('image/jpeg')
        let a = document.createElement('a')
        let event = new MouseEvent('click')
        a.download = '客户增长折线图'
        a.href = urlBase64
        a.dispatchEvent(event)
      })
    },
    // 选择切换
    selectChange() {
      let type = this.searchData.selectValue
      this.searchData.selectTime = this.setTextTime(type)
      this.dataTime.startDay = this.searchData.selectTime[0]
      this.dataTime.endDay = this.searchData.selectTime[1]
      this.customerGrowthList({})
    },
    // 成员切换
    wxUserIdChange() {
      console.log(this.searchData.wxUserId)
      this.customerGrowthList({})
    },
    datePickerChange() {
      this.dataTime.startDay = this.searchData.selectTime[0]
      this.dataTime.endDay = this.searchData.selectTime[1]
      this.customerGrowthList({})
      this.searchData.selectValue = ''
    },
    setTextTime(type) {
      let d = new Date()
      let c_time = d.getTime() //当前时间的毫秒时间
      let c_day = d.getDay() || 7 //当前时间的星期几
      let oneDayLong = 24 * 60 * 60 * 1000 //一天的毫秒数
      let m_time, s_time, dateStart, dateEnd, date, month_date_start, month_date_end
      switch (type) {
        case '昨天':
          m_time = c_time - 1 * oneDayLong //昨天的毫秒时间
          date = this.formatMSecond(m_time)
          return [date, date]
        case '本周':
          m_time = c_time - (c_day - 1) * oneDayLong //当前周一的毫秒时间
          // s_time = m_time + 6 * oneDayLong
          dateStart = this.formatMSecond(m_time)
          dateEnd = this.formatMSecond(d.getTime())
          return [dateStart, dateEnd]
        case '本月':
          month_date_start = new Date(d.getFullYear(), d.getMonth(), 1).getTime()
          // month_date_end =
          //   new Date(d.getFullYear(), d.getMonth() + 1 > 12 ? 1 : d.getMonth() + 1, 1).getTime() - oneDayLong
          dateStart = this.formatMSecond(month_date_start)
          dateEnd = this.formatMSecond(d.getTime())
          return [dateStart, dateEnd]
      }
    },
    formatMSecond(time) {
      let d = new Date(time)
      let m = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
      let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      let date = `${d.getFullYear()}-${m}-${day}`
      return date
    },
    /*获取数据*/
    // 获取成员变化数据
    customerGrowthList(options) {
      options.startDay = this.dataTime.startDay
      options.endDay = this.dataTime.endDay
      options.wxUserId = this.searchData.wxUserId
      this.total = []
      this.add = []
      this.request = []
      this.deleted = []
      this.netGrowth = []
      this.dateTime = []
      this.$http.customerGrowthList(options).then(res => {
        let data = res.data.data
        this.tableData = data
        data.forEach(item => {
          this.total.push(item.total)
          this.add.push(item.add)
          this.request.push(item.request)
          this.deleted.push(item.deleted)
          this.netGrowth.push(item.netGrowth)
          this.dateTime.push(`${Math.abs(item.day.split('-')[1])}/${Math.abs(item.day.split('-')[2])}`)
        })
        console.log(this.tableData)
        console.log(this.netGrowth)
        this.drawChart()
      })
    },
    // 获取成员数据
    getMemberPage() {
      this.$http.getMemberPage().then(res => {
        this.department = res.data.data.list
        // this.department.unshift({
        //   name: '全部',
        //   wxUserId: ''
        // })
        console.log(this.department)

      })
    },
    // 导出数据
    exportData() {
      let options = {
        startDay: this.dataTime.startDay,
        endDay: this.dataTime.endDay,
        wxUserId: this.searchData.wxUserId
      }
      this.$confirm('是否导出当前列表', '操作提示', {
        confirmButtonText: '导出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.open(this.baseUrl + '/api/admin/v1/customer-growth/export?' + qs.stringify(options))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.xfo-search,
.xfo-table-header {
  display: flex;
  .xfo-btn {
    margin-left: auto;
  }
}
.xfo-table {
  .xfo-title {
    margin: 20px 0;
  }
}

</style>
