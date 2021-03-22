<template>
  <div>
    <FormTypeTitle text="佣金配置">
      <el-button type="primary" style="margin-left: 38px;" :loading="loading" @click="handleSubmit()">保存</el-button>
    </FormTypeTitle>
    <el-form class="form" :model="model" ref="model" label-width="135px" label-position="left" size="small">
      <el-form-item v-if="false" label="活动佣金提成比率" prop="activityCommissionRate1">
        <el-input-number
          v-model="model.activityCommissionRate1"
          style="width: 100px;"
          :min="0"
          :controls="false"
          :precision="2"
        ></el-input-number
        ><span style="margin-left:10px;color:#606266">%</span>
      </el-form-item>
      <el-form-item
        v-if="abilityIsOpenTypes['share-activity'] && abilityIsOpenTypes['share-activity'] === true"
        label="活动佣金冻结时长"
        prop="activityCommissionFrozenHours"
        :rules="[
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字值' }
        ]"
      >
        <el-input v-model.number="model.activityCommissionFrozenHours" type="age" style="width: 100px;"></el-input
        ><span style="margin-left:10px;color:#606266">天</span>
      </el-form-item>
      <el-form-item v-if="false" label="课程佣金提成比率" prop="courseCommissionRate1">
        <el-input-number
          v-model="model.courseCommissionRate1"
          style="width: 100px;"
          :min="0"
          :controls="false"
          :precision="2"
        ></el-input-number
        ><span style="margin-left:10px;color:#606266">%</span>
      </el-form-item>
      <el-form-item
        v-if="abilityIsOpenTypes['share-course'] && abilityIsOpenTypes['share-course'] === true"
        label="课程佣金冻结时长"
        prop="courseCommissionFrozenHours"
        :rules="[
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字值' }
        ]"
      >
        <el-input v-model.number="model.courseCommissionFrozenHours" type="age" style="width: 100px;"></el-input
        ><span style="margin-left:10px;color:#606266">天</span>
      </el-form-item>
      <el-form-item v-if="false" label="订单佣金提成比率" prop="orderCommissionRate1">
        <el-input-number
          v-model="model.orderCommissionRate1"
          style="width: 100px;"
          :min="0"
          :controls="false"
          :precision="2"
        ></el-input-number
        ><span style="margin-left:10px;color:#606266">%</span>
      </el-form-item>
      <el-form-item
        v-if="abilityIsOpenTypes['share-goods'] && abilityIsOpenTypes['share-goods'] === true"
        label="订单佣金冻结时长"
        prop="orderCommissionFrozenHours"
        :rules="[
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字值' }
        ]"
      >
        <el-input v-model.number="model.orderCommissionFrozenHours" type="age" style="width: 100px;"></el-input
        ><span style="margin-left:10px;color:#606266">天</span>
        <el-tooltip class="item" effect="dark" content="订单完成后N天，佣金可提现" placement="top-start">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="最低提现金额" prop="minWithdrawAmount">
        <el-input-number
          v-model="model.minWithdrawAmount"
          style="width: 100px;"
          :min="0"
          :controls="false"
          :precision="2"
        ></el-input-number
        ><span style="margin-left:10px;color:#606266">元</span>
      </el-form-item>
      <el-form-item label="手续费费率" prop="poundageRate">
        <el-input-number
          v-model="model.poundageRate"
          style="width: 100px;"
          :min="0"
          :controls="false"
          :precision="2"
        ></el-input-number
        ><span style="margin-left:10px;color:#606266">%</span>
      </el-form-item>
      <el-form-item label="最低提现手续费" prop="minPoundage">
        <el-input-number
          v-model="model.minPoundage"
          style="width: 100px;"
          :min="0"
          :controls="false"
          :precision="2"
        ></el-input-number
        ><span style="margin-left:10px;color:#606266">元</span>
      </el-form-item>
      <el-form-item label="打款方式" prop="transferWay">
        <el-select v-model="model.transferWay" style="width: 100px;" :min="0" :controls="false" :precision="2">
          <el-option
            v-for="(item, index) in transferWayList"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CommissionConfig',
  data() {
    return {
      loading: false,
      dataLoading: false,
      model: {
        activityCommissionRate1: 0, // 活动佣金提成比率
        courseCommissionRate1: 0, // 课程佣金提成比率
        orderCommissionFrozenHours: 0, // 订单佣金提成比率

        activityCommissionFrozenHours: 0, // 活动佣金冻结时长
        courseCommissionFrozenHours: 0, // 课程佣金冻结时长
        orderCommissionFrozenHours: 0 // 订单佣金冻结时长
      },
      conditionList: [],
      conditionId: '',
      transferWayList: [],
      abilityIsOpenTypes: {} // 获取支持的推广类型
    }
  },
  created() {
    this.dataLoading = true
    this.shareAbilityIsOpenTypes()
    this.distributerCommissionConfigGet()
    this.transferWay()
  },
  methods: {
    // 获取支持的推广类型
    shareAbilityIsOpenTypes() {
      this.$http.shareAbilityIsOpenTypes().then((res) => {
        this.abilityIsOpenTypes = res.data.data
      })
    },
    transferWay() {
      this.$http.transferWay().then((res) => {
        this.transferWayList = res.data.data
      })
    },
    // 佣金配置获取
    async distributerCommissionConfigGet() {
      let res = await this.$http.distributerCommissionConfigGet()
      this.model = res.data.data
      this.model.activityCommissionRate1 = this.model.activityCommissionRate1 / 100
      this.model.courseCommissionRate1 = this.model.courseCommissionRate1 / 100
      this.model.orderCommissionRate1 = this.model.orderCommissionRate1 / 100
      this.model.poundageRate = this.model.poundageRate / 100

      this.model.activityCommissionFrozenHours = this.model.activityCommissionFrozenHours / 24
      this.model.courseCommissionFrozenHours = this.model.courseCommissionFrozenHours / 24
      this.model.orderCommissionFrozenHours = this.model.orderCommissionFrozenHours / 24

      this.model.minWithdrawAmount = this.model.minWithdrawAmount / 100
      this.model.minPoundage = this.model.minPoundage / 100
    },
    handleSubmit() {
      let _model = JSON.parse(JSON.stringify(this.model))

      _model.activityCommissionRate1 = _model.activityCommissionRate1 * 100
      _model.courseCommissionRate1 = _model.courseCommissionRate1 * 100
      _model.orderCommissionRate1 = _model.orderCommissionRate1 * 100
      _model.poundageRate = _model.poundageRate * 100

      _model.activityCommissionFrozenHours = _model.activityCommissionFrozenHours * 24
      _model.courseCommissionFrozenHours = _model.courseCommissionFrozenHours * 24
      _model.orderCommissionFrozenHours = _model.orderCommissionFrozenHours * 24

      _model.minWithdrawAmount = _model.minWithdrawAmount * 100
      _model.minPoundage = _model.minPoundage * 100
      console.log('_model', _model)
      this.distributerCommissionConfigUpdate(_model)
    },
    // 佣金配置修改
    async distributerCommissionConfigUpdate(params) {
      this.loading = true
      try {
        let res = await this.$http.distributerCommissionConfigUpdate(params)
        this.loading = false
        this.$message.success('保存成功')
        this.distributerCommissionConfigGet()
      } catch (err) {
        this.loading = false
      }
    }
  }
}
</script>
