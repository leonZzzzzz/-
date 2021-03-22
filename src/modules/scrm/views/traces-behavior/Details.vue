<template>
  <div class="page">
    <go-back :title="pageId ? '修改痕迹' : '新建痕迹'"></go-back>
    <div class="main-content">
      <el-form :model="ruleForm" ref="ruleForm" label-width="auto">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.name" maxlength="100" show-word-limit placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item
          label="浏览内容"
          prop="content"
          :rules="[{ required: true, message: '请输入浏览内容', trigger: 'blur' }]"
        >
          <el-input v-model="ruleForm.content" maxlength="250" show-word-limit placeholder="请输入浏览内容"></el-input>
        </el-form-item>
        <el-form-item
          label="标识代码"
          prop="code"
          :rules="[{ required: true, message: '请输入标识代码', trigger: 'blur' }]"
        >
          <el-input v-model="ruleForm.code" maxlength="50" show-word-limit placeholder="请输入标识代码"></el-input>
        </el-form-item>
        <el-form-item label="标识参数" style="margin-bottom: 12px">
          <div class="xfo-form-item" v-for="(item, index) in paramsList" :key="index">
            <el-input
              class="xfo-input"
              v-model="item.value"
              maxlength="50"
              show-word-limit
              :placeholder="`请输入标识参数${index + 1}`"
            ></el-input>
            <el-button plain icon="el-icon-minus" size="small" circle @click="deleteItem(index)"></el-button>
          </div>
          <el-button plain icon="el-icon-plus" size="small" @click="addItem">添加</el-button>
        </el-form-item>
        <el-form-item label="授权类型" :rules="[{ required: true, message: '请选择授权类型', trigger: 'blur' }]">
          <el-select v-model="ruleForm.authType" placeholder="请选择">
            <el-option label="静默授权" :value="63020"> </el-option>
            <el-option label="头像授权" :value="63021"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="拦截链接"
          prop="apiUrl"
          :rules="[{ required: true, message: '请输入拦截链接', trigger: 'blur' }]"
        >
          <el-input v-model="ruleForm.apiUrl" maxlength="250" show-word-limit placeholder="请输入拦截链接"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" prop="link">
          <el-input v-model="ruleForm.link" maxlength="500" show-word-limit placeholder="请输入跳转链接"></el-input>
        </el-form-item>
        <el-form-item
          label="记录频率"
          prop="time"
          :rules="[{ required: true, message: '请输入记录频率', trigger: 'blur' }]"
        >
          <el-input-number v-model="ruleForm.time" :step="1" :min="1" step-strictly></el-input-number> 秒/次
        </el-form-item>

        <el-form-item>
          <el-button plain @click="cancel">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import GoBack from '../../components/components/GoBack.vue'
export default {
  components: { GoBack },
  created() {
    if (this.$route.query.id) {
      this.pageId = this.$route.query.id
      this.getActionTraceDetails({ id: this.pageId })
    }
  },
  data() {
    return {
      pageId: '',
      ruleForm: {
        name: '',
        content: '',
        code: '',
        params: '',
        apiUrl: '',
        link: '',
        time: '600',
        authType: 63020
      },
      paramsList: [
        {
          value: ''
        }
      ]
    }
  },
  methods: {
    // ---页面渲染函数---
    // 新增标识
    addItem() {
      if (this.paramsList.length >= 10) {
        return this.$message.warning('最多10个标识')
      }
      this.paramsList.push({ value: '' })
    },
    // 删除标识
    deleteItem(index) {
      if (this.paramsList.length <= 1) {
        return this.$message.warning('最少1个标识')
      }
      this.paramsList.splice(index, 1)
    },
    // 取消按钮
    cancel() {
      this.$openNewPageBack()
    },
    // 确认按钮
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // if (!this.paramsList[0].value) {
          //   return this.$message.warning('请输入标识参数')
          // }
          let params = ''
          this.paramsList.forEach((item) => {
            params = params + '&' + item.value
          })
          this.ruleForm.params = params.slice(1)
          if (this.pageId) {
            this.updateActionTrace(this.ruleForm, (res) => {
              this.$message.success('修改成功')
              this.$openNewPageBack()
            })
          } else {
            this.createActionTrace(this.ruleForm, (res) => {
              this.$message.success('新建成功')
              this.$openNewPageBack()
            })
          }
        } else {
          return false
        }
      })
    },
    // ---数据获取函数---
    // 新增
    createActionTrace(options, callback) {
      this.$http.createActionTrace(options).then((res) => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 修改
    updateActionTrace(options, callback) {
      this.$http.updateActionTrace(options).then((res) => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 详情
    getActionTraceDetails(options) {
      this.$http.getActionTraceDetails(options).then((res) => {
        console.log(res.data.data)
        this.ruleForm = res.data.data
        let arr = res.data.data.params.split('&')
        this.paramsList = []
        arr.forEach((item) => {
          this.paramsList.push({
            value: item
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
}
.main-content {
  width: 100%;
  min-height: calc(100% - 56px);
  background-color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  .el-form {
    width: 700px;
    .xfo-form-item {
      display: flex;
      .xfo-input {
        margin-bottom: 10px;
      }
      .el-button {
        width: 36px;
        height: 36px;
        margin-left: 10px;
      }
    }
  }
}
</style>
