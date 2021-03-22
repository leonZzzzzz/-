<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <Tabbar tab-text="签到墙设置"></Tabbar>
    <div class="context-box" :style="{ height: `${areaHeight}px` }" ref="context">
      <el-form class="form" :model="model" ref="base" label-position="left" label-width="100px" size="small">
        <FormTypeTitle text="基础设置"></FormTypeTitle>
        <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input
            size="small"
            v-model="model.title"
            style="width:400px;"
            :maxlength="24"
            placeholder="建议10字内（不超过24字）"
          ></el-input>
        </el-form-item>
        <el-form-item prop="sourceId" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-button size="small" style="margin-bottom: 20px;" @click="openDialogTable">选择活动</el-button>
          <div v-if="model.sourceId" class="souce-data" style="">
            <img v-if="sourceData.iconUrl" :src="imgHost + sourceData.iconUrl" alt="" />
            <p style="">{{ sourceData.title }}</p>
            <el-button class="btn" size="mini" @click="cancelCurrent">取消关联</el-button>
          </div>
        </el-form-item>
        <el-form-item label="活动密码" prop="password" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input
            size="small"
            type="text"
            v-model.trim="model.password"
            style="width:220px;"
            maxlength="32"
            placeholder="打开活动的密码"
          ></el-input>
        </el-form-item>
        <FormTypeTitle text="图片设置"></FormTypeTitle>
        <el-form-item>
          <el-form :inline="true" label-position="top" style="margin-left: 20px;">
            <el-form-item
              label="显示LOGO"
              prop="bgImgUrl"
              :rules="[{ required: false, message: '该字段不能为空' }]"
              style="margin-right: 20px;"
            >
              <div class="upload-img-box item_error" @click="showImgBox(true, 'logoUrl')">
                <img v-if="model.logoUrl" :src="imgHost + model.logoUrl" style="width: 120px;" />
                <i v-else class="el-icon-plus upload-icon"></i>
              </div>
            </el-form-item>
            <el-form-item
              label="背景图片"
              prop="bgImgUrl"
              :rules="[{ required: false, message: '该字段不能为空' }]"
              style="margin-right: 20px;"
            >
              <div class="upload-img-box item_error" @click="showImgBox(true, 'bgImgUrl')">
                <img v-if="model.bgImgUrl" :src="imgHost + model.bgImgUrl" style="width: 120px;" />
                <i v-else class="el-icon-plus upload-icon"></i>
              </div>
            </el-form-item>
            <el-form-item label="活动二维码" prop="qrCodeUrl" :rules="[{ required: false, message: '该字段不能为空' }]">
              <div class="upload-img-box item_error" @click="showImgBox(true, 'qrCodeUrl')">
                <img v-if="model.qrCodeUrl" :src="imgHost + model.qrCodeUrl" style="width: 120px;" />
                <i v-else class="el-icon-plus upload-icon"></i>
              </div>
            </el-form-item>
          </el-form>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="选择活动"
      width="65%"
      :visible.sync="dialogTable"
      @close="closeDialogTable"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="border: 1px solid #ebeef5;">
        <div ref="search">
          <search-wrap>
            <el-form :inline="true">
              <el-form-item label="">
                <el-input size="small" v-model.trim="searchData.title" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="search(2)">查询</el-button>
              </el-form-item>
            </el-form>
          </search-wrap>
        </div>
        <qc-table-old
          v-if="dialogTable"
          ref="table"
          :table-list="showData"
          :search="searchData"
          :autoHeight="500"
          style="padding-bottom: 50px;"
          url="api/admin/v1/activity/page"
        ></qc-table-old>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="tableList.id == null" size="mini" @click="saveCurrent">确 定</el-button>
      </span>
    </el-dialog>
    <div class="bottom-btn">
      <el-button type="primary" @click="submit(1)" size="small" :loading="loading">保存</el-button>
    </div>
    <edit-image
      :visible="digImgWrap"
      image-type="lottery"
      :cropper-option="cropperOption"
      :img-name="imgName"
      :on-close="showImgBox"
      :on-singleimg="getSingleimg"
      :is-cut="isCut"
    ></edit-image>
  </div>
