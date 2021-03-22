<template>
  <div class="register-config">
    <div class="title">注册配置</div>
    <!-- <ConfigItem name="是否需注册审核" form="switch" type="REGISTER_AUDIT" /> -->
    <ConfigItem name="会员验证背景图" form="img" type="AUTHENTICATE_BG" />
    <!-- <ConfigItem name="会员审核背景图" form="img" type="AUDIT_BG" /> -->
    <ConfigItem name="会员注册引导语" type="GUIDE" />
    <br /><br /><br />
    <div class="title">注册认证配置</div>
    <el-button v-if="showInit" @click="initCowebCheck()" style="margin:30px 0">初始化配置</el-button>
    <div class="radio-obx" v-else>
      <el-switch
        :disabled="open_register.value == 0"
        v-model="is_need_audit.value"
        inactive-value="0"
        active-value="1"
        @change="updateConfig('is_need_audit')"
      ></el-switch>
      <div style="margin: 10px 0">需要认证的情况下，用户必须填写系统中包含的用户信息进行认证后才能使用系统</div>
      <el-switch
        :disabled="is_need_audit.value == 0"
        v-model="open_register.value"
        inactive-value="0"
        active-value="1"
        @change="updateConfig('open_register')"
      ></el-switch>
      <div style="margin: 10px 0">开放注册的情况下，新用户可以自主填写信息进行注册后使用系统</div>
    </div>
    <div class="form-intro">
      <div class="title">字段表单</div>
      <p>资料：是否需要开放此此项资料，学员资料导入导出将根据此设置改变</p>
      <p>认证：需要认证的情况下，开启的项将展示给学员填写进行认证</p>
      <p>注册：开放注册的情况下，开启的项将展示给学员填写进行注册</p>
      <p>必填：开启必填的项如果没有填写，将提示需要填写，才能提交</p>
    </div>
    <div class="register-config__table-box">
      <el-table :data="list" header-row-class-name="header">
        <el-table-column prop="seqNum" label="排序" align="center" width="230px">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.seqNum" />
          </template>
        </el-table-column>
        <el-table-column prop="fieldName" label="字段名" align="center"></el-table-column>
        <el-table-column prop="showName" label="显示名称" align="center" width="230px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.showName" />
          </template>
        </el-table-column>
        <el-table-column prop="isNeed" label="资料" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isNeed" :disabled="scope.row.fieldId === 'phone'"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="authenticate"
          label="认证"
          align="center"
          v-if="is_need_audit.value === '1' && open_register.value === '0'"
        >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.authenticate" :disabled="scope.row.fieldId === 'phone'"></el-switch>
          </template>
        </el-table-column>
        <template v-else>
          <el-table-column prop="register" label="注册" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.register" :disabled="scope.row.fieldId === 'phone'"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="required" label="必填" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.required" :disabled="scope.row.fieldId === 'phone'"></el-switch>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div class="save-btn">
      <el-button type="primary" @click="handleSumbit()" :loading="loading">保存</el-button>
    </div>
  </div>
</template>

<script>
import api from 'apiSchool/common'
import ConfigItem from '../ConfigItem'
export default {
  components: {
    ConfigItem
  },
  data() {
    return {
      showInit: false,
      loading: false,
      cowebCheck: {},
      is_need_audit: {
        name: '需要认证',
        key: 'is_need_audit',
        showType: '0',
        type: '10',
        value: '0',
        seqNum: '',
        isShow: 'true'
      },
      open_register: {
        name: '开放注册',
        key: 'open_register',
        showType: '0',
        type: '10',
        value: '0',
        seqNum: '',
        isShow: 'true'
      },
      list: []
    }
  },
  created() {
    this.getConfig('is_need_audit')
    this.getConfig('open_register')
    this.contactsSettingGet()
  },
  methods: {
    handleChange(e) {
      if (e == 2) {
        this.list.map(item => {
          if (item.fieldId === 'year' || item.fieldId === 'degreeName' || item.fieldId === 'departmentName') {
            item.register = true
            item.required = true
          }
        })
        console.log(this.list)
      }
    },
    async contactsSettingGet() {
      const res = await api.contactsSettingGet()
      this.list = res.data.data
      if (this.list.length == 0) {
        this.showInit = true
      }
    },
    async initCowebCheck() {
      const res = await api.initCowebCheck()
      this.getCowebCheck()
      this.contactsSettingGet()
    },
    getConfig(type) {
      this.$http.get(`api/admin/v1/config/${type}`).then(res => {
        this[type] = Object.assign(this[type], res.data.data)
      })
    },
    updateConfig(type) {
      if (this[type].id) {
        api.updateConfig(this[type]).then(() => {
          this.$message.success('保存成功')
          this.getConfig(type)
        })
      } else {
        api.insertConfig(this[type]).then(() => {
          this.$message.success('保存成功')
          this.getConfig(type)
        })
      }
    },
    handleSumbit() {
      this.loading = true
      this.updateCowebCheck()
      this.contactsSettingSave()
    },
    async updateCowebCheck() {
      try {
        await api.updateCowebCheck(this.cowebCheck)
        this.getCowebCheck()
      } catch (err) {}
    },
    async contactsSettingSave() {
      try {
        await api.contactsSettingSave(this.list)
        this.$message.success('更新成功')
        this.loading = false
        this.contactsSettingGet()
      } catch (err) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.register-config {
  background: #fff;
  padding: 30px 50px;
  .title {
    font-size: 18px;
  }
  .radio-obx {
    padding: 20px 0;
    .radio-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      font-size: 14px;
      .name {
        font-size: 16px;
        margin-right: 20px;
      }
    }
  }
  .form-intro {
    font-size: 14px;
    line-height: 2;
    color: rgb(95, 95, 95);
    .title {
      font-size: 16px;
      color: #000;
    }
  }
  .register-config__table-box {
    margin-top: 20px;
    .header th {
      background: rgb(236, 236, 236) !important;
    }
  }
  .save-btn {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
