<template>
  <el-dialog
    title="分类信息"
    width="400px"
    append-to-body
    :close-on-click-modal="false"
    :visible="visible"
    :show-close="false"
  >
    <el-form ref="model" :model="model" label-position="left" label-width="80px">
      <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-input v-model="model.name" :maxlength="6" placeholder="建议六个字内"></el-input>
      </el-form-item>
      <el-form-item label="说明" prop="info">
        <el-input v-model="model.info" :maxlength="60"></el-input>
      </el-form-item>
      <el-form-item label="序号" prop="seqNum">
        <el-input-number v-model="model.seqNum"></el-input-number>
      </el-form-item>
      <el-form-item label="封面" prop="iconUrl">
        <ImageUpload :image-url="model.iconUrl" :on-success="(e) => (model.iconUrl = e)"></ImageUpload>
      </el-form-item>
      <el-form-item label="是否显示" prop="isDisplay">
        <el-switch v-model="model.isDisplay" :active-value="true" :inactive-value="false"></el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="onClose()">取消</el-button>
      <el-button type="primary" @click="onSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    id: String,
    parentId: [String, Number],
    type: {
      type: [String, Number],
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: {
        type: '',
        name: '',
        info: '',
        seqNum: '',
        iconUrl: '',
        isDisplay: true
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.id) {
          this.getCategory()
        }
      }
    }
  },
  methods: {
    getCategory() {
      this.$http.getCategory({ id: this.id }).then((res) => {
        this.model = res.data.data
      })
    },
    onSave(type) {
      this.$http[type](this.model).then(() => {
        this.$message.success('保存成功')
        this.onClose(true)
      })
    },
    onSubmit() {
      this.$refs.model.validate((value) => {
        if (value) {
          this.model.type = Number(this.type)
          this.model.parentId = this.parentId
          this.model.id ? this.onSave('updateCategory') : this.onSave('addCategory')
        }
      })
    },
    onClose(flag = false) {
      this.$emit('close', flag)
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
