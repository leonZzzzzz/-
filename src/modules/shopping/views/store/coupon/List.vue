<template>
  <div>
    <QcTable
      ref="table"
      :option="option"
      :search-form="searchForm"
      :menu="menu"
      :column="column"
    ></QcTable>
    <RecordList
      :visible="formVisibleson"
      :id="updateId"
      @close="formVisibleson = false"
    ></RecordList>
  </div>
</template>

<script>
import RecordList from './RecordList'
import couponApi from '@/modules/shopping/api/coupon'
// 优惠券的接口和字段描述文档：http://xyj.wego168.com/xiaoyaoji/doc/5HRX1EC3w
export default {
  components: { RecordList },
  data() {
    const statusOptions = [
      { value: 'waiting', label: '待投放', color: '#E6A23C' },
      { value: 'ongoing', label: '投放中', color: '#67C23A' },
      { value: 'run-out', label: '已领完', color: '#909399' },
      { value: 'aborted', label: '已停用', color: '#909399' },
      { value: 'end', label: '已结束', color: '#909399' },
      { value: 'not-start', label: '未开始', color: '#E6A23C' }
    ]

    return {
      loading: false,
      formVisibleson: false,
      productPickerVisible: false,
      // 优惠券关联的商品id
      referenceIdList: [],
      radio: '1',
      list: [],
      model: {
        ruleStartTime: '',
        // 领券开始时间，格式为yyyy-MM-dd HH:mm:ss
        ruleEndTime: '',
        // 领券结束时间，格式为yyyy-MM-dd HH:mm:ss
        ruleType: 1,
        // 券种类：1商品，4运费 默认：1
        ruleName: '',
        // 领券活动名称
        ruleDescription: '',
        // 规则简介
        couponUsageRule: '',
        // 使用规则
        totalQuantity: '',
        // 总发券数量
        quantityPerDay: '',
        // 每日发券数量
        memberReceiveQuantity: '',
        // 每人可领数量
        memberReceiveQuantityPerDay: '',
        // 每人每天可领数量
        content: '',
        // 内容详情
        couponAmount: '',
        // 优惠券面值
        couponOrderAmount: '',
        // 订单金额，达到此值才能用
        couponDescription: '',
        // 优惠券说明
        couponIcon: '',
        // 券图标
        couponTitle: '',
        // 优惠券标题
        couponScope: 201,
        // 优惠券适用范围：201店内所有商品，204指定商品，203指定分类
        couponType: 1,
        // 优惠券类型：1代金券，2折扣券（85表示8.5折）
        couponValidDaysType: 1,
        // 优惠券有效天数类型：1指定时间段2固定天数
        couponValidTime: '',
        // 优惠券生效时间
        couponExpireTime: '',
        // 优惠券失效时间
        couponValidDays: '',
        // 有效天数
        referenceIdList: '',
        // 范围对象id，如果couponScope==201可不填，couponScope=204则填对应商品id，203则填对应分类id, 多个id使用英文逗号拼接
        visibility: 'public',
        // 可见性：public=无限制，vip-only=vip专享,store-directional-give=商户定向赠送
        showInList: true,
        // 是否显示在领券列表 true显示，false不显示; （visibility = public时生效）
        enableGive: 'disable',
        // 允许赠送：disable=不允许，enable=允许
        validTimeAndExpireTime: [], // 本地用，提交时会删除
        ruleStartTimeAndruleEndTime: [] // 本地用，提交时会删除
      },
      updateId: '',
      tableRow: {},
      formVisible: false,
      option: {
        url: 'api/admin/v1.1/coupon-rule/store-page?ruleType=1'
        //,showSearchAndReset: false
      },
      searchForm: [
        { value: '', formName: 'couponTitle', type: 'input', label: '标题' },
        {
          label: '状态',
          type: 'select',
          formName: 'status',
          option: [{ value: '', label: '全部' }, ...statusOptions],
          value: ''
        }
      ],
      menu: [
        {
          type: 'primary',
          label: '新建优惠券',
          on: () => {
            this.$router.push('/main/mall/store/coupon/form')
          }
        }
      ],
      column: [
        // {
        //   label: '规则名称',
        //   width: '150px',
        //   prop: 'ruleName'
        // },
        {
          label: '优惠券标题',
          prop: 'couponTitle'
        },
        // {
        //   label: '优惠内容',
        //   width: '120px',
        //   formatter: row => {
        //     // couponType： 1是代金券（100表示100元）， 2是折扣券（85表示8.5折）
        //     let couponAmount = parseFloat(String(row.couponAmount / 100)),
        //       couponAmountText = ''
        //     if (row.couponType === 2) {
        //       couponAmount = parseFloat(String(row.couponAmount / 10)) + '折'
        //     }
        //     couponAmountText = row.couponType === 1 ? ` 减 ${couponAmount}` : ` 享 ${couponAmount}`
        //     return (
        //       <div>
        //         {row.couponOrderAmount == 0
        //           ? '无门槛'
        //           : `满${parseFloat(String(row.couponOrderAmount / 100))}${couponAmountText}`}
        //       </div>
        //     )
        //   }
        // },
        {
          label: '发放总量(张)',
          prop: 'totalQuantity',
          formatter: row => {
            return <div>{row.totalQuantity === 0 ? '不限' : row.totalQuantity}</div>
          }
        },
        {
          label: '每人限领数量',
          formatter: row => {
            return <div>{row.memberReceiveQuantity === 0 ? '不限' : '限领' + row.memberReceiveQuantity + '张'}</div>
          }
        },
        {
          label: '已领取/剩余',
          formatter: row => {
            return (
              <div>
                {row.receivedQuantity + '/' + row.totalQuantity === 0
                  ? '不限'
                  : row.totalQuantity - row.receivedQuantity}
              </div>
            )
          }
        },
        {
          label: '领取时间',
          formatter: row => {
            return (
              row.ruleStartTime &&
              row.ruleEndTime && (
                <div>
                  {row.ruleStartTime.split(' ')[0] || row.ruleStartTime}至
                  {row.ruleEndTime.split(' ')[0] || row.ruleEndTime}
                </div>
              )
            )
          }
        },
        {
          label: '使用效期',
          formatter: row => {
            return row.couponValidDaysType === 2 ? (
              <div>领取后 {row.couponValidDays} 天内有效</div>
            ) : (
              row.couponValidTime && row.couponExpireTime && (
                <div>
                  {row.couponValidTime.split(' ')[0] || row.couponValidTime}至
                  {row.couponExpireTime.split(' ')[0] || row.couponExpireTime}
                </div>
              )
            )
          }
        },
        {
          label: '发布状态',
          prop: 'isPublished',
          formatter: row => {
            return !row.isPublished ? <span style="color: #E6A23C;">待发布</span> : <span>已发布</span>
          }
        },
        {
          label: '投放状态',
          prop: 'status',
          formatter: row => {
            let item = statusOptions.find(item => item.value === row.status)
            return item ? <span style={`color: ${item.color || 'inherit'}`}>{item.label}</span> : row.status
          }
        },
        {
          label: '操作',
          align: 'center',
          // width: '150px',
          fixed: 'right',
          formatter: row => {
            return (
              <div>
                {row.status === 'waiting' && (
                  <el-button type="text" onClick={this.publish.bind(this, row.id)}>
                    发布
                  </el-button>
                )}
                {['waiting', 'ongoing'].includes(row.status) && (
                  // 待发布的状态，修改无限制; 已发布的状态，只可修改部分字段
                  <el-button
                    type="text"
                    onClick={() => this.$router.push(`/main/mall/store/coupon/form?id=${row.id}&status=${row.status}`)}
                  >
                    修改
                  </el-button>
                )}
                {row.status === 'ongoing' && (
                  <el-button type="text" style="color: #F56C6C;" onClick={this.abort.bind(this, row.id)}>
                    停用
                  </el-button>
                )}
                {false && row.visibility == 'store-directional-give' && (
                  <el-button type="text" onClick={this.couponMobileSend.bind(this, row.id)}>
                    指定手机号发券
                  </el-button>
                )}
                <el-button type="text" onClick={this.couponRecord.bind(this, row.id)}>
                  领取记录
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    referenceIdList(val) {
      if (val) {
        let list = val.map(item => item.id)
        this.model.referenceIdList = list.join(',')
      } else {
        this.model.referenceIdList = ''
      }
    },
    'model.couponTitle'(val) {
      this.model.ruleName = val
    },
    'model.visibility'(val) {
      if (val !== 'public') {
        this.model.showInList = true
      }
    }
  },
  methods: {
    couponRecord(id) {
      this.formVisibleson = true
      this.updateId = id
    },
    couponMobileSend(id) {
      this.$prompt('请输入手机号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^1(3|4|5|6|7|8|9)[0-9]{9}$/,
        inputErrorMessage: '手机号格式不正确'
      }).then(async ({ value }) => {
        await couponApi.couponStoreSend({ ruleId: id, phone: value })
        this.$message.success('发送成功')
      })
    },
    publish(id) {
      this.$confirm('是否发布该优惠券?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        couponApi.publishCoupon({ id }).then(() => {
          this.$message.success('发布成功')
          this.$refs.table.onSearch()
        })
      })
    },
    abort(id) {
      this.$confirm('是否停用该优惠券?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        couponApi.abortCoupon({ id }).then(() => {
          this.$message.success('已停用')
          this.$refs.table.onSearch()
        })
      })
    },
    async getTree(row) {
      this.formVisible = true
      this.loading = true
      try {
        const res = await couponApi.getCoupon({ id: row.id })
        let model = res.data.data
        model.couponOrderAmount /= 100
        if (model.couponType === 1) {
          // 代金券
          model.couponAmount /= 100
        }
        model.validTimeAndExpireTime = [model.couponValidTime, model.couponExpireTime]
        model.ruleStartTimeAndruleEndTime = [model.ruleStartTime, model.ruleEndTime]
        if (model.referenceIdList && model.referenceIdList.join) {
          model.referenceIdList = model.referenceIdList.join(',')
        }
        if (model.couponScope == 204) this.couponProductList(model.referenceIdList) // 204表示使用范围为商品
        this.model = model
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    // 获取优惠券关联的商品
    async couponProductList(referenceIdList) {
      let res = await couponApi.couponProductList({ referenceIdList })
      this.referenceIdList = res.data.data
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon-input {
  width: 350px;
}

.form-item-tips {
  color: #777;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 5px;
}

.product-list {
  max-height: 100px;
  overflow: auto;
}
.product-item {
  position: relative;
  display: inline-block;
  margin: 0 10px 10px 0;
  width: 150px;
  .remove-btn {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 2;
  }
}
</style>
