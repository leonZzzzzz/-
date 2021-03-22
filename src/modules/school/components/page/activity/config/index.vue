<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <!-- <FormTypeTitle :text="orderModel.name"/>
    <div style="padding:30px 0;">
      <el-radio-group v-model="orderModel.value" @change="activityOrderTypePost">
        <el-radio label="0">智能排序</el-radio>
        <el-radio label="1">按序号从大到小</el-radio>
      </el-radio-group>
    </div> -->
    <!-- <FormTypeTitle text="报名成功图">
      <el-button type="primary" size="small" :loading="loading" @click="saveSign()">保存</el-button>
    </FormTypeTitle>
    <el-form class="form" :model="model" ref="model" label-position="left" label-width="120px" size="small">
      <el-form-item label="报名成功图" prop="imgUrl">
        <div class="upload-img-box" @click="showImgBox(true)">
          <img v-if="model.imgUrl" :src="`${imgHost}${model.imgUrl}`" style="width: 120px;">
          <i v-else class="el-icon-plus upload-icon"></i>
        </div>
      </el-form-item>
      <el-form-item label="跳转链接" prop="text">
        <el-input v-model="model.text" style="width: 400px;"></el-input>
      </el-form-item>
    </el-form> -->
    <FormTypeTitle text="活动报名字段配置">
      <el-button type="primary" size="small" :loading="loading" @click="saveSignDataSetting()">保存</el-button>
    </FormTypeTitle>
    <el-table :data="signDataSettingList" :header-cell-style="{'background-color': '#fbfbfb'}">
      <el-table-column align="center" label="序号" width="120px">
        <template slot-scope="scope">
          <el-input-number
            :disabled="scope.$index < 4 && scope.row.fieldName === 'name' || scope.row.fieldName === 'mobile' || scope.row.fieldName === 'company' || scope.row.fieldName === 'position'"
            size="small"
            v-model="scope.row.sort"
            style="width: 100px;"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column align="center" label="输入类型">
        <template slot-scope="scope">
          <el-select
            :disabled="scope.$index < 4 && scope.row.fieldName === 'name' || scope.row.fieldName === 'mobile' || scope.row.fieldName === 'company' || scope.row.fieldName === 'position'"
            v-model="scope.row.type"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="(item, i) in inputType"
              :key="i"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示名称">
        <template slot-scope="scope">
          <el-input
            :disabled="scope.$index < 4 && scope.row.fieldName === 'name' || scope.row.fieldName === 'mobile' || scope.row.fieldName === 'company' || scope.row.fieldName === 'position'"
            v-model="scope.row.name"
            placeholder="请输入内容"
            size="small"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" label="对应会员字段">
        <template slot-scope="scope">
          <el-input
            :disabled="scope.$index < 4 && scope.row.fieldName === 'name' || scope.row.fieldName === 'mobile' || scope.row.fieldName === 'company' || scope.row.fieldName === 'position'"
            v-model="scope.row.fieldName"
            placeholder="请输入内容"
            size="small"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" label="选项">
        <template slot-scope="scope">
          <el-input
            :disabled="scope.$index < 4 || scope.row.type !== 2 && scope.row.type !== 3"
            v-model="scope.row.options"
            :placeholder="scope.row.type == 2 || scope.row.type ==3 ? '备选项请用 ‘_’ 分隔': '请输入内容'"
            size="small"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" label="必填" width="100px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isRequired"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已报名资料显示" width="100px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isShow"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100px">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="small"
            :disabled="scope.$index < 4 && scope.row.fieldName === 'name' || scope.row.fieldName === 'mobile' || scope.row.fieldName === 'company' || scope.row.fieldName === 'position'"
            @click="delDataSetting(scope.$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="add-setting-btn" @click="addDataSetting()">
      <i class="el-icon-plus"></i>添加报名字段
    </div>
    <div style="display: inline-block; padding: 5px 10px 10px;margin-top: 10px;font-size: 14px;line-height: 1.5;color: #777;background: #F5F5F5;">
      备注：<br/>
      1.报名默认字段请不要随便修改，如需增加其他字段，请点击“新增”；<br/>
      2.输入类型为单选或多选时，选项请以英文下划线“_”分隔；<br/>
      3.已报名资料显示：关闭后，用户查看已报名名单则隐藏此字段；<br/>
      4.报名字段：关闭后，用户报名是则会隐藏此字段，无需填写
    </div>
    <!-- <login-dialog :visible="digLogin" @close="closeLogin"></login-dialog>
    <image-dialog
      :visible="digImgWrap"
      imageType="activity"
      @close-imgbox="showImgBox"
      @get-imgsrc="onGetImgsrc"
      imgName="imgUrl"
    ></image-dialog> -->
  </div>
