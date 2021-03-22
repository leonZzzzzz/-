<template>
  <div class="section">
    <FormTypeTitle text="商品分析">
      <div style="margin-top: 15px;padding: 15px 15px 0 15px;background: #fff;">
        <el-form :inline="true" :model="searchData" class="search-form" size="small">
          <el-form-item label="快捷查看" style="margin-right: 20px;">
            <el-radio-group v-model="searchData.time" @change="timeChange">
              <el-radio-button label="today">今日</el-radio-button>
              <el-radio-button label="yesterday">昨日</el-radio-button>
              <el-radio-button label="week">最近7日</el-radio-button>
              <el-radio-button label="month">最近30日</el-radio-button>
            </el-radio-group>
            <!-- <i class="el-icon-error closeDate" @click="clearTime"></i> -->
          </el-form-item>
          <el-form-item label="选择日期" style="margin-right: 20px;">
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
            <i class="el-icon-error closeDate" @click="clearDate"></i>
          </el-form-item>
          <el-form-item label="商品名称" style="margin-right: 20px;">
            <el-input placeholder="请输入名称" v-model="searchData.name" @clear="clearName" clearable>
              <div slot="append" @click="countPayAndProductOrder">查询</div>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="apiExport">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" v-loading="tableLoading" style="width: 100%;margin-top: 15px;">
        <el-table-column prop="name" label="商品名称"> </el-table-column>
        <el-table-column prop="num" align="center" label="销售量"> </el-table-column>
        <el-table-column prop="payAmount" align="center" label="销售额(元)"> </el-table-column>
      </el-table>
    </FormTypeTitle>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data() {
    return {
      tableLoading: false,
      daterange: [],
      searchData: {
        time: 'today',
        startTime: '',
        endTime: '',
        name: ''
      },
      tableData: []
    }
  },
  created() {
    this.countPayAndProductOrder()
  },
  methods: {
    apiExport() {
      let url = `${this.baseUrl}/api/admin/mall/v1/order/countPayAndProductOrderExcel?${qs.stringify(this.searchData)}`
      window.open(url)
      // location.href = url
    },
    countPayAndProductOrder() {
      this.tableLoading = true
      this.$http
        .countPayAndProductOrder(this.searchData)
        .then((res) => {
          this.tableLoading = false
          if (!res.data.data) return
          this.tableData = res.data.data
          this.tableData.map((item) => {
            item.payAmount = (item.payAmount / 100).toFixed(2)
          })
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    timeChange(e) {
      this.daterange = []
      this.searchData.startTime = ''
      this.searchData.endTime = ''
      this.countPayAndProductOrder()
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
      this.countPayAndProductOrder()
    },
    clearName() {
      this.countPayAndProductOrder()
    },
    clearTime() {
      this.searchData.time = ''
      this.countPayAndProductOrder()
    },
    clearDate() {
      this.daterange = []
      this.searchData.startTime = ''
      this.searchData.endTime = ''
      this.searchData.time = 'today'
      this.countPayAndProductOrder()
    }
  }
}
</script>

<style lang="scss" scoped>
// .section{
// padding: 0 15px;
// background: #fff;
// }
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
