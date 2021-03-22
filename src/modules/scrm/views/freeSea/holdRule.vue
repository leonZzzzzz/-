<template>
  <el-dialog
    :title="id ? '修改持有规则' : '新增持有规则'"
    :visible.sync="visible"
    width="740px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-width="auto" label-position="right">
      <el-form-item
        label="非企微客户数量："
        prop="unCustomerCount"
        :rules="[{ required: true, message: '该字段不能为空', trigger: ['blur', 'change'] }]"
      >
        <span>每个员工个人所持有的非企微客户上限数量</span>
        <el-input-number class="blank" :min="1" type="number" v-model="model.unCustomerCount"></el-input-number>
        <span>位</span>
        <div>(在【公海池】->【非企微客户】列表，员工录入/批量导入客户数量不计入在其中。)</div>
      </el-form-item>
      <el-form-item
        label="非企微客户再回收："
        prop="unScrmCustRecycleDay"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <span>非企微客户被领取后</span>
        <el-input-number class="blank" :min="1" type="number" v-model="model.unScrmCustRecycleDay"></el-input-number>
        <span>天未添加成功，则重新回收至公海池</span>
      </el-form-item>
      <el-form-item label="允许延期：" prop="isExtension" :rules="[{ required: true, message: '该字段不能为空' }]">
        <div style="display: flex; align-items: center;height:36px">
          <el-switch v-model="model.isExtension" active-color="#294A7B" inactive-color="#999"> </el-switch>
          <div v-if="model.isExtension" style="margin-left: 10px">
            <span>允许员工延期</span
            ><el-input-number class="blank" :min="1" type="number" v-model="model.extensionDays"></el-input-number>天
          </div>
        </div>
      </el-form-item>
      <el-form-item label="员工捡回：" prop="pickAgainDays" :rules="[{ required: true, message: '该字段不能为空' }]">
        <span>自回收至公海池</span>
        <el-input-number class="blank" :min="1" type="number" v-model="model.pickAgainDays"></el-input-number>
        <span
          >天后可重新捡回（若设置为7天，员工的客户1月1日回收至公海池后，期间该客户未被其他员工认领时，1月8日09:00此员工可重新认领）</span
        >
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      model: {
        unCustomerCount: '',
        isExtension: false,
        extensionDays: '',
        pickAgainDays: '',
        unScrmCustRecycleDay: ''
      },
      loading: false
    }
  },

  watch: {
    visible(val) {
      this.getBottomRules()
      if (val) {
        if (this.id) {
          this.model.id = this.id
          // this.getCarousel()
        }
      }
    }
  },

  methods: {
    // 获取底部四项规则
    getBottomRules() {
      var that = this
      that.$http.departmentrecoveryRule().then(res => {
        if (res.data.data) {
          that.model = res.data.data
        }
      })
    },

    success() {
      //  model: {
      //   unCustomerCount:'',
      //   isExtension:false,
      //   extensionDays:'',
      //   pickAgainDays:'',
      //   unScrmCustRecycleDay:''
      // },
      console.log(this.model)
      // return
      if (!this.model.unCustomerCount || !this.model.pickAgainDays || !this.model.unScrmCustRecycleDay) {
        this.$message.error('请填写完整后再提交')
        return
      }
      if (this.model.isExtension) {
        if (!this.model.extensionDays) {
          this.$message.error('请填写完整后再提交')
          return
        }
      } else {
        this.model.extensionDays = ''
      }
      this.$refs.model.validate(valid => {
        if (valid) {
          let model = JSON.parse(JSON.stringify(this.model))
          this.loading = true
          this.saveModel('AddORuprecyclingRules', model)
        }
      })
    },
    saveModel(type, model) {
      this.$http[type](model)
        .then(() => {
          this.loading = false
          this.$message({
            message: this.id ? '修改成功' : '添加成功',
            type: 'success'
          })
          this.close(true)
        })
        .catch(() => {
          this.loading = false
        })
    },
    close(flag) {
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      this.$emit('closehold', flag)
    }
  }
}
</script>
<style lang="scss" scoped>
.blank {
  display: inline-block;
  width: 150px;
  margin: 0 5px;
}
::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
</style>
