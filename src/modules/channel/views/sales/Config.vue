<template>
  <div class="wrap" v-loading="dataLoading">
    <FormTypeTitle text="条件配置" />
    <div style="padding:30px 0;">
      <el-radio-group v-model="conditionId" @change="distributerBecomeConditionRefresh">
        <el-radio :label="item.id" v-for="(item, index) in conditionList" :key="index">{{ item.content }}</el-radio>
      </el-radio-group>
    </div>
    <!-- 佣金配置 -->
    <CommissionConfig />
  </div>
</template>

<script>
import CommissionConfig from '../common/CommissionConfig' // 佣金配置
export default {
  components: { CommissionConfig },
  data() {
    return {
      dataLoading: false,
      conditionList: [],
      conditionId: ''
    }
  },
  created() {
    this.dataLoading = true
    this.distributerBecomeConditionList()
  },
  methods: {
    // 获取可选条件
    async distributerBecomeConditionList() {
      let res = await this.$http.distributerBecomeConditionList()
      this.conditionList = res.data.data
      this.distributerBecomeConditionGet()
      this.dataLoading = false
    },
    // 获取已选条件
    async distributerBecomeConditionGet() {
      let res = await this.$http.distributerBecomeConditionGet()
      const data = res.data.data
      this.conditionId = data.id
    },
    async distributerBecomeConditionRefresh() {
      await this.$http.distributerBecomeConditionRefresh({ conditionId: this.conditionId })
      this.$message.success('保存成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  background: #fff;
  padding: 20px;
}
</style>
