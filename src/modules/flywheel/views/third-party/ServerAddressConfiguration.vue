<template>
  <div class="domain-wrap">
    <div class="domain-title">
      <p>服务器配置</p>
      <p>操作</p>
    </div>
    <div class="domain-list" v-for="(item, key) in domain" :key="key">
      <p class="domain-list__title">{{ key }}合法域名</p>
      <ul class="domain-list__value">
        <template v-if="list[item].length > 0">
          <li class="domain-list__value-li" v-for="(url, index) in list[item]" :key="index">
            <div>{{ url }}</div>
            <div>
              <el-button type="text" v-if="index == 0" @click="onDialogShow('add', item)">
                添加
              </el-button>
              <el-button type="text" @click="onDialogShow('set', item, url)">
                修改
              </el-button>
              <el-button type="text" @click="removeDomain(item, index)">
                删除
              </el-button>
            </div>
          </li>
        </template>
        <li class="domain-list__value-li" v-else>
          <div></div>
          <div>
            <el-button type="text" @click="onDialogShow('add', item)">
              添加
            </el-button>
          </div>
        </li>
      </ul>
    </div>
    <el-dialog :visible="visible" width="420px" title="配置服务器信息" append-to-body :before-close="onDialogClose">
      <el-form label-position="left" label-width="100px">
        <el-form-item label="域名地址">
          <el-input v-model="model">
            <template slot="prepend">https://</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="postDomain()" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      loading: false,
      list: {
        requestdomain: [],
        wsrequestdomain: [],
        uploaddomain: [],
        downloaddomain: []
      },
      model: '',
      domain: {
        request: 'requestdomain',
        socket: 'wsrequestdomain',
        uploadFile: 'uploaddomain',
        downloadFile: 'downloaddomain'
      }
    }
  },
  created() {
    this.getDomain()
  },
  methods: {
    postDomain() {
      let model = { action: this.action }
      model[this.type] = this.model
      this.$http.postDomain(model).then(() => {
        this.$message.success('保存成功')
        this.getDomain()
        this.onDialogClose()
      })
    },
    removeDomain(type, index) {
      let model = { action: 'delete' }
      model[type] = this.list[type][index]
      this.$http.postDomain(model).then(() => {
        this.getDomain()
      })
    },
    onDialogShow(action, type, value) {
      if (action == 'set') {
        this.model = value.replace('https://', '')
      } else {
        this.model = value
      }
      this.type = type
      this.action = action
      this.visible = true
    },
    onDialogClose() {
      this.model = ''
      this.visible = false
    },
    getDomain() {
      this.$http.getDomain().then((res) => {
        this.list = res.data.data
      })
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
    &__value {
      flex: 1;
      &-li {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
