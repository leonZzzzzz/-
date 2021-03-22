<template>
  <QcNavigationPage content="课程编辑" full>
    <!-- 基础设置 -->
    <el-form :model="model" ref="base" label-position="left" label-width="100px">
      <el-form-item label="课程名称" prop="title" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.title" style="width:400px;" :maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="课程分类" prop="categoryId" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-select v-model="model.categoryId">
          <el-option :label="item.name" :value="item.id" v-for="(item, i) in categoryList" :key="i"></el-option>
        </el-select>
        <div style="width:10px;display:inline-block;"></div>
        <el-button type="text" @click="categoryListDialogVisible = true">课程分类管理 ></el-button>
      </el-form-item>
      <el-form-item label="课程标签">
        <el-select v-model="model.courseTagLists" multiple>
          <el-option :label="item.name" :value="item.id" v-for="(item, i) in tag" :key="i"></el-option>
        </el-select>
        <div style="width:10px;display:inline-block;"></div>
        <el-button type="text" @click="tagListDialogVisible = true">课程标签管理 ></el-button>
      </el-form-item>
      <el-form-item label="学制" prop="educationalSystem" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.educationalSystem" style="width:400px;"></el-input>
      </el-form-item>
      <el-form-item label="开启预支付" prop="openPrepayment">
        <el-switch v-model="model.openPrepayment"></el-switch>
      </el-form-item>
      <el-form-item
        v-if="model.openPrepayment"
        label="价格"
        prop="price"
        :rules="[
          { required: true, message: '该字段不能为空' },
          { message: '金额格式不正确', pattern: regPrice }
        ]"
      >
        <el-input v-model="model.price" style="width:400px;"></el-input>
      </el-form-item>
      <el-form-item
        :label="model.openPrepayment ? '预支付金额' : '金额'"
        prop="advanceCharge"
        :rules="[
          { required: true, message: '该字段不能为空' },
          { message: '金额格式不正确', pattern: regPrice }
        ]"
      >
        <el-input v-model="model.advanceCharge" style="width:400px;"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contact" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.contact" style="width:400px;"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model.trim="model.contactPhone" style="width:400px;"></el-input>
      </el-form-item>
      <el-form-item label="城市" prop="city" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.city" style="width:400px;"></el-input>
      </el-form-item>
      <el-form-item label="封面图" prop="iconUrl" :rules="[{ required: true, message: '该字段不能为空' }]">
        <QcImageUpload v-model="model.iconUrl"></QcImageUpload>
        <p class="gray">建议尺寸690 * 240，JPG、PNG格式，图片小于5M。</p>
      </el-form-item>
      <el-form-item label="课程简介" prop="info" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input
          v-model="model.info"
          type="textarea"
          :maxlength="156"
          placeholder="建议字数不超过156字"
          style="width:400px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="课程详情" prop="content" :rules="[{ required: true, message: '该字段不能为空' }]">
        <Editor v-model="model.content"></Editor>
      </el-form-item>
      <el-form-item label="评论留言">
        <el-form-item label="是否支持留言评论" label-width="710px">
          <el-switch v-model="model.isEnableComment"></el-switch>
        </el-form-item>
        <el-form-item label-width="0px" v-if="model.isEnableComment">
          <el-checkbox v-model="model.isEnableCommentAudit">审核后才显示在页面</el-checkbox>
        </el-form-item>
      </el-form-item>
      <el-form-item label="排序" prop="seqNum">
        <el-input-number v-model="model.seqNum"></el-input-number>
      </el-form-item>
      <el-form-item label="报名范围" label-width="570px" v-if="is_need_audit == '1'">
        <el-radio-group v-model="model.activitySignSetting.signScope">
          <el-radio label="all">所有人</el-radio>
          <el-radio label="auth">认证用户</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!-- 报名自定义字段设置 -->
    <div class="setting">
      <el-form>
        <QcTitle title="微信端显示报名数包含"></QcTitle>
        <el-form-item>
          <el-checkbox v-model="model.isEnableSignShow">已报名数</el-checkbox>
          <el-checkbox v-model="model.isEnableUnpaidShow">待支付数</el-checkbox>
        </el-form-item>
        <QcTitle title="报名自定义字段设置"></QcTitle>
        <el-form-item>
          <el-switch v-model="model.isShowSignMembers" active-text="是否显示报名详情" class="right"></el-switch>
        </el-form-item>
      </el-form>
      <!-- <p class="desc">
        <span>输入类型为单选或多选时起效。备选项，以下划线分隔。</span>
      </p>-->
      <table cellpadding="0" cellspacing="0" class="act-table">
        <tr>
          <td>序号</td>
          <td>输入类型</td>
          <td>显示名称</td>
          <td>选项</td>
          <td>必填</td>
          <td>已报名资料显示</td>
          <td>报名字段</td>
          <td>操作</td>
        </tr>
        <tr v-for="(item, i) in model.signDataSettingList" :key="i">
          <td>
            <el-input-number
              size="mini"
              v-model="item.sort"
              style="width: 100px;"
              :disabled="model.isRelease"
            ></el-input-number>
          </td>
          <td>
            <el-select v-model="item.type" placeholder="请选择" size="mini" style="width: 120px;">
              <el-option v-for="(item, i) in inputType" :key="i" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </td>
          <td>
            <el-input v-model="item.name" placeholder="请输入内容" size="mini" style="width: 150px;"></el-input>
          </td>
          <td>
            <el-input
              :disabled="item.type !== 2 && item.type !== 3"
              v-model="item.options"
              placeholder="请输入内容"
              size="mini"
              style="width: 200px;"
            ></el-input>
          </td>
          <td>
            <el-switch v-model="item.isRequired" active-text></el-switch>
          </td>
          <td>
            <el-switch v-model="item.isShow" active-text></el-switch>
          </td>
          <td>
            <el-switch v-model="item.isSignShow" active-text></el-switch>
          </td>
          <td>
            <el-button type="danger" size="mini" :disabled="item.fieldName != ''" @click="delDataSetting(i)"
              >删除</el-button
            >
          </td>
        </tr>
        <el-button type="primary" size="mini" class="add" @click="addDataSetting()">新增</el-button>
      </table>

      <div
        style="display: inline-block; padding: 5px 10px 10px;margin-top: 10px;font-size: 14px;line-height: 1.5;color: #777;background: #F5F5F5;"
      >
        备注：
        <br />1.报名默认字段请不要随便修改，如需增加其他字段，请点击“新增”；
        <br />2.输入类型为单选或多选时，选项请以英文下划线“_”分隔；
        <br />3.已报名资料显示：关闭后，用户查看已报名名单则隐藏此字段；
        <br />4.报名字段：关闭后，用户报名是则会隐藏此字段，无需填写
      </div>

      <el-form v-if="showintegral == true" style="margin-top:30px;">
        <QcTitle title="积分设置"></QcTitle>
        <el-form-item label="报名课程积分">
          <template>
            <span class="point">报名成功获得</span>
            <el-input-number
              :min="0"
              v-model="model.signPoint"
              size="small"
              style="width: 120px;margin:0 10px;color:#606266;"
            ></el-input-number>
            <span class="point">积分</span>
          </template>
        </el-form-item>
        <el-form-item label="转发课程积分">
          <template>
            <span class="point">转发成功获得</span>
            <el-input-number
              :min="0"
              v-model="model.sharePoint"
              size="small"
              style="width: 120px;margin:0 10px;color:#606266;"
            ></el-input-number>
            <span class="point">积分</span>
          </template>
        </el-form-item>
        <el-form-item label="转发课程积分单日上限">
          <template>
            <span class="point">转发成功当日最多获得</span>
            <el-input-number
              :min="0"
              v-model="model.maxSharePointPerDay"
              size="small"
              style="width: 120px;margin:0 10px;color:#606266;"
            ></el-input-number>
            <span class="point">积分</span>
          </template>
        </el-form-item>
        <el-form-item label="转发课程积分上限">
          <template>
            <span class="point">转发成功最多获得</span>
            <el-input-number
              :min="0"
              v-model="model.maxSharePoint"
              size="small"
              style="width: 120px;margin:0 10px;color:#606266;"
            ></el-input-number>
            <span class="point">积分</span>
          </template>
        </el-form-item>
        <el-form-item label="邀请好友">
          <template>
            <span class="point">邀请好友报名课程获得</span>
            <el-input-number
              :min="0"
              v-model="model.inviteSignPoint"
              size="small"
              style="width: 120px;margin:0 10px;color:#606266;"
            ></el-input-number>
            <span class="point">积分</span>
          </template>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="submit()" style="margin-left: 30px;" :loading="loading">保存</el-button>
    </div>
    <!-- 课程分类管理 -->
    <el-dialog
      title="活动分类管理"
      :visible.sync="categoryListDialogVisible"
      width="70%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      top="30px"
    >
      <Category :type="3"></Category>
    </el-dialog>
    <!-- 课程标签管理 -->
    <el-dialog
      title="活动分类管理"
      :visible.sync="tagListDialogVisible"
      width="70%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      top="30px"
    >
      <Tag :type="4"></Tag>
    </el-dialog>
  </QcNavigationPage>
