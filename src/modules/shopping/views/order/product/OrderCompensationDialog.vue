<template>
  <el-dialog title="填写赔付申请原因" width="480px" :visible.sync="visible" :append-to-body="true" :show-close="false">
    <el-form label-width="100px" label-position="right" :model="model" ref="compensation">
      <el-form-item label="赔付类型：" prop="reasonType" :rules="[{ required: true, message: '请选择赔付类型' }]">
        <el-select v-model="model.reasonType" style="width:100%">
          <el-option
            v-for="(item, index) in reasonType"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="赔付原因：" prop="reason" :rules="[{ required: true, message: '请填写赔付原因' }]">
        <el-input v-model="model.reason"></el-input>
      </el-form-item>
      <el-form-item
        label="赔付金额："
        prop="amount"
        :rules="[
          { required: true, message: '请填写赔付金额' },
          {
            message: '金额格式不正确',
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
          }
        ]"
      >
        <el-input v-model="model.amount"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCloseCompensationDialog()">取消</el-button>
        <el-button :loading="loading" type="primary" @click="addOrderCompensation()">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderId: String
  },

  data() {
    return {
      loading: false,
      model: {
        orderId: '',
        reasonType: '',
        reason: '',
        image: '',
        amount: ''
      },
      reasonType: []
    }
  },
  created() {
    this.orderCompensationReasonType()
  },
  methods: {
    orderCompensationReasonType() {
      this.$http.orderCompensationReasonType().then((res) => {
        this.reasonType = res.data.data
      })
    },
    addOrderCompensation() {
      this.$refs.compensation.validate((value) => {
        if (value) {
          this.loading = true
          let model = JSON.parse(JSON.stringify(this.model))
          model.orderId = this.orderId
          model.amount = model.amount * 100
          this.$http
            .addOrderCompensation(model)
            .then(() => {
              this.onCloseCompensationDialog(true)
              this.$message.success('申请成功')
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    onCloseCompensationDialog(update = false) {
      this.$refs.compensation.resetFields()
      this.$emit('close', update)
    }
  }
}
</script>

<style></style>
