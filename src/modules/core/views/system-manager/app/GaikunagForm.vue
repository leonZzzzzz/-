<template>
  <el-dialog
    title="概况配置"
    :visible.sync="visible"
    width="450px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-position="top" label-width="100px">
      <el-form-item label="统计类型" prop="value" :rules="[{ required: false, message: '请选择类型' }]">
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox label="mall">商城</el-checkbox>
          <el-checkbox label="activity">活动</el-checkbox>
          <el-checkbox label="course">课程</el-checkbox>
        </el-checkbox-group>
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
        value: '',
        appId: ''
      },
      loading: false,
      checkedCities: []
    }
  },
  watch: {
    visible(val) {
      if (val && this.id != '') {
        this.model.appId = this.id
        this.getDetail()
      }
    }
  },
  methods: {
    getDetail() {
      this.loading = true
      this.$http
        .getDataStatisticsConfig({ appId: this.id })
        .then((res) => {
          this.loading = false
          if (!res.data.message) return
          this.model.value = res.data.message
          this.checkedCities = res.data.message.split('_')
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCheckedCitiesChange(e) {
      if (e && e.length > 0) {
        this.model.value = e.join('_')
      } else {
        this.model.value = ''
      }
    },
    //修改
    async apiUpdate() {
      try {
        await this.$http.updateDataStatisticsConfig(this.model)
        this.loading = false
        this.$message.success('配置成功')
        this.close(false)
      } catch (err) {
        this.loading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true, true)
        }
      }
    },
    success() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.loading = true
          this.apiUpdate()
        } else {
          return false
        }
      })
    },
    close(flag) {
      this.$emit('close', flag)
      ;(this.model = {
        value: '',
        appId: ''
      }),
        (this.checkedCities = [])
    }
  }
}
</script>
