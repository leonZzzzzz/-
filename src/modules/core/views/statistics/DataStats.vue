<template>
  <div>
    <!-- <p v-if="!checkedCities.length" style="padding: 40px;text-align: center;color: #888;">暂无概况信息</p> -->
    <div class="section">
      <FormTypeTitle text="商城概况">
        <div style="margin-top: 15px; padding: 15px 15px 0 15px; background: #fff">
          <el-form
            :inline="true"
            :model="searchData"
            class="search-form"
            size="small"
          >
            <el-form-item
              label="快捷查看"
              style="margin-right: 20px"
            >
              <el-radio-group
                v-model="searchData.time"
                @change="timeChange"
              >
                <el-radio-button label="today">今日</el-radio-button>
                <el-radio-button label="yesterday">昨日</el-radio-button>
                <el-radio-button label="week">最近7日</el-radio-button>
                <el-radio-button label="month">最近30日</el-radio-button>
              </el-radio-group>
              <!-- <i class="el-icon-error closeDate" @click="clearTime"></i> -->
            </el-form-item>
            <el-form-item
              label="选择日期"
              style="margin-right: 20px"
            >
              <el-date-picker
                v-model="daterange"
                type="daterange"
                unlink-panels
                :clearable="false"
                @change="dateChange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
              <i
                class="el-icon-error closeDate"
                @click="clearDate"
              ></i>
            </el-form-item>
          </el-form>
        </div>
        <el-row
          :gutter="0"
          class="row"
        >
          <el-col
            :span="5"
            class="col"
          >
            <p class="label">支付订单数</p>
            <p class="value">{{ countPayOrder.payOrderNum }}</p>
          </el-col>
          <el-col
            :span="5"
            class="col"
          >
            <p class="label">支付金额(元)</p>
            <p class="value">{{ countPayOrder.payNum | formatPrice }}</p>
          </el-col>
          <el-col
            :span="5"
            class="col"
          >
            <p class="label">退款金额(元)</p>
            <p class="value">{{ countPayOrder.refundAmount | formatPrice }}</p>
          </el-col>
          <el-col
            :span="5"
            class="col"
          >
            <p class="label">净增长金额(元)</p>
            <p class="value">{{ (countPayOrder.payNum - countPayOrder.refundAmount) | formatPrice }}</p>
          </el-col>
        </el-row>
        <el-row :gutter="0" class="row">
          <p style="font-size: 12px; padding: 0 20px; padding-top: 15px; color: #888">
            注：数据量大时可在图表上通过鼠标拖拽、鼠标滚轮来缩放或漫游数据
          </p>
          <div id="chart" style="width: 100%; height: 400px; margin: 0 auto; background: #fff; overflow: auto"></div>
        </el-row>
      </FormTypeTitle>
    </div>
  </div>
</template>

<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/dataZoom')
import debounce from 'lodash/debounce';
let myChart;
export default {
  data() {
    return {
      isShowMall: false,
      checkedCities: [],
      daterange: [],
      searchData: {
        time: 'today',
        startTime: '',
        endTime: ''
      },
      countPayOrder: {
        payNum: 0,
        payOrderNum: 0
      }
    }
  },
  mounted() {
    // this.getDataStatisticsConfig()
    this.getCountPayOrder()
    window.addEventListener("resize", this.myChartResize)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.myChartResize)
  },
  methods: {
    myChartResize: debounce(function () {
      console.log('resize窗口大小发生变化 对 scrm statistics下的图表 进行重新布局')
      myChart && myChart.resize()
    }, 500),
    getDataStatisticsConfig() {
      this.$http.getDataStatisticsConfig({ appId: this.id }).then((res) => {
        if (!res.data.message) return
        this.checkedCities = res.data.message.split('_')
        if (this.checkedCities.findIndex(item => item === 'mall') >= 0) {
          this.isShowMall = true
          this.getCountPayOrder()
        }
      })
    },
    getCountPayOrder() {
      this.$http.countPayOrder(this.searchData).then(res => {
        if (!res.data.data) return
        this.countPayOrder = res.data.data
      })
      this.getChartData(this.searchData)
    },
    timeChange(e) {
      this.daterange = []
      this.searchData.startTime = ''
      this.searchData.endTime = ''
      this.getCountPayOrder()
    },
    dateChange(e) {
      console.log('dateChange===>', e)
      if (e && e.length > 0) {
        this.searchData.time = ''
        this.searchData.startTime = e[0] + ' 00:00:00'
        this.searchData.endTime = e[1] + ' 23:59:59'
      } else {
        this.searchData.startTime = ''
        this.searchData.endTime = ''
      }
      this.getCountPayOrder()
    },
    clearDate() {
      this.daterange = []
      this.searchData.startTime = ''
      this.searchData.endTime = ''
      this.searchData.time = 'today'
      this.getCountPayOrder()
    },
    getChartData(params) {
      this.$http
        .countPayOrderChart(params)
        .then((res) => {
          let data = res.data.data
          let payCountToRefundCount = []
          data.payCount.forEach((item, index) => {
            payCountToRefundCount.push(data.payCount[index] - data.refundCount[index])
          })

          console.log('这是数据', data)
          console.log('payCountToRefundCount',payCountToRefundCount);
          let seriesData = [
            {
              name: '支付订单数',
              type: 'line',
              smooth: true,
              areaStyle: {
                color: 'rgba(84, 158, 255, .2)'
              },
              data: data.orderCount
            },
            {
              name: '支付金额',
              type: 'line',
              smooth: true,
              areaStyle: {
                color: 'rgba(103, 194, 58, .2)'
              },
              data: data.payCount.map(item => (item / 100).toFixed(2))
            },
            {
              name: '退款金额',
              type: 'line',
              smooth: true,
              areaStyle: {
                color: 'rgba(103, 194, 58, .2)'
              },
              data: data.refundCount.map((item) => (item / 100).toFixed(2))
            },
            {
              name: '净增长金额',
              type: 'line',
              smooth: true,
              areaStyle: {
                color: 'rgba(103, 194, 58, .2)'
              },
              data: payCountToRefundCount.map((item) => (item / 100).toFixed(2))
            }
          ]
          this.onInitChart(data.dateStr, seriesData)
        })
        .catch(() => {
          this.onInitChart([], [])
        })
    },
    onInitChart(xData, seriesData) {
      // 基于准备好的dom，初始化echarts实例
      myChart = echarts.init(document.getElementById('chart'))
      // 绘制图表
      myChart.setOption({
        color: ['#409EFF', '#67C23A', '#555'],
        title: {
          text: ''
        },
        legend: {
          data: ['支付订单数', '支付金额', '退款金额', '净增长金额'],
          top: '10px',
          left: '20px'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {}
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData,
          axisLine: {
            lineStyle: {
              color: '#555'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#555'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: seriesData
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  margin-top: 10px;
  background: #fff;
}
.col {
  background: #fff;
  margin-right: 20px;
  padding: 20px;
  padding-top: 12px;
  .label {
    color: #888;
    font-size: 14px;
  }
  .value {
    margin-top: 20px;
    font-size: 28px;
  }
}

.closeDate {
  display: inline-block;
  font-size: 18px;
  color: #444;
  padding: 0 10px;
  cursor: pointer;
  transform: translate(0px, 2px);
}
.search-form {
  ::v-deep.el-form-item {
    margin-bottom: 15px !important;
  }
}
</style>
