<template>
  <QcNavigationPage
    content="优惠券信息"
    full
  >
    <div
      v-loading="loading"
      style="max-width: 800px;"
    >
      <p
        v-if="isDisabledFormItem"
        class="el-icon-warning"
        style="color: #888;margin-bottom: 25px;font-size: 14px;"
      > 已发布的优惠券只允许修改部分信息</p>
      <el-form
        ref="model"
        :model="model"
        size="medium"
        label-position="left"
        label-width="120px"
      >
        <!-- <el-form-item
          label="规则名称"
          prop="ruleName"
          :rules="[{ required: false, message: '该项为必填项' }]"
        >
          <el-input
            v-model="model.ruleName"
            class="coupon-input"
          ></el-input>
          <el-tooltip
            width="150"
            effect="dark"
            content="例：满99减2"
            placement="top-start"
          >
            <el-button
              class="msg-popu-error"
              icon="el-icon-question"
            ></el-button>
          </el-tooltip>
        </el-form-item> -->
        <el-form-item
          label="优惠券标题"
          prop="couponTitle"
          :rules="[{ required: true, message: '该项为必填项' }]"
        >
          <el-input
            v-model="model.couponTitle"
            :maxlength="64"
            :disabled="isDisabledFormItem"
            class="coupon-input"
          ></el-input>
          <p class="form-item-tips">例：无门槛5元优惠券</p>
        </el-form-item>
        <!-- couponScope  
          101 所有商品（平台用）
          201 指定店铺（平台用）
          204 指定商品（店铺用）
          暂时不支持指定店铺
        -->
        <el-form-item
          label="使用范围"
          prop="couponScope"
          :rules="[{ required: true, message: '该项为必填项' }]"
        >
          <el-radio
            v-model="model.couponScope"
            :label="101"
            :disabled="isDisabledFormItem"
          >商品通用</el-radio>
          <!-- <el-radio
            v-model="model.couponScope"
            :label="204"
            :disabled="isDisabledFormItem"
          >指定商品</el-radio> -->
          <!-- <el-radio
            v-model="model.couponScope"
            :label="201"
            :disabled="isDisabledFormItem"
          >指定店铺</el-radio> -->
        </el-form-item>
        <!-- <el-form-item
          v-if="model.couponScope == 201"
          label="选择店铺"
          prop="referenceIdList"
          :rules="[{ required: true, message: '该项为必填项' }]"
        >
          <div class="product-list">
            <div
              v-for="(item, index) in referenceIdList"
              :key="index"
              class="product-item"
            >
              <el-button
                class="remove-btn"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="onRemeoveProduct(item)"
              ></el-button>
              <QcProductItem
                :img="imgHost + item.cover"
                :title="item.title"
              ></QcProductItem>
            </div>
          </div>
          <QcProductPicker
            :type="['product']"
            :module="['MallStore']"
            :visible="productPickerVisible"
            @close="onQcProductPickerClose"
          ></QcProductPicker>
          <el-button :disabled="isDisabledFormItem" @click="productPickerVisible = true">请选择</el-button>
        </el-form-item> -->

        <el-form-item
          label="领取限制"
          prop="visibility"
          :rules="[{ required: false, message: '该项为必填项' }]"
        >
          <div>
            <el-radio
              v-model="model.visibility"
              label="public"
            >所有人可领</el-radio>
            <!-- 定向赠送是按手机号送券的，还未完整测试，暂时不开放 -->
            <!-- <el-radio
              v-model="model.visibility"
              label="store-directional-give"
            >定向赠送</el-radio> -->
          </div>
        </el-form-item>
        <el-form-item
          v-if="model.visibility == 'public'"
          label="投放方式"
          prop="showInList"
          :rules="[{ required: false, message: '该项为必填项' }]"
        >
          <div>
            <el-radio
              v-model="model.showInList"
              :label="true"
            >领券中心领券</el-radio>
            <el-radio
              v-model="model.showInList"
              :label="false"
            >后台/前台发放</el-radio>
          </div>
          <p class="form-item-tips">说明:（领券中心：开启领券中心领券，可在商城或领取中心领取优惠券；后台/前台发放：开启后台/前台发放的优惠券，优惠券不会显示在领取中心，用户可在抽奖活动、扫码进行领券）</p>
        </el-form-item>
        <!-- <el-form-item label="图片" prop="couponIcon" :rules="[{ required: true, message: '该字段不能为空'}]">
          <QcImageUpload
            :data="{imageType:'attachment'}"
            width="100px"
            height="100px"
            v-model="model.couponIcon"
          ></QcImageUpload>
          <p>建议尺寸750 * 320，大小不超过3M</p>
        </el-form-item> -->
        <el-form-item
          label="优惠券类型"
          prop="couponType"
          :rules="[{ required: true, message: '该项为必填项' }]"
        >
          <div style="display: flex;">
            <div
              class="couponType-radio"
              :class="['couponType-radio', model.couponType === 1 && 'couponType-radio--a', isDisabledFormItem && 'couponType-radio--d']"
              :style="`cursor: not-allowed !important;`"
              @click="isDisabledFormItem ? false : model.couponType = 1"
            >
              <p>代金券</p>
              <p>提供满减设置，用于抵扣现金</p>
            </div>
            <div
              :class="['couponType-radio', model.couponType === 2 && 'couponType-radio--a', isDisabledFormItem && 'couponType-radio--d']"
              @click="isDisabledFormItem ? false : model.couponType = 2"
            >
              <p>折扣券</p>
              <p>可用于消费时获取折扣</p>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          :label="model.couponType === 2 ? '折扣额度' : '优惠券面值'"
          prop="couponAmount"
          :rules="[{ required: true, message: '该项为必填项' }]"
        >
          <el-input
            v-if="model.couponType === 2"
            v-model="model.couponAmount"
            :disabled="isDisabledFormItem"
            class="coupon-input"
          >
            <template slot="append">%</template>
          </el-input>
          <el-input
            v-else
            v-model="model.couponAmount"
            :disabled="isDisabledFormItem"
            class="coupon-input"
          >
            <template slot="append">元</template>
          </el-input>
          <p
            v-if="model.couponType === 2"
            class="form-item-tips"
          >折扣8.5折，额度填85 %，最多精确到小数点后1位</p>
        </el-form-item>
        <el-form-item
          label="需满足订单金额"
          prop="couponOrderAmount"
          :rules="[{ required: true, message: '该项为必填项' }]"
        >
          <el-input
            v-model="model.couponOrderAmount"
            :disabled="isDisabledFormItem"
            class="coupon-input"
          >
            <template slot="append">元</template>
          </el-input>
          <p class="form-item-tips">填写0表示无门槛</p>
        </el-form-item>
        <el-form-item
          label="使用规则"
          prop="couponUsageRule"
          :rules="[{ required: false, message: '' }]"
        >
          <el-input
            v-model="model.couponUsageRule"
            class="coupon-input"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item
          label="发放总量"
          prop="totalQuantity"
          :rules="[{ required: true, message: '该项为必填项' }]"
        >
          <el-input
            v-model="model.totalQuantity"
            :disabled="isDisabledFormItem"
            class="coupon-input"
          >
            <template slot="append">张</template>
          </el-input>
          <p class="form-item-tips">填写0表示无限制</p>
        </el-form-item>
        <el-form-item
          label="每人限领次数"
          prop="memberReceiveQuantity"
          :rules="[{ required: true, message: '该项为必填项' }]"
        >
          <el-input-number
            v-model="model.memberReceiveQuantity"
            :disabled="isDisabledFormItem"
            style="width: 350px;"
          >
            <template slot="append">张</template>
          </el-input-number>
          <p class="form-item-tips">填写0表示无限制</p>
        </el-form-item>
        <el-form-item
          label="每日限领次数"
          prop="memberReceiveQuantityPerDay"
          :rules="[{ required: true, message: '该项为必填项' }]"
        >
          <el-input-number
            v-model="model.memberReceiveQuantityPerDay"
            :disabled="isDisabledFormItem"
            style="width: 350px;"
          >
            <template slot="append">张</template>
          </el-input-number>
          <p class="form-item-tips">填写0表示无限制</p>
        </el-form-item>
        <el-form-item
          label="领取时间"
          prop="ruleStartTimeAndruleEndTime"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-date-picker
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            v-model="model.ruleStartTimeAndruleEndTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="使用效期类型"
          prop="couponValidDaysType"
          :rules="[{ required: true, message: '该项为必填项' }]"
        >
          <el-radio
            v-model="model.couponValidDaysType"
            :label="1"
            :disabled="isDisabledFormItem"
          >固定日期</el-radio>
          <el-radio
            v-model="model.couponValidDaysType"
            :label="2"
            :disabled="isDisabledFormItem"
          >领取后有效</el-radio>
        </el-form-item>
        <el-form-item
          v-if="model.couponValidDaysType === 1"
          label="使用效期"
          prop="validTimeAndExpireTime"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-date-picker
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            v-model="model.validTimeAndExpireTime"
            :disabled="isDisabledFormItem"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          v-else
          label="使用效期"
          prop="couponValidDays"
          :rules="[{ required: true, message: '该项为必填项' }]"
        >
          <el-input
            v-model="model.couponValidDays"
            :disabled="isDisabledFormItem"
            class="coupon-input"
            style="width: 350px"
          >
            <template slot="prepend">领取后</template>
            <template slot="append">天有效</template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button
        type="primary"
        :loading="loading"
        @click="success()"
      >{{model.id ? '修改':'保存'}}</el-button>
    </div>
  </QcNavigationPage>
