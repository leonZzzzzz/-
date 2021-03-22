<template>
  <div>
    <el-form label-position="right" label-width="180px" style="margin:40px 100px;">
      <el-form-item :label="minConfig.name" :rules="[{ required: true, message: '该项为必填项' }]">
        <el-input v-model="minConfig.value" style="width:140px">
          <template slot="append">元</template>
        </el-input>
        <el-button style="margin-left:10px" type="text" @click="updateMinConfig()">保存</el-button>
        <el-popover
          width="400"
          style="color:red!important"
          placement="top-start"
          trigger="hover"
          content="店铺单次提现最小金额，低于这个金额，店主将不能提交提现申请"
        >
          <i class="el-icon-question popover-icon" slot="reference"></i>
        </el-popover>
      </el-form-item>
      <el-form-item :label="maxConfig.name" :rules="[{ required: true, message: '该项为必填项' }]">
        <el-input v-model="maxConfig.value" style="width:140px">
          <template slot="append">元</template>
        </el-input>
        <el-button style="margin-left:10px" type="text" @click="updateMaxConfig()">保存</el-button>
        <el-popover
          width="400"
          style="color:red!important"
          placement="top-start"
          trigger="hover"
          content="店铺单次提现最高金额，高于这个金额，店主将不能提交提现申请"
        >
          <i class="el-icon-question popover-icon" slot="reference"></i>
        </el-popover>
      </el-form-item>
      <el-form-item :label="timesConfig.name" :rules="[{ required: true, message: '该项为必填项' }]">
        <el-input v-model="timesConfig.value" style="width:140px">
          <template slot="append">次</template>
        </el-input>
        <el-button style="margin-left:10px" type="text" @click="updateTimesConfig()">保存</el-button>
        <el-popover
          width="400"
          style="color:red!important"
          placement="top-start"
          trigger="hover"
          content="店铺每日可提现次数，高于这个次数，店主将不能提交提现申请"
        >
          <i class="el-icon-question popover-icon" slot="reference"></i>
        </el-popover>
      </el-form-item>
      <el-form-item :label="configItem.name" :rules="[{ required: true, message: '该项为必填项' }]">
        <el-input v-model="configItem.value" style="width:140px">
          <template slot="append">%</template>
        </el-input>
        <el-button style="margin-left:10px" type="text" @click="updateConfigItem()">保存</el-button>
        <el-popover
          width="400"
          style="color:red!important"
          placement="top-start"
          trigger="hover"
          content="店铺提现手续费:比如提现手续费为0.3%。店主提现1000元时，则产生3元手续费，实际收到997元。"
        >
          <i class="el-icon-question popover-icon" slot="reference"></i>
        </el-popover>
      </el-form-item>
      <el-form-item :label="auditTime.name" :rules="[{ required: true, message: '该项为必填项' }]">
        <el-input v-model="auditTime.value" style="width:140px">
          <template slot="append">小时</template>
        </el-input>
        <el-button style="margin-left:10px" type="text" @click="updateAuditTimeConfig()">保存</el-button>
        <el-popover
          width="400"
          style="color:red!important"
          placement="top-start"
          trigger="hover"
          content="当提现的审核方式为'自动审核时'，将在当前配置的时间上，自动审核通过提现申请，如：48小时"
        >
          <i class="el-icon-question popover-icon" slot="reference"></i>
        </el-popover>
      </el-form-item>
      <el-form-item :label="auditType.name" :rules="[{ required: true, message: '该项为必填项' }]">
        <el-radio v-model="auditType.value" label="hand" border>手动</el-radio>
        <el-radio v-model="auditType.value" label="auto" border>自动</el-radio>
        <el-button style="margin-left:10px" type="text" @click="updateAuditTypeConfig()">保存</el-button>
        <el-popover
          width="330"
          style="color:red!important"
          placement="top-start"
          trigger="hover"
          content="自动审核：在指定配置时间内自动审核通过提现申请 手动审核：需要手动审核每一个提现申请"
        >
          <i class="el-icon-question popover-icon" slot="reference"></i>
        </el-popover>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.popover-icon {
  color: #f7b393;
  font-size: 20px;
  padding: 10px 10px;
  cursor: pointer;
}
</style>

<script>
export default {
  props: {
    parentId: String
  },
  data() {
    return {
      model: {},
      configItem: {},
      minConfig: {},
      maxConfig: {},
      timesConfig: {},
      auditType: {},
      auditTime: {},
      config: {}
    }
  },
  created() {
    this.getConfigItem()
    this.getMinConfig()
    this.getMaxConfig()
    this.getTimesConfig()
    this.getAuditTimeConfig()
    this.getAuditTypeConfig()
  },
  methods: {
    getTree(row) {
      this.model = JSON.parse(JSON.stringify(row))
      this.formVisible = true
    },
    getConfigItem() {
      this.$http.getConfigByKey('STORE_POUNDAGE').then((res) => {
        this.configItem = res.data.data || {}
      })
    },
    getMinConfig() {
      this.$http.getConfigByKey('MIN_STORE_WITHDRAW').then((res) => {
        this.minConfig = res.data.data || {}
        this.minConfig.value = this.minConfig.value / 100
      })
    },
    getMaxConfig() {
      this.$http.getConfigByKey('MAX_STORE_WITHDRAW').then((res) => {
        this.maxConfig = res.data.data || {}
        this.maxConfig.value = this.maxConfig.value / 100
      })
    },
    getTimesConfig() {
      this.$http.getConfigByKey('TIMES_STORE_WITHDRAW').then((res) => {
        this.timesConfig = res.data.data || {}
      })
    },
    getAuditTypeConfig() {
      this.$http.getConfigByKey('AUDIT_TYPE').then((res) => {
        this.auditType = res.data.data || {}
      })
    },
    getAuditTimeConfig() {
      this.$http.getConfigByKey('AUTO_AUDIT_TIME').then((res) => {
        this.auditTime = res.data.data || {}
      })
    },
    updateConfigItem() {
      let model = JSON.parse(JSON.stringify(this.configItem))
      this.$http.updateLogisticsCompany(model).then(() => {
        this.loading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getConfigItem()
      })
    },
    updateMinConfig() {
      let model = JSON.parse(JSON.stringify(this.minConfig))
      model.value = model.value * 100
      this.$http.updateLogisticsCompany(model).then(() => {
        this.loading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getMinConfig()
      })
    },
    updateMaxConfig() {
      let model = JSON.parse(JSON.stringify(this.maxConfig))
      model.value = model.value * 100
      this.$http.updateLogisticsCompany(model).then(() => {
        this.loading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getMaxConfig()
      })
    },
    updateTimesConfig() {
      let model = JSON.parse(JSON.stringify(this.timesConfig))
      if (!/^\d+$/.test(model.value)) {
        this.$message.warning('请输入非负整数')
        return
      }
      this.$http.updateLogisticsCompany(model).then(() => {
        this.loading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getTimesConfig()
      })
    },
    updateAuditTypeConfig() {
      let model = JSON.parse(JSON.stringify(this.auditType))
      this.$http.updateLogisticsCompany(model).then(() => {
        this.loading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getAuditTypeConfig()
      })
    },
    updateAuditTimeConfig() {
      let model = JSON.parse(JSON.stringify(this.auditTime))
      if (!/^\d+$/.test(model.value)) {
        this.$message.warning('请输入非负整数')
        return
      }
      this.$http.updateLogisticsCompany(model).then(() => {
        this.loading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getAuditTimeConfig()
      })
    }
  }
}
</script>
