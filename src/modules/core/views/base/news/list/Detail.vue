<template>
  <div class="news-form">
    <!-- <div class="header_nav">
      <el-button
        type="text"
        icon="el-icon-arrow-left"
        @click="$router.go(-1)"
      >{{ $route.query.id ? '修改' : '新建' }}图文</el-button>
    </div> -->
    <QcNavigationPage :content="$route.query.id ? '修改图文' : '新建图文'" full :footerBlockH="45">
      <div class="main_content">
        <el-form
          :model="model"
          ref="model"
          label-position="left"
          label-width="110px"
        >
          <el-form-item
            label="标题"
            prop="title"
            :rules="[{ required: true, message: '该字段不能为空' }]"
          >
            <el-input
              v-model.trim="model.title"
              :maxlength="32"
              placeholder="最多可输入32位"
              style="width: 400px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            label="分类"
            prop="categoryId"
            :rules="[{ required: true, message: '该字段不能为空' }]"
          >
            <el-select
              v-model="model.categoryId"
              placeholder="请选择"
              style="width: 400px"
            >
              <el-option
                v-for="(item, i) in category"
                :key="i"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="简介"
            prop="info"
            :rules="[{ required: true, message: '该字段不能为空' }]"
          >
            <el-input
              type="textarea"
              :rows="4"
              v-model="model.info"
              style="width: 400px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="showPoint == true"
            label="阅读获得积分"
            prop="info"
            :rules="[{ required: true, message: '该字段不能为空' }]"
          >
            <el-input
              type="number"
              :min="0"
              v-model="model.readPoint"
              style="width: 400px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            label="封面"
            prop="iconUrl"
            :rules="[{ required: true, message: '该字段不能为空' }]"
          >
            <QcImageUpload
              v-model="model.iconUrl"
              width="100px"
              height="100px"
            ></QcImageUpload>
          </el-form-item>
          <el-form-item
            label="介绍"
            prop="content"
            :rules="[{ required: true, message: '该字段不能为空' }]"
          >
            <Editor v-model="model.content"></Editor>
          </el-form-item>
          <el-form-item label="评论留言">
            <el-form-item
              label="是否支持留言评论"
              label-width="710px"
            >
              <el-switch v-model="model.isEnableComment"></el-switch>
            </el-form-item>
            <el-form-item
              label-width="0px"
              v-if="model.isEnableComment"
            >
              <el-checkbox v-model="model.isEnableCommentAudit">审核后才显示在页面</el-checkbox>
            </el-form-item>
          </el-form-item>
          <!-- <el-form-item>
            <el-button @click="$router.go(-1)">取消</el-button>
            <el-button
              type="primary"
              @click="onSubmit"
            >确定</el-button>
          </el-form-item> -->
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button
          type="primary"
          @click="onSubmit"
        >确定</el-button>
      </div>
    </QcNavigationPage>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {
        title: '',
        categoryId: '',
        iconUrl: '',
        info: '',
        readPoint: '',
        isEnableComment: false,
        isEnableCommentAudit: false,
        content: ''
      },
      category: [],
      showPoint: true
    }
  },
  created() {
    this.pageCategory()
    this.showReadPoint()
    if (this.$route.query.id) {
      this.getNews()
    }
  },
  methods: {
    pageCategory() {
      this.$http.listForTreeCategory(8).then(res => {
        this.category = res
      })
    },
    showReadPoint() {
      console.log(9999999999999)
      this.$http.showReadPoint().then(res => {
        this.showPoint = res.data.data
        console.log(this.showPoint)
      })
    },
    getNews() {
      this.$http.getNews({ id: this.$route.query.id }).then(res => {
        this.model = res.data.data
      })
    },
    // 提交
    onSubmit() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.saveModel(this.model, this.$route.query.id ? 'updateNews' : 'addNews')
        } else {
          this.$message.error('请将信息填写完整！')
          return false
        }
      })
    },
    saveModel(model, type) {
      this.$http[type](model).then(res => {
        this.$message.success(type === 'updateNews' ? '更新成功' : '添加成功')
        this.$router.go(-1)
        if (this.$route.query.sourcePage && this.$route.query.sourcePage == 'ScrmTalkingList' && res.data.data) {
          // 来源于企业微信的新增话术 选择图文页面
          // 当返回后话术页面后表单自动填入刚才添加的图文
          sessionStorage.setItem('ScrmTalkingImageText', JSON.stringify(res.data.data))
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main_content {
  background-color: #ffffff;
  padding: 20px;
  // margin-top: 20px;
}
.news-form {
  height: 100%;
}
.news-form ::v-deep .naviagetion-page {
  background: transparent !important;
  &__header {
    padding: 0;
  }
  &__body {
    padding: 20px 0;
  }
}
</style>