</template>

<script>
import { tableMixin } from '@/mixins/tableMixin'
import loginMixin from '@/mixins/loginMixin'

export default {
  mixins: [tableMixin, loginMixin],
  data() {
    return {
      digImgWrap: false,
      dialogTable: false,
      areaHeight: 0,
      model: {
        title: '',
        info: '',
        sourceId: '',
        password: '',
        bgImgUrl: '',
        logoUrl: '',
        qrCodeUrl: ''
      },
      searchData: {
        title: '',
        name: ''
      },
      showData: [
        { template: 'index' },
        { prop: 'iconUrl', label: '图标', template: 'img', isPrefix: true },
        { prop: 'title', label: '活动名称' },
        { prop: 'isRelease', label: '发布', template: 'Boolean' },
        { prop: 'endTime', label: '结束时间' }
      ],
      sourceData: {},
      dataLoading: false,
      loading: false,
      isCut: true,
      cropperOption: {
        autoCropWidth: 500,
        autoCropHeight: 500,
        autoCrop: true,
        fixedBox: true,
        canMoveBox: false
      },
      imgName: ''
    }
  },
  created() {
    if (this.$route.query.id) {
      this.dataLoading = true
      this.detail(this.$route.query.id)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getHeight()
    })
    window.onresize = () => {
      this.getHeight()
    }
  },
  methods: {
    // 设置高度
    getHeight() {
      this.areaHeight = window.innerHeight - 100 - 142
    },
    async detail(id) {
      let res = await this.$http.signInGet({ id: id })
      let data = res.data.data
      this.model = data
      if (data.activity) {
        this.sourceData = data.activity
      }
      if (this.$route.query.copy === 'true') this.model = this.copy(this.model)
      this.dataLoading = false
    },
    showImgBox(state, imgName) {
      if (imgName) {
        this.imgName = imgName
        if (imgName === 'bgImgUrl') this.isCut = !true
        else this.isCut = true
      }
      this.digImgWrap = state
    },
    // 单张图片
    getSingleimg(val, imgName) {
      this.model[imgName] = val
    },
    openDialogTable() {
      this.dialogTable = true
    },
    closeDialogTable() {
      this.dialogTable = false
    },
    saveCurrent() {
      this.model.sourceId = this.tableList.id
      this.sourceData = this.tableList
      this.closeDialogTable()
    },
    cancelCurrent() {
      this.model.sourceId = ''
      this.sourceData = {}
    },
    check() {
      let state = false
      this.$refs.base.validate((valid) => {
        state = valid
      })
      if (!state) {
        this.$message.warning('请将信息填写完整！')
        return false
      }
      return state
    },
    submit() {
      if (!this.check()) return false
      this.loading = true
      this.saveModel(this.model, this.$route.query.id || this.model.id ? 'signInUpdate' : 'signInInsert')
    },
    async saveModel(model, fetch) {
      try {
        await this.$http[fetch](model)
        this.loading = false
        this.$message({
          message: fetch === 'signInUpdate' ? '修改成功' : '保存成功',
          type: 'success'
        })
        this.$router.back()
      } catch (err) {
        this.loading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true)
        }
      }
    },
    searchModel() {
      this.getModelList()
    },
    submitModel() {
      this.model.receiverIds = this.tableId.split('_')
      this.closeDialogTable()
    }
  }
}
</script>

<style lang="scss" scoped>
.context-box {
  .souce-data {
    display: flex;
    align-items: center;
    overflow: hidden;
    width: 620px;
    padding: 10px;
    background: rgba(245, 247, 250, 1);
    img {
      width: 60px;
      height: 60px;
      margin-right: 20px;
    }
    p {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 10px;
    }
  }
}

.bottom-btn {
  text-align: center;
  height: 50px;
  line-height: 50px;
  border-top: 1px solid #e7eaec;
  box-shadow: 0px -2px 6px #eee;
}
</style>
