<template>
  <div style="width: 780px;margin: 0 auto;background: #fff;padding:10px 20px">
    <el-form ref="model" label-position="top" label-width="100px">
      <el-form-item label="推广关系模式">
        <el-radio-group v-model="chainMode" @change="changeChainMode">
          <el-radio label="permanent">永久绑定</el-radio>
          <el-radio label="replaceable">可抢客</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="注册推广者规则">
        <el-radio-group v-model="ruleId" @change="changeRule">
          <el-radio :label="item.id" v-for="item in ruleList" :key="item.id">{{ item.content }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <CommissionConfig />
    <FormTypeTitle text="常见问题">
      <Qa style="margin-top: 15px;" />
    </FormTypeTitle>
  </div>
</template>

<script>
import Qa from '../common/Qa'
import CommissionConfig from '../common/CommissionConfig' // 佣金配置
export default {
  components: { Qa, CommissionConfig },
  data() {
    return {
      // 推广关系
      chainMode: '',
      // 规则id
      ruleId: '',
      // 注册规则列表
      ruleList: [],
      // 当前注册规则
      selectRule: {}
    }
  },
  created() {
    this.getSharerConfig()
    this.sharerBecomeConditionList()
    this.sharerBecomeConditionGet()
  },
  methods: {
    getSharerConfig() {
      this.$http.get('api/admin/v1/sharer-config/get').then((res) => {
        if (!res.data.data) return
        this.chainMode = res.data.data.chainMode
      })
    },
    changeChainMode(value) {
      if (!value) return
      this.$http.shareConfigUpdate({ chainMode: value }).then((res) => {
        this.$message.success('设置成功')
      })
    },
    // 可选注册规则列表
    async sharerBecomeConditionList() {
      let res = await this.$http.sharerBecomeConditionList()
      this.ruleList = res.data.data || []
    },
    // 获取当前注册规则
    async sharerBecomeConditionGet() {
      let res = await this.$http.sharerBecomeConditionGet()
      this.selectRule = res.data.data || {}
      this.ruleId = this.selectRule.id || ''
    },
    // 设置注册规则
    async changeRule(id) {
      if (!id) return
      let res = await this.$http.sharerBecomeConditionSet({ conditionId: id })
      this.$message.success('设置成功')
    }
  }
}
</script>

<style></style>
