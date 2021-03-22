<template>
  <QcNavigationPage content="模板编辑" class="wx-temp-detail">
    <main class="temp-msg-main">
      <div class="template-preview">
        <TemplatePreview :model="model"></TemplatePreview>
      </div>
      <div class="form-wrap">
        <div class="ang"></div>
        <el-form class="temp-msg-form" :model="model" ref="model" label-width="110px" label-position="right">
          <!-- 建议所有的应用 保持用一样的标题，小程序是通过type来查询ID的 并且小程那边是固定的type， -->
          <el-form-item label="消息模板标题" prop="name" :rules="[{ required: true, message: '该字段为必填项' }]">
            <el-input v-model="model.name"></el-input>
            <p style="line-height: 20px;color: #888;font-size: 12px;">标题不得随意更改，配置前咨询管理员</p>
          </el-form-item>
          <!-- 先注释掉，后端自动生成type（通过将标题转换成对应的拼音） -->
          <!-- <el-form-item
            label="微信模板类型"
            prop="type"
            :rules="[{ required: true, message: '该字段为必填项' }]"
          >
            <el-input v-model="model.type" :disabled="model.id"></el-input>
            <p style="line-height: 20px;color: #888;font-size: 12px;">说明：类型作为模板ID的标识，小程序通过type查询模板ID</p>
          </el-form-item> -->
          <el-form-item label="微信模板ID" prop="wxTemplateId" :rules="[{ required: true, message: '该字段为必填项' }]">
            <el-input v-model="model.wxTemplateId"></el-input>
          </el-form-item>
          <el-form-item label style="margin-bottom: 10px;">
            <el-row type="flex" justify="space-between">
              <el-col :span="7" style="line-height: 15px;font-size: 14px;color: #606266;">关键词</el-col>
              <el-col :span="7" style="line-height: 15px;font-size: 14px;color: #606266;">模板代码</el-col>
              <el-col :span="7" style="line-height: 15px;font-size: 14px;color: #606266;">内容</el-col>
              <el-col :span="2"></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label v-for="(item, index) in model.templateItemList" :key="index">
            <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <el-form-item
                  label-width="0"
                  :prop="`templateItemList.${index}.name`"
                  :rules="[{ required: true, message: '该字段为必填项' }]"
                >
                  <el-input v-model="item.name" placeholder="请填写关键词"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                  label-width="0"
                  :prop="`templateItemList.${index}.keyword`"
                  :rules="[{ required: true, message: '该字段为必填项' }]"
                >
                  <el-input v-model="item.keyword" placeholder="请填写模板代码"></el-input>
                  <p style="color:red" v-if="index === model.templateItemList.length - 1">示例：keyword1</p>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label-width="0">
                  <el-input v-model="item.data" placeholder="请填写内容"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button type="text" @click="onTemplateItemListDel(index)">删除</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="onTemplateItemListAdd()">添加关键字</el-button>
          </el-form-item>
        </el-form>
        <el-button style="margin: 30px 130px;" type="primary" :loading="loading" @click="onSave()">保存</el-button>
      </div>
    </main>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      model: {
        isSystem: true,
        wxTemplateId: '',
        name: '',
        type: '',
        code: '0',
        serviceType: '3',
        templateItemList: [
          {
            keyword: '',
            name: '',
            data: ''
          }
        ]
      }
    }
  },
  created() {
    this.$route.query.id && this.wxTemplateGet(this.$route.query.id)
  },
  methods: {
    wxTemplateGet(id) {
      this.$http.wxTemplateGet({ id }).then((res) => {
        this.model = res.data.data
      })
    },
    wxTemplateInsert(model) {
      this.loading = true
      this.$http
        .wxTemplateInsert(model)
        .then(() => {
          this.loading = false
          this.$message.success('保存成功，即将跳转...')
          setTimeout(() => {
            this.$router.push('/main/base/template')
          }, 800)
        })
        .catch(() => {
          this.loading = false
        })
    },
    wxTemplateUpdate(model) {
      this.loading = true
      this.$http
        .wxTemplateUpdate(model)
        .then(() => {
          this.loading = false
          this.$message.success('保存成功，即将跳转...')
          setTimeout(() => {
            this.$router.push('/main/base/template')
          }, 800)
        })
        .catch(() => {
          this.loading = false
        })
    },
    onTemplateItemListAdd() {
      this.model.templateItemList.push({
        keyword: '',
        name: '',
        data: ''
      })
    },
    onTemplateItemListDel(index) {
      this.model.templateItemList.splice(index, 1)
    },
    onSave() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          if (this.model.id) {
            // 置空才会根据新的名称重新生成
            this.model.type = ''
            console.log(JSON.stringify(this.model))
            this.wxTemplateUpdate(this.model)
          } else {
            this.wxTemplateInsert(this.model)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wx-temp-detail {
  width: 1400px;
  margin: 0 auto;
  .temp-msg-main {
    display: flex;
    padding-top: 40px;
    overflow: hidden;
    .template-preview {
      float: left;
      margin: 0 30px 0 20px;
    }
    .form-wrap {
      position: relative;
      width: 820px;
      float: left;
      .ang {
        display: block;
        width: 0;
        height: 0;
        border-width: 10px 20px 10px 0;
        border-style: solid;
        border-color: transparent #f9f9f9 transparent transparent; /*透明 黄 透明 透明 */
        position: absolute;
        top: 26px;
        left: -20px;
      }
      .temp-msg-form {
        margin-top: 15px;
        background: #f5f7fa;
        padding: 30px;
      }
    }
  }
}
</style>