</template>

<script>
import couponApi from '@/modules/shopping/api/coupon'
export default {
  data() {
    return {
      loading: false,
      productPickerVisible: false,
      // 优惠券关联的商品id
      referenceIdList: [],
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
        // 使用规则
        couponUsageRule: '',
        // 规则简介
        totalQuantity: 0,
        // 总发券数量
        quantityPerDay: '',
        // 每日发券数量
        memberReceiveQuantity: '',
        // 每人可领数量
        memberReceiveQuantityPerDay: '1',
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
        couponScope: 101,
        // 优惠券作用范围：101=全部商品（平台用），201=指定商户可用（平台用），204=指定商品可用（平台商户都可用）
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
      }
    }
  },
  computed: {
    // 已发布的状态，只可修改部分字段
    isDisabledFormItem() {
      // 待发布的状态，修改无限制; 已发布的状态，只可修改部分字段
      return this.model.status === 'ongoing' || this.$route.query.status === 'ongoing'
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
      // 规则名称默认取值优惠券标题，不让客户手动填
      this.model.ruleName = val
    },
    'model.visibility'(val) {
      // 是否显示在领券列表（visibility = public时生效）
      // 如果不等于public，那就改回默认值true
      if (val !== 'public') {
        this.model.showInList = true
      }
    },
    'model.couponValidDaysType'(val) {
      // 当有效期类型不为“指定时间段”时，就清除已选择的时间
      if (val !== 1) {
        this.model.couponValidTime = ''
        this.model.couponExpireTime = ''
        this.model.validTimeAndExpireTime = []
      } else {
        this.model.couponValidDays = ''
      }
    }
  },
  created() {
    this.model.id = this.$route.query.id || ''
    if (this.model.id) this.getDetail(this.model.id)
  },
  methods: {
    async getDetail(id) {
      this.loading = true
      try {
        const res = await couponApi.getCoupon({ id: id })
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
        // 204表示使用范围为指定商品
        if (model.couponScope == 204) this.couponProductList(model.referenceIdList)
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
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          let model = JSON.parse(JSON.stringify(this.model))
          model.couponValidTime = model.validTimeAndExpireTime[0]
          model.couponExpireTime = model.validTimeAndExpireTime[1]
          model.ruleStartTime = model.ruleStartTimeAndruleEndTime[0]
          model.ruleEndTime = model.ruleStartTimeAndruleEndTime[1]
          model.couponOrderAmount = parseFloat(model.couponOrderAmount) * 100
          if (model.couponType === 1) model.couponAmount = parseFloat(model.couponAmount) * 100
          model.quantityPerDay = model.quantityPerDay || model.totalQuantity
          model.memberReceiveQuantityPerDay = model.memberReceiveQuantityPerDay || model.memberReceiveQuantity
          delete model.validTimeAndExpireTime
          delete model.ruleStartTimeAndruleEndTime
          // 201表示使用范围为指定店铺，不填写关联ID
          if (model.couponScope == 201) model.referenceIdList = ''
          this.loading = true
          if (this.isDisabledFormItem) {
            // 这里只修改已发布的优惠券，部分字段
            // 修改只提交需要的字段
            let __model = {
              id: model.id,
              ruleStartTime: model.ruleStartTime,
              ruleEndTime: model.ruleEndTime,
              ruleName: model.ruleName,
              ruleDescription: model.ruleDescription,
              couponDescription: model.couponDescription,
              couponIcon: model.couponIcon,
              visibility: model.visibility,
              showInList: model.showInList,
              couponUsageRule: model.couponUsageRule
            }
            this.saveModel('updateCouponPublished', __model)
            return
          }
          this.saveModel(model.id ? 'updateCoupon' : 'addCoupon', model)
        }
      })
    },
    saveModel(type, model) {
      couponApi[type](model)
        .then(() => {
          this.loading = false
          this.$message({
            message: ['updateCouponPublished', 'updateCoupon'].includes(type) ? '修改成功' : '新建成功',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
        })
        .catch(() => {
          this.loading = false
        })
    },
    onQcProductPickerClose(data) {
      this.productPickerVisible = false
      if (data) {
        let obj = {
          id: data.id,
          title: data.name,
          cover: data.iconUrl
        }
        this.referenceIdList.push(obj)
      }
    },
    onRemeoveProduct(val) {
      // 上面的watch里面会监听referenceIdList 进行model的赋值
      let index = this.referenceIdList.findIndex(item => item.id === val.id)
      this.referenceIdList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon-input {
  // width: 200px;
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

// 优惠券类型选择样式
.couponType-radio {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 200px;
  height: 100px;
  margin-right: 30px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  user-select: none;
  p {
    color: #606266;
    line-height: 1.5;
    text-align: center;
    &:last-child {
      color: #999;
      font-size: 12px;
      margin-top: 5px;
    }
  }
}
// 选中状态
.couponType-radio--a {
  position: relative;
  border-color: $--color-primary !important;
  &::before {
    content: ' ';
    position: absolute;
    right: -20px;
    bottom: -20px;
    width: 0;
    height: 0;
    border: 20px solid;
    border-color: transparent transparent transparent $--color-primary;
    transform: rotateZ(45deg);
  }
  &::after {
    content: '\221A';
    position: absolute;
    right: 5px;
    bottom: -10px;
    color: #fff;
    font-size: 12px;
    z-index: 1;
  }
}
// 禁用状态
.couponType-radio--d {
  cursor: not-allowed !important;
  border-color: #e4e7ed !important;
  &::before {
    border-color: transparent transparent transparent #e4e7ed;
  }
}
</style>