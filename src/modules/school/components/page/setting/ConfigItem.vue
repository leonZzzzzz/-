<template>
  <div style="display: flex;align-items: center;margin-top:20px">
    <p style="font-size: 14px;color: #303133;margin-right:15px">{{ name }}</p>
    <QcImageUpload
      v-model="model.value"
      v-if="form == 'img'"
      @input="updateConfig()"
    ></QcImageUpload>
    <el-switch
      v-model="model.value"
      v-else-if="form == 'switch'"
      :inactive-value="inactiveValue"
      :active-value="activeValue"
      style="width:400px"
      @change="updateConfig()"
    ></el-switch>
    <el-input v-model="model.value" v-else style="width:400px" @blur="updateConfig()"></el-input>
  </div>
</template>

<script>
import api from 'apiSchool/common'
export default {
  props: {
    type: {
      type: String
    },
    name: {
      type: String
    },
    form: {
      type: String
    },
    inactiveValue: {
      type: [String, Number],
      default: '2'
    },
    activeValue: {
      type: [String, Number],
      default: '1'
    }
  },
  data() {
    return {
      model: {
        name: '',
        key: '',
        showType: '0',
        type: '10',
        value: '',
        seqNum: '',
        isShow: 'true'
      }
    }
  },
  // watch: {
  //   'model.value'(newValue, oldValue) {
  //     if (this.form == 'img' && newValue !== oldValue) {
  //       this.updateConfig()
  //     }
  //   }
  // },
  created() {
    this.model.name = this.name
    this.model.key = this.type
    this.getConfig()
  },
  methods: {
    getConfig() {
      this.$http.get(`api/admin/v1/config/${this.type}`).then(res => {
        this.model = Object.assign(this.model, res.data.data)
      })
    },
    updateConfig() {
      if (this.model.id) {
        api.updateConfig(this.model).then(() => {
          this.$message.success('保存成功')
          this.getConfig()
        })
      } else {
        api.insertConfig(this.model).then(() => {
          this.$message.success('保存成功')
          this.getConfig()
        })
      }
    }
  }
}
</script>

<style></style>
