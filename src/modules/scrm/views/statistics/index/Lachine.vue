<template>
  <div>
    <div class="xfo-chart-main">
      <div class="xfo-search">
        <el-form ref="form" label-width="auto" :inline="true">
          <el-form-item label-width="0">
            <el-select
              v-model="searchData.period"
              placeholder="请选择"
              size="small"
              style="width: 90px"
              @change="selectChange"
            >
              <!-- <el-option label="全部" value="all"></el-option> -->
              <el-option label="上周" value="lastWeek"></el-option>
              <el-option label="本周" value="thisWeek"></el-option>
              <el-option label="上月" value="lastMonth"></el-option>
              <el-option label="本月" value="thisMonth"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="按部门">
            <el-select v-model="searchData.deptId" placeholder="请选择" size="small" @change="customerChange" clearable>
              <el-option
                v-for="(item, index) in department"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="xfo-btn"><el-button type="text" disabled>下载数据</el-button></div>
      </div>
    </div>
    <div class="xfo-table">
      <table-list :tableData="tableData" :tableColumn="tableColumn" :tableHeight="tableHeight"></table-list>
    </div>
  </div>
</template>

<script>
import TableList from '@/modules/scrm/components/components/TableList.vue'
export default {
  components: { TableList },
  created() {
    this.getDepartmentPage()
    this.addNewCustomerRankList({})
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
    })
  },
  data() {
    return {
      searchData: {
        period: 'thisMonth',
        deptId: ''
      },
      department: [], // 部门数据
      tableData: [],
      tableHeight: 400,
      tableColumn: [
        {
          prop: 'avatar',
          title: '头像',
          align: 'center',
          formatter: row => {
            return <el-image style="width: 44px; height: 44px" src={row.avatar} fit="fit"></el-image>
          }
        },
        {
          prop: 'name',
          title: '姓名',
          align: 'center'
        },
        {
          prop: 'quantity',
          title: '拉新数',
          align: 'center'
        },
        {
          prop: 'department',
          title: '部门',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    /*页面渲染*/
    // 选择切换
    selectChange() {
      this.addNewCustomerRankList({})
    },
    getTableHeight() {
      this.tableHeight = window.innerHeight - 420
    },
    customerChange() {
      this.addNewCustomerRankList({})
    },
    /*获取数据*/
    // 获取成员变化数据
    addNewCustomerRankList(options) {
      options.period = this.searchData.period
      options.deptId = this.searchData.deptId
      this.$http.addNewCustomerRankList(options).then(res => {
        this.tableData = res.data.data
      })
    },
    // 获取部门数据
    getDepartmentPage() {
      this.$http.getDepartmentPage().then(res => {
        this.department = res.data.data.list
        this.searchData.selectCustomer = this.department[0].id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.xfo-search {
  display: flex;
  .xfo-btn {
    margin-left: auto;
  }
}
</style>