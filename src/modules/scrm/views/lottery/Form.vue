<template>
  <div class="lottery-form">
    <go-back :title="form.id ? '修改抽奖' : '添加抽奖'"></go-back>
    <div class="container">
      <div class="module">
        <div class="title">基础设置</div>
        <div class="base-form">
          <el-form label-width="120px" label-position="left">
            <el-form-item label="标题" :required="true">
              <el-input v-model="form.title" placeholder="请输入标题（不超过32字）" maxlength="32" show-word-limit>
              </el-input>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker
                type="datetime"
                size="small"
                placeholder="选择日期"
                v-model="form.startTime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                :editable="false"
              >
              </el-date-picker>
              <el-tooltip effect="light" placement="right" content="不填则为立即开始">
                <i class="el-icon-question" style="margin-left: 10px"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                type="datetime"
                size="small"
                placeholder="选择日期"
                v-model="form.endTime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                :editable="false"
              >
              </el-date-picker>
              <el-tooltip effect="light" placement="right" content="不填则为永不结束">
                <i class="el-icon-question" style="margin-left: 10px"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="次数限制类型" :required="true">
              <el-select v-model="form.limitType">
                <el-option v-for="item in limitOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="次数" :required="true">
              <el-input-number v-model="form.limitTimes" :min="1" style="width: 217px;"></el-input-number>
            </el-form-item>
            <el-form-item label="详情" :required="true">
              <!-- <editor v-model="form.content"></editor> -->
              <el-input
                v-model="form.content"
                type="textarea"
                maxlength="500"
                show-word-limit
                :rows="8"
                placeholder="最多可输入500字"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="封面">
              <div>
                <UploadImageNew
                  :fileList="imageList"
                  :multiple="false"
                  tips="上传封面"
                  @success="(e) => uploadCoverSuccess(e)"
                >
                </UploadImageNew>
                <div class="form-tips" style="color: #888;">图片大小不能超过2MB，仅支持jpg/png格式</div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="module">
        <div class="title">奖项设置</div>
        <div class="setting-form">
          <el-button type="primary" size="small" @click="addAwards">添加</el-button>
          <div class="form-tips">
            <div class="tips-msg">提示：</div>
            <div class="tips-msg">1.奖品最多只能设置8个，所有奖品的中奖几率之和应当是100%</div>
            <div class="tips-msg">2.数量为0时则表示不限制奖品数量</div>
            <div class="tips-msg">3.抽奖最终发放的奖品数量以抽奖设置的奖品数量为准，与优惠券发放数量无关</div>
          </div>
          <el-form>
            <table class="property-table">
              <tr>
                <!-- <th>是否中奖</th> -->
                <th>奖品类型</th>
                <th>优惠券规则</th>
                <th>数量</th>
                <th>
                  中奖几率
                  <el-tooltip effect="light" placement="top" content="数字越大几率越大">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </th>
                <!-- <th>图标</th> -->
                <th>操作</th>
              </tr>
              <tr v-for="(item, index) in form.awards" :key="index">
                <!-- <td>
                  <el-form-item label-width="0px">
                    <el-switch v-model="item.win"></el-switch>
                  </el-form-item>
                </td> -->
                <td>
                  <el-select
                    v-model="item.win"
                    placeholder="请选择"
                    style="width: 150px;"
                    :disabled="index == 0 ? true : false"
                    size="small"
                  >
                    <el-option
                      v-for="obj in awardOptions"
                      :key="obj.value"
                      :label="obj.label"
                      :value="obj.value"
                    >
                    </el-option>
                  </el-select>
                </td>
                <td>
                  <el-form-item label-width="0px">
                    <el-select
                      v-model="item.title"
                      placeholder="请选择"
                      style="width: 200px;"
                      :disabled="index == 0 ? true : false"
                      size="small"
                      v-if="index == 0"
                    >
                    </el-select>
                    <div class="select-box" v-else>
                      <div class="select-content" @click="showRuleDialog(index)">
                        <div class="name">
                          {{ !selectedRuleData[index].couponTitle ? '请选择' : selectedRuleData[index].couponTitle }}
                        </div>
                        <i class="el-icon-arrow-down"></i>
                      </div>
                      <div class="select-wrapper" v-if="!item.win"></div>
                    </div>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item label-width="0px">
                    <el-input-number
                      size="small"
                      :min="0"
                      style="width: 140px"
                      v-model="item.quantity"
                      :disabled="index == 0 ? true : false"
                    >
                    </el-input-number>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item label-width="0px">
                    <div class="award-rate">
                      <el-input-number
                        size="small"
                        :min="0"
                        :max="100"
                        :precision="2"
                        :step="0.1"
                        style="width: 140px"
                        v-model="item.rate"
                      >
                      </el-input-number>
                      &nbsp;%
                    </div>
                    <div class="rate-tips" v-if="index == 0 & item.rate <= 0">中奖几率必须大于0</div>
                  </el-form-item>
                </td>
                <!-- <td>
                  <el-form-item label-width="0px">
                    <image-upload
                      v-model="item.icon"
                      :on-success="(e) => uploadImageSuccess(e)"
                      v-if="index != 0"
                      >
                    </image-upload>
                  </el-form-item>
                </td> -->
                <td>
                  <el-form-item label-width="0px" v-if="index != 0">
                    <el-button size="small" type="danger" @click="deleteAwards(index)">删除</el-button>
                  </el-form-item>
                </td>
              </tr>
            </table>
          </el-form>
        </div>
      </div>
      <div class="f-btn-group">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="submitLottery" :loading="isLoading">保存</el-button>
      </div>
    </div>
    <!-- 优惠券规则列表 -->
    <com-dialog :config="ruleDialog.config" @closeDialog="ruleDialog.config.visible = false">
      <div class="selection-content" style="height: auto">
        <div class="selection-table">
          <el-table
            ref="ruleTable"
            :data="ruleDialog.data"
            style="width: 100%"
            height="500px"
            @selection-change="handleRuleSelectionChange"
            @row-click="clickRow"
          >
            <el-table-column type="selection" align="center" width="55px"></el-table-column>
            <el-table-column label="优惠券标题" prop="couponTitle" align="center"></el-table-column>
            <!-- <el-table-column label="优惠规则名称" prop="ruleName" align="center"></el-table-column> -->
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
            @sizeChange="onSizeChange"
            @pageChange="onPageChange"
          ></com-pagination>
        </div>
        <div class="submit-btn selection-btn" style="margin-top: 20px" @click="chooseRule">确定</div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import GoBack from '../../components/components/GoBack'
