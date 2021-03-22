<template>
  <el-dialog
    :title="id ? '修改' : '添加'"
    :visible.sync="visible"
    width="580px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div style="overflow: auto" v-loading="dataLoading">
      <el-form :model="model" ref="model" label-position="right" label-width="110px">
        <el-form-item label="应用名称" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="项目名(英文)" prop="code" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input v-model="model.code"></el-input>
        </el-form-item>
        <el-form-item label="是否模板" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-radio-group v-model="model.isTemplate">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择模板" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-select v-model="model.copyTemplateAppId" placeholder="请选择">
            <el-option v-for="item in templateOptions" :key="item.appId" :label="item.name" :value="item.appId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属客户" prop="customerName" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input v-model="model.customerName"></el-input>
        </el-form-item>

        <el-form-item label="备注说明">
          <el-input v-model="model.remark"></el-input>
        </el-form-item>
        <el-form-item label="到期日" prop="endDate" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-date-picker
            type="datetime"
            placeholder="选择日期"
            v-model="model.endDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="图标" prop="logUrl" :rules="[{ required: true, message: '该字段不能为空' }]">
          <ImageUpload
            imageType="app"
            :isCrop="false"
            :image-url="model.logUrl"
            :cropw="150"
            :croph="150"
            :enlarge="5"
            :on-success="(e) => (model.logUrl = e)"
          ></ImageUpload>
        </el-form-item>
      </el-form>
    </div>
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
        name: '',
        code: '',
        customerName: '',
        endDate: '',
        remark: '',
        logUrl: '',
        isTemplate: false,
        copyTemplateAppId: ''
      },
      loading: false,
      dataLoading: false,
      templateOptions: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ]
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
  created() {
    this.getAppPage()
  },
  methods: {
    async detail() {
      try {
        let res = await this.$http.getApp({ id: this.id })
        this.model = res.data.data
        this.dataLoading = false
      } catch (err) {
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true, true)
        }
      }
    },
    // getTemplate() {
    //   if (!this.model.isTemplate) {
    //     return
    //   }
    //   console.log('yes')
    //   this.getAppPage()
    // },
    success() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.loading = true
          this.saveModel(this.id ? 'updateApp' : 'addApp')
        } else {
          return false
        }
      })
    },
    async saveModel(type) {
      try {
        await this.$http[type](this.model)
        this.loading = false
        this.$message({
          message: type === 'updateApp' ? '修改成功' : '添加成功',
          type: 'success'
        })
        this.close(true)
        this.$emit('reload')
      } catch (err) {
        this.loading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true)
        }
      }
    },
    getAppPage() {
      this.$http.getAppPage({ isTemplate: true }).then((res) => {
        console.log(res)
        this.templateOptions = res.data.data.list
      })
    },
    close(flag) {
      this.model = this.reduc()
      this.$emit('close', flag)
    },
    reduc() {
      let model = {
        name: '',
        code: '',
        customerName: '',
        endDate: '',
        remark: '',
        logUrl: ''
      }
      return model
    }
  }
}
</script>
