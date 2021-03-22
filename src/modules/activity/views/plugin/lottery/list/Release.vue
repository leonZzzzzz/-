<template>
  <!-- <div class="wrap" ref="wrap" v-loading="dataLoading"> -->
  <QcNavigationPage content="抽奖设置" v-loading="dataLoading" style="min-width:1000px">
    <!-- <Tabbar tab-text="抽奖设置"></Tabbar> -->
    <div class="context-box" :style="{ height: `${areaHeight}px` }" ref="context">
      <el-form class="form" :model="model" ref="base" label-position="left" label-width="100px" size="small">
        <FormTypeTitle text="基础设置"></FormTypeTitle>
        <el-form-item label="活动名称" prop="title" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input
            size="small"
            v-model="model.title"
            style="width:400px;"
            :maxlength="24"
            placeholder="建议10字内（不超过24字）"
          ></el-input>
        </el-form-item>
        <el-form-item label="抽奖类型" prop="raffledType" :rules="[{ required: true, message: '该字段不能为空' }]">
          <!-- <el-radio v-model="model.raffledType" label="lottery_item">按奖品抽嘉宾</el-radio> -->
          <el-radio v-model="model.raffledType" label="guest">按嘉宾抽奖品</el-radio>
        </el-form-item>
        <el-form-item label="参与嘉宾" prop="sourceType" :rules="[{ required: true, message: '该字段不能为空' }]">
          <!-- <el-radio v-model="model.sourceType" :label="1">关联活动报名</el-radio> -->
          <el-radio v-model="model.sourceType" :label="2">关联活动签到</el-radio>
          <!-- <el-radio v-model="model.sourceType" :label="3" v-if="$route.query.showType != 3">导入编号</el-radio> -->
        </el-form-item>
        <el-form-item
          v-if="model.sourceType === 1 || model.sourceType === 2"
          prop="sourceId"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-button size="small" style="margin-bottom: 20px;" @click="openDialogTable">选择活动</el-button>
          <div v-if="model.sourceId" class="souce-data" style="">
            <img v-if="sourceData.iconUrl" :src="imgHost + sourceData.iconUrl" alt="" />
            <p style="">{{ sourceData.title }}</p>
            <el-button class="btn" size="mini" @click="cancelCurrent">取消关联</el-button>
          </div>
        </el-form-item>
        <el-form-item v-if="model.sourceType === 3" prop="">
          <p class="img-tips">tips：导入前，请先保存</p>
          <p class="img-tips" v-if="fileName">{{ fileName }}</p>
          <up-load-file
            :id="model.id"
            :data="{ id: model.id }"
            title="导入"
            url="api/admin/v1/lottery/import"
            icon="el-icon-upload"
            @file-success="fileSuccess"
            style="margin: 0 20px 20px 0;"
          ></up-load-file>
          <el-button type="primary" size="mini" @click="download">下载导入模板</el-button>
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
        <el-form-item label="开启弹幕审核" prop="isCheckDialog">
          <el-switch v-model="model.isCheckDialog" active-text=""></el-switch>
        </el-form-item>
        <FormTypeTitle text="奖项设置">
          <el-button size="mini" type="primary" @click="addItem()" style="margin-left: 10px;">添加</el-button>
        </FormTypeTitle>
        <!-- <el-form-item> -->
        <table class="property-table item_error">
          <tr>
            <!-- <th v-for="(item, i) in tableTitle" :key="i">{{item.title}}</th> -->
            <th v-if="$route.query.id || model.id">已抽中数</th>
            <th>排序</th>
            <th>奖品名</th>
            <th>奖品数</th>
            <th v-if="model.raffledType == 'guest'">中奖</th>
            <th v-if="model.raffledType == 'guest'">中奖概率</th>
            <th>奖品图</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item, i) in model.itemList" :key="i">
            <td v-if="$route.query.id || model.id">
              <el-form-item label-width="0px">
                <el-input size="small" v-model.number="item.winNum" style="width: 50px" :disabled="true"></el-input>
              </el-form-item>
            </td>
            <td style="width: 100px;">
              <el-form-item
                label-width="0px"
                :prop="`itemList[${i}].seqNum`"
                :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-input-number :min="1" size="small" v-model="item.seqNum" style="width: 100px;"></el-input-number>
              </el-form-item>
            </td>
            <td>
              <el-form-item
                label-width="0px"
                :prop="`itemList[${i}].title`"
                :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-input
                  size="small"
                  v-model.trim="item.title"
                  :maxLength="16"
                  placeholder="建议10字内；不超过16字；"
                ></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item
                label-width="0px"
                :prop="`itemList[${i}].awardNum`"
                :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-input-number
                  :min="1"
                  :disabled="item.awardType === 'lose'"
                  size="small"
                  v-model="item.awardNum"
                  style="width: 120px;"
                ></el-input-number>
              </el-form-item>
            </td>
            <td v-if="model.raffledType == 'guest'">
              <el-form-item label-width="0px" :prop="`itemList[${i}].awardType`">
                <!-- <el-switch v-model="item.awardType"></el-switch> -->
                <el-switch v-model="item.awardType" active-value="win" inactive-value="lose"></el-switch>
              </el-form-item>
            </td>
            <td v-if="model.raffledType == 'guest'">
              <el-form-item
                label-width="0px"
                :prop="`itemList[${i}].rate`"
                :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-input size="small" v-model.number="item.rate" style="width: 120px" placeholder="0~100的值">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </td>
            <td @click="showImgBox(true, 'item', i)">
              <el-form-item
                label-width="0px"
                :prop="`itemList[${i}].imgUrl`"
                :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <img v-if="item.imgUrl" style="width: 60px; height: 60px;" :src="imgHost + item.imgUrl" alt="" />
                <el-button v-else type="primary" size="small">上传</el-button>
              </el-form-item>
            </td>
            <td>
              <el-button size="small" type="danger" @click="delItem(i)">删除</el-button>
            </td>
          </tr>
        </table>

        <!-- </el-form-item> -->

        <FormTypeTitle text="图片设置"></FormTypeTitle>
        <!-- <el-form-item> -->
        <el-form :inline="true" label-position="top">
          <el-form-item
            label="活动标题"
            prop="logoUrl"
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
          <el-form-item
            v-if="model.raffledType != 'guest' && (model.sourceType === 1 || model.sourceType === 2)"
            label="活动二维码"
            prop="qrCodeUrl"
            :rules="[{ required: false, message: '该字段不能为空' }]"
          >
            <div class="upload-img-box item_error" @click="showImgBox(true, 'qrCodeUrl')">
              <img v-if="model.qrCodeUrl" :src="imgHost + model.qrCodeUrl" style="width: 120px;" />
              <i v-else class="el-icon-plus upload-icon"></i>
            </div>
          </el-form-item>
        </el-form>
        <!-- </el-form-item> -->
      </el-form>
    </div>
    <el-dialog
      title="选择活动"
      width="800px"
      :visible.sync="dialogTable"
      @close="closeDialogTable"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="border: 1px solid #ebeef5;">
        <QcTable
          :option="option"
          :search-form="searchForm"
          :showSearchButtons="false"
          :column="column"
          @row-click="rowClick"
        ></QcTable>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="tableRow.id == null" size="mini" @click="saveCurrent">确 定</el-button>
      </span>
    </el-dialog>
    <div class="bottom-btn">
      <el-button type="primary" @click="submit(1)" style="margin-left: 30px;" size="small" :loading="loading"
        >保存</el-button
      >
    </div>

    <login-dialog :visible="digLogin" @close="closeLogin"></login-dialog>
    <edit-image
      :visible="digImgWrap"
      image-type="lottery"
      :cropper-option="cropperOption"
      :img-name="imgName"
      :on-close="showImgBox"
      :on-singleimg="getSingleimg"
      :is-cut="isCut"
    ></edit-image>
    <!-- </div> -->
  </QcNavigationPage>
