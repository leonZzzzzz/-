<template>
  <el-dialog
    :title="id ? '修改' : '添加'"
    :visible.sync="visible"
    width="880px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div style="overflow: auto;" v-loading="dataLoading" v-if="visible">
      <el-form :model="model" ref="model" class="new-form" label-position="top">
        <el-form-item>
          <el-form-item
            label="名称(建议字数不超过6字)"
            prop="name"
            :rules="[
              { required: true, message: '该字段不能为空' },
              { max: 6, message: '建议字数不超过6字' }
            ]"
          >
            <el-input size="small" v-model="model.name" :maxlength="6"></el-input>
          </el-form-item>
          <!-- <el-form-item label="代码" prop="code" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input size="small" v-model="model.code"></el-input>
          </el-form-item>-->
          <el-form-item label="简介">
            <el-input size="small" v-model="model.introduction"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="头像" prop="headImage" :rules="[{ required: true, message: '该字段不能为空' }]">
          <QcImageUpload v-model="model.headImage" width="100px" height="100px"></QcImageUpload>
        </el-form-item>
        <el-form-item label="详情" prop="content">
          <Editor v-model="model.content"></Editor>
        </el-form-item>
      </el-form>
    </div>
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
        headImage: '',
        introduction: '',
        content: ''
      },
      loading: false,
      dataLoading: false
    }
  },
  watch: {
    visible(val) {
      if (val && this.id != '') {
        this.dataLoading = true
        this.detail()
      }
    }
  },
  methods: {
    async detail() {
      try {
        let res = await this.$http.getIp({ id: this.id })
        this.model = res.data.data
        this.dataLoading = false
      } catch (err) {
        this.dataLoading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true, true)
        }
      }
    },
    success() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.loading = true
          this.saveModel(this.id ? 'updateIp' : 'addIp')
        } else {
          return false
        }
      })
    },
    saveModel(type) {
      this.$http[type](this.model).then(() => {
        this.loading = false
        this.$message({
          message: type === 'updateIp' ? '修改成功' : '添加成功',
          type: 'success'
        })
        this.close(true)
      })
    },
    close(flag) {
      this.reduc()
      this.$emit('close', flag)
    },
    reduc() {
      this.model = {
        name: '',
        headImage: '',
        seqNum: 0,
        introduction: '',
        content: ''
      }
    }
  }
}
</script>
