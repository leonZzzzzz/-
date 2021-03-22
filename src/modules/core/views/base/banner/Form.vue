<template>
  <el-dialog
    :title="id ? '修改' : '添加'"
    :visible.sync="visible"
    width="480px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-width="100px" label-position="left" hide-required-asterisk>
      <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input size="small" v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="链接">
        <el-input size="small" v-model="model.href"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input size="small" v-model="model.note"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="url" :rules="[{ required: true, message: '该字段不能为空' }]">
        <QcImageUpload
          :data="{ imageType: 'attachment' }"
          width="100px"
          height="100px"
          v-model="model.url"
        ></QcImageUpload>
        <p>建议尺寸750 * 280，大小不超过3M</p>
      </el-form-item>
      <el-form-item label="排序" prop="seqNum" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input-number size="small" v-model="model.seqNum"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
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
        name: '',
        href: '',
        url: '',
        seqNum: 0,
        note: '',
        categoryId: ''
      },
      loading: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.id) {
          this.getAttachment()
        } else {
          this.getIdByCode()
        }
      }
    }
  },
  methods: {
    getIdByCode() {
      this.$http.getIdByCode({ categoryCode: 'index_rolling_picture' }).then((res) => {
        this.model.categoryId = res.data.data.categoryId
      })
    },
    getAttachment() {
      this.$http.getAttachment({ id: this.id }).then((res) => {
        this.model = res.data.data
      })
    },
    success() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.loading = true
          this.saveModel(this.id ? 'updateAttachment' : 'addAttachment')
        }
      })
    },
    saveModel(type) {
      this.$http[type](this.model)
        .then(() => {
          this.loading = false
          this.$message({
            message: type === 'updateAttachment' ? '修改成功' : '添加成功',
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
      this.$emit('onClose', flag)
    }
  }
}
</script>