</template>

<script>
import api from "apiSchool/common"
// import loginMixin from '@/assets/js/loginMixin'
// import upLoadMixin from 'jsSchool/upLoadMixin'
import FormTypeTitle from '../../../common/form-type-title'

export default {
  // mixins: [loginMixin, upLoadMixin],
  components: {
    FormTypeTitle,
  },
  data() {
    return {
      //#region 活动配置
      signDataSettingList: [],
      inputType: [
        { name: '文本', value: 1 },
        { name: '单选', value: 2 },
        { name: '多选', value: 3 },
        // { name: '时间选择', value: 4 },
        // { name: '图片', value: 5 },
        // { name: '音乐', value: 6 },
        // { name: '文件', value: 7 },
      ],
      loading: false,
      dataLoading: false,
      //#endregion
      //#region 报名成功
      model: {
        imgUrl: '',
        text: '',
      },
      digImgWrap: false,
      activitySignSuccess: {},
      //#endregion
      //#region 活动排序
      orderModel: {},
      //#endregion
    }
  },
  created() {
    this.dataLoading = true
    this.getSignDataSetting()
    // this.activityOrderTypeGet()
    // this.activitySignSuccessGet()
  },
  methods: {
    // #region 活动报名配置
    async getSignDataSetting() {
      try {
        let res = await api.getSignDataSetting()
        this.signDataSettingList = res.data.data
        this.dataLoading = false
      } catch(e) {
        this.dataLoading = false
      }
    },
    check() {
      for (let i = 0, len = this.signDataSettingList.length; i < len; i++) {
        let item = this.signDataSettingList[i]
        if (item.type === 2 || item.type === 3) {
          for (let key in item) {
            if (item[key] === null || item[key] === '') {
              this.$message({
                message: '请将数据输入完整',
                type: 'warning',
              })
              return true
            }
          }
        } else {
          for (let key in item) {
            if (item[key] === null || (item[key] === '' && key !== 'options')) {
              this.$message({
                message: '请将数据输入完整',
                type: 'warning',
              })
              return true
            }
          }
        }
      }
      return false
    },
    async saveSignDataSetting() {
      if (this.check()) return
      this.loading = true
      try {
        let res = await api.saveSignDataSetting(this.signDataSettingList)
        this.loading = false
        this.$message.success('保存成功')
        this.getSignDataSetting()
      } catch(e) {
        this.loading = false
      }
    },
    addDataSetting() {
      let data = {
        sort: (this.signDataSettingList.length + 1) * 10,
        name: '',
        fieldName: '',
        type: 1,
        options: '',
        isRequired: true,
        isShow: true,
      }
      this.signDataSettingList.push(data)
    },
    delDataSetting(i) {
      this.signDataSettingList.splice(i, 1)
    },
    // #endregion
    // #region 活动排序
    activityOrderTypeGet() {
      api.activityOrderTypeGet().then(res => {
        this.orderModel = res.data.data
      })
    },
    activityOrderTypePost() {
      api.activityOrderTypePost(this.orderModel).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success',
        })
      })
    },
    //#endregion
    //#region 活动报名成功配置
    saveSign() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.activitySignSuccess.value = this.model.imgUrl + ',' + this.model.text
          this.activitySignSuccessPost()
        } else {
          return false
        }
      })
    },
    activitySignSuccessGet() {
      api.activitySignSuccessGet().then(res => {
        if (res.data.data) {
          this.activitySignSuccess = res.data.data
          let value = this.activitySignSuccess.value.split(',')
          this.model.imgUrl = value[0]
          this.model.text = value[1]
        }
        this.dataLoading = false
      })
    },
    activitySignSuccessPost() {
      this.loading = true
      api
        .activitySignSuccessPost(this.activitySignSuccess)
        .then(res => {
          this.loading = false
          this.$message({
            message: '保存成功',
            type: 'success',
          })
          this.activitySignSuccessGet()
        })
        .catch(() => {
          this.loading = false
          if (/超时/.test(err.data.message)) {
            this.closeLogin(true)
          }
        })
    },
    //#endregion
  },
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 20px;
}
.add-setting-btn {
  width: 100%;
  text-align: center;
  padding: 20px 0;
  background: #fff;
}
.data-setting {
  padding: 20px;
}
.data-table {
  width: 1050px;
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
.save {
  width: 1050px;
  text-align: center;
  padding: 10px 0;
}
</style>
