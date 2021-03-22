<template>
  <div class="group-rules">
    <go-back title="客户加群领券规则设置"></go-back>
    <div class="container">
      <div class="query-table-box">
        <el-button size="small" type="primary" @click="addRules">添加规则</el-button>
        <div class="search-content">
          <el-form label-width="100px" label-position="right" size="small" inline>
            <el-form-item label="群名称">
              <el-input placeholder="请输入群名称" v-model="search.groupName" @input="searchGroupRules"></el-input>
            </el-form-item>
            <el-form-item label="优惠券规则">
              <el-input placeholder="请输入优惠券规则名称" v-model="search.ruleName" @input="searchGroupRules"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="common-table-box">
        <com-table id="table" :height="tableHeight" :isFull="false" :tableData="tableData" :column="column"></com-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>
    <!-- 添加规则 -->
    <com-dialog :config="addDialog.config" @closeDialog="addDialog.config.visible = false">
      <div class="setting-dialog">
        <div class="dialog-tips">
          <div class="tips-msg">说明：</div>
          <div class="tips-msg">1.加群规则开始/结束时间设置后，加群赠送优惠券时间以群规则时间为准</div>
          <div class="tips-msg">2.群优惠券发送数量不限制</div>
          <div class="tips-msg">3.如多个群都设置了优惠券，则群会发送多个优惠券</div>
        </div>
        <div class="dialog-content">
          <el-form
            label-position="right"
            label-width="auto"
          >
            <el-form-item label="优惠券" :required="true">
              <div class="select-box">
                <div class="select-content" @click="showRuleDialog()">
                  <div class="name">
                    {{ !ruleDialog.selectedRuleData.ruleName ? '请选择' : ruleDialog.selectedRuleData.ruleName }}
                  </div>
                  <i class="el-icon-arrow-down"></i>
                </div>
                <!-- <div class="select-wrapper"></div> -->
              </div>
            </el-form-item>
            <el-form-item label="客户群">
              <div class="select-box">
                <div class="select-content" @click="showColonyDialog()">
                  <div class="name">
                    {{ !colonyDialog.selectedColonyData.groupName ? '请选择' : colonyDialog.selectedColonyData.groupName }}
                  </div>
                  <i class="el-icon-arrow-down" v-if="!colonyDialog.selectedColonyData.groupName"></i>
                  <i class="el-icon-close" @click.stop.prevent="clearSelectedColony()" v-else></i>
                </div>
                <!-- <div class="select-wrapper"></div> -->
                <el-tooltip effect="light" placement="right" content="不填则为加入任何群都送">
                  <i class="el-icon-question" style="margin-left: 10px"></i>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker
                type="datetime"
                size="small"
                placeholder="选择日期"
                v-model="addDialog.model.startTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :editable="false"
              >
              </el-date-picker>
              <el-tooltip effect="light" placement="right" content="不填则为任意时间">
                <i class="el-icon-question" style="margin-left: 10px"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                type="datetime"
                size="small"
                placeholder="选择日期"
                v-model="addDialog.model.endTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :editable="false"
              >
              </el-date-picker>
              <el-tooltip effect="light" placement="right" content="不填则为任意时间">
                <i class="el-icon-question" style="margin-left: 10px"></i>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>
        <div class="dialog-btns">
          <el-button @click="addDialog.config.visible = false">取消</el-button>
          <el-button type="primary" @click="addGroupRule">确定</el-button>
        </div>
      </div>
    </com-dialog>
    <!-- 修改规则 -->
    <com-dialog :config="editDialog.config" @closeDialog="editDialog.config.visible = false">
      <div class="setting-dialog">
        <div class="dialog-tips">
          <div class="tips-msg">说明：</div>
          <div class="tips-msg">1.加群规则开始/结束时间设置后，加群赠送优惠券时间以群规则时间为准</div>
          <div class="tips-msg">2.群优惠券发送数量不限制</div>
          <div class="tips-msg">3.如多个群都设置了优惠券，则群会发送多个优惠券</div>
        </div>
        <div class="dialog-content">
          <el-form
            label-position="right"
            label-width="auto"
          >
            <el-form-item label="优惠券" :required="true">
              <div class="select-box">
                <div class="select-content" @click="showRuleDialog()">
                  <div class="name">
                    {{ !ruleDialog.selectedRuleData.ruleName ? '请选择' : ruleDialog.selectedRuleData.ruleName }}
                  </div>
                  <i class="el-icon-arrow-down"></i>
                </div>
                <!-- <div class="select-wrapper"></div> -->
              </div>
            </el-form-item>
            <el-form-item label="客户群">
              <div class="select-box">
                <div class="select-content" @click="showColonyDialog()">
                  <div class="name">
                    {{ !colonyDialog.selectedColonyData.groupName ? '请选择' : colonyDialog.selectedColonyData.groupName }}
                  </div>
                  <i class="el-icon-arrow-down" v-if="!colonyDialog.selectedColonyData.groupName"></i>
                  <i class="el-icon-close" @click.stop.prevent="clearSelectedColony()" v-else></i>
                </div>
                <!-- <div class="select-wrapper"></div> -->
                <el-tooltip effect="light" placement="right" content="不填则为加入任何群都送">
                  <i class="el-icon-question" style="margin-left: 10px"></i>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker
                type="datetime"
                size="small"
                placeholder="选择日期"
                v-model="editDialog.model.startTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :editable="false"
              >
              </el-date-picker>
              <el-tooltip effect="light" placement="right" content="不填则为任意时间">
                <i class="el-icon-question" style="margin-left: 10px"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                type="datetime"
                size="small"
                placeholder="选择日期"
                v-model="editDialog.model.endTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :editable="false"
              >
              </el-date-picker>
              <el-tooltip effect="light" placement="right" content="不填则为任意时间">
                <i class="el-icon-question" style="margin-left: 10px"></i>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>
        <div class="dialog-btns">
          <el-button @click="editDialog.config.visible = false">取消</el-button>
          <el-button type="primary" @click="editGroupRule">确定</el-button>
        </div>
      </div>
    </com-dialog>
    <!-- 优惠券规则列表 -->
    <com-dialog :config="ruleDialog.config" @closeDialog="ruleDialog.config.visible = false">
      <div class="selection-content" style="height: auto">
        <div class="selection-table">
          <el-table
            ref="ruleTable"
            :data="ruleDialog.tableData"
            style="width: 100%"
            height="500px"
            @selection-change="handleRuleSelectionChange"
            @row-click="clickRuleRow"
          >
            <el-table-column type="selection" align="center" width="55px"></el-table-column>
            <!-- <el-table-column label="优惠规则名称" prop="ruleName" align="center"></el-table-column> -->
            <el-table-column label="优惠券标题" prop="couponTitle" align="center"></el-table-column>
            <el-table-column label="优惠内容" align="center">
              <!-- <template slot-scope="scope">
                <div>
                  {{ scope.row.couponOrderAmount == 0 ? '无门槛' : '满' + scope.row.couponOrderAmount / 100 }} 减
                  {{ scope.row.couponAmount / 100 }}
                </div>
              </template> -->
              <template slot-scope="scope">
                <div>
                  {{ scope.row | formatterCouponText }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="发放总数（张）" prop="totalQuantity" align="center"></el-table-column>
          </el-table>
        </div>
        <div class="selection-pagination">
          <com-pagination
            :page="ruleDialog.page"
            @sizeChange="onRuleSizeChange"
            @pageChange="onRulePageChange"
          ></com-pagination>
        </div>
        <div class="dialog-btns">
          <el-button @click="ruleDialog.config.visible = false">取消</el-button>
          <el-button type="primary" @click="chooseRule">确定</el-button>
        </div>
      </div>
    </com-dialog>
    <!-- 客户群列表 -->
    <com-dialog :config="colonyDialog.config" @closeDialog="colonyDialog.config.visible = false">
      <div class="selection-content" style="height: auto">
        <div class="query-table">
          <el-form label-width="80px" label-position="right" size="small" inline>
            <el-form-item label="群名称">
              <el-input placeholder="请输入群名称" v-model="colonyDialog.search.name" @input="searchColony"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="selection-table">
          <el-table
            ref="colonyTable"
            :data="colonyDialog.tableData"
            style="width: 100%"
            height="500px"
            @selection-change="handleColonySelectionChange"
            @row-click="clickColonyRow"
          >
            <el-table-column type="selection" align="center" width="55px"></el-table-column>
            <el-table-column label="群名" prop="name" align="center"></el-table-column>
            <el-table-column label="群主" prop="ownerName" align="center"></el-table-column>
            <el-table-column label="群人数" prop="quantity" align="center"></el-table-column>
            <!-- <el-table-column label="今日加群人数" prop="todayIn" align="center"></el-table-column> -->
            <!-- <el-table-column label="今日退群人数" prop="todayOut" align="center"></el-table-column> -->
            <el-table-column label="创建时间" prop="createAtToTime" align="center"></el-table-column>
          </el-table>
        </div>
        <div class="selection-pagination">
          <com-pagination
            :page="colonyDialog.page"
            @sizeChange="onColonySizeChange"
            @pageChange="onColonyPageChange"
          ></com-pagination>
        </div>
        <div class="dialog-btns">
          <el-button @click="colonyDialog.config.visible = false">取消</el-button>
          <el-button type="primary" @click="chooseColony">确定</el-button>
        </div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComPagination from '../../../components/common/ComPagination'
import ComTable from '../../../components/common/ComTable'
import ComDialog from '../../../components/common/ComDialog'
import GoBack from '../../../components/components/GoBack'
export default {
  components: { ComPagination, ComTable, ComDialog, GoBack },
  data() {
    return {
      search: {
        groupName: '',
        ruleName: '',
      },
      tableHeight: 400,
      tableData: [],
      column: [
        {
          label: '优惠券规则名称',
          align: 'center',
          prop: 'ruleName'
        },
        {
          label: '群名称',
          align: 'center',
          prop: 'groupName',
          formatter: (row) => {
            if (row.chatId != '') {
              return row.groupName
            } else {
              return '所有群'
            }
          }
        },
        {
          label: '开始时间',
          align: 'center',
          prop: 'startTime',
          formatter: (row) => {
            return (
              <div>{ this.formatterTime(row.startTime) }</div>
            )
          }
        },
        {
          label: '结束时间',
          align: 'center',
          prop: 'endTime',
          formatter: (row) => {
            return (
              <div>{ this.formatterTime(row.endTime) }</div>
            )
          }
        },
        {
          label: '创建时间',
          align: 'center',
          prop: 'createTime',
          formatter: (row) => {
            return (
              <div>{ this.formatterTime(row.createTime) }</div>
            )
          }
        },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.editGroupRules.bind(this, row)}>修改</el-button>
                <el-button type="text" onClick={this.deleteGroupRules.bind(this, row)}>删除</el-button>
              </div>
            )
          }
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      addDialog: {
        config: {
          width: '600px',
          title: '入群优惠券设置',
          visible: false
        },
        model: {
          couponRuleId: '',
          chatId: '',
          startTime: '',
          endTime: '',
        }
      },
      editDialog: {
        config: {
          width: '600px',
          title: '入群优惠券设置',
          visible: false
        },
        model: {}
      },
      ruleDialog: {
        config: {
          width: '1020px',
          title: '选择优惠券规则',
          visible: false
        },
        tableData: [],
        column: [],
        multipleSelection: [],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0
        },
        selectedRuleData: {}
      },
      colonyDialog: {
        config: {
          width: '1020px',
          title: '选择客户群',
          visible: false
        },
        tableData: [],
        column: [],
        search: {
          name: ''
        },
        multipleSelection: [],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0
        },
        selectedColonyData: {}
      },
    }
  },
  filters: {
    formatterCouponText(row) {
      // couponType： 1是代金券（100表示100元）， 2是折扣券（85表示8.5折）
      let couponAmount = row.couponAmount / 100,
        couponAmountText = ''
      if (row.couponType === 2) {
        let amount = row.couponAmount / 10
        couponAmount = parseInt(amount) === amount ? amount + '折' : amount.toFixed(1) + '折'
      }
      couponAmountText = row.couponType === 1 ? ` 减 ${couponAmount}` : ` 享 ${couponAmount}`
      return (
        row.couponOrderAmount == 0 ? '无门槛' : `满${row.couponOrderAmount / 100}${couponAmountText}`
      )
    }
  },
  created() {
    this.getGroupRules()
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
      const OTHER_HEIGHT = 132
      this.tableHeight = window.innerHeight - document.querySelector('#table').offsetTop - OTHER_HEIGHT
    },
    formatterTime(time) {
      if (time) {
        return time.slice(0, time.length - 3)
      }
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getGroupRules()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getGroupRules()
    },
    getGroupRules() {
      let params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum,
        groupName: this.search.groupName,
        ruleName: this.search.ruleName
      }
      this.$http.getGroupCouponRule(params).then(res => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    searchGroupRules() {
      this.page.pageNum = 1
      this.getGroupRules()
    },
    addRules() {
      this.addDialog.model.couponRuleId = ''
      this.addDialog.model.chatId = ''
      this.addDialog.model.startTime = ''
      this.addDialog.model.endTime = ''
      this.ruleDialog.selectedRuleData = {}
      this.colonyDialog.selectedColonyData = {}
      this.addDialog.config.visible = true
    },
    showRuleDialog() {
      this.ruleDialog.page.pageNum = 1
      this.ruleDialog.page.pageSize = 15
      this.ruleDialog.multipleSelection = []
      this.ruleDialog.config.visible = true
      this.getCouponRulePage()
    },
    getCouponRulePage() {
      let params = {
        pageNum: this.ruleDialog.page.pageNum,
        pageSize: this.ruleDialog.page.pageSize
      }
      this.$http.getCouponRulePage(params).then((res) => {
        this.ruleDialog.tableData = res.data.data.list
        this.ruleDialog.page.total = res.data.data.total
      })
    },
    onRuleSizeChange(val) {
      this.ruleDialog.page.pageSize = val
      this.ruleDialog.page.pageNum = 1
      this.getCouponRulePage()
    },
    onRulePageChange(val) {
      this.ruleDialog.page.pageNum = val
      this.getCouponRulePage()
    },
    clickRuleRow(row) {
      this.$refs.ruleTable.toggleRowSelection(row);
    },
    // 优惠券规则选项改变
    handleRuleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.ruleTable.clearSelection()
        this.$refs.ruleTable.toggleRowSelection(val[val.length - 1])
        let list = []
        list.push(val[val.length - 1])
        this.ruleDialog.multipleSelection = list
      } else {
        this.ruleDialog.multipleSelection = val
      }
    },
    // 选择优惠券规则
    chooseRule() {
      if (this.ruleDialog.multipleSelection.length > 0) {
        let data = this.ruleDialog.multipleSelection[0]
        let obj = {
          couponRuleId: data.id,
          ruleName: data.ruleName
        }
        this.ruleDialog.selectedRuleData = obj
        this.ruleDialog.config.visible = false
      } else {
        this.$message.warning('请选择优惠券')
      }
    },
    showColonyDialog() {
      this.colonyDialog.page.pageNum = 1
      this.colonyDialog.page.pageSize = 15
      this.colonyDialog.multipleSelection = []
      this.colonyDialog.config.visible = true
      this.getColonyPage()
    },
    getColonyPage() {
      let params = {
        pageNum: this.colonyDialog.page.pageNum,
        pageSie: this.colonyDialog.page.pageSize,
        name: this.colonyDialog.search.name,
      }
      this.$http.getCustomerColonyPage(params).then(res => {
        this.colonyDialog.tableData = res.data.data.list
        this.colonyDialog.page.total = res.data.data.total
      })
    },
    searchColony() {
      this.colonyDialog.page.pageNum = 1
      this.getColonyPage()
    },
    onColonySizeChange(val) {
      this.colonyDialog.page.pageSize = val
      this.colonyDialog.page.pageNum = 1
      this.getColonyPage()
    },
    onColonyPageChange(val) {
      this.colonyDialog.page.pageNum = val
      this.getColonyPage()
    },
    clickColonyRow(row) {
      this.$refs.colonyTable.toggleRowSelection(row)
    },
    // 客户群选项改变
    handleColonySelectionChange(val) {
      if (val.length > 1) {
        this.$refs.colonyTable.clearSelection()
        this.$refs.colonyTable.toggleRowSelection(val[val.length - 1])
        let list = []
        list.push(val[val.length - 1])
        this.colonyDialog.multipleSelection = list
      } else {
        this.colonyDialog.multipleSelection = val
      }
    },
    // 选择客户群
    chooseColony() {
      if (this.colonyDialog.multipleSelection.length > 0) {
        let data = this.colonyDialog.multipleSelection[0]
        let obj = {
          chatId: data.chatId,
          groupName: data.name
        }
        this.colonyDialog.selectedColonyData = obj
        this.colonyDialog.config.visible = false
      } else {
        this.$message.warning('请选择客户群')
      }
    },
    clearSelectedColony() {
      this.colonyDialog.selectedColonyData = {}
    },
    addGroupRule() {
      if (!this.ruleDialog.selectedRuleData.couponRuleId) {
        this.$message.warning('请选择优惠券')
        return
      }
      this.addDialog.model.couponRuleId = this.ruleDialog.selectedRuleData.couponRuleId
      if (this.colonyDialog.selectedColonyData.chatId) {
        this.addDialog.model.chatId = this.colonyDialog.selectedColonyData.chatId
      }
      console.log('提交参数', this.addDialog.model)
      this.$http.addGroupCouponRule(this.addDialog.model).then(() => {
        this.$message.success('添加成功')
        this.addDialog.config.visible = false
        this.page.pageNum = 1
        this.getGroupRules()
      })
    },
    editGroupRules(row) {
      this.$http.getGroupCouponRuleDetail({ id: row.id }).then(res => {
        let data = res.data.data
        this.editDialog.model = data
        let rule = {
          couponRuleId: data.couponRuleId,
          ruleName: data.ruleName,
        }
        this.ruleDialog.selectedRuleData = rule
        let colony = {
          chatId: data.chatId,
          groupName: data.groupName
        }
        this.colonyDialog.selectedColonyData = colony
        this.editDialog.config.visible = true
      })
    },
    editGroupRule() {
      if (!this.ruleDialog.selectedRuleData.couponRuleId) {
        this.$message.warning('请选择优惠券')
        return
      }
      let chatId = ''
      if (this.colonyDialog.selectedColonyData.chatId) {
        chatId = this.colonyDialog.selectedColonyData.chatId
      }
      console.log('选择的客户群', this.colonyDialog.selectedColonyData.chatId)
      let params = {
        id: this.editDialog.model.id,
        couponRuleId: this.ruleDialog.selectedRuleData.couponRuleId,
        chatId: chatId,
        startTime: this.editDialog.model.startTime,
        endTime: this.editDialog.model.endTime
      }
      console.log('提交数据', params)
      this.$http.updateGroupCouponRule(params).then(() => {
        this.$message.success('修改成功')
        this.editDialog.config.visible = false
        this.getGroupRules()
      })
    },
    deleteGroupRules(row) {
      this.$confirm('删除该规则', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteGroupCouponRule({ id: row.id }).then(() => {
          this.$message.success('删除成功')
          this.getGroupRules()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
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
.setting-dialog {
  .dialog-tips {
    background: #fdf6ec;
    color: #E6A23C;
    padding: 8px 16px;
    font-size: 13px;
    line-height: 20px;
    margin-bottom: 20px;
  }
  .dialog-content {
    .select-box {
      position: relative;
      width: 220px;
      display: flex;
      align-items: center;
      .select-content {
        border: 1px solid #e7eaec;
        border-radius: 4px;
        padding: 5px 10px;
        display: flex;
        align-items: center;
        line-height: 20px;
        cursor: pointer;
        .name {
          width: 180px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
          margin-right: 5px;
        }
      }
      .select-wrapper {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 4px;
        cursor: not-allowed;
      }
    }
  }
}
.dialog-btns {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
::v-deep thead {
  .el-table-column--selection {
    .cell {
      display: none;
    }
  }
}
</style>