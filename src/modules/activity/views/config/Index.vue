<template>
  <div class="wrap" v-loading="dataLoading">
    <FormTypeTitle :text="orderModel.name" />
    <div style="padding:30px 0;">
      <el-radio-group v-model="orderModel.value" @change="activityOrderTypePost">
        <el-radio label="0">状态排序</el-radio>
        <el-radio label="1">按序号从大到小</el-radio>
        <el-radio label="2">时间排序</el-radio>
      </el-radio-group>
      <div
        style="width: 320px;padding: 5px 10px 10px;margin-top: 10px;font-size: 14px;line-height: 1.5;color: #777;background: #F5F5F5;"
      >
        状态排序：按活动状态未发布-进行中-已结束排序<br />
        序号排序：按活动序号由大到小排序<br />
        时间排序：按活动创建时间排序
      </div>
    </div>
    <FormTypeTitle text="报名成功图">
      <el-button type="primary" size="small" :loading="loading" @click="saveSign()">保存</el-button>
    </FormTypeTitle>
    <el-form class="form" :model="model" ref="model" label-position="left" label-width="106px" size="small">
      <el-form-item label="报名成功图" prop="imgUrl">
        <QcImageUpload v-model="model.imgUrl" width="250px" height="66"></QcImageUpload>
      </el-form-item>
      <el-form-item label="跳转链接" prop="text">
        <el-input v-model="model.text" style="width: 400px;"></el-input>
      </el-form-item>
    </el-form>

    <FormTypeTitle text="报名成功订阅消息ID">
      <el-button type="primary" size="small" :loading="configSignSubscribe.loading" @click="saveSignSubscribe()"
        >保存</el-button
      >
    </FormTypeTitle>
    <el-form
      class="form"
      :model="configSignSubscribe"
      ref="configSignSubscribe"
      label-position="left"
      label-width="106px"
      size="small"
    >
      <el-form-item label="订阅消息ID" prop="value">
        <el-input v-model="configSignSubscribe.value" style="width: 400px;"></el-input>
      </el-form-item>
    </el-form>

    <FormTypeTitle text="活动报名字段配置">
      <el-button type="primary" size="small" :loading="loading" @click="saveSignDataSetting()">保存</el-button>
    </FormTypeTitle>
    <el-table :data="signDataSettingList" :header-cell-style="{ 'background-color': '#fbfbfb' }">
      <el-table-column align="center" label="序号" width="120px">
        <template slot-scope="scope">
          <el-input-number
            :disabled="
              (scope.$index < 4 && scope.row.fieldName === 'name') ||
                scope.row.fieldName === 'mobile' ||
                scope.row.fieldName === 'company' ||
                scope.row.fieldName === 'position'
            "
            size="small"
            v-model="scope.row.sort"
            style="width: 100px;"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column align="center" label="输入类型">
        <template slot-scope="scope">
          <el-select
            :disabled="
              (scope.$index < 4 && scope.row.fieldName === 'name') ||
                scope.row.fieldName === 'mobile' ||
                scope.row.fieldName === 'company' ||
                scope.row.fieldName === 'position'
            "
            v-model="scope.row.type"
            placeholder="请选择"
            size="small"
          >
            <el-option v-for="(item, i) in inputType" :key="i" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" placeholder="请输入内容" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" label="对应会员字段">
        <template slot-scope="scope">
          <el-input
            :disabled="
              (scope.$index < 4 && scope.row.fieldName === 'name') ||
                scope.row.fieldName === 'mobile' ||
                scope.row.fieldName === 'company' ||
                scope.row.fieldName === 'position'
            "
            v-model="scope.row.fieldName"
            placeholder="请输入内容"
            size="small"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" label="选项">
        <template slot-scope="scope">
          <el-input
            :disabled="scope.$index < 4 || (scope.row.type !== 2 && scope.row.type !== 3)"
            v-model="scope.row.options"
            :placeholder="scope.row.type == 2 || scope.row.type == 3 ? '备选项请用 ‘_’ 分隔' : '请输入内容'"
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
      <el-table-column align="center" label="显示报名项" width="100px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isSignShow"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100px">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="small"
            :disabled="
              (scope.$index < 4 && scope.row.fieldName === 'name') ||
                scope.row.fieldName === 'mobile' ||
                scope.row.fieldName === 'company' ||
                scope.row.fieldName === 'position'
            "
            @click="delDataSetting(scope.$index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-button style="margin: 20px auto 0;display: block;" icon="el-icon-plus" @click="addDataSetting()"
      >添加报名字段</el-button
    >
    <div
      style="display: inline-block; padding: 5px 10px 10px;margin-top: 10px;font-size: 14px;line-height: 1.5;color: #777;background: #F5F5F5;"
    >
      备注：<br />
      1.报名默认字段请不要随便修改，如需增加其他字段，请点击“新增”；<br />
      2.输入类型为单选或多选时，选项请以英文下划线“_”分隔；<br />
      3.已报名资料显示：关闭后，用户查看已报名名单则隐藏此字段；<br />
      4.报名字段：关闭后，用户报名是则会隐藏此字段，无需填写
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //#region 活动配置
      signDataSettingList: [],
      inputType: [
        { name: '文本', value: 1 },
        { name: '单选', value: 2 },
        { name: '多选', value: 3 }
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
        text: ''
      },
      configSignSubscribe: {
        id: '',
        key: 'activity_sign_subscribe_id',
        value: '',
        loading: true
      },
      digImgWrap: false,
      activitySignSuccess: {},
      //#endregion
      //#region 活动排序
      orderModel: {
        name: '移动端活动排序方式'
      }
      //#endregion
    }
  },
  created() {
    this.dataLoading = true
    this.getSignDataSetting()
    this.activityOrderTypeGet()
    this.activitySignSuccessGet()
    // 报名成功模板ID
    this.getConfig('activity_sign_subscribe_id')
  },
  methods: {
    // #region 活动报名配置
    async getSignDataSetting() {
      let res = await this.$http.getSignDataSetting()
      this.signDataSettingList = res.data.data || []
      this.dataLoading = false
    },
    check() {
      for (let i = 0, len = this.signDataSettingList.length; i < len; i++) {
        let item = this.signDataSettingList[i]
        if (item.type === 2 || item.type === 3) {
          for (let key in item) {
            if (item[key] === null || item[key] === '') {
              this.$message({
                message: '请将数据输入完整',
                type: 'warning'
              })
              return true
            }
          }
        } else {
          for (let key in item) {
            if (item[key] === null || (item[key] === '' && key !== 'options')) {
              this.$message({
                message: '请将数据输入完整',
                type: 'warning'
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
        await this.$http.saveSignDataSetting(this.signDataSettingList)
        this.loading = false
        this.$message.success('保存成功')
        this.getSignDataSetting()
      } catch (err) {
        this.loading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true)
        }
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
        isSignShow: true,
        isShow: true
      }
      this.signDataSettingList.push(data)
    },
    delDataSetting(i) {
      this.signDataSettingList.splice(i, 1)
    },
    // #endregion
    // #region 活动排序
    async activityOrderTypeGet() {
      let res = await this.$http.activityOrderTypeGet()
      this.orderModel = res.data.data || this.orderModel
    },
    async activityOrderTypePost() {
      await this.$http.activityOrderTypePost(this.orderModel)
      this.$message.success('保存成功')
    },
    //#endregion
    //#region 活动报名成功配置
    saveSign() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.activitySignSuccess.value = this.model.imgUrl + ',' + this.model.text
          this.activitySignSuccessPost()
        } else {
          return false
        }
      })
    },
    async activitySignSuccessGet() {
      let res = await this.$http.activitySignSuccessGet()
      if (res.data.data) {
        this.activitySignSuccess = res.data.data
        let value = this.activitySignSuccess.value.split(',')
        this.model.imgUrl = value[0]
        this.model.text = value[1]
      }
      this.dataLoading = false
    },
    async activitySignSuccessPost() {
      this.loading = true
      try {
        await this.$http.activitySignSuccessPost(this.activitySignSuccess)
        this.loading = false
        this.$message.success('保存成功')
        this.activitySignSuccessGet()
      } catch (err) {
        this.loading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true)
        }
      }
    },
    // 报名成功订阅消息ID配置 开始
    async getConfig(key) {
      try {
        let res = await this.$http.getConfigByKey(key)
        if (key === 'activity_sign_subscribe_id') {
          this.configSignSubscribe = res.data.data || {
            id: '',
            key: 'activity_sign_subscribe_id',
            value: '',
            loading: false
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    saveSignSubscribe() {
      this.$refs.configSignSubscribe.validate((valid) => {
        if (valid) {
          let apiName = 'updateConfig'
          this.configSignSubscribe.loaidng = true
          // 没有ID就调用新增接口
          if (!this.configSignSubscribe.id) {
            apiName = 'insertConfig'
            // 新增接口需要传appId，（登录页面登录成功后会存到localStorage）
            let user = localStorage.getItem('user')
            this.configSignSubscribe.appId = user.app.appId
          }
          this.$http[apiName](this.configSignSubscribe)
            .then(() => {
              this.configSignSubscribe.loaidng = false
              this.$message.success('保存成功')
            })
            .catch(() => {
              this.configSignSubscribe.loaidng = false
            })
        } else {
          return false
        }
      })
    }
    // 报名成功订阅消息ID配置 结束
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  background: #fff;
  padding: 20px;
}
</style>