</template>
<script>
import { PRICE } from '@/utils/regex'
export default {
  data() {
    return {
      regPrice: PRICE,
      model: {
        title: '',
        courseTagList: [],
        courseTagLists: [],
        productId: '',
        productName: '',
        isRelease: false,
        isEnableComment: false,
        isEnableCommentAudit: false,
        isEnableSignShow: false,
        isEnableToAuditShow: false,
        isEnableUnpaidShow: false,
        signScope: 'all',
        iconUrl: '',
        info: '',
        content: '',
        price: '',
        educationalSystem: '',
        contact: '',
        contactPhone: '',
        city: '',
        advanceCharge: 0,
        type: 1,
        openPrepayment: true,
        // address: "",
        seqNum: 0,
        categoryId: '',
        signDataSettingList: [],
        isShowSignMembers: true,
        signPoint: 0,
        sharePoint: 0,
        maxSharePoint: 0,
        maxSharePointPerDay: 0,
        inviteSignPoint: 0
      },
      inputType: [
        { name: '文本', value: 1 },
        { name: '单选', value: 2 },
        { name: '多选', value: 3 }
        // { name: "时间选择", value: 4 },
        // { name: "图片", value: 5 },
        // { name: "音乐", value: 6 },
        // { name: "文件", value: 7 }
      ],
      categoryList: [],
      tag: [],
      loading: false,
      is_need_audit: 0,
      showintegral: true,
      // 活动分类管理
      categoryListDialogVisible: false,
      // 活动标签管理
      tagListDialogVisible: false
    }
  },
  created() {
    this.listTag()
    this.pageCategory()
    this.isShowsetting()
    this.$http.get(`api/admin/v1/config/is_need_audit`).then((res) => {
      this.is_need_audit = res.data.data.value
    })
    if (this.$route.query.id) {
      this.detail(this.$route.query.id)
    } else {
      this.getSignDataSetting()
    }
  },
  methods: {
    isShowsetting() {
      this.$http.isShowsetting().then((res) => {
        this.showintegral = res.data.data
      })
    },
    pageCategory() {
      this.$http.listForTreeCategory(3).then((res) => {
        this.categoryList = res
      })
    },
    getSignDataSetting() {
      this.$http.getSignDataSetting().then((res) => {
        res.data.data.map((item) => {
          item.isSystem = false
          return item
        })
        this.model.signDataSettingList = res.data.data
        console.log(this.model.signDataSettingList)
      })
    },
    listTag() {
      this.$http.pageTag({ type: 4 }).then((res) => {
        this.tag = res.data.data.list
      })
    },
    detail(id) {
      this.$http.getLesson({ id: id }).then((res) => {
        console.log(res)
        let data = res.data.data
        data.courseTagLists = []
        if (data.courseTagList.length > 0) {
          data.courseTagList.map((item) => {
            data.courseTagLists.push(item.tagId)
          })
        }
        if (data.advanceCharge) {
          data.advanceCharge = data.advanceCharge / 100
        }
        if (!data.productId) data.productId = ''
        if (!data.productName) data.productName = ''
        this.model = data
        // if (this.model.price)
        //   this.model.price = this.model.price / 100;
        if (this.$route.query.copy === 'true') this.model = this.copy(this.model)
      })
    },
    copy(model) {
      for (let key in model) {
        if (model[key].constructor === Array) {
          model[key].map((item) => {
            for (let key in item) {
              if (key === 'id' || key === 'createTime' || key === 'courseId') {
                delete item[key]
              }
            }
          })
        }
        if (key === 'id' || key === 'createTime') {
          delete model[key]
        }
      }
      model.isRelease = false
      console.log('copy', model)
      return model
    },
    addDataSetting() {
      let data = {
        sort: (this.model.signDataSettingList.length + 1) * 10,
        name: '',
        fieldName: '',
        type: 1,
        options: '',
        isRequired: true,
        isShow: true,
        isSignShow: true,
        isSystem: false
      }
      this.model.signDataSettingList.push(data)
    },
    delDataSetting(i) {
      if (i < 2) return false
      this.model.signDataSettingList.splice(i, 1)
    },
    check() {
      let state = false
      this.$refs.base.validate((valid) => {
        state = valid
      })
      if (!state) {
        this.$message.error('请将基础设置信息填写完整！')
        return false
      }
      return state
    },
    submit() {
      if (!this.check()) return false
      let model = JSON.parse(JSON.stringify(this.model))
      // if (model.price) model.price = Math.floor(model.price * 100);
      model.courseTagList = []
      model.courseTagLists.map((item) => {
        model.courseTagList.push({ tagId: item })
      })
      if (model.advanceCharge) model.advanceCharge = parseFloat(model.advanceCharge) * 100
      console.log('model', model)
      // return false
      this.loading = true
      // if (this.$route.query.id) this.updateLesson(model);
      // else this.addLesson(model);
      if (this.$route.query.copy) this.addLesson(model)
      else if (this.$route.query.id) this.updateLesson(model)
      else this.addLesson(model)
    },
    updateLesson(model) {
      this.$http
        .updateLesson(model)
        .then((res) => {
          this.loading = false
          console.log(res)
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.go(-1)
          }, 500)
        })
        .catch(() => {
          this.loading = false
        })
    },
    addLesson(model) {
      this.$http
        .addLesson(model)
        .then((res) => {
          this.loading = false
          console.log(res.data)
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.go(-1)
          }, 500)
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.inline {
  display: inline-block;
  margin-bottom: 0;
}
.right {
  margin-right: 30px;
}
.right-30 {
  margin-right: 30px;
}
.zi {
  padding: 10px;
  border: 1px solid #e7eaec;
  margin-top: 20px;
  position: relative;
  .del {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}

.act-table {
  border: 1px solid #dfe6ec;
  position: relative;
  .add {
    position: absolute;
    top: -35px;
    right: 0;
  }
  tr {
    &:first-child {
      background: #eef1f6;
    }
    th,
    td {
      padding: 7px 10px;
      text-align: center;
      white-space: nowrap;
    }
  }
}
.desc {
  color: #7b7b7b;
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 5px;
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
.point {
  margin-left: 30px;
}
</style>