</template>

<script>
import loginMixin from '@/mixins/loginMixin'

export default {
  mixins: [loginMixin],
  data() {
    return {
      digImgWrap: false,
      dialogTable: false,
      areaHeight: 0,
      model: {
        title: '',
        info: '',
        bgImgUrl: '',
        logoUrl: '',
        qrCodeUrl: '',
        sourceType: 2,
        showType: this.$route.query.showType,
        sourceId: '',
        password: '',
        isStart: false,
        // 开启弹幕审核
        isCheckDialog: false,
        // 抽奖类型：lottery_item按奖品抽取嘉宾，guest按嘉宾抽取奖品
        raffledType: 'guest',
        itemList: [
          {
            title: '',
            imgUrl: '',
            awardNum: 1,
            seqNum: 1,
            // 中奖类型：win中奖，lose未中奖。raffledType=guest时才允许填写此值
            awardType: null,
            // 中奖几率：值越大，该奖品越容易被抽中。raffledType=guest时才允许填写此值
            rate: null
          }
        ]
      },
      option: {
        url: 'api/admin/v1/activity/page',
        size: 'small',
        height: 400
      },
      searchForm: [
        {
          type: 'input',
          formName: 'title',
          value: ''
        }
      ],
      column: [
        { label: '序号', type: 'index' },
        { prop: 'title', label: '活动名称' },
        {
          prop: 'iconUrl',
          label: '封面',
          formatter: (row) => {
            return <img src={this.imgHost + row.iconUrl} width="100px" alt="" />
          }
        },
        {
          prop: 'isRelease',
          label: '发布',
          formatter: (row) => {
            row.isRelease ? '是' : '否'
          }
        },
        { prop: 'endTime', label: '结束时间' }
      ],
      searchData: {
        title: '',
        name: ''
      },
      sourceData: {},
      dataLoading: false,
      loading: false,
      tableTitle: [
        { title: '排序', value: '' },
        { title: '奖品名', value: '' },
        { title: '奖品数', value: '' },
        { title: '奖品图', value: '' },
        { title: '操作', value: '' }
      ],
      fileName: '',
      isCut: true,
      cropperOption: {
        autoCropWidth: 500,
        autoCropHeight: 500,
        autoCrop: true,
        fixedBox: true,
        canMoveBox: false
      },
      itemIndex: '',
      imgName: '',
      tableRow: {}
    }
  },
  created() {
    console.log(this.imgHost)
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
      this.areaHeight = window.innerHeight - 100 - 142 - 13
    },
    download() {
      location.href = `http://athena-1255600302.cosgz.myqcloud.com/attachments/ExcelTemplate/%E6%8A%BD%E5%A5%96%E4%BA%BA%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls`
    },
    rowClick(row) {
      this.tableRow = row
    },
    getTestData() {
      this.model = JSON.parse(sessionStorage.getItem('testLotteryData'))
      this.$delete(this.model, 'id', '')
    },
    detail(id) {
      this.$http
        .getLottery({ id: id })
        .then((res) => {
          this.dataLoading = false
          let data = res.data.data
          this.model = data
          if (data.activity) {
            this.sourceData = data.activity
          }
          if (this.$route.query.copy === 'true') this.model = this.copy(this.model)
        })
        .catch(() => {
          this.dataLoading = false
        })
    },
    // 复制活动
    copy(model) {
      model = JSON.parse(JSON.stringify(model))
      for (let key in model) {
        if (model[key].constructor === Array) {
          model[key].map((item) => {
            for (let key in item) {
              if (key === 'winNum') {
                item[key] = 0
              }
              if (
                key === 'id' ||
                key === 'appId' ||
                key === 'updateTime' ||
                key === 'createTime' ||
                key === 'isDeleted' ||
                key === 'lotteryId'
              ) {
                delete item[key]
              }
            }
          })
        }
        if (model[key].constructor === Object) {
          for (let v in model[key]) {
            if (v === 'id' || v === 'appId' || v === 'updateTime' || v === 'createTime') {
              delete model[key][v]
            }
          }
        }
        if (key === 'id' || key === 'appId' || key === 'updateTime' || key === 'isRelease') {
          delete model[key]
        }
      }
      return model
    },
    showImgBox(state, imgName, index) {
      if (imgName) {
        this.imgName = imgName
        if (imgName === 'item') {
          this.isCut = false
          this.itemIndex = index
        } else {
          if (imgName === 'bgImgUrl') this.isCut = false
          else if (imgName === 'logoUrl' && this.model.raffledType === 'guest') this.isCut = false
          else this.isCut = true
        }
      }
      this.digImgWrap = state
    },
    // 单张图片
    getSingleimg(val, imgName) {
      if (imgName == 'item') {
        this.model.itemList[this.itemIndex].imgUrl = val
      } else {
        this.model[imgName] = val
      }
    },
    openDialogTable() {
      this.dialogTable = true
    },
    closeDialogTable() {
      this.dialogTable = false
    },
    saveCurrent() {
      this.model.sourceId = this.tableRow.id
      this.sourceData = this.tableRow
      this.closeDialogTable()
    },
    cancelCurrent() {
      this.model.sourceId = ''
      this.sourceData = {}
    },
    fileSuccess(file) {
      this.fileName = file.name
      this.sourceData.title = '导入成功'
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
      if (this.model.itemList.length === 0) {
        this.$message.warning('请添加奖项！')
        return false
      }
      return state
    },
    addItem() {
      if (this.model.itemList.length >= 10) {
        this.$message.warning('奖项数量已上限！')
        return
      }
      let item = {
        title: '',
        imgUrl: '',
        awardNum: 1,
        seqNum: this.model.itemList.length + 1
      }
      this.model.itemList.push(item)
    },
    delItem(i) {
      this.model.itemList.splice(i, 1)
    },
    submit() {
      if (!this.check()) return false
      this.loading = true
      if (this.$route.query.copy === 'true') {
        this.saveLottery(this.model, 'addLottery')
        return
      }
      this.saveLottery(this.model, this.$route.query.id || this.model.id ? 'updateLottery' : 'addLottery')
    },
    async saveLottery(model, fetch) {
      try {
        let res = await this.$http[fetch](model)
        this.loading = false
        console.log(res)
        this.$message({
          message: fetch == 'updateLottery' ? '修改成功' : '保存成功',
          type: 'success'
        })
        // this.detail(res.data.message);
        this.model.id = res.data.message
        setTimeout(() => {
          this.$router.go(-1)
        }, 500)
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
  padding: 0;
  .property-table {
    min-width: 400px;
    border: 1px solid #e7eaec;
    margin-top: 10px; // width: 900px;
    border-spacing: 0;
    border-collapse: collapse;
    .el-form-item {
      margin-bottom: 0 !important;
    }
    tr {
      th {
        padding: 5px 10px;
        line-height: 1.5;
        .input-group {
          display: flex;
        }
      }
      td {
        border-top: 1px solid #e7eaec;
        line-height: 1.5;
        padding: 15px 12px;
        text-align: center;
        img {
          cursor: pointer;
        }
      }
    }
  }
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
