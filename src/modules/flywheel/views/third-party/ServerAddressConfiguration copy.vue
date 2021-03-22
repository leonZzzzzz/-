<template>
  <div class="domain-wrap">
    <div class="domain-title">
      <p>服务器配置</p>
      <p>操作</p>
    </div>
    <div style="display: flex;justify-content: space-between;align-items: center;">
      <div>
        <div class="domain-list">
          <p class="domain-list__title">request合法域名</p>
          <ul class="domain-list__value">
            <li v-for="(item, index) in list.requestdomain" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="domain-list">
          <p class="domain-list__title">socket合法域名</p>
          <ul class="domain-list__value">
            <li v-for="(item, index) in list.wsrequestdomain" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="domain-list">
          <p class="domain-list__title">uploadFile合法域名</p>
          <ul class="domain-list__value">
            <li v-for="(item, index) in list.uploaddomain" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="domain-list">
          <p class="domain-list__title">downloadFile合法域名</p>
          <ul class="domain-list__value">
            <li v-for="(item, index) in list.downloaddomain" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>
      <el-button type="text" style="margin-right:15px" @click="onDialogShow">修改</el-button>
    </div>
    <el-dialog :visible="visible" width="720px" title="配置服务器信息" append-to-body>
      <p>
        服务器域名需经过ICP备案，新备案域名需24小时后才可配置。域名格式只支持英文大小写字母、数字及“-”，
      </p>
      <p>不支持IP地址。如果没有服务器与域名，可前往腾讯云购买。</p>
      <br /><br />
      <el-form label-position="left" label-width="180px">
        <el-form-item
          :label="index == 0 ? 'request合法域名' : ''"
          v-for="(item, index) in model.requestdomain"
          :key="'a' + index"
        >
          <el-input
            style="width: 400px;margin-right:15px;"
            v-model="model.requestdomain[index]"
            @blur="onChangeDomain('requestdomain', index)"
          ></el-input>
          <i
            style="font-size: 25px;vertical-align: middle;"
            v-if="index == 0"
            class="el-icon-circle-plus-outline"
            @click="addDomain('requestdomain')"
          ></i>
          <i
            style="font-size: 25px;color:#ff5433;vertical-align: middle;"
            v-else
            class="el-icon-remove-outline"
            @click="removeDomain('requestdomain', index)"
          ></i>
        </el-form-item>
        <el-form-item
          :label="index == 0 ? 'socket合法域名' : ''"
          v-for="(item, index) in model.wsrequestdomain"
          :key="'b' + index"
        >
          <el-input
            style="width: 400px;margin-right:15px;"
            v-model="model.wsrequestdomain[index]"
            @blur="onChangeDomain('wsrequestdomain', index)"
          ></el-input>
          <i
            style="font-size: 25px;vertical-align: middle;"
            v-if="index == 0"
            class="el-icon-circle-plus-outline"
            @click="addDomain('wsrequestdomain')"
          ></i>
          <i
            style="font-size: 25px;color:#ff5433;vertical-align: middle;"
            v-else
            class="el-icon-remove-outline"
            @click="removeDomain('wsrequestdomain', index)"
          ></i>
        </el-form-item>
        <el-form-item
          :label="index == 0 ? 'uploadFile合法域名' : ''"
          v-for="(item, index) in model.uploaddomain"
          :key="'c' + index"
        >
          <el-input
            style="width: 400px;margin-right:15px;"
            v-model="model.uploaddomain[index]"
            @blur="onChangeDomain('uploaddomain', index)"
          ></el-input>
          <i
            style="font-size: 25px;vertical-align: middle;"
            v-if="index == 0"
            class="el-icon-circle-plus-outline"
            @click="addDomain('uploaddomain')"
          ></i>
          <i
            style="font-size: 25px;color:#ff5433;vertical-align: middle;"
            v-else
            class="el-icon-remove-outline"
            @click="removeDomain('uploaddomain', index)"
          ></i>
        </el-form-item>
        <el-form-item
          :label="index == 0 ? 'downloadFile合法域名' : ''"
          v-for="(item, index) in model.downloaddomain"
          :key="'d' + index"
        >
          <el-input
            style="width: 400px;margin-right:15px;"
            v-model="model.downloaddomain[index]"
            @blur="onChangeDomain('downloaddomain', index)"
          ></el-input>
          <i
            style="font-size: 25px;vertical-align: middle;"
            v-if="index == 0"
            class="el-icon-circle-plus-outline"
            @click="addDomain('downloaddomain')"
          ></i>
          <i
            style="font-size: 25px;color:#ff5433;vertical-align: middle;"
            v-else
            class="el-icon-remove-outline"
            @click="removeDomain('downloaddomain', index)"
          ></i>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      list: {},
      model: {}
    }
  },
  created() {
    this.getDomain()
  },
  methods: {
    addDomain(type) {
      this.model[type].push('')
    },
    onChangeDomain(type, index) {
      let model = { action: 'set' }
      model[type] = this.model[type][index]
      this.$http.postDomain(model).then(() => {})
    },
    removeDomain(type, index) {
      let url = this.model[type][index]
      if (url) {
        let model = { action: 'delete' }
        model[type] = url
        this.$http.postDomain(model).then(() => {
          this.model[type].splice(index, 1)
        })
      } else {
        this.model[type].splice(index, 1)
      }
    },
    onDialogShow() {
      this.model = JSON.parse(JSON.stringify(this.list))
      this.visible = true
    },
    getDomain() {
      this.$http.getDomain().then((res) => {
        let { requestdomain, wsrequestdomain, uploaddomain, downloaddomain } = res.data.data
        this.$set(this.list, 'requestdomain', this.hasValue(requestdomain))
        this.$set(this.list, 'wsrequestdomain', this.hasValue(wsrequestdomain))
        this.$set(this.list, 'uploaddomain', this.hasValue(uploaddomain))
        this.$set(this.list, 'downloaddomain', this.hasValue(downloaddomain))
        console.log(this.list)
      })
    },
    hasValue(data) {
      return data.length > 0 ? data : ['']
    }
  }
}
</script>

<style lang="scss" scoped>
.domain-wrap {
  .domain-title {
    display: flex;
    justify-content: space-between;
    padding: 12px 15px;
    font-size: 14px;
    color: #9a9a9a;
    background: #f6f8f9;
  }
  padding: 20px;
  .domain-list {
    display: flex;
    align-items: center;
    color: #353535;
    font-size: 14px;
    padding: 0 15px;
    margin-top: 20px;
    &__title {
      width: 180px;
    }
  }
}
</style>
