<template>
  <el-dialog title="修改收货信息" width="600px" :visible="visible" :append-to-body="true" :show-close="false">
    <el-form label-width="100px" label-position="right" ref="rule" :model="model">
      <el-form-item label="收货人：">
        <el-input v-model="model.receiver" placeholder="请输入" style="width: 220px;"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：">
        <el-input v-model="model.mobile" placeholder="请输入" style="width: 220px;"></el-input>
      </el-form-item>
      <el-form-item label="省 市 区：">
        <Position v-model="position"></Position>
      </el-form-item>
      <el-form-item label="详细地址：">
        <el-input v-model="model.address" placeholder="请输入" style="width: 330px;"></el-input>
      </el-form-item>

      <el-form-item style="text-align: right;">
        <el-button @click="onDeliveryClose()">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="onSubmit()">确认修改</el-button>
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
    orderId: {
      type: String
    },
    address: {
      type: Object
    }
  },
  data() {
    return {
      btnLoading: false,
      model: {
        orderId: '',
        receiver: '',
        mobile: '',
        address: ''
      },
      position: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        let address = JSON.parse(JSON.stringify(this.address))
        let { receiver, mobile, province, city, area } = address
        this.model.receiver = receiver
        this.model.mobile = mobile
        try {
          let newAddress = address.address.replace(province, '')
          newAddress = newAddress.replace(city, '')
          newAddress = newAddress.replace(area, '')
          this.model.address = newAddress
        } catch (error) {
          console.log('解析地址错误')
          this.model.address = address.address
        }
        let position = []
        if (province) position.push(province)
        if (city) position.push(city)
        if (area) position.push(area)
        this.position = position
        console.log(this.position)
        // this.$set(this, 'position', position)
      }
    }
  },
  methods: {
    onDeliveryClose(flag = false) {
      this.$emit('onClose', flag)
      this.model = {
        id: '',
        receiver: '',
        mobile: '',
        address: '',
        position: []
      }
    },
    onSubmit() {
      if (!this.model.receiver.length && this.$message.error('请填写收货人')) return
      if (!this.model.mobile && this.$message.error('请填写收货人手机号')) return
      if (!this.model.address && this.$message.error('请填写收货地址')) return
      let { receiver, mobile, address } = this.model
      let model = {
        receiver: receiver,
        mobile: mobile
      }
      model.id = this.orderId
      model.province = this.position[0] || ''
      model.city = this.position[1] || ''
      model.area = this.position[2] || ''
      model.address = model.province + model.city + model.area + address
      this.btnLoading = true
      this.$http
        .updateOrderReceiver(model)
        .then(() => {
          this.btnLoading = false
          this.$message.success('修改成功')
          this.onDeliveryClose(true)
        })
        .catch(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style></style>
