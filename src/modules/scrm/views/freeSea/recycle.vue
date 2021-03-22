<template>
  <div class="customer-colony">
    <!-- <div class="header_nav" style="margin-bottom: 20px">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.push(`./list?nowIndex=${nowIndex}`)"
        >客户回收</el-button
      >
    </div> -->
    <!-- <div class="cutomer-title">
      当通用规则（指所有员工）和特殊化规则（指个人规则）同时存在的情况下，员工则执行特殊化规则。比如，张三既在通用规则，又在特殊化规则，那么，就按特殊化规则执行。
    </div> -->
    <div style="padding: 0 20px">
      <el-alert
        title="当通用规则（指所有员工）和特殊化规则（指个人规则）同时存在的情况下，员工则执行特殊化规则。比如，张三既在通用规则，又在特殊化规则，那么，就按特殊化规则执行。"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
    </div>
    <div class="container">
      <div class="hold" v-if="!bottomrules">
        持有规则：还没有设置持有规则，点击设置->
        <el-button type="text" style="margin-left: 20px" @click="showhold = true" icon="el-icon-edit-outline"
          >设置</el-button
        >
      </div>
      <div class="hold" v-else ref="cycleRules">
        <span>持有规则：每个员工分配客户上限 {{ bottomrules.unCustomerCount | bottomrulesFileter }}个 ，</span>
        <span v-if="bottomrules.isExtension"
          >允许员工延期{{ bottomrules.extensionDays | bottomrulesFileter }} 天 ，</span
        >
        <span>{{ bottomrules.pickAgainDays | bottomrulesFileter }}天后员工可捡回。</span>
        <el-button
          size="small"
          type="text"
          style="margin-left: 20px"
          @click=";(showhold = true), (cycleId = bottomrules.id)"
          icon="el-icon-edit-outline"
          >修改</el-button
        >
      </div>
      <div class="operating-btn">
        <el-button size="small" type="primary" @click="showrule = true">新增客户回收规则</el-button>
        <el-button size="small" @click="refreshRecycle()">立即执行现有规则</el-button>
      </div>
      <div class="common-table-box">
        <!-- <com-table :tableData="tableData" :column="column"></com-table> -->
        <el-table
          :data="tableData"
          :height="height"
          id="table"
          ref="multipleTable"
          style="width: 100%; margin-top: 20px"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
        >
          <el-table-column label="生效成员" width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type == 'appoint' ? '指定成员' : '所有成员' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="回收规则" prop="recoveryInfo" align="left">
            <!--<template slot-scope="scope">
              <div v-for="(rel,i) in scope.row.ruleInfoList">{{'规则'+Number(i+1)+'：'+'进入'+rel.cycleName+'阶段，'+rel.days+'天未添加跟进记录'}}</div>
            </template> -->
          </el-table-column>
          <!-- <el-table-column label="成员限制" width="280" align="center">
            <template slot-scope="scope">
               <div>{{'每个员工分配客户上限'+scope.row.unCustomerCount+'个'}}</div>
               <div v-if="scope.row.isExtension">{{'允许员工延期'+scope.row.extensionDays+'天'}}</div>
               <div>{{scope.row.pickAgainDays+'天后员工可捡回'}}</div>
             </template>
          </el-table-column> -->
          <el-table-column label="更新时间" width="220" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.createTime | timeSubString }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="操作" width="220" align="center">
            <template slot-scope="scope">
              <!-- <div>{{scope.row}}</div> -->
              <el-button type="text" @click=";(showrule = true), (updateId = scope.row.relationId)">编辑</el-button>
              <el-button type="text" @click="deleteRules(scope.row.relationId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>
    <RecycleRule :visible="showrule" :id="updateId" @onClose="onClose"></RecycleRule>
    <HoldRule :visible="showhold" :id="cycleId" @closehold="closehold"></HoldRule>
  </div>
</template>

<script>
import ComTable from '../../components/common/ComTable'
import ComDialog from '../../components/common/ComDialog'
import ComPagination from '../../components/common/ComPagination'
import RecycleRule from './recycleRule'
import HoldRule from './holdRule'
export default {
  components: { ComTable, ComPagination, RecycleRule, HoldRule, ComDialog },
  data() {
    return {
      cycleId: '',
      showhold: false,
      height: '400',
      showrule: false,
      updateId: '',
      tableData: [], //存储从后台获取到的数组
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      typeoptions: [],
      bottomrules: [],
      nowIndex: '0'
    }
  },
  created() {
    // console.log(this.$route.query.nowIndex)
    // this.nowIndex = this.$route.query.nowIndex
    this.getBottomRules()
    this.getColonyList()
  },
  methods: {
    closehold() {
      this.showhold = false
      this.getBottomRules()
    },
    // 获取底部四项规则
    getBottomRules() {
      var that = this
      that.$http.departmentrecoveryRule().then(res => {
        if (res.data.data) {
          that.bottomrules = res.data.data
        }
      })
    },
    // 获取规则列表
    getColonyList() {
      let that = this
      // var bottomrules=that.bottomrules
      that.$http.recyclingRulesList(that.page).then(res => {
        that.tableData = res.data.data.list
        that.page.total = res.data.data.total
        // that.tableData.forEach(item=>{
        //   if(item.ruleId==bottomrules.id){
        //     item.extensionDays=bottomrules.extensionDays
        //     item.isExtension=bottomrules.isExtension
        //     item.pickAgainDays=bottomrules.pickAgainDays
        //     item.unCustomerCount=bottomrules.unCustomerCount
        //   }
        // })
      })
    },
    // 刷新回收规则
    refreshRecycle() {
      this.$http.enforceRecyclingRules().then(res => {
        this.$message.success('刷新成功')
      })
    },
    // 删除规则
    deleteRules(relationId) {
      this.$confirm('确定删除该条规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.recyclingdisposeDelete({ relationId: relationId }).then(res => {
          this.$message.success('删除成功')
          this.getColonyList()
        })
      })
    },
    onClose(list) {
      this.showrule = false
      this.updateId = ''
      this.getColonyList()
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getColonyList()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getColonyList()
    },
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
        PADDING_TOP_HEIGHT -
        80
      // console.log(this.height)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  },
  filters: {
    timeSubString(time) {
      if (!time) {
        return
      }
      return time.substring(0, time.length - 3)
    },
    bottomrulesFileter(option) {
      if (option == 'undefined') {
        return 0
      }
      return option
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-colony {
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 20px;
  background-color: #fff;
}
.container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
}
.operating-btn {
  display: flex;
  justify-content: flex-end;
}
.common-pagination {
  // width:calc(100% - 30px) ;
  // position: absolute;
  // left: 0;
  // bottom: 0;
}
.dialog-content {
  width: 100%;
  // height: 260px;
  box-sizing: border-box;
}
.submit-btn {
  width: 200px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
  margin: 30px auto;
  border-radius: 3px;
  cursor: pointer;
}
.cutomer-title {
  border: 1px solid #ffdda6;
  background: #fff2db;
  color: #606266;
  font-size: 14px;
  padding: 10px;
  margin-bottom: 10px;
  line-height: 25px;
}
.hold {
  border: 1px solid #dcdfe6;
  margin-bottom: 20px;
  padding: 20px;
  font-size: 14px;
  border-radius: 10px;
  background-color: #f9f9f9;
}
</style>