import ComDialog from '../../components/common/ComDialog'
import ComPagination from '../../components/common/ComPagination'
import ImageUpload from '../../components/common/ImageUpload'
import UploadImageNew from '../../components/components/UploadImage'
export default {
  components: {
    GoBack,
    ComDialog,
    ComPagination,
    ImageUpload,
    UploadImageNew,
  },
  data() {
    return {
      form: {
        title: '',
        content: '',
        startTime: '',
        endTime: '',
        limitType: 'total',
        limitTimes: 1,
        cover: '',
        awards: [
          {
            title: '谢谢参与',
            icon: '',
            quantity: 0,
            rate: 0,
            win: false,
            awardType: 'object',
            awardId: '',
          },
          {
            title: '',
            icon: '',
            quantity: 0,
            rate: 0,
            win: true,
            awardType: 'coupon', // coupon写死，如果win=false，则传object
            awardId: '' // 优惠券规则
          }
        ]
      },
      imageList: [],
      awardIdx: 0,
      selectedRuleData: [
        {
          id: '',
          couponTitle: ''
        },
        {
          id: '',
          couponTitle: ''
        }
      ],
      limitOptions: [
        { value: 'total', label: '每人可抽N次' },
        { value: 'day', label: '每人每天可抽N次' }
      ],
      awardOptions: [
        { value: false, label: '谢谢参与' },
        { value: true, label: '优惠券' }
      ],
      ruleDialog: {
        config: {
          width: '1020px',
          title: '选择优惠券规则',
          visible: false
        },
        data: [],
        multipleSelection: [],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0
        }
      },
      isLoading: false
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
    if (this.$route.query.id) {
      this.getLotteryDetail(this.$route.query.id)
      return
    }
    // 设置默认封面
    this.form.cover = '/public/hongbao/hongbaoShare.png'
    this.imageList = [
      {
        name: 'image',
        url: this.imgHost + '/public/hongbao/hongbaoShare.png'
      }
    ]
  },
  methods: {
    getLotteryDetail(id) {
      this.$http.getRollingLotteryDetail({ id }).then((res) => {
        let data = res.data.data
        let ruleList = []
        data.awards.forEach((item) => {
          item.rate = item.rate / 100
          let obj = {
            id: item.awardId,
            couponTitle: item.win ? item.title : null // 奖品标题用优惠券规则名称填充
          }
          ruleList.push(obj)
        })
        this.selectedRuleData = ruleList
        if (data.cover) {
          this.imageList = [{ name: 'image', url: this.imgHost + data.cover }]
        }
        this.form = data
      })
    },
    getCouponRulePage() {
      let params = {
        pageNum: this.ruleDialog.page.pageNum,
        pageSize: this.ruleDialog.page.pageSize
      }
      this.$http.getCouponRulePage(params).then((res) => {
        this.ruleDialog.data = res.data.data.list
        this.ruleDialog.page.total = res.data.data.total
      })
    },
    showRuleDialog(idx) {
      this.awardIdx = idx
      this.ruleDialog.page.pageNum = 1
      this.ruleDialog.page.pageSize = 15
      this.ruleDialog.multipleSelection = []
      this.ruleDialog.config.visible = true
      this.getCouponRulePage()
    },
    onSizeChange(val) {
      this.ruleDialog.page.pageSize = val
      this.ruleDialog.page.pageNum = 1
      this.getCouponRulePage()
    },
    onPageChange(val) {
      this.ruleDialog.page.pageNum = val
      this.getCouponRulePage()
    },
    clickRow(row) {
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
          id: data.id,
          couponTitle: data.couponTitle // 规则名称使用优惠券规则标题填充
        }
        // 奖品标题用优惠券规则名称填充
        // this.$set(this.form.awards[this.awardIdx], 'title', data.ruleName)
        this.$set(this.selectedRuleData, this.awardIdx, obj)
        // this.selectedRuleData[this.awardIdx] = obj
        this.ruleDialog.config.visible = false
      } else {
        this.$message.warning('请选择优惠券规则')
      }
    },
    addAwards() {
      if (this.selectedRuleData.length >= 8) {
        this.$message.warning('奖项最多只能设置8个')
        return
      }
      let item = {
        title: '',
        icon: '',
        quantity: 0,
        rate: 0,
        win: true,
        awardType: 'coupon', // coupon写死，如果win=false，则传object
        awarId: '' // 优惠券规则
      }
      this.selectedRuleData.push({ id: '', couponTitle: '' })
      this.form.awards.push(item)
    },
    deleteAwards(idx) {
      this.form.awards.splice(idx, 1)
    },
    uploadImageSuccess(val) {
      this.form.awards[idx].icon = val
    },
    goBack() {
      this.$openNewPageBack()
    },
    // 上传封面
    uploadCoverSuccess(val) {
      console.log('上传封面返回值', val)
      this.form.cover = val.length == 0 ? '' : val[0].url
    },
    submitLottery() {
      // let model = Object.assign({}, this.form)
      let model = JSON.parse(JSON.stringify(this.form))
      if (model.title === '') {
        this.$message.warning('请输入抽奖标题')
        return
      }
      if (model.content === '') {
        this.$message.warning('请输入抽奖详情')
        return
      }
      if (model.awards.length <= 0) {
        this.$message.warning('请添加奖项')
        return
      }
      let firstAward = model.awards[0]
      if (firstAward.rate <= 0) {
        this.$message.warning('默认奖项中奖几率不能为0')
        return
      }
      let isPass = false
      for (let i = 0; i < model.awards.length; i++) {
        let item = model.awards[i]
        if (item.win && (this.selectedRuleData[i].id === null || this.selectedRuleData[i].id) === '') {
          this.$message.warning('请选择优惠券规则')
          isPass = false
          break
        } else if (item.quantity < 0) {
          this.$message.warning('请填写奖品数量')
          isPass = false
          break
        } else {
          isPass = true
        }
      }
      if (!isPass) {
        return
      }
      let rateAmount = 0
      model.awards.forEach((obj, index) => {
        rateAmount = rateAmount + obj.rate * 100
      })
      console.log('中奖几率之和', rateAmount)
      if (rateAmount !== 10000) {
        this.$message.warning('所有奖品的中奖几率之和应当是100%')
        return
      }
      model.awards.forEach((item, idx) => {
        if (item.win) {
          item.awardType = 'coupon'
          item.awardId = this.selectedRuleData[idx].id
          item.title = this.selectedRuleData[idx].couponTitle
          item.rate = item.rate * 100
          console.log('乘数', item.rate * 100)
        } else {
          item.awardType = 'object'
          item.awardId = null
          item.title = '谢谢参与' // 未中奖默认谢谢参与
          item.rate = item.rate * 100
          console.log('乘数', item.rate * 100)
        }
      })
      let startTime = model.startTime
      let endTime = model.endTime
      if (startTime && startTime.length >= 19) {
        model.startTime = startTime.slice(0, startTime.length - 3)
      }
      if (endTime && endTime.length >= 19) {
        model.endTime = endTime.slice(0, endTime.length - 3)
      }
      console.log('提交表单-》', model)
      this.isLoading = true
      if (model.id) {
        // update
        this.$http
          .updateRollingLottery(model)
          .then(() => {
            this.isLoading = false
            this.$message.success('修改成功')
            this.$openNewPageBack()
          })
          .catch(() => {
            this.isLoading = false
          })
      } else {
        // add
        this.$http
          .insertRollingLottery(model)
          .then(() => {
            this.isLoading = false
            this.$message.success('添加成功')
            this.$openNewPageBack()
          })
          .catch(() => {
            this.isLoading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  .module {
    max-width: 857px;
    .title {
      position: relative;
      padding: 10px 0;
      color: #606266;
      &::before {
        content: '';
        width: 6px;
        height: 20px;
        background-color: #294a7b;
        position: absolute;
        top: 0;
        bottom: 0;
        left: -20px;
        top: 8px;
      }
    }
    .base-form {
      max-width: 600px;
      margin-top: 20px;
    }
    .setting-form {
      margin-top: 20px;
      .form-tips {
        background: #fdf6ec;
        color: #e6a23c;
        padding: 8px 16px;
        font-size: 13px;
        line-height: 20px;
        margin: 20px 0;
      }
      .property-table {
        min-width: 400px;
        border: 1px solid #e7eaec;
        margin-top: 10px;
        border-spacing: 0;
        border-collapse: collapse;
        .el-form-item {
          margin-bottom: 0 !important;
        }
        tr {
          th {
            padding: 5px 10px;
            line-height: 1.5;
            min-width: 90px;
            .input-group {
              display: flex;
            }
          }
          td {
            border-top: 1px solid #e7eaec;
            line-height: 1.5;
            padding: 15px 12px;
            text-align: center;
            img {
              cursor: pointer;
            }
          }
        }
        .select-box {
          position: relative;
          color: #606266;
          .select-content {
            border: 1px solid #e7eaec;
            border-radius: 4px;
            padding: 5px 10px;
            display: flex;
            align-items: center;
            line-height: 20px;
            cursor: pointer;
            .name {
              width: 160px;
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
        .award-rate {
          display: flex;
          font-size: 16px;
          align-items: center;
        }
        .rate-tips {
          color: #F56C6C;
          font-size: 12px;
          line-height: 1;
          position: absolute;
          width: 100%;
        }
      }
    }
  }
  .f-btn-group {
    margin-top: 40px;
  }
}
.selection-content {
  width: 100%;
  height: 630px;
  box-sizing: border-box;
  .selection-btn {
    margin: auto;
  }
}
.submit-btn {
  width: 200px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
  margin: 60px auto;
  border-radius: 3px;
  cursor: pointer;
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
::v-deep .el-upload {
  width: 100%;
  height: 100%;
}
</style>
