<template>
  <QcNavigationPage content="会费配置" class="prodocu-page" full>
    <el-form ref="model" label-position="top">
      
      <QcTitle title="基本设置">
        <el-form-item label="个人中心会费缴纳提示语">
          <el-input v-model="memberLevelFeeTips" placeholder="请输入(限40字内）" maxlength="40" show-word-limit style="width: 370px;margin-right: 15px;"></el-input>
          <el-popover
            placement="right"
            width="300"
            trigger="hover">
            <img width="290" src="./tips.jpg"  alt="" />
            <i slot="reference" icon="el-icon-question"></i>
          </el-popover>
          <el-button type="primary" @click="saveTips">保存</el-button>
        </el-form-item>
        <el-form-item label="会员权益介绍">
          <Editor v-model="model.content"></Editor>
          <el-button type="primary" @click="memberFeesSetInfo" style="margin: 10px 0 20px 0;">保存</el-button>
        </el-form-item>
      </QcTitle>
      <QcTitle title="其他设置">
        <el-form-item :label="memberFeesPayConfig.name || '购买时是否填写资料'">
          <el-switch
            v-model="memberFeesPayConfig.value"
            active-color="#13ce66"
            inactive-color="#ccc"
            active-value="1"
            inactive-value="0"
            @change="() => saveConfigByKey(memberFeesPayConfig)">
          </el-switch>
        </el-form-item>
        <el-form-item :label="memberFeesShowCityConfig.name || '购买时是否显示选择城市'">
          <el-switch
            v-model="memberFeesShowCityConfig.value"
            active-color="#13ce66"
            inactive-color="#ccc"
            active-value="1"
            inactive-value="0"
            @change="() => saveConfigByKey(memberFeesShowCityConfig)">
          </el-switch>
        </el-form-item>
        <el-form-item :label="memberFeesWechat.name || '是否开启微信支付'">
          <el-switch
            v-model="memberFeesWechat.value"
            active-color="#13ce66"
            inactive-color="#ccc"
            active-value="1"
            inactive-value="0"
            @change="switchWechat">
          </el-switch>
        </el-form-item>
        <el-form-item :label="memberFeesPublic.name || '是否开启对公收款'">
          <el-switch
            v-model="memberFeesPublic.value"
            active-color="#13ce66"
            inactive-color="#ccc"
            active-value="1"
            inactive-value="0"
            @change="switchsPublic">
          </el-switch>
        </el-form-item>
        <el-form-item label="对公收款信息" v-show="memberFeesPublic.value === '1'">
          <Editor v-model="memberFeesPublicInfo"></Editor>
          <el-button type="primary" @click="setPublicInfo" style="margin: 10px 0 20px 0;">保存</el-button>
        </el-form-item>
      </QcTitle>
    </el-form>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      info: '',
      model: {
        content: ''
      },
      // 开通会费提示语
      memberLevelFeeTips: '',
      // 微信支付开关
      memberFeesWechat: {
        name: '是否开启微信支付',
        showValue: '是否开启微信支付',
        key: 'memberLevelFeeWeChat',
        isShow: true,
        value: '1',
        seqNum: 0,
        type: '',
        showType: '',
      },
      // 对公开关
      memberFeesPublic: {
        name: '是否开启对公收款',
        showValue: '是否开启对公收款',
        key: 'memberLevelFeePublic',
        isShow: true,
        value: '0',
        seqNum: 0,
        type: '',
        showType: '',
      },
      // 对公介绍
      memberFeesPublicInfo: '',
      dataLoading: false,
      memberFeesPayConfig: {},
      memberFeesShowCityConfig: {},
    }
  },
  created() {
    this.getTips()
    this.memberFeesGetInfo()
    this.getWechat()
    this.getPublic()
    this.getPublicInfo()
    this.getConfigBykey('is_open_collect_material')
    this.getConfigBykey('is_member_show_city')
  },
  methods: {
    getConfigBykey(key) {
      // 购买会员时是否需要录入资料: is_open_collect_material
      // 购买会员时是否需要显示选城市字段: is_member_show_city
      if (!key) return this.$message.warning('尚未配置，请联系管理员配置')
      this.$http.getConfigByKey(key).then(res => {
        if (res.data.data) {
          switch(key) {
            case 'is_open_collect_material': 
              this.memberFeesPayConfig = res.data.data
              break;
            case 'is_member_show_city': 
              this.memberFeesShowCityConfig = res.data.data
              break;
          }
        }
      })
    },
    // 保存设置
    async saveConfigByKey(data) {
      if (!data || !data.key) return this.$message.warning('尚未配置，请联系管理员配置')
      try {
        await this.$http.updateConfig(data)
        this.$message.success('设置成功')
        this.getConfigBykey(data.key)
      } catch (err) {
        console.log(err)
      }
    },
    //获取开通会费提示语
    async getTips() {
      try {
        let res = await this.$http.getMemberFeesSaveTips()
        this.memberLevelFeeTips = res.data.message || ''
      } catch (err) {
        console.log(err)
      }
    },
    //保存开通会费提示语
    async saveTips() {
      try {
        await this.$http.memberFeesSaveTips({value: this.memberLevelFeeTips})
        this.$message.success('保存成功')
        this.getTips()
      } catch (err) {
        console.log(err)
      }
    },
    //获取会费介绍
    async memberFeesGetInfo() {
      try {
        let res = await this.$http.memberFeesGetInfo()
        this.model.content = res.data.message || ''
      } catch (err) {
        console.log(err)
      }
    },
    // 设置会费介绍
    async memberFeesSetInfo() {
      try {
        await this.$http.memberFeesSetInfo({contentStr: this.model.content})
        this.$message.success('保存成功')
      } catch (err) {
        console.log(err)
      }
    },
    // 获取微信支付
    async getWechat() {
      try {
        console.log(this.$http)
        let res = await this.$http.memberFeesGetWechat()
        if (!res.data.data) {
          // this.switchWechat()
          this.memberFeesWechat.value = '0'
          return
        }
        this.memberFeesWechat = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 设置微信支付开关
    async switchWechat() {
      try {
        await this.$http.memberFeesWechat(this.memberFeesWechat)
        this.$message.success('设置成功')
        this.getWechat()
      } catch (err) {
        console.log(err)
      }
    },
    // 获取对公收款介绍
    async getPublicInfo() {
      try {
        let res = await this.$http.memberFeesGetPublic()
        this.memberFeesPublicInfo = res.data.message || ''
      } catch (err) {
        console.log(err)
      }
    },
    // 设置对公收款介绍
    async setPublicInfo() {
      try {
        await this.$http.memberFeesSetPublic({contentStr: this.memberFeesPublicInfo})
        this.$message.success('保存成功')
      } catch (err) {
        console.log(err)
      }
    },
    // 获取对公收款开关
    async getPublic() {
      try {
        let res = await this.$http.memberFeesGetPublicState()
        if (!res.data.data) {
          // this.switchsPublic()
          this.memberFeesPublic.value = '0'
          return
        }
        this.memberFeesPublic = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 设置对公收款开关
    async switchsPublic() {
      try {
        await this.$http.memberFeesPublic(this.memberFeesPublic)
        this.$message.success('设置成功')
        this.getPublic()
      } catch (err) {
        console.log(err)
      }
    },
  }
}
</script>
